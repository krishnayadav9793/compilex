import React, { useState } from 'react';
import CodeSphereLogo from '../Common/CodeSphereLogo';
import { useTheme } from '../Common/ThemeContext';
import { 
  Terminal, 
  Trophy, 
  History, 
  Sun, 
  Moon, 
  RotateCcw, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  currentMode, 
  setMode, 
  onOpenHistory,
  submissionCount = 0,
  onReplaySplash,
  serverOnline = true
}) {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav 
      className="relative z-50 w-full border-b backdrop-blur-2xl px-4 lg:px-8 py-2.5 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--card-bg)',
        borderColor: 'var(--border-color)'
      }}
    >
      <div className="max-w-[1850px] mx-auto flex items-center justify-between gap-4">
        
        {/* ================= LEFT: MODE SWITCHER & ENGINE STATUS ================= */}
        <div className="flex items-center gap-3 flex-1 justify-start">
          {/* Desktop Mode Switcher */}
          <div 
            className="hidden md:flex items-center p-1 border rounded-xl shadow-inner transition-colors"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)'
            }}
          >
            <button
              onClick={() => setMode('normal')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer
                ${currentMode === 'normal' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-500/30' 
                  : ''}`}
              style={currentMode === 'normal' ? {} : { color: 'var(--text-secondary)' }}
            >
              <Terminal size={14} />
              <span>Playground</span>
            </button>

            <button
              onClick={() => setMode('cp')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer relative
                ${currentMode === 'cp' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-500/30' 
                  : ''}`}
              style={currentMode === 'cp' ? {} : { color: 'var(--text-secondary)' }}
            >
              <Trophy size={14} className={currentMode === 'cp' ? 'text-amber-300' : 'text-slate-400'} />
              <span>CP Mode</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-500 dark:text-amber-300 font-bold uppercase border border-amber-400/30">
                AI
              </span>
            </button>
          </div>

          {/* Engine Status Pill */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-colors"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-muted)'
            }}
          >
            <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
            <span>{serverOnline ? 'Port 3000 Ready' : 'Connecting...'}</span>
          </div>
        </div>

        {/* ================= CENTER: PROMINENT 3D CODESPHERE LOGO ================= */}
        <div className="flex items-center justify-center shrink-0">
          <button 
            onClick={() => setMode('normal')} 
            className="flex items-center gap-2 cursor-pointer focus:outline-none transition-transform hover:scale-105 active:scale-95"
            title="CodeSphere Home"
          >
            <CodeSphereLogo size="sm" withText={true} />
          </button>
        </div>

        {/* ================= RIGHT: HISTORY, THEME & ACTIONS ================= */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end">
          
          {/* Submission History */}
          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-color)',
              color: 'var(--text-secondary)'
            }}
            title="View Submission History"
          >
            <History size={14} className="text-cyan-500" />
            <span className="hidden sm:inline font-medium">History</span>
            {submissionCount > 0 && (
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 font-bold border border-cyan-500/30">
                {submissionCount}
              </span>
            )}
          </button>

          {/* Direct Light / Dark Mode Toggle Switch */}
          <button
            type="button"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className={`group flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer select-none active:scale-95 ${
              theme === 'light'
                ? 'bg-amber-400/10 hover:bg-amber-400/20 text-amber-700 border-amber-400/30 shadow-sm'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border-indigo-500/30 shadow-sm'
            }`}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <>
                <Sun size={15} className="text-amber-500 group-hover:rotate-45 transition-transform duration-300 fill-amber-400/30" />
                <span className="font-semibold text-slate-800">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={15} className="text-indigo-400 group-hover:-rotate-12 transition-transform duration-300 fill-indigo-400/20" />
                <span className="font-semibold text-slate-200">Dark Mode</span>
              </>
            )}
          </button>

          {/* Replay Splash Intro */}
          {onReplaySplash && (
            <button
              onClick={onReplaySplash}
              className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400 hover:text-purple-300 px-2.5 py-1.5 rounded-xl hover:bg-purple-950/20 border border-transparent hover:border-purple-500/30 transition-all cursor-pointer font-mono"
              title="Replay intro animation"
            >
              <RotateCcw size={12} />
              <span>Intro</span>
            </button>
          )}

          {/* User Avatar */}
          <div className="flex items-center pl-1 sm:pl-2 border-l border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-[0_0_12px_rgba(147,51,234,0.35)]">
              <div className="w-full h-full bg-[#030712] rounded-[10px] flex items-center justify-center font-bold text-xs text-white">
                S
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div 
          className="md:hidden mt-3 pt-3 border-t flex flex-col gap-2.5 pb-2 animate-fadeIn"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { setMode('normal'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all
                ${currentMode === 'normal' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'border'}`}
              style={currentMode === 'normal' ? {} : {
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <Terminal size={14} />
              <span>Playground</span>
            </button>

            <button
              onClick={() => { setMode('cp'); setMobileMenuOpen(false); }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all
                ${currentMode === 'cp' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30' 
                  : 'border'}`}
              style={currentMode === 'cp' ? {} : {
                backgroundColor: 'var(--bg-subtle)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-secondary)'
              }}
            >
              <Trophy size={14} />
              <span>CP Mode</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 px-1 text-xs">
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-colors"
              style={{ 
                backgroundColor: 'var(--bar-bg)', 
                borderColor: 'var(--border-color)', 
                color: 'var(--text-primary)' 
              }}
            >
              {theme === 'light' ? <Moon size={13} className="text-indigo-400" /> : <Sun size={13} className="text-amber-500" />}
              <span>{theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}</span>
            </button>
            <button
              onClick={() => { onOpenHistory(); setMobileMenuOpen(false); }}
              className="text-cyan-400 font-medium"
            >
              Submissions ({submissionCount})
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
