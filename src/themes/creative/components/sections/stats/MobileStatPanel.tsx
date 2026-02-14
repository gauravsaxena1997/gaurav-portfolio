'use client';

import React from 'react';
import styles from './MobileStatPanel.module.css';
import { MobileChipStack } from './MobileChipStack';
import { AIBrainIllustration } from './illustrations/AIBrainIllustration';
import { GlobeVisualization } from './illustrations/GlobeVisualization';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { STATS_DATA } from '@/config/stats';
import { useMobileReveal } from '@/themes/creative/hooks/useMobileReveal';



interface MobileStatPanelProps {
    index: number;
}

export const MobileStatPanel = ({ index }: MobileStatPanelProps) => {
    const stat = STATS_DATA[index];
    const Icon = stat?.icon;
    const panelRef = useMobileReveal<HTMLDivElement>({ y: 30, delay: index * 0.1 });

    return (
        <div ref={panelRef} className={styles.statPanel}>
            <div className={styles.flexContainer}>
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
                {/* Highlights Zone - for ALL layouts now */}
                {stat?.highlights && (
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
