'use client';

import { useRef, useEffect, useState, type RefObject } from 'react';
import { useChat } from '@/hooks/useChat';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { SuggestedQuestions } from './SuggestedQuestions';
import styles from './chat.module.css';

interface ChatWindowProps {
  onClose: () => void;
  inputRef?: RefObject<HTMLTextAreaElement | null>;
}

export function ChatWindow({ onClose, inputRef }: ChatWindowProps) {
  const { messages, status, error, sendMessage, clearChat, dismissError } =
    useChat();
  const windowRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile and handle scroll locking
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Lock body scroll and hide progress bar on mobile
    const progressBar = document.querySelector('[data-scroll-progress]') as HTMLElement;
    const isMobileView = window.innerWidth <= 768;
    
    if (isMobileView) {
      // Mobile: lock page scroll completely
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      if (progressBar) progressBar.style.display = 'none';
    } else {
      // Desktop: allow page scroll but prevent bleed
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      if (progressBar) progressBar.style.display = '';
    }

    // Focus window
    windowRef.current?.focus();

    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      if (progressBar) progressBar.style.display = '';
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef?.current?.focus(), 100);
  }, [inputRef]);

  // Prevent scroll bleed: stop wheel events from propagating to body
  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      const scrollable = el.querySelector('[data-chat-scroll]') as HTMLElement;
      if (!scrollable) return;
      const { scrollTop, scrollHeight, clientHeight } = scrollable;
      const atTop = scrollTop <= 0 && e.deltaY < 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1 && e.deltaY > 0;
      if (atTop || atBottom) e.preventDefault();
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  return (
    <div
      ref={windowRef}
      className={`${styles.chatWindow} ${isMobile ? styles.mobile : ''}`}
      role="dialog"
      aria-label="Chat with Gaurav's AI assistant"
      tabIndex={-1}
    >
      <ChatHeader onClose={onClose} onClear={clearChat} />

      <div className={styles.body}>
        {messages.length === 0 ? (
          <SuggestedQuestions onSelect={sendMessage} />
        ) : (
          <MessageList messages={messages} status={status} onSendFollowup={sendMessage} />
        )}
      </div>

      {error && (
        <div className={styles.errorBar} role="alert">
          <span>{error}</span>
          <button onClick={dismissError} aria-label="Dismiss error">
            ✕
          </button>
        </div>
      )}

      <ChatInput
        onSend={sendMessage}
        disabled={status === 'loading' || status === 'streaming'}
        textareaRef={inputRef}
      />
    </div>
  );
}
