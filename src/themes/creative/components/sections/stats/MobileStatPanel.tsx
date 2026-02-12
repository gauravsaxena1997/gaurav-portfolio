'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MobileStatPanel.module.css';
import { MobileChipStack } from './MobileChipStack';
import { AIBrainIllustration } from './illustrations/AIBrainIllustration';
import { GlobeVisualization } from './illustrations/GlobeVisualization';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { STATS_DATA } from '@/config/stats';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const StackingBlurOverlay = () => (
    <div className={styles.stackingBlurOverlay} />
);

interface MobileStatPanelProps {
    index: number;
}

export const MobileStatPanel = ({ index }: MobileStatPanelProps) => {
    const is5050 = index === 0;
    const layoutClass = is5050 ? styles.grid4555 : styles.grid502030;
    const zIndex = 20 + index;
    const stat = STATS_DATA[index];
    const Icon = stat?.icon;
    const panelRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = panelRef.current;
            if (!el) return;

            const overlay = el.querySelector(`.${styles.stackingBlurOverlay}`);

            if (overlay) {
                gsap.set(overlay, { opacity: 0 });

                gsap.to(overlay, {
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top top+=1",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, panelRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={panelRef} className={styles.statPanel} style={{ zIndex }}>
            <StackingBlurOverlay />
            <div className={layoutClass}>
                {/* Text Zone with BackgroundDecor */}
                <div className={styles.textZone}>
                    {/* Background Parallax Icon */}
                    {Icon && (
                        <BackgroundDecor
                            position={{ top: '45%', right: '5%' }}
                            size="200px"
                            parallaxSpeed={0.15}
                            className={styles.backgroundIcon}
                        >
                            <Icon size={200} strokeWidth={1} />
                        </BackgroundDecor>
                    )}
                    <div className={styles.statTextContent}>
                        <h2 className={styles.statTitle}>{stat?.title}</h2>
                        <AccentSeparator width="40%" />
                        <p className={styles.statDescription}>{stat?.description}</p>
                    </div>
                </div>
                {/* Highlights Zone - only for non-5050 layouts */}
                {!is5050 && stat?.highlights && (
                    <div className={styles.listZone}>
                        <Highlights items={stat.highlights} mono />
                    </div>
                )}
                {/* Illustration Zone */}
                <div className={styles.illustrationZone}>
                    {index === 0 && (
                        <div className={styles.illustrationWrapper50}>
                            <MobileChipStack />
                        </div>
                    )}
                    {index === 1 && (
                        <div className={styles.illustrationWrapper40}>
                            <AIBrainIllustration />
                        </div>
                    )}
                    {index === 2 && (
                        <div className={styles.illustrationWrapper40}>
                            <div className={styles.globeClip}>
                                <GlobeVisualization />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
