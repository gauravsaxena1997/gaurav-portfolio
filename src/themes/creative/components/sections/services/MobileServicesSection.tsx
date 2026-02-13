'use client';

import React, { useRef, useLayoutEffect, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import styles from './MobileServicesSection.module.css';
import { AccentSeparator, Highlights, MobileCardHeader } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { SERVICES as SERVICES_DATA } from './servicesData';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Lazy load illustrations
const AiAppIllustration = dynamic(() => import('./illustrations/AiAppIllustration').then(mod => ({ default: mod.AiAppIllustration })), { ssr: false });
const ImmersiveWebIllustration = dynamic(() => import('./illustrations/ImmersiveWebIllustration').then(mod => ({ default: mod.ImmersiveWebIllustration })), { ssr: false });
const DevelopmentIllustration = dynamic(() => import('./illustrations/DevelopmentIllustration').then(mod => ({ default: mod.DevelopmentIllustration })), { ssr: false });
const IntegrationsIllustration = dynamic(() => import('./illustrations/IntegrationsIllustration').then(mod => ({ default: mod.IntegrationsIllustration })), { ssr: false });
const SeoIllustration = dynamic(() => import('./illustrations/SeoIllustration').then(mod => ({ default: mod.SeoIllustration })), { ssr: false });

const ServiceFrame = dynamic(() => import('../../layout/ServiceFrame').then(m => m.ServiceFrame), { ssr: false });

// Helper Component for Illustrations with transition
const IllustrationContainer = ({ activeIndex }: { activeIndex: number }) => {
    const Illustration = useMemo(() => {
        switch (activeIndex) {
            case 0: return AiAppIllustration;
            case 1: return ImmersiveWebIllustration;
            case 2: return DevelopmentIllustration;
            case 3: return IntegrationsIllustration;
            case 4: return SeoIllustration;
            default: return AiAppIllustration;
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
    const [activeIndex, setActiveIndex] = useState(0);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const visibleIndices = useRef(new Set<number>());

    // Determine active card based on scroll position/stacking
    useEffect(() => {
        const observerOptions = {
            root: null,
            // Trigger when card has scrolled up significantly, near the top
            // Using -15% top margin to catch the card as it approaches the 20% fold
            rootMargin: '-15% 0px -84% 0px',
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const index = Number(entry.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    if (entry.isIntersecting) {
                        visibleIndices.current.add(index);
                    } else {
                        visibleIndices.current.delete(index);
                    }
                }
            });

            // Active Index = The highest index currently in the focal area (top of the stack)
            const indices = Array.from(visibleIndices.current);
            if (indices.length > 0) {
                const maxIndex = Math.max(...indices);
                setActiveIndex(maxIndex);
            }
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Observe all cards
        const cardElements = document.querySelectorAll(`.${styles.serviceCard}`);
        cardElements.forEach(el => observer.observe(el));

        const ctx = gsap.context(() => {
            // Laptop Pinning - Sync Entrance & Speed
            // This pins the absolute laptop once it hits the bottom 30% of the screen
            ScrollTrigger.create({
                trigger: `.${styles.laptopWrapper}`,
                start: "top 70%", // Pin when laptop top hits 70vh from viewport top
                endTrigger: containerRef.current,
                end: "bottom bottom", // Unpin when section ends
                pin: true,
                pinSpacing: false
            });
        }, containerRef);

        return () => {
            observer.disconnect();
            ctx.revert();
        };
    }, []);

    return (
        <div ref={containerRef} className={styles.servicesContainer} style={{ zIndex }}>

            {/* 1. Scrollable Stacking Cards (Z-Index 5) */}
            <div className={styles.cardsList}>
                {SERVICES_DATA.map((service, index) => {
                    const Icon = service.icon;
                    return (
                        <div
                            key={index}
                            className={styles.serviceCard}
                            data-index={index}
                            ref={el => { cardsRef.current[index] = el; }}
                            style={{ zIndex: 10 + index }} // Ensure stacking order
                        >
                            <div className={styles.cardContent}>
                                {/* Background Parallax Icon */}
                                <BackgroundDecor
                                    position={{ top: '5%', right: '5%' }}
                                    size="140px"
                                    parallaxSpeed={0.05}
                                    className={styles.floatingIcon}
                                >
                                    <Icon size={140} strokeWidth={1} />
                                </BackgroundDecor>

                                <MobileCardHeader
                                    title={service.title}
                                    className={styles.serviceHeader}
                                />

                                <p className={styles.serviceDescription}>{service.fullDescription}</p>

                                <div className={styles.highlightsWrapper}>
                                    <Highlights
                                        items={service.features}
                                        mono
                                    />
                                </div>
                            </div>
                            {/* Bottom part is transparent via CSS */}
                        </div>
                    );
                })}
            </div>

            {/* 2. Sticky Laptop Area (Z-Index 1) - Replaces content based on activeIndex */}
            <div className={styles.laptopWrapper}>
                <div className={styles.laptopSceneContainer}>
                    <ServiceFrame illustration={<IllustrationContainer activeIndex={activeIndex} />} />
                </div>
            </div>

        </div>
    );
};
