'use client';

import styles from './UiUxIllustration.module.css';

export function UiUxIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Background gradient */}
            <defs>
                <linearGradient id="uiGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4ECDC4" />
                    <stop offset="100%" stopColor="#44A08D" />
                </linearGradient>
            </defs>

            {/* Main Artboard - Full Width */}
            <g className={styles.artboard}>
                <rect x="15" y="15" width="304" height="186" fill="#ffffff08" rx="4" stroke="#4ECDC4" strokeWidth="2" className={styles.artboardBorder} />

                {/* Header section */}
                <rect x="30" y="30" width="274" height="35" fill="#ffffff06" rx="4" />
                <circle cx="45" cy="47.5" r="10" fill="url(#uiGradient)" />
                <rect x="65" y="42" width="90" height="5" fill="#ffffff40" rx="2.5" />
                <rect x="65" y="52" width="60" height="5" fill="#ffffff30" rx="2.5" />

                {/* Content Grid - 2 columns */}
                <g>
                    <rect x="30" y="80" width="132" height="60" fill="#ffffff08" rx="4" stroke="#4ECDC4" strokeWidth="1" className={styles.contentBox} />
                    <rect x="172" y="80" width="132" height="60" fill="#ffffff08" rx="4" stroke="#4ECDC4" strokeWidth="1" className={styles.contentBox} />
                </g>

                {/* CTA Button */}
                <rect x="30" y="155" width="274" height="32" fill="url(#uiGradient)" rx="16" />
                <text x="167" y="175" className={styles.ctaText} textAnchor="middle">Get Started</text>
            </g>

            {/* Selection handles */}
            <circle cx="30" cy="80" r="3" fill="#4ECDC4" className={styles.handle} />
            <circle cx="162" cy="80" r="3" fill="#4ECDC4" className={styles.handle} />
            <circle cx="172" cy="80" r="3" fill="#4ECDC4" className={styles.handle} />
            <circle cx="304" cy="80" r="3" fill="#4ECDC4" className={styles.handle} />
        </svg>
    );
}
