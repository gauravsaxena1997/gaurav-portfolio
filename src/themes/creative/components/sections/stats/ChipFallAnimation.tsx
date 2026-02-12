'use client';

import styles from './ChipFallAnimation.module.css';

/**
 * CSS-only chip fall animation for mobile Stats section.
 * Chips animate falling and stacking with alternating gold/secondary colors.
 */
interface ChipFallAnimationProps {
    items?: string[];
}

export function ChipFallAnimation({ items }: ChipFallAnimationProps) {
    const chipItems = items || [
        'Enterprise Quality',
        'Instant Load Speed',
        'Modern Web Apps',
        'SEO Optimized',
        'Scalable Systems',
    ];

    return (
        <div className={styles.chipContainer}>
            {chipItems.map((item, index) => (
                <div
                    key={index}
                    className={`${styles.chip} ${index % 2 === 0 ? styles.gold : styles.secondary}`}
                    style={{ animationDelay: `${index * 0.12}s` }}
                >
                    <span className={styles.chipLabel}>{item}</span>
                </div>
            ))}
        </div>
    );
}
