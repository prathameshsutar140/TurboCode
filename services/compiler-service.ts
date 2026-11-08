import { execFile, exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { CompileResult, DiagnosticItem, DetectedCompiler, CompilerConfig } from '../src/types.js';

const execPromise = promisify(exec);
const execFilePromise = promisify(execFile);

const BUILDS_BASE_DIR = '/tmp/turbocode_builds';

// Ensure base build directory exists
if (!fs.existsSync(BUILDS_BASE_DIR)) {
  try {
    fs.mkdirSync(BUILDS_BASE_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create builds directory:', err);
  }
}

/**
 * Parses GCC and Clang diagnostic outputs into structured items
 */
export function parseDiagnostics(output: string, currentFileName: string): DiagnosticItem[] {
  const items: DiagnosticItem[] = [];
  const lines = output.split('\n');

  // Match pattern: file:line:col: (fatal error|error|warning|note): message
  // Example: main.c:6:5: error: expected ';' before 'return'
  // Or: main.cpp:12:10: warning: unused variable 'x' [-Wunused-variable]
  const regexWithCol = /^(.*?):(\d+):(\d+):\s*(fatal error|error|warning|note):\s*(.*)$/i;
  const regexWithoutCol = /^(.*?):(\d+):\s*(fatal error|error|warning|note):\s*(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    let match = line.match(regexWithCol);
    let filePath = '';
    let lineNum = 1;
    let colNum = 1;
    let severity: 'error' | 'warning' | 'note' | 'fatal' = 'error';
    let message = '';

    if (match) {
      filePath = match[1];
      lineNum = parseInt(match[2], 10);
      colNum = parseInt(match[3], 10);
      const sevStr = match[4].toLowerCase();
      severity = sevStr.includes('fatal') ? 'fatal' : (sevStr as 'error' | 'warning' | 'note');
      message = match[5];
    } else {
      match = line.match(regexWithoutCol);
      if (match) {
        filePath = match[1];
        lineNum = parseInt(match[2], 10);
        colNum = 1;
        const sevStr = match[3].toLowerCase();
        severity = sevStr.includes('fatal') ? 'fatal' : (sevStr as 'error' | 'warning' | 'note');
        message = match[4];
      }
    }

    if (match) {
      // Lookahead for code snippet caret if present in next line(s)
      let snippet = '';
      if (i + 1 < lines.length && !lines[i + 1].match(/:\d+:/)) {
        snippet = lines[i + 1];
        if (i + 2 < lines.length && lines[i + 2].includes('^')) {
          snippet += '\n' + lines[i + 2];
        }
      }

      items.push({
        id: `diag-${i}-${Date.now()}`,
        file: path.basename(filePath) || currentFileName,
        line: lineNum,
        column: colNum,
        severity,
        message,
        codeSnippet: snippet || undefined,
      });
    }
  }

  return items;
}

/**
 * Detects available compilers and tools
 */
export async function detectCompilers(): Promise<DetectedCompiler[]> {
  const tools = [
    { name: 'GCC C Compiler', binary: 'gcc', type: 'c' as const },
    { name: 'G++ C++ Compiler', binary: 'g++', type: 'cpp' as const },
    { name: 'Clang C Compiler', binary: 'clang', type: 'c' as const },
    { name: 'Clang++ C++ Compiler', binary: 'clang++', type: 'cpp' as const },
    { name: 'GDB Debugger', binary: 'gdb', type: 'debugger' as const },
    { name: 'GNU Make', binary: 'make', type: 'build' as const },
  ];

  const results: DetectedCompiler[] = [];

  for (const tool of tools) {
    try {
      const { stdout } = await execPromise(`${tool.binary} --version`);
      const firstLine = stdout.split('\n')[0] || '';
      
      let binPath = tool.binary;
      try {
        const whichRes = await execPromise(`which ${tool.binary}`);
        binPath = whichRes.stdout.trim();
      } catch {
        // keep tool.binary
      }

      results.push({
        name: tool.name,
        type: tool.type,
        binary: tool.binary,
        path: binPath,
        version: firstLine,
        available: true,
      });
    } catch {
      results.push({
        name: tool.name,
        type: tool.type,
        binary: tool.binary,
        path: '',
        version: 'Not found',
        available: false,
      });
    }
  }

  return results;
}

/**
 * Compiles single or multiple source files
 */
export async function compileSource(
  code: string,
  fileName: string,
  language: 'c' | 'cpp',
  config: CompilerConfig
): Promise<CompileResult> {
  const buildId = `build_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  const buildDir = path.join(BUILDS_BASE_DIR, buildId);
  fs.mkdirSync(buildDir, { recursive: true });

  const safeFileName = path.basename(fileName) || (language === 'c' ? 'main.c' : 'main.cpp');
  const sourceFilePath = path.join(buildDir, safeFileName);
  const outBinaryName = 'program.out';
  const outBinaryPath = path.join(buildDir, outBinaryName);

  // Write source code
  fs.writeFileSync(sourceFilePath, code, 'utf-8');

  // Choose compiler binary
  const compiler = language === 'c' 
    ? (config.cCompiler || 'gcc') 
    : (config.cppCompiler || 'g++');

  // Standards flag
  const stdFlag = language === 'c'
    ? `-std=${config.cStandard || 'c17'}`
    : `-std=${config.cppStandard || 'c++20'}`;

  // Build flags array
  const flags = [
    stdFlag,
    config.optimization || '-O0',
    ...(config.warningFlags || ['-Wall', '-Wextra']),
  ];

  // Include math library for C programs by default
  if (language === 'c') {
    flags.push('-lm');
  }

  // Include debug symbols for debugging inspect
  flags.push('-g');

  // Add custom user flags safely
  if (config.customFlags && config.customFlags.trim()) {
    const customParts = config.customFlags.trim().split(/\s+/);
    for (const part of customParts) {
      if (/^[a-zA-Z0-9_\-\.\/+=]+$/.test(part)) {
        flags.push(part);
      }
    }
  }

  // Compiler command invocation
  const args = [...flags, safeFileName, '-o', outBinaryName];
  const commandStr = `${compiler} ${args.join(' ')}`;

  const startTime = Date.now();
  let compilerOutput = '';
  let success = false;

  try {
    const { stdout, stderr } = await execFilePromise(compiler, args, {
      cwd: buildDir,
      timeout: 15000,
      maxBuffer: 2 * 1024 * 1024,
    });
    compilerOutput = (stdout + '\n' + stderr).trim();
    success = fs.existsSync(outBinaryPath);
  } catch (err: any) {
    success = false;
    compilerOutput = (err.stdout || '') + '\n' + (err.stderr || err.message || '');
    compilerOutput = compilerOutput.trim();
  }

  const durationMs = Date.now() - startTime;
  const diagnostics = parseDiagnostics(compilerOutput, safeFileName);

  return {
    success,
    executableId: success ? buildId : undefined,
    compilerOutput,
    commandExecuted: commandStr,
    durationMs,
    diagnostics,
  };
}
