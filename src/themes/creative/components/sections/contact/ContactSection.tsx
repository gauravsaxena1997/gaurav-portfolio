'use client';

import { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Compass, Calendar } from 'lucide-react';
import { CONTACT_INFO } from '@/config';
import { ContactForm } from './ContactForm';
import { AccentSeparator } from '../../ui';
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
          <div className={styles.compassWrapper}>
            <Compass className={styles.compassIcon} strokeWidth={1} />
          </div>

          <h2 className={styles.title}>Get in Touch</h2>
          <AccentSeparator />
          <p className={styles.subtitle}>
            Have a project in mind? Let&apos;s build something great together.
          </p>

          <div className={styles.statusGrid}>
            <div className={styles.statusItem}>
              <div className={styles.iconBox}>
                <MapPin size={20} />
              </div>
              <div className={styles.statusText}>
                <span className={styles.statusLabel}>Location</span>
                <span className={styles.statusValue}>{CONTACT_INFO.location}</span>
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.iconBox}>
                <Mail size={20} />
              </div>
              <div className={styles.statusText}>
                <span className={styles.statusLabel}>Email</span>
                <span className={styles.statusValue}>{CONTACT_INFO.email}</span>
              </div>
            </div>

            <div className={styles.statusItem}>
              <div className={styles.iconBox}>
                <Clock size={20} />
              </div>
              <div className={styles.statusText}>
                <span className={styles.statusLabel}>Availability</span>
                <span className={styles.statusValue}>{CONTACT_INFO.availability}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.scheduleButton}
            onClick={() => window.open(CONTACT_INFO.schedulingUrl, '_blank', 'noopener,noreferrer')}
          >
            <Calendar size={20} />
            <span>Schedule a Call</span>
          </button>
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
