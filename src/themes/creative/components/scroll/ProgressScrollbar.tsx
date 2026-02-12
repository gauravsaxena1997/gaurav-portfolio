'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ProgressScrollbar.module.css';

export function ProgressScrollbar() {
  const [progress, setProgress] = useState(0.05);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      if (docHeight > 0) {
        const rawProgress = scrollTop / docHeight;
        const adjustedProgress = 0.05 + rawProgress * 0.95;
        setProgress(adjustedProgress);
      }
    };

    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      rafRef.current = requestAnimationFrame(updateProgress);
    };

    // Initial calculation after DOM is ready
    const initTimeout = setTimeout(updateProgress, 100);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(initTimeout);
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.progressContainer} aria-hidden="true">
      <div className={styles.track}>
        <div
          className={styles.fill}
          style={{ height: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
