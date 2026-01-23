'use client';

import { useRef, useEffect, useCallback, useState, useMemo } from 'react';
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

// Animation timing
const BEAM_TRANSITION_DURATION = 0.6; // seconds
const BEAM_EASE = 'power2.inOut';

// Particle configuration
const PARTICLE_COUNT = 8;

interface Particle {
  id: number;
  x: number;      // Position along beam (0-1, 0 = origin, 1 = far end)
  y: number;      // Offset from beam center (-1 to 1)
  size: number;   // Size in pixels
  delay: number;  // Animation delay
  duration: number; // Animation duration
}

/**
 * Creates a clip-path polygon for the spotlight beam
 * Forms a triangular cone from lighthouse origin
 * Values are rounded to 2 decimal places to prevent sub-pixel flickering
 * @param beamLength - Scale of beam distance (0-1, used for retraction animation)
 */
function createBeamClipPath(
  originX: number,
  originY: number,
  angle: number,
  beamLength: number = 1
): string {
  // Calculate the two edge angles of the beam
  const leftAngle = angle - HALF_BEAM_RAD;
  const rightAngle = angle + HALF_BEAM_RAD;

  // Extend beam - scale by beamLength for retraction effect (200% max)
  const distance = 200 * beamLength;

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
 * Generate random particles for the beam
 */
function generateParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: 0.15 + Math.random() * 0.7,       // Position along beam (avoid edges)
    y: (Math.random() - 0.5) * 1.6,      // Offset from center
    size: 2 + Math.random() * 2,          // 2-4px
    delay: Math.random() * 3,             // Random start delay
    duration: 3 + Math.random() * 2,      // 3-5 second drift cycle
  }));
}

/**
 * SpotlightEffect - Uses mix-blend-mode: difference for automatic color inversion
 * This is the industry-standard approach for spotlight/flashlight effects
 * No duplicate content needed - colors invert automatically
 *
 * Features:
 * - Realistic beam retraction when turning off (light fades from far end first)
 * - Subtle floating particles (dust motes) within the beam
 * - Smooth transitions with natural easing
 */
export function SpotlightEffect({
  containerRef,
  lighthouseOrigin,
  mode,
  isActive,
  isEnabled = true,
}: SpotlightEffectProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const particleLayerRef = useRef<HTMLDivElement>(null);
  const angleRef = useRef(STATIC_ANGLE);
  const beamLengthRef = useRef(isEnabled ? 1 : 0);
  const gyroCleanupRef = useRef<(() => void) | null>(null);
  const ambientTweenRef = useRef<gsap.core.Tween | null>(null);
  const beamTweenRef = useRef<gsap.core.Tween | null>(null);

  // Generate particles once on mount
  const particles = useMemo(() => generateParticles(), []);

  // Track previous enabled state for transition direction
  const prevEnabledRef = useRef(isEnabled);

  // Update clip-path based on current angle and beam length
  const updateClipPath = useCallback(() => {
    if (!overlayRef.current) return;

    const clipPath = createBeamClipPath(
      lighthouseOrigin.x,
      lighthouseOrigin.y,
      angleRef.current,
      beamLengthRef.current
    );

    overlayRef.current.style.clipPath = clipPath;

    // Also update particle layer clip-path
    if (particleLayerRef.current) {
      particleLayerRef.current.style.clipPath = clipPath;
    }
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

  // Beam retraction animation when isEnabled changes
  useEffect(() => {
    const turningOn = isEnabled && !prevEnabledRef.current;
    const turningOff = !isEnabled && prevEnabledRef.current;
    prevEnabledRef.current = isEnabled;

    // Kill any existing beam animation
    if (beamTweenRef.current) {
      beamTweenRef.current.kill();
      beamTweenRef.current = null;
    }

    if (turningOff) {
      // Retract beam: animate length from 1 to 0 (far end fades first)
      const proxy = { length: beamLengthRef.current };
      beamTweenRef.current = gsap.to(proxy, {
        length: 0,
        duration: BEAM_TRANSITION_DURATION,
        ease: BEAM_EASE,
        onUpdate: () => {
          beamLengthRef.current = proxy.length;
          updateClipPath();
        },
      });
    } else if (turningOn) {
      // Extend beam: animate length from 0 to 1 (with slight delay for natural feel)
      const proxy = { length: beamLengthRef.current };
      beamTweenRef.current = gsap.to(proxy, {
        length: 1,
        duration: BEAM_TRANSITION_DURATION,
        delay: 0.1, // Slight delay before beam appears
        ease: BEAM_EASE,
        onUpdate: () => {
          beamLengthRef.current = proxy.length;
          updateClipPath();
        },
      });
    }

    return () => {
      if (beamTweenRef.current) {
        beamTweenRef.current.kill();
        beamTweenRef.current = null;
      }
    };
  }, [isEnabled, updateClipPath]);

  return (
    <>
      {/* Main spotlight overlay with mix-blend-mode */}
      <div
        ref={overlayRef}
        className={styles.spotlightOverlay}
        aria-hidden="true"
        style={{
          opacity: isEnabled ? 1 : 0,
          transition: `opacity ${BEAM_TRANSITION_DURATION}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />

      {/* Particle layer - floating dust motes in the beam */}
      <div
        ref={particleLayerRef}
        className={styles.particleLayer}
        aria-hidden="true"
        style={{
          opacity: isEnabled ? 1 : 0,
          transition: `opacity ${BEAM_TRANSITION_DURATION}s cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className={styles.particle}
            style={{
              // Position particle along beam direction from origin
              // x = position along beam, y = perpendicular offset
              left: `${lighthouseOrigin.x * 100 + (Math.cos(STATIC_ANGLE) * p.x * 60)}%`,
              top: `${lighthouseOrigin.y * 100 + (Math.sin(STATIC_ANGLE) * p.x * 60) + (p.y * 5)}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
