'use client';

import { CHIP_LABELS } from '@/config/stats';
import styles from './MobileChipStack.module.css';

/**
 * Static chip stack for mobile Stats section.
 * Matches desktop ChipStacking exactly - same chips, alternating colors,
 * clean vertical stack with no overlaps.
 * 
 * Non-interactive version optimized for mobile.
 */

export function MobileChipStack() {
    // Sort chips by length (shortest to longest) to create a pyramid stack
    // Shortest at top, Longest at bottom
    const sortedChips = [...CHIP_LABELS].sort((a, b) => a.length - b.length);

    return (
        <div className={styles.container}>
            <div className={styles.stack}>
                {sortedChips.map((label, index) => (
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
