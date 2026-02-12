import { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Compass, Calendar, Github, Linkedin, HelpCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/config';
import { ContactForm, type ContactFormHandle } from './ContactForm';
import { AccentSeparator, FAQModal } from '../../ui';
import styles from './ContactSection.module.css';

interface ContactSectionProps {
  className?: string;
}

/**
 * Contact Section Layout
 * 
 * Updated:
 * - Footer bar for Social Links + FAQ Modal Trigger
 * - Removed inline FAQ to preserve layout
 */
export function ContactSection({ className }: ContactSectionProps) {
  const formRef = useRef<ContactFormHandle>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [interactionRefs, setInteractionRefs] = useState<React.RefObject<HTMLElement | null>[]>([]);
  const [isFAQOpen, setIsFAQOpen] = useState(false);

  const handleRegisterInteractables = useCallback((refs: React.RefObject<HTMLElement | null>[]) => {
    setInteractionRefs(refs);
  }, []);

  const handleContactClick = useCallback(() => {
    setIsFAQOpen(false);
    // Use a small timeout to ensure the modal's body.overflow: hidden is restored
    // and layout shifts are settled.
    setTimeout(() => {
      formRef.current?.focusName();
    }, 100);
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

      {/* Floating FAQ Button */}
      <button
        className={styles.floatingFAQ}
        onClick={() => setIsFAQOpen(true)}
        aria-label="Frequently Asked Questions"
      >
        <HelpCircle size={24} />
      </button>

      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        onContactClick={handleContactClick}
      />
    </div>
  );
}
