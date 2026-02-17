'use client';

import { Trash2, Minus } from 'lucide-react';
import styles from './chat.module.css';

interface ChatHeaderProps {
  onClose: () => void;
  onClear: () => void;
}

export function ChatHeader({ onClose, onClear }: ChatHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.headerInfo}>
        <h3 className={styles.headerTitle}>Gaurav's AI Assistant</h3>
        <p className={styles.headerHint}>
          <kbd className={styles.kbd}>C</kbd>
          <span>open</span>
          <span>·</span>
          <kbd className={styles.kbd}>Esc</kbd>
          <span>close</span>
        </p>
      </div>
      <div className={styles.headerActions}>
        <button
          onClick={onClear}
          aria-label="Clear chat"
          title="Clear chat"
          className={styles.iconBtn}
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={onClose}
          aria-label="Minimize chat"
          title="Minimize"
          className={styles.iconBtn}
        >
          <Minus size={16} />
        </button>
      </div>
    </div>
  );
}
