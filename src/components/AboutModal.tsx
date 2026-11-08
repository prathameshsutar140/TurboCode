import React from 'react';
import { X, Code2, ShieldCheck, Terminal, Cpu } from 'lucide-react';
import { ThemeMode } from '../types.js';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  const isClassic = theme === 'classic';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-md rounded-lg shadow-2xl flex flex-col border overflow-hidden ${
          isClassic
            ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
            : theme === 'modern-dark'
            ? 'bg-[#18181b] text-zinc-200 border-zinc-700'
            : 'bg-white text-zinc-800 border-zinc-300'
        }`}
      >
        <div
          className={`flex items-center justify-between px-4 py-3 border-b ${
            isClassic
              ? 'bg-[#000066] border-[#00aaaa]'
              : theme === 'modern-dark'
              ? 'bg-[#121215] border-zinc-800'
              : 'bg-zinc-100 border-zinc-200'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-sm">
            <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white text-xs font-mono">TC</span>
            <span>About TurboCode IDE</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/20 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs space-y-3 leading-relaxed select-text">
          <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
            <div className="w-12 h-12 rounded bg-gradient-to-tr from-blue-700 to-cyan-500 flex items-center justify-center text-white font-bold text-xl font-mono shadow-md">
              TC
            </div>
            <div>
              <div className="font-bold text-sm text-yellow-300">TurboCode IDE v2.4.0</div>
              <div className="text-[11px] opacity-75">Professional Windows C/C++ Development Environment</div>
            </div>
          </div>

          <p>
            TurboCode IDE pays homage to the legendary <strong>Borland Turbo C++ 3.0</strong> interface while providing full 21st-century modern compiler integration, syntax diagnostics, and educational tooling.
          </p>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Real GCC / G++ toolchain compilation with C17 &amp; C++20 standards.</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Isolated process execution with timeout and memory quotas.</span>
            </div>
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Monaco Code Editor with bracket coloring and problem navigation.</span>
            </div>
          </div>

          <div className="p-2.5 bg-black/30 rounded border border-white/10 text-[11px] opacity-80">
            Designed for diploma students, university computer science programs, and systems developers learning memory management and modern standards.
          </div>
        </div>

        <div className="p-3 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded text-xs font-bold cursor-pointer ${
              isClassic ? 'bg-[#ffff55] text-black' : 'bg-blue-600 text-white'
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};
