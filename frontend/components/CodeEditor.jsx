import React, { useRef, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '../src/components/Common/ThemeContext';
import { registerCustomSuggestions } from '../src/utils/monacoSuggestions';

function CodeEditor({ language, code, setCode }) {
  const { theme } = useTheme();
  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const defineThemes = (monaco) => {
    if (!monaco?.editor) return;

    // 1. compileX Shiny Dark Black (Obsidian OLED) Theme
    monaco.editor.defineTheme('compilex-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '71717a', fontStyle: 'italic' },
        { token: 'keyword', foreground: '818cf8', fontStyle: 'bold' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: 'c084fc' },
        { token: 'delimiter', foreground: 'e2e8f0' }
      ],
      colors: {
        'editor.background': '#000000',
        'editor.foreground': '#f8fafc',
        'editorLineNumber.foreground': '#3f3f46',
        'editorLineNumber.activeForeground': '#38bdf8',
        'editor.lineHighlightBackground': '#06060c',
        'editor.selectionBackground': '#1e1e36',
        'editorCursor.foreground': '#38bdf8',
        'editorWidget.background': '#090910',
        'editorWidget.border': '#27272a'
      }
    });

    // 2. MathLens / compileX Sage & Linen Light Theme
    monaco.editor.defineTheme('compilex-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '8c9484', fontStyle: 'italic' },
        { token: 'keyword', foreground: '697951', fontStyle: 'bold' },
        { token: 'string', foreground: '424f34' },
        { token: 'number', foreground: '8f7642' },
        { token: 'type', foreground: '5b7a56' },
        { token: 'identifier', foreground: '292f25' }
      ],
      colors: {
        'editor.background': '#faf9f2',
        'editor.foreground': '#292f25',
        'editorLineNumber.foreground': '#9ba192',
        'editorLineNumber.activeForeground': '#697951',
        'editor.lineHighlightBackground': '#f2f4ea',
        'editor.selectionBackground': '#dce5d2',
        'editorCursor.foreground': '#697951',
        'editorWidget.background': '#ffffff',
        'editorWidget.border': '#d8dece'
      }
    });

    // Backwards compatibility fallbacks
    monaco.editor.defineTheme('codesphere-obsidian', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: { 'editor.background': '#0a0806' }
    });
    monaco.editor.defineTheme('codesphere-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: { 'editor.background': '#faf9f2' }
    });
  };

  // Critical fix: define themes BEFORE editor mounts so Monaco never falls back to white 'vs'
  const handleBeforeMount = (monaco) => {
    monacoRef.current = monaco;
    defineThemes(monaco);
  };

  const handleEditorMount = (editor, monaco) => {
    monacoRef.current = monaco;
    editorRef.current = editor;
    defineThemes(monaco);

    const targetTheme = theme === 'light' ? 'compilex-light' : 'compilex-dark';
    monaco.editor.setTheme(targetTheme);

    registerCustomSuggestions(monaco);
  };

  // Keep editor theme synchronized whenever theme toggles
  useEffect(() => {
    if (monacoRef.current) {
      const targetTheme = theme === 'light' ? 'compilex-light' : 'compilex-dark';
      monacoRef.current.editor.setTheme(targetTheme);
    }
  }, [theme]);

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

  const currentMonacoTheme = theme === 'light' ? 'compilex-light' : 'compilex-dark';

  return (
    <div 
      className="w-full h-full min-h-[350px] sm:min-h-[440px] rounded-xl overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: 'var(--bg-terminal, var(--bg-primary))' }}
    >
      <Editor
        language={getMonacoLanguage(language)}
        value={code}
        onChange={handleEditorChange}
        beforeMount={handleBeforeMount}
        onMount={handleEditorMount}
        theme={currentMonacoTheme}
        loading={
          <div 
            className="w-full h-full min-h-[350px] sm:min-h-[440px] flex items-center justify-center font-mono text-xs opacity-60"
            style={{ 
              backgroundColor: 'var(--bg-terminal, var(--bg-primary))',
              color: 'var(--text-muted)'
            }}
          >
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Loading editor...</span>
            </div>
          </div>
        }
        options={{
          fontSize: 13.5,
          fontFamily: "'JetBrains Mono', 'SF Mono', Menlo, Monaco, 'Fira Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          lineNumbers: "on",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          automaticLayout: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 14, bottom: 14 },
          roundedSelection: true,
          renderLineHighlight: "all",
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          lineHeight: 21,
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
