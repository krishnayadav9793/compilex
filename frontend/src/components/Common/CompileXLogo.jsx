import React from 'react';

/**
 * compileX Apple-Grade Shiny Emblem & Typography Logo
 * - Razor-sharp dimensional vector styling
 * - Specular reflections, glossy gradients, and luminous depth
 * - Seamless adaptation to Apple OLED Dark and Clean Light modes
 */
export default function CompileXLogo({ 
  size = "md", 
  withText = true, 
  animated = false,
  className = "" 
}) {
  const sizeMap = {
    xs: { width: 28, height: 28, text: "text-base", sub: "text-[8px]" },
    sm: { width: 34, height: 34, text: "text-lg", sub: "text-[9px]" },
    md: { width: 44, height: 44, text: "text-xl", sub: "text-[10px]" },
    lg: { width: 64, height: 64, text: "text-2xl", sub: "text-xs" },
    xl: { width: 88, height: 88, text: "text-4xl", sub: "text-sm" },
    hero: { width: 110, height: 110, text: "text-5xl sm:text-6xl", sub: "text-sm sm:text-base" }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Shiny Apple Emblem */}
      <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'transition-transform duration-300 hover:scale-105 active:scale-95' : ''}`}>
        
        {/* Ambient Glow behind the logo */}
        <div 
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500/30 via-indigo-500/25 to-pink-500/30 blur-md pointer-events-none opacity-60 dark:opacity-80 transition-opacity"
        />

        <svg 
          width={currentSize.width} 
          height={currentSize.height} 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_4px_16px_rgba(99,102,241,0.25)]"
        >
          <defs>
            {/* Apple Dark Mode / Light Mode Card Shield Gradient */}
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1e24" />
              <stop offset="50%" stopColor="#0f0f14" />
              <stop offset="100%" stopColor="#050508" />
            </linearGradient>

            {/* Specular Edge Gradient */}
            <linearGradient id="sheenEdge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 255, 255, 0.05)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.3)" />
            </linearGradient>

            {/* Left Wing / Stroke: Electric Cyan to Indigo */}
            <linearGradient id="wingLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>

            {/* Right Wing / Stroke: Neon Violet to Fuchsia */}
            <linearGradient id="wingRight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="40%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Specular Ridge Line */}
            <linearGradient id="ridgeLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Squircle Background Container (Apple macOS style app icon squircle) */}
          <rect 
            x="4" 
            y="4" 
            width="92" 
            height="92" 
            rx="24" 
            fill="url(#shieldGrad)" 
            stroke="url(#sheenEdge)" 
            strokeWidth="1.5"
          />

          {/* Top Bevel Shiny Glass Sheen */}
          <path 
            d="M 6 28 C 6 15 15 6 28 6 L 72 6 C 85 6 94 15 94 28 C 94 36 60 48 6 36 Z" 
            fill="white" 
            opacity="0.08" 
          />

          {/* Dynamic compiling brackets that cross into a 3D "X" */}
          {/* Main Diagonal 1: Top-Left to Bottom-Right */}
          <path 
            d="M 28 26 L 72 74" 
            stroke="url(#wingLeft)" 
            strokeWidth="11" 
            strokeLinecap="round" 
          />

          {/* Main Diagonal 2: Bottom-Left to Top-Right */}
          <path 
            d="M 28 74 L 72 26" 
            stroke="url(#wingRight)" 
            strokeWidth="11" 
            strokeLinecap="round" 
          />

          {/* Intersecting Center Core Gem */}
          <circle 
            cx="50" 
            cy="50" 
            r="8.5" 
            fill="#ffffff" 
            opacity="0.95"
            className="filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          />

          {/* Specular Inner Glint */}
          <circle 
            cx="48" 
            cy="48" 
            r="3" 
            fill="#38bdf8" 
          />

          {/* Sleek Code Chevron Accents (< and > micro elements) */}
          <path 
            d="M 20 45 L 14 50 L 20 55" 
            stroke="#38bdf8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path 
            d="M 80 45 L 86 50 L 80 55" 
            stroke="#f472b6" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center tracking-tight">
            <span 
              className={`font-semibold tracking-[-0.03em] ${currentSize.text} transition-colors`}
              style={{ color: 'var(--text-primary)' }}
            >
              compile
            </span>
            <span 
              className={`font-black tracking-[-0.02em] ${currentSize.text} bg-gradient-to-tr from-cyan-400 via-indigo-400 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(99,102,241,0.4)] ml-[1px]`}
            >
              X
            </span>
          </div>
          <span 
            className={`font-medium tracking-[0.16em] uppercase mt-1 font-mono transition-colors opacity-70 ${currentSize.sub}`}
            style={{ color: 'var(--text-muted)' }}
          >
            IDE • RUNTIME • AI
          </span>
        </div>
      )}
    </div>
  );
}
