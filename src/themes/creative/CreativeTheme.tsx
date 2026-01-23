'use client';

import { useState, useSyncExternalStore } from 'react';
import { Sun, Moon } from 'lucide-react';
import { ScrollProvider } from './context/ScrollContext';
import { ScrollOrchestrator } from './components/scroll/ScrollOrchestrator';
import { ProgressScrollbar } from './components/scroll/ProgressScrollbar';
import { ProjectSectionHeader } from './components/scroll/ProjectSectionHeader';

import './styles/theme.css';
import './styles/scrollbar.css';
import styles from './styles/creative.module.css';

// Hook to safely check if we're on the client
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Hook to get initial theme from localStorage/system preference
function getInitialTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('creative-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  if (window.matchMedia('(prefers-color-scheme: light)').matches) return 'light';
  return 'dark';
}

export function CreativeTheme() {
  const mounted = useIsMounted();
  // Initialize theme from localStorage (lazy initialization handles client-side read)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getInitialTheme());

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('creative-theme', newTheme);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ScrollProvider>
      <div
        className={`${styles.creativeTheme} creative-theme`}
        data-theme={theme}
      >
        {/* Theme Toggle Button */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Custom Progress Scrollbar */}
        <ProgressScrollbar />

        {/* Project Section Header - Fixed position, appears when projects section at top */}
        <ProjectSectionHeader />

        {/* Main Scroll Content */}
        <main className={styles.scrollContainer}>
          <ScrollOrchestrator />
        </main>
      </div>
    </ScrollProvider>
  );
}
