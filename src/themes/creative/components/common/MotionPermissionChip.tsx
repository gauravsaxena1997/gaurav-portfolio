'use client';

import { useState } from 'react';
import { useGyroscope } from '@/themes/creative/hooks/useGyroscope';
import styles from './MotionPermissionChip.module.css';

/**
 * Shows only on iOS-like environments where DeviceOrientationEvent.requestPermission exists
 * and the user has not yet granted. One tap enables gyroscope across app.
 */
export function MotionPermissionChip() {
    const { needsPermission, requestPermission } = useGyroscope();
    const [hiding, setHiding] = useState(false);

    if (!needsPermission) return null;

    const onClick = async () => {
        const result = await requestPermission();
        if (result === 'granted') {
            setHiding(true);
        }
    };

    return (
        <button
            type="button"
            onClick={onClick}
            className={`${styles.chip} ${hiding ? styles.hidden : ''}`}
            aria-label="Enable motion controls"
        >
            <svg
                className={styles.icon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M12 2v4" />
                <path d="M12 18v4" />
                <path d="M4.93 4.93l2.83 2.83" />
                <path d="M16.24 16.24l2.83 2.83" />
                <path d="M2 12h4" />
                <path d="M18 12h4" />
                <path d="M4.93 19.07l2.83-2.83" />
                <path d="M16.24 7.76l2.83-2.83" />
            </svg>
            Tap to enable motion
        </button>
    );
}
