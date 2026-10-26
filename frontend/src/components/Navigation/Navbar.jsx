import React, { useState } from 'react';
import CompileXLogo from '../Common/CompileXLogo';
import { useTheme } from '../Common/ThemeContext';
import { 
  Terminal, 
  Trophy, 
  History, 
  Sun, 
  Moon, 
  Menu, 
  X,
  Sparkles,
  Zap
} from 'lucide-react';

export default function Navbar({ 
  currentMode, 
  setMode, 
  onOpenHistory,
  submissionCount = 0,
  serverOnline = true
}) {
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav 
      className="relative z-50 w-full min-h-[56px] border-b backdrop-blur-2xl px-3 sm:px-6 lg:px-8 py-2.5 transition-colors duration-300 apple-card overflow-visible"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-[1900px] mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* ================= LEFT: BRAND LOGO ================= */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setMode('normal')} 
            className="flex items-center cursor-pointer focus:outline-none transition-transform hover:opacity-90 active:scale-98"
            title="compileX Home"
          >
            <CompileXLogo size="sm" withText={true} animated={true} />
          </button>
        </div>

        {/* ================= CENTER: APPLE SEGMENTED MODE SWITCHER ================= */}
        <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-auto">
          <div 
            className="flex items-center p-1 rounded-full border shadow-sm transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)'
            }}
          >
            {/* Playground Button */}
            <button
              onClick={() => setMode('normal')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none apple-button-shiny
                ${currentMode === 'normal' ? 'apple-tab-active' : 'apple-tab-inactive'}`}
            >
              <Terminal size={13} className={currentMode === 'normal' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]' : 'opacity-70'} />
              <span>Playground</span>
            </button>

            {/* CP Mode Button */}
            <button
              onClick={() => setMode('cp')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none apple-button-shiny relative
                ${currentMode === 'cp' ? 'apple-tab-active' : 'apple-tab-inactive'}`}
            >
              <Trophy size={13} className={currentMode === 'cp' ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]' : 'opacity-70'} />
              <span>CP Mode</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase border transition-colors
                ${currentMode === 'cp' 
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 shadow-[0_0_8px_rgba(251,191,36,0.25)]' 
                  : 'bg-white/5 text-amber-400/80 border-white/10'}`}
              >
                AI
              </span>
            </button>
          </div>
        </div>

        {/* ================= RIGHT: ACTIONS & CONTROLS ================= */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 justify-end">
          
          {/* Server Health Pill */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)'
            }}
            title={serverOnline ? "Backend compiler service active" : "Attempting connection"}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500'}`} />
            <span>{serverOnline ? 'Engine Online' : 'Connecting...'}</span>
          </div>

          {/* Submission History Button */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-full border transition-all cursor-pointer apple-button-shiny"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
            title="View Submissions"
          >
            <History size={13} className="text-cyan-500" />
            <span className="hidden sm:inline font-medium">History</span>
            {submissionCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/15 text-cyan-500 dark:text-cyan-300 font-semibold border border-cyan-500/25">
                {submissionCount}
              </span>
            )}
          </button>

          {/* Sleek Theme Toggle */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none apple-button-shiny"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? (
              <>
                <Sun size={14} className="text-amber-600 transition-transform duration-300 group-hover:rotate-45" />
                <span className="hidden sm:inline font-medium">Sage</span>
              </>
            ) : (
              <>
                <Moon size={14} className="text-cyan-300 transition-transform duration-300 group-hover:-rotate-12" />
                <span className="hidden sm:inline font-medium">Shiny Dark</span>
              </>
            )}
          </button>

          {/* User Profile Avatar */}
          <div className="flex items-center pl-1 sm:pl-1.5 border-l" style={{ borderColor: 'var(--border-color)' }}>
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-cyan-500 via-indigo-500 to-pink-500 p-[1.5px] shadow-[0_0_10px_rgba(99,102,241,0.25)]">
              <div 
                className="w-full h-full rounded-full flex items-center justify-center font-bold text-xs"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  color: 'var(--text-primary)'
                }}
              >
                X
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-primary)'
            }}
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden mt-3 pt-3 border-t flex flex-col gap-3 pb-2 animate-fadeIn"
          style={{ borderColor: 'var(--border-color)' }}
        >
          {/* Mobile Mode Segmented Toggle */}
          <div 
            className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl border"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)'
            }}
          >
            <button
              onClick={() => { setMode('normal'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all apple-button-shiny
                ${currentMode === 'normal' ? 'apple-tab-active' : 'apple-tab-inactive'}`}
            >
              <Terminal size={14} className={currentMode === 'normal' ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(56,189,248,0.5)]' : 'opacity-70'} />
              <span>Playground</span>
            </button>

            <button
              onClick={() => { setMode('cp'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all apple-button-shiny
                ${currentMode === 'cp' ? 'apple-tab-active' : 'apple-tab-inactive'}`}
            >
              <Trophy size={14} className={currentMode === 'cp' ? 'text-amber-300 drop-shadow-[0_0_6px_rgba(252,211,77,0.5)]' : 'opacity-70'} />
              <span>CP Mode (AI)</span>
            </button>
          </div>

          {/* Status & Submissions Summary on Mobile */}
          <div className="flex items-center justify-between px-1 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span>{serverOnline ? 'Compiler Engine Online' : 'Compiler Offline'}</span>
            </div>
            
            <button
              onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }}
              className="text-cyan-500 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <History size={13} />
              <span>History ({submissionCount})</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
