import React from 'react';
import { Editor } from '@monaco-editor/react';

function CodeEditor({ language, code, setCode }) {
  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const getMonacoLanguage = (lang) => {
    switch (lang) {
      case 'cpp':
      case 'c++':
        return 'cpp';
      case 'c':
        return 'c';
      case 'python':
      case 'python3':
        return 'python';
      case 'java':
        return 'java';
      case 'javascript':
      case 'js':
      default:
        return 'javascript';
    }
  };

  return (
    <div className="w-full h-full min-h-[550px] rounded-xl overflow-hidden bg-slate-950/80">
      <Editor
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 16, bottom: 16 },
          roundedSelection: true,
          renderLineHighlight: "all",
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          lineHeight: 22,
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          matchBrackets: "always",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
        }}
      />
    </div>
  );
}

export default CodeEditor;
