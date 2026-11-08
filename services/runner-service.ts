import { spawn, ChildProcess } from 'child_process';
import path from 'path';
import fs from 'fs';
import { RunResult, RunnerConfig } from '../src/types.js';

const BUILDS_BASE_DIR = '/tmp/turbocode_builds';

// Active running child processes mapped by execution ID
const activeProcesses = new Map<string, { process: ChildProcess; startTime: number }>();

/**
 * Executes a compiled binary with isolated environment, timeout, and STDIN input
 */
export async function runExecutable(
  executableId: string,
  stdinInput: string = '',
  config: RunnerConfig
): Promise<RunResult> {
  const buildDir = path.join(BUILDS_BASE_DIR, executableId);
  const binaryPath = path.join(buildDir, 'program.out');

  if (!fs.existsSync(binaryPath)) {
    return {
      success: false,
      stdout: '',
      stderr: 'Executable binary not found or compilation was not completed.',
      exitCode: 1,
      durationMs: 0,
      timedOut: false,
    };
  }

  // Ensure execution permissions on Linux
  try {
    fs.chmodSync(binaryPath, 0o755);
  } catch (err) {
    // ignore
  }

  const timeoutMs = Math.min(Math.max(config.timeoutMs || 5000, 500), 30000); // between 500ms and 30s
  const executionId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  return new Promise<RunResult>((resolve) => {
    const startTime = Date.now();
    let stdoutData = '';
    let stderrData = '';
    let timedOut = false;
    let killedManually = false;
    const maxOutputBytes = 256 * 1024; // 256 KB max console buffer to prevent browser freeze

    // Spawn process in build dir
    const child = spawn(binaryPath, [], {
      cwd: buildDir,
      env: {
        PATH: process.env.PATH || '/usr/local/bin:/usr/bin:/bin',
        LANG: 'C.UTF-8',
        LC_ALL: 'C.UTF-8',
      },
    });

    activeProcesses.set(executionId, { process: child, startTime });

    // Enforce timeout
    const timer = setTimeout(() => {
      timedOut = true;
      try {
        child.kill('SIGKILL');
      } catch {
        // ignore
      }
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdoutData.length < maxOutputBytes) {
        stdoutData += chunk.toString('utf-8');
        if (stdoutData.length >= maxOutputBytes) {
          stdoutData += '\n[OUTPUT TRUNCATED: Exceeded 256KB buffer limit]';
        }
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderrData.length < maxOutputBytes) {
        stderrData += chunk.toString('utf-8');
      }
    });

    // Provide STDIN input
    if (stdinInput && stdinInput.length > 0) {
      try {
        child.stdin.write(stdinInput);
        if (!stdinInput.endsWith('\n')) {
          child.stdin.write('\n');
        }
        child.stdin.end();
      } catch (err) {
        // stdin might have closed early
      }
    } else {
      try {
        child.stdin.end();
      } catch {
        // ignore
      }
    }

    child.on('error', (err: Error) => {
      clearTimeout(timer);
      activeProcesses.delete(executionId);
      const durationMs = Date.now() - startTime;
      resolve({
        success: false,
        stdout: stdoutData,
        stderr: `Process initialization error: ${err.message}`,
        exitCode: 1,
        durationMs,
        timedOut: false,
      });
    });

    child.on('close', (code: number | null, signal: NodeJS.Signals | null) => {
      clearTimeout(timer);
      activeProcesses.delete(executionId);
      const durationMs = Date.now() - startTime;

      let runtimeNotes = '';
      if (timedOut) {
        runtimeNotes += `\n[Execution Terminated: Exceeded time limit of ${timeoutMs / 1000}s]`;
      } else if (signal === 'SIGSEGV') {
        runtimeNotes += '\n[Segmentation Fault (Core Dumped) - Invalid memory address access or null pointer dereference]';
      } else if (signal === 'SIGFPE') {
        runtimeNotes += '\n[Floating Point Exception - Division by zero or integer overflow]';
      } else if (signal === 'SIGABRT') {
        runtimeNotes += '\n[Process Aborted - Assertion failure or unhandled exception]';
      }

      if (runtimeNotes) {
        stderrData = (stderrData + runtimeNotes).trim();
      }

      resolve({
        success: code === 0 && !timedOut && !signal,
        stdout: stdoutData,
        stderr: stderrData,
        exitCode: code,
        signal: signal || undefined,
        durationMs,
        timedOut,
      });
    });
  });
}

/**
 * Stops all currently active executions or a specific execution
 */
export function stopAllExecutions(): { stoppedCount: number } {
  let count = 0;
  for (const [id, item] of activeProcesses.entries()) {
    try {
      item.process.kill('SIGKILL');
      count++;
    } catch {
      // ignore
    }
  }
  activeProcesses.clear();
  return { stoppedCount: count };
}
