import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Square,
  Settings,
  HelpCircle,
  FolderOpen,
  Save,
  FileCode,
  Palette,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';
import { ThemeMode, DetectedCompiler } from '../types.js';

interface HeaderMenuBarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onCompile: () => void;
  onRun: () => void;
  onCompileAndRun: () => void;
  onStop: () => void;
  onNewFile: (type: 'c' | 'cpp') => void;
  onSaveFile: () => void;
  onOpenSettings: () => void;
  onOpenShortcuts: () => void;
  onOpenAbout: () => void;
  isCompiling: boolean;
  isRunning: boolean;
  canRun: boolean;
  compilers: DetectedCompiler[];
  onToggleRightPanel: () => void;
  isRightPanelOpen: boolean;
}

export const HeaderMenuBar: React.FC<HeaderMenuBarProps> = ({
  theme,
  onThemeChange,
  onCompile,
  onRun,
  onCompileAndRun,
  onStop,
  onNewFile,
  onSaveFile,
  onOpenSettings,
  onOpenShortcuts,
  onOpenAbout,
  isCompiling,
  isRunning,
  canRun,
  compilers,
  onToggleRightPanel,
  isRightPanelOpen,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const isClassic = theme === 'classic';
  const gccTool = compilers.find((c) => c.binary === 'gcc' && c.available);
  const gppTool = compilers.find((c) => c.binary === 'g++' && c.available);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenu(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleMenuClick = (e: React.MouseEvent, menuName: string) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header className="flex flex-col select-none border-b z-20">
      {/* Top Menu Bar */}
      <div
        className={`flex items-center justify-between px-2 h-7 text-xs font-mono ${
          isClassic
            ? 'bg-[#aaaaaa] text-black border-b border-[#555555]'
            : theme === 'modern-dark'
            ? 'bg-[#18181b] text-zinc-300 border-b border-zinc-800'
            : 'bg-white text-zinc-700 border-b border-zinc-200'
        }`}
      >
        <div className="flex items-center space-x-1">
          {/* Logo / Brand */}
          <div className="flex items-center space-x-1.5 px-2 py-0.5 font-bold tracking-wider">
            <span
              className={`px-1 py-0.2 rounded font-mono ${
                isClassic
                  ? 'bg-[#0000a8] text-[#ffff55]'
                  : 'bg-blue-600 text-white'
              }`}
            >
              TC
            </span>
            <span className={isClassic ? 'text-[#0000a8]' : 'font-semibold'}>
              TURBOCODE
            </span>
          </div>

          {/* Menu Dropdowns */}
          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, 'file')}
              className={`px-2 py-0.5 hover:bg-black/10 rounded cursor-pointer ${
                activeMenu === 'file' ? (isClassic ? 'bg-[#0000a8] text-white' : 'bg-blue-600/20 text-blue-500') : ''
              }`}
            >
              <span className={isClassic ? 'text-[#a80000] font-bold' : ''}>F</span>ile
            </button>
            {activeMenu === 'file' && (
              <div
                className={`absolute left-0 top-full mt-1 w-48 shadow-xl border py-1 z-50 ${
                  isClassic
                    ? 'bg-[#aaaaaa] text-black border-black font-mono'
                    : theme === 'modern-dark'
                    ? 'bg-[#27272a] text-zinc-200 border-zinc-700'
                    : 'bg-white text-zinc-800 border-zinc-200'
                }`}
              >
                <button
                  onClick={() => { onNewFile('c'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                >
                  <span>New C File</span>
                  <span className="opacity-60">.c</span>
                </button>
                <button
                  onClick={() => { onNewFile('cpp'); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                >
                  <span>New C++ File</span>
                  <span className="opacity-60">.cpp</span>
                </button>
                <div className="my-1 border-t border-black/20" />
                <button
                  onClick={() => { onSaveFile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                >
                  <span>Save File</span>
                  <span className="opacity-60">Ctrl+S</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, 'run')}
              className={`px-2 py-0.5 hover:bg-black/10 rounded cursor-pointer ${
                activeMenu === 'run' ? (isClassic ? 'bg-[#0000a8] text-white' : 'bg-blue-600/20 text-blue-500') : ''
              }`}
            >
              <span className={isClassic ? 'text-[#a80000] font-bold' : ''}>R</span>un
            </button>
            {activeMenu === 'run' && (
              <div
                className={`absolute left-0 top-full mt-1 w-52 shadow-xl border py-1 z-50 ${
                  isClassic
                    ? 'bg-[#aaaaaa] text-black border-black font-mono'
                    : theme === 'modern-dark'
                    ? 'bg-[#27272a] text-zinc-200 border-zinc-700'
                    : 'bg-white text-zinc-800 border-zinc-200'
                }`}
              >
                <button
                  onClick={() => { onCompile(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between"
                >
                  <span>Compile (GCC/G++)</span>
                  <span className="opacity-60">F2 / Alt+F9</span>
                </button>
                <button
                  onClick={() => { onRun(); setActiveMenu(null); }}
                  disabled={!canRun}
                  className={`w-full text-left px-3 py-1.5 flex justify-between ${
                    canRun ? 'hover:bg-blue-600 hover:text-white' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>Run Binary</span>
                  <span className="opacity-60">F5 / Ctrl+F9</span>
                </button>
                <button
                  onClick={() => { onCompileAndRun(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex justify-between font-bold"
                >
                  <span>Compile & Run</span>
                  <span className="opacity-60">F6</span>
                </button>
                <div className="my-1 border-t border-black/20" />
                <button
                  onClick={() => { onStop(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-600 hover:text-white flex justify-between"
                >
                  <span>Stop Execution</span>
                  <span className="opacity-60">Shift+F5</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, 'options')}
              className={`px-2 py-0.5 hover:bg-black/10 rounded cursor-pointer ${
                activeMenu === 'options' ? (isClassic ? 'bg-[#0000a8] text-white' : 'bg-blue-600/20 text-blue-500') : ''
              }`}
            >
              <span className={isClassic ? 'text-[#a80000] font-bold' : ''}>O</span>ptions
            </button>
            {activeMenu === 'options' && (
              <div
                className={`absolute left-0 top-full mt-1 w-56 shadow-xl border py-1 z-50 ${
                  isClassic
                    ? 'bg-[#aaaaaa] text-black border-black font-mono'
                    : theme === 'modern-dark'
                    ? 'bg-[#27272a] text-zinc-200 border-zinc-700'
                    : 'bg-white text-zinc-800 border-zinc-200'
                }`}
              >
                <div className="px-3 py-1 text-[10px] font-bold uppercase opacity-50">Theme Experience</div>
                <button
                  onClick={() => { onThemeChange('classic'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between ${
                    isClassic ? 'font-bold' : ''
                  }`}
                >
                  <span>Classic Turbo C++ Blue</span>
                  {isClassic && <span>✓</span>}
                </button>
                <button
                  onClick={() => { onThemeChange('modern-dark'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between ${
                    theme === 'modern-dark' ? 'font-bold' : ''
                  }`}
                >
                  <span>Modern Dark</span>
                  {theme === 'modern-dark' && <span>✓</span>}
                </button>
                <button
                  onClick={() => { onThemeChange('modern-light'); setActiveMenu(null); }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white flex items-center justify-between ${
                    theme === 'modern-light' ? 'font-bold' : ''
                  }`}
                >
                  <span>Modern Light</span>
                  {theme === 'modern-light' && <span>✓</span>}
                </button>
                <div className="my-1 border-t border-black/20" />
                <button
                  onClick={() => { onOpenSettings(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white"
                >
                  Compiler & Runner Settings...
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={(e) => handleMenuClick(e, 'help')}
              className={`px-2 py-0.5 hover:bg-black/10 rounded cursor-pointer ${
                activeMenu === 'help' ? (isClassic ? 'bg-[#0000a8] text-white' : 'bg-blue-600/20 text-blue-500') : ''
              }`}
            >
              <span className={isClassic ? 'text-[#a80000] font-bold' : ''}>H</span>elp
            </button>
            {activeMenu === 'help' && (
              <div
                className={`absolute left-0 top-full mt-1 w-52 shadow-xl border py-1 z-50 ${
                  isClassic
                    ? 'bg-[#aaaaaa] text-black border-black font-mono'
                    : theme === 'modern-dark'
                    ? 'bg-[#27272a] text-zinc-200 border-zinc-700'
                    : 'bg-white text-zinc-800 border-zinc-200'
                }`}
              >
                <button
                  onClick={() => { onOpenShortcuts(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white"
                >
                  Keyboard Shortcuts (F1)
                </button>
                <button
                  onClick={() => { onOpenAbout(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-blue-600 hover:text-white"
                >
                  About TurboCode IDE
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Compiler Status & Theme Quick Toggle */}
        <div className="flex items-center space-x-2">
          {gccTool && (
            <div
              className={`px-2 py-0.5 rounded text-[11px] flex items-center space-x-1.5 ${
                isClassic
                  ? 'bg-[#0000a8] text-[#55ff55]'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
              title={gccTool.version}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>GCC/G++ Ready</span>
            </div>
          )}

          <button
            onClick={() => onThemeChange(isClassic ? 'modern-dark' : 'classic')}
            className={`px-2 py-0.5 rounded flex items-center space-x-1 cursor-pointer ${
              isClassic
                ? 'bg-[#0000a8] text-[#ffff55] hover:bg-blue-900'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
            title="Toggle between Classic Turbo C++ and Modern theme"
          >
            <Palette className="w-3 h-3" />
            <span>{isClassic ? 'Modern Mode' : 'Classic Turbo'}</span>
          </button>
        </div>
      </div>

      {/* Action Toolbar */}
      <div
        className={`flex items-center justify-between px-3 py-1.5 ${
          isClassic
            ? 'bg-[#0000a8] text-white border-b-2 border-[#00aaaa]'
            : theme === 'modern-dark'
            ? 'bg-[#18181b] text-zinc-200 border-b border-zinc-800'
            : 'bg-slate-50 text-zinc-700 border-b border-zinc-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          {/* Compile Button */}
          <button
            onClick={onCompile}
            disabled={isCompiling}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
              isClassic
                ? 'bg-[#00aaaa] text-black hover:bg-[#00ffff] font-mono shadow-[2px_2px_0px_#000055]'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
            } ${isCompiling ? 'opacity-60 cursor-wait' : ''}`}
            title="Compile with configured GCC/G++ standard (F2 or Alt+F9)"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{isCompiling ? 'Compiling...' : 'Compile'}</span>
            <span className="opacity-70 text-[10px] hidden sm:inline">(F2)</span>
          </button>

          {/* Run Button */}
          <button
            onClick={onRun}
            disabled={!canRun || isRunning}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
              isClassic
                ? 'bg-[#55ff55] text-black hover:bg-emerald-400 font-mono shadow-[2px_2px_0px_#000055]'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            } ${!canRun || isRunning ? 'opacity-40 cursor-not-allowed' : ''}`}
            title="Run compiled program (F5 or Ctrl+F9)"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run'}</span>
            <span className="opacity-70 text-[10px] hidden sm:inline">(F5)</span>
          </button>

          {/* Compile & Run Button */}
          <button
            onClick={onCompileAndRun}
            disabled={isCompiling || isRunning}
            className={`px-3 py-1 rounded text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
              isClassic
                ? 'bg-[#ffff55] text-black hover:bg-yellow-300 font-mono shadow-[2px_2px_0px_#000055]'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            } ${isCompiling || isRunning ? 'opacity-60 cursor-wait' : ''}`}
            title="Compile source and immediately execute (F6)"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isCompiling || isRunning ? 'animate-spin' : ''}`} />
            <span>Compile & Run</span>
            <span className="opacity-70 text-[10px] hidden sm:inline">(F6)</span>
          </button>

          {/* Stop Button */}
          <button
            onClick={onStop}
            className={`px-2.5 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all ${
              isClassic
                ? 'bg-[#ff5555] text-white hover:bg-red-400 font-mono shadow-[2px_2px_0px_#000055]'
                : 'bg-red-600/80 hover:bg-red-600 text-white'
            }`}
            title="Stop execution and terminate process tree (Shift+F5)"
          >
            <Square className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </button>
        </div>

        {/* Right side utilities */}
        <div className="flex items-center space-x-2">
          {/* AI Tutor Toggle */}
          <button
            onClick={onToggleRightPanel}
            className={`px-2.5 py-1 rounded text-xs flex items-center space-x-1 cursor-pointer transition-all ${
              isRightPanelOpen
                ? isClassic
                  ? 'bg-[#ffff55] text-black font-mono font-bold'
                  : 'bg-purple-600 text-white'
                : isClassic
                ? 'bg-blue-900 text-cyan-200 border border-cyan-400 font-mono'
                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
            title="Toggle AI Code Assistant & Quick Reference"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">AI Tutor & Reference</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className={`p-1.5 rounded cursor-pointer ${
              isClassic
                ? 'hover:bg-blue-900 text-cyan-300'
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
            title="Compiler & Environment Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
