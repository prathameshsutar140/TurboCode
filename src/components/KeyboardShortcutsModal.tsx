import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { ThemeMode } from '../types.js';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;
  const isClassic = theme === 'classic';

  const shortcuts = [
    { key: 'F2', desc: 'Compile active source file (or Save in classic DOS)' },
    { key: 'Alt + F9', desc: 'Classic Turbo C++ Compile shortcut' },
    { key: 'F5', desc: 'Run compiled binary executable' },
    { key: 'Ctrl + F9', desc: 'Classic Turbo C++ Run shortcut' },
    { key: 'F6', desc: 'Compile & Run in one step' },
    { key: 'Shift + F5', desc: 'Stop running execution & terminate child processes' },
    { key: 'Ctrl + S', desc: 'Save current active file' },
    { key: 'Ctrl + N', desc: 'Create new C or C++ source file' },
    { key: 'Ctrl + W', desc: 'Close current editor tab' },
    { key: 'Ctrl + F', desc: 'Find in active editor' },
    { key: 'Ctrl + H', desc: 'Find and Replace in editor' },
    { key: 'Ctrl + G', desc: 'Go to line number' },
    { key: 'Ctrl + `', desc: 'Toggle bottom output / terminal panel' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-lg rounded-lg shadow-2xl flex flex-col border overflow-hidden ${
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
            <Keyboard className="w-4 h-4 text-yellow-400" />
            <span>TurboCode IDE Keyboard Shortcuts</span>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-black/20 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[70vh] text-xs">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 opacity-70 text-left">
                <th className="pb-2">Shortcut</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {shortcuts.map((sc) => (
                <tr key={sc.key} className="hover:bg-white/5">
                  <td className="py-2 font-bold font-mono text-cyan-300">{sc.key}</td>
                  <td className="py-2 opacity-90">{sc.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-white/10 text-right">
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded text-xs font-bold cursor-pointer ${
              isClassic ? 'bg-[#ffff55] text-black' : 'bg-blue-600 text-white'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
