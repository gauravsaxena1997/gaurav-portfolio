'use client';

import { useRef, useEffect, useCallback, useState } from 'react';

export interface CharacterState {
  /** Horizontal eye direction (-1 = left, 1 = right) */
  eyeX: number;
  /** Vertical eye direction (-1 = up, 1 = down) */
  eyeY: number;
  /** Horizontal head tilt in degrees (-15 to 15) */
  headTiltX: number;
  /** Vertical head tilt in degrees (-10 to 10) */
  headTiltY: number;
  /** Expression value (0 = sad, 50 = neutral, 100 = happy) */
  expression: number;
  /** Whether cursor is active/moving */
  isActive: boolean;
}

interface UseCharacterTrackingOptions {
  /** Reference to the character container element */
  characterRef: React.RefObject<HTMLElement | null>;
  /** Reference to the form element for proximity-based expressions */
  formRef?: React.RefObject<HTMLElement | null>;
  /** References to interactive elements (buttons) that trigger smiles */
  interactionRefs?: React.RefObject<HTMLElement | null>[];
  /** Whether tracking is enabled */
  enabled?: boolean;
  /** Smoothing factor (0-1, lower = smoother) */
  smoothing?: number;
}

const DEFAULT_STATE: CharacterState = {
  eyeX: 0,
  eyeY: 0,
  headTiltX: 0,
  headTiltY: 0,
  expression: 50,
  isActive: false,
};

// Linear interpolation
function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}

// Clamp value between min and max
function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Hook for tracking mouse position and calculating character animation state
 * Provides eye position, head tilt, and expression based on cursor proximity
 */
export function useCharacterTracking({
  characterRef,
  formRef,
  interactionRefs = [],
  enabled = true,
  smoothing = 0.12,
}: UseCharacterTrackingOptions) {
  const [characterState, setCharacterState] = useState<CharacterState>(DEFAULT_STATE);

  // Raw values (unsmoothed)
  const rawEyeX = useRef(0);
  const rawEyeY = useRef(0);
  const rawHeadTiltX = useRef(0);
  const rawHeadTiltY = useRef(0);
  const rawExpression = useRef(50);

  // Smoothed values
  const smoothedState = useRef<CharacterState>(DEFAULT_STATE);

  // Animation state
  const rafId = useRef<number | null>(null);
  const isActive = useRef(false);
  const inactivityTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Calculate expression based on distance from interactive elements
  const calculateExpression = useCallback((mouseX: number, mouseY: number) => {
    let targetExpression = 40; // Default neutral state
    let minDistance = Infinity;

    // 1. Check proximity to interaction targets (Buttons)
    if (interactionRefs.length > 0) {
      for (const ref of interactionRefs) {
        if (ref.current) {
          const rect = ref.current.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const dist = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
          );

          if (dist < minDistance) {
            minDistance = dist;
          }
        }
      }

      // Map proximity to smile intensity (0-100)
      if (minDistance < 100) {
        // Very close: Big Smile (80-100)
        targetExpression = lerp(80, 100, 1 - minDistance / 100);
      } else if (minDistance < 300) {
        // Approaching: Growing Smile (40-80)
        targetExpression = lerp(40, 80, 1 - (minDistance - 100) / 200);
      }
    }

    // 2. Fallback: Form Center Proximity (General Engagement)
    if (minDistance === Infinity && formRef?.current) {
      const formRect = formRef.current.getBoundingClientRect();
      const formCenterX = formRect.left + formRect.width / 2;
      const formCenterY = formRect.top + formRect.height / 2;
      const distance = Math.sqrt(
        Math.pow(mouseX - formCenterX, 2) + Math.pow(mouseY - formCenterY, 2)
      );

      if (distance < 400) {
        targetExpression = 50; // Neutral/Pleasant
      } else {
        targetExpression = 30; // Slightly aloof/bored
      }
    }

    return targetExpression;
  }, [interactionRefs, formRef]);

  // Animation loop for smooth updates
  const animate = useCallback(() => {
    // Apply smoothing
    smoothedState.current.eyeX = lerp(smoothedState.current.eyeX, rawEyeX.current, smoothing);
    smoothedState.current.eyeY = lerp(smoothedState.current.eyeY, rawEyeY.current, smoothing);
    smoothedState.current.headTiltX = lerp(smoothedState.current.headTiltX, rawHeadTiltX.current, smoothing);
    smoothedState.current.headTiltY = lerp(smoothedState.current.headTiltY, rawHeadTiltY.current, smoothing);
    smoothedState.current.expression = lerp(smoothedState.current.expression, rawExpression.current, smoothing * 0.5);
    smoothedState.current.isActive = isActive.current;

    // Update state (batch to reduce re-renders)
    setCharacterState({ ...smoothedState.current });

    // Continue loop
    rafId.current = requestAnimationFrame(animate);
  }, [smoothing]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const character = characterRef.current;
    if (!character) return;

    const rect = character.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate normalized position relative to character center
    // Range: approximately -1 to 1
    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

    // Eye position (-1 to 1)
    rawEyeX.current = clamp(deltaX * 1.5, -1, 1);
    rawEyeY.current = clamp(deltaY * 1.5, -1, 1);

    // Head tilt (follows cursor direction but more subtle)
    rawHeadTiltX.current = clamp(deltaX * 8, -15, 15);
    rawHeadTiltY.current = clamp(deltaY * 5, -10, 10);

    // Expression based on proximity to form
    rawExpression.current = calculateExpression(e.clientX, e.clientY);

    // Mark as active
    isActive.current = true;

    // Reset inactivity timeout
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      isActive.current = false;
      // Reset to neutral when inactive
      rawExpression.current = 60;
    }, 3000);
  }, [characterRef, calculateExpression]);

  // Handle touch events for mobile
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) return;

    const touch = e.touches[0];
    // Create a synthetic mouse event-like object
    handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  }, [handleMouseMove]);

  // Handle device orientation for mobile (gyroscope)
  const handleDeviceOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma === null || e.beta === null) return;

    // gamma: left/right tilt (-90 to 90)
    // beta: front/back tilt (-180 to 180)
    const normalizedX = clamp(e.gamma / 45, -1, 1);
    const normalizedY = clamp((e.beta - 45) / 45, -1, 1);

    rawEyeX.current = normalizedX;
    rawEyeY.current = normalizedY;
    rawHeadTiltX.current = normalizedX * 8;
    rawHeadTiltY.current = normalizedY * 5;

    isActive.current = true;

    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }
    inactivityTimeout.current = setTimeout(() => {
      isActive.current = false;
    }, 3000);
  }, []);

  useEffect(() => {
    if (!enabled) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Set static friendly pose
      setCharacterState({
        eyeX: 0,
        eyeY: 0,
        headTiltX: 0,
        headTiltY: 0,
        expression: 75,
        isActive: false,
      });
      return;
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Try to add device orientation for mobile
    if ('DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    }

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [enabled, handleMouseMove, handleTouchMove, handleDeviceOrientation, animate]);

  return characterState;
}
