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
    <div className="fixed inset-0 z-[9985] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-3xl border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors duration-300"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-color)'
        }}
      >
        
        {/* Header */}
        <div 
          className="flex items-center justify-between px-6 py-4 border-b select-none transition-colors"
          style={{
            backgroundColor: 'var(--bg-header)',
            borderColor: 'var(--border-color)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <History size={18} className="text-cyan-500" />
            <h2 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              Submission History
            </h2>
            <span 
              className="text-xs px-2 py-0.5 rounded-full font-mono border"
              style={{
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-muted)'
              }}
            >
              {submissions.length} total
            </span>
          </div>

          <div className="flex items-center gap-3">
            {submissions.length > 0 && onClearHistory && (
              <button
                onClick={onClearHistory}
                title="Clear all submissions"
                className="text-xs flex items-center gap-1 transition-colors cursor-pointer opacity-70 hover:opacity-100 hover:text-rose-500"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Trash2 size={13} />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg transition-colors cursor-pointer opacity-70 hover:opacity-100"
              style={{ color: 'var(--text-primary)' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div 
          className="px-6 py-3 border-b flex items-center gap-3 text-xs transition-colors"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-color)'
          }}
        >
          <Filter size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ color: 'var(--text-secondary)' }}>Filter:</span>
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer
              ${filterStatus === "all" ? 'bg-indigo-600 text-white' : 'hover:opacity-100 opacity-70'}`}
            style={filterStatus === "all" ? {} : { color: 'var(--text-secondary)' }}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus("accepted")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer
              ${filterStatus === "accepted" ? 'bg-emerald-600 text-white' : 'hover:opacity-100 opacity-70'}`}
            style={filterStatus === "accepted" ? {} : { color: 'var(--text-secondary)' }}
          >
            Accepted
          </button>
          <button
            onClick={() => setFilterStatus("wrong_answer")}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer
              ${filterStatus === "wrong_answer" ? 'bg-rose-600 text-white' : 'hover:opacity-100 opacity-70'}`}
            style={filterStatus === "wrong_answer" ? {} : { color: 'var(--text-secondary)' }}
          >
            Wrong Answer
          </button>
        </div>

        {/* Submissions Table / List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-sm" style={{ color: 'var(--text-muted)' }}>
              <Clock size={36} className="mx-auto mb-2 opacity-40" />
              <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>No submissions recorded yet.</p>
              <p className="text-xs mt-1">Submit your code in CP Mode to track real-time verdicts!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((sub, idx) => {
                const isAcc = sub.status?.toLowerCase() === "accepted";
                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border transition-all gap-2"
                    style={{
                      backgroundColor: 'var(--bg-input)',
                      borderColor: 'var(--border-input)'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {isAcc ? (
                        <CheckCircle size={18} className="text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle size={18} className="text-rose-500 shrink-0" />
                      )}
                      <div>
                        <span className="font-semibold text-sm block" style={{ color: 'var(--text-primary)' }}>
                          {sub.title || "Competitive Programming Solution"}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                          <span className="uppercase">{sub.language || "cpp"}</span>
                          <span>•</span>
                          <span>{sub.timestamp || "Just now"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono self-end sm:self-auto">
                      <span className={`px-2.5 py-0.5 rounded-md font-bold uppercase tracking-wider text-[10px]
                        ${isAcc 
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30' 
                          : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'}`}
                      >
                        {sub.status}
                      </span>
                      <div className="text-[11px] flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                        <span>{sub.executionTime || "0.3s"}</span>
                        <span>|</span>
                        <span>{sub.memory || "6.1 MB"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            className="px-4 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-colors"
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
