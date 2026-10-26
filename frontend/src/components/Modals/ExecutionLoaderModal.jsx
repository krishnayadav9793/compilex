import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, Sparkles, X, Clock, HardDrive, ArrowRight } from 'lucide-react';

export default function ExecutionLoaderModal({ 
  isOpen, 
  status = "compiling", // "compiling" | "accepted" | "wrong_answer" | "error"
  result = null,
  onClose,
  onViewAnalysis
}) {
  if (!isOpen) return null;

  const isCompiling = status === "compiling";
  const isAccepted = status === "accepted";
  const isWrongAnswer = status === "wrong_answer";
  const isError = status === "error";

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md transition-all duration-300 animate-fadeIn">
      {/* Container Card */}
      <div 
        className="relative w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col items-center text-center transition-all duration-300 apple-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Background ambient lighting */}
        <div 
          className={`absolute -top-24 -left-24 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-colors duration-500
            ${isCompiling ? 'bg-indigo-600/25' : isAccepted ? 'bg-emerald-600/30' : 'bg-rose-600/30'}`} 
        />
        <div 
          className={`absolute -bottom-24 -right-24 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-colors duration-500
            ${isCompiling ? 'bg-cyan-600/25' : isAccepted ? 'bg-teal-600/30' : 'bg-amber-600/30'}`} 
        />

        {/* Close Button when finished */}
        {!isCompiling && (
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full opacity-70 hover:opacity-100 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        )}

        {/* --- PHASE 1: COMPILING / EVALUATING --- */}
        {isCompiling && (
          <div className="flex flex-col items-center py-4 w-full">
            {/* Apple Pulsing Spinner Ring */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-[3px] border-indigo-500/20 border-t-indigo-500 border-r-cyan-400 animate-spin" />
              <div className="absolute w-10 h-10 rounded-full border-2 border-purple-500/20 border-b-purple-400 animate-spin-slow" />
              <div className="absolute w-3 h-3 rounded-full bg-cyan-400 animate-ping opacity-80" />
            </div>

            {/* Title & Subtitle */}
            <h3 className="text-xl sm:text-2xl font-bold mb-2 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Executing on compileX...
            </h3>
            <p className="text-xs sm:text-sm mb-6 font-medium" style={{ color: 'var(--text-secondary)' }}>
              Compiling in sandbox and evaluating testcases.
            </p>

            {/* Glowing progress bar */}
            <div 
              className="w-full h-1.5 rounded-full overflow-hidden border relative"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="h-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-pink-500 rounded-full animate-pulse w-3/4 animate-shimmer" />
            </div>
          </div>
        )}

        {/* --- PHASE 2: ACCEPTED / EXECUTION SUCCESSFUL --- */}
        {isAccepted && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            {/* Glowing Green Checkmark */}
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-3 bg-emerald-500/25 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={38} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>
            </div>

            {/* Header */}
            <h3 className="text-2xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Execution Successful
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-6 font-mono">
              ★ Accepted • Tests Passed
            </p>

            {/* Metrics Chips */}
            <div 
              className="flex items-center justify-center gap-4 border rounded-2xl px-5 py-3 mb-6 w-full font-mono text-xs transition-colors"
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
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              {onViewAnalysis && (
                <button
                  onClick={onViewAnalysis}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer apple-button-shiny"
                >
                  <Sparkles size={14} />
                  <span>View AI Explanation</span>
                  <ArrowRight size={13} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-full border font-medium text-xs sm:text-sm transition-colors cursor-pointer apple-button-shiny"
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

        {/* --- PHASE 3: WRONG ANSWER --- */}
        {isWrongAnswer && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-3 bg-amber-500/25 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                <AlertTriangle size={38} className="text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>
            </div>

            <h3 className="text-2xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Wrong Answer
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-6 font-mono">
              Output mismatched expected verdict
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
              {onViewAnalysis && (
                <button
                  onClick={onViewAnalysis}
                  className="w-full py-2.5 px-4 rounded-full bg-gradient-to-r from-amber-600 to-rose-600 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer apple-button-shiny"
                >
                  <Sparkles size={14} />
                  <span>Inspect Discrepancy</span>
                  <ArrowRight size={13} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-full border font-medium text-xs sm:text-sm transition-colors cursor-pointer apple-button-shiny"
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

        {/* --- PHASE 4: RUNTIME / COMPILATION ERROR --- */}
        {isError && (
          <div className="flex flex-col items-center py-2 w-full animate-scaleUp">
            <div className="relative mb-5 flex items-center justify-center">
              <div className="absolute -inset-3 bg-rose-500/25 rounded-full blur-xl animate-pulse" />
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border-2 border-rose-500 flex items-center justify-center text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                <XCircle size={38} className="text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
              </div>
            </div>

            <h3 className="text-2xl font-black mb-1 tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Execution Failed
            </h3>
            <p className="text-xs font-semibold uppercase tracking-widest text-rose-600 dark:text-rose-400 mb-4 font-mono">
              {result?.status || "Runtime / Syntax Error"}
            </p>

            {result?.error && (
              <div 
                className="w-full max-h-24 overflow-y-auto p-3 rounded-xl border text-[11px] font-mono text-left mb-6 whitespace-pre-wrap"
                style={{
                  backgroundColor: 'var(--bg-terminal)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                {result.error}
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-full border font-medium text-xs sm:text-sm transition-colors cursor-pointer apple-button-shiny"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              Back to Code
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
