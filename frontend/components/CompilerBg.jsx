import React, { useEffect, useState, useMemo } from 'react';

const CompilerBackground = ({ children }) => {
  const [symbols, setSymbols] = useState([]);

  // Configuration for the floating symbols
  const config = useMemo(() => ({
    symbolCount: 30,
    chars: ['{', '}', '</>', '&&', '||', '=>', '[]', '!=', '===', ';', '#', '01', '++', '--', '//', '/*', '$', 'fn', 'import', 'return'],
    colors: [
      'text-indigo-500', 
      'text-blue-500', 
      'text-purple-500', 
      'text-emerald-500', 
      'text-slate-600',
      'text-pink-500'
    ]
  }), []);

  useEffect(() => {
    // Generate static data for symbols to ensure consistent rendering
    const newSymbols = Array.from({ length: config.symbolCount }).map((_, i) => {
      const char = config.chars[Math.floor(Math.random() * config.chars.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      
      // Random properties for animation
      const left = Math.floor(Math.random() * 100); // 0-100%
      const duration = 15 + Math.random() * 20; // 15-35s
      const delay = Math.random() * -20; // Start immediately with offset
      const size = 14 + Math.random() * 20; // 14px-34px
      
      // Custom CSS variables for the specific drift of this particle
      const style = {
        left: `${left}%`,
        fontSize: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        '--drift-x': `${(Math.random() - 0.5) * 200}px`,
        '--rotation': `${(Math.random() - 0.5) * 360}deg`,
        '--target-opacity': 0.1 + Math.random() * 0.3
      };

      return { id: i, char, color, style };
    });

    setSymbols(newSymbols);
  }, [config]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-200">
      
      {/* Inject Keyframes & Custom Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&display=swap');
        
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--target-opacity);
          }
          90% {
            opacity: var(--target-opacity);
          }
          100% {
            transform: translateY(-20vh) translateX(var(--drift-x)) rotate(var(--rotation));
            opacity: 0;
          }
        }
        
        .animate-float {
          animation: floatUp linear infinite;
          will-change: transform, opacity;
        }
      `}</style>

      {/* 1. Ambient Gradient Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 blur-3xl overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-sky-500/20 mix-blend-screen" />
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 mix-blend-screen" />
            <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 mix-blend-screen" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 mix-blend-screen" />
        </div>
      </div>

      {/* 2. Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* 3. Floating Symbols Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {symbols.map((s) => (
          <div
            key={s.id}
            className={`absolute font-mono ${s.color} animate-float opacity-0`}
            style={s.style}
          >
            {s.char}
          </div>
        ))}
      </div>

      {/* 4. Content Container */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {children || (
          // Default placeholder content if no children provided
          <div className="flex flex-col items-center justify-center min-h-screen">
             <div className="p-8 bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
                  Compiler Ready
                </h1>
                <p className="text-slate-400">Import this component and wrap your app.</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompilerBackground;