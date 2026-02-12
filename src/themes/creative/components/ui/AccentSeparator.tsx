'use client';

import { memo } from 'react';
import styles from './AccentSeparator.module.css';

interface AccentSeparatorProps {
    /** Width of separator (default: 25%) */
    width?: string;
    /** Additional CSS class */
    className?: string;
}

/**
 * Shared accent-colored separator component
 * Used across Services, Stats, Projects, Contact, and Hero sections
 * Provides consistent visual separation with centralized theming
 */
export const AccentSeparator = memo(function AccentSeparator({
    width = '25%',
    className,
}: AccentSeparatorProps) {
    return (
        <div
            className={`${styles.separator} ${className || ''}`}
            style={{ width }}
            role="separator"
            aria-hidden="true"
        />
    );
});
