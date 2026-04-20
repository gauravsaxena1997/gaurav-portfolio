'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type GyroPermission = 'unknown' | 'granted' | 'denied' | 'unsupported' | 'autogranted';

export interface GyroReading {
    x: number;
    y: number;
}

const hasOrientationAPI = typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
const needsExplicitPermission =
    hasOrientationAPI &&
    typeof (DeviceOrientationEvent as unknown as { requestPermission?: unknown }).requestPermission ===
        'function';

let sharedPermission: GyroPermission = 'unknown';
const sharedListeners = new Set<(p: GyroPermission) => void>();

function notifyAll(p: GyroPermission) {
    sharedPermission = p;
    sharedListeners.forEach((cb) => cb(p));
}

function isMobileViewport() {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(max-width: 900px)').matches;
}

export function useGyroscope() {
    const readingRef = useRef<GyroReading>({ x: 0, y: 0 });
    const [permission, setPermission] = useState<GyroPermission>(sharedPermission);

    const handler = useCallback((e: DeviceOrientationEvent) => {
        if (e.gamma === null || e.beta === null) return;
        // Normalize over ±30° (was 45°) — typical wrist tilt reaches full ±1 sooner
        const x = Math.max(-1, Math.min(1, e.gamma / 30));
        const yRaw = (e.beta - 20) / 30;
        readingRef.current.x = x;
        readingRef.current.y = -Math.max(-1, Math.min(1, yRaw));
    }, []);

    useEffect(() => {
        if (!hasOrientationAPI || !isMobileViewport()) {
            setPermission('unsupported');
            return;
        }

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            setPermission('unsupported');
            return;
        }

        let attached = false;
        const attach = () => {
            if (attached) return;
            window.addEventListener('deviceorientation', handler);
            attached = true;
        };

        if (!needsExplicitPermission) {
            notifyAll('autogranted');
            setPermission('autogranted');
            attach();
        } else {
            setPermission(sharedPermission);
            if (sharedPermission === 'granted') attach();

            const sub = (p: GyroPermission) => {
                setPermission(p);
                if (p === 'granted') attach();
            };
            sharedListeners.add(sub);

            return () => {
                sharedListeners.delete(sub);
                if (attached) window.removeEventListener('deviceorientation', handler);
            };
        }

        return () => {
            if (attached) window.removeEventListener('deviceorientation', handler);
        };
    }, [handler]);

    const requestPermission = useCallback(async (): Promise<GyroPermission> => {
        if (!needsExplicitPermission) {
            notifyAll('autogranted');
            return 'autogranted';
        }
        try {
            const fn = (DeviceOrientationEvent as unknown as {
                requestPermission: () => Promise<string>;
            }).requestPermission;
            const result = await fn();
            const next: GyroPermission = result === 'granted' ? 'granted' : 'denied';
            notifyAll(next);
            return next;
        } catch {
            notifyAll('denied');
            return 'denied';
        }
    }, []);

    return {
        readingRef,
        permission,
        needsPermission: needsExplicitPermission && permission !== 'granted',
        isActive: permission === 'granted' || permission === 'autogranted',
        requestPermission,
    };
}
