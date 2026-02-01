'use client';

import { useRef } from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './StatPanel.module.css';
import { ReactNode } from 'react';

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

                    {/* Base Layer (Grey) */}
                    <div className={styles.textContent}>
                        <div className={styles.statHeader}>
                            {Icon && <Icon className={styles.statIcon} />}
                            <div className={styles.dividerLine} />
                            <h3 className={styles.title}>{title}</h3>
                        </div>
                        <div className={styles.sectionSeparator} />
                        <p className={styles.description}>{description}</p>
                        {highlights && highlightsLocation === 'text' && (
                            <ul className={styles.pointsList}>
                                {highlights.map((point, i) => (
                                    <li key={i} className={styles.point}>
                                        <span className={styles.pointCheck}>✓</span>
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Lit Layer (Gold BG + Dark Text) - Revealed by inset clip-path */}
                    <div className={styles.litLayer} data-lit-layer>
                        {/* Exact copy of textContent children for perfect alignment */}
                        <div className={styles.textContent}>
                            <div className={styles.statHeader}>
                                {Icon && <Icon className={styles.statIcon} />}
                                <div className={styles.dividerLine} />
                                <h3 className={styles.title}>{title}</h3>
                            </div>
                            <div className={styles.sectionSeparator} />
                            <p className={styles.description}>{description}</p>
                            {highlights && highlightsLocation === 'text' && (
                                <ul className={styles.pointsList}>
                                    {highlights.map((point, i) => (
                                        <li key={i} className={styles.point}>
                                            <span className={styles.pointCheck}>✓</span>
                                            {point}
                                        </li>
                                    ))}
                                </ul>
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
