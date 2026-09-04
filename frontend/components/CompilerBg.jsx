import React from 'react';
import { useTheme } from '../src/components/Common/ThemeContext';

/**
 * World-Class Developer Studio Background
 * Dynamically adapts to theme (Obsidian Studio, Dracula, Nordic, Light Studio)
 * with precision dot-matrix texture and theme-synchronized ambient aurora lighting.
 */
const CompilerBackground = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div 
      className="relative min-h-screen w-full font-sans transition-colors duration-300 selection:bg-purple-500/30 selection:text-purple-200"
      style={{
        backgroundColor: 'var(--bg-primary)',
        color: 'var(--text-primary)'
      }}
    >
      {/* 1. Precision Micro-Dot Matrix Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 z-0 transition-opacity duration-300"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, var(--dot-color) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* 2. Sleek Studio Aurora Lights (Synchronized with Theme) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Center Ambient Glow */}
        <div 
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[900px] h-[450px] rounded-full blur-[140px] opacity-40 pointer-events-none transition-all duration-700"
          style={{
            background: 'radial-gradient(ellipse at center, var(--aurora-1) 0%, var(--aurora-2) 45%, transparent 75%)'
          }}
        />

        {/* Bottom-Right Soft Glow */}
        <div 
          className="absolute -bottom-36 -right-36 w-[600px] h-[400px] rounded-full blur-[130px] opacity-25 pointer-events-none transition-all duration-700"
          style={{
            background: 'radial-gradient(ellipse at center, var(--aurora-2) 0%, transparent 75%)'
          }}
        />

        {/* Top Edge Horizon Line */}
        <div 
          className="absolute top-0 left-0 right-0 h-[1px] transition-all duration-700"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--aurora-1), transparent)'
          }}
        />
      </div>

      {/* 3. Main Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>

    </div>
  );
};

export default CompilerBackground;