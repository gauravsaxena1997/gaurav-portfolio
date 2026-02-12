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
    return (
        <div className={styles.container}>
            <div className={styles.stack}>
                {CHIP_LABELS.map((label, index) => (
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
