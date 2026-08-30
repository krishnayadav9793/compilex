import React, { useState } from 'react';
import { 
  FileText, 
  Settings, 
  HelpCircle,
  Play,
  RotateCcw
} from 'lucide-react';
import Header from './Header';
import CodeEditor from './CodeEditor';
import Input from './Input';
import Output from './Output';

const DEFAULT_PROBLEM = `PROBLEM: MAXIMUM SUBARRAY (Kadane's Algorithm)

Given an integer array 'nums', find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

---

[Input Format (stdin)]
A single line containing space-separated integers representing the array 'nums'.

[Output Format]
The maximum subarray sum.

---

[Example Input]
-2 1 -3 4 -1 2 1 -5 4

[Example Output]
6

[Explanation]
The contiguous subarray [4,-1,2,1] has the largest sum = 6.`;

/**
 * Competitive Programming Workspace Component
 */
export default function CPMode({
  isCpMode,
  toggleCpMode,
  language,
  setLanguage,
  code,
  setCode,
  input,
  setInput,
  expectedOutput,
  setExpectedOutput,
  output,
  setOutput,
  isRunning,
  executeCode
}) {
  const [problemText, setProblemText] = useState(DEFAULT_PROBLEM);

  const resetProblem = () => {
    if (window.confirm("Reset problem description to default?")) {
      setProblemText(DEFAULT_PROBLEM);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Header */}
      <Header 
        isCpMode={isCpMode} 
        toggleCpMode={toggleCpMode} 
        language={language}
        setLanguage={setLanguage}
        executeCode={executeCode}
        isRunning={isRunning}
      />

      {/* Main Grid Workspace */}
      <main className="flex-1 p-4 lg:p-6 max-w-[1800px] w-full mx-auto flex flex-col gap-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
          
          {/* Column 1: Problem Specifications (3 cols) */}
          <div className="lg:col-span-3 flex flex-col h-full">
            <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/15">
              
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 select-none">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Problem Specs
                  </span>
                </div>
                <button 
                  onClick={resetProblem}
                  title="Reset description"
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <RotateCcw size={12} />
                </button>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-3">
                <textarea
                  value={problemText}
                  onChange={(e) => setProblemText(e.target.value)}
                  placeholder="Paste or write problem specifications/technical requirements here..."
                  className="w-full h-full min-h-[250px] lg:min-h-0 bg-transparent outline-none border-0 text-slate-300 placeholder:text-slate-600 font-sans text-xs md:text-sm leading-relaxed resize-none overflow-y-auto"
                />
              </div>

              <div className="p-3 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono select-none">
                <span>Markdown supported</span>
                <HelpCircle size={12} className="text-slate-600" />
              </div>

            </div>
          </div>

          {/* Column 2: Code Editor (5 cols) */}
          <div className="lg:col-span-5 flex flex-col h-full">
            <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/15">
              
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 select-none">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                    Main.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'js' : language}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/20 border border-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                </div>
              </div>

              <div className="flex-1 p-1">
                <CodeEditor language={language} code={code} setCode={setCode} />
              </div>

            </div>
          </div>

          {/* Column 3: Stdin & Stdout Terminal Stack (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 h-full">
            
            {/* Input & Expected Output Panels stacked */}
            <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-[1.1] min-h-[300px]">
              {/* Stdin Input */}
              <div className="flex-1 flex flex-col border-b border-white/5">
                <Input input={input} setInput={setInput} />
              </div>

              {/* Expected Output Input */}
              <div className="flex-1 flex flex-col bg-slate-950/20">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border-b border-white/5 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Expected Output
                  </span>
                </div>
                <div className="flex-1 p-3">
                  <textarea
                    value={expectedOutput}
                    onChange={(e) => setExpectedOutput(e.target.value)}
                    placeholder="Enter the expected output for validation..."
                    className="w-full h-full min-h-[100px] bg-transparent outline-none border-0 text-slate-200 placeholder:text-slate-600 font-mono text-sm leading-relaxed resize-none p-1"
                  />
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-[1.3] min-h-[250px]">
              <Output output={output} setOutput={setOutput} expectedOutput={expectedOutput} isCpMode={true} />
            </div>

          </div>

        </div>
      </main>

      {/* Styled webkit scrollbars for specifications */}
      <style dangerouslySetInnerHTML={{__html: `
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.08); border-radius: 8px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.15); }
      `}} />
    </div>
  );
}