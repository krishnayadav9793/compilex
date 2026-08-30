import React from 'react';
import { Terminal } from 'lucide-react';

function Input({ input, setInput }) {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5 select-none">
        <Terminal size={14} className="text-blue-400" />
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
          Standard Input (stdin)
        </span>
      </div>
      
      {/* Textarea container */}
      <div className="flex-1 p-3">
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Provide inputs to read during execution (e.g. prompt variables or parameters)..."
          className="w-full h-full min-h-[120px] bg-transparent outline-none border-0 text-slate-200 placeholder:text-slate-600 font-mono text-sm leading-relaxed resize-none p-1"
        />
      </div>
    </div>
  );
}

export default Input;
