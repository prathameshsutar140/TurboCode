import React, { useState } from 'react';
import {
  Terminal,
  AlertTriangle,
  FileText,
  Play,
  RotateCcw,
  Copy,
  Trash2,
  Download,
  ChevronDown,
  ChevronUp,
  Binary,
  Layers,
  Bug,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { CompileResult, RunResult, DiagnosticItem, ThemeMode } from '../types.js';

interface BottomPanelProps {
  theme: ThemeMode;
  activeTab: 'output' | 'stdin' | 'problems' | 'compiler-log' | 'gdb' | 'build-system';
  onTabChange: (tab: 'output' | 'stdin' | 'problems' | 'compiler-log' | 'gdb' | 'build-system') => void;
  compileResult: CompileResult | null;
  runResult: RunResult | null;
  stdinInput: string;
  onStdinChange: (val: string) => void;
  onRunAgain: () => void;
  onClearOutput: () => void;
  onNavigateToLine: (file: string, line: number, column: number) => void;
  gdbData: any;
  onInspectGdb: () => void;
  isInspectingGdb: boolean;
  cmakeData: { cmake: string; makefile: string } | null;
  onGenerateBuildSystem: () => void;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  theme,
  activeTab,
  onTabChange,
  compileResult,
  runResult,
  stdinInput,
  onStdinChange,
  onRunAgain,
  onClearOutput,
  onNavigateToLine,
  gdbData,
  onInspectGdb,
  isInspectingGdb,
  cmakeData,
  onGenerateBuildSystem,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const isClassic = theme === 'classic';
  const diagnostics = compileResult?.diagnostics || [];
  const errorCount = diagnostics.filter((d) => d.severity === 'error' || d.severity === 'fatal').length;
  const warningCount = diagnostics.filter((d) => d.severity === 'warning').length;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadOutput = () => {
    const text = `--- TURBOCODE IDE EXECUTION REPORT ---
Timestamp: ${new Date().toISOString()}
Exit Code: ${runResult?.exitCode ?? 'N/A'}
Duration: ${runResult?.durationMs ?? 0} ms
---------------------------------------
STDOUT:
${runResult?.stdout || '(No output)'}

STDERR:
${runResult?.stderr || '(No errors)'}
`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `turbocode_run_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`flex flex-col border-t transition-all z-10 ${
        isCollapsed ? 'h-8' : 'h-64 sm:h-72'
      } ${
        isClassic
          ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
          : theme === 'modern-dark'
          ? 'bg-[#18181b] text-zinc-300 border-zinc-800'
          : 'bg-zinc-100 text-zinc-800 border-zinc-300'
      }`}
    >
      {/* Panel Tab Header */}
      <div
        className={`flex items-center justify-between px-2 h-8 border-b text-xs select-none ${
          isClassic
            ? 'bg-[#000066] border-[#00aaaa]'
            : theme === 'modern-dark'
            ? 'bg-[#121215] border-zinc-800'
            : 'bg-zinc-200 border-zinc-300'
        }`}
      >
        <div className="flex items-center space-x-1 overflow-x-auto">
          {/* Output Tab */}
          <button
            onClick={() => { onTabChange('output'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'output' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-emerald-400'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Output Console</span>
            {runResult && (
              <span
                className={`text-[9px] px-1 rounded ${
                  runResult.success ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                {runResult.success ? 'EXIT 0' : `CODE ${runResult.exitCode ?? '!'}`}
              </span>
            )}
          </button>

          {/* STDIN Tab */}
          <button
            onClick={() => { onTabChange('stdin'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'stdin' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-blue-400'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>STDIN Input</span>
            {stdinInput.trim().length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>

          {/* Problems Tab */}
          <button
            onClick={() => { onTabChange('problems'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'problems' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-amber-400'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Problems</span>
            {(errorCount > 0 || warningCount > 0) && (
              <span
                className={`text-[9px] px-1 rounded font-bold ${
                  errorCount > 0 ? 'bg-rose-500/30 text-rose-400' : 'bg-amber-500/30 text-amber-400'
                }`}
              >
                {errorCount}E / {warningCount}W
              </span>
            )}
          </button>

          {/* Compiler Log Tab */}
          <button
            onClick={() => { onTabChange('compiler-log'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'compiler-log' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-zinc-200'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Compiler Output</span>
          </button>

          {/* GDB Debugger Inspector Tab */}
          <button
            onClick={() => { onTabChange('gdb'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'gdb' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-purple-400'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Bug className="w-3.5 h-3.5" />
            <span>GDB Inspector</span>
          </button>

          {/* CMake & Makefile Tab */}
          <button
            onClick={() => { onTabChange('build-system'); setIsCollapsed(false); }}
            className={`px-3 py-1 rounded-t flex items-center space-x-1.5 cursor-pointer font-medium transition-all ${
              activeTab === 'build-system' && !isCollapsed
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] font-bold border-t-2 border-[#ffff55]'
                  : 'bg-[#202024] text-cyan-400'
                : 'opacity-70 hover:opacity-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>CMake / Makefile</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1">
          {activeTab === 'output' && (
            <>
              <button
                onClick={() => handleCopy(runResult ? `${runResult.stdout}\n${runResult.stderr}` : '')}
                className="p-1 rounded hover:bg-black/20 cursor-pointer"
                title="Copy Console Output"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDownloadOutput}
                className="p-1 rounded hover:bg-black/20 cursor-pointer"
                title="Download Output to Text File"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onClearOutput}
                className="p-1 rounded hover:bg-black/20 cursor-pointer text-rose-400 hover:text-rose-300"
                title="Clear Console Output"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-black/20 cursor-pointer"
            title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
          >
            {isCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Panel Body */}
      {!isCollapsed && (
        <div className="flex-1 overflow-auto p-3 text-xs font-mono">
          {/* TAB: OUTPUT */}
          {activeTab === 'output' && (
            <div className="h-full flex flex-col justify-between space-y-2">
              <div className="flex-1 overflow-auto whitespace-pre-wrap select-text leading-relaxed">
                {runResult ? (
                  <div>
                    {runResult.stdout && (
                      <div className={isClassic ? 'text-[#ffffff]' : 'text-emerald-400'}>
                        {runResult.stdout}
                      </div>
                    )}
                    {runResult.stderr && (
                      <div className={`mt-1 font-semibold ${isClassic ? 'text-[#ff5555]' : 'text-rose-400'}`}>
                        {runResult.stderr}
                      </div>
                    )}
                    {runResult.timedOut && (
                      <div className="mt-2 p-1.5 bg-rose-500/20 text-rose-400 rounded border border-rose-500/40">
                        [PROCESS TERMINATED]: The program exceeded the configured execution timeout limit.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="opacity-40 italic">
                    Console output will appear here. Press Run (F5) or Compile & Run (F6) to execute your program.
                  </div>
                )}
              </div>

              {/* Status metrics footer */}
              {runResult && (
                <div
                  className={`pt-2 border-t flex flex-wrap items-center justify-between text-[11px] select-none ${
                    isClassic ? 'border-[#00aaaa] text-cyan-300' : 'border-zinc-800 text-zinc-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span>
                      Exit Code:{' '}
                      <strong className={runResult.exitCode === 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {runResult.exitCode ?? 'Terminated'}
                      </strong>
                    </span>
                    <span>
                      Duration: <strong>{runResult.durationMs} ms</strong>
                    </span>
                    {runResult.signal && (
                      <span className="text-rose-400">
                        Signal: <strong>{runResult.signal}</strong>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={onRunAgain}
                    className={`px-2 py-0.5 rounded cursor-pointer flex items-center space-x-1 ${
                      isClassic ? 'bg-[#00aaaa] text-black font-bold' : 'bg-blue-600 text-white'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Run Again</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: STDIN INPUT */}
          {activeTab === 'stdin' && (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between text-[11px] opacity-75">
                <span>Standard Input (STDIN) Stream for scanf() / std::cin:</span>
                <span className="text-[10px]">Buffered input passed into process on start</span>
              </div>
              <textarea
                value={stdinInput}
                onChange={(e) => onStdinChange(e.target.value)}
                placeholder="Type input data here (e.g., numbers separated by space or lines for scanf/cin)..."
                className={`flex-1 p-2 rounded outline-none resize-none text-xs ${
                  isClassic
                    ? 'bg-[#0000a8] text-[#ffff55] border-2 border-[#00aaaa] placeholder-cyan-500'
                    : 'bg-zinc-900 text-zinc-100 border border-zinc-700 placeholder-zinc-500'
                }`}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[11px]">
                  <span className="opacity-70">Presets:</span>
                  <button
                    onClick={() => onStdinChange('10 20')}
                    className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 cursor-pointer"
                  >
                    "10 20"
                  </button>
                  <button
                    onClick={() => onStdinChange('42')}
                    className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 cursor-pointer"
                  >
                    "42"
                  </button>
                  <button
                    onClick={() => onStdinChange('racecar')}
                    className="px-1.5 py-0.5 rounded bg-black/20 hover:bg-black/40 cursor-pointer"
                  >
                    "racecar"
                  </button>
                </div>
                <button
                  onClick={onRunAgain}
                  className={`px-3 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer font-bold ${
                    isClassic ? 'bg-[#55ff55] text-black' : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Execute with STDIN</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: PROBLEMS */}
          {activeTab === 'problems' && (
            <div className="h-full overflow-auto space-y-1.5">
              {diagnostics.length === 0 ? (
                <div className="p-4 text-center text-emerald-400 flex items-center justify-center space-x-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>No compilation errors or warnings detected! Clean build.</span>
                </div>
              ) : (
                diagnostics.map((diag) => (
                  <div
                    key={diag.id}
                    onClick={() => onNavigateToLine(diag.file, diag.line, diag.column)}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      diag.severity === 'error' || diag.severity === 'fatal'
                        ? isClassic
                          ? 'bg-[#a80000]/40 border-red-500 hover:bg-[#a80000]/60'
                          : 'bg-rose-950/40 border-rose-800 hover:bg-rose-900/40 text-rose-200'
                        : isClassic
                        ? 'bg-yellow-900/40 border-yellow-500 hover:bg-yellow-900/60'
                        : 'bg-amber-950/40 border-amber-800 hover:bg-amber-900/40 text-amber-200'
                    }`}
                    title="Click to jump to line in editor"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[9px] uppercase px-1.5 py-0.2 rounded font-bold ${
                            diag.severity === 'error' || diag.severity === 'fatal'
                              ? 'bg-rose-500 text-white'
                              : 'bg-amber-500 text-black'
                          }`}
                        >
                          {diag.severity}
                        </span>
                        <span className="font-bold underline">
                          {diag.file}:{diag.line}:{diag.column}
                        </span>
                      </div>
                      <span className="text-[10px] opacity-75">Click to Navigate</span>
                    </div>

                    <div className="mt-1 font-semibold">{diag.message}</div>

                    {diag.codeSnippet && (
                      <pre className="mt-1 p-1 bg-black/40 rounded text-[11px] overflow-x-auto text-yellow-300">
                        {diag.codeSnippet}
                      </pre>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: COMPILER LOG */}
          {activeTab === 'compiler-log' && (
            <div className="h-full flex flex-col space-y-2">
              {compileResult?.commandExecuted && (
                <div className="p-2 bg-black/30 rounded border border-white/10 select-text">
                  <div className="text-[10px] uppercase opacity-60">Command Line:</div>
                  <div className="text-yellow-400 font-bold">{compileResult.commandExecuted}</div>
                </div>
              )}
              <div className="flex-1 overflow-auto whitespace-pre-wrap select-text p-2 bg-black/20 rounded">
                {compileResult?.compilerOutput || 'No compiler messages available.'}
              </div>
            </div>
          )}

          {/* TAB: GDB INSPECTOR */}
          {activeTab === 'gdb' && (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs flex items-center space-x-1">
                  <Bug className="w-3.5 h-3.5 text-purple-400" />
                  <span>GDB Debugger Disassembly & Symbol Inspector</span>
                </span>
                <button
                  onClick={onInspectGdb}
                  disabled={isInspectingGdb || !compileResult?.executableId}
                  className={`px-3 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer font-bold ${
                    isClassic ? 'bg-[#ffff55] text-black' : 'bg-purple-600 text-white'
                  } ${isInspectingGdb || !compileResult?.executableId ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <span>{isInspectingGdb ? 'Analyzing...' : 'Inspect with GDB'}</span>
                </button>
              </div>

              {gdbData ? (
                <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 bg-black/30 rounded border border-white/10 overflow-auto">
                    <div className="text-[10px] uppercase text-cyan-400 font-bold mb-1">
                      Disassembly of main():
                    </div>
                    <pre className="text-[11px] whitespace-pre select-text text-zinc-300">
                      {gdbData.disassembly || 'No disassembly generated'}
                    </pre>
                  </div>
                  <div className="p-2 bg-black/30 rounded border border-white/10 overflow-auto">
                    <div className="text-[10px] uppercase text-purple-400 font-bold mb-1">
                      Exported Symbols:
                    </div>
                    <pre className="text-[11px] whitespace-pre select-text text-zinc-300">
                      {gdbData.symbolList?.join('\n') || 'No symbol metadata'}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center opacity-50 italic">
                  Compile your source code and click "Inspect with GDB" to inspect assembly instructions, stack frame, and CPU registers.
                </div>
              )}
            </div>
          )}

          {/* TAB: CMAKE & MAKEFILE */}
          {activeTab === 'build-system' && (
            <div className="h-full flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs">Build Automation Generator</span>
                <button
                  onClick={onGenerateBuildSystem}
                  className={`px-3 py-1 rounded text-xs cursor-pointer font-bold ${
                    isClassic ? 'bg-[#00aaaa] text-black' : 'bg-blue-600 text-white'
                  }`}
                >
                  Generate Files
                </button>
              </div>

              {cmakeData ? (
                <div className="flex-1 overflow-auto grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="p-2 bg-black/30 rounded border border-white/10 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] text-cyan-400">CMakeLists.txt</span>
                      <button
                        onClick={() => handleCopy(cmakeData.cmake)}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy CMakeLists.txt"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <pre className="flex-1 overflow-auto text-[11px] select-text">
                      {cmakeData.cmake}
                    </pre>
                  </div>

                  <div className="p-2 bg-black/30 rounded border border-white/10 flex flex-col">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] text-emerald-400">Makefile</span>
                      <button
                        onClick={() => handleCopy(cmakeData.makefile)}
                        className="p-1 hover:bg-white/10 rounded cursor-pointer"
                        title="Copy Makefile"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                    <pre className="flex-1 overflow-auto text-[11px] select-text">
                      {cmakeData.makefile}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center opacity-50 italic">
                  Click "Generate Files" to produce CMakeLists.txt and Makefile for your active C or C++ project.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
