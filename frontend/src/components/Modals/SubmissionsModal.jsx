import React, { useState } from 'react';
import { History, X, CheckCircle, XCircle, Clock, Filter, Trash2 } from 'lucide-react';

export default function SubmissionsModal({ 
  isOpen, 
  onClose, 
  submissions = [], 
  onClearHistory 
}) {
  const [filterStatus, setFilterStatus] = useState("all");

  if (!isOpen) return null;

  const filtered = submissions.filter(item => {
    if (filterStatus === "all") return true;
    if (filterStatus === "accepted") return item.status?.toLowerCase() === "accepted";
    if (filterStatus === "wrong_answer") return item.status?.toLowerCase().includes("wrong");
    return true;
  });

  return (
    <div className="fixed inset-0 z-[9985] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-3xl border rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-colors duration-300 apple-card"
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)'
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
            <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-500">
              <History size={16} />
            </div>
            <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Submission History
            </h2>
            <span 
              className="text-xs px-2.5 py-0.5 rounded-full font-mono border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)'
              }}
            >
              {submissions.length} total
            </span>
          </div>

          <div className="flex items-center gap-2">
            {submissions.length > 0 && onClearHistory && (
              <button
                onClick={onClearHistory}
                title="Clear all submissions"
                className="text-xs flex items-center gap-1 transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:text-rose-500 px-2.5 py-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: 'var(--text-primary)' }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div 
          className="px-5 sm:px-6 py-3 border-b flex items-center gap-2 sm:gap-3 text-xs transition-colors overflow-x-auto"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-1.5 font-medium shrink-0" style={{ color: 'var(--text-muted)' }}>
            <Filter size={13} />
            <span>Filter:</span>
          </div>

          <div className="flex items-center gap-1.5">
            {[
              { id: "all", label: "All Runs" },
              { id: "accepted", label: "Accepted" },
              { id: "wrong_answer", label: "Wrong Answer" }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all whitespace-nowrap
                  ${filterStatus === f.id 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'border opacity-70 hover:opacity-100'}`}
                style={filterStatus === f.id ? {} : {
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-secondary)'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <History size={36} className="mx-auto mb-2 opacity-30 text-cyan-500" />
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>No submissions recorded</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                Solve CP challenges or execute runs to see them logged here.
              </p>
            </div>
          ) : (
            filtered.map((item, index) => {
              const isAcc = item.status?.toLowerCase() === "accepted";
              return (
                <div 
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all gap-2.5 apple-card"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full shrink-0">
                      {isAcc ? (
                        <CheckCircle size={18} className="text-emerald-500" />
                      ) : (
                        <XCircle size={18} className="text-rose-500" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold leading-snug" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        <span className="uppercase px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                          {item.language}
                        </span>
                        <span>•</span>
                        <span>{item.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 justify-end text-xs font-mono">
                    <div className="text-right">
                      <div style={{ color: 'var(--text-primary)' }}>{item.executionTime}</div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{item.memory}</div>
                    </div>
                    
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border
                      ${isAcc 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/25'}`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              );
            })
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
            className="px-5 py-1.5 rounded-full border font-medium text-xs sm:text-sm cursor-pointer apple-button-shiny"
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
    </div>
  );
}
