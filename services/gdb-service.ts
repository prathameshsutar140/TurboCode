import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execPromise = promisify(exec);
const BUILDS_BASE_DIR = '/tmp/turbocode_builds';

export interface GdbInspectionResult {
  available: boolean;
  version?: string;
  disassembly?: string;
  symbolList?: string[];
  backtrace?: string;
  debugOutput?: string;
  error?: string;
}

/**
 * Checks GDB availability and version
 */
export async function checkGdbAvailable(): Promise<{ available: boolean; version?: string; path?: string }> {
  try {
    const { stdout } = await execPromise('gdb --version');
    const firstLine = stdout.split('\n')[0] || '';
    const whichRes = await execPromise('which gdb');
    return {
      available: true,
      version: firstLine,
      path: whichRes.stdout.trim(),
    };
  } catch (err: any) {
    return {
      available: false,
      version: undefined,
    };
  }
}

/**
 * Disassembles the main function or inspects debugging information using GDB
 */
export async function inspectWithGdb(executableId: string): Promise<GdbInspectionResult> {
  const gdbStatus = await checkGdbAvailable();
  if (!gdbStatus.available) {
    return {
      available: false,
      error: 'GDB is not installed or not found on the system PATH. Please install gdb to enable interactive assembly and crash dump analysis.',
    };
  }

  const buildDir = path.join(BUILDS_BASE_DIR, executableId);
  const binaryPath = path.join(buildDir, 'program.out');

  if (!fs.existsSync(binaryPath)) {
    return {
      available: true,
      error: 'Executable not found. Please compile the program first.',
    };
  }

  try {
    // 1. Get disassembly of main
    const disasmCmd = `gdb -batch -ex "file ${binaryPath}" -ex "disassemble main" -ex "quit"`;
    let disassembly = '';
    try {
      const { stdout } = await execPromise(disasmCmd, { timeout: 8000 });
      disassembly = stdout;
    } catch (e: any) {
      disassembly = e.stdout || 'Unable to disassemble main (is main defined?)';
    }

    // 2. Read symbols with nm or objdump if available
    let symbols: string[] = [];
    try {
      const { stdout: nmOut } = await execPromise(`nm --demangle ${binaryPath} | grep -E ' (T|t|D|d) ' | head -n 30`, { timeout: 5000 });
      symbols = nmOut.split('\n').filter(s => s.trim().length > 0);
    } catch {
      // nm might fail or binary stripped
    }

    // 3. Run brief debugging session with breakpoint at main
    const runDebugCmd = `gdb -batch -ex "file ${binaryPath}" -ex "break main" -ex "run" -ex "info locals" -ex "info registers" -ex "quit"`;
    let debugOutput = '';
    try {
      const { stdout } = await execPromise(runDebugCmd, { timeout: 8000 });
      debugOutput = stdout;
    } catch (e: any) {
      debugOutput = e.stdout || e.message || '';
    }

    return {
      available: true,
      version: gdbStatus.version,
      disassembly,
      symbolList: symbols,
      debugOutput,
    };
  } catch (err: any) {
    return {
      available: true,
      error: `GDB Inspection failed: ${err.message}`,
    };
  }
}
