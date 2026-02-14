import { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Compass, Calendar, Github, Linkedin, HelpCircle } from 'lucide-react';
import { CONTACT_INFO } from '@/config';
import { AnalyticsService } from '@/services/AnalyticsService';
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
    <div className={`${styles.container} ${className || ''} w-full min-h-screen flex items-center justify-center p-[calc(var(--header-height)+var(--section-padding-y))_var(--section-padding-x)_var(--section-padding-y)] bg-[var(--creative-bg-primary,_#0a0a0a)] relative overflow-hidden box-border`}>
      <div className={`${styles.content} grid grid-cols-1 gap-[var(--grid-gap-lg)] max-w-[var(--container-lg)] w-full items-center relative z-[1] lg:grid-cols-2 lg:gap-[var(--grid-gap-lg)]`}>
        {/* Left Column: Text Content */}
        <div className={`${styles.textWrapper} flex flex-col justify-center items-start pr-[var(--space-lg)] relative text-left lg:items-start lg:pr-[var(--space-lg)]`}>
          <div className={styles.compassWrapper}>
            <Compass className={styles.compassIcon} strokeWidth={1} />
          </div>

          <h2 className={styles.title}>Get in Touch</h2>
          <AccentSeparator />
          <p className={styles.subtitle}>
            Have a project in mind? Let&apos;s build something great together.
          </p>

          <div className={`${styles.statusGrid} flex flex-col gap-[var(--space-lg)] mt-[var(--space-xl)] md:flex-row md:flex-wrap md:justify-start md:gap-[var(--space-lg)]`}>
            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <div className={`${styles.iconBox} flex items-center justify-center w-11 h-11 rounded-[var(--radius-lg)] bg-[rgba(var(--creative-bg-secondary-rgb),0.5)] border border-[var(--creative-border-color)] text-[var(--creative-accent)]`}>
                <MapPin size={20} />
              </div>
              <div className={`${styles.statusText} flex flex-col gap-2`}>
                <span className={styles.statusLabel}>Location</span>
                <span className={styles.statusValue}>{CONTACT_INFO.location}</span>
              </div>
            </div>

            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <div className={`${styles.iconBox} flex items-center justify-center w-11 h-11 rounded-[var(--radius-lg)] bg-[rgba(var(--creative-bg-secondary-rgb),0.5)] border border-[var(--creative-border-color)] text-[var(--creative-accent)]`}>
                <Mail size={20} />
              </div>
              <div className={`${styles.statusText} flex flex-col gap-2`}>
                <span className={styles.statusLabel}>Email</span>
                <span className={styles.statusValue}>{CONTACT_INFO.email}</span>
              </div>
            </div>

            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <div className={`${styles.iconBox} flex items-center justify-center w-11 h-11 rounded-[var(--radius-lg)] bg-[rgba(var(--creative-bg-secondary-rgb),0.5)] border border-[var(--creative-border-color)] text-[var(--creative-accent)]`}>
                <Clock size={20} />
              </div>
              <div className={`${styles.statusText} flex flex-col gap-2`}>
                <span className={styles.statusLabel}>Availability</span>
                <span className={styles.statusValue}>{CONTACT_INFO.availability}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className={`${styles.scheduleButton} mt-[var(--space-xl)] flex items-center gap-3 px-6 py-3 bg-transparent border border-[var(--creative-accent)] rounded-[var(--radius-md)] text-[var(--creative-accent)] text-sm font-semibold uppercase tracking-[0.08em] w-fit cursor-pointer transition-transform transition-colors duration-200 ease-out hover:bg-[rgba(var(--creative-accent-rgb,184,134,11),0.12)] hover:-translate-y-[2px] hover:shadow-[0_4px_15px_rgba(var(--creative-accent-rgb,184,134,11),0.2)] active:translate-y-0`}
            onClick={() => {
              AnalyticsService.trackCallScheduled();
              window.open(CONTACT_INFO.schedulingUrl, '_blank', 'noopener,noreferrer');
            }}
          >
            <Calendar size={20} />
            <span>Schedule a Call</span>
          </button>
        </div>

        {/* Right Column: Contact Form */}
        <div className={`${styles.formWrapper} flex items-center justify-center w-full lg:justify-end`}>
          <ContactForm
            ref={formRef}
            onRegisterInteractables={handleRegisterInteractables}
          />
        </div>
      </div>

      {/* Floating FAQ Button */}
      <button
        className={`${styles.floatingFAQ} absolute bottom-8 right-8 w-12 h-12 rounded-full bg-[rgba(var(--creative-accent-rgb),0.1)] border border-[var(--creative-accent)] text-[var(--creative-accent)] flex items-center justify-center cursor-pointer z-[20] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-[var(--creative-accent)] hover:text-[var(--creative-bg-primary)] hover:scale-110 hover:shadow-[0_8px_25px_rgba(var(--creative-accent-rgb),0.4)] lg:bottom-6 lg:right-6`}
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
