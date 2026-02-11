'use client';

import React, { useRef, useCallback } from 'react';
import { MapPin, Mail, Clock, Calendar, Compass } from 'lucide-react';
import styles from '../../layout/MobileLayout.module.css';
import { AccentSeparator } from '@/themes/creative/components/ui';
import { ContactForm } from './ContactForm';
import { CONTACT_INFO } from '@/config';

export const MobileContactSection = () => {
    const formRef = useRef<HTMLFormElement>(null);

    const handleRegisterInteractables = useCallback((refs: React.RefObject<HTMLElement | null>[]) => {
        // No-op for mobile
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
            <p className={styles.contactSubtitle}>
                Have a project in mind? Let&apos;s build something great together.
            </p>

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
        </div>
    );
};
