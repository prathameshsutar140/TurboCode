import React, { useState } from 'react';
import { X, Save, RotateCcw, Sliders, Shield, Palette, Cpu, Code2 } from 'lucide-react';
import { IDESettings, ThemeMode } from '../types.js';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: IDESettings;
  onSave: (newSettings: Partial<IDESettings>) => void;
  onReset: () => void;
  theme: ThemeMode;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onReset,
  theme,
}) => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'compiler' | 'execution' | 'editor'>('compiler');
  const [localSettings, setLocalSettings] = useState<IDESettings>(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  const isClassic = theme === 'classic';

  const handleSave = () => {
    onSave(localSettings);
    onClose();
  };

  const updateCompiler = (key: string, value: any) => {
    setLocalSettings({
      ...localSettings,
      compiler: {
        ...localSettings.compiler,
        [key]: value,
      },
    });
  };

  const updateRunner = (key: string, value: any) => {
    setLocalSettings({
      ...localSettings,
      runner: {
        ...localSettings.runner,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div
        className={`w-full max-w-2xl rounded-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border ${
          isClassic
            ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
            : theme === 'modern-dark'
            ? 'bg-[#18181b] text-zinc-200 border-zinc-700'
            : 'bg-white text-zinc-800 border-zinc-300'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-b select-none ${
            isClassic
              ? 'bg-[#000066] border-[#00aaaa]'
              : theme === 'modern-dark'
              ? 'bg-[#121215] border-zinc-800'
              : 'bg-zinc-100 border-zinc-200'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold text-sm">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>TurboCode IDE Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-black/20 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div
          className={`flex border-b text-xs select-none ${
            isClassic
              ? 'bg-[#0000a8] border-[#00aaaa]'
              : theme === 'modern-dark'
              ? 'bg-[#202024] border-zinc-800'
              : 'bg-zinc-50 border-zinc-200'
          }`}
        >
          <button
            onClick={() => setActiveTab('compiler')}
            className={`flex-1 py-2 text-center cursor-pointer font-medium flex items-center justify-center space-x-1.5 ${
              activeTab === 'compiler'
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] border-b-2 border-[#ffff55]'
                  : 'bg-[#18181b] text-blue-400 border-b-2 border-blue-500'
                : 'opacity-70'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Compiler</span>
          </button>

          <button
            onClick={() => setActiveTab('execution')}
            className={`flex-1 py-2 text-center cursor-pointer font-medium flex items-center justify-center space-x-1.5 ${
              activeTab === 'execution'
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] border-b-2 border-[#ffff55]'
                  : 'bg-[#18181b] text-blue-400 border-b-2 border-blue-500'
                : 'opacity-70'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Execution Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`flex-1 py-2 text-center cursor-pointer font-medium flex items-center justify-center space-x-1.5 ${
              activeTab === 'appearance'
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] border-b-2 border-[#ffff55]'
                  : 'bg-[#18181b] text-blue-400 border-b-2 border-blue-500'
                : 'opacity-70'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Appearance</span>
          </button>

          <button
            onClick={() => setActiveTab('editor')}
            className={`flex-1 py-2 text-center cursor-pointer font-medium flex items-center justify-center space-x-1.5 ${
              activeTab === 'editor'
                ? isClassic
                  ? 'bg-[#000088] text-[#ffff55] border-b-2 border-[#ffff55]'
                  : 'bg-[#18181b] text-blue-400 border-b-2 border-blue-500'
                : 'opacity-70'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs space-y-4">
          {/* TAB: COMPILER */}
          {activeTab === 'compiler' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">C Compiler Executable:</label>
                  <input
                    type="text"
                    value={localSettings.compiler.cCompiler}
                    onChange={(e) => updateCompiler('cCompiler', e.target.value)}
                    placeholder="gcc or C:\msys64\ucrt64\bin\gcc.exe"
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">C++ Compiler Executable:</label>
                  <input
                    type="text"
                    value={localSettings.compiler.cppCompiler}
                    onChange={(e) => updateCompiler('cppCompiler', e.target.value)}
                    placeholder="g++ or C:\msys64\ucrt64\bin\g++.exe"
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">C Language Standard:</label>
                  <select
                    value={localSettings.compiler.cStandard}
                    onChange={(e) => updateCompiler('cStandard', e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <option value="c90">C90 / ANSI C</option>
                    <option value="c99">C99 Standard</option>
                    <option value="c11">C11 Standard</option>
                    <option value="c17">C17 Standard (Recommended)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">C++ Language Standard:</label>
                  <select
                    value={localSettings.compiler.cppStandard}
                    onChange={(e) => updateCompiler('cppStandard', e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <option value="c++11">C++11</option>
                    <option value="c++14">C++14</option>
                    <option value="c++17">C++17</option>
                    <option value="c++20">C++20 (Modern Default)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Optimization Level:</label>
                  <select
                    value={localSettings.compiler.optimization}
                    onChange={(e) => updateCompiler('optimization', e.target.value)}
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  >
                    <option value="-O0">-O0 (No Optimization - Debugging)</option>
                    <option value="-O1">-O1 (Moderate)</option>
                    <option value="-O2">-O2 (Fast Execution)</option>
                    <option value="-O3">-O3 (Aggressive)</option>
                    <option value="-Os">-Os (Optimize for Binary Size)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Custom Compiler Flags:</label>
                  <input
                    type="text"
                    value={localSettings.compiler.customFlags}
                    onChange={(e) => updateCompiler('customFlags', e.target.value)}
                    placeholder="-DDEBUG -pthread"
                    className={`w-full p-2 rounded border outline-none ${
                      isClassic
                        ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                        : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                    }`}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXECUTION SANDBOX */}
          {activeTab === 'execution' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Execution Timeout (ms):</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={localSettings.runner.timeoutMs}
                    onChange={(e) => updateRunner('timeoutMs', parseInt(e.target.value, 10))}
                    className="flex-1"
                  />
                  <span className="font-bold w-16 text-right">
                    {localSettings.runner.timeoutMs / 1000} sec
                  </span>
                </div>
                <div className="text-[11px] opacity-70 mt-1">
                  Kills runaway infinite loops automatically to prevent host freeze.
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Memory Limit (MB):</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="32"
                    max="512"
                    step="32"
                    value={localSettings.runner.memoryLimitMb}
                    onChange={(e) => updateRunner('memoryLimitMb', parseInt(e.target.value, 10))}
                    className="flex-1"
                  />
                  <span className="font-bold w-16 text-right">
                    {localSettings.runner.memoryLimitMb} MB
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Security Isolation Policy:</label>
                <select
                  value={localSettings.runner.sandboxMode}
                  onChange={(e) => updateRunner('sandboxMode', e.target.value)}
                  className={`w-full p-2 rounded border outline-none ${
                    isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                >
                  <option value="restricted">Restricted (Temp Folder, Process Limit, Output Cap)</option>
                  <option value="standard">Standard Execution</option>
                </select>
              </div>
            </div>
          )}

          {/* TAB: APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-2">IDE Theme Experience:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, theme: 'classic' })}
                    className={`p-3 rounded border text-left cursor-pointer transition-all ${
                      localSettings.theme === 'classic'
                        ? 'border-yellow-400 bg-[#0000a8] text-white font-bold ring-2 ring-yellow-400'
                        : 'border-zinc-700 bg-blue-950 text-cyan-200 opacity-60'
                    }`}
                  >
                    <div className="text-sm font-bold">Classic Turbo C++</div>
                    <div className="text-[10px] mt-1">Borland authentic blue with DOS menu & borders</div>
                  </button>

                  <button
                    onClick={() => setLocalSettings({ ...localSettings, theme: 'modern-dark' })}
                    className={`p-3 rounded border text-left cursor-pointer transition-all ${
                      localSettings.theme === 'modern-dark'
                        ? 'border-blue-500 bg-zinc-800 text-white font-bold ring-2 ring-blue-500'
                        : 'border-zinc-700 bg-zinc-900 text-zinc-400 opacity-60'
                    }`}
                  >
                    <div className="text-sm font-bold">Modern Dark</div>
                    <div className="text-[10px] mt-1">Sleek dark theme with modern typography</div>
                  </button>

                  <button
                    onClick={() => setLocalSettings({ ...localSettings, theme: 'modern-light' })}
                    className={`p-3 rounded border text-left cursor-pointer transition-all ${
                      localSettings.theme === 'modern-light'
                        ? 'border-blue-600 bg-white text-zinc-900 font-bold ring-2 ring-blue-600'
                        : 'border-zinc-300 bg-zinc-100 text-zinc-600 opacity-60'
                    }`}
                  >
                    <div className="text-sm font-bold">Modern Light</div>
                    <div className="text-[10px] mt-1">Clean daytime editorial design</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Editor Font Size: {localSettings.fontSize}px</label>
                <input
                  type="range"
                  min="12"
                  max="22"
                  step="1"
                  value={localSettings.fontSize}
                  onChange={(e) => setLocalSettings({ ...localSettings, fontSize: parseInt(e.target.value, 10) })}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">Code Minimap:</div>
                  <div className="text-[11px] opacity-70">Show code overview map on the right side</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.minimap}
                  onChange={(e) => setLocalSettings({ ...localSettings, minimap: e.target.checked })}
                  className="rounded"
                />
              </div>
            </div>
          )}

          {/* TAB: EDITOR */}
          {activeTab === 'editor' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Tab Indentation Size:</label>
                <select
                  value={localSettings.tabSize}
                  onChange={(e) => setLocalSettings({ ...localSettings, tabSize: parseInt(e.target.value, 10) })}
                  className={`w-full p-2 rounded border outline-none ${
                    isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] text-[#ffff55]'
                      : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                  }`}
                >
                  <option value="2">2 Spaces</option>
                  <option value="4">4 Spaces (Standard C/C++)</option>
                  <option value="8">8 Spaces</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">Line Numbers:</div>
                  <div className="text-[11px] opacity-70">Show line numbers in the gutter</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.lineNumbers}
                  onChange={(e) => setLocalSettings({ ...localSettings, lineNumbers: e.target.checked })}
                  className="rounded"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">Word Wrap:</div>
                  <div className="text-[11px] opacity-70">Wrap long lines instead of horizontal scrolling</div>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.wordWrap}
                  onChange={(e) => setLocalSettings({ ...localSettings, wordWrap: e.target.checked })}
                  className="rounded"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-4 py-2.5 border-t select-none ${
            isClassic
              ? 'bg-[#000066] border-[#00aaaa]'
              : theme === 'modern-dark'
              ? 'bg-[#121215] border-zinc-800'
              : 'bg-zinc-100 border-zinc-200'
          }`}
        >
          <button
            onClick={onReset}
            className="px-3 py-1 rounded text-xs hover:bg-black/20 flex items-center space-x-1 cursor-pointer opacity-80"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1 rounded text-xs hover:bg-black/20 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className={`px-4 py-1.5 rounded text-xs font-bold flex items-center space-x-1.5 cursor-pointer shadow-sm ${
                isClassic
                  ? 'bg-[#ffff55] text-black hover:bg-yellow-300'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
