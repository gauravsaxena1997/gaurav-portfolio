'use client';

import { useState, useEffect } from 'react';
import { useCreativeTheme } from './hooks/useCreativeTheme';
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
  const { theme, toggleTheme } = useCreativeTheme();

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
