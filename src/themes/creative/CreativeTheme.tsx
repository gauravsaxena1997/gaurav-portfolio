'use client';

import { ScrollProvider } from './context/ScrollContext';
import { ScrollOrchestrator } from './components/scroll/ScrollOrchestrator';
import { ProgressScrollbar } from './components/scroll/ProgressScrollbar';
import { Header } from './components/header/Header';

import './styles/theme.css';
import './styles/scrollbar.css';
import styles from './styles/creative.module.css';

interface CreativeThemeProps {
  currentTheme: 'creative' | 'github';
  onThemeChange: (theme: 'creative' | 'github') => void;
}

export function CreativeTheme({ currentTheme, onThemeChange }: CreativeThemeProps) {
  return (
    <ScrollProvider>
      <div
        className={`${styles.creativeTheme} creative-theme`}
      >
        {/* Fixed Header */}
        <Header
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />

        {/* Custom Progress Scrollbar */}
        <ProgressScrollbar />

        {/* Main Scroll Content */}
        <main className={styles.scrollContainer}>
          <ScrollOrchestrator />
        </main>
      </div>
    </ScrollProvider>
  );
}
