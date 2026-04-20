'use client';

import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MobileServicesSection.module.css';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { SERVICES as SERVICES_DATA } from './servicesData';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const STACK_PEEK = 32;

function ServiceCardContent({ service }: { service: typeof SERVICES_DATA[0] }) {
    const Icon = service.icon;
    return (
        <div className={styles.stackCardInner}>
            <BackgroundDecor
                position={{ top: '5%', right: '5%' }}
                size="120px"
                parallaxSpeed={0.15}
                className={styles.floatingIcon}
            >
                <Icon size={120} strokeWidth={1} />
            </BackgroundDecor>

            <h3 className={styles.statTitle}>{service.title}</h3>
            <p className={styles.statDescription}>{service.fullDescription}</p>

            <Highlights
                items={service.features}
                mono
                className={styles.serviceHighlights}
            />
        </div>
    );
}

export const MobileServicesSection = () => {
    const outerRef = useRef<HTMLDivElement>(null);
    const pinRef = useRef<HTMLDivElement>(null);
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        setPrefersReducedMotion(
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        );
    }, []);

    useLayoutEffect(() => {
        if (!outerRef.current || !pinRef.current) return;
        if (typeof window === 'undefined' || window.innerWidth > 900) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const cards = cardRefs.current.filter((c): c is HTMLDivElement => !!c);
        if (cards.length < 2) return;

        const ctx = gsap.context(() => {
            const offscreenY = () => window.innerHeight;

            cards.forEach((card, idx) => {
                if (idx === 0) {
                    gsap.set(card, { y: 0, yPercent: 0, zIndex: 10 + idx });
                } else {
                    gsap.set(card, { y: offscreenY(), yPercent: 0, zIndex: 10 + idx });
                }
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: outerRef.current,
                    start: 'top top',
                    end: `+=${(cards.length - 1) * 80}%`,
                    pin: pinRef.current,
                    scrub: 0.4,
                    invalidateOnRefresh: true,
                },
            });

            for (let i = 1; i < cards.length; i++) {
                tl.fromTo(
                    cards[i],
                    { y: offscreenY(), yPercent: 0 },
                    { y: i * STACK_PEEK, yPercent: 0, duration: 1, ease: 'power3.out' },
                    i - 1
                );
            }
        }, outerRef);

        return () => ctx.revert();
    }, []);

    if (prefersReducedMotion) {
        return (
            <div className={styles.servicesContainer}>
                <div className={styles.sectionLabelInline}>What I Offer</div>
                <div className={styles.servicesTextArea}>
                    {SERVICES_DATA.map((service) => (
                        <div key={service.id} className={styles.serviceTextLayer}>
                            <ServiceCardContent service={service} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div ref={outerRef} className={styles.stackOuter}>
            <div ref={pinRef} className={styles.stackPin}>
                <div className={styles.stackHeader}>
                    <span>What I Offer</span>
                    <AccentSeparator width="60px" />
                </div>
                <div className={styles.stackViewport}>
                    {SERVICES_DATA.map((service, idx) => (
                        <div
                            key={service.id}
                            ref={(el) => { cardRefs.current[idx] = el; }}
                            className={styles.stackCard}
                        >
                            <ServiceCardContent service={service} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
