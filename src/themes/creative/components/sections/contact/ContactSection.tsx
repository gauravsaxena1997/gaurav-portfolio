import { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Calendar, HelpCircle } from 'lucide-react';
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
    <div className={`${styles.container} ${className || ''} w-full min-h-screen flex items-center justify-center p-[var(--section-padding-y)_var(--section-padding-x)_var(--section-padding-y)] bg-[var(--creative-bg-primary,_#0a0a0a)] relative overflow-hidden box-border`}>
      <div className={`${styles.content} grid grid-cols-1 gap-[var(--grid-gap-lg)] max-w-[var(--container-lg)] w-full items-center relative z-[1] lg:grid-cols-2 lg:gap-[var(--grid-gap-lg)]`}>
        {/* Left Column: Text Content */}
        <div className={`${styles.textWrapper} flex flex-col justify-center items-start pr-[var(--space-lg)] relative text-left lg:items-start lg:pr-[var(--space-lg)]`}>


          <h2 className={styles.title}>Get in Touch</h2>
          <AccentSeparator />
          <p className={styles.subtitle}>
            Have a project in mind? Let&apos;s build something great together.
          </p>

          <div className={`${styles.statusGrid} flex flex-col gap-[var(--space-lg)] mt-[var(--space-xl)] md:flex-row md:flex-wrap md:justify-start md:gap-[var(--space-lg)]`}>
            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <MapPin size={24} className="text-[var(--creative-accent)]" strokeWidth={1.5} />
              <div className={`${styles.statusText} flex flex-col gap-1`}>
                <span className={styles.statusLabel}>Location</span>
                <span className={styles.statusValue}>{CONTACT_INFO.location}</span>
              </div>
            </div>

            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <Mail size={24} className="text-[var(--creative-accent)]" strokeWidth={1.5} />
              <div className={`${styles.statusText} flex flex-col gap-1`}>
                <span className={styles.statusLabel}>Email</span>
                <span className={styles.statusValue}>{CONTACT_INFO.email}</span>
              </div>
            </div>

            <div className={`${styles.statusItem} flex items-center gap-[var(--space-md)]`}>
              <Clock size={24} className="text-[var(--creative-accent)]" strokeWidth={1.5} />
              <div className={`${styles.statusText} flex flex-col gap-1`}>
                <span className={styles.statusLabel}>Availability</span>
                <span className={styles.statusValue}>{CONTACT_INFO.availability}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3" style={{ marginTop: 'var(--space-xl)' }}>
            <button
              type="button"
              className={styles.scheduleButton}
              style={{ marginTop: 0 }}
              onClick={() => {
                AnalyticsService.trackCallScheduled();
                window.open(CONTACT_INFO.schedulingUrl, '_blank', 'noopener,noreferrer');
              }}
            >
              <Calendar size={20} />
              <span>Schedule a Call</span>
            </button>

            <button
              type="button"
              className={`${styles.scheduleButton} ${styles.contraButton}`}
              style={{ marginTop: 0 }}
              onClick={() => {
                AnalyticsService.trackContraClick();
                window.open('https://contra.com/gauravsaxena97', '_blank', 'noopener,noreferrer');
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6Z" />
              </svg>
              <span>Hire Me on Contra</span>
            </button>
          </div>
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
        className={`${styles.floatingFAQ} absolute bottom-[120px] right-6 w-[60px] h-[60px] rounded-full bg-[rgba(var(--creative-accent-rgb),0.1)] border border-[var(--creative-accent)] text-[var(--creative-accent)] flex items-center justify-center cursor-pointer z-[20] transition-all duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_4px_15px_rgba(0,0,0,0.2)] hover:bg-[var(--creative-accent)] hover:text-[var(--creative-bg-primary)] hover:scale-110 hover:shadow-[0_8px_25px_rgba(var(--creative-accent-rgb),0.4)] lg:bottom-[110px] lg:right-6`}
        onClick={() => { setIsFAQOpen(true); AnalyticsService.trackFAQOpen('desktop'); }}
        aria-label="Frequently Asked Questions"
      >
        <HelpCircle size={28} />
      </button>

      <FAQModal
        isOpen={isFAQOpen}
        onClose={() => setIsFAQOpen(false)}
        onContactClick={handleContactClick}
      />
    </div>
  );
}
