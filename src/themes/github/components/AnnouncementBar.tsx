'use client';

import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import styles from './AnnouncementBar.module.css';

const STORAGE_KEY = 'announcement_dismissed_date';

function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

function wasDismissedToday(): boolean {
  if (typeof window === 'undefined') return false;
  const dismissedDate = localStorage.getItem(STORAGE_KEY);
  return dismissedDate === getTodayDateString();
}

function dismissForToday(): void {
  localStorage.setItem(STORAGE_KEY, getTodayDateString());
}

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if already dismissed today
    if (!wasDismissedToday()) {
      setIsVisible(true);
      document.body.classList.add('has-announcement');
    }

    return () => {
      document.body.classList.remove('has-announcement');
    };
  }, []);

  const handleDismiss = () => {
    dismissForToday();
    setIsVisible(false);
    document.body.classList.remove('has-announcement');
  };

  if (!isVisible) return null;

  return (
    <div className={styles.announcementBar}>
      <div className={styles.content}>
        <AlertCircle size={16} className={styles.icon} />
        <span className={styles.message}>
          <strong>Wait, this isn&apos;t GitHub!</strong> You&apos;ve landed on my portfolio.
          Same vibes, different repos. Welcome!
        </span>
      </div>
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
      >
        <X size={16} />
      </button>
    </div>
  );
}
