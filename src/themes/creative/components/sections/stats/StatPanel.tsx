'use client';

import { memo, ReactNode } from 'react';
import styles from './StatPanel.module.css';

interface StatPanelProps {
  /** Panel title */
  title: string;
  /** Personal description paragraph (first person, 2 sentences) */
  description: string;
  /** Highlight/result items with checkmarks */
  highlights?: string[];
  /** Illustration component to render */
  illustration: ReactNode;
  /** Position of illustration: 'bottom' (default) or 'top' */
  illustrationPosition?: 'top' | 'bottom';
  /** Additional class name for the panel */
  className?: string;
}

/**
 * Individual stat panel component with vertical stacked layout
 * Uses space-between for even distribution
 */
export const StatPanel = memo(function StatPanel({
  title,
  description,
  highlights,
  illustration,
  illustrationPosition = 'bottom',
  className,
}: StatPanelProps) {
  const contentClass = illustrationPosition === 'top'
    ? styles.statContentReversed
    : styles.statContent;

  return (
    <div className={`${styles.statPanel} ${className || ''}`}>
      <div className={contentClass}>
        {/* Text content */}
        <div className={styles.textContent}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.description}>{description}</p>

          {highlights && highlights.length > 0 && (
            <ul className={styles.pointsList}>
              {highlights.map((highlight, index) => (
                <li key={index} className={styles.point}>
                  <span className={styles.pointCheck}>✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Illustration - no tilt */}
        <div className={styles.illustrationContainer}>
          <div className={styles.tiltWrapper}>
            <div className={styles.illustration}>
              {illustration}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
