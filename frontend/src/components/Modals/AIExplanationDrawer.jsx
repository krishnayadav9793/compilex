import React from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, Clock, Database, Lightbulb } from 'lucide-react';

export default function AIExplanationDrawer({ 
  isOpen, 
  onClose, 
  analysisData = null 
}) {
  if (!isOpen || !analysisData) return null;

  const {
    isAccepted = true,
    explanation = "Your solution uses an efficient algorithm to process the input.",
    timeComplexity = "O(n)",
    spaceComplexity = "O(1)",
    feedback = "Great job! Your solution is optimal."
  } = analysisData;

  return (
    <div className="fixed inset-0 z-[9985] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div 
        className="w-full max-w-2xl border rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh] animate-slideUp transition-colors apple-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header */}
        <div 
          className="flex items-center justify-between px-5 sm:px-6 py-4 border-b select-none transition-colors"
          style={{
            backgroundColor: 'var(--bar-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/25">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>compileX AI Explanation</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-semibold">
                  AI Judge
                </span>
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Automated algorithmic complexity & optimization breakdown</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full opacity-70 hover:opacity-100 transition-colors cursor-pointer hover:bg-black/5 dark:hover:bg-white/10"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-sm">
          
          {/* Approach & Intuition */}
          <div 
            className="border rounded-2xl p-4 sm:p-5 leading-relaxed space-y-2 font-sans transition-colors"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              color: 'var(--text-primary)'
            }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1.5">
              <Lightbulb size={14} />
              <span>Intuition & Approach</span>
            </h4>
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {explanation}
            </p>
          </div>

          {/* Complexity Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 font-mono">
            {/* Time Complexity Card */}
            <div 
              className="border rounded-2xl p-4 transition-colors apple-card"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-indigo-500">
                <Clock size={15} />
                <span>TIME COMPLEXITY</span>
              </div>
              <div className="text-xl sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                {timeComplexity}
              </div>
              <p className="text-[11px] font-sans mt-1" style={{ color: 'var(--text-muted)' }}>
                Evaluation based on input size scaling and loops.
              </p>
            </div>

            {/* Space Complexity Card */}
            <div 
              className="border rounded-2xl p-4 transition-colors apple-card"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)'
              }}
            >
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-cyan-500">
                <Database size={15} />
                <span>AUXILIARY SPACE</span>
              </div>
              <div className="text-xl sm:text-2xl font-black" style={{ color: 'var(--text-primary)' }}>
                {spaceComplexity}
              </div>
              <p className="text-[11px] font-sans mt-1" style={{ color: 'var(--text-muted)' }}>
                Heap and stack memory allocated beyond input buffer.
              </p>
            </div>
          </div>

          {/* Verdict Feedback */}
          {feedback && (
            <div 
              className="border rounded-2xl p-4 sm:p-5 flex items-start gap-3 transition-colors"
              style={{
                backgroundColor: isAccepted ? 'rgba(16, 185, 129, 0.06)' : 'rgba(244, 63, 94, 0.06)',
                borderColor: isAccepted ? 'rgba(16, 185, 129, 0.25)' : 'rgba(244, 63, 94, 0.25)'
              }}
            >
              <div className="p-1 rounded-full mt-0.5">
                {isAccepted ? (
                  <CheckCircle2 size={18} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={18} className="text-rose-500" />
                )}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <h5 className="font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {isAccepted ? "Optimal Implementation" : "Alternative Suggestion"}
                </h5>
                <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feedback}
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div 
          className="px-5 sm:px-6 py-3 border-t flex justify-end transition-colors"
          style={{
            backgroundColor: 'var(--bar-bg)',
            borderColor: 'var(--border-color)'
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-xs sm:text-sm cursor-pointer shadow-md apple-button-shiny"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
