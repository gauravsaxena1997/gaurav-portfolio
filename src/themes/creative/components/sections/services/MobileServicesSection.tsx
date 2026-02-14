'use client';

import React from 'react';
import styles from './MobileServicesSection.module.css';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { SERVICES as SERVICES_DATA } from './servicesData';
import { useMobileReveal } from '@/themes/creative/hooks/useMobileReveal';


export const MobileServicesSection = () => {
    const containerRef = useMobileReveal<HTMLDivElement>({ stagger: 0.08, y: 25 });

    return (
        <div ref={containerRef} className={styles.servicesContainer}>
            {/* Top Section: Service Text Layers */}
            <div className={styles.servicesTextArea}>
                {SERVICES_DATA.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={index}
                            className={styles.serviceTextLayer}
                        >
                            {/* Background Parallax Icon */}
                            <BackgroundDecor
                                position={{ top: '5%', right: '5%' }}
                                size="140px"
                                parallaxSpeed={0.15}
                                className={styles.floatingIcon}
                            >
                                <Icon size={140} strokeWidth={1} />
                            </BackgroundDecor>

                            {/* Content */}
                            <h3 className={styles.statTitle}>{service.title}</h3>
                            <AccentSeparator width="40%" className={styles.serviceSeparator} />
                            <p className={styles.statDescription}>{service.fullDescription}</p>

                            {/* Bullets using Highlights */}
                            <Highlights
                                items={service.features}
                                mono
                                className={styles.serviceHighlights}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
