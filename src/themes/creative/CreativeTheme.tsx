'use client';

import { useState, useEffect } from 'react';
import { ScrollProvider } from './context/ScrollContext';
import { ScrollOrchestrator } from './components/scroll/ScrollOrchestrator';
import { ProgressScrollbar } from './components/scroll/ProgressScrollbar';
import { Header } from './components/header/Header';
import { GuideBar } from './components/ui';

import './styles/theme.css';
import './styles/scrollbar.css';
import styles from './styles/creative.module.css';

interface CreativeThemeProps {
  currentTheme: 'creative' | 'github';
  onThemeChange: (theme: 'creative' | 'github') => void;
}

export function CreativeTheme({ currentTheme, onThemeChange }: CreativeThemeProps) {
  // Initialize theme from localStorage with lazy initialization (prevents hydration mismatch)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('creative-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    // Default to light mode if no preference saved
    return 'light';
  });

  // Apply theme to document root for global access (e.g., portaled modals)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('creative-theme', newTheme);
  };

  return (
    <ScrollProvider>
      <div
        className={`${styles.creativeTheme} creative-theme`}
        data-theme={theme}
        suppressHydrationWarning
      >
        {/* Fixed Header */}
        <Header
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
          themeMode={theme}
          onModeToggle={toggleTheme}
        />

        {/* Custom Progress Scrollbar */}
        <ProgressScrollbar />

        {/* Main Scroll Content */}
        <main className={styles.scrollContainer}>
          <ScrollOrchestrator />
        </main>

        {/* Guide Bar - Welcome message and lighthouse hint */}
        <GuideBar />
      </div>
    </ScrollProvider>
  );
}
