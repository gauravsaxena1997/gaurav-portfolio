'use client';

import { Rocket } from 'lucide-react';
import { useScrollToTop } from '../hooks';
import styles from './ScrollToTop.module.css';

export function ScrollToTop() {
  const { showScrollTop, scrollToTop } = useScrollToTop(300);

  return (
    <button
      className={`${styles.scrollTopBtn} ${showScrollTop ? styles.visible : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <Rocket size={20} />
    </button>
  );
}
