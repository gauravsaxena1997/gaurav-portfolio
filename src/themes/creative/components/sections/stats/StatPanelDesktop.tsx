'use client';

import { useRef } from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './StatPanel.module.css';
import { ReactNode } from 'react';
import { BackgroundDecor } from '../../common/BackgroundDecor';
import { Highlights, AccentSeparator } from '../../ui';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

interface StatPanelProps {
    /** Panel title */
    title: string;
    /** Personal description paragraph (first person, 2 sentences) */
    description: string;
    /** Highlight/result items with checkmarks */
    highlights?: string[];
    illustration?: ReactNode;
    icon?: LucideIcon;

    // Layout Config
    desktopLayout?: 'text-left' | 'text-right'; // Default 'text-left'
    illustAlign?: 'center' | 'bottom'; // Default 'center'
    highlightsLocation?: 'text' | 'illustration'; // Default 'text'
}

/**
 * Desktop-Specific Stat Panel component
 * Implements alternating Zig-Zag layout with Gold Wipe animation.
 * 
 * Icons are now displayed as large, low-opacity background decorations
 * with parallax scrolling effect instead of inline icons.
 */
export function StatPanelDesktop({
    title,
    description,
    highlights,
    illustration,
    icon: Icon,
    desktopLayout = 'text-left',
    illustAlign = 'center',
    highlightsLocation = 'text',
}: StatPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const litLayerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const litLayer = litLayerRef.current;
        if (!litLayer) return;

        // UNIFIED ANIMATION: Left-to-Right Wipe
        const startClip = 'inset(0 100% 0 0)';
        const endClip = 'inset(0 0% 0 0)';

        gsap.set(litLayer, {
            clipPath: startClip,
            webkitClipPath: startClip,
            opacity: 1,
        });

        gsap.to(litLayer, {
            clipPath: endClip,
            webkitClipPath: endClip,
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top bottom',
                end: 'bottom 90%',
                scrub: true,
            }
        });
    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className={`${styles.statPanel} ${desktopLayout === 'text-right' ? styles.layoutRight : styles.layoutLeft}`}
            data-stat-panel
            data-desktop-layout={desktopLayout}
        >
            <div className={styles.statContent}>
                {/* TEXT BLOCK */}
                <div className={styles.textBlock} style={{ order: desktopLayout === 'text-left' ? 1 : 2 }}>

                    {/* Background Decorative Icon - Base Layer (Gold) */}
                    {Icon && (
                        <BackgroundDecor
                            position={{ bottom: '10%', right: '5%' }}
                            size="280px"
                            parallaxSpeed={0.15}
                            className={styles.backgroundIcon}
                        >
                            <Icon size={280} strokeWidth={1} />
                        </BackgroundDecor>
                    )}

                    {/* Base Layer (Grey) */}
                    <div className={styles.textContent}>
                        <div className={styles.statHeader}>
                            <h2 className={styles.title}>{title}</h2>
                        </div>
                        <AccentSeparator />
                        <p className={styles.description}>{description}</p>
                        {highlights && highlightsLocation === 'text' && (
                            <Highlights items={highlights} mono />
                        )}
                    </div>

                    {/* Lit Layer (Gold BG + Dark Text) - Revealed by inset clip-path */}
                    <div className={styles.litLayer} ref={litLayerRef} data-lit-layer>
                        {Icon && (
                            <BackgroundDecor
                                position={{ bottom: '10%', right: '5%' }}
                                size="280px"
                                parallaxSpeed={0.15}
                                variant="inverted"
                                className={styles.backgroundIconLit}
                            >
                                <Icon size={280} strokeWidth={1} />
                            </BackgroundDecor>
                        )}
                        {/* Exact copy of textContent children for perfect alignment */}
                        <div className={styles.textContent}>
                            <div className={styles.statHeader}>
                                <h2 className={styles.title}>{title}</h2>
                            </div>
                            <AccentSeparator />
                            <p className={styles.description}>{description}</p>
                            {highlights && highlightsLocation === 'text' && (
                                <Highlights items={highlights} mono />
                            )}
                        </div>
                    </div>
                </div>

                {/* ILLUSTRATION BLOCK */}
                <div
                    className={`${styles.illustrationContainer} ${styles[illustAlign === 'bottom' ? 'alignBottom' : 'alignCenter']}`}
                    style={{ order: desktopLayout === 'text-left' ? 2 : 1 }}
                >
                    {highlights && highlightsLocation === 'illustration' ? (
                        // V4.4: SPLIT LAYOUT (65% Illustration / 35% Highlights)
                        <div className={styles.illustrationSplitContainer}>
                            <div className={styles.illustrationSplitTop}>
                                <div className={styles.tiltWrapper}>
                                    <div className={styles.illustration}>
                                        {illustration || <div className="p-4 border border-dashed border-gray-600 rounded">Illustration Placeholder</div>}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.illustrationSplitBottom}>
                                <div className={styles.relocatedHighlights}>
                                    {highlights.map((point, i) => (
                                        <div key={i} className={styles.highlightItem} data-highlight-item>
                                            <span className={styles.pointCheck}>✓</span>
                                            {point}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        // STANDARD LAYOUT (Full Height Illustration)
                        <div className={styles.tiltWrapper}>
                            <div className={styles.illustration}>
                                {illustration || <div className="p-4 border border-dashed border-gray-600 rounded">Illustration Placeholder</div>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

