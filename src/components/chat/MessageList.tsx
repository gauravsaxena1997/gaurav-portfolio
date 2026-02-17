'use client';

import { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import type { ChatMessage, ChatStatus } from '@/types/chat';
import styles from './chat.module.css';

interface MessageListProps {
  messages: ChatMessage[];
  status: ChatStatus;
  onSendFollowup?: (prompt: string) => void;
}

export function MessageList({ messages, status, onSendFollowup }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  return (
    <div
      data-chat-scroll
      className={styles.messageList}
      role="log"
      aria-live="polite"
      onTouchMove={(e) => e.stopPropagation()}
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} onSendFollowup={onSendFollowup} />
      ))}
      {status === 'loading' && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
