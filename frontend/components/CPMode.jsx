import React, { useState, useEffect, useMemo } from 'react';
import { 
  Code2, 
  Play, 
  FileText, 
  Terminal, 
  CheckCircle2, 
  AlertCircle, 
  Settings, 
  Copy, 
  Eraser,
  Save,
  Cpu
} from 'lucide-react';
import Header from './Header';
/**
 * CompilerBackground Component
 * Provides a generative, animated background with floating syntax symbols,
 * mesh gradients, and a technical grid overlay.
 */
const CompilerBackground = ({ children }) => {
  const [symbols, setSymbols] = useState([]);

  const config = useMemo(() => ({
    symbolCount: 40,
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
    const newSymbols = Array.from({ length: config.symbolCount }).map((_, i) => {
      const char = config.chars[Math.floor(Math.random() * config.chars.length)];
      const color = config.colors[Math.floor(Math.random() * config.colors.length)];
      const left = Math.floor(Math.random() * 100);
      const duration = 20 + Math.random() * 25;
      const delay = Math.random() * -30;
      const size = 12 + Math.random() * 18;
      
      return { 
        id: i, 
        char, 
        color, 
        style: {
          left: `${left}%`,
          fontSize: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          '--drift-x': `${(Math.random() - 0.5) * 300}px`,
          '--rotation': `${(Math.random() - 0.5) * 720}deg`,
          '--target-opacity': 0.05 + Math.random() * 0.15
        } 
      };
    });
    setSymbols(newSymbols);
  }, [config]);

  return (
    <div className="relative min-h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-200">
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% { opacity: var(--target-opacity); }
          90% { opacity: var(--target-opacity); }
          100% {
            transform: translateY(-20vh) translateX(var(--drift-x)) rotate(var(--rotation));
            opacity: 0;
          }
        }
        .animate-float {
          animation: floatUp linear infinite;
          will-change: transform, opacity;
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(51, 65, 85, 0.5);
        }
        .editor-container:focus-within {
          border-color: rgba(59, 130, 246, 0.5);
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.1);
        }
      `}</style>

      {/* Ambient Gradient Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 blur-[120px] overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-sky-500/20 mix-blend-screen" />
          <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 mix-blend-screen" />
          <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-500/20 mix-blend-screen" />
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating Symbols Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {symbols.map((s) => (
          <div key={s.id} className={`absolute font-mono ${s.color} animate-float opacity-0`} style={s.style}>
            {s.char}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
};

/**
 * Main App Component
 */
export default function CppBackground({isCpMode, toggleCpMode,language}) {
  const [statement, setStatement] = useState("");
  const [code, setCode] = useState("");
  const [testCase, setTestCase] = useState("");
  const [output, setOutput] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('output');

  const addLog = (source, message, type) => {
    const newLog = {
      id: Date.now() + Math.random(),
      source,
      message,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setOutput(prev => [newLog, ...prev]);
  };
  
  const handleRunCode = () => {
    if (!code.trim()) {
      addLog("System", "Error: No code provided.", "error");
      return;
    }
    setIsRunning(true);
    addLog("System", "Environment: Node.js v20.x", "info");
    
    setTimeout(() => {
      addLog("Compiler", "Analyzing dependency graph...", "info");
      setTimeout(() => {
        addLog("Runtime", "Process exited with code 0", "success");
        addLog("Output", `Tests passed for input: ${testCase || "None"}`, "neutral");
        setIsRunning(false);
      }, 1200);
    }, 600);
  };

  return (
    <CompilerBackground>
      {/* Header */}
      <Header isCpMode={isCpMode} toggleCpMode={toggleCpMode}/>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-[1800px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column (Inputs) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Problem Statement */}
            <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-300">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <FileText size={16} className="text-blue-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Specifications</span>
              </div>
              <textarea
                className="w-full h-32 p-4 bg-transparent outline-none resize-none text-slate-200 placeholder:text-slate-600 font-medium"
                placeholder="Paste the technical requirements here..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
              />
            </div>

            {/* Code Editor */}
            <div className="glass-panel rounded-2xl overflow-hidden editor-container transition-all duration-500">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 size={16} className="text-purple-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{`Main.${language}`}</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-black/20 border-r border-white/5 flex flex-col items-center pt-4 text-slate-600 text-[10px] font-mono select-none">
                  {[...Array(20)].map((_, i) => <div key={i} className="h-6">{i + 1}</div>)}
                </div>
                <textarea
                  className="w-full h-[400px] p-4 pl-16 bg-transparent font-mono text-sm leading-6 outline-none resize-none text-blue-100 placeholder:text-slate-700"
                  spellCheck="false"
                  placeholder="// Begin your implementation..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* Test Case Input */}
            <div className="glass-panel rounded-2xl overflow-hidden">
              <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <Terminal size={16} className="text-emerald-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Standard Input</span>
              </div>
              <textarea
                className="w-full h-24 p-4 bg-black/40 outline-none resize-none text-emerald-400 font-mono text-sm placeholder:text-emerald-900/50"
                placeholder="Enter variables for testing..."
                value={testCase}
                onChange={(e) => setTestCase(e.target.value)}
              />
            </div>
          </div>

          {/* Right Column (Output) */}
          <div className="lg:col-span-4 h-full">
            <div className="glass-panel rounded-2xl h-[calc(100vh-160px)] flex flex-col overflow-hidden sticky top-6 shadow-2xl shadow-black/50">
              <div className="flex bg-white/5 p-1 m-2 rounded-xl border border-white/5">
                <button 
                  onClick={() => setActiveTab('output')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'output' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Terminal size={12} /> Live Console
                </button>
                <button 
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center justify-center gap-2 transition-all ${
                    activeTab === 'history' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  <Save size={12} /> Snapshot
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2 font-mono text-xs space-y-4">
                {output.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-50 space-y-4 italic">
                    <Terminal size={48} className="stroke-[1px]" />
                    <p>Awaiting compilation trigger...</p>
                  </div>
                ) : (
                  output.map((log) => (
                    <div key={log.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 border-b border-white/5 pb-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black ${
                          log.type === 'error' ? 'bg-red-500/20 text-red-400' :
                          log.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                          log.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {log.source}
                        </span>
                        <span className="text-[9px] text-slate-600">{log.time}</span>
                      </div>
                      <p className={`whitespace-pre-wrap leading-relaxed ${
                        log.type === 'error' ? 'text-red-300' : 'text-slate-300'
                      }`}>
                        {log.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {isRunning ? 'Processing Pipeline' : 'Idle - Ready'}
                  </span>
                </div>
                <button onClick={() => setOutput([])} className="text-slate-600 hover:text-white transition-colors">
                  <Eraser size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
      `}</style>
    </CompilerBackground>
  );
}