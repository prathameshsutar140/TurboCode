import React from 'react';
import { ThemeMode } from '../types.js';

interface StatusBarProps {
  theme: ThemeMode;
  language: string;
  standard: string;
  line: number;
  column: number;
  charCount: number;
  compilerName: string;
  onOpenShortcuts: () => void;
  onCompile: () => void;
  onRun: () => void;
  onSave: () => void;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  theme,
  language,
  standard,
  line,
  column,
  charCount,
  compilerName,
  onOpenShortcuts,
  onCompile,
  onRun,
  onSave,
}) => {
  const isClassic = theme === 'classic';

  if (isClassic) {
    return (
      <footer className="h-6 bg-[#aaaaaa] text-black border-t border-[#555555] flex items-center justify-between px-2 text-xs font-mono select-none z-20">
        <div className="flex items-center space-x-3 overflow-x-auto">
          <button
            onClick={onOpenShortcuts}
            className="hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span className="text-[#a80000] font-bold">F1</span>
            <span>Help</span>
          </button>

          <button
            onClick={onSave}
            className="hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span className="text-[#a80000] font-bold">F2</span>
            <span>Save</span>
          </button>

          <button
            onClick={onCompile}
            className="hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span className="text-[#a80000] font-bold">Alt-F9</span>
            <span>Compile</span>
          </button>

          <button
            onClick={onRun}
            className="hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span className="text-[#a80000] font-bold">Ctrl-F9</span>
            <span>Run</span>
          </button>

          <div className="hidden sm:flex items-center space-x-1">
            <span className="text-[#a80000] font-bold">F6</span>
            <span>All-In-One</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-[11px]">
          <span>
            {language.toUpperCase()} ({standard})
          </span>
          <span>
            Ln {line}, Col {column}
          </span>
          <span className="text-blue-900 font-bold">CLASSIC TURBO</span>
        </div>
      </footer>
    );
  }

  // Modern Mode Status Bar
  return (
    <footer
      className={`h-6 flex items-center justify-between px-3 text-xs select-none border-t z-20 ${
        theme === 'modern-dark'
          ? 'bg-[#18181b] text-zinc-400 border-zinc-800'
          : 'bg-zinc-100 text-zinc-600 border-zinc-300'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="font-medium text-zinc-200">{compilerName || 'GCC Toolchain'}</span>
        </div>

        <span className="opacity-75">
          Standard: <strong>{standard}</strong>
        </span>

        <span className="opacity-75">UTF-8</span>
      </div>

      <div className="flex items-center space-x-4">
        <span>{charCount} chars</span>
        <span>
          Ln {line}, Col {column}
        </span>
        <span className="font-semibold text-blue-400">
          {language === 'cpp' ? 'C++' : 'C'}
        </span>
      </div>
    </footer>
  );
};
