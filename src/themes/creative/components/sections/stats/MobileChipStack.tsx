'use client';

import styles from './MobileChipStack.module.css';

/**
 * Static chip stack for mobile Stats section.
 * Matches desktop ChipStacking exactly - same 7 chips, alternating colors,
 * clean vertical stack with no overlaps.
 * 
 * Non-interactive version optimized for mobile.
 */

// Same data as desktop ChipStacking
const CHIPS = [
    'SEO OPTIMIZED',
    'INTERACTIVE 3D',
    'AI ENGINEERING',
    'GLOBAL REMOTE',
    'MODERN WEB APPS',
    'SCALABLE SYSTEMS',
    'INSTANT LOAD SPEED',
];

export function MobileChipStack() {
    return (
        <div className={styles.container}>
            <div className={styles.stack}>
                {CHIPS.map((label, index) => (
                    <div
                        key={label}
                        className={`${styles.chip} ${index % 2 === 0 ? styles.gold : styles.secondary}`}
                        style={{ animationDelay: `${index * 0.08}s` }}
                    >
                        <span className={styles.chipLabel}>{label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
