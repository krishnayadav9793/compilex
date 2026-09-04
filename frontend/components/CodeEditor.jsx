import React from 'react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '../src/components/Common/ThemeContext';
import { registerCustomSuggestions } from '../src/utils/monacoSuggestions';

function CodeEditor({ language, code, setCode }) {
  const { theme } = useTheme();

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorMount = (editor, monaco) => {
    registerCustomSuggestions(monaco);

    // 1. Obsidian Studio Theme
    monaco.editor.defineTheme('codesphere-obsidian', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '64748b', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'string', foreground: '38bdf8' },
        { token: 'number', foreground: 'f472b6' },
        { token: 'type', foreground: 'c084fc' }
      ],
      colors: {
        'editor.background': '#080c18',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#334155',
        'editorLineNumber.activeForeground': '#818cf8',
        'editor.lineHighlightBackground': '#0e1424',
        'editor.selectionBackground': '#312e81',
        'editorCursor.foreground': '#818cf8'
      }
    });

    // 2. Clean Pure Light Theme (Linear / Vercel style)
    monaco.editor.defineTheme('codesphere-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '94a3b8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '6366f1', fontStyle: 'bold' },
        { token: 'string', foreground: '0d9488' },
        { token: 'number', foreground: 'd97706' },
        { token: 'type', foreground: '8b5cf6' },
        { token: 'identifier', foreground: '0f172a' }
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#0f172a',
        'editorLineNumber.foreground': '#94a3b8',
        'editorLineNumber.activeForeground': '#4f46e5',
        'editor.lineHighlightBackground': '#f8fafc',
        'editor.selectionBackground': '#e0e7ff',
        'editorCursor.foreground': '#4f46e5'
      }
    });
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

  const getMonacoTheme = () => {
    return theme === 'light' ? 'codesphere-light' : 'codesphere-obsidian';
  };

  return (
    <div 
      className="w-full h-full min-h-[550px] rounded-xl overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-surface)' }}
    >
      <Editor
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        onMount={handleEditorMount}
        theme={getMonacoTheme()}
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
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
          },
          suggestOnTriggerCharacters: true,
          wordBasedSuggestions: "allDocuments",
          acceptSuggestionOnEnter: "on",
          tabCompletion: "on",
          matchBrackets: "always",
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
        }}
      />
    </div>
  );
}

export default CodeEditor;
