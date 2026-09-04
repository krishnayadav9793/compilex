import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = [
  {
    id: 'dark',
    name: 'Dark Mode',
    category: 'Dark',
    description: 'Deep obsidian space with aurora violet & electric cyan highlights',
    monacoTheme: 'codesphere-obsidian',
    bg: '#030712',
    surface: '#080c18',
    text: '#f8fafc',
    accent: '#6366f1'
  },
  {
    id: 'light',
    name: 'Light Mode',
    category: 'Light',
    description: 'Pristine paper-white developer studio with high-contrast typography',
    monacoTheme: 'codesphere-light',
    bg: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    accent: '#4f46e5'
  }
];

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('codesphere_theme');
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.documentElement.classList.add('dark');
    }
    try {
      localStorage.setItem('codesphere_theme', theme);
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    setThemeState(newTheme === 'light' ? 'light' : 'dark');
  };

  const toggleTheme = () => {
    setThemeState(prev => prev === 'light' ? 'dark' : 'light');
  };

  const currentThemeConfig = theme === 'light' ? THEMES[1] : THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark: theme === 'dark', currentThemeConfig, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
