import React, { useState } from 'react';
import { 
  Trophy, 
  Play, 
  Code2, 
  Settings 
} from 'lucide-react';

/**
 * Header Component for NexusCode IDE
 * * Props:
 * @param {Function} setterForOutput - Updates the parent's output state with execution results.
 * @param {Function} setLanguage - Handles the onChange event for the language selector.
 * @param {string} code - The current source code to be sent to the backend.
 * @param {boolean} isCpMode - Boolean state indicating if Competitive Programming mode is active.
 * @param {Function} toggleCpMode - Function to flip the isCpMode state.
 */
function Header({ setterForOutput, setLanguage, code, isCpMode, toggleCpMode }) {
  const [isRunning, setIsRunning] = useState(false);
  
  /**
   * executeCode
   * Communicates with the local Node.js/Express backend to run the code.
   * Manages a local 'isRunning' state to provide visual feedback and prevent 
   * duplicate requests during pending execution.
   */
  const executeCode = async (codeSnippet) => {
    setIsRunning(true);
    try {
      const languageValue = document.getElementById("language-select").value;
      
      const execution = await fetch("http://localhost:3000/run", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code: codeSnippet, 
          language: languageValue 
        })
      });

      if (!execution.ok) {
        throw new Error(`Server responded with ${execution.status}`);
      }

      const res = await execution.json();
      setterForOutput(res.output);
    } catch (e) {
      console.error("Execution Error:", e);
      setterForOutput(`Error: ${e.message}. Ensure backend is running on port 3000.`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <header className='flex flex-col sm:flex-row justify-between items-center w-full px-6 py-3 bg-white/5 backdrop-blur-md border-b border-white/10 z-[100] transition-all gap-4'>
      
      {/* Brand & Primary Action */}
      <div className='flex items-center gap-6 w-full sm:w-auto'>
        <div className="hidden md:flex items-center gap-2 group cursor-pointer">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors">
            <Code2 size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent select-none">
            NexusCode
          </span>
        </div>

        <button 
          disabled={isRunning}
          className={`flex items-center justify-center gap-2 text-white w-full sm:w-auto px-8 py-2.5 rounded-xl transition-all font-semibold tracking-wide
            ${isRunning 
              ? 'bg-slate-700 cursor-not-allowed opacity-80' 
              : 'bg-green-600 hover:bg-green-500 border border-green-500/50 hover:border-green-400 shadow-[0_0_15px_rgba(22,163,74,0.3)] hover:shadow-[0_0_20px_rgba(22,163,74,0.5)] active:scale-95'
            }`}
          onClick={() => executeCode(code)}
        >
          {isRunning ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
          ) : (
            <Play size={16} fill="currentColor" />
          )}
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </button>
      </div>

      {/* Configuration & Layout Controls */}
      <div className='flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto'>
        
        {/* CP Mode Toggle */}
        <button 
          onClick={toggleCpMode}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-300 font-medium text-sm group
            ${isCpMode 
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
        >
          <Trophy size={16} className={`${isCpMode ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' : 'text-slate-500'}`} />
          <span className="hidden xs:inline tracking-wide">CP Mode</span>
          
          <div className="relative flex items-center justify-center">
            {isCpMode && (
              <div className="absolute w-3 h-3 bg-amber-400/30 rounded-full animate-ping"></div>
            )}
            <div className={`w-2 h-2 rounded-full transition-all duration-500 
              ${isCpMode 
                ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,1)] animate-pulse' 
                : 'bg-slate-600 shadow-none'
              }`}>
            </div>
          </div>
        </button>
        {/* Language Selection */}
        <div className='flex items-center gap-2 bg-slate-900/80 border border-slate-700 px-3 py-1 rounded-xl transition-colors focus-within:ring-2 focus-within:ring-indigo-500/50'>
          <label htmlFor="language-select" className="text-slate-500 font-bold text-[10px] uppercase tracking-widest hidden lg:block">
            Engine
          </label>
          <select 
            id="language-select" 
            defaultValue="javascript" 
            className='bg-transparent text-slate-200 text-sm py-1.5 outline-none cursor-pointer min-w-[120px]'
            onChange={(e) => setLanguage(e)}
          >
            <option value="javascript" className="bg-slate-900">JavaScript</option>
            <option value="python" className="bg-slate-900">Python 3</option>
            <option value="java" className="bg-slate-900">Java</option>
            <option value="cpp" className="bg-slate-900">C++</option>
          </select>
        </div>

        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
          <Settings size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;