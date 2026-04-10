'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { ChatMessage, ChatStatus } from '@/types/chat';
import { CHAT_CONFIG, CHAT_ERRORS } from '@/lib/chat/constants';

const SESSION_KEY = 'chat_session_state';

function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { messages?: ChatMessage[] };
          if (Array.isArray(parsed.messages) && parsed.messages.length > 0) {
            return parsed.messages;
          }
        }
      } catch {
        // Ignore errors during initialization
      }
    }
    return [];
  });
  const [status, setStatus] = useState<ChatStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Rehydrate from sessionStorage on mount (only messages, never restore in-flight status)
  useEffect(() => {
    // Messages are already initialized from sessionStorage, so this effect can be removed
    // or used for other purposes if needed
  }, []);

  // Persist messages to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ messages }));
    } catch {
      // Ignore quota errors silently
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;
      if (content.length > CHAT_CONFIG.maxInputLength) {
        setError(CHAT_ERRORS.TOO_LONG);
        return;
      }

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
        status: 'sent',
      };

      setMessages((prev) => [...prev, userMsg]);
      setStatus('loading');
      setError(null);

      // Build conversation history for the API (exclude current message)
      const history = [...messages]
        .filter((m) => m.role !== 'system')
        .slice(-CHAT_CONFIG.maxConversationTurns * 2)
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        abortRef.current = new AbortController();

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: content.trim(),
            conversationHistory: history,
          }),
          signal: abortRef.current.signal,
        });

        const data = await res.json();

        if (!data.success) {
          setError(data.error || CHAT_ERRORS.API_ERROR);
          setStatus('error');
          return;
        }

        const assistantMsg: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content: data.message,
          timestamp: Date.now(),
          status: 'sent',
        };

        setMessages((prev) => [...prev, assistantMsg]);
        setStatus('idle');
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          setStatus('idle');
          return;
        }
        setError(CHAT_ERRORS.NETWORK);
        setStatus('error');
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    setStatus('idle');
    setError(null);
    try { sessionStorage.removeItem(SESSION_KEY); } catch { /* ignore */ }
  }, []);

  const cancelRequest = useCallback(() => {
    abortRef.current?.abort();
    setStatus('idle');
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
    setStatus('idle');
  }, []);

  const retryLastMessage = useCallback(async () => {
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      // Remove the last error-inducing user message and retry
      // Actually, we keep it and just re-send the content
      await sendMessage(lastUserMsg.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    status,
    error,
    sendMessage,
    retryLastMessage,
    clearChat,
    cancelRequest,
    dismissError,
  };
}
