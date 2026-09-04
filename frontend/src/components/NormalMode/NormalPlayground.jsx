import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Trash2, 
  Sparkles, 
  Send, 
  Plus, 
  X, 
  Code2, 
  Clock, 
  HardDrive,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import CodeEditor from '../../../components/CodeEditor.jsx';
import LanguageSelector from '../Common/LanguageSelector.jsx';

export default function NormalPlayground({
  language,
  setLanguage,
  code,
  setCode,
  onResetTemplate,
  input,
  setInput,
  output,
  setOutput,
  onRunCode,
  isRunning,
  onAskAI
}) {
  const [aiPrompt, setAiPrompt] = useState("");
  const [showStdin, setShowStdin] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const [aiResponseModal, setAiResponseModal] = useState({ isOpen: false, text: "", loading: false });

  const getFileName = (lang) => {
    switch (lang) {
      case 'cpp': return 'main.cpp';
      case 'c': return 'main.c';
      case 'python': return 'main.py';
      case 'java': return 'Main.java';
      case 'javascript': return 'main.js';
      default: return 'main.cpp';
    }
  };

  const handleClearOutput = () => {
    setOutput({
      stdout: "",
      stderr: "",
      error: "",
      success: null,
      systemLog: "Console cleared."
    });
  };

  const handleSendAiPrompt = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiResponseModal({ isOpen: true, text: "", loading: true });
    try {
      const response = await fetch("http://localhost:3000/answer/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: aiPrompt,
          code,
          language
        })
      });
      const data = await response.json();
      setAiResponseModal({
        isOpen: true,
        text: data.text || "No response received.",
        loading: false
      });
      setAiPrompt("");
    } catch (err) {
      setAiResponseModal({
        isOpen: true,
        text: `Error connecting to AI: ${err.message}`,
        loading: false
      });
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[1850px] mx-auto p-3 sm:p-4 lg:p-6 gap-4">
      
      {/* Main Split Grid (Mockup Screen 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 flex-1 items-stretch">
        
        {/* ================= LEFT / CENTER: CODE EDITOR WITH TABS & AI BAR (8 cols) ================= */}
        <div className="lg:col-span-8 flex flex-col h-full gap-3">
          <div 
            className="flex flex-col h-full backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            
            {/* Editor Top Bar: Tabs & Language Selector & Run */}
            <div 
              className="relative z-30 px-3 py-2 border-b flex flex-wrap items-center justify-between gap-2 select-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              
              {/* File Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-lg border text-xs font-mono transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-tab-active)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{getFileName(language)}</span>
                  <span className="opacity-60 hover:opacity-100 cursor-pointer ml-1">×</span>
                </div>

                <button 
                  title="Add tab"
                  className="p-1 rounded-lg opacity-60 hover:opacity-100 transition-colors cursor-pointer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Language Selector & Actions */}
              <div className="flex items-center gap-2">
                <LanguageSelector
                  language={language}
                  setLanguage={setLanguage}
                  disabled={isRunning}
                  align="left"
                />

                {onResetTemplate && (
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={onResetTemplate}
                    title="Reset code to default language template"
                    className="text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <RotateCcw size={12} className="text-amber-500" />
                    <span className="hidden sm:inline">Reset Template</span>
                  </button>
                )}

                <button
                  disabled={isRunning}
                  onClick={() => setShowStdin(!showStdin)}
                  className="text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1 font-mono"
                  style={showStdin ? {
                    backgroundColor: 'rgba(99, 102, 241, 0.15)',
                    color: '#6366f1',
                    borderColor: 'rgba(99, 102, 241, 0.4)'
                  } : {
                    backgroundColor: 'var(--bg-subtle)',
                    color: 'var(--text-secondary)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <span>Stdin</span>
                  {showStdin ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>

                <button
                  disabled={isRunning}
                  onClick={onRunCode}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-[0_0_15px_rgba(99,102,241,0.35)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Compile & Run</span>
                </button>
              </div>

            </div>

            {/* Optional Collapsible Stdin Panel */}
            {showStdin && (
              <div 
                className="p-3 border-b animate-fadeIn transition-colors"
                style={{
                  backgroundColor: 'var(--bg-header)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="flex items-center justify-between mb-1 text-[11px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                  <span>Custom Standard Input (stdin):</span>
                  <span className="text-[10px] opacity-75">Passed to program execution</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter input data here for cin, input(), etc..."
                  className="w-full h-20 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none transition-colors"
                  style={{
                    backgroundColor: 'var(--bg-input)',
                    borderColor: 'var(--border-input)',
                    borderWidth: '1px',
                    color: 'var(--text-primary)'
                  }}
                />
              </div>
            )}

            {/* Monaco Code Editor */}
            <div className="flex-1 min-h-[440px] p-1">
              <CodeEditor language={language} code={code} setCode={setCode} />
            </div>

            {/* Bottom AI Prompt Bar (Mockup Screen 5 Bottom Bar) */}
            <form 
              onSubmit={handleSendAiPrompt}
              className="p-2.5 border-t flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 pl-2 text-purple-500">
                <Sparkles size={16} className="animate-spin-slow" />
              </div>

              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Try asking AI to optimize your code, explain logic, or fix errors..."
                className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none font-sans"
                style={{
                  color: 'var(--text-primary)'
                }}
              />

              <button
                type="submit"
                disabled={!aiPrompt.trim()}
                className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white disabled:opacity-30 transition-all cursor-pointer shadow-sm"
                title="Send to CodeSphere AI"
              >
                <Send size={13} />
              </button>
            </form>

          </div>
        </div>

        {/* ================= RIGHT: OUTPUT CONSOLE & METRICS (4 cols) ================= */}
        <div className="lg:col-span-4 flex flex-col h-full">
          <div 
            className="flex flex-col h-full backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            
            {/* Header */}
            <div 
              className="px-4 py-2.5 border-b flex items-center justify-between select-none font-mono transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-cyan-500" />
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                  Output Console
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearOutput}
                  title="Clear Console"
                  className="p-1 transition-colors cursor-pointer opacity-60 hover:opacity-100"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Console Content */}
            <div 
              className="flex-1 p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-3 min-h-[300px] transition-colors"
              style={{ backgroundColor: 'var(--bg-terminal)' }}
            >
              
              {output.systemLog && (
                <div 
                  className="border-l-2 pl-2.5 py-0.5 select-none"
                  style={{
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {output.systemLog}
                </div>
              )}

              {/* Stdout */}
              {output.stdout && (
                <div className="text-emerald-600 dark:text-emerald-400 font-medium whitespace-pre-wrap selection:bg-emerald-500/30">
                  {output.stdout}
                </div>
              )}

              {/* Stderr / Runtime Error */}
              {output.stderr && (
                <div className="text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 whitespace-pre-wrap">
                  {output.stderr}
                </div>
              )}

              {/* Compile Error */}
              {output.error && (
                <div className="text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2.5 whitespace-pre-wrap">
                  {output.error}
                </div>
              )}

              {!output.stdout && !output.stderr && !output.error && !output.systemLog && (
                <div className="italic select-none" style={{ color: 'var(--text-muted)' }}>
                  Press "Compile & Run" to execute code.
                </div>
              )}

            </div>

            {/* Output Footer with Execution Metrics (Mockup Screen 5 bottom) */}
            <div 
              className="px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono select-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-3">
                {output.success === true ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>✓</span> Executed in {output.executionTime || "0.3s"}
                  </span>
                ) : output.success === false ? (
                  <span className="text-rose-600 dark:text-rose-400 font-semibold">
                    ✗ Execution Failed
                  </span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>Ready</span>
                )}
              </div>

              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <HardDrive size={11} className="opacity-70" />
                <span>Memory: {output.memory || "6.2 MB"}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* AI Assistant Pop-up Drawer */}
      {aiResponseModal.isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className="w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div 
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-purple-600 dark:text-purple-300">
                <Sparkles size={16} />
                <span>CodeSphere AI Analysis</span>
              </div>
              <button
                onClick={() => setAiResponseModal({ isOpen: false, text: "", loading: false })}
                className="opacity-70 hover:opacity-100 cursor-pointer transition-opacity"
                style={{ color: 'var(--text-primary)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div 
              className="p-5 overflow-y-auto text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-wrap"
              style={{ color: 'var(--text-primary)' }}
            >
              {aiResponseModal.loading ? (
                <div className="flex items-center gap-3 py-6 justify-center text-purple-500">
                  <div className="w-5 h-5 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
                  <span>Thinking with Gemini...</span>
                </div>
              ) : (
                aiResponseModal.text
              )}
            </div>

            <div 
              className="px-5 py-3 border-t flex justify-end"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)'
              }}
            >
              <button
                onClick={() => setAiResponseModal({ isOpen: false, text: "", loading: false })}
                className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs cursor-pointer shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
