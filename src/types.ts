export type ThemeMode = 'classic' | 'modern-dark' | 'modern-light';

export type LanguageStandard = 
  | 'c90' | 'c99' | 'c11' | 'c17'
  | 'c++11' | 'c++14' | 'c++17' | 'c++20';

export interface CompilerConfig {
  cCompiler: string;       // e.g. 'gcc'
  cppCompiler: string;     // e.g. 'g++'
  cStandard: string;       // e.g. 'c17'
  cppStandard: string;     // e.g. 'c++20'
  optimization: string;    // e.g. '-O0', '-O2'
  warningFlags: string[];  // e.g. ['-Wall', '-Wextra']
  customFlags: string;     // user entered extra flags
  includePaths: string[];
}

export interface RunnerConfig {
  timeoutMs: number;       // e.g. 5000
  memoryLimitMb: number;   // e.g. 128
  sandboxMode: 'restricted' | 'standard';
}

export interface IDESettings {
  theme: ThemeMode;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  compiler: CompilerConfig;
  runner: RunnerConfig;
  confirmBeforeClose: boolean;
}

export interface SourceFile {
  id: string;
  name: string;
  path: string;
  content: string;
  language: 'c' | 'cpp' | 'h' | 'hpp' | 'plaintext';
  isDirty?: boolean;
  isReadOnly?: boolean;
}

export interface DiagnosticItem {
  id: string;
  file: string;
  line: number;
  column: number;
  severity: 'error' | 'warning' | 'note' | 'fatal';
  message: string;
  codeSnippet?: string;
}

export interface CompileResult {
  success: boolean;
  executableId?: string;
  compilerOutput: string;
  commandExecuted: string;
  durationMs: number;
  diagnostics: DiagnosticItem[];
  compilerVersion?: string;
}

export interface RunResult {
  success: boolean;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  signal?: string | null;
  durationMs: number;
  timedOut: boolean;
  memoryUsedMb?: number;
}

export interface DetectedCompiler {
  name: string;
  type: 'c' | 'cpp' | 'debugger' | 'build';
  binary: string;
  path: string;
  version: string;
  available: boolean;
}

export interface ExampleProgram {
  id: string;
  title: string;
  category: 'C' | 'C++';
  subCategory: string;
  description: string;
  code: string;
  defaultInput?: string;
  expectedOutput?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  fileName: string;
  language: string;
  compileSuccess: boolean;
  durationMs?: number;
  compileDurationMs?: number;
  runDurationMs?: number;
  exitCode?: number | null;
  errorCount: number;
  warningCount: number;
  compilerOutput?: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  rootPath: string;
  type: 'c' | 'cpp';
  files: SourceFile[];
  mainFile: string;
}

export type AIAssistAction = 'explain_code' | 'explain_error' | 'optimize' | 'generate_practice';

export const DEFAULT_SETTINGS: IDESettings = {
  theme: 'classic',
  fontSize: 15,
  fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
  tabSize: 4,
  wordWrap: false,
  minimap: true,
  lineNumbers: true,
  autoSave: false,
  compiler: {
    cCompiler: 'gcc',
    cppCompiler: 'g++',
    cStandard: 'c17',
    cppStandard: 'c++20',
    optimization: '-O0',
    warningFlags: ['-Wall', '-Wextra'],
    customFlags: '',
    includePaths: [],
  },
  runner: {
    timeoutMs: 5000,
    memoryLimitMb: 128,
    sandboxMode: 'restricted',
  },
  confirmBeforeClose: true,
};

