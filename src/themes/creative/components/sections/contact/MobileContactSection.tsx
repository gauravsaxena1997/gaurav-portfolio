import React, { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Calendar, HelpCircle } from 'lucide-react';
import styles from './MobileContactSection.module.css';
import { AccentSeparator, FAQModal } from '@/themes/creative/components/ui';
import { ContactForm, type ContactFormHandle } from './ContactForm';
import { CONTACT_INFO } from '@/config';
import { AnalyticsService } from '@/services/AnalyticsService';

export const MobileContactSection = () => {
    const formRef = useRef<ContactFormHandle>(null);
    const [isFAQOpen, setIsFAQOpen] = useState(false);

    const handleRegisterInteractables = useCallback(() => {
        // No-op for mobile
    }, []);

    const handleContactClick = useCallback(() => {
        setIsFAQOpen(false);
        setTimeout(() => {
            formRef.current?.focusName();
        }, 100);
    }, []);

    return (
        <div className={styles.contactSection}>
            {/* Title */}
            <h2 className={styles.contactTitle}>Get in Touch</h2>
            <AccentSeparator width="40%" />
            {/* Subtitle removed for cleaner mobile look */}

            {/* Status Tags Row */}
            <div className={styles.contactStatusRow}>
                <div className={styles.contactChip}>
                    <MapPin size={12} />
                    <span>{CONTACT_INFO.location}</span>
                </div>
                <div className={styles.contactChip}>
                    <Mail size={12} />
                    <span>{CONTACT_INFO.email}</span>
                </div>
                <div className={styles.contactChip}>
                    <Clock size={12} />
                    <span>{CONTACT_INFO.availability}</span>
                </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactFormArea}>
                <ContactForm
                    ref={formRef}
                    onRegisterInteractables={handleRegisterInteractables}
                />
            </div>

            {/* Hire Me on Contra */}
            <button
                type="button"
                className={`${styles.contactScheduleButton} ${styles.contraButton}`}
                onClick={() => { AnalyticsService.trackContraClick(); window.open('https://contra.com/gauravsaxena97', '_blank', 'noopener,noreferrer'); }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 0L14.4 9.6L24 12L14.4 14.4L12 24L9.6 14.4L0 12L9.6 9.6Z" />
                </svg>
                <span>Hire Me on Contra</span>
            </button>

            {/* Schedule a Call */}
            <button
                type="button"
                className={styles.contactScheduleButton}
                onClick={() => window.open(CONTACT_INFO.schedulingUrl, '_blank', 'noopener,noreferrer')}
            >
                <Calendar size={16} />
                <span>Schedule a Call</span>
            </button>

            {/* Inline FAQ link for mobile */}
            <button
                type="button"
                className={styles.inlineFaqLink}
                onClick={() => { setIsFAQOpen(true); AnalyticsService.trackFAQOpen('mobile'); }}
                aria-label="Frequently Asked Questions"
            >
                <HelpCircle size={18} />
                <span>FAQ</span>
            </button>

            <FAQModal
                isOpen={isFAQOpen}
                onClose={() => setIsFAQOpen(false)}
                onContactClick={handleContactClick}
            />
        </div>
    );
};
