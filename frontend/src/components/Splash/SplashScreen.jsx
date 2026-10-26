import React, { useState, useEffect, useCallback } from 'react';
import CodeSphereLogo from '../Common/CodeSphereLogo';
import { ArrowRight } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [isExiting, setIsExiting] = useState(false);

  const triggerExit = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    setTimeout(() => {
      if (onFinish) onFinish();
    }, 600);
  }, [isExiting, onFinish]);

  useEffect(() => {
    const timer = setTimeout(() => {
      triggerExit();
    }, 1800);

    return () => clearTimeout(timer);
  }, [triggerExit]);

  return (
    <div 
      onClick={triggerExit}
      className={`fixed inset-0 z-[9999] flex items-center justify-center p-6 overflow-hidden bg-[#030712] text-white select-none cursor-pointer transition-all duration-700 ease-out
        ${isExiting ? 'opacity-0 scale-105 pointer-events-none filter blur-sm' : 'opacity-100 scale-100'}`}
    >
      {/* ================= WORLD-CLASS STUDIO BACKGROUND ================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Precision Micro-Dot Matrix */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Ambient Top Studio Lighting */}
        <div 
          className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-35 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.35) 0%, rgba(6, 182, 212, 0.2) 50%, transparent 75%)'
          }}
        />

        {/* Top Edge Neon Micro-Beam */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      </div>

      {/* Top Bar: Minimal Skip Button (Absolute Top-Right) */}
      <div className="absolute top-6 right-6 z-30">
        <button
          onClick={triggerExit}
          className="text-xs font-medium text-slate-400 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
        >
          <span>Skip</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* ================= DEAD-CENTER: 3D EMBLEM & BRAND TYPOGRAPHY ================= */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center max-w-xl mx-auto">
        
        {/* 3D Razor-Sharp Logo */}
        <div className="relative mb-5 transform transition-transform duration-700 hover:scale-105">
          <CodeSphereLogo size="hero" withText={false} animated={true} />
        </div>

        {/* Brand Name Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight mb-3 select-none">
          <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">Code</span>
          <span className="bg-gradient-to-r from-pink-400 via-purple-300 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,182,212,0.8)]">
            Sphere
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-lg font-medium text-slate-300 tracking-wide">
          Code. Practice. Learn. <span className="text-cyan-400 font-semibold drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]">With AI.</span>
        </p>

      </div>

      {/* Bottom Subtitle (Absolute Bottom) */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10">
        <p className="text-[11px] text-slate-500 font-mono tracking-widest uppercase">
          Click anywhere to continue
        </p>
      </div>

    </div>
  );
}
