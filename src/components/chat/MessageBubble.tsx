'use client';

import { useMemo, useCallback } from 'react';
import Image from 'next/image';
import type { ChatMessage } from '@/types/chat';
import { parseMessageBlocks } from '@/lib/chat/blockParser';
import { MessageBlocksRenderer } from './blocks/MessageBlocksRenderer';
import { createActionHandler } from './actionHandlers';
import styles from './chat.module.css';

interface MessageBubbleProps {
  message: ChatMessage;
  onSendFollowup?: (prompt: string) => void;
}

export function MessageBubble({ message, onSendFollowup }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  // Parse assistant messages into blocks
  const parsedBlocks = useMemo(() => {
    if (isUser) return null;
    return parseMessageBlocks(message.content);
  }, [message.content, isUser]);

  // Create action handler with followup support
  const handleAction = useCallback(
    createActionHandler(onSendFollowup),
    [onSendFollowup]
  );

  return (
    <div className={`${styles.messageRow} ${isUser ? styles.user : styles.assistant}`}>
      {!isUser && (
        <Image
          src="/profile.jpg"
          alt="Gaurav"
          width={32}
          height={32}
          className={styles.avatar}
        />
      )}
      <div className={`${styles.bubble} ${isUser ? styles.user : styles.assistant}`}>
        {isUser ? (
          <p style={{ margin: 0 }}>{message.content}</p>
        ) : parsedBlocks?.blocks ? (
          <MessageBlocksRenderer blocks={parsedBlocks.blocks} onAction={handleAction} />
        ) : (
          <p style={{ margin: 0 }}>{message.content}</p>
        )}
      </div>
    </div>
  );
}
