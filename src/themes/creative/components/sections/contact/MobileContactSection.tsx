import React, { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Calendar, Compass, Github, Linkedin, HelpCircle } from 'lucide-react';
import styles from './MobileContactSection.module.css';
import { AccentSeparator, FAQModal } from '@/themes/creative/components/ui';
import { ContactForm, type ContactFormHandle } from './ContactForm';
import { CONTACT_INFO } from '@/config';

export const MobileContactSection = () => {
    const formRef = useRef<ContactFormHandle>(null);
    const [isFAQOpen, setIsFAQOpen] = useState(false);

    const handleRegisterInteractables = useCallback((refs: React.RefObject<HTMLElement | null>[]) => {
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
            {/* Rotating Compass Background */}
            <div className={styles.contactCompassWrapper}>
                <Compass className={styles.contactCompassIcon} strokeWidth={1} />
            </div>

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
                onClick={() => setIsFAQOpen(true)}
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
