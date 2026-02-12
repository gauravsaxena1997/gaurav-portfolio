'use client';

import styles from './MvpIllustration.module.css';

export function MvpIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Background gradient */}
            <defs>
                <linearGradient id="mvpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6B6B" />
                    <stop offset="100%" stopColor="#FF8E53" />
                </linearGradient>
            </defs>

            {/* Phase 1: IDEATE */}
            <g className={`${styles.card} ${styles.card1}`}>
                <rect x="15" y="35" width="90" height="145" fill="#ffffff15" rx="6" stroke="#ffffff40" strokeWidth="2" />

                <text x="60" y="60" className={styles.cardTitle} textAnchor="middle">
                    IDEATE
                </text>

                {/* Wireframe sketch */}
                <g className={styles.wireframe}>
                    <line x1="30" y1="85" x2="65" y2="85" stroke="#ffffff60" strokeWidth="2" />
                    <rect x="30" y="95" width="25" height="20" fill="none" stroke="#ffffff60" strokeWidth="2" />
                    <circle cx="75" cy="105" r="10" fill="none" stroke="#ffffff60" strokeWidth="2" />
                </g>

                <text x="60" y="170" className={styles.cardSubtext} textAnchor="middle">
                    Research
                </text>
            </g>

            {/* Phase 2: BUILD */}
            <g className={`${styles.card} ${styles.card2}`}>
                <rect x="122" y="35" width="90" height="145" fill="#ffffff15" rx="6" stroke="#ffffff40" strokeWidth="2" />

                <text x="167" y="60" className={styles.cardTitle} textAnchor="middle">
                    BUILD
                </text>

                {/* Component blocks */}
                <g className={styles.blocks}>
                    <rect x="135" y="85" width="64" height="14" fill="#FF6B6B" rx="3" />
                    <rect x="135" y="104" width="64" height="14" fill="#FF8E53" rx="3" />
                    <rect x="135" y="123" width="64" height="14" fill="#FFA07A" rx="3" />
                </g>

                <text x="167" y="170" className={styles.cardSubtext} textAnchor="middle">
                    Features
                </text>
            </g>

            {/* Phase 3: LAUNCH */}
            <g className={`${styles.card} ${styles.card3}`}>
                <rect x="229" y="35" width="90" height="145" fill="#ffffff15" rx="6" stroke="#ffffff40" strokeWidth="2" />

                <text x="274" y="60" className={styles.cardTitle} textAnchor="middle">
                    LAUNCH
                </text>

                {/* Screen mockup */}
                <rect x="247" y="85" width="54" height="40" fill="#ffffff10" rx="4" stroke="#ffffff60" strokeWidth="2" />

                {/* Checkmark - IN PLACE from start, reveals with animation */}
                <g className={styles.checkmark}>
                    <circle cx="274" cy="145" r="12" fill="#4CAF50" className={styles.checkCircle} />
                    <path d="M 267 145 L 271 149 L 281 139" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" className={styles.checkPath} />
                </g>

                <text x="274" y="170" className={styles.cardSubtext} textAnchor="middle">
                    Validate
                </text>
            </g>
        </svg>
    );
}
