'use client';

import { useRef, useEffect, useState, useCallback, type RefObject } from 'react';
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

    const progressBar = document.querySelector('[data-scroll-progress]') as HTMLElement;
    const isMobileView = window.innerWidth <= 768;

    if (isMobileView) {
      // Mobile: lock page scroll WITHOUT position:fixed
      // position:fixed breaks native keyboard scroll-to-input behavior
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      if (progressBar) progressBar.style.display = 'none';
    }

    // Focus window
    windowRef.current?.focus();

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      if (progressBar) progressBar.style.display = '';
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // visualViewport listener: resize chat window when virtual keyboard opens/closes
  // This is the ONLY reliable way to handle real mobile keyboards
  useEffect(() => {
    if (typeof window === 'undefined' || !window.visualViewport) return;
    const isMobileView = window.innerWidth <= 768;
    if (!isMobileView) return;

    const vv = window.visualViewport;
    const el = windowRef.current;
    if (!el) return;

    const onResize = () => {
      // visualViewport.height = actual visible area (excludes keyboard)
      // visualViewport.offsetTop = how far the viewport has shifted down
      const vpHeight = vv!.height;
      const vpOffsetTop = vv!.offsetTop;
      el.style.height = `${vpHeight}px`;
      el.style.top = `${vpOffsetTop}px`;
      el.style.bottom = 'auto';
    };

    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onResize);
    // Run once to set initial size
    onResize();

    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onResize);
      if (el) {
        el.style.height = '';
        el.style.top = '';
        el.style.bottom = '';
      }
    };
  }, []);

  const handleBeforeScrollTo = useCallback(() => {
    if (isMobile) {
      onClose();
    }
  }, [isMobile, onClose]);

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
          <MessageList
            messages={messages}
            status={status}
            onSendFollowup={sendMessage}
            onBeforeScrollTo={handleBeforeScrollTo}
          />
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
