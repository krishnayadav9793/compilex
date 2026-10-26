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
 * Header Component for compileX IDE
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
    <header 
      className="flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-6 min-h-[56px] sm:min-h-[64px] backdrop-blur-xl border-b z-[100] transition-colors duration-300 gap-3 sm:gap-4 overflow-visible"
      style={{
        backgroundColor: 'var(--bg-header)',
        borderColor: 'var(--border-color)'
      }}
    >
      
      {/* Brand & Primary Actions */}
      <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-2 group cursor-pointer mr-2 select-none">
          <div className="p-1.5 rounded-lg transition-colors shadow-lg font-mono" style={{ backgroundColor: 'var(--accent-primary)', color: 'var(--bg-primary)' }}>
            <Code2 size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight select-none font-sans" style={{ color: 'var(--text-primary)' }}>
              compileX
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider font-mono -mt-1 opacity-70" style={{ color: 'var(--accent-primary)' }}>
              v2.0 IDE
            </span>
          </div>
        </div>

        {/* Run Button */}
        <button 
          disabled={isRunning || isSubmitting}
          onClick={executeCode}
          className={`flex items-center justify-center gap-2 px-5 py-2 rounded-xl transition-all font-semibold text-xs sm:text-sm tracking-wide cursor-pointer font-sans duration-200 active:scale-95 apple-button-shiny
            ${isCpMode 
              ? 'opacity-80 hover:opacity-100' 
              : isRunning 
                ? 'opacity-70 cursor-not-allowed'
                : 'shadow-md'
            }`}
          style={{
            backgroundColor: isCpMode ? 'var(--bg-subtle)' : 'var(--accent-primary)',
            color: isCpMode ? 'var(--text-secondary)' : 'var(--bg-primary)',
            border: '1px solid var(--border-color)'
          }}
        >
          {isRunning ? (
            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-current border-t-transparent" />
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
            className="flex items-center justify-center gap-2 px-6 py-2 rounded-xl transition-all font-bold text-xs sm:text-sm tracking-wide cursor-pointer font-sans duration-200 active:scale-95 shadow-md apple-button-shiny"
            style={{
              backgroundColor: 'var(--primary-olive, #10b981)',
              color: '#ffffff',
              border: '1px solid var(--border-color)'
            }}
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
      <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto overflow-visible">
        
        {/* CP Mode Toggle */}
        <button 
          onClick={toggleCpMode}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl border transition-all duration-300 font-medium text-xs sm:text-sm group cursor-pointer font-sans apple-button-shiny"
          style={{
            backgroundColor: isCpMode ? 'var(--bg-tab-active)' : 'var(--bg-subtle)',
            borderColor: isCpMode ? 'var(--border-active)' : 'var(--border-color)',
            color: 'var(--text-primary)'
          }}
        >
          <Trophy size={14} className={isCpMode ? 'text-amber-500' : 'opacity-60'} />
          <span className="tracking-wide">CP Mode</span>
          
          <div className="relative flex items-center justify-center">
            {isCpMode && (
              <div className="absolute w-3 h-3 bg-amber-400/30 rounded-full animate-ping"></div>
            )}
            <div className={`w-2 h-2 rounded-full transition-all duration-500 
              ${isCpMode 
                ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]' 
                : 'bg-neutral-500 shadow-none'
              }`}>
            </div>
          </div>
        </button>

        {/* Custom Language Selection Dropdown (Zero layout shift on open) */}
        <div className="relative inline-flex items-center font-mono overflow-visible" ref={dropdownRef}>
          <button 
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between gap-2.5 h-9 px-3.5 rounded-xl border text-xs sm:text-sm font-semibold font-mono outline-none cursor-pointer transition-all duration-200 select-none apple-button-shiny"
            style={{
              backgroundColor: isDropdownOpen ? 'var(--bg-tab-active)' : 'var(--bg-subtle)',
              borderColor: isDropdownOpen ? 'var(--border-active)' : 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[9px] uppercase tracking-widest select-none opacity-60" style={{ color: 'var(--text-secondary)' }}>Language</span>
              <span style={{ color: 'var(--text-primary)' }}>{LANGUAGES[language] || language}</span>
            </div>
            <ChevronDown size={13} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--text-secondary)' }} />
          </button>
          
          {isDropdownOpen && (
            <div 
              className="absolute top-full right-0 mt-1.5 w-48 rounded-xl border shadow-2xl z-[999] overflow-hidden backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150 apple-card pointer-events-auto"
              style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                zIndex: 999,
                backgroundColor: 'var(--bg-surface-elevated)',
                borderColor: 'var(--border-color)'
              }}
            >
              {Object.entries(LANGUAGES).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setLanguage(key);
                    setIsDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors border-b last:border-0 font-mono font-medium
                    ${language === key 
                      ? 'font-bold' 
                      : 'hover:bg-black/5 dark:hover:bg-white/5'
                    }`}
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: language === key ? 'var(--bg-tab-active)' : 'transparent',
                    color: 'var(--text-primary)'
                  }}
                >
                  <span>{label}</span>
                  {language === key && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }}></span>}
                </button>
              ))}
            </div>
          )}
        </div>

        <button 
          type="button"
          className="p-2 rounded-xl transition-all cursor-pointer border apple-button-shiny"
          style={{
            backgroundColor: 'var(--bg-subtle)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-secondary)'
          }}
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
