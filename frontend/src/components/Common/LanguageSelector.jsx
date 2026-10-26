import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Cpu, ShieldCheck } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../utils/supportedLanguages';

export default function LanguageSelector({
  language,
  setLanguage,
  disabled = false,
  align = 'left' // 'left' | 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const current = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleSelect = (langId) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-flex items-center text-left shrink-0 overflow-visible" ref={containerRef}>
      
      {/* ================= ULTRA-CLASSY GLASSY TRIGGER BUTTON ================= */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative flex items-center gap-2 h-8.5 px-3 rounded-full transition-all duration-200 cursor-pointer select-none glassy-trigger
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
        style={isOpen ? {
          boxShadow: '0 0 0 2px rgba(99, 102, 241, 0.4), 0 4px 16px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
          borderColor: 'rgba(99, 102, 241, 0.6)'
        } : {}}
      >
        {/* Language Icon with Glowing Micro-Badge */}
        <div 
          className="relative flex items-center justify-center shrink-0 w-5.5 h-5.5 rounded-lg p-0.5 transition-transform duration-200 group-hover:scale-105"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            boxShadow: `0 0 10px ${current.glowColor || 'rgba(255, 255, 255, 0.15)'}`
          }}
        >
          {current.icon}
        </div>

        {/* Selected Language Name & Version */}
        <div className="flex items-center gap-1.5">
          <span 
            className="text-xs font-semibold tracking-tight transition-colors"
            style={{ color: 'var(--text-primary)' }}
          >
            {current.name}
          </span>
          <span 
            className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.2 rounded-md border transition-colors opacity-75"
            style={{ 
              backgroundColor: 'var(--bg-subtle)', 
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {current.version}
          </span>
        </div>

        {/* Dynamic Chevron with Spring Rotate */}
        <ChevronDown 
          size={13} 
          className={`transition-transform duration-300 ease-out ml-0.5 opacity-60 group-hover:opacity-100
            ${isOpen ? 'rotate-180 opacity-100' : ''}`}
          style={{ color: isOpen ? '#38bdf8' : 'var(--text-secondary)' }}
        />
      </button>

      {/* ================= MODERN GLASSY FLOATING DROPDOWN ================= */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported programming languages"
          className="absolute z-[999] w-80 sm:w-88 max-w-[calc(100vw-24px)] rounded-2xl border p-2.5 text-left shadow-2xl animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-150 glassy-dropdown pointer-events-auto"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            ...(align === 'right' ? { right: 0 } : { left: 0 }),
            zIndex: 999
          }}
        >
          {/* Frosted Header */}
          <div 
            className="px-3 py-2 flex items-center justify-between border-b mb-2 select-none"
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
          >
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-cyan-400 animate-pulse" />
              <span className="text-[10px] font-mono tracking-wider uppercase font-bold" style={{ color: 'var(--text-muted)' }}>
                Compiler Engine
              </span>
            </div>
            <span 
              className="text-[9px] font-mono px-2 py-0.5 rounded-full border flex items-center gap-1 font-semibold"
              style={{
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                borderColor: 'rgba(16, 185, 129, 0.3)',
                color: '#34d399'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              5 Active Engines
            </span>
          </div>

          {/* Language Options List */}
          <div className="space-y-1.5 max-h-[62vh] overflow-y-auto pr-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.id === language;
              return (
                <button
                  key={lang.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 cursor-pointer group text-left border relative overflow-hidden
                    ${isSelected 
                      ? 'shadow-md' 
                      : 'hover:bg-white/5 border-transparent'
                    }`}
                  style={isSelected ? {
                    background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.18) 0%, rgba(168, 85, 247, 0.08) 100%)',
                    borderColor: 'rgba(99, 102, 241, 0.45)',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
                  } : {}}
                >
                  {/* Left Accent Bar on Selected */}
                  {isSelected && (
                    <div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-cyan-400 to-indigo-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                    />
                  )}

                  {/* Left: Glowing Icon + Title + Version + Description */}
                  <div className="flex items-center gap-3 min-w-0 pl-1">
                    <div 
                      className={`relative flex items-center justify-center shrink-0 w-9 h-9 rounded-xl p-1.5 transition-all duration-200 border
                        ${isSelected ? 'scale-105 border-indigo-400/50' : 'border-white/10 group-hover:scale-105 group-hover:border-white/20'}`}
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        boxShadow: isSelected ? `0 0 14px ${lang.glowColor || 'rgba(99, 102, 241, 0.4)'}` : undefined
                      }}
                    >
                      {lang.icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-xs font-bold tracking-tight transition-colors"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {lang.name}
                        </span>
                        <span 
                          className="text-[10px] font-mono px-1.5 py-0.2 rounded border font-medium opacity-80"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            color: 'var(--text-secondary)'
                          }}
                        >
                          {lang.version}
                        </span>
                      </div>
                      <span className="text-[11px] truncate opacity-70 mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                        {lang.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: Compiler Engine Tag & Active State Indicator */}
                  <div className="flex items-center gap-2.5 shrink-0 ml-2">
                    <span 
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border font-semibold transition-colors
                        ${isSelected 
                          ? lang.badgeBg 
                          : 'border-white/10 opacity-75'
                        }`}
                      style={isSelected ? {} : {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {lang.tag}
                    </span>

                    {isSelected ? (
                      <div 
                        className="w-5 h-5 rounded-full border flex items-center justify-center shadow-xs"
                        style={{
                          backgroundColor: 'rgba(56, 189, 248, 0.15)',
                          borderColor: 'rgba(56, 189, 248, 0.6)'
                        }}
                      >
                        <Check size={11} className="stroke-[3] text-cyan-400" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/15 group-hover:border-white/35 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Frosted Modern Footer */}
          <div 
            className="mt-2 pt-2 border-t px-2.5 pb-0.5 flex items-center justify-between text-[10px] font-mono select-none"
            style={{ 
              borderColor: 'rgba(255, 255, 255, 0.08)',
              color: 'var(--text-muted)'
            }}
          >
            <div className="flex items-center gap-1.5 opacity-80">
              <ShieldCheck size={12} className="text-emerald-400" />
              <span>Isolated Sandbox Runtime</span>
            </div>
            <span className="opacity-60 text-[9px]">ESC to dismiss</span>
          </div>
        </div>
      )}
    </div>
  );
}
