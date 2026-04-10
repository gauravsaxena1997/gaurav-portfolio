'use client';

import { useRef, useEffect, useCallback } from 'react';
import { type LucideIcon, Info } from 'lucide-react';
import styles from './StatPanel.module.css';
import { ReactNode } from 'react';
import { BackgroundDecor } from '../../common/BackgroundDecor';
import { Highlights, AccentSeparator } from '../../ui';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useGestures } from '@/themes/creative/context/GestureContext';

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
    illustrationInfo?: string;
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
    illustrationInfo,
}: StatPanelProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const litLayerRef = useRef<HTMLDivElement>(null);
    const { isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture } = useGestures();
    const isPalmHoveringRef = useRef(false);
    const gestureRevealProgressRef = useRef(0);
    const scrollProgressRef = useRef(0);
    const rafIdRef = useRef<number | null>(null);

    // Palm gesture hover effect - uses refs and rAF to avoid setState in useEffect
    const updatePalmGestureEffect = useCallback(() => {
        const litLayer = litLayerRef.current;
        const container = containerRef.current;
        if (!litLayer || !container) return;

        // Check if gestures are active and palm gesture is detected
        if (!isGesturesEnabled || !isTrackingActive || !handCoordinates || lastGesture !== 'Palm') {
            isPalmHoveringRef.current = false;
            // Revert to scroll-based progress when not hovering
            const revealPercent = (1 - scrollProgressRef.current) * 100;
            litLayer.style.clipPath = `inset(0 ${revealPercent}% 0 0)`;
            (litLayer.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `inset(0 ${revealPercent}% 0 0)`;
            return;
        }

        const rect = container.getBoundingClientRect();
        
        // Convert hand coordinates to viewport coordinates
        const handViewportX = handCoordinates.x * window.innerWidth;
        const handViewportY = handCoordinates.y * window.innerHeight;
        
        // Check if hand is within the panel bounds
        const isHovering = 
            handViewportX >= rect.left &&
            handViewportX <= rect.right &&
            handViewportY >= rect.top &&
            handViewportY <= rect.bottom;
        
        isPalmHoveringRef.current = isHovering;
        
        if (isHovering) {
            // Calculate reveal progress based on hand position within panel (0 to 1)
            const progressX = (handViewportX - rect.left) / rect.width;
            gestureRevealProgressRef.current = 1 - progressX;
            
            // Apply gesture-based reveal directly
            const revealPercent = (1 - gestureRevealProgressRef.current) * 100;
            litLayer.style.clipPath = `inset(0 ${revealPercent}% 0 0)`;
            (litLayer.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `inset(0 ${revealPercent}% 0 0)`;
        } else {
            // Not hovering - use scroll-based progress
            const revealPercent = (1 - scrollProgressRef.current) * 100;
            litLayer.style.clipPath = `inset(0 ${revealPercent}% 0 0)`;
            (litLayer.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `inset(0 ${revealPercent}% 0 0)`;
        }
    }, [isGesturesEnabled, isTrackingActive, handCoordinates, lastGesture]);

    // Schedule updates using requestAnimationFrame
    useEffect(() => {
        const scheduleUpdate = () => {
            updatePalmGestureEffect();
            rafIdRef.current = requestAnimationFrame(scheduleUpdate);
        };
        
        rafIdRef.current = requestAnimationFrame(scheduleUpdate);
        
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, [updatePalmGestureEffect]);

    useGSAP(() => {
        const litLayer = litLayerRef.current;
        if (!litLayer) return;

        // UNIFIED ANIMATION: Left-to-Right Wipe
        const startClip = 'inset(0 100% 0 0)';

        gsap.set(litLayer, {
            clipPath: startClip,
            webkitClipPath: startClip,
            opacity: 1,
        });

        // Scroll-based animation - updates ref instead of setState
        const scrollTriggerInstance = ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top bottom',
            end: 'bottom 90%',
            scrub: true,
            onUpdate: (self) => {
                scrollProgressRef.current = self.progress;
                // Only apply scroll animation if not being controlled by palm gesture
                if (!isPalmHoveringRef.current) {
                    const revealPercent = (1 - self.progress) * 100;
                    litLayer.style.clipPath = `inset(0 ${revealPercent}% 0 0)`;
                    (litLayer.style as CSSStyleDeclaration & { webkitClipPath: string }).webkitClipPath = `inset(0 ${revealPercent}% 0 0)`;
                }
            }
        });

        return () => {
            scrollTriggerInstance.kill();
        };
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
                                        {illustrationInfo && (
                                            <div className={styles.infoBadge}>
                                                <div className={styles.infoIconWrapper}>
                                                    <Info size={24} strokeWidth={2.5} />
                                                </div>
                                                <div className={styles.infoTextWrapper}>
                                                    <span className={styles.infoText}>{illustrationInfo}</span>
                                                </div>
                                            </div>
                                        )}
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
                                {illustrationInfo && (
                                    <div className={styles.infoBadge}>
                                        <div className={styles.infoIconWrapper}>
                                            <Info size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className={styles.infoTextWrapper}>
                                            <span className={styles.infoText}>{illustrationInfo}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

