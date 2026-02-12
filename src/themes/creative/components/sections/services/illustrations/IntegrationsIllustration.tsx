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
            {/* Background Gradient */}
            <defs>
                <linearGradient id="infraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#24243e" />
                    <stop offset="100%" stopColor="#302b63" />
                </linearGradient>
            </defs>
            <rect width="334" height="216" fill="url(#infraGradient)" />

            {/* Central App Icon - Smaller & Pulsing */}
            <g transform="translate(167, 108)">
                {/* Pulse Ring */}
                <circle r="30" fill="#ffffff10">
                    <animate attributeName="r" values="22;35;22" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.2;0.5;0.2" dur="2s" repeatCount="indefinite" />
                </circle>

                {/* Main Icon Background */}
                <rect x="-15" y="-15" width="30" height="30" rx="8" fill="white" />

                {/* Simple Check Mark Icon */}
                <path d="M -8 2 L -2 8 L 8 -6" stroke="#302b63" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Connecting Lines - Improved Visibility */}
            {/* Top Right (Auth) to Center */}
            {/* Moved start point further right/up to match new card pos */}
            <path d="M 230 68 L 180 96" stroke="#ffffff80" strokeWidth="2" strokeDasharray="4,4" />

            {/* Top Left (Stripe) to Center */}
            <path d="M 104 68 L 154 96" stroke="#ffffff80" strokeWidth="2" strokeDasharray="4,4" />

            {/* Bottom (Maps) to Center */}
            <path d="M 167 150 L 167 125" stroke="#ffffff80" strokeWidth="2" strokeDasharray="4,4" />

            {/* Moving dots on lines */}
            <circle r="3" fill="#4CAF50">
                <animateMotion path="M 230 68 L 180 96" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#FFC107">
                <animateMotion path="M 104 68 L 154 96" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle r="3" fill="#2196F3">
                <animateMotion path="M 167 150 L 167 125" dur="2s" repeatCount="indefinite" />
            </circle>

            {/* Outer Nodes - Spaced Out to Corners */}

            {/* Stripe (Top Left Corner) */}
            <g transform="translate(40, 30)">
                <rect width="80" height="50" rx="6" fill="#635bff" />
                <text x="40" y="25" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle">Stripe</text>
                <text x="40" y="40" fill="white" fontSize="9" opacity="0.9" textAnchor="middle">Payments</text>
            </g>

            {/* Auth0 (Top Right Corner) */}
            <g transform="translate(214, 30)">
                <rect width="80" height="50" rx="6" fill="#EB5424" />
                <text x="40" y="25" fill="white" fontSize="13" fontWeight="bold" textAnchor="middle">Auth0</text>
                <text x="40" y="40" fill="white" fontSize="9" opacity="0.9" textAnchor="middle">Security</text>
            </g>

            {/* Maps (Bottom Center - Slightly lower) */}
            <g transform="translate(127, 155)">
                <rect width="80" height="35" rx="6" fill="#4285F4" />
                <text x="40" y="18" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle">Maps API</text>
                <text x="40" y="29" fill="white" fontSize="8" opacity="0.9" textAnchor="middle">Location</text>
            </g>

        </svg>
    );
}
