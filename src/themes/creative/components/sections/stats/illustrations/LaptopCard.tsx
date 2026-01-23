'use client';

import { memo, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './LaptopCard.module.css';

interface LaptopCardProps {
  className?: string;
}

/**
 * 3D perspective laptop card with terminal content
 * Features subtle auto-scrolling terminal effect
 */
export const LaptopCard = memo(function LaptopCard({
  className,
}: LaptopCardProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll effect for terminal
  useEffect(() => {
    if (!scrollRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Subtle continuous scroll
    gsap.to(scrollRef.current, {
      y: -20,
      repeat: -1,
      yoyo: true,
      duration: 4,
      ease: 'sine.inOut',
    });

    return () => {
      if (scrollRef.current) gsap.killTweensOf(scrollRef.current);
    };
  }, []);

  return (
    <div className={`${styles.laptopWrapper} ${className || ''}`}>
      <div className={styles.laptopCard}>
        <div className={styles.laptopScreen}>
          {/* Window chrome */}
          <div className={styles.windowControls}>
            <span className={styles.dotRed} />
            <span className={styles.dotYellow} />
            <span className={styles.dotGreen} />
          </div>

          {/* Terminal content with scroll effect */}
          <div ref={terminalRef} className={styles.terminal}>
            <div ref={scrollRef} className={styles.terminalScroll}>
              <p className={styles.command}>
                <span className={styles.prompt}>gaurav@dev ~ $</span>
                {' '}ls projects/
              </p>
              <p className={styles.output}>
                startup-mvp/    enterprise-app/    saas-platform/
              </p>
              <p className={styles.command}>
                <span className={styles.prompt}>gaurav@dev ~ $</span>
                {' '}building awesome products...
              </p>
              <div className={styles.progressBar}>
                <span className={styles.progressFill}>████████████████</span>
                <span className={styles.progressPercent}>100%</span>
              </div>
              <p className={styles.stats}>
                <span className={styles.statsHighlight}>5+ years</span>
                {' | '}
                <span className={styles.statsHighlight}>1000+ users</span>
                {' | shipped ✓'}
              </p>
              <p className={styles.command}>
                <span className={styles.prompt}>gaurav@dev ~ $</span>
                <span className={styles.cursor}>_</span>
              </p>
            </div>
          </div>
        </div>

        {/* Laptop base hint */}
        <div className={styles.laptopBase} />
      </div>
    </div>
  );
});
