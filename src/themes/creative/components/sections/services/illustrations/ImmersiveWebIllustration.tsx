'use client';

import styles from './ImmersiveWebIllustration.module.css'; // Reusing container styles

export function ImmersiveWebIllustration() {
    return (
        <svg
            viewBox="0 0 334 216"
            className={styles.container}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Deep Space Background - Full Bleed */}
            <defs>
                <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#000000" />
                    <stop offset="100%" stopColor="#1e1e2e" />
                </linearGradient>
                <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF0080" />
                    <stop offset="100%" stopColor="#7928CA" />
                </linearGradient>
            </defs>

            <rect width="334" height="216" fill="url(#spaceGradient)" />

            {/* Grid Floor */}
            <path d="M -50 160 L 384 160" stroke="#ffffff20" strokeWidth="1" />
            <path d="M -50 180 L 384 180" stroke="#ffffff10" strokeWidth="1" />
            <path d="M 167 100 L -50 250" stroke="#ffffff10" strokeWidth="1" />
            <path d="M 167 100 L 384 250" stroke="#ffffff10" strokeWidth="1" />

            {/* Floating Isometric Cube - Large Centerpiece */}
            <g transform="translate(167, 108)">
                {/* Top Face */}
                <path d="M 0 -40 L 40 -20 L 0 0 L -40 -20 Z" fill="#FF0080" opacity="0.9" />
                {/* Right Face */}
                <path d="M 0 0 L 40 -20 L 40 30 L 0 50 Z" fill="#7928CA" opacity="0.8" />
                {/* Left Face */}
                <path d="M 0 0 L -40 -20 L -40 30 L 0 50 Z" fill="#4C1D95" opacity="0.8" />
            </g>

            {/* Floating Text - Massive & Bold */}
            <text x="167" y="50" fill="white" fontSize="32" fontWeight="900" textAnchor="middle" letterSpacing="4" filter="url(#glow)">
                IMMERSIVE
            </text>
            <text x="167" y="195" fill="#FF0080" fontSize="24" fontWeight="bold" textAnchor="middle" letterSpacing="6">
                3D WORLD
            </text>

            {/* Detailed Floating Elements to show depth */}
            <rect x="40" y="80" width="20" height="20" fill="none" stroke="#ffffff40" strokeWidth="2" transform="rotate(15 50 90)" />
            <circle cx="290" cy="100" r="10" fill="none" stroke="#ffffff40" strokeWidth="2" />
            <rect x="260" y="150" width="30" height="5" fill="#7928CA" rx="2" />
        </svg>
    );
}
