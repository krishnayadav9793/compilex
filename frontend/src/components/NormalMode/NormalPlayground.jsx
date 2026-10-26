import React, { useState } from 'react';
import { 
  Play, 
  Terminal, 
  Trash2, 
  Sparkles, 
  Send, 
  Code2, 
  HardDrive, 
  RotateCcw, 
  LogIn, 
  Copy, 
  Check, 
  Columns2, 
  Rows2 
} from 'lucide-react';
import CodeEditor from '../../../components/CodeEditor.jsx';
import LanguageSelector from '../Common/LanguageSelector.jsx';
import { API_BASE_URL } from '../../config';

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
  isRunning
}) {
  const [aiPrompt, setAiPrompt] = useState("");
  // Responsive mobile tab: "editor" | "stdin" | "output"
  const [mobileTab, setMobileTab] = useState("editor");
  // Side-by-side or stacked layout toggle for Stdin & Output (default: "stacked" as requested)
  const [ioLayout, setIoLayout] = useState("stacked"); // "stacked" | "side"
  const [copiedStdin, setCopiedStdin] = useState(false);
  const [copiedStdout, setCopiedStdout] = useState(false);
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
      systemLog: "Console initialized. Ready to execute code."
    });
  };

  const handleCopyStdin = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopiedStdin(true);
    setTimeout(() => setCopiedStdin(false), 1800);
  };

  const handleCopyStdout = () => {
    const textToCopy = output.stdout || output.stderr || output.error || "";
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedStdout(true);
    setTimeout(() => setCopiedStdout(false), 1800);
  };

  const handleLoadSampleInput = () => {
    setInput("5\n10 20 30 40 50");
  };

  const handleSendAiPrompt = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiResponseModal({ isOpen: true, text: "", loading: true });
    try {
      const response = await fetch(`${API_BASE_URL}/answer/ai-assist`, {
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
        text: `Error connecting to compileX AI: ${err.message}`,
        loading: false
      });
    }
  };

  // Calculate lines count for stdin
  const stdinLinesCount = input ? input.split('\n').length : 0;

  return (
    <div className="flex flex-col flex-1 w-full max-w-[1920px] mx-auto p-2 sm:p-4 lg:p-6 gap-3 sm:gap-4">
      
      {/* Mobile Tab Switcher (< lg screens: Editor | Stdin | Output) */}
      <div 
        className="flex lg:hidden items-center justify-center p-1 rounded-full border shadow-sm"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-color)'
        }}
      >
        <button
          onClick={() => setMobileTab("editor")}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5
            ${mobileTab === "editor" 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' 
              : ''}`}
          style={mobileTab === "editor" ? {} : { color: 'var(--text-secondary)' }}
        >
          <Code2 size={13} />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setMobileTab("stdin")}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 relative
            ${mobileTab === "stdin" 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm' 
              : ''}`}
          style={mobileTab === "stdin" ? {} : { color: 'var(--text-secondary)' }}
        >
          <LogIn size={13} />
          <span>Stdin</span>
          {input.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          )}
        </button>

        <button
          onClick={() => setMobileTab("output")}
          className={`flex-1 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-all flex items-center justify-center gap-1.5 relative
            ${mobileTab === "output" 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm' 
              : ''}`}
          style={mobileTab === "output" ? {} : { color: 'var(--text-secondary)' }}
        >
          <Terminal size={13} />
          <span>Output</span>
          {output.stdout && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          )}
          {output.error && (
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          )}
        </button>
      </div>

      {/* Main Split Grid (6 cols Editor / 6 cols Stdin + Output Side-by-Side) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 lg:gap-5 flex-1 items-stretch">
        
        {/* ================= LEFT: CODE EDITOR (6 cols on lg/xl) ================= */}
        <div className={`lg:col-span-6 xl:col-span-6 flex-col h-full gap-3 ${mobileTab === 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="flex flex-col h-full rounded-2xl overflow-hidden apple-card">
            
            {/* Editor Action Bar - fixed height with overflow-visible to guarantee no size changes */}
            <div 
              className="relative z-30 px-3 sm:px-4 min-h-[44px] border-b flex items-center justify-between gap-2 select-none transition-colors duration-300 overflow-visible"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              
              {/* File Tab */}
              <div className="flex items-center gap-1.5 overflow-x-auto shrink-0">
                <div 
                  className="flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-mono transition-colors shadow-xs"
                  style={{
                    backgroundColor: 'var(--bg-tab-active)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.6)]" />
                  <span>{getFileName(language)}</span>
                </div>
              </div>

              {/* Language Selector & Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 overflow-visible">
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
                    title="Reset to default language template"
                    className="text-xs px-2.5 py-1.5 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 apple-button-shiny"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <RotateCcw size={12} className="text-amber-500" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}

                {/* Compile & Run Button */}
                <button
                  disabled={isRunning}
                  onClick={onRunCode}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs tracking-wide shadow-[0_2px_12px_rgba(99,102,241,0.35)] transition-all cursor-pointer active:scale-95 disabled:opacity-50 apple-button-shiny"
                >
                  <Play size={12} fill="currentColor" className={isRunning ? 'animate-pulse' : ''} />
                  <span>{isRunning ? 'Compiling...' : 'Run Code'}</span>
                </button>
              </div>

            </div>

            {/* Monaco Code Editor */}
            <div className="flex-1 min-h-[380px] sm:min-h-[460px] p-1">
              <CodeEditor language={language} code={code} setCode={setCode} />
            </div>

            {/* Bottom AI Prompt Bar */}
            <form 
              onSubmit={handleSendAiPrompt}
              className="p-2 sm:p-2.5 border-t flex items-center gap-2 transition-colors"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-1.5 pl-2 text-indigo-400">
                <Sparkles size={15} className="animate-spin-slow" />
              </div>

              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask compileX AI to optimize code, fix errors, explain algorithm..."
                className="flex-1 bg-transparent text-xs sm:text-sm focus:outline-none font-sans"
                style={{
                  color: 'var(--text-primary)'
                }}
              />

              <button
                type="submit"
                disabled={!aiPrompt.trim()}
                className="px-3 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs disabled:opacity-30 transition-all cursor-pointer shadow-sm apple-button-shiny flex items-center gap-1"
                title="Send to compileX AI"
              >
                <span>Ask AI</span>
                <Send size={11} />
              </button>
            </form>

          </div>
        </div>

        {/* ================= RIGHT: STDIN & OUTPUT CONSOLE (6 cols on lg/xl, side-by-side) ================= */}
        <div className={`lg:col-span-6 xl:col-span-6 flex-col h-full gap-3 ${mobileTab !== 'editor' ? 'flex' : 'hidden lg:flex'}`}>
          <div className={`grid ${ioLayout === 'side' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-3 sm:gap-4 flex-1 h-full items-stretch`}>
            
            {/* ----------------- BOX 1: STDIN (STANDARD INPUT) ----------------- */}
            <div className={`flex-col h-full rounded-2xl overflow-hidden apple-card ${mobileTab === 'stdin' ? 'flex' : mobileTab === 'output' ? 'hidden md:flex' : 'flex'}`}>
              
              {/* Stdin Header */}
              <div 
                className="px-3.5 py-2.5 border-b flex items-center justify-between select-none font-mono transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--bar-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="flex items-center gap-2">
                  <LogIn size={14} className="text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    Input (stdin)
                  </span>
                  {input.length > 0 && (
                    <span 
                      className="text-[10px] px-1.5 py-0.2 rounded-md font-mono opacity-80 border"
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {input.length}c • {stdinLinesCount}L
                    </span>
                  )}
                </div>

                {/* Stdin Header Actions */}
                <div className="flex items-center gap-1">
                  {/* View layout switcher toggle: Side-by-Side vs Stacked */}
                  <button
                    type="button"
                    onClick={() => setIoLayout(ioLayout === 'side' ? 'stacked' : 'side')}
                    title={ioLayout === 'side' ? "Switch to stacked view" : "Switch to side-by-side view"}
                    className="hidden md:flex p-1.5 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {ioLayout === 'side' ? <Rows2 size={13} /> : <Columns2 size={13} />}
                  </button>

                  {/* Copy Stdin */}
                  <button
                    type="button"
                    onClick={handleCopyStdin}
                    disabled={!input}
                    title="Copy input"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {copiedStdin ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>

                  {/* Clear Stdin */}
                  <button
                    type="button"
                    onClick={() => setInput("")}
                    disabled={!input}
                    title="Clear standard input"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Stdin Textarea Canvas */}
              <div 
                className="flex-1 p-3 flex flex-col min-h-[220px] transition-colors"
                style={{ backgroundColor: 'var(--bg-terminal)' }}
              >
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter inputs here (e.g. for cin >> x, scanf(), input())...&#10;&#10;Example:&#10;5&#10;10 20 30 40 50"
                  className="w-full flex-1 min-h-[180px] bg-transparent outline-none border-0 text-xs font-mono leading-relaxed resize-none p-1 placeholder:opacity-40 transition-colors selection:bg-emerald-500/20"
                  style={{
                    color: 'var(--text-primary)'
                  }}
                  spellCheck="false"
                />
              </div>

              {/* Stdin Footer */}
              <div 
                className="px-3.5 py-2 border-t flex items-center justify-between text-[11px] font-mono select-none transition-colors"
                style={{
                  backgroundColor: 'var(--bar-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <span className="opacity-70 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  Passed to program at execution
                </span>

                <button
                  type="button"
                  onClick={handleLoadSampleInput}
                  className="text-[10px] px-2 py-0.5 rounded-md border transition-colors cursor-pointer opacity-75 hover:opacity-100 apple-button-shiny"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  Insert Sample
                </button>
              </div>

            </div>

            {/* ----------------- BOX 2: CONSOLE OUTPUT (STDOUT / STDERR) ----------------- */}
            <div className={`flex-col h-full rounded-2xl overflow-hidden apple-card ${mobileTab === 'output' ? 'flex' : mobileTab === 'stdin' ? 'hidden md:flex' : 'flex'}`}>
              
              {/* Output Header */}
              <div 
                className="px-3.5 py-2.5 border-b flex items-center justify-between select-none font-mono transition-colors duration-300"
                style={{
                  backgroundColor: 'var(--bar-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                    Console Output
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {/* Copy Output */}
                  <button
                    type="button"
                    onClick={handleCopyStdout}
                    disabled={!output.stdout && !output.stderr && !output.error}
                    title="Copy output"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-30 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {copiedStdout ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                  </button>

                  {/* Clear Console */}
                  <button
                    type="button"
                    onClick={handleClearOutput}
                    title="Clear Console"
                    className="p-1.5 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Console Output Content Canvas */}
              <div 
                className="flex-1 p-3 sm:p-4 overflow-y-auto font-mono text-xs leading-relaxed space-y-3 min-h-[220px] transition-colors"
                style={{ backgroundColor: 'var(--bg-terminal)' }}
              >
                {output.systemLog && (
                  <div 
                    className="border-l-2 pl-2.5 py-0.5 select-none text-[11px]"
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
                  <div className="text-emerald-400 font-medium whitespace-pre-wrap selection:bg-emerald-500/20">
                    {output.stdout}
                  </div>
                )}

                {/* Stderr / Runtime Error */}
                {output.stderr && (
                  <div className="text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 whitespace-pre-wrap">
                    {output.stderr}
                  </div>
                )}

                {/* Compile Error */}
                {output.error && (
                  <div className="text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 whitespace-pre-wrap">
                    {output.error}
                  </div>
                )}

                {!output.stdout && !output.stderr && !output.error && !output.systemLog && (
                  <div className="italic select-none opacity-50" style={{ color: 'var(--text-muted)' }}>
                    Press "Run Code" to compile & execute.
                  </div>
                )}
              </div>

              {/* Output Footer with Execution Metrics */}
              <div 
                className="px-3.5 py-2 border-t flex items-center justify-between text-[11px] font-mono select-none transition-colors"
                style={{
                  backgroundColor: 'var(--bar-bg)',
                  borderColor: 'var(--border-color)'
                }}
              >
                <div className="flex items-center gap-2">
                  {output.success === true ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span>✓</span> {output.executionTime || "0.3s"}
                    </span>
                  ) : output.success === false ? (
                    <span className="text-rose-400 font-semibold">
                      ✗ Failed
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>Ready</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                  <HardDrive size={11} className="opacity-70" />
                  <span>{output.memory || "6.2 MB"}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>

      {/* AI Assistant Pop-up Drawer */}
      {aiResponseModal.isOpen && (
        <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div 
            className="w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] apple-card"
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div 
              className="flex items-center justify-between px-5 py-3.5 border-b"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 text-indigo-400">
                <Sparkles size={16} />
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>compileX AI Response</span>
              </div>
              <button
                onClick={() => setAiResponseModal({ isOpen: false, text: "", loading: false })}
                className="text-xs px-2 py-1 rounded-lg border transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                Close
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto font-sans text-sm leading-relaxed whitespace-pre-wrap flex-1" style={{ color: 'var(--text-primary)' }}>
              {aiResponseModal.loading ? (
                <div className="flex items-center gap-2 text-indigo-400 py-6 justify-center">
                  <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  <span>compileX AI is thinking...</span>
                </div>
              ) : (
                aiResponseModal.text
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
