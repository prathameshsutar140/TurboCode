import React, { useState } from 'react';
import {
  Sparkles,
  HelpCircle,
  FileQuestion,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  X,
  Code,
  BookMarked,
} from 'lucide-react';
import { AIAssistAction } from '../../services/ai-service.js';
import { ThemeMode } from '../types.js';

interface RightPanelProps {
  theme: ThemeMode;
  isOpen: boolean;
  onClose: () => void;
  sourceCode: string;
  language: string;
  lastCompilerError?: string;
  onAskAI: (action: AIAssistAction, contextMsg?: string) => void;
  aiResponse: string | null;
  isLoadingAI: boolean;
  aiError: string | null;
  userConsentedAI: boolean;
  onToggleUserConsent: (val: boolean) => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  theme,
  isOpen,
  onClose,
  sourceCode,
  language,
  lastCompilerError,
  onAskAI,
  aiResponse,
  isLoadingAI,
  aiError,
  userConsentedAI,
  onToggleUserConsent,
}) => {
  const [activeTab, setActiveTab] = useState<'ai' | 'cheatsheet'>('ai');
  const [practiceTopic, setPracticeTopic] = useState('');

  const isClassic = theme === 'classic';

  if (!isOpen) return null;

  return (
    <aside
      className={`w-80 md:w-96 flex flex-col border-l select-none h-full z-10 ${
        isClassic
          ? 'bg-[#000088] text-white border-[#00aaaa] font-mono'
          : theme === 'modern-dark'
          ? 'bg-[#18181b] text-zinc-300 border-zinc-800'
          : 'bg-zinc-50 text-zinc-800 border-zinc-200'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-3 h-8 border-b text-xs ${
          isClassic
            ? 'bg-[#000066] border-[#00aaaa]'
            : theme === 'modern-dark'
            ? 'bg-[#121215] border-zinc-800'
            : 'bg-zinc-200 border-zinc-300'
        }`}
      >
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded cursor-pointer ${
              activeTab === 'ai'
                ? isClassic
                  ? 'bg-[#0000a8] text-[#ffff55] font-bold'
                  : 'bg-[#202024] text-purple-400 font-medium'
                : 'opacity-70'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded cursor-pointer ${
              activeTab === 'cheatsheet'
                ? isClassic
                  ? 'bg-[#0000a8] text-[#ffff55] font-bold'
                  : 'bg-[#202024] text-blue-400 font-medium'
                : 'opacity-70'
            }`}
          >
            <BookMarked className="w-3.5 h-3.5" />
            <span>C/C++ Cheatsheet</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-black/20 cursor-pointer"
          title="Close Panel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-3 text-xs space-y-3">
        {activeTab === 'ai' && (
          <div className="space-y-3">
            {/* User Consent Card */}
            <div
              className={`p-2.5 rounded border ${
                isClassic
                  ? 'bg-blue-950 border-[#00aaaa]'
                  : 'bg-zinc-900 border-zinc-800'
              }`}
            >
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={userConsentedAI}
                  onChange={(e) => onToggleUserConsent(e.target.checked)}
                  className="mt-0.5 rounded border-zinc-700 text-purple-600 focus:ring-0"
                />
                <span className="text-[11px] leading-tight">
                  I consent to sending selected source code to the AI assistant for analysis and tutoring.
                </span>
              </label>
              {!userConsentedAI && (
                <div className="mt-1.5 text-[10px] text-amber-400">
                  External AI is optional. TurboCode IDE local compilation & execution work 100% offline.
                </div>
              )}
            </div>

            {/* AI Action Buttons */}
            <div className="space-y-1.5">
              <button
                onClick={() => onAskAI('explain_code')}
                disabled={!userConsentedAI || isLoadingAI}
                className={`w-full p-2 rounded text-left border flex items-center justify-between cursor-pointer transition-all ${
                  userConsentedAI
                    ? isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] hover:bg-blue-900 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center space-x-1.5">
                    <FileQuestion className="w-3.5 h-3.5 text-blue-400" />
                    <span>Explain Current Program</span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-0.5">
                    Break down memory allocation, flow, and functions
                  </div>
                </div>
              </button>

              <button
                onClick={() => onAskAI('explain_error', lastCompilerError)}
                disabled={!userConsentedAI || isLoadingAI}
                className={`w-full p-2 rounded text-left border flex items-center justify-between cursor-pointer transition-all ${
                  userConsentedAI
                    ? isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] hover:bg-blue-900 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>Explain Compiler Error</span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-0.5">
                    Pinpoint GCC/G++ error and provide exact syntax fix
                  </div>
                </div>
              </button>

              <button
                onClick={() => onAskAI('optimize')}
                disabled={!userConsentedAI || isLoadingAI}
                className={`w-full p-2 rounded text-left border flex items-center justify-between cursor-pointer transition-all ${
                  userConsentedAI
                    ? isClassic
                      ? 'bg-[#0000a8] border-[#00aaaa] hover:bg-blue-900 text-white'
                      : 'bg-zinc-900/60 border-zinc-800 hover:bg-zinc-800/80 hover:border-zinc-700'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                <div>
                  <div className="font-bold flex items-center space-x-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                    <span>Suggest Standards & Safety</span>
                  </div>
                  <div className="text-[10px] opacity-70 mt-0.5">
                    Check buffer safety, leaks, and modern idioms
                  </div>
                </div>
              </button>
            </div>

            {/* Practice generator */}
            <div
              className={`p-2 rounded border space-y-1.5 ${
                isClassic ? 'bg-[#0000a8] border-[#00aaaa]' : 'bg-zinc-900/40 border-zinc-800'
              }`}
            >
              <div className="font-bold text-[11px]">Generate Practice Problem:</div>
              <input
                type="text"
                value={practiceTopic}
                onChange={(e) => setPracticeTopic(e.target.value)}
                placeholder="Topic e.g., Pointers, Binary Search, Linked List..."
                className={`w-full px-2 py-1 text-xs rounded border outline-none ${
                  isClassic
                    ? 'bg-blue-950 border-[#00aaaa] text-[#ffff55]'
                    : 'bg-zinc-900 border-zinc-700 text-zinc-100'
                }`}
              />
              <button
                onClick={() => onAskAI('generate_practice', practiceTopic)}
                disabled={!userConsentedAI || isLoadingAI}
                className={`w-full py-1 rounded text-xs cursor-pointer font-bold ${
                  userConsentedAI
                    ? isClassic
                      ? 'bg-[#ffff55] text-black'
                      : 'bg-purple-600 text-white'
                    : 'opacity-40 cursor-not-allowed'
                }`}
              >
                Generate Challenge
              </button>
            </div>

            {/* AI Response Display */}
            {isLoadingAI && (
              <div className="p-4 text-center space-y-2 animate-pulse">
                <Sparkles className="w-5 h-5 mx-auto text-purple-400 animate-spin" />
                <div className="text-xs">Consulting senior C/C++ tutor...</div>
              </div>
            )}

            {aiError && (
              <div className="p-2.5 bg-rose-500/20 text-rose-300 rounded border border-rose-500/40 text-[11px]">
                {aiError}
              </div>
            )}

            {aiResponse && !isLoadingAI && (
              <div
                className={`p-3 rounded border whitespace-pre-wrap select-text leading-relaxed ${
                  isClassic
                    ? 'bg-blue-950 border-[#00aaaa] text-zinc-100'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-200'
                }`}
              >
                <div className="text-[10px] uppercase font-bold text-purple-400 mb-1.5 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Assistant Explanation:</span>
                </div>
                {aiResponse}
              </div>
            )}
          </div>
        )}

        {/* CHEATSHEET TAB */}
        {activeTab === 'cheatsheet' && (
          <div className="space-y-3 select-text">
            {/* Format Specifiers */}
            <div
              className={`p-2.5 rounded border ${
                isClassic ? 'bg-[#0000a8] border-[#00aaaa]' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div className="font-bold text-[11px] text-cyan-400 mb-1">
                printf / scanf Format Specifiers
              </div>
              <table className="w-full text-[11px]">
                <tbody>
                  <tr><td className="font-mono text-amber-400">%d / %i</td><td>Signed integer</td></tr>
                  <tr><td className="font-mono text-amber-400">%u</td><td>Unsigned integer</td></tr>
                  <tr><td className="font-mono text-amber-400">%lld</td><td>64-bit long long int</td></tr>
                  <tr><td className="font-mono text-amber-400">%f / %lf</td><td>Float / Double</td></tr>
                  <tr><td className="font-mono text-amber-400">%c / %s</td><td>Character / String</td></tr>
                  <tr><td className="font-mono text-amber-400">%p</td><td>Pointer memory address</td></tr>
                  <tr><td className="font-mono text-amber-400">%zu</td><td>size_t (sizeof operator)</td></tr>
                </tbody>
              </table>
            </div>

            {/* Pointers & Memory */}
            <div
              className={`p-2.5 rounded border ${
                isClassic ? 'bg-[#0000a8] border-[#00aaaa]' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div className="font-bold text-[11px] text-emerald-400 mb-1">
                Pointers & Memory Mechanics
              </div>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li><code className="text-yellow-300">&amp;var</code> : Address-of operator</li>
                <li><code className="text-yellow-300">*ptr</code> : Dereference value</li>
                <li><code className="text-yellow-300">ptr-&gt;member</code> : Access struct pointer</li>
                <li><code className="text-yellow-300">malloc(size)</code> : Allocate heap block</li>
                <li><code className="text-yellow-300">free(ptr)</code> : Release heap memory</li>
                <li><code className="text-yellow-300">std::unique_ptr</code> : RAII auto pointer</li>
              </ul>
            </div>

            {/* Essential Headers */}
            <div
              className={`p-2.5 rounded border ${
                isClassic ? 'bg-[#0000a8] border-[#00aaaa]' : 'bg-zinc-900/50 border-zinc-800'
              }`}
            >
              <div className="font-bold text-[11px] text-purple-400 mb-1">
                Essential Standard Headers
              </div>
              <div className="text-[11px] space-y-1">
                <div><span className="font-mono text-cyan-300">&lt;stdio.h&gt;</span> : printf, scanf, fopen</div>
                <div><span className="font-mono text-cyan-300">&lt;stdlib.h&gt;</span> : malloc, free, exit, atoi</div>
                <div><span className="font-mono text-cyan-300">&lt;string.h&gt;</span> : strlen, strcpy, strcmp</div>
                <div><span className="font-mono text-cyan-300">&lt;iostream&gt;</span> : std::cout, std::cin</div>
                <div><span className="font-mono text-cyan-300">&lt;vector&gt;</span> : Dynamic STL array</div>
                <div><span className="font-mono text-cyan-300">&lt;algorithm&gt;</span> : std::sort, std::find</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
