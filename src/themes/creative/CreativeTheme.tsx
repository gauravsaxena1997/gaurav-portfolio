'use client';

import { ScrollProvider } from './context/ScrollContext';
import { ScrollOrchestrator } from './components/scroll/ScrollOrchestrator';
import { ProgressScrollbar } from './components/scroll/ProgressScrollbar';
import { Header } from './components/header/Header';
import { ClickTrigger } from './components/ui';


import './styles/theme.css';
import './styles/scrollbar.css';
import styles from './styles/creative.module.css';

interface CreativeThemeProps {
  currentTheme: 'creative' | 'github';
  onThemeChange: (theme: 'creative' | 'github') => void;
  activeSubTheme?: string;
}

export function CreativeTheme({ currentTheme, onThemeChange, activeSubTheme = '' }: CreativeThemeProps) {
  return (
    <ScrollProvider>
      <div
        className={`${styles.creativeTheme} creative-theme ${activeSubTheme}`}
      >
        {/* Fixed Header */}
        <Header
          currentTheme={currentTheme}
          onThemeChange={onThemeChange}
        />

        {/* Custom Progress Scrollbar */}
        <ProgressScrollbar />

        {/* Site-wide cursor click burst animation */}
        <ClickTrigger />

        {/* Main Scroll Content */}
        <main className={styles.scrollContainer}>
          <ScrollOrchestrator />
        </main>
      </div>
    </ScrollProvider>
  );
}
