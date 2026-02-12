'use client';

import { memo } from 'react';
import styles from './Highlights.module.css';

interface HighlightsProps {
    /** List of highlight items to display */
    items: string[];
    /** Use monospace font variant (for Stats) */
    mono?: boolean;
    /** Additional class name for the list */
    className?: string;
    /** Additional class name for items */
    itemClassName?: string;
}

/**
 * Shared Highlights component for bullet point lists
 * Used across Stats, Projects, and Services sections
 * Provides consistent styling with centralized accent color theming
 */
export const Highlights = memo(function Highlights({
    items,
    mono = false,
    className,
    itemClassName,
}: HighlightsProps) {
    if (!items || items.length === 0) return null;

    return (
        <ul className={`${styles.highlightsList} ${className || ''}`}>
            {items.map((item, index) => (
                <li
                    key={index}
                    className={`${styles.highlightItem} ${mono ? styles.mono : ''} ${itemClassName || ''}`}
                >
                    <span className={styles.checkmark}>✓</span>
                    <span>{item}</span>
                </li>
            ))}
        </ul>
    );
});
