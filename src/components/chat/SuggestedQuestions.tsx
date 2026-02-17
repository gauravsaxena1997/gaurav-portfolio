'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { SUGGESTED_QUESTIONS } from '@/lib/chat/constants';
import styles from './chat.module.css';

const WELCOME_TEXT = "Hey! I'm Gaurav's assistant. Ask me anything about his work, skills, services, or projects.";

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [showButtons, setShowButtons] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < WELCOME_TEXT.length) {
        setDisplayedText(WELCOME_TEXT.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setShowButtons(true);
      }
    }, 18);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.suggestedContainer}>
      {/* Welcome message bubble */}
      <div className={styles.welcomeRow}>
        <Image
          src="/profile.jpg"
          alt="Gaurav"
          width={32}
          height={32}
          className={styles.avatar}
        />
        <div className={styles.welcomeBubble}>
          <p style={{ margin: 0 }}>
            {displayedText}
            {isTyping && <span style={{ animation: 'pulse 1s ease-in-out infinite' }}>|</span>}
          </p>
        </div>
      </div>

      {/* Suggested questions */}
      {showButtons && (
        <div className={styles.suggestedList}>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => onSelect(q)}
              className={styles.suggestedBtn}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
