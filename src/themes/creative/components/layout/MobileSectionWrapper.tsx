'use client';

import React from 'react';
import { useMobileHeight } from '../../context/MobileHeightContext';

interface MobileSectionWrapperProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    id?: string;
    /**
     * If true, the section will have a minimum height equal to the safe viewport height.
     * Useful for sections that should fill the screen (like Hero).
     */
    fullHeight?: boolean;
    /**
     * If true, applies standard mobile padding.
     * Default: true
     */
    withPadding?: boolean;
}

export const MobileSectionWrapper = ({
    children,
    className = '',
    style = {},
    id,
    fullHeight = false,
    withPadding = true,
}: MobileSectionWrapperProps) => {
    const { safeHeight, headerHeight } = useMobileHeight();

    const baseStyle: React.CSSProperties = {
        position: 'relative',
        width: '100%',
        ...(fullHeight ? { minHeight: safeHeight ? `${safeHeight}px` : 'var(--mobile-safe-height)' } : {}),
        ...(withPadding ? { padding: 'var(--mobile-section-padding)' } : {}),
        ...style,
    };

    return (
        <section
            id={id}
            className={className}
            style={baseStyle}
        >
            {children}
        </section>
    );
};
