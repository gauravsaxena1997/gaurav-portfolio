import React from 'react';
import { AccentSeparator } from './AccentSeparator';

interface MobileCardHeaderProps {
    title: string;
    className?: string;
    separatorWidth?: string;
}

/**
 * MobileCardHeader - Standardized header for card-based components (Stats, Services, Projects)
 * 
 * Uses h3 with global 'mobile-card-header' styles for consistent scaling
 * and includes the standard AccentSeparator.
 */
export const MobileCardHeader: React.FC<MobileCardHeaderProps> = ({
    title,
    className = '',
    separatorWidth = '40%'
}) => {
    return (
        <div className={`flex flex-col gap-[var(--space-xs)] items-start text-left w-full ${className}`}>
            <h3 className="mobile-card-header !text-left !w-full mb-1">
                {title}
            </h3>
            <AccentSeparator width={separatorWidth} />
        </div>
    );
};
