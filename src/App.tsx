import React, { useState, useEffect, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { HeaderMenuBar } from './components/HeaderMenuBar.js';
import { Sidebar } from './components/Sidebar.js';
import { EditorTabs } from './components/EditorTabs.js';
import { BottomPanel } from './components/BottomPanel.js';
import { RightPanel } from './components/RightPanel.js';
import { StatusBar } from './components/StatusBar.js';
import { SettingsModal } from './components/SettingsModal.js';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal.js';
import { AboutModal } from './components/AboutModal.js';
import {
  ThemeMode,
  SourceFile,
  IDESettings,
  CompileResult,
  RunResult,
  DetectedCompiler,
  ExampleProgram,
  HistoryItem,
} from './types.js';
import { DEFAULT_SETTINGS } from '../services/storage-service.js';

const INITIAL_FILE: SourceFile = {
  id: 'file-1',
  name: 'main.cpp',
  path: '/workspace/main.cpp',
  language: 'cpp',
  isDirty: false,
  content: `// TurboCode IDE - Classic & Modern C/C++ Development Environment
#include <iostream>
#include <vector>
#include <string>

int main() {
    std::cout << "========================================" << std::endl;
    std::cout << "  TurboCode IDE: C/C++ Toolchain Active" << std::endl;
    std::cout << "  Real GCC/G++ Compiler & Sandbox Ready!" << std::endl;
    std::cout << "========================================" << std::endl;

    std::vector<std::string> features = {
        "Classic Borland Turbo C++ Blue Interface",
        "Modern VS Code Style Dark & Light Modes",
        "Real GCC/G++ Compilation with C17 & C++20",
        "Buffered STDIN Input & Real Runtime Metrics",
        "Parsed Compiler Diagnostics & Click Navigation",
        "GDB Debugger Disassembly & Symbol Inspector",
        "28 Built-in Practical Programs for Students"
    };

    for (size_t i = 0; i < features.size(); ++i) {
        std::cout << "  [" << (i + 1) << "] " << features[i] << std::endl;
    }

    std::cout << "\\nPress F2 or Alt+F9 to Compile, F5 to Run, or F6 for All-in-One!\\n";
    return 0;
}
`,
};

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>('classic');
  const [files, setFiles] = useState<SourceFile[]>([INITIAL_FILE]);
  const [activeFileId, setActiveFileId] = useState<string>(INITIAL_FILE.id);
  const [settings, setSettings] = useState<IDESettings>(DEFAULT_SETTINGS);
  const [compilers, setCompilers] = useState<DetectedCompiler[]>([]);
  const [examples, setExamples] = useState<ExampleProgram[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Compilation & Run states
  const [isCompiling, setIsCompiling] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [compileResult, setCompileResult] = useState<CompileResult | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [stdinInput, setStdinInput] = useState('');
  const [bottomTab, setBottomTab] = useState<'output' | 'stdin' | 'problems' | 'compiler-log' | 'gdb' | 'build-system'>('output');

  // GDB & CMake states
  const [gdbData, setGdbData] = useState<any>(null);
  const [isInspectingGdb, setIsInspectingGdb] = useState(false);
  const [cmakeData, setCmakeData] = useState<{ cmake: string; makefile: string } | null>(null);

  // Panels visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Editor cursor & active file
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const editorRef = useRef<any>(null);

  // AI Assistant state
  const [userConsentedAI, setUserConsentedAI] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const activeFile = files.find((f) => f.id === activeFileId) || files[0];

  // 1. Initial Data Fetch on Mount
  useEffect(() => {
    // Fetch compilers
    fetch('/api/compilers')
      .then((r) => r.json())
      .then((data) => {
        if (data.compilers) setCompilers(data.compilers);
      })
      .catch(() => {});

    // Fetch practical examples
    fetch('/api/examples')
      .then((r) => r.json())
      .then((data) => {
        if (data.examples) setExamples(data.examples);
      })
      .catch(() => {});

    // Fetch settings
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.theme) setTheme(data.settings.theme);
        }
      })
      .catch(() => {});

    // Fetch history
    fetch('/api/history')
      .then((r) => r.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
      })
      .catch(() => {});
  }, []);

  // 2. Global Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F2: Compile
      if (e.key === 'F2') {
        e.preventDefault();
        handleCompile();
      }
      // Alt+F9: Classic Turbo C++ Compile
      else if (e.altKey && e.key === 'F9') {
        e.preventDefault();
        handleCompile();
      }
      // F5: Run
      else if (e.key === 'F5' && !e.shiftKey) {
        e.preventDefault();
        handleRun();
      }
      // Ctrl+F9: Classic Turbo C++ Run
      else if (e.ctrlKey && e.key === 'F9') {
        e.preventDefault();
        handleRun();
      }
      // F6: Compile and Run
      else if (e.key === 'F6') {
        e.preventDefault();
        handleCompileAndRun();
      }
      // Shift+F5: Stop
      else if (e.shiftKey && e.key === 'F5') {
        e.preventDefault();
        handleStop();
      }
      // Ctrl+S: Save
      else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSaveFile();
      }
      // Ctrl+N: New C File
      else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        handleNewFile('c');
      }
      // F1: Help / Shortcuts
      else if (e.key === 'F1') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
      // Ctrl+`: Toggle Bottom Panel
      else if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setBottomTab((prev) => (prev === 'output' ? 'problems' : 'output'));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeFile, compileResult, isCompiling, isRunning, settings]);

  // 3. Monaco Editor Mount & Custom Turbo C++ Theme Configuration
  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Define Classic Borland Turbo C++ Monaco Theme
    monaco.editor.defineTheme('turbo-classic', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: '', background: '0000a8', foreground: 'ffffff' },
        { token: 'keyword', foreground: 'ffff55', fontStyle: 'bold' },
        { token: 'keyword.c', foreground: 'ffff55', fontStyle: 'bold' },
        { token: 'keyword.cpp', foreground: 'ffff55', fontStyle: 'bold' },
        { token: 'comment', foreground: '00aaaa', fontStyle: 'italic' },
        { token: 'string', foreground: '55ff55' },
        { token: 'number', foreground: 'ffffff' },
        { token: 'type', foreground: '00ffff', fontStyle: 'bold' },
        { token: 'delimiter', foreground: 'ffffff' },
        { token: 'tag', foreground: '00ffff' },
      ],
      colors: {
        'editor.background': '#0000a8',
        'editor.foreground': '#ffffff',
        'editorCursor.foreground': '#ffffff',
        'editor.lineHighlightBackground': '#000077',
        'editorLineNumber.foreground': '#00aaaa',
        'editorLineNumber.activeForeground': '#ffff55',
        'editor.selectionBackground': '#0055ff',
        'editor.inactiveSelectionBackground': '#0033aa',
      },
    });

    // Update cursor position tracking
    editor.onDidChangeCursorPosition((e) => {
      setCursorPos({ line: e.position.lineNumber, column: e.position.column });
    });
  };

  // Determine Monaco Theme based on current UI theme
  const getMonacoTheme = () => {
    if (theme === 'classic') return 'turbo-classic';
    if (theme === 'modern-light') return 'light';
    return 'vs-dark';
  };

  // Update file content
  const handleContentChange = (value: string | undefined) => {
    if (value === undefined) return;
    setFiles((prev) =>
      prev.map((f) =>
        f.id === activeFileId ? { ...f, content: value, isDirty: true } : f
      )
    );
  };

  // Save current file
  const handleSaveFile = () => {
    setFiles((prev) =>
      prev.map((f) => (f.id === activeFileId ? { ...f, isDirty: false } : f))
    );
  };

  // Create new source file
  const handleNewFile = (type: 'c' | 'cpp') => {
    const ext = type === 'c' ? 'c' : 'cpp';
    const count = files.filter((f) => f.name.endsWith(`.${ext}`)).length + 1;
    const newFileName = `program${count}.${ext}`;
    const newFile: SourceFile = {
      id: `file_${Date.now()}`,
      name: newFileName,
      path: `/workspace/${newFileName}`,
      language: type,
      isDirty: false,
      content:
        type === 'c'
          ? `/* TurboCode IDE - ${newFileName} */\n#include <stdio.h>\n\nint main(void) {\n    printf("Hello from ${newFileName}!\\n");\n    return 0;\n}\n`
          : `// TurboCode IDE - ${newFileName}\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from ${newFileName}!" << std::endl;\n    return 0;\n}\n`,
    };
    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);
  };

  // Delete file
  const handleDeleteFile = (fileId: string) => {
    if (files.length <= 1) return;
    const newFiles = files.filter((f) => f.id !== fileId);
    setFiles(newFiles);
    if (activeFileId === fileId) {
      setActiveFileId(newFiles[0].id);
    }
  };

  // Load practical example
  const handleLoadExample = (example: ExampleProgram) => {
    const ext = example.category === 'C' ? 'c' : 'cpp';
    const cleanTitle = example.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = `${cleanTitle}.${ext}`;

    const newFile: SourceFile = {
      id: `ex_${example.id}_${Date.now()}`,
      name: fileName,
      path: `/workspace/${fileName}`,
      language: example.category === 'C' ? 'c' : 'cpp',
      content: example.code,
      isDirty: false,
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFileId(newFile.id);

    if (example.defaultInput) {
      setStdinInput(example.defaultInput);
    }
  };

  // Click-to-line navigation from diagnostics
  const handleNavigateToLine = (_fileName: string, line: number, column: number) => {
    if (editorRef.current) {
      editorRef.current.revealPositionInCenter({ lineNumber: line, column });
      editorRef.current.setPosition({ lineNumber: line, column });
      editorRef.current.focus();
    }
  };

  // 4. Compilation Handler (F2 / Alt+F9)
  const handleCompile = async () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setRunResult(null);

    try {
      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeFile.content,
          fileName: activeFile.name,
          language: activeFile.language,
          config: settings.compiler,
        }),
      });

      const data = await res.json();
      setCompileResult(data);

      if (data.diagnostics && data.diagnostics.length > 0) {
        setBottomTab('problems');
      } else {
        setBottomTab('compiler-log');
      }

      // Refresh history
      fetch('/api/history')
        .then((r) => r.json())
        .then((hData) => {
          if (hData.history) setHistory(hData.history);
        });
    } catch (err: any) {
      setCompileResult({
        success: false,
        compilerOutput: `Failed to invoke compiler service: ${err.message}`,
        commandExecuted: 'gcc/g++',
        durationMs: 0,
        diagnostics: [],
      });
      setBottomTab('compiler-log');
    } finally {
      setIsCompiling(false);
    }
  };

  // 5. Execution Handler (F5 / Ctrl+F9)
  const handleRun = async () => {
    if (!compileResult?.executableId || isRunning) return;
    setIsRunning(true);
    setBottomTab('output');

    try {
      const res = await fetch('/api/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          executableId: compileResult.executableId,
          stdinInput,
          config: settings.runner,
        }),
      });

      const data = await res.json();
      setRunResult(data);
    } catch (err: any) {
      setRunResult({
        success: false,
        stdout: '',
        stderr: `Runtime service error: ${err.message}`,
        exitCode: 1,
        durationMs: 0,
        timedOut: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  // 6. Compile & Run All-in-One Handler (F6)
  const handleCompileAndRun = async () => {
    if (isCompiling || isRunning) return;
    setIsCompiling(true);
    setIsRunning(true);
    setRunResult(null);

    try {
      const res = await fetch('/api/compile-and-run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: activeFile.content,
          fileName: activeFile.name,
          language: activeFile.language,
          stdinInput,
          compilerConfig: settings.compiler,
          runnerConfig: settings.runner,
        }),
      });

      const data = await res.json();
      setCompileResult(data.compileResult);

      if (data.runResult) {
        setRunResult(data.runResult);
        setBottomTab('output');
      } else if (data.compileResult?.diagnostics?.length > 0) {
        setBottomTab('problems');
      } else {
        setBottomTab('compiler-log');
      }

      // Refresh history
      fetch('/api/history')
        .then((r) => r.json())
        .then((hData) => {
          if (hData.history) setHistory(hData.history);
        });
    } catch (err: any) {
      setCompileResult({
        success: false,
        compilerOutput: `Failed to execute: ${err.message}`,
        commandExecuted: '',
        durationMs: 0,
        diagnostics: [],
      });
      setBottomTab('compiler-log');
    } finally {
      setIsCompiling(false);
      setIsRunning(false);
    }
  };

  // 7. Stop Execution Handler (Shift+F5)
  const handleStop = async () => {
    try {
      await fetch('/api/stop', { method: 'POST' });
      setIsRunning(false);
      if (runResult) {
        setRunResult({
          ...runResult,
          stderr: (runResult.stderr + '\n[Execution forcefully stopped by user]').trim(),
          exitCode: 130,
        });
      }
    } catch {
      setIsRunning(false);
    }
  };

  // 8. GDB Disassembly & Inspection Handler
  const handleInspectGdb = async () => {
    if (!compileResult?.executableId || isInspectingGdb) return;
    setIsInspectingGdb(true);
    try {
      const res = await fetch('/api/gdb/inspect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ executableId: compileResult.executableId }),
      });
      const data = await res.json();
      setGdbData(data);
    } catch (err: any) {
      setGdbData({ error: `GDB failed: ${err.message}` });
    } finally {
      setIsInspectingGdb(false);
    }
  };

  // 9. Build Automation Generator (CMake & Makefile)
  const handleGenerateBuildSystem = async () => {
    try {
      const res = await fetch('/api/build-system/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: 'TurboApp',
          type: activeFile.language,
          files: files.map((f) => f.name),
          standard: activeFile.language === 'cpp' ? settings.compiler.cppStandard : settings.compiler.cStandard,
        }),
      });
      const data = await res.json();
      setCmakeData({ cmake: data.cmake, makefile: data.makefile });
    } catch (err) {
      console.error('Failed to generate build files:', err);
    }
  };

  // 10. AI Assistant Request
  const handleAskAI = async (action: any, contextMsg?: string) => {
    if (!userConsentedAI || isLoadingAI) return;
    setIsLoadingAI(true);
    setAiError(null);
    setAiResponse(null);

    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          sourceCode: activeFile.content,
          language: activeFile.language,
          contextMessage: contextMsg,
          userConsented: true,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setAiResponse(data.result);
      } else {
        setAiError(data.error || 'Failed to receive assistance.');
      }
    } catch (err: any) {
      setAiError(`AI connection error: ${err.message}`);
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Save Settings
  const handleSaveSettings = (newSettings: Partial<IDESettings>) => {
    fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSettings),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.settings) {
          setSettings(data.settings);
          if (data.settings.theme) setTheme(data.settings.theme);
        }
      });
  };

  const isClassic = theme === 'classic';

  return (
    <div
      className={`w-screen h-screen flex flex-col overflow-hidden theme-${theme} font-mono`}
    >
      {/* Top Application Menu & Toolbar */}
      <HeaderMenuBar
        theme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          handleSaveSettings({ theme: newTheme });
        }}
        onCompile={handleCompile}
        onRun={handleRun}
        onCompileAndRun={handleCompileAndRun}
        onStop={handleStop}
        onNewFile={handleNewFile}
        onSaveFile={handleSaveFile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        isCompiling={isCompiling}
        isRunning={isRunning}
        canRun={Boolean(compileResult?.success && compileResult?.executableId)}
        compilers={compilers}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        isRightPanelOpen={isRightPanelOpen}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <Sidebar
          theme={theme}
          files={files}
          activeFileId={activeFileId}
          onSelectFile={(id) => setActiveFileId(id)}
          onNewFile={handleNewFile}
          onDeleteFile={handleDeleteFile}
          examples={examples}
          onLoadExample={handleLoadExample}
          compilers={compilers}
          history={history}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Center Editor and Bottom Panels */}
        <main className="flex-1 flex flex-col overflow-hidden relative">
          {/* File Tabs */}
          <EditorTabs
            theme={theme}
            files={files}
            activeFileId={activeFileId}
            onSelectTab={(id) => setActiveFileId(id)}
            onCloseTab={handleDeleteFile}
            onNewFile={handleNewFile}
          />

          {/* Monaco Editor Container */}
          <div
            className={`flex-1 relative overflow-hidden ${
              isClassic ? 'turbo-box-frame m-1' : ''
            }`}
          >
            {/* Classic Turbo C++ Window Title Bar Ornament */}
            {isClassic && (
              <div className="bg-[#00aaaa] text-black px-2 py-0.5 text-xs font-bold flex items-center justify-between select-none">
                <span className="flex items-center space-x-2">
                  <span>[■]</span>
                  <span>═ {activeFile.name} ═</span>
                </span>
                <span className="text-[10px]">[1]</span>
              </div>
            )}

            <div className="w-full h-full">
              <Editor
                height="100%"
                language={activeFile.language === 'cpp' ? 'cpp' : 'c'}
                value={activeFile.content}
                theme={getMonacoTheme()}
                onChange={handleContentChange}
                onMount={handleEditorMount}
                options={{
                  fontSize: settings.fontSize || 15,
                  fontFamily: settings.fontFamily,
                  tabSize: settings.tabSize || 4,
                  wordWrap: settings.wordWrap ? 'on' : 'off',
                  minimap: { enabled: settings.minimap },
                  lineNumbers: settings.lineNumbers ? 'on' : 'off',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  renderWhitespace: 'none',
                  bracketPairColorization: { enabled: true },
                  padding: { top: 8, bottom: 8 },
                }}
              />
            </div>
          </div>

          {/* Bottom Panels (Output, STDIN, Problems, GDB, CMake) */}
          <BottomPanel
            theme={theme}
            activeTab={bottomTab}
            onTabChange={(tab) => setBottomTab(tab)}
            compileResult={compileResult}
            runResult={runResult}
            stdinInput={stdinInput}
            onStdinChange={(val) => setStdinInput(val)}
            onRunAgain={handleRun}
            onClearOutput={() => setRunResult(null)}
            onNavigateToLine={handleNavigateToLine}
            gdbData={gdbData}
            onInspectGdb={handleInspectGdb}
            isInspectingGdb={isInspectingGdb}
            cmakeData={cmakeData}
            onGenerateBuildSystem={handleGenerateBuildSystem}
          />
        </main>

        {/* Right Collapsible Panel (AI Tutor & Cheatsheet) */}
        <RightPanel
          theme={theme}
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          sourceCode={activeFile.content}
          language={activeFile.language}
          lastCompilerError={compileResult?.compilerOutput}
          onAskAI={handleAskAI}
          aiResponse={aiResponse}
          isLoadingAI={isLoadingAI}
          aiError={aiError}
          userConsentedAI={userConsentedAI}
          onToggleUserConsent={(val) => setUserConsentedAI(val)}
        />
      </div>

      {/* Bottom Status Bar */}
      <StatusBar
        theme={theme}
        language={activeFile.language}
        standard={
          activeFile.language === 'cpp'
            ? settings.compiler.cppStandard
            : settings.compiler.cStandard
        }
        line={cursorPos.line}
        column={cursorPos.column}
        charCount={activeFile.content.length}
        compilerName={
          compilers.find((c) => c.available && c.type === (activeFile.language === 'cpp' ? 'cpp' : 'c'))?.version || 'GCC 12.3.0'
        }
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onCompile={handleCompile}
        onRun={handleRun}
        onSave={handleSaveFile}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
        onReset={() => handleSaveSettings(DEFAULT_SETTINGS)}
        theme={theme}
      />

      {/* Keyboard Shortcuts Reference Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
        theme={theme}
      />

      {/* About TurboCode IDE Modal */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        theme={theme}
      />
    </div>
  );
}
