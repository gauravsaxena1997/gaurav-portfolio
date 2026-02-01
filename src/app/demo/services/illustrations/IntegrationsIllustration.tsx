'use client';

import styles from './IntegrationsIllustration.module.css';

export function IntegrationsIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            <defs>
                <linearGradient id="intGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F38181" />
                    <stop offset="100%" stopColor="#AA5A9A" />
                </linearGradient>
            </defs>

            {/* STRIPE BOX - Top Left */}
            <g className={styles.apiCard}>
                <rect x="20" y="15" width="90" height="50" fill="#ffffff12" rx="6" stroke="url(#intGradient)" strokeWidth="2" />
                <text x="65" y="38" className={styles.apiTitle} textAnchor="middle">Stripe</text>
                <text x="65" y="52" className={styles.apiSubtext} textAnchor="middle">Payments</text>
            </g>

            {/* AUTH0 BOX - Top Right */}
            <g className={styles.apiCard}>
                <rect x="224" y="15" width="90" height="50" fill="#ffffff12" rx="6" stroke="url(#intGradient)" strokeWidth="2" />
                <text x="269" y="38" className={styles.apiTitle} textAnchor="middle">Auth0</text>
                <text x="269" y="52" className={styles.apiSubtext} textAnchor="middle">Security</text>
            </g>

            {/* MAPS BOX - Bottom Center - MOVED DOWN for visible line */}
            <g className={styles.apiCard}>
                <rect x="122" y="165" width="90" height="50" fill="#ffffff12" rx="6" stroke="url(#intGradient)" strokeWidth="2" />
                <text x="167" y="188" className={styles.apiTitle} textAnchor="middle">Maps API</text>
                <text x="167" y="202" className={styles.apiSubtext} textAnchor="middle">Location</text>
            </g>

            {/* CENTER HUB */}
            <g className={styles.centerHub}>
                <circle cx="167" cy="100" r="20" fill="url(#intGradient)" />
                <rect x="159" y="92" width="7" height="7" fill="#fff" rx="1" />
                <rect x="168" y="92" width="7" height="7" fill="#fff" rx="1" />
                <rect x="159" y="101" width="7" height="7" fill="#fff" rx="1" />
                <rect x="168" y="101" width="7" height="7" fill="#fff" rx="1" />
            </g>

            {/* LINES DRAWN LAST - ON TOP OF EVERYTHING */}
            <g className={styles.connections}>
                {/* To Stripe */}
                <line x1="152" y1="86" x2="110" y2="65" stroke="url(#intGradient)" strokeWidth="2" strokeDasharray="4 4" />

                {/* To Auth0 */}
                <line x1="182" y1="86" x2="224" y2="65" stroke="url(#intGradient)" strokeWidth="2" strokeDasharray="4 4" />

                {/* To Maps - 45px gap now (hub bottom at 120, Maps top at 165) */}
                <line x1="167" y1="120" x2="167" y2="165" stroke="url(#intGradient)" strokeWidth="2" strokeDasharray="4 4" />
            </g>

            {/* PARTICLES - ON TOP */}
            <g className={styles.particles}>
                <circle r="4" fill="#F38181" className={styles.particle1} />
                <circle r="4" fill="#AA5A9A" className={styles.particle2} />
                <circle r="4" fill="#F38181" className={styles.particle3} />
            </g>
        </svg>
    );
}
