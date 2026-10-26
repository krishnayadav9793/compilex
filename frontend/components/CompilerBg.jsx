import React from 'react';
import { useTheme } from '../src/components/Common/ThemeContext';

/**
 * Apple-Grade Studio Background for compileX
 * - True OLED deep black with refined specular spotlight in Dark Mode
 * - Pristine macOS/iOS porcelain canvas with frosted depth in Light Mode
 * - Micro-dot matrix overlay with smooth transitions
 */
const CompilerBackground = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div 
      className="relative min-h-screen w-full font-sans transition-colors duration-300 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden flex flex-col"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* 1. Precision Micro-Dot Matrix Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-500 opacity-60"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)',
          backgroundSize: '28px 28px'
        }}
      />

      {/* 2. Apple Studio Ambient Spotlight & Specular Horizon */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Center Specular Spotlight */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[85vw] max-w-[1200px] h-[400px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(120, 140, 255, 0.22) 0%, rgba(168, 85, 247, 0.12) 35%, rgba(56, 189, 248, 0.06) 55%, transparent 75%)'
              : 'radial-gradient(ellipse at center, rgba(105, 121, 81, 0.14) 0%, rgba(197, 212, 184, 0.07) 40%, transparent 70%)'
          }}
        />

        {/* Bottom Ambient Glow */}
        <div 
          className="absolute -bottom-40 right-10 w-[550px] h-[340px] rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-700"
          style={{
            background: isDark
              ? 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.14) 0%, rgba(56, 189, 248, 0.08) 45%, transparent 70%)'
              : 'radial-gradient(ellipse at center, rgba(105, 121, 81, 0.10) 0%, transparent 70%)'
          }}
        />

        {/* Top Edge Specular Hairline */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-700"
          style={{
            background: isDark
              ? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.25) 20%, rgba(140, 160, 255, 0.75) 50%, rgba(255, 255, 255, 0.25) 80%, transparent 100%)'
              : 'linear-gradient(90deg, transparent 0%, rgba(105, 121, 81, 0.25) 50%, transparent 100%)'
          }}
        />
      </div>

      {/* 3. Main Content Tree */}
      <div className="relative z-10 w-full min-h-screen flex flex-col flex-1">
        {children}
      </div>

    </div>
  );
};

export default CompilerBackground;
