'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useDeviceCapabilities } from '../../hooks/useDeviceCapabilities';
import styles from './GuideBar.module.css';

// localStorage key for guide bar dismissal
const GUIDE_BAR_SHOWN_KEY = 'guide-bar-shown';
// Auto-dismiss timer (9 seconds - enough time to read comfortably)
const AUTO_DISMISS_MS = 9000;

/**
 * Keyboard badge component for displaying key hints
 */
function KeyboardBadge({ children }: { children: React.ReactNode }) {
  return <span className={styles.keyboardBadge}>{children}</span>;
}

/**
 * Avatar component - circular profile photo
 */
function Avatar({ className }: { className?: string }) {
  return (
    <div className={className}>
      <img
        src="/profile.jpg"
        alt="Gaurav Saxena"
        width="40"
        height="40"
      />
    </div>
  );
}

/**
 * Guide Bar - Premium onboarding component
 * Shows welcome message and lighthouse toggle hint
 * Auto-dismisses after 4.5s or on scroll
 */
export const GuideBar = memo(function GuideBar() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isTouchDevice } = useDeviceCapabilities();

  // Start auto-dismiss timer
  const startDismissTimer = useCallback(() => {
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_MS);
  }, []);

  // Clear dismiss timer
  const clearDismissTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Dismiss handler (triggers exit animation)
  const handleDismiss = useCallback(() => {
    if (isDismissing) return; // Prevent double-dismiss

    clearDismissTimer();
    setIsDismissing(true);

    // After exit animation completes (350ms), hide component
    setTimeout(() => {
      setIsVisible(false);
    }, 350);
  }, [isDismissing, clearDismissTimer]);

  // Show when hero entrance animation completes
  useEffect(() => {
    const handleEntranceComplete = () => {
      setIsVisible(true);
      startDismissTimer();
    };

    window.addEventListener('hero-entrance-complete', handleEntranceComplete);

    return () => {
      window.removeEventListener('hero-entrance-complete', handleEntranceComplete);
      clearDismissTimer();
    };
  }, [startDismissTimer, clearDismissTimer]);

  // Handle scroll event (cancel timer + dismiss immediately)
  useEffect(() => {
    if (!isVisible || isDismissing) return;

    const handleScroll = () => {
      // User scrolled → cancel timer and dismiss immediately
      clearDismissTimer();
      handleDismiss();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isVisible, isDismissing, clearDismissTimer, handleDismiss]);

  // Don't render if not visible or during SSR
  if (typeof document === 'undefined' || !isVisible) return null;

  const guideBarContent = (
    <div
      className={`${styles.guideBar} ${isDismissing ? styles.dismissing : ''}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Avatar */}
      <Avatar className={styles.avatar} />

      {/* Content */}
      <div className={styles.content}>
        <p className={styles.primary}>
          Hi! I&apos;m Gaurav. Thanks for stopping by.
        </p>
        <p className={styles.secondary}>
          I built this space to share my work and story with you.
        </p>
        <p className={styles.hint}>
          {isTouchDevice ? (
            <>See the lighthouse? Tap it to toggle the spotlight.</>
          ) : (
            <>
              See the lighthouse? Press{' '}
              <KeyboardBadge>L</KeyboardBadge>{' '}
              or click it to toggle the spotlight.
            </>
          )}
        </p>
      </div>

      {/* Close Button */}
      <button
        className={styles.closeButton}
        onClick={handleDismiss}
        aria-label="Dismiss guide"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  // Use portal to render at body level
  return createPortal(guideBarContent, document.body);
});
