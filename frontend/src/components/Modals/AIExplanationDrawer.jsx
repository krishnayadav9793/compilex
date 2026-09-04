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
    isOptimal = true,
    feedback = "Great job! Your solution is optimal."
  } = analysisData;

  return (
    <div className="fixed inset-0 z-[9985] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div 
        className="w-full max-w-2xl border rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-slideUp transition-colors"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          color: 'var(--text-primary)'
        }}
      >
        
        {/* Header (Mockup Screen 9 style) */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b select-none transition-colors"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-500 border border-purple-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span>AI Explanation</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30 font-semibold">
                  Gemini 2.5
                </span>
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Automated algorithmic analysis & complexity metrics</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-colors cursor-pointer"
            style={{ color: 'var(--text-primary)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          
          {/* Natural Language Explanation */}
          <div 
            className="border rounded-xl p-4 sm:p-5 leading-relaxed space-y-3 font-sans transition-colors"
            style={{
              backgroundColor: 'var(--bg-input)',
              borderColor: 'var(--border-input)',
              color: 'var(--text-primary)'
            }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 font-mono flex items-center gap-1.5">
              <span>Intuition & Approach</span>
            </h4>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {explanation}
            </p>
          </div>

          {/* Complexity Cards (Mockup Screen 9) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time Complexity */}
            <div 
              className="border rounded-xl p-4 flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: 'rgba(99, 102, 241, 0.08)',
                borderColor: 'rgba(99, 102, 241, 0.25)'
              }}
            >
              <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                <Clock size={20} />
              </div>
              <div>
                <span className="text-xs block font-mono" style={{ color: 'var(--text-muted)' }}>Time Complexity</span>
                <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-300">
                  {timeComplexity}
                </span>
              </div>
            </div>

            {/* Space Complexity */}
            <div 
              className="border rounded-xl p-4 flex items-center gap-3 transition-colors"
              style={{
                backgroundColor: 'rgba(6, 182, 212, 0.08)',
                borderColor: 'rgba(6, 182, 212, 0.25)'
              }}
            >
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                <Database size={20} />
              </div>
              <div>
                <span className="text-xs block font-mono" style={{ color: 'var(--text-muted)' }}>Space Complexity</span>
                <span className="text-lg font-bold font-mono text-cyan-600 dark:text-cyan-300">
                  {spaceComplexity}
                </span>
              </div>
            </div>
          </div>

          {/* Feedback / Optimal Callout Banner (Mockup Screen 9 bottom pill) */}
          <div 
            className="rounded-xl p-4 border flex items-start gap-3 transition-all"
            style={{
              backgroundColor: isOptimal ? 'rgba(16, 185, 129, 0.08)' : 'rgba(245, 158, 11, 0.08)',
              borderColor: isOptimal ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'
            }}
          >
            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5
              ${isOptimal ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
              <Lightbulb size={18} />
            </div>
            <div>
              <span className={`font-bold text-sm block mb-0.5
                ${isOptimal ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>
                {isOptimal ? "Optimal Solution Detected" : "Optimization Opportunity"}
              </span>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {feedback}
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div 
          className="px-6 py-3 border-t flex justify-end transition-colors"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-color)'
          }}
        >
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}
