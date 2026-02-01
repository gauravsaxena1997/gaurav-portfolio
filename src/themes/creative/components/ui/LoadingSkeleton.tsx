'use client';

import styles from './LoadingSkeleton.module.css';

interface LoadingSkeletonProps {
  type: 'laptop' | 'chips' | 'globe';
}

export function LoadingSkeleton({ type }: LoadingSkeletonProps) {
  return (
    <div className={styles.skeleton} data-type={type}>
      <div className={styles.shimmer} />
      <div className={styles.content}>
        {type === 'laptop' && (
          <div className={styles.laptopShape}>
            <div className={styles.screen} />
            <div className={styles.base} />
          </div>
        )}
        {type === 'chips' && (
          <div className={styles.chipsShape}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.chip} style={{ animationDelay: `${i * 0.1}s` }} />
            ))}
          </div>
        )}
        {type === 'globe' && (
          <div className={styles.globeShape}>
            <div className={styles.circle} />
          </div>
        )}
      </div>
    </div>
  );
}
