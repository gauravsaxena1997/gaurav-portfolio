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
export interface GuideBarProps {
  /** Optional message to override default hero content */
  message?: React.ReactNode;
  /** Label for the action button */
  actionLabel?: string;
  /** Handler for the action button */
  onAction?: () => void;
  /** If true, no close button and no auto-dismiss */
  isPersistent?: boolean;
  /** If true, force visibility (controlled by parent) */
  forceVisible?: boolean;
  /** If true, shows the greeting text (Hero mode). Default: true */
  showGreeting?: boolean;
}

/**
 * Guide Bar - Premium onboarding component & Interaction Guide
 * Shows welcome message (Hero) or contextual hints (Projects)
 */
export const GuideBar = memo(function GuideBar({
  message,
  actionLabel,
  onAction,
  isPersistent = false,
  forceVisible = false,
  showGreeting = true,
}: GuideBarProps) {
  const [isVisible, setIsVisible] = useState(forceVisible);
  const [isDismissing, setIsDismissing] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isTouchDevice } = useDeviceCapabilities();

  // Sync with forceVisible prop
  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      setIsDismissing(false);
      clearDismissTimer(); // Persistent mode doesn't auto-dismiss
    } else if (isPersistent) {
      // If persistent (controlled by parent) and forceVisible becomes false, hide it
      setIsVisible(false);
    }
  }, [forceVisible, isPersistent, message]);

  // Start auto-dismiss timer (Basic Hero Mode only)
  const startDismissTimer = useCallback(() => {
    if (isPersistent) return;

    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, AUTO_DISMISS_MS);
  }, [isPersistent]);

  // Clear dismiss timer
  const clearDismissTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Dismiss handler (triggers exit animation)
  const handleDismiss = useCallback(() => {
    if (isDismissing || isPersistent) return;

    clearDismissTimer();
    setIsDismissing(true);

    // After exit animation completes (350ms), hide component
    setTimeout(() => {
      setIsVisible(false);
    }, 350);
  }, [isDismissing, clearDismissTimer, isPersistent]);

  // Hero Mode: Show when entrance animation completes
  useEffect(() => {
    if (message || isPersistent) return; // Skip for custom modes

    const handleEntranceComplete = () => {
      // If user has already scrolled down, don't show the guide bar
      if (window.scrollY > 50) return;

      setIsVisible(true);
      startDismissTimer();
    };

    window.addEventListener('hero-entrance-complete', handleEntranceComplete);

    return () => {
      window.removeEventListener('hero-entrance-complete', handleEntranceComplete);
      clearDismissTimer();
    };
  }, [startDismissTimer, clearDismissTimer, message, isPersistent]);

  // Hero Mode: Handle scroll event (cancel timer + dismiss immediately)
  useEffect(() => {
    if (message || isPersistent) return; // Skip for custom modes
    if (!isVisible || isDismissing) return;

    const handleScroll = () => {
      clearDismissTimer();
      handleDismiss();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVisible, isDismissing, clearDismissTimer, handleDismiss, message, isPersistent]);

  // Don't render if not visible or during SSR
  if (typeof document === 'undefined' || !isVisible) return null;

  const guideBarContent = (
    <div
      className={`${styles.guideBar} ${isDismissing ? styles.dismissing : ''} ${isPersistent ? styles.persistent : ''}`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Avatar */}
      <Avatar className={styles.avatar} />

      {/* Content */}
      <div className={styles.content}>
        {message ? (
          // Custom Message Mode
          <div className={styles.customContent}>
            <span className={styles.messageText}>{message}</span>
            {actionLabel && onAction && (
              <button onClick={onAction} className={styles.actionButton}>
                {actionLabel}
              </button>
            )}
          </div>
        ) : showGreeting ? (
          // Default Hero Content (Greeting)
          <>
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
          </>
        ) : null}
      </div>

      {/* Close Button - Only if not persistent */}
      {!isPersistent && (
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
      )}
    </div>
  );

  // Use portal to render at body level
  return createPortal(guideBarContent, document.body);
});
