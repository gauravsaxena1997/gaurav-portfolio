'use client';

import { useRef } from 'react';
import { InteractiveCharacter } from './InteractiveCharacter';
import { ContactForm } from './ContactForm';
import { useCharacterTracking } from './hooks/useCharacterTracking';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  className?: string;
}

/**
 * Contact Section with Interactive Character and Form
 *
 * Layout:
 * - Left: Animated character with eye tracking and expressions
 * - Right: Contact form with name, email, message + schedule call button
 *
 * The character's expression changes based on cursor proximity to the form:
 * - Closer to form = happier expression (encouraging engagement)
 * - Further away = neutral/expectant expression
 */
export function ContactSection({ className }: ContactSectionProps) {
  const characterContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Track mouse position and calculate character animation state
  const characterState = useCharacterTracking({
    characterRef: characterContainerRef,
    formRef: formRef,
    enabled: true,
    smoothing: 0.1,
  });

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.content}>
        {/* Character Illustration */}
        <div ref={characterContainerRef} className={styles.characterWrapper}>
          <InteractiveCharacter characterState={characterState} />
        </div>

        {/* Contact Form */}
        <div className={styles.formWrapper}>
          <ContactForm ref={formRef} />
        </div>
      </div>
    </div>
  );
}
