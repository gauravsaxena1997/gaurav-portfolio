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
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  useEffect(() => {
    // Check localStorage on mount
    const stored = localStorage.getItem('theme');
    if (stored) {
      setIsDarkTheme(stored === 'dark');
    }
  }, []);

  useEffect(() => {
    // Update localStorage and document class when theme changes
    localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
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
