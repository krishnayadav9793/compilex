import React, { useState } from 'react';
import Header from '../components/Header.jsx';
import CodeEditor from '../components/CodeEditor.jsx';
import CompilerBackground from '../components/CompilerBg.jsx';
import Input from '../components/Input.jsx';
import Output from '../components/Output.jsx';
import CPMode from '../components/CPMode.jsx';

const BOILERPLATES = {
  javascript: `// Enter your JavaScript code here\nconsole.log("Hello, World!");\n`,
  python: `# Enter your Python code here\nprint("Hello, World!")\n`,
  java: `import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        // Enter your Java code here\n        System.out.println("Hello, World!");\n    }\n}\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Enter your C++ code here\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
  c: `#include <stdio.h>\n\nint main() {\n    // Enter your C code here\n    printf("Hello, World!\\n");\n    return 0;\n}\n`
};

function App() {
  const [code, setCode] = useState(BOILERPLATES.javascript);
  const [input, setInput] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [output, setOutput] = useState({
    stdout: "",
    stderr: "",
    error: "",
    success: null,
    systemLog: "Console initialized. Ready to execute code."
  });
  const [language, setLanguage] = useState("javascript");
  const [isCpMode, setCpMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const toggleCpMode = () => {
    const nextMode = !isCpMode;
    setCpMode(nextMode);
    if (nextMode && !input.trim()) {
      setInput("-2 1 -3 4 -1 2 1 -5 4");
      setExpectedOutput("6");
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    // Automatically switch boilerplate if current code is empty or is one of the other boilerplates
    if (!code || Object.values(BOILERPLATES).some(bp => bp.trim() === code.trim())) {
      setCode(BOILERPLATES[newLang] || "");
    }
  };

  const executeCode = async () => {
    setIsRunning(true);
    setOutput(prev => ({
      ...prev,
      systemLog: "Connecting to server and preparing runtime...",
      success: null
    }));

    try {
      const execution = await fetch("http://localhost:3000/run", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          code, 
          language,
          input
        })
      });

      if (!execution.ok) {
        throw new Error(`Server responded with status ${execution.status}`);
      }

      const res = await execution.json();
      
      // Update state with execution results
      setOutput({
        stdout: res.success ? res.output : "",
        stderr: !res.success && res.error !== "Compilation Error" && res.error !== "Time Limit Exceeded" ? res.output : "",
        error: !res.success ? (res.error || "Execution Failed") : "",
        success: res.success,
        systemLog: res.success 
          ? "Execution finished successfully." 
          : `Execution failed: ${res.error || 'Runtime Error'}`
      });
    } catch (e) {
      console.error("Execution Error:", e);
      setOutput({
        stdout: "",
        stderr: "",
        error: e.message,
        success: false,
        systemLog: `Connection Error: Ensure your compiler backend is active on port 3000.`
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      <CompilerBackground>
        {isCpMode ? (
          <CPMode 
            isCpMode={isCpMode} 
            toggleCpMode={toggleCpMode} 
            language={language} 
            setLanguage={handleLanguageChange} 
            code={code} 
            setCode={setCode} 
            input={input} 
            setInput={setInput} 
            expectedOutput={expectedOutput}
            setExpectedOutput={setExpectedOutput}
            output={output} 
            setOutput={setOutput}
            isRunning={isRunning}
            executeCode={executeCode}
          />
        ) : (
          <div className="flex flex-col w-full min-h-screen">
            {/* Header */}
            <Header 
              isCpMode={isCpMode} 
              toggleCpMode={toggleCpMode} 
              language={language}
              setLanguage={handleLanguageChange}
              executeCode={executeCode}
              isRunning={isRunning}
            />

            {/* Split layout: Editor on Left, Input/Output on Right */}
            <main className="flex-1 p-4 lg:p-6 max-w-[1800px] w-full mx-auto flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
                {/* Left Side: Editor (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full">
                  <div className="flex flex-col h-full bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:border-white/15">
                    <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest font-mono">
                          Workspace • main.{language === 'cpp' ? 'cpp' : language === 'javascript' ? 'js' : language}
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

                {/* Right Side: Stdin/Stdout (4 cols) */}
                <div className="lg:col-span-4 flex flex-col gap-6 h-full">
                  {/* Stdin Panel */}
                  <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-1 min-h-[220px]">
                    <Input input={input} setInput={setInput} />
                  </div>

                  {/* Stdout Panel */}
                  <div className="flex flex-col bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex-[1.5] min-h-[300px]">
                    <Output output={output} setOutput={setOutput} />
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}
      </CompilerBackground>
    </div>
  );
}

export default App;
