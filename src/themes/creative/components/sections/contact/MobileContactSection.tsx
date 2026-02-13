import React, { useRef, useCallback, useState } from 'react';
import { MapPin, Mail, Clock, Calendar, Compass, Github, Linkedin } from 'lucide-react';
import { AnalyticsService } from '@/services/AnalyticsService';
import styles from './MobileContactSection.module.css';
import { FAQModal, SectionTitle } from '@/themes/creative/components/ui';
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
            {/* Title & Separator */}
            <SectionTitle title="Get in Touch" />

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

            {/* FAQ Text Link */}
            <button
                className={styles.faqLink}
                onClick={() => setIsFAQOpen(true)}
            >
                Frequently Asked Questions
            </button>

            <FAQModal
                isOpen={isFAQOpen}
                onClose={() => setIsFAQOpen(false)}
                onContactClick={handleContactClick}
            />
        </div>
    );
};
