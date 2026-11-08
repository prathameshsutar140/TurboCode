import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  BookOpen,
  Cpu,
  History,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Search,
  Code2,
} from 'lucide-react';
import { SourceFile, ExampleProgram, DetectedCompiler, HistoryItem, ThemeMode } from '../types.js';

interface SidebarProps {
  theme: ThemeMode;
  files: SourceFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onNewFile: (type: 'c' | 'cpp') => void;
  onDeleteFile: (fileId: string) => void;
  examples: ExampleProgram[];
  onLoadExample: (example: ExampleProgram) => void;
  compilers: DetectedCompiler[];
  history: HistoryItem[];
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  theme,
  files,
  activeFileId,
  onSelectFile,
  onNewFile,
  onDeleteFile,
  examples,
  onLoadExample,
  compilers,
  history,
  isOpen,
  onToggle,
}) => {
  const [activeTab, setActiveTab] = useState<'files' | 'examples' | 'compilers' | 'history'>('files');
  const [exampleCategory, setExampleCategory] = useState<'All' | 'C' | 'C++'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const isClassic = theme === 'classic';

  if (!isOpen) {
    return (
      <div
        className={`w-10 flex flex-col items-center py-3 border-r ${
          isClassic
            ? 'bg-[#000088] border-[#00aaaa]'
            : theme === 'modern-dark'
            ? 'bg-[#121215] border-zinc-800'
            : 'bg-zinc-100 border-zinc-200'
        }`}
      >
        <button
          onClick={onToggle}
          className="p-1.5 rounded cursor-pointer hover:bg-black/20"
          title="Expand Sidebar"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    );
  }

  const filteredExamples = examples.filter((ex) => {
    const matchesCat = exampleCategory === 'All' || ex.category === exampleCategory;
    const matchesSearch =
      ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <aside
      className={`w-72 flex flex-col border-r select-none h-full z-10 ${
        isClassic
          ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
          : theme === 'modern-dark'
          ? 'bg-[#121215] text-zinc-300 border-zinc-800'
          : 'bg-zinc-50 text-zinc-800 border-zinc-200'
      }`}
    >
      {/* Sidebar Navigation Tabs */}
      <div
        className={`flex border-b text-xs ${
          isClassic
            ? 'bg-[#000066] border-[#00aaaa]'
            : theme === 'modern-dark'
            ? 'bg-[#18181b] border-zinc-800'
            : 'bg-zinc-200/70 border-zinc-300'
        }`}
      >
        <button
          onClick={() => setActiveTab('files')}
          className={`flex-1 py-2 flex items-center justify-center space-x-1 cursor-pointer transition-all ${
            activeTab === 'files'
              ? isClassic
                ? 'bg-[#000088] text-[#ffff55] font-bold border-b-2 border-[#ffff55]'
                : 'bg-[#202024] text-blue-400 font-medium'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="Files & Project Explorer"
        >
          <Folder className="w-3.5 h-3.5" />
          <span>Files</span>
        </button>

        <button
          onClick={() => setActiveTab('examples')}
          className={`flex-1 py-2 flex items-center justify-center space-x-1 cursor-pointer transition-all ${
            activeTab === 'examples'
              ? isClassic
                ? 'bg-[#000088] text-[#ffff55] font-bold border-b-2 border-[#ffff55]'
                : 'bg-[#202024] text-blue-400 font-medium'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="Practical Program Library (C & C++)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Examples</span>
        </button>

        <button
          onClick={() => setActiveTab('compilers')}
          className={`flex-1 py-2 flex items-center justify-center space-x-1 cursor-pointer transition-all ${
            activeTab === 'compilers'
              ? isClassic
                ? 'bg-[#000088] text-[#ffff55] font-bold border-b-2 border-[#ffff55]'
                : 'bg-[#202024] text-blue-400 font-medium'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="Compiler Toolchain Status"
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Toolchain</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 flex items-center justify-center space-x-1 cursor-pointer transition-all ${
            activeTab === 'history'
              ? isClassic
                ? 'bg-[#000088] text-[#ffff55] font-bold border-b-2 border-[#ffff55]'
                : 'bg-[#202024] text-blue-400 font-medium'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="Compilation History"
        >
          <History className="w-3.5 h-3.5" />
          <span>History</span>
        </button>
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-2">
        {/* TAB 1: FILES EXPLORER */}
        {activeTab === 'files' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-70">
                Workspace Files
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => onNewFile('c')}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    isClassic
                      ? 'bg-[#00aaaa] text-black hover:bg-cyan-300'
                      : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  }`}
                  title="New C Source File"
                >
                  + .c
                </button>
                <button
                  onClick={() => onNewFile('cpp')}
                  className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                    isClassic
                      ? 'bg-[#55ff55] text-black hover:bg-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                  title="New C++ Source File"
                >
                  + .cpp
                </button>
              </div>
            </div>

            <div className="space-y-0.5">
              {files.map((file) => {
                const isSelected = file.id === activeFileId;
                const isC = file.name.endsWith('.c') || file.language === 'c';
                return (
                  <div
                    key={file.id}
                    onClick={() => onSelectFile(file.id)}
                    className={`group flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer text-xs transition-all ${
                      isSelected
                        ? isClassic
                          ? 'bg-[#0000a8] text-[#ffff55] font-bold border-l-2 border-[#ffff55]'
                          : 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 font-medium'
                        : isClassic
                        ? 'hover:bg-blue-900/40 text-cyan-200'
                        : 'hover:bg-zinc-800/50 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <FileCode
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isC ? 'text-amber-400' : 'text-cyan-400'
                        }`}
                      />
                      <span className="truncate">{file.name}</span>
                      {file.isDirty && (
                        <span className="text-amber-400 font-bold" title="Unsaved changes">
                          *
                        </span>
                      )}
                    </div>

                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete file "${file.name}"?`)) {
                            onDeleteFile(file.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 p-0.5 rounded cursor-pointer"
                        title="Delete file"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PRACTICAL EXAMPLES LIBRARY */}
        {activeTab === 'examples' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-1 pb-1">
              {(['All', 'C', 'C++'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setExampleCategory(cat)}
                  className={`flex-1 py-0.5 rounded text-[11px] cursor-pointer transition-all ${
                    exampleCategory === cat
                      ? isClassic
                        ? 'bg-[#00aaaa] text-black font-bold'
                        : 'bg-blue-600 text-white'
                      : isClassic
                      ? 'bg-blue-950 text-cyan-300'
                      : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-3 h-3 absolute left-2 top-2 opacity-50" />
              <input
                type="text"
                placeholder="Search examples..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-7 pr-2 py-1 text-xs rounded border outline-none ${
                  isClassic
                    ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55] placeholder-cyan-400'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-200 placeholder-zinc-500'
                }`}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              {filteredExamples.map((ex) => (
                <div
                  key={ex.id}
                  onClick={() => onLoadExample(ex)}
                  className={`p-2 rounded cursor-pointer border text-xs transition-all ${
                    isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] hover:bg-blue-900 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold flex items-center space-x-1">
                      <span
                        className={`text-[9px] px-1 rounded uppercase font-mono ${
                          ex.category === 'C'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-cyan-500/20 text-cyan-400'
                        }`}
                      >
                        {ex.category}
                      </span>
                      <span>{ex.title}</span>
                    </span>
                    <span
                      className={`text-[9px] px-1 rounded ${
                        ex.difficulty === 'Beginner'
                          ? 'text-emerald-400'
                          : ex.difficulty === 'Intermediate'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-75 line-clamp-1 mt-0.5">
                    {ex.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMPILER TOOLCHAINS STATUS */}
        {activeTab === 'compilers' && (
          <div className="space-y-3 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
              Detected Toolchains
            </div>

            <div className="space-y-2">
              {compilers.map((comp) => (
                <div
                  key={comp.name}
                  className={`p-2.5 rounded border ${
                    isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa]'
                      : 'bg-zinc-900/50 border-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span>{comp.name}</span>
                    {comp.available ? (
                      <span className="flex items-center space-x-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="flex items-center space-x-1 text-rose-400 text-[11px]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Not Found</span>
                      </span>
                    )}
                  </div>

                  {comp.available && (
                    <div className="mt-1.5 space-y-0.5 text-[11px] opacity-80">
                      <div className="truncate">Path: {comp.path || comp.binary}</div>
                      <div className="truncate opacity-70">{comp.version}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div
              className={`p-2 rounded text-[11px] leading-relaxed border ${
                isClassic
                  ? 'bg-blue-950/80 border-[#00aaaa] text-cyan-200'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400'
              }`}
            >
              <div className="font-bold mb-1 text-white">Windows Toolchain Note:</div>
              Install MinGW-w64 via MSYS2 (pacman -S mingw-w64-ucrt-x86_64-gcc) or LLVM Clang. TurboCode IDE executes commands directly against installed system binaries.
            </div>
          </div>
        )}

        {/* TAB 4: COMPILATION HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-2 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider opacity-70">
              Recent Builds & Runs
            </div>

            {history.length === 0 ? (
              <div className="p-4 text-center opacity-50 text-xs">
                No compilation records yet. Hit Compile (F2) or Compile & Run (F6).
              </div>
            ) : (
              <div className="space-y-1.5">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2 rounded border ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa]'
                        : 'bg-zinc-900/60 border-zinc-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-medium">
                      <span className="truncate">{item.fileName}</span>
                      <span
                        className={`text-[10px] px-1 rounded ${
                          item.compileSuccess
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {item.compileSuccess ? 'SUCCESS' : 'FAILED'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-[10px] opacity-75">
                      <span>{item.durationMs || 0}ms</span>
                      <span>
                        {item.errorCount} Errors, {item.warningCount} Warnings
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
