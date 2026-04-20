'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Dev-only diagnostic: shows live deviceorientation event count + latest gamma/beta.
 * If count stays at 0 → events not firing (likely insecure origin on Android Chrome).
 */
export function GyroDebugChip() {
    const [visible, setVisible] = useState(true);
    const [count, setCount] = useState(0);
    const [latest, setLatest] = useState<{ gamma: number | null; beta: number | null } | null>(null);
    const [isMobile, setIsMobile] = useState(false);
    const [secureCtx, setSecureCtx] = useState<boolean>(true);
    const [hasAPI, setHasAPI] = useState<boolean>(true);
    const countRef = useRef(0);

    useEffect(() => {
        setIsMobile(window.matchMedia('(max-width: 900px)').matches);
        setSecureCtx(window.isSecureContext);
        setHasAPI('DeviceOrientationEvent' in window);

        const handler = (e: DeviceOrientationEvent) => {
            countRef.current += 1;
            setCount(countRef.current);
            setLatest({ gamma: e.gamma, beta: e.beta });
        };
        window.addEventListener('deviceorientation', handler);
        return () => window.removeEventListener('deviceorientation', handler);
    }, []);

    if (process.env.NODE_ENV === 'production') return null;
    if (!isMobile) return null;
    if (!visible) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 12,
                left: 12,
                zIndex: 9999,
                background: 'rgba(0,0,0,0.78)',
                color: '#fff',
                padding: '8px 10px',
                borderRadius: 8,
                font: '11px/1.3 monospace',
                maxWidth: 220,
            }}
        >
            <div><b>GYRO DEBUG</b></div>
            <div>secure: {String(secureCtx)}</div>
            <div>api: {String(hasAPI)}</div>
            <div>events: {count}</div>
            <div>γ: {latest?.gamma?.toFixed(1) ?? '—'}</div>
            <div>β: {latest?.beta?.toFixed(1) ?? '—'}</div>
            {count === 0 && secureCtx === false && (
                <div style={{ color: '#ffb4a2', marginTop: 4 }}>
                    not secure → gyro blocked. Use HTTPS.
                </div>
            )}
            <button
                onClick={() => setVisible(false)}
                style={{
                    marginTop: 4,
                    background: 'transparent',
                    border: '1px solid #fff',
                    color: '#fff',
                    borderRadius: 4,
                    padding: '2px 6px',
                    fontSize: 10,
                }}
            >
                dismiss
            </button>
        </div>
    );
}
