'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ThemeMode } from '@/types';

interface ThemeContextType {
  isDarkTheme: boolean;
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeState() {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      const theme = stored || 'dark';
      const isDark = theme === 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      return isDark;
    }
    return true;
  });

  useEffect(() => {
    // This effect can be used for other purposes if needed
    // Theme initialization is now handled in useState
  }, []);

  useEffect(() => {
    // Update localStorage and document data-theme attribute when theme changes
    const theme = isDarkTheme ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [isDarkTheme]);

  const toggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return {
    isDarkTheme,
    themeMode: isDarkTheme ? 'dark' : 'light' as ThemeMode,
    toggleTheme,
  };
}
