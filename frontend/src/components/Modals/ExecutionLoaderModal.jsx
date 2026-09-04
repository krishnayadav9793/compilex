import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, X, Clock, HardDrive, ArrowRight } from 'lucide-react';

export default function ExecutionLoaderModal({ 
  isOpen, 
  status = "compiling", // "compiling" | "accepted" | "wrong_answer" | "error"
  result = null,
  onClose,
  onViewAnalysis
}) {
  useEffect(() => {
    // If successfully finished, keep it open for a moment or allow user interaction
    if (!isOpen) return;
  }, [isOpen, status]);

  if (!isOpen) return null;

  const isCompiling = status === "compiling";
  const isAccepted = status === "accepted";
  const isWrongAnswer = status === "wrong_answer";
  const isError = status === "error";

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {/* Container Card */}
      <div 
        className="relative w-full max-w-md border rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center transition-all duration-300"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          boxShadow: isAccepted 
            ? '0 0 40px rgba(16, 185, 129, 0.25), inset 0 0 20px rgba(16, 185, 129, 0.05)'
            : isWrongAnswer || isError
              ? '0 0 40px rgba(244, 63, 94, 0.25), inset 0 0 20px rgba(244, 63, 94, 0.05)'
              : '0 0 40px rgba(99, 102, 241, 0.25)'
        }}
      >
        {/* Background glow orb */}
        <div 
          className={`absolute -top-20 -left-20 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500
            ${isCompiling ? 'bg-indigo-600/20' : isAccepted ? 'bg-emerald-600/25' : 'bg-rose-600/25'}`} 
        />
        <div 
          className={`absolute -bottom-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500
            ${isCompiling ? 'bg-cyan-600/20' : isAccepted ? 'bg-teal-600/25' : 'bg-amber-600/25'}`} 
        />

        {/* Close Button when not compiling */}
        {!isCompiling && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 opacity-70 hover:opacity-100 p-1 rounded-lg transition-colors cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
          >
            <X size={18} />
          </button>
        )}

        {/* --- PHASE 1: COMPILING / EVALUATING ANIMATION (Mockup Screen 8 Left) --- */}
        {isCompiling && (
          <div className="flex flex-col items-center py-4 w-full">
            {/* Pulsing Spinner Ring */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 border-r-cyan-500 animate-spin" />
              <div className="absolute w-12 h-12 rounded-full border-2 border-purple-500/30 border-b-purple-400 animate-spin-slow" />
              <div className="absolute w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-75" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Compiling your code...
            </h3>
            <p className="text-sm mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Almost there! Running testcases with automated AI judge.
            </p>

            {/* Glowing progress bar */}
            <div 
              className="w-full h-1.5 rounded-full overflow-hidden border relative"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 rounded-full animate-pulse w-3/4 animate-shimmer" />
            </div>
          </div>
        )}

        {/* --- PHASE 2: ACCEPTED / EXECUTION SUCCESSFUL (Mockup Screen 8 Right) --- */}
        {isAccepted && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            {/* Glowing Green Checkmark */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-3 bg-emerald-500/30 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={46} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>

            {/* Header */}
            <h3 className="text-2xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Execution Successful!
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 font-mono">
              ★ Accepted • All Testcases Passed
            </p>

            {/* Metrics Chips */}
            <div 
              className="flex items-center justify-center gap-4 border rounded-xl px-5 py-3 mb-6 w-full font-mono text-xs transition-colors"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <Clock size={14} className="text-emerald-500" />
                <span>Time: <strong style={{ color: 'var(--text-primary)' }}>{result?.executionTime || "0.3s"}</strong></span>
              </div>
              <div className="h-4 w-[1px]" style={{ backgroundColor: 'var(--border-color)' }} />
              <div className="flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                <HardDrive size={14} className="text-emerald-500" />
                <span>Memory: <strong style={{ color: 'var(--text-primary)' }}>{result?.memory || "6.1 MB"}</strong></span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {onViewAnalysis && (
                <button
                  onClick={onViewAnalysis}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>View AI Explanation</span>
                  <ArrowRight size={14} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* --- PHASE 2 (Variant): WRONG ANSWER --- */}
        {isWrongAnswer && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-3 bg-rose-500/30 rounded-full blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <XCircle size={46} className="text-rose-500" />
              </div>
            </div>

            <h3 className="text-2xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Wrong Answer
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-5 font-mono">
              Output does not match expected result
            </p>

            {/* Diff Preview */}
            <div 
              className="w-full border rounded-xl p-3 mb-6 text-left font-mono text-xs space-y-2 transition-colors"
              style={{
                backgroundColor: 'var(--bg-terminal)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div>
                <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Your Output:</span>
                <span className="text-rose-600 dark:text-rose-300 font-semibold">{result?.userOutput?.trim() || "(empty)"}</span>
              </div>
              <div className="border-t pt-2" style={{ borderColor: 'var(--border-color)' }}>
                <span className="block text-[10px] uppercase font-semibold" style={{ color: 'var(--text-muted)' }}>Expected Output (Gemini Judge):</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{result?.expectedOutput?.trim() || "(not computed)"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              {onViewAnalysis && (
                <button
                  onClick={onViewAnalysis}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles size={15} />
                  <span>Ask AI for Hint</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl border font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                style={{
                  backgroundColor: 'var(--bg-subtle)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                Back to Code
              </button>
            </div>
          </div>
        )}

        {/* --- PHASE 2 (Variant): ERROR --- */}
        {isError && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-500">
                <AlertTriangle size={44} className="text-amber-500" />
              </div>
            </div>

            <h3 className="text-xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {result?.status || "Compilation Error"}
            </h3>
            <p className="text-xs text-amber-600 dark:text-amber-400 mb-4 font-mono">
              Execution could not complete cleanly
            </p>

            <div 
              className="w-full max-h-36 overflow-y-auto border rounded-xl p-3 mb-6 text-left font-mono text-xs text-amber-600 dark:text-amber-300 whitespace-pre-wrap transition-colors"
              style={{
                backgroundColor: 'var(--bg-terminal)',
                borderColor: 'var(--border-color)'
              }}
            >
              {result?.error || result?.userOutput || "Unknown runtime error occurred."}
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl border font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              Dismiss & Fix Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
