'use client';

import { useRef, useEffect, useCallback } from 'react';

export interface MousePositionResult {
  /** Normalized X position (0-1) */
  mouseX: number;
  /** Normalized Y position (0-1) */
  mouseY: number;
  /** Beam angle in radians from lighthouse origin */
  beamAngle: number;
  /** Whether the mouse is currently active/moving */
  isActive: boolean;
}

interface UseMousePositionOptions {
  /** Container element to track mouse within */
  containerRef: React.RefObject<HTMLElement | null>;
  /** Lighthouse origin position (0-1 normalized) */
  lighthouseOrigin: { x: number; y: number };
  /** Whether tracking is enabled */
  enabled?: boolean;
  /** Smoothing factor (0-1, lower = smoother) */
  smoothing?: number;
  /** Callback when position updates */
  onUpdate?: (result: MousePositionResult) => void;
}

/**
 * Hook for tracking mouse position with smoothing and beam angle calculation
 * Uses RAF for 60fps updates and stores values in refs to avoid re-renders
 */
export function useMousePosition({
  containerRef,
  lighthouseOrigin,
  enabled = true,
  smoothing = 0.15,
  onUpdate,
}: UseMousePositionOptions) {
  // Raw mouse position (0-1 normalized)
  const rawMouseX = useRef(0.5);
  const rawMouseY = useRef(0.5);

  // Smoothed position
  const smoothedX = useRef(0.5);
  const smoothedY = useRef(0.5);

  // Animation state
  const rafId = useRef<number | null>(null);
  const isActive = useRef(false);
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null);

  // Linear interpolation for smoothing
  const lerp = (start: number, end: number, factor: number) => {
    return start + (end - start) * factor;
  };

  // Calculate beam angle from lighthouse to mouse
  const calculateBeamAngle = useCallback(
    (mouseX: number, mouseY: number) => {
      const dx = mouseX - lighthouseOrigin.x;
      const dy = mouseY - lighthouseOrigin.y;
      return Math.atan2(dy, dx);
    },
    [lighthouseOrigin.x, lighthouseOrigin.y]
  );

  // Animation loop
  const animate = useCallback(() => {
    // Apply smoothing
    smoothedX.current = lerp(smoothedX.current, rawMouseX.current, smoothing);
    smoothedY.current = lerp(smoothedY.current, rawMouseY.current, smoothing);

    // Calculate beam angle
    const beamAngle = calculateBeamAngle(smoothedX.current, smoothedY.current);

    // Call update callback
    onUpdate?.({
      mouseX: smoothedX.current,
      mouseY: smoothedY.current,
      beamAngle,
      isActive: isActive.current,
    });

    // Continue loop
    rafId.current = requestAnimationFrame(animate);
  }, [smoothing, calculateBeamAngle, onUpdate]);

  // Handle mouse move
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();

      // Normalize to 0-1
      rawMouseX.current = (e.clientX - rect.left) / rect.width;
      rawMouseY.current = (e.clientY - rect.top) / rect.height;

      // Mark as active
      isActive.current = true;

      // Reset inactivity timeout
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      inactivityTimeout.current = setTimeout(() => {
        isActive.current = false;
      }, 2000);
    },
    [containerRef]
  );

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    isActive.current = false;
  }, []);

  // Handle touch events (for mobile beam control)
  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const container = containerRef.current;
      if (!container || e.touches.length === 0) return;

      const touch = e.touches[0];
      const rect = container.getBoundingClientRect();

      // Normalize to 0-1
      rawMouseX.current = (touch.clientX - rect.left) / rect.width;
      rawMouseY.current = (touch.clientY - rect.top) / rect.height;

      // Mark as active
      isActive.current = true;

      // Reset inactivity timeout
      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
      inactivityTimeout.current = setTimeout(() => {
        isActive.current = false;
      }, 2000);
    },
    [containerRef]
  );

  useEffect(() => {
    if (!enabled) {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Add event listeners with passive flag for performance
    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    // Touch events for mobile
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchstart', handleTouchMove, { passive: true });

    // Start animation loop
    rafId.current = requestAnimationFrame(animate);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchstart', handleTouchMove);

      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }

      if (inactivityTimeout.current) {
        clearTimeout(inactivityTimeout.current);
      }
    };
  }, [enabled, containerRef, handleMouseMove, handleMouseLeave, handleTouchMove, animate]);

  // Return current values (for one-time reads)
  return {
    getPosition: () => ({
      mouseX: smoothedX.current,
      mouseY: smoothedY.current,
      beamAngle: calculateBeamAngle(smoothedX.current, smoothedY.current),
      isActive: isActive.current,
    }),
  };
}
