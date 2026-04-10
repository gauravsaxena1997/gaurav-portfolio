'use client';

import { ScrollProvider } from './context/ScrollContext';
import { ScrollOrchestrator } from './components/scroll/ScrollOrchestrator';
import { ProgressScrollbar } from './components/scroll/ProgressScrollbar';
import { Header } from './components/header/Header';
import { ClickTrigger } from './components/ui';
import { GestureProvider } from './context/GestureContext';
import { HandGestureManager } from './components/shared/HandGestureManager';
import { GestureFeedback } from './components/shared/GestureFeedback';
import { useEffect } from 'react';


import './styles/theme.css';
import './styles/scrollbar.css';
import styles from './styles/creative.module.css';

interface CreativeThemeProps {
  currentTheme: 'creative' | 'github';
  onThemeChange: (theme: 'creative' | 'github') => void;
  activeSubTheme?: string;
}

export function CreativeTheme({ currentTheme, onThemeChange, activeSubTheme = '' }: CreativeThemeProps) {
  // Apply theme classes to body so portals (like FAQModal) inherit variables
  useEffect(() => {
    const classes = ['creative-theme', activeSubTheme].filter(Boolean);
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [activeSubTheme]);

  return (
    <GestureProvider>
      <ScrollProvider>
        <div
          className={`${styles.creativeTheme} creative-theme ${activeSubTheme}`}
        >
          {/* Site-wide Headless Gesture Engine */}
          <HandGestureManager />

          {/* Fixed Header */}
          <Header
            currentTheme={currentTheme}
            onThemeChange={onThemeChange}
          />

          {/* Custom Progress Scrollbar */}
          <ProgressScrollbar />

          {/* Site-wide cursor click burst animation */}
          <ClickTrigger />

          {/* Gesture Visual Feedback (Follower) */}
          <GestureFeedback />

          {/* Main Scroll Content */}
          <main className={styles.scrollContainer}>
            <ScrollOrchestrator />
          </main>
        </div>
      </ScrollProvider>
    </GestureProvider>
  );
}
