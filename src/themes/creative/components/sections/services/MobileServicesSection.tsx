'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import styles from './MobileServicesSection.module.css';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { SERVICES as SERVICES_DATA } from './servicesData';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Lazy load illustrations
const MvpIllustration = dynamic(() => import('./illustrations/MvpIllustration').then(mod => ({ default: mod.MvpIllustration })), { ssr: false });
const UiUxIllustration = dynamic(() => import('./illustrations/UiUxIllustration').then(mod => ({ default: mod.UiUxIllustration })), { ssr: false });
const DevelopmentIllustration = dynamic(() => import('./illustrations/DevelopmentIllustration').then(mod => ({ default: mod.DevelopmentIllustration })), { ssr: false });
const IntegrationsIllustration = dynamic(() => import('./illustrations/IntegrationsIllustration').then(mod => ({ default: mod.IntegrationsIllustration })), { ssr: false });
const SeoIllustration = dynamic(() => import('./illustrations/SeoIllustration').then(mod => ({ default: mod.SeoIllustration })), { ssr: false });

const ServiceFrame = dynamic(() => import('../../layout/ServiceFrame').then(m => m.ServiceFrame), { ssr: false });

// Helper Component for Illustrations with transition
const IllustrationContainer = ({ activeIndex }: { activeIndex: number }) => {
    const Illustration = React.useMemo(() => {
        switch (activeIndex) {
            case 0: return MvpIllustration;
            case 1: return UiUxIllustration;
            case 2: return DevelopmentIllustration;
            case 3: return IntegrationsIllustration;
            case 4: return SeoIllustration;
            default: return MvpIllustration;
        }
    }, [activeIndex]);

    return (
        <div className={styles.illustrationFadeWrapper} key={activeIndex}>
            <Illustration />
        </div>
    );
};

interface MobileServicesSectionProps {
    zIndex: number;
}

export const MobileServicesSection = ({ zIndex }: MobileServicesSectionProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = React.useState(0);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            if (!container) return;

            ScrollTrigger.create({
                trigger: container,
                start: 'top top',
                end: '+=400%',
                pin: true,
                anticipatePin: 1,
                scrub: true,
                onUpdate: (self) => {
                    const progress = self.progress;
                    const newIndex = Math.min(4, Math.floor(progress * 5));
                    setActiveIndex(newIndex);
                }
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={styles.servicesContainer} style={{ zIndex }}>
            {/* Top Section: Service Text Layers */}
            <div className={styles.servicesTextArea}>
                {SERVICES_DATA.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={index}
                            className={`${styles.serviceTextLayer} ${index === activeIndex ? styles.activeService : ''}`}
                        >
                            {/* Background Parallax Icon */}
                            <BackgroundDecor
                                position={{ top: '5%', right: '5%' }}
                                size="140px"
                                parallaxSpeed={0}
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

            {/* Bottom Section: Tablet frame with persistent mount */}
            <div className={styles.servicesLaptopArea}>
                <ServiceFrame illustration={<IllustrationContainer activeIndex={activeIndex} />} />
            </div>
        </div>
    );
};
