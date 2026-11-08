import React from 'react';
import { X, Plus, FileCode } from 'lucide-react';
import { SourceFile, ThemeMode } from '../types.js';

interface EditorTabsProps {
  theme: ThemeMode;
  files: SourceFile[];
  activeFileId: string;
  onSelectTab: (fileId: string) => void;
  onCloseTab: (fileId: string) => void;
  onNewFile: (type: 'c' | 'cpp') => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  theme,
  files,
  activeFileId,
  onSelectTab,
  onCloseTab,
  onNewFile,
}) => {
  const isClassic = theme === 'classic';

  return (
    <div
      className={`flex items-center overflow-x-auto select-none border-b text-xs ${
        isClassic
          ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
          : theme === 'modern-dark'
          ? 'bg-[#18181b] text-zinc-400 border-zinc-800'
          : 'bg-zinc-200/80 text-zinc-600 border-zinc-300'
      }`}
    >
      <div className="flex items-center space-x-1 px-1 py-1 flex-1">
        {files.map((file) => {
          const isActive = file.id === activeFileId;
          const isC = file.name.endsWith('.c') || file.language === 'c';

          return (
            <div
              key={file.id}
              onClick={() => onSelectTab(file.id)}
              className={`group flex items-center space-x-2 px-3 py-1.5 rounded-t cursor-pointer transition-all border-t-2 ${
                isActive
                  ? isClassic
                    ? 'bg-[#0000a8] text-[#ffff55] font-bold border-[#00ffff] shadow-inner'
                    : theme === 'modern-dark'
                    ? 'bg-[#202024] text-zinc-100 border-blue-500 font-medium'
                    : 'bg-white text-zinc-900 border-blue-600 font-medium'
                  : isClassic
                  ? 'bg-[#000066] text-cyan-300 border-transparent hover:bg-blue-900/60'
                  : 'bg-transparent border-transparent hover:bg-black/10'
              }`}
            >
              <FileCode
                className={`w-3.5 h-3.5 flex-shrink-0 ${
                  isC ? 'text-amber-400' : 'text-cyan-400'
                }`}
              />
              <span className="truncate max-w-[140px]">{file.name}</span>
              {file.isDirty && (
                <span className="text-amber-400 font-bold" title="Unsaved changes">
                  *
                </span>
              )}

              {files.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(file.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded cursor-pointer"
                  title="Close tab"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          onClick={() => onNewFile('c')}
          className={`p-1.5 rounded cursor-pointer ${
            isClassic
              ? 'hover:bg-blue-900 text-cyan-300'
              : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200'
          }`}
          title="New C File (Ctrl+N)"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
