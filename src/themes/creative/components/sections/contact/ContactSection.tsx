'use client';

import { useRef, useCallback, useState } from 'react';
import { ContactForm } from './ContactForm';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  className?: string;
}

/**
 * Contact Section Layout
 * 
 * New Design:
 * - Left Column: Title & Subtitle (Text)
 * - Right Column: Form Inputs (Glass Card)
 * - Height: 100vh
 */
export function ContactSection({ className }: ContactSectionProps) {
  const formRef = useRef<HTMLFormElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [interactionRefs, setInteractionRefs] = useState<React.RefObject<HTMLElement | null>[]>([]);

  const handleRegisterInteractables = useCallback((refs: React.RefObject<HTMLElement | null>[]) => {
    setInteractionRefs(refs);
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.content}>
        {/* Left Column: Text Content */}
        <div className={styles.textWrapper}>
          <h2 className={styles.title}>Get in Touch</h2>
          <p className={styles.subtitle}>
            Have a project in mind? Let&apos;s build something great together.
          </p>
        </div>

        {/* Right Column: Contact Form */}
        <div className={styles.formWrapper}>
          <ContactForm
            ref={formRef}
            onRegisterInteractables={handleRegisterInteractables}
          />
        </div>
      </div>
    </div>
  );
}
