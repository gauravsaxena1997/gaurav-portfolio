'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './ProgressScrollbar.module.css';

// Section IDs to track for dynamic breakpoints
const SECTION_IDS = [
  'hero-stats-section',
  'projects-section',
  'projects-services-transition',
  'services-section',
  'services-contact-transition',
];

// Fallback positions if sections not found
const FALLBACK_BREAKPOINTS = [5, 20, 45, 70, 85, 95];

export function ProgressScrollbar() {
  const [progress, setProgress] = useState(0.05);
  const [breakpoints, setBreakpoints] = useState<number[]>(FALLBACK_BREAKPOINTS);
  const [activeBreakpoint, setActiveBreakpoint] = useState(0);
  const rafRef = useRef<number | null>(null);

  // Calculate breakpoints based on actual section positions
  const calculateBreakpoints = useCallback(() => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) return;

    const positions: number[] = [5]; // Start at 5% for hero

    SECTION_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const elementTop = rect.top + scrollTop;
        const percentage = (elementTop / (totalHeight + window.innerHeight)) * 100;

        // Only add if it's a valid position and different enough from previous
        if (percentage > 0 && percentage < 100) {
          const lastPos = positions[positions.length - 1];
          if (Math.abs(percentage - lastPos) > 5) {
            positions.push(Math.round(percentage));
          }
        }
      }
    });

    // Add end breakpoint
    if (positions[positions.length - 1] < 90) {
      positions.push(95);
    }

    setBreakpoints(positions);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const rawProgress = scrollTop / docHeight;
        const adjustedProgress = 0.05 + rawProgress * 0.95;
        setProgress(adjustedProgress);

        // Determine active breakpoint
        const currentPercent = adjustedProgress * 100;
        let active = 0;
        for (let i = breakpoints.length - 1; i >= 0; i--) {
          if (currentPercent >= breakpoints[i]) {
            active = i;
            break;
          }
        }
        setActiveBreakpoint(active);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    const handleResize = () => {
      calculateBreakpoints();
      updateProgress();
    };

    // Initial calculations after DOM is ready
    const initTimeout = setTimeout(() => {
      calculateBreakpoints();
      updateProgress();
    }, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [breakpoints, calculateBreakpoints]);

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ height: `${progress * 100}%` }}
        />

        {breakpoints.map((position, index) => (
          <div
            key={index}
            className={`${styles.breakpoint} ${index === activeBreakpoint ? styles.breakpointActive : ''}`}
            style={{ top: `${position}%` }}
          />
        ))}
      </div>
    </div>
  );
}
