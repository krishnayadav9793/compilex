import React from 'react';

/**
 * Razor-Sharp 3D Volumetric CodeSphere Logo
 * - True 3D layered extrusion depth & beveling
 * - Pure, rich, super-saturated colors (NO whitish light wash)
 * - Razor-sharp vector clarity (NO blurry fuzzy filters)
 * - Physical 3D presence with distinct light, mid, and extrusion depth faces
 */
export default function CodeSphereLogo({ 
  size = "md", 
  withText = true, 
  animated = false,
  className = "" 
}) {
  const sizeMap = {
    sm: { width: 44, height: 26, text: "text-lg", sub: "text-[9px]" },
    md: { width: 68, height: 40, text: "text-xl", sub: "text-[10px]" },
    lg: { width: 100, height: 58, text: "text-2xl", sub: "text-xs" },
    xl: { width: 170, height: 100, text: "text-4xl", sub: "text-sm" },
    hero: { width: 280, height: 165, text: "text-5xl sm:text-6xl", sub: "text-sm sm:text-base" }
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  return (
    <div className={`flex items-center gap-4 select-none ${className}`}>
      {/* 3D Emblem Container */}
      <div className={`relative flex items-center justify-center ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}`}>
        
        <svg 
          width={currentSize.width} 
          height={currentSize.height} 
          viewBox="0 0 240 145" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 overflow-visible"
        >
          <defs>
            {/* --- LEFT BRACKET 3D COLOR GRADIENTS (Saturated Magenta/Violet - NO WHITE) --- */}
            {/* Top Front Face */}
            <linearGradient id="leftFront3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="35%" stopColor="#ec4899" />
              <stop offset="70%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>

            {/* Mid Bevel Wall */}
            <linearGradient id="leftMid3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#be185d" />
              <stop offset="60%" stopColor="#a21caf" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>

            {/* Deep Extrusion Base Shadow Wall */}
            <linearGradient id="leftExtrusion3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#701a75" />
              <stop offset="100%" stopColor="#4a044e" />
            </linearGradient>

            {/* Top Edge Sharp Color Highlight (Vivid Orchid Pink - NOT WHITE) */}
            <linearGradient id="leftRidge3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="50%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#e879f9" />
            </linearGradient>


            {/* --- RIGHT BRACKET 3D COLOR GRADIENTS (Saturated Electric Cyan/Blue - NO WHITE) --- */}
            {/* Top Front Face */}
            <linearGradient id="rightFront3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="35%" stopColor="#0284c7" />
              <stop offset="70%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            {/* Mid Bevel Wall */}
            <linearGradient id="rightMid3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="60%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>

            {/* Deep Extrusion Base Shadow Wall */}
            <linearGradient id="rightExtrusion3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>

            {/* Top Edge Sharp Color Highlight (Vivid Cyan - NOT WHITE) */}
            <linearGradient id="rightRidge3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#67e8f9" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>


            {/* --- CENTER DIAMOND 3D GRADIENTS --- */}
            <linearGradient id="diamondFront3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec4899" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>

            <linearGradient id="diamondSide3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#701a75" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>

          {/* ========================================================================= */}
          {/* ======================= 1. LEFT BRACKET `<` (3D) ======================= */}
          {/* ========================================================================= */}

          {/* Layer A: Ground Shadow */}
          <path 
            d="M 85 40 L 40 85 L 85 130" 
            stroke="#000000" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.65"
          />

          {/* Layer B: 3D Deep Extrusion Wall (+10px Y depth) */}
          <path 
            d="M 85 36 L 40 81 L 85 126" 
            stroke="url(#leftExtrusion3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer C: 3D Mid Bevel Wall (+5px Y depth) */}
          <path 
            d="M 85 31 L 40 76 L 85 121" 
            stroke="url(#leftMid3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer D: Front Top Surface (Sharp, Crisp, Vibrant - 0px Y) */}
          <path 
            d="M 85 26 L 40 71 L 85 116" 
            stroke="url(#leftFront3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer E: Crisp Sharp Color Ridge (Defines 3D top edge - NO WHITE) */}
          <path 
            d="M 83 24 L 38 69 L 83 114" 
            stroke="url(#leftRidge3D)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.9"
          />


          {/* ========================================================================= */}
          {/* ===================== 2. CENTER 3D DIAMOND `◆` ========================== */}
          {/* ========================================================================= */}

          {/* Diamond Ground Shadow */}
          <rect 
            x="106" 
            y="67" 
            width="28" 
            height="28" 
            rx="5" 
            transform="rotate(45 120 81)" 
            fill="#000000"
            opacity="0.6"
          />

          {/* Diamond 3D Extrusion Wall (+7px Y depth) */}
          <rect 
            x="106" 
            y="64" 
            width="28" 
            height="28" 
            rx="5" 
            transform="rotate(45 120 78)" 
            fill="url(#diamondSide3D)"
          />

          {/* Diamond Front Top Face (at Y=71) */}
          <rect 
            x="106" 
            y="57" 
            width="28" 
            height="28" 
            rx="5" 
            transform="rotate(45 120 71)" 
            fill="url(#diamondFront3D)"
          />

          {/* Diamond 3D Facet Highlight (Top-left half - NO WHITE) */}
          <polygon 
            points="120,51 100,71 120,71" 
            fill="#f472b6" 
            opacity="0.5" 
          />
          <polygon 
            points="120,51 140,71 120,71" 
            fill="#38bdf8" 
            opacity="0.5" 
          />


          {/* ========================================================================= */}
          {/* ======================= 3. RIGHT BRACKET `>` (3D) ======================= */}
          {/* ========================================================================= */}

          {/* Layer A: Ground Shadow */}
          <path 
            d="M 155 40 L 200 85 L 155 130" 
            stroke="#000000" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.65"
          />

          {/* Layer B: 3D Deep Extrusion Wall (+10px Y depth) */}
          <path 
            d="M 155 36 L 200 81 L 155 126" 
            stroke="url(#rightExtrusion3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer C: 3D Mid Bevel Wall (+5px Y depth) */}
          <path 
            d="M 155 31 L 200 76 L 155 121" 
            stroke="url(#rightMid3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer D: Front Top Surface (Sharp, Crisp, Vibrant - 0px Y) */}
          <path 
            d="M 155 26 L 200 71 L 155 116" 
            stroke="url(#rightFront3D)" 
            strokeWidth="28" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />

          {/* Layer E: Crisp Sharp Color Ridge (Defines 3D top edge - NO WHITE) */}
          <path 
            d="M 157 24 L 202 69 L 157 114" 
            stroke="url(#rightRidge3D)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.9"
          />

        </svg>
      </div>

      {/* Typography */}
      {withText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span 
              className={`font-black tracking-tight transition-colors ${currentSize.text}`}
              style={{ color: 'var(--text-primary)' }}
            >
              Code
            </span>
            <span className={`font-black tracking-tight bg-gradient-to-r from-pink-500 via-purple-400 to-cyan-500 bg-clip-text text-transparent ${currentSize.text}`}>
              Sphere
            </span>
          </div>
          <span 
            className={`font-medium tracking-widest uppercase mt-1 font-mono transition-colors opacity-70 ${currentSize.sub}`}
            style={{ color: 'var(--text-secondary)' }}
          >
            Code • Practice • AI
          </span>
        </div>
      )}
    </div>
  );
}
