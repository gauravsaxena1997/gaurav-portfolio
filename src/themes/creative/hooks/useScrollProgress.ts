'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useScrollContext } from '../context/ScrollContext';

interface UseScrollProgressOptions {
  sectionId: string;
  onProgressChange?: (progress: number) => void;
  onEnter?: () => void;
  onLeave?: () => void;
}

export function useScrollProgress({
  sectionId,
  onProgressChange,
  onEnter,
  onLeave,
}: UseScrollProgressOptions) {
  const { updateSectionProgress, setActiveSection, setScrollDirection } = useScrollContext();
  const lastScrollY = useRef(0);
  const hasEntered = useRef(false);

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Determine scroll direction
    if (currentScrollY > lastScrollY.current) {
      setScrollDirection('down');
    } else if (currentScrollY < lastScrollY.current) {
      setScrollDirection('up');
    }

    lastScrollY.current = currentScrollY;
  }, [setScrollDirection]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Update progress for this section
  const updateProgress = useCallback(
    (progress: number) => {
      updateSectionProgress(sectionId, progress);

      if (progress > 0 && progress < 1 && !hasEntered.current) {
        hasEntered.current = true;
        setActiveSection(sectionId);
        onEnter?.();
      }

      if ((progress <= 0 || progress >= 1) && hasEntered.current) {
        hasEntered.current = false;
        onLeave?.();
      }

      onProgressChange?.(progress);
    },
    [sectionId, updateSectionProgress, setActiveSection, onEnter, onLeave, onProgressChange]
  );

  return {
    updateProgress,
  };
}

// Hook for getting theme preference
export function useThemePreference() {
  const getInitialTheme = (): 'dark' | 'light' => {
    if (typeof window === 'undefined') return 'dark';

    const saved = localStorage.getItem('creative-theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }

    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }

    return 'dark';
  };

  return { getInitialTheme };
}
