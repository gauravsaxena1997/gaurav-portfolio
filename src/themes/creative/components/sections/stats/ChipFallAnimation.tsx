'use client';

import styles from './ChipFallAnimation.module.css';

/**
 * CSS-only chip fall animation for mobile Stats section.
 * Chips animate falling and stacking.
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
        'Interactive 3D',
        'Global Remote'
    ];

    return (
        <div className={styles.chipContainer}>
            {chipItems.map((item, index) => (
                <div
                    key={index}
                    className={styles.chip}
                    style={{ animationDelay: `${index * 0.15}s` }}
                >
                    <span className={styles.chipLabel}>{item}</span>
                </div>
            ))}
            {/* Stack base */}
            <div className={styles.stackBase} />
        </div>
    );
}
