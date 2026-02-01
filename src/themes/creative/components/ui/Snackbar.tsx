'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './Snackbar.module.css';

interface SnackbarProps {
  /** Whether the snackbar is visible */
  isVisible: boolean;
  /** Callback when close button is clicked */
  onClose: () => void;
  /** Auto-dismiss after this many milliseconds (0 = no auto-dismiss) */
  autoDismissMs?: number;
  /** Content to display */
  children: React.ReactNode;
}

/**
 * Generic Snackbar/Toast notification component
 * Slides up from bottom center with close button
 */
export const Snackbar = memo(function Snackbar({
  isVisible,
  onClose,
  autoDismissMs = 0,
  children,
}: SnackbarProps) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-dismiss logic
  useEffect(() => {
    if (isVisible && autoDismissMs > 0) {
      timerRef.current = setTimeout(() => {
        onClose();
      }, autoDismissMs);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, autoDismissMs, onClose]);

  // Handle Escape key to close
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  const snackbarContent = (
    <div
      className={`${styles.snackbar} ${isVisible ? styles.visible : ''}`}
      role="alert"
      aria-live="polite"
      onKeyDown={handleKeyDown}
    >
      <div className={styles.message}>{children}</div>
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Dismiss notification"
        type="button"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );

  // Use portal to render at body level, avoiding overflow:hidden clipping
  // Check for SSR before using document
  if (typeof document === 'undefined') return null;
  return createPortal(snackbarContent, document.body);
});

/**
 * Key component for displaying keyboard shortcuts in snackbar
 */
export function SnackbarKey({ children }: { children: React.ReactNode }) {
  return <span className={styles.key}>{children}</span>;
}
