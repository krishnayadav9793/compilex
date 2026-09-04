import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Sparkles, Cpu } from 'lucide-react';

export const SUPPORTED_LANGUAGES = [
  {
    id: 'cpp',
    name: 'C++',
    version: 'C++17',
    tag: 'GCC 11',
    description: 'High performance & STL algorithms',
    accentColor: '#00599C',
    glowColor: 'rgba(0, 89, 156, 0.4)',
    badgeBg: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <path d="M16 3L29 10.5V21.5L16 29L3 21.5V10.5L16 3Z" fill="url(#cpp-hex)" stroke="#38bdf8" strokeWidth="1.5"/>
        <text x="16" y="20.5" textAnchor="middle" fill="#ffffff" fontSize="10.5" fontWeight="900" fontFamily="system-ui, sans-serif">C++</text>
        <defs>
          <linearGradient id="cpp-hex" x1="3" y1="3" x2="29" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor="#034b8c" />
            <stop offset="1" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'python',
    name: 'Python',
    version: 'v3.10',
    tag: 'CPython',
    description: 'Clean syntax & extensive standard library',
    accentColor: '#3776AB',
    glowColor: 'rgba(55, 118, 171, 0.4)',
    badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <path d="M15.8 3C9.3 3 9.7 5.8 9.7 5.8L9.7 8.7H16.1V9.7H7.3C7.3 9.7 3 9.2 3 15.8C3 22.4 6.7 22.1 6.7 22.1L8.8 22.1L8.8 19.1C8.8 19.1 8.7 15.5 12.3 15.5H18.7C18.7 15.5 22.1 15.6 22.1 12.3L22.1 5.8C22.1 5.8 22.5 3 15.8 3ZM12.5 5.5C13.2 5.5 13.8 6.1 13.8 6.8C13.8 7.5 13.2 8.1 12.5 8.1C11.8 8.1 11.2 7.5 11.2 6.8C11.2 6.1 11.8 5.5 12.5 5.5Z" fill="#387eb8"/>
        <path d="M16.2 29C22.7 29 22.3 26.2 22.3 26.2L22.3 23.3H15.9V22.3H24.7C24.7 22.3 29 22.8 29 16.2C29 9.6 25.3 9.9 25.3 9.9L23.2 9.9L23.2 12.9C23.2 12.9 23.3 16.5 19.7 16.5H13.3C13.3 16.5 9.9 16.4 9.9 19.7L9.9 26.2C9.9 26.2 9.5 29 16.2 29ZM19.5 26.5C18.8 26.5 18.2 25.9 18.2 25.2C18.2 24.5 18.8 23.9 19.5 23.9C20.2 23.9 20.8 24.5 20.8 25.2C20.8 25.9 20.2 26.5 19.5 26.5Z" fill="#ffd43b"/>
      </svg>
    )
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    version: 'Node 20',
    tag: 'V8 Engine',
    description: 'Modern asynchronous runtime with ES2024',
    accentColor: '#F7DF1E',
    glowColor: 'rgba(247, 223, 30, 0.4)',
    badgeBg: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#F7DF1E" />
        <path d="M18.8 23.5C19.7 24.9 21.2 25.8 23.1 25.8C25 25.8 26.3 24.8 26.3 23.3C26.3 21.8 25.1 21.2 23.2 20.4L22.1 19.9C19.1 18.6 17.2 17 17.2 13.5C17.2 10.1 20 7.6 24 7.6C26.7 7.6 28.7 8.7 29.9 10.9L26.7 12.9C26 11.7 24.9 11 23.9 11C22.8 11 21.8 11.7 21.8 12.8C21.8 14 22.8 14.5 24.6 15.3L25.7 15.8C29.2 17.3 31 18.9 31 22.5C31 26.4 27.8 28.9 23.1 28.9C19.2 28.9 16.7 26.8 15.4 24.3L18.8 23.5ZM9.3 23.8C10 24.9 10.8 25.7 12.1 25.7C13.4 25.7 14.2 25 14.2 23.2V8.2H18.7V23.2C18.7 27.2 16.2 28.9 12.1 28.9C8.4 28.9 6.2 26.8 5.2 24.6L8.8 22.6C9 23 9.1 23.5 9.3 23.8Z" fill="#000000"/>
      </svg>
    )
  },
  {
    id: 'java',
    name: 'Java',
    version: 'JDK 17',
    tag: 'OpenJDK',
    description: 'Robust enterprise OOP & JVM bytecode',
    accentColor: '#F89820',
    glowColor: 'rgba(248, 152, 32, 0.4)',
    badgeBg: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#181e2b" stroke="#f89820" strokeWidth="1.2" />
        <path d="M12 21.5C12 21.5 14 22.5 17 22.5C20 22.5 22 21.5 22 21.5C22 21.5 21 23.5 17 23.5C13 23.5 12 21.5 12 21.5Z" fill="#f89820"/>
        <path d="M11 18.5C11 18.5 13.5 20 17 20C20.5 20 23 18.5 23 18.5C23 18.5 21.5 21 17 21C12.5 21 11 18.5 11 18.5Z" fill="#5382A1"/>
        <path d="M17 6.5C15 9.5 14 11.5 18 13.5C16 13.5 14 12 16 9.5C17 8 16.5 7 17 6.5Z" fill="#ed8b00"/>
        <path d="M19 7.5C17.5 10.5 16.5 12.5 20.5 14.5C18.5 14.5 16.5 13 18.5 10.5C19.5 9 18.5 8 19 7.5Z" fill="#ea580c"/>
      </svg>
    )
  },
  {
    id: 'c',
    name: 'C',
    version: 'C11',
    tag: 'GCC',
    description: 'Direct memory management & micro overhead',
    accentColor: '#659AD2',
    glowColor: 'rgba(101, 154, 210, 0.4)',
    badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
        <path d="M22 10.5C20.5 9 18.5 8.2 16 8.2C11.5 8.2 8 11.6 8 16C8 20.4 11.5 23.8 16 23.8C18.5 23.8 20.5 23 22 21.5" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round"/>
      </svg>
    )
  }
];

export default function LanguageSelector({
  language,
  setLanguage,
  disabled = false,
  align = 'left' // 'left' | 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const current = SUPPORTED_LANGUAGES.find(l => l.id === language) || SUPPORTED_LANGUAGES[0];

  // Close dropdown on click outside
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
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-200 cursor-pointer select-none
          ${isOpen 
            ? 'bg-[#0f172a] border-indigo-500/60 shadow-[0_0_25px_rgba(99,102,241,0.3)] ring-2 ring-indigo-500/30' 
            : 'bg-gradient-to-b from-white/[0.09] to-white/[0.03] hover:from-white/[0.14] hover:to-white/[0.06] border-white/10 hover:border-white/20 shadow-sm active:scale-[0.98]'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
      >
        {/* Language Icon Badge */}
        <div 
          className="relative flex items-center justify-center shrink-0 w-6 h-6 rounded-lg bg-black/40 border border-white/10 p-0.5 shadow-inner transition-transform group-hover:scale-105"
          style={{
            boxShadow: isOpen ? `0 0 12px ${current.glowColor}` : 'none'
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
            className="text-[10px] font-mono px-1.5 py-0.2 rounded-md border transition-colors"
            style={{ 
              backgroundColor: 'var(--bar-bg)', 
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
          >
            {current.version}
          </span>
        </div>

        {/* Dynamic Chevron */}
        <ChevronDown 
          size={13} 
          className={`text-slate-400 group-hover:text-slate-200 transition-transform duration-200 ease-out ml-0.5
            ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} 
        />
      </button>

      {/* Classic Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Supported programming languages"
          className={`absolute top-full mt-2.5 z-[100] w-72 sm:w-80 rounded-2xl bg-[#060a14]/95 backdrop-blur-2xl border border-white/[0.12] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_30px_rgba(99,102,241,0.18)] p-2 text-left animate-in fade-in zoom-in-95 duration-150
            ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {/* Top Ambient Glow Horizon */}
          <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

          {/* Menu Header */}
          <div className="px-3 py-2 flex items-center justify-between border-b border-white/[0.06] mb-1 select-none">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-indigo-400" />
              <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
                Language Environment
              </span>
            </div>
            <span className="text-[9px] font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              5 Available
            </span>
          </div>

          {/* Language Options List */}
          <div className="space-y-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = lang.id === language;
              return (
                <button
                  key={lang.id}
                  role="option"
                  aria-selected={isSelected}
                  type="button"
                  onClick={() => handleSelect(lang.id)}
                  className={`w-full flex items-center justify-between p-2 rounded-xl transition-all duration-150 cursor-pointer group text-left
                    ${isSelected 
                      ? 'bg-gradient-to-r from-indigo-600/25 via-purple-600/20 to-indigo-600/10 border border-indigo-500/40 text-white shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                      : 'hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] text-slate-300 hover:text-white'
                    }`}
                >
                  {/* Left: Icon + Name + Description */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className={`relative flex items-center justify-center shrink-0 w-8 h-8 rounded-lg bg-black/50 border p-1 transition-all duration-200
                        ${isSelected 
                          ? 'border-indigo-400/50 shadow-[0_0_10px_rgba(99,102,241,0.3)] scale-105' 
                          : 'border-white/10 group-hover:border-white/20 group-hover:scale-105'
                        }`}
                      style={{
                        boxShadow: isSelected ? `0 0 14px ${lang.glowColor}` : undefined
                      }}
                    >
                      {lang.icon}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-100 group-hover:text-white truncate">
                          {lang.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {lang.version}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 group-hover:text-slate-300 truncate">
                        {lang.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: Tag & Selection Indicator */}
                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    <span 
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-colors
                        ${isSelected 
                          ? lang.badgeBg 
                          : 'bg-white/[0.04] text-slate-400 border-white/[0.06] group-hover:border-white/15 group-hover:text-slate-200'
                        }`}
                    >
                      {lang.tag}
                    </span>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shadow-[0_0_8px_rgba(16,185,129,0.4)]">
                        <Check size={12} className="text-emerald-400 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-white/5 group-hover:border-white/20 transition-colors" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Menu Footer */}
          <div className="mt-1.5 pt-2 border-t border-white/[0.06] px-2.5 pb-1 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
            <div className="flex items-center gap-1">
              <Cpu size={11} className="text-indigo-400" />
              <span>Direct Subprocess Compiler</span>
            </div>
            <span className="text-slate-400">ESC to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
