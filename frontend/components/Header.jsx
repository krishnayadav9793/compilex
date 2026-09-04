import React, { useState, useRef, useEffect } from 'react';
import { 
  Trophy, 
  Play, 
  Code2, 
  Settings,
  Sparkles,
  ChevronDown
} from 'lucide-react';

/**
 * Header Component for NexusCode IDE
 */
function Header({ isCpMode, toggleCpMode, language, setLanguage, executeCode, isRunning, submitCode, isSubmitting }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const LANGUAGES = {
    javascript: "JavaScript",
    python: "Python 3",
    java: "Java",
    cpp: "C++",
    c: "C"
  };

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center w-full px-6 py-3 bg-slate-900/40 backdrop-blur-md border-b border-white/10 z-[100] transition-all gap-4">
      
      {/* Brand & Primary Actions */}
      <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2 group cursor-pointer mr-2 select-none">
          <div className="bg-indigo-600 p-1.5 rounded-lg group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 font-mono">
            <Code2 size={20} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent select-none font-sans">
              NexusCode
            </span>
            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider font-mono -mt-1">
              v2.0 IDE
            </span>
          </div>
        </div>

        {/* Run Button */}
        <button 
          disabled={isRunning || isSubmitting}
          onClick={executeCode}
          className={`flex items-center justify-center gap-2 text-white px-5 py-2 rounded-xl transition-all font-semibold text-xs sm:text-sm tracking-wide cursor-pointer font-sans duration-200 active:scale-95
            ${isCpMode 
              ? 'bg-slate-800/80 border border-slate-700 text-slate-350 hover:border-slate-500 hover:text-slate-100 hover:bg-slate-850/80' 
              : isRunning 
                ? 'bg-slate-850 border border-slate-800 text-slate-500 cursor-not-allowed opacity-80'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.25)] hover:shadow-[0_0_20px_rgba(79,70,229,0.45)] border border-indigo-500/50'
            }`}
        >
          {isRunning ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
          ) : (
            <Play size={13} fill="currentColor" />
          )}
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>

        {/* Submit Button (Only in CP Mode) */}
        {isCpMode && (
          <button 
            disabled={isRunning || isSubmitting}
            onClick={submitCode}
            className={`flex items-center justify-center gap-2 text-white px-6 py-2 rounded-xl transition-all font-bold text-xs sm:text-sm tracking-wide cursor-pointer font-sans duration-200 active:scale-95
              ${isSubmitting 
                ? 'bg-slate-850 border border-slate-800 text-slate-500 cursor-not-allowed opacity-80'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)] hover:shadow-[0_0_20px_rgba(16,185,129,0.45)] border border-emerald-500/50'
              }`}
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white/30 border-t-white" />
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span>{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </button>
        )}
      </div>

      {/* Configuration & Layout Controls */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 w-full sm:w-auto">
        
        {/* CP Mode Toggle */}
        <button 
          onClick={toggleCpMode}
          className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 font-medium text-xs sm:text-sm group cursor-pointer font-sans
            ${isCpMode 
              ? 'bg-amber-500/10 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:bg-amber-500/15' 
              : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
            }`}
        >
          <Trophy size={14} className={`${isCpMode ? 'text-amber-400 drop-shadow-[0_0_4px_rgba(245,158,11,0.5)]' : 'text-slate-500'}`} />
          <span className="tracking-wide">CP Mode</span>
          
          <div className="relative flex items-center justify-center">
            {isCpMode && (
              <div className="absolute w-3 h-3 bg-amber-400/30 rounded-full animate-ping"></div>
            )}
            <div className={`w-2 h-2 rounded-full transition-all duration-500 
              ${isCpMode 
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]' 
                : 'bg-slate-600 shadow-none'
              }`}>
            </div>
          </div>
        </button>

        {/* Custom Language Selection Dropdown */}
        <div className="relative font-mono" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-3 bg-slate-900/80 border border-slate-750 hover:border-slate-500 px-4 py-2 rounded-xl text-slate-200 text-xs sm:text-sm font-semibold font-mono outline-none cursor-pointer transition-all duration-200 select-none shadow-md hover:shadow-lg focus:ring-2 focus:ring-indigo-500/50"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
              <span className="text-[9px] text-slate-500 uppercase tracking-widest mr-1 select-none">Language</span>
              <span className="text-slate-200">{LANGUAGES[language] || language}</span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-slate-950/95 border border-white/10 rounded-xl shadow-2xl z-[200] overflow-hidden backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
              {Object.entries(LANGUAGES).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => {
                    setLanguage(key);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-4 py-3 text-xs text-left cursor-pointer transition-all border-b border-white/[0.03] last:border-0 font-mono font-medium
                    ${language === key 
                      ? 'bg-indigo-600/90 text-white font-bold' 
                      : 'text-slate-350 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  <span>{label}</span>
                  {language === key && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;