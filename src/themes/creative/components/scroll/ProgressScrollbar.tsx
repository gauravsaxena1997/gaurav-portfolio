'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ProgressScrollbar.module.css';

// Section breakpoint positions (as percentage of total progress)
// Hero starts at 5%, so we don't start at 0%
const SECTION_BREAKPOINTS = [
  5,   // Hero (we start here)
  20,  // Stats
  45,  // Projects
  70,  // Services
  85,  // Contact
  95,  // Credits
];

export function ProgressScrollbar() {
  const [progress, setProgress] = useState(0.05); // Start at 5% for hero
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const rawProgress = scrollTop / docHeight;
        // Adjust: 5% base + 95% of scroll progress
        const adjustedProgress = 0.05 + rawProgress * 0.95;
        setProgress(adjustedProgress);
      }
    };

    const handleScroll = () => {
      // Cancel any pending frame
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Schedule update on next frame for smooth performance
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    // Initial call
    updateProgress();

    // Add passive scroll listener for real-time updates
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also update on resize in case document height changes
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateProgress);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      {/* Progress track */}
      <div className={styles.track}>
        {/* Progress fill */}
        <div
          className={styles.fill}
          style={{ height: `${progress * 100}%` }}
        />

        {/* Subtle breakpoints for sections */}
        {SECTION_BREAKPOINTS.map((position, index) => (
          <div
            key={index}
            className={styles.breakpoint}
            style={{ top: `${position}%` }}
          />
        ))}
      </div>
    </div>
  );
}
