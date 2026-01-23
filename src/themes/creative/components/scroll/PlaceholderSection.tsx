'use client';

import styles from './PlaceholderSection.module.css';

interface PlaceholderSectionProps {
  id: string;
  title: string;
  variant?: 'default' | 'horizontal-panel' | 'transition';
  children?: React.ReactNode;
}

export function PlaceholderSection({
  id,
  title,
  variant = 'default',
  children,
}: PlaceholderSectionProps) {
  const variantClass = {
    default: styles.default,
    'horizontal-panel': styles.horizontalPanel,
    transition: styles.transition,
  }[variant];

  return (
    <div id={id} className={`${styles.placeholder} ${variantClass}`} data-section={id}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {children && <div className={styles.children}>{children}</div>}
        <span className={styles.sectionId}>{id}</span>
      </div>
    </div>
  );
}
