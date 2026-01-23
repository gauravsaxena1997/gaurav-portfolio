'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useMousePosition } from '../../../hooks/useMousePosition';
import styles from './HeroSection.module.css';

export type SpotlightMode = 'mouse' | 'touch' | 'gyroscope' | 'ambient' | 'static';

interface SpotlightEffectProps {
  /** Container ref for mouse tracking bounds */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Lighthouse position (0-1 normalized) */
  lighthouseOrigin: { x: number; y: number };
  /** Interaction mode */
  mode: SpotlightMode;
  /** Whether the spotlight is active */
  isActive: boolean;
  /** Whether the spotlight is enabled (beam visible) */
  isEnabled?: boolean;
}

// Beam width in degrees
const BEAM_WIDTH_DEG = 30;
const HALF_BEAM_RAD = (BEAM_WIDTH_DEG * Math.PI) / 180 / 2;

// Default static angle (pointing up-left, approximately 225 degrees or -135 from right)
const STATIC_ANGLE = (-135 * Math.PI) / 180;

// Ambient oscillation range (degrees from center)
const AMBIENT_RANGE_DEG = 45;
const AMBIENT_RANGE_RAD = (AMBIENT_RANGE_DEG * Math.PI) / 180;

/**
 * Creates a clip-path polygon for the spotlight beam
 * Forms a triangular cone from lighthouse origin
 * Values are rounded to 2 decimal places to prevent sub-pixel flickering
 */
function createBeamClipPath(
  originX: number,
  originY: number,
  angle: number
): string {
  // Calculate the two edge angles of the beam
  const leftAngle = angle - HALF_BEAM_RAD;
  const rightAngle = angle + HALF_BEAM_RAD;

  // Extend beam far beyond viewport (200% to ensure coverage)
  const distance = 200;

  // Calculate end points of beam edges
  const leftX = originX + Math.cos(leftAngle) * distance;
  const leftY = originY + Math.sin(leftAngle) * distance;
  const rightX = originX + Math.cos(rightAngle) * distance;
  const rightY = originY + Math.sin(rightAngle) * distance;

  // Round to 2 decimal places to prevent sub-pixel flickering
  const round = (n: number) => Math.round(n * 100) / 100;

  // Convert to percentages with rounding
  return `polygon(${round(originX * 100)}% ${round(originY * 100)}%, ${round(leftX * 100)}% ${round(leftY * 100)}%, ${round(rightX * 100)}% ${round(rightY * 100)}%)`;
}

/**
 * SpotlightEffect - Uses mix-blend-mode: difference for automatic color inversion
 * This is the industry-standard approach for spotlight/flashlight effects
 * No duplicate content needed - colors invert automatically
 */
export function SpotlightEffect({
  containerRef,
  lighthouseOrigin,
  mode,
  isActive,
  isEnabled = true,
}: SpotlightEffectProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(STATIC_ANGLE);
  const gyroCleanupRef = useRef<(() => void) | null>(null);
  const ambientTweenRef = useRef<gsap.core.Tween | null>(null);

  // Update clip-path based on current angle
  const updateClipPath = useCallback(() => {
    if (!overlayRef.current) return;

    const clipPath = createBeamClipPath(
      lighthouseOrigin.x,
      lighthouseOrigin.y,
      angleRef.current
    );

    overlayRef.current.style.clipPath = clipPath;
  }, [lighthouseOrigin.x, lighthouseOrigin.y]);

  // Mouse/touch position hook (active in mouse or touch mode)
  useMousePosition({
    containerRef,
    lighthouseOrigin,
    enabled: (mode === 'mouse' || mode === 'touch') && isActive,
    smoothing: 0.12,
    onUpdate: (result) => {
      angleRef.current = result.beamAngle;
      updateClipPath();
    },
  });

  // Handle gyroscope mode
  useEffect(() => {
    if (mode !== 'gyroscope' || !isActive) {
      if (gyroCleanupRef.current) {
        gyroCleanupRef.current();
        gyroCleanupRef.current = null;
      }
      return;
    }

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const gamma = event.gamma || 0;
      const normalizedGamma = Math.max(-45, Math.min(45, gamma)) / 45;
      const angleOffset = normalizedGamma * AMBIENT_RANGE_RAD;

      angleRef.current = STATIC_ANGLE + angleOffset;
      updateClipPath();
    };

    const requestPermission = async () => {
      if (
        typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
          .requestPermission === 'function'
      ) {
        try {
          const permission = await (
            DeviceOrientationEvent as unknown as { requestPermission: () => Promise<string> }
          ).requestPermission();
          if (permission !== 'granted') {
            return false;
          }
        } catch {
          return false;
        }
      }
      return true;
    };

    requestPermission().then((granted) => {
      if (granted) {
        window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        gyroCleanupRef.current = () => {
          window.removeEventListener('deviceorientation', handleOrientation);
        };
      }
    });

    return () => {
      if (gyroCleanupRef.current) {
        gyroCleanupRef.current();
        gyroCleanupRef.current = null;
      }
    };
  }, [mode, isActive, updateClipPath]);

  // Handle ambient oscillation mode
  useEffect(() => {
    if (mode !== 'ambient' || !isActive) {
      if (ambientTweenRef.current) {
        ambientTweenRef.current.kill();
        ambientTweenRef.current = null;
      }
      return;
    }

    const proxy = { angle: STATIC_ANGLE };

    ambientTweenRef.current = gsap.to(proxy, {
      angle: STATIC_ANGLE + AMBIENT_RANGE_RAD,
      duration: 4,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      onUpdate: () => {
        angleRef.current = proxy.angle;
        updateClipPath();
      },
    });

    return () => {
      if (ambientTweenRef.current) {
        ambientTweenRef.current.kill();
        ambientTweenRef.current = null;
      }
    };
  }, [mode, isActive, updateClipPath]);

  // Handle static mode
  useEffect(() => {
    if (mode === 'static') {
      angleRef.current = STATIC_ANGLE;
      updateClipPath();
    }
  }, [mode, updateClipPath]);

  // Initial clip-path
  useEffect(() => {
    updateClipPath();
  }, [updateClipPath]);

  return (
    <div
      ref={overlayRef}
      className={styles.spotlightOverlay}
      aria-hidden="true"
      style={{
        opacity: isEnabled ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    />
  );
}
