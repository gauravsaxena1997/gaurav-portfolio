'use client';

import { useState, useRef, useCallback, useEffect, type RefObject } from 'react';
import { Send } from 'lucide-react';
import { CHAT_CONFIG } from '@/lib/chat/constants';
import styles from './chat.module.css';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
  textareaRef?: RefObject<HTMLTextAreaElement | null>;
}

export function ChatInput({ onSend, disabled, textareaRef }: ChatInputProps) {
  const [input, setInput] = useState('');
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const ref = (textareaRef ?? fallbackRef) as RefObject<HTMLTextAreaElement>;

  // P0 FIX: Re-focus when loading finishes (disabled flips false→true→false)
  // We cannot focus a disabled element, so we watch disabled and focus when it becomes false
  const prevDisabledRef = useRef(disabled);
  useEffect(() => {
    if (prevDisabledRef.current === true && disabled === false) {
      ref.current?.focus();
    }
    prevDisabledRef.current = disabled;
  }, [disabled, ref]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (ref.current) {
      ref.current.style.height = 'auto';
    }
    // NOTE: do NOT call focus() here — textarea is about to become disabled
    // The useEffect above will re-focus once disabled flips back to false
  }, [input, disabled, onSend, ref]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const isOverLimit = input.length > CHAT_CONFIG.maxInputLength;

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={ref}
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about my work..."
          disabled={disabled}
          rows={1}
          className={styles.textarea}
          aria-label="Type your message"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim() || isOverLimit}
          className={styles.sendBtn}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>
      {input.length > CHAT_CONFIG.maxInputLength * 0.8 && (
        <span className={`text-[11px] text-right block mt-1 ${isOverLimit ? 'text-red-500' : 'text-zinc-400'}`}>
          {input.length}/{CHAT_CONFIG.maxInputLength}
        </span>
      )}
    </div>
  );
}
