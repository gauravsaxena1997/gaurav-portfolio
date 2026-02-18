'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { ChatWindow } from './ChatWindow';
import styles from './chat.module.css';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openChat = useCallback(() => {
    setIsOpen(true);
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Keyboard: C to open (focus input), Esc to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable;

      if (e.key === 'Escape' && isOpen) {
        closeChat();
        return;
      }

      if (e.key.toLowerCase() === 'c' && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping) {
        e.preventDefault();
        if (!isOpen) {
          openChat();
          setTimeout(() => inputRef.current?.focus(), 100);
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, openChat, closeChat]);

  // Return focus to FAB when chat closes
  useEffect(() => {
    if (!isOpen && containerRef.current) {
      const fabButton = containerRef.current.querySelector('button[aria-label*="Open chat"]') as HTMLButtonElement;
      fabButton?.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef}>
      {isOpen && (
        <ChatWindow
          onClose={closeChat}
          inputRef={inputRef}
        />
      )}

      <button
        onClick={isOpen ? closeChat : openChat}
        className={`${styles.fab} ${isOpen ? styles.fabOpen : ''}`}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant (C)'}
        aria-expanded={isOpen}
      >
        {isOpen ? (
          <div className={styles.fabClose}>
            <X size={22} strokeWidth={2.5} />
          </div>
        ) : (
          <div className={styles.fabBubble}>
            <Image
              src="/chat-avatar.webp"
              alt="Chat with Gaurav"
              width={64}
              height={64}
              className={styles.fabIcon}
            />
          </div>
        )}
      </button>
    </div>
  );
}
