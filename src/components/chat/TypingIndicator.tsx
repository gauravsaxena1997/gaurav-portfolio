'use client';

import Image from 'next/image';
import styles from './chat.module.css';

export function TypingIndicator() {
  return (
    <div className={styles.typingRow} aria-label="Assistant is typing">
      <Image
        src="/chat-avatar.webp"
        alt="Gaurav"
        width={32}
        height={32}
        className={styles.avatar}
      />
      <div className={styles.typingBubble}>
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
        <span className={styles.typingDot} />
      </div>
    </div>
  );
}
