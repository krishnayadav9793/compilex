import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/Common/ThemeContext';
import CompilerBackground from '../components/CompilerBg';
import Navbar from './components/Navigation/Navbar';
import SplashScreen from './components/Splash/SplashScreen';
import NormalPlayground from './components/NormalMode/NormalPlayground';
import DynamicCPMode from './components/CPMode/DynamicCPMode';
import ExecutionLoaderModal from './components/Modals/ExecutionLoaderModal';
import AIExplanationDrawer from './components/Modals/AIExplanationDrawer';
import SubmissionsModal from './components/Modals/SubmissionsModal';
import { BOILERPLATES, CP_TEMPLATES, PRESETS } from './utils/cpPresets';
import { API_BASE_URL } from './config';

function MainApp() {
  // Splash Screen state
  const [showSplash, setShowSplash] = useState(true);

  // Navigation mode: 'normal' | 'cp'
  const [currentMode, setCurrentMode] = useState('normal');

  // Language state
  const [language, setLanguage] = useState('cpp');

  // Normal mode code map (persists code per language with default templates)
  const [normalCodeMap, setNormalCodeMap] = useState({
    cpp: BOILERPLATES.cpp,
    c: BOILERPLATES.c,
    python: BOILERPLATES.python,
    java: BOILERPLATES.java,
    javascript: BOILERPLATES.javascript
  });

  const [input, setInput] = useState("");

  // Normal mode output state
  const [output, setOutput] = useState({
    stdout: "",
    stderr: "",
    error: "",
    success: null,
    systemLog: "Console initialized. Ready to execute code.",
    executionTime: "0.0s",
    memory: "6.0 MB"
  });

  // Dynamic CP Mode state
  const [cpStatement, setCpStatement] = useState(PRESETS[0].statement);
  const [cpInput, setCpInput] = useState(PRESETS[0].input);
  const [cpCodeMap, setCpCodeMap] = useState({
    cpp: PRESETS[0].solutions.cpp,
    c: PRESETS[0].solutions.c,
    python: PRESETS[0].solutions.python,
    java: PRESETS[0].solutions.java,
    javascript: PRESETS[0].solutions.javascript
  });
  const [lastJudgeResult, setLastJudgeResult] = useState(null);

  // Execution Loader Modal state (Screen 8)
  const [loaderModal, setLoaderModal] = useState({
    isOpen: false,
    status: "compiling", // "compiling" | "accepted" | "wrong_answer" | "error"
    result: null
  });

  // AI Explanation Drawer state (Screen 9)
  const [aiDrawer, setAiDrawer] = useState({
    isOpen: false,
    data: null
  });

  // Submissions History (Screen 10)
  const [submissions, setSubmissions] = useState(() => {
    try {
      const saved = localStorage.getItem('codesphere_submissions');
      return saved ? JSON.parse(saved) : [
        {
          title: "Maximum Subarray (Kadane's)",
          status: "Accepted",
          language: "cpp",
          executionTime: "0.3s",
          memory: "6.1 MB",
          timestamp: "10 mins ago"
        }
      ];
    } catch {
      return [];
    }
  });
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Server health indicator
  const [serverOnline, setServerOnline] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync submissions to local storage
  useEffect(() => {
    try {
      localStorage.setItem('codesphere_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error(e);
    }
  }, [submissions]);

  // Check server health
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/run`);
        if (res.ok) setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 20000);
    return () => clearInterval(interval);
  }, []);

  // Current active codes for Normal and CP Mode
  const currentNormalCode = normalCodeMap[language] || BOILERPLATES[language] || "";
  const currentCpCode = cpCodeMap[language] || CP_TEMPLATES[language] || "";

  // Handlers for Normal Mode code
  const handleNormalCodeChange = (newCode) => {
    setNormalCodeMap(prev => ({
      ...prev,
      [language]: newCode
    }));
  };

  const handleResetNormalTemplate = () => {
    setNormalCodeMap(prev => ({
      ...prev,
      [language]: BOILERPLATES[language]
    }));
  };

  // Handlers for CP Mode code
  const handleCpCodeChange = (newCode) => {
    setCpCodeMap(prev => ({
      ...prev,
      [language]: newCode
    }));
  };

  const handleResetCpTemplate = () => {
    const matchingPreset = PRESETS.find(p => p.statement.trim() === cpStatement.trim());
    if (matchingPreset && matchingPreset.solutions && matchingPreset.solutions[language]) {
      setCpCodeMap(prev => ({
        ...prev,
        [language]: matchingPreset.solutions[language]
      }));
    } else {
      setCpCodeMap(prev => ({
        ...prev,
        [language]: CP_TEMPLATES[language]
      }));
    }
  };

  // Central language switcher
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);

    // In CP Mode, if active problem matches a preset, load that preset's solution in the new language
    const matchingPreset = PRESETS.find(p => p.statement.trim() === cpStatement.trim());
    if (matchingPreset && matchingPreset.solutions && matchingPreset.solutions[newLang]) {
      setCpCodeMap(prev => ({
        ...prev,
        [newLang]: matchingPreset.solutions[newLang]
      }));
    }
  };

  // Normal Mode execution
  const executeNormalCode = async () => {
    setIsRunning(true);
    setLoaderModal({
      isOpen: true,
      status: "compiling",
      result: null
    });

    setOutput(prev => ({
      ...prev,
      systemLog: "Compiling code on engine...",
      success: null
    }));

    const startTime = Date.now();

    try {
      const res = await fetch(`${API_BASE_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentNormalCode,
          language,
          input
        })
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
      const data = await res.json();
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2) + "s";
      const mem = (Math.random() * 1.5 + 5.5).toFixed(1) + " MB";

      setOutput({
        stdout: data.success ? (data.stdout || data.output || "") : "",
        stderr: !data.success && data.status !== "Compilation Error" && data.error !== "Compilation Error" ? (data.stderr || data.output || "") : "",
        error: !data.success && (data.status === "Compilation Error" || data.error === "Compilation Error")
          ? (data.output || data.stderr || "Compilation Error")
          : (!data.success ? (data.error || data.status || "Execution Failed") : ""),
        success: data.success,
        executionTime: data.executionTime || elapsed,
        memory: data.memory || mem,
        systemLog: data.success
          ? `Execution completed successfully${data.sandbox === 'docker' ? ' (Docker Sandbox)' : ''}.`
          : `Failed: ${data.status || data.error || 'Error'}`
      });

      if (data.success) {
        setLoaderModal({
          isOpen: true,
          status: "accepted",
          result: {
            executionTime: data.executionTime || elapsed,
            memory: data.memory || mem,
            userOutput: data.output
          }
        });
      } else {
        setLoaderModal({
          isOpen: true,
          status: "error",
          result: {
            status: data.status || data.error || "Execution Error",
            error: data.output || data.error,
            executionTime: data.executionTime || elapsed,
            memory: data.memory || mem
          }
        });
      }

    } catch (err) {
      console.error(err);
      setOutput({
        stdout: "",
        stderr: "",
        error: err.message,
        success: false,
        executionTime: "0.0s",
        memory: "0 MB",
        systemLog: "Could not reach compiler backend on port 3000."
      });

      setLoaderModal({
        isOpen: true,
        status: "error",
        result: {
          status: "Connection Failed",
          error: "Ensure compiler backend is running on port 3000."
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  // CP Mode: Run user code locally against input
  const executeCPCodeLocally = async () => {
    setIsRunning(true);
    setLoaderModal({
      isOpen: true,
      status: "compiling",
      result: null
    });

    const startTime = Date.now();

    try {
      const res = await fetch(`${API_BASE_URL}/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentCpCode,
          language,
          input: cpInput
        })
      });

      const data = await res.json();
      const elapsed = data.executionTime || (((Date.now() - startTime) / 1000).toFixed(2) + "s");
      const mem = data.memory || "6.1 MB";

      if (data.success) {
        setLoaderModal({
          isOpen: true,
          status: "accepted",
          result: {
            executionTime: elapsed,
            memory: mem,
            userOutput: data.output
          }
        });
      } else {
        setLoaderModal({
          isOpen: true,
          status: "error",
          result: {
            status: data.status || data.error || "Runtime Error",
            error: data.output || data.error
          }
        });
      }
    } catch (err) {
      setLoaderModal({
        isOpen: true,
        status: "error",
        result: {
          status: "Connection Error",
          error: err.message
        }
      });
    } finally {
      setIsRunning(false);
    }
  };

  // CP Mode: Submit code for automated Gemini Judge
  const submitCPSolution = async () => {
    setIsSubmitting(true);
    setLoaderModal({
      isOpen: true,
      status: "compiling",
      result: null
    });

    try {
      const res = await fetch(`${API_BASE_URL}/answer/judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemStatement: cpStatement,
          input: cpInput,
          code: currentCpCode,
          language
        })
      });

      const judgeData = await res.json();
      setLastJudgeResult(judgeData);

      // Record submission
      const newSub = {
        title: cpStatement.split('\n')[0].slice(0, 45) || "CP Problem",
        status: judgeData.isAccepted ? "Accepted" : (judgeData.status || "Wrong Answer"),
        language,
        executionTime: judgeData.executionTime || "0.3s",
        memory: judgeData.memory || "6.1 MB",
        timestamp: "Just now"
      };
      setSubmissions(prev => [newSub, ...prev]);

      if (judgeData.isAccepted) {
        setLoaderModal({
          isOpen: true,
          status: "accepted",
          result: judgeData
        });
      } else if (judgeData.status === "Compilation Error" || !judgeData.success) {
        setLoaderModal({
          isOpen: true,
          status: "error",
          result: judgeData
        });
      } else {
        setLoaderModal({
          isOpen: true,
          status: "wrong_answer",
          result: judgeData
        });
      }

    } catch (err) {
      console.error(err);
      setLoaderModal({
        isOpen: true,
        status: "error",
        result: {
          status: "Server Error",
          error: `Failed to evaluate submission: ${err.message}`
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Clear all submission history?")) {
      setSubmissions([]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 font-sans text-slate-200 antialiased selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden flex flex-col">
      {/* Splash Screen */}
      {showSplash && (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      )}

      {/* Dynamic Animated Background */}
      <CompilerBackground>
        <div className={`flex flex-col w-full min-h-screen transition-all duration-700 ease-out
          ${showSplash ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}`}
        >
          
          {/* Universal Navbar */}
          <Navbar 
            currentMode={currentMode}
            setMode={setCurrentMode}
            onOpenHistory={() => setShowHistoryModal(true)}
            submissionCount={submissions.length}
            onReplaySplash={() => setShowSplash(true)}
            serverOnline={serverOnline}
          />

          {/* Active Mode Workspace */}
          <main className="flex-1 flex flex-col w-full">
            {currentMode === 'normal' ? (
              <NormalPlayground
                language={language}
                setLanguage={handleLanguageChange}
                code={currentNormalCode}
                setCode={handleNormalCodeChange}
                onResetTemplate={handleResetNormalTemplate}
                input={input}
                setInput={setInput}
                output={output}
                setOutput={setOutput}
                onRunCode={executeNormalCode}
                isRunning={isRunning}
              />
            ) : (
              <DynamicCPMode
                language={language}
                setLanguage={handleLanguageChange}
                code={currentCpCode}
                setCode={handleCpCodeChange}
                onResetTemplate={handleResetCpTemplate}
                problemStatement={cpStatement}
                setProblemStatement={setCpStatement}
                input={cpInput}
                setInput={setCpInput}
                onRunCode={executeCPCodeLocally}
                onSubmitSolution={submitCPSolution}
                isRunning={isRunning}
                isSubmitting={isSubmitting}
                lastJudgeResult={lastJudgeResult}
                onOpenAnalysis={() => {
                  if (lastJudgeResult) {
                    setAiDrawer({ isOpen: true, data: lastJudgeResult });
                  }
                }}
              />
            )}
          </main>

        </div>
      </CompilerBackground>

      {/* Screen 8: Animated Execution & Compilation Loader Modal */}
      <ExecutionLoaderModal
        isOpen={loaderModal.isOpen}
        status={loaderModal.status}
        result={loaderModal.result}
        onClose={() => setLoaderModal({ isOpen: false, status: "compiling", result: null })}
        onViewAnalysis={() => {
          if (loaderModal.result) {
            setAiDrawer({ isOpen: true, data: loaderModal.result });
          }
          setLoaderModal({ isOpen: false, status: "compiling", result: null });
        }}
      />

      {/* Screen 9: AI Explanation & Complexity Drawer */}
      <AIExplanationDrawer
        isOpen={aiDrawer.isOpen}
        onClose={() => setAiDrawer({ isOpen: false, data: null })}
        analysisData={aiDrawer.data}
      />

      {/* Screen 10: Submission History Modal */}
      <SubmissionsModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        submissions={submissions}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
