import React from 'react';
import { Terminal, Trash2, Cpu } from 'lucide-react';

function Output({ output, setOutput, expectedOutput = "", isCpMode = false }) {
  const clearConsole = () => {
    setOutput({
      stdout: "",
      stderr: "",
      error: "",
      success: null,
      systemLog: "Console cleared."
    });
  };

  const getStatusColor = () => {
    if (output.success === null) return "bg-slate-800 text-slate-400 border border-slate-700";
    if (output.success === false) return "bg-red-500/20 text-red-400 border border-red-500/30";
    
    if (isCpMode) {
      const isAccepted = (output.stdout || "").trim() === (expectedOutput || "").trim();
      return isAccepted 
        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)] animate-pulse"
        : "bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.15)]";
    }
    return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
  };

  const getStatusText = () => {
    if (output.success === null) return "Idle";
    if (output.success === false) return "Error";
    
    if (isCpMode) {
      const isAccepted = (output.stdout || "").trim() === (expectedOutput || "").trim();
      return isAccepted ? "Accepted" : "Wrong Answer";
    }
    return "Success";
  };

  return (
    <div className="flex flex-col h-full w-full">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 select-none font-mono">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-emerald-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
            Console Output
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {/* Clear button */}
          <button
            onClick={clearConsole}
            title="Clear console"
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-xs md:text-sm leading-relaxed space-y-3 bg-black/30">
        
        {/* System logs */}
        {output.systemLog && (
          <div className="text-slate-500 border-l-2 border-slate-700 pl-3 py-0.5 select-none">
            {output.systemLog}
          </div>
        )}

        {/* Compile/Execution Error */}
        {output.error && (
          <div className="text-red-400 bg-red-950/20 border border-red-500/20 rounded-lg p-3">
            <span className="font-bold text-red-500 uppercase block mb-1">
              [COMPILE/SYSTEM ERROR]
            </span>
            <pre className="whitespace-pre-wrap font-mono text-xs">{output.error}</pre>
          </div>
        )}

        {/* Runtime stderr (compiler diagnostics, exceptions) */}
        {output.stderr && (
          <div className="text-amber-400 bg-amber-950/10 border border-amber-500/20 rounded-lg p-3">
            <span className="font-bold text-amber-500 uppercase block mb-1">
              [RUNTIME RUNTIME DIAGNOSTICS]
            </span>
            <pre className="whitespace-pre-wrap font-mono text-xs">{output.stderr}</pre>
          </div>
        )}

        {/* CP verification card */}
        {isCpMode && output.success === true && (
          <div className={`border rounded-xl p-4 mb-4 select-none transition-all duration-300
            ${(output.stdout || "").trim() === (expectedOutput || "").trim()
              ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
              : "bg-rose-950/20 border-rose-500/30 text-rose-300"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              {(output.stdout || "").trim() === (expectedOutput || "").trim() ? (
                <div className="bg-emerald-600/30 border border-emerald-500 p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-emerald-400 animate-bounce" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="bg-rose-600/30 border border-rose-500 p-1.5 rounded-lg">
                  <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div>
                <h4 className="font-extrabold tracking-wide uppercase text-xs font-mono">
                  {(output.stdout || "").trim() === (expectedOutput || "").trim() ? "Accepted" : "Wrong Answer"}
                </h4>
                <p className="text-[10px] text-slate-500 font-medium">Test Case Validation Summary</p>
              </div>
            </div>

            {/* Compare expected vs got */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block mb-1 font-bold">Expected Output</span>
                <pre className="whitespace-pre-wrap font-mono font-bold">{(expectedOutput || "").trim() || "[empty]"}</pre>
              </div>
              <div className="bg-black/40 p-2.5 rounded-lg border border-white/5">
                <span className="text-[9px] text-slate-500 uppercase block mb-1 font-bold">Got Output</span>
                <pre className={`whitespace-pre-wrap font-mono font-bold 
                  ${(output.stdout || "").trim() === (expectedOutput || "").trim() ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {(output.stdout || "").trim() || "[empty]"}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Program standard stdout (for non-CP or CP failure view fallback) */}
        {output.stdout && (!isCpMode || output.success === false) && (
          <div className="text-emerald-300 p-1">
            <pre className="whitespace-pre-wrap font-mono">{output.stdout}</pre>
          </div>
        )}

        {/* Empty state fallback */}
        {!output.stdout && !output.stderr && !output.error && (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 italic select-none py-10">
            <Cpu size={32} className="stroke-[1px] mb-2 text-slate-800 animate-pulse" />
            <p className="text-xs">Awaiting execution output...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Output;
