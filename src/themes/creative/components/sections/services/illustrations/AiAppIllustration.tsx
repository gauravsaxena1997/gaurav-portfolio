'use client';

import styles from './AiAppIllustration.module.css'; // Reusing container styles

export function AiAppIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Dark Minimalist Background */}
            <rect width="334" height="216" fill="#0F172A" />

            {/* Header Bar Skeleton */}
            <rect width="334" height="40" fill="#1E293B" />
            <circle cx="25" cy="20" r="6" fill="#334155" />
            <rect x="280" y="12" width="30" height="16" rx="4" fill="#334155" />

            {/* Chat Interface Container */}
            <g transform="translate(0, 40)">

                {/* Bot Message Skeleton (Left) - Pulse Animation */}
                <g transform="translate(20, 20)">
                    {/* Bot Avatar - Solid Green Circle */}
                    <circle cx="15" cy="15" r="15" fill="#10B981" opacity="0.9" />

                    {/* Message Bubble */}
                    <rect x="40" y="0" width="140" height="30" rx="8" fill="#334155" opacity="0.6">
                        <animate attributeName="opacity" values="0.6;0.8;0.6" dur="3s" repeatCount="indefinite" />
                    </rect>
                    <rect x="40" y="35" width="100" height="10" rx="4" fill="#334155" opacity="0.4" />
                </g>

                {/* User Message Skeleton (Right) */}
                <g transform="translate(130, 80)">
                    {/* Message Bubble */}
                    <rect x="0" y="0" width="160" height="30" rx="8" fill="#3B82F6" opacity="0.9" />
                    <rect x="60" y="35" width="100" height="10" rx="4" fill="#3B82F6" opacity="0.4" />
                </g>

                {/* Bot Response Skeleton (Left) - Delayed Pulse */}
                <g transform="translate(20, 140)">
                    {/* Bot Avatar - Solid Green Circle */}
                    <circle cx="15" cy="15" r="15" fill="#10B981" opacity="0.9">
                        <animate attributeName="opacity" values="0.9;1;0.9" dur="2s" repeatCount="indefinite" />
                    </circle>
                    {/* Message Bubble - Masked bottom to prevent overlap with input */}
                    <rect x="40" y="0" width="180" height="40" rx="8" fill="#334155" opacity="0.6" />
                </g>
            </g>

            {/* Input Overlay - Solid Background to cover any scrolling content */}
            <rect x="0" y="170" width="334" height="46" fill="#0F172A" />

            {/* Input Field Skeleton (Bottom) */}
            <rect x="20" y="180" width="250" height="20" rx="10" fill="#1E293B" />
            {/* Send Button */}
            <circle cx="300" cy="190" r="12" fill="#3B82F6" />

        </svg>
    );
}
