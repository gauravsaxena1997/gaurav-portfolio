'use client';

import React, { useRef } from 'react';
import styles from './MobileStatPanel.module.css';
import { MobileChipStack } from './MobileChipStack';
import { AIBrainIllustration } from './illustrations/AIBrainIllustration';
import { NeuralNetworkVisualization } from './illustrations/NeuralNetworkVisualization';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { STATS_DATA } from '@/config/stats';
import { useMobileCoordinatedReveal } from '@/themes/creative/hooks/useMobileSectionAnimation';



interface MobileStatPanelProps {
    index: number;
}

export const MobileStatPanel = ({ index }: MobileStatPanelProps) => {
    const stat = STATS_DATA[index];
    const Icon = stat?.icon;
    const panelRef = useRef<HTMLDivElement>(null);
    const { titleRef, separatorRef, bodyRef, listRef, illustrationRef } =
        useMobileCoordinatedReveal(panelRef, { start: 'top 90%' });

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
                        <h2 ref={titleRef as React.RefObject<HTMLHeadingElement>} className={styles.statTitle}>{stat?.title}</h2>
                        <div ref={separatorRef as React.RefObject<HTMLDivElement>} className={styles.separatorWrap}>
                            <AccentSeparator width="40%" />
                        </div>
                        <p ref={bodyRef as React.RefObject<HTMLParagraphElement>} className={styles.statDescription}>{stat?.description}</p>
                    </div>
                </div>
                {/* Highlights Zone - for ALL layouts now */}
                {stat?.highlights && (
                    <div ref={listRef as React.RefObject<HTMLDivElement>} className={styles.listZone}>
                        <Highlights items={stat.highlights} mono />
                    </div>
                )}
                {/* Illustration Zone */}
                <div ref={illustrationRef as React.RefObject<HTMLDivElement>} className={styles.illustrationZone}>
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
                            <NeuralNetworkVisualization />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
