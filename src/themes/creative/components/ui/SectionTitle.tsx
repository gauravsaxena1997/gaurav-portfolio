import React from 'react';
import { AccentSeparator } from './AccentSeparator';
import styles from './SectionTitle.module.css';

interface SectionTitleProps {
    title: string;
    className?: string;
    width?: string | number;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
    title,
    className = '',
    width = '60px'
}) => {
    // Ensure width is a string for AccentSeparator
    const separatorWidth = typeof width === 'number' ? `${width}px` : width;

    return (
        <div className={`${styles.container} ${className}`}>
            <h2 className={styles.title}>{title}</h2>
            <AccentSeparator width={separatorWidth} className={styles.separator} />
        </div>
    );
};
