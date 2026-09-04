import React, { useState } from 'react';
import { 
  FileText, 
  Play, 
  Send, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Copy, 
  Check, 
  HelpCircle,
  Layers,
  Code2
} from 'lucide-react';
import CodeEditor from '../../../components/CodeEditor.jsx';
import LanguageSelector from '../Common/LanguageSelector.jsx';
import { PRESETS, CP_TEMPLATES } from '../../utils/cpPresets';

export default function DynamicCPMode({
  language,
  setLanguage,
  code,
  setCode,
  onResetTemplate,
  problemStatement,
  setProblemStatement,
  input,
  setInput,
  onRunCode,
  onSubmitSolution,
  isRunning,
  isSubmitting,
  lastJudgeResult,
  onOpenAnalysis
}) {
  const [activeTab, setActiveTab] = useState("specs"); // "specs" | "verdict"
  const [mobilePane, setMobilePane] = useState("editor"); // "specs" | "editor"

  const loadPreset = (preset) => {
    setProblemStatement(preset.statement);
    setInput(preset.input);
    if (preset.solutions[language]) {
      setCode(preset.solutions[language]);
    } else if (preset.solutions.cpp) {
      setCode(preset.solutions.cpp);
      setLanguage('cpp');
    }
  };

  const clearForm = () => {
    if (window.confirm("Clear problem statement, test cases, and code?")) {
      setProblemStatement("");
      setInput("");
      setCode("// Write your solution here\n");
    }
  };

  return (
    <div className="flex flex-col flex-1 w-full max-w-[1850px] mx-auto p-3 sm:p-4 lg:p-6 gap-4">
      
      {/* Mobile Tab Switcher */}
      <div 
        className="flex md:hidden items-center justify-center p-1 rounded-xl mb-1 border"
        style={{
          backgroundColor: 'var(--bg-subtle)',
          borderColor: 'var(--border-color)'
        }}
      >
        <button
          onClick={() => setMobilePane("specs")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all
            ${mobilePane === "specs" ? 'bg-indigo-600 text-white' : ''}`}
          style={mobilePane === "specs" ? {} : { color: 'var(--text-secondary)' }}
        >
          Problem & Tests
        </button>
        <button
          onClick={() => setMobilePane("editor")}
          className={`flex-1 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all
            ${mobilePane === "editor" ? 'bg-indigo-600 text-white' : ''}`}
          style={mobilePane === "editor" ? {} : { color: 'var(--text-secondary)' }}
        >
          Code Solution
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 lg:gap-6 flex-1 items-stretch">
        
        {/* ================= LEFT COLUMN: PROBLEM STATEMENT & TESTCASES (5 cols) ================= */}
        <div className={`md:col-span-5 flex-col h-full gap-4 ${mobilePane === 'specs' ? 'flex' : 'hidden md:flex'}`}>
          <div 
            className="flex flex-col h-full backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            
            {/* Top Bar with Presets & Navigation */}
            <div 
              className="p-3 border-b flex flex-col gap-2.5 transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-500">
                    <FileText size={15} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: 'var(--text-primary)' }}>
                    Competitive Programming Setup
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={clearForm}
                    title="Clear All"
                    className="p-1 rounded transition-colors cursor-pointer opacity-60 hover:opacity-100 hover:text-rose-500"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <RotateCcw size={13} />
                  </button>
                </div>
              </div>

              {/* Presets Chips Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
                <span className="font-mono text-[10px] shrink-0" style={{ color: 'var(--text-muted)' }}>Presets:</span>
                {PRESETS.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => loadPreset(p)}
                    className="px-2.5 py-1 rounded-lg border whitespace-nowrap transition-all cursor-pointer font-medium hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {p.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Selector: Specs vs Verdict */}
            <div 
              className="flex border-b px-3"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)'
              }}
            >
              <button
                onClick={() => setActiveTab("specs")}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5
                  ${activeTab === "specs" 
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                    : 'border-transparent hover:text-emerald-500'}`}
                style={activeTab === "specs" ? {} : { color: 'var(--text-secondary)' }}
              >
                <Layers size={13} />
                <span>Problem & Testcases</span>
              </button>

              <button
                onClick={() => setActiveTab("verdict")}
                className={`py-2 px-3 text-xs font-semibold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 relative
                  ${activeTab === "verdict" 
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400' 
                    : 'border-transparent hover:text-purple-500'}`}
                style={activeTab === "verdict" ? {} : { color: 'var(--text-secondary)' }}
              >
                <Sparkles size={13} />
                <span>Verdict & AI Judge</span>
                {lastJudgeResult && (
                  <span className={`w-2 h-2 rounded-full ${lastJudgeResult.isAccepted ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                )}
              </button>
            </div>

            {/* Panel 1: Problem & Testcases Input */}
            {activeTab === "specs" ? (
              <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col font-sans">
                {/* Problem Statement Box */}
                <div className="flex-1 flex flex-col min-h-[220px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <span>1. Problem Statement</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Describe constraints & formats</span>
                  </div>
                  <textarea
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter or paste the problem description here...&#10;E.g.: Given an integer array nums and an integer target, return indices of the two numbers that add up to target."
                    className="flex-1 w-full rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none font-mono leading-relaxed transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-input)',
                      borderWidth: '1px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>

                {/* Testcases Box */}
                <div className="flex-1 flex flex-col min-h-[160px]">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                      <span>2. Test Case Input (stdin)</span>
                      <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Passed to program stdin</span>
                  </div>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter standard input test case data...&#10;E.g.:&#10;9&#10;2 7 11 15"
                    className="flex-1 w-full rounded-xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-none font-mono leading-relaxed transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-input)',
                      borderWidth: '1px',
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>
            ) : (
              /* Panel 2: Verdict & AI Judge Output */
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-mono text-xs">
                {lastJudgeResult ? (
                  <div className="space-y-4">
                    {/* Status Badge */}
                    <div className={`p-4 rounded-xl border flex items-center justify-between
                      ${lastJudgeResult.isAccepted 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                        : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-300'}`}
                    >
                      <div className="flex items-center gap-3">
                        {lastJudgeResult.isAccepted ? (
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        ) : (
                          <XCircle size={24} className="text-rose-500" />
                        )}
                        <div>
                          <span className="text-base font-bold block">
                            {lastJudgeResult.status}
                          </span>
                          <span className="text-[11px] opacity-80">
                            {lastJudgeResult.isAccepted ? "Output matches expected answer" : "Output differs from Gemini judge"}
                          </span>
                        </div>
                      </div>

                      <div className="text-right text-[11px]">
                        <div>{lastJudgeResult.executionTime}</div>
                        <div className="opacity-70">{lastJudgeResult.memory}</div>
                      </div>
                    </div>

                    {/* Output Comparison */}
                    <div className="grid grid-cols-1 gap-3">
                      <div 
                        className="border rounded-xl p-3 transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-terminal)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <span className="text-[10px] block mb-1 uppercase tracking-wider font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          Your Solution Output:
                        </span>
                        <pre className="whitespace-pre-wrap max-h-24 overflow-y-auto font-mono text-xs" style={{ color: 'var(--text-primary)' }}>
                          {lastJudgeResult.userOutput?.trim() || "(empty / no output)"}
                        </pre>
                      </div>

                      <div 
                        className="border rounded-xl p-3 transition-colors"
                        style={{
                          backgroundColor: 'var(--bg-terminal)',
                          borderColor: 'var(--border-color)'
                        }}
                      >
                        <span className="text-purple-600 dark:text-purple-400 text-[10px] block mb-1 uppercase tracking-wider flex items-center gap-1 font-semibold">
                          <Sparkles size={11} />
                          <span>Gemini Expected Output:</span>
                        </span>
                        <pre className="text-emerald-600 dark:text-emerald-400 whitespace-pre-wrap max-h-24 overflow-y-auto font-mono text-xs">
                          {lastJudgeResult.expectedOutput?.trim() || "(not computed)"}
                        </pre>
                      </div>
                    </div>

                    {/* Complexity & Analysis Preview */}
                    <div 
                      className="border rounded-xl p-3.5 space-y-2.5 transition-colors"
                      style={{
                        backgroundColor: 'rgba(147, 51, 234, 0.05)',
                        borderColor: 'rgba(147, 51, 234, 0.2)'
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-purple-600 dark:text-purple-300 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles size={13} />
                          <span>AI Complexity Evaluation</span>
                        </span>
                        <button
                          onClick={onOpenAnalysis}
                          className="text-[11px] text-purple-600 dark:text-purple-300 hover:underline font-semibold cursor-pointer"
                        >
                          Full Breakdown →
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2.5 py-1 rounded font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                          Time: {lastJudgeResult.timeComplexity || "O(n)"}
                        </span>
                        <span className="px-2.5 py-1 rounded font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 border border-cyan-500/20">
                          Space: {lastJudgeResult.spaceComplexity || "O(1)"}
                        </span>
                      </div>

                      <p className="text-[11px] font-sans leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                        {lastJudgeResult.explanation}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Sparkles size={36} className="mx-auto mb-2 opacity-40 text-purple-500" />
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Automated AI Judge Ready</p>
                    <p className="text-xs mt-1 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
                      Click <strong>"Submit Solution"</strong> to run your code, have Gemini verify the expected result, and show the verdict.
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT COLUMN: CODE EDITOR & SUBMISSION ACTIONS (7 cols) ================= */}
        <div className={`md:col-span-7 flex-col h-full gap-4 ${mobilePane === 'editor' ? 'flex' : 'hidden md:flex'}`}>
          <div 
            className="flex flex-col h-full backdrop-blur-xl border rounded-2xl overflow-hidden shadow-2xl transition-colors duration-300"
            style={{
              backgroundColor: 'var(--card-bg)',
              borderColor: 'var(--border-color)'
            }}
          >
            
            {/* Top Action Bar */}
            <div 
              className="relative z-30 px-4 py-2.5 border-b flex flex-wrap items-center justify-between gap-3 select-none transition-colors duration-300"
              style={{
                backgroundColor: 'var(--bar-bg)',
                borderColor: 'var(--border-color)'
              }}
            >
              
              {/* Language Selector & Reset */}
              <div className="flex items-center gap-2">
                <LanguageSelector
                  language={language}
                  setLanguage={setLanguage}
                  disabled={isRunning || isSubmitting}
                  align="left"
                />

                {onResetTemplate && (
                  <button
                    type="button"
                    disabled={isRunning || isSubmitting}
                    onClick={onResetTemplate}
                    title="Reset code to preset solution or default CP template"
                    className="text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5"
                    style={{
                      backgroundColor: 'var(--bg-subtle)',
                      borderColor: 'var(--border-color)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    <RotateCcw size={12} className="text-amber-500" />
                    <span className="hidden sm:inline">Reset Solution</span>
                  </button>
                )}
              </div>

              {/* Action Buttons: Run Code & Submit Solution */}
              <div className="flex items-center gap-2">
                {/* Run Code (Only runs locally) */}
                <button
                  disabled={isRunning || isSubmitting}
                  onClick={onRunCode}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border font-semibold text-xs transition-all cursor-pointer disabled:opacity-50"
                  style={{
                    backgroundColor: 'var(--bg-subtle)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  title="Run code against standard input"
                >
                  <Play size={13} fill="currentColor" />
                  <span>Run Code</span>
                </button>

                {/* Submit Solution (Automated Gemini Judge) */}
                <button
                  disabled={isRunning || isSubmitting}
                  onClick={onSubmitSolution}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  title="Submit code for automated Gemini CP verification"
                >
                  <Send size={13} />
                  <span>Submit Solution</span>
                </button>
              </div>

            </div>

            {/* Monaco Code Editor */}
            <div className="flex-1 min-h-[450px] p-1">
              <CodeEditor language={language} code={code} setCode={setCode} />
            </div>

            {/* Editor Footer Status Bar */}
            <div 
              className="px-4 py-2 border-t flex items-center justify-between text-[11px] font-mono select-none transition-colors"
              style={{
                backgroundColor: 'var(--bg-header)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">● Ready</span>
                <span>UTF-8</span>
                <span className="uppercase">{language}</span>
              </div>
              <div className="hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                Press Run to test, Submit for Gemini AI Judge
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
