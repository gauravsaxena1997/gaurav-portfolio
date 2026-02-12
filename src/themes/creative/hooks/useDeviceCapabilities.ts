'use client';

import { useState, useEffect } from 'react';

export interface DeviceCapabilities {
  isTouchDevice: boolean;
  hasGyroscope: boolean;
  prefersReducedMotion: boolean;
}

/**
 * Hook to detect device capabilities for adaptive interactions
 * - Touch detection for mobile/tablet
 * - Gyroscope for device orientation
 * - Reduced motion preference for accessibility
 */
export function useDeviceCapabilities(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    isTouchDevice: false,
    hasGyroscope: false,
    prefersReducedMotion: false,
  });

  useEffect(() => {
    // Detect touch capability
    const isTouchDevice =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      // @ts-expect-error - msMaxTouchPoints is IE-specific
      navigator.msMaxTouchPoints > 0;

    // Detect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // Detect gyroscope - check if DeviceOrientationEvent is available
    const checkGyroscope = async () => {
      let hasGyroscope = false;

      if ('DeviceOrientationEvent' in window) {
        // For iOS 13+, we need to request permission
        if (
          typeof (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> })
            .requestPermission === 'function'
        ) {
          // We can't request permission without user gesture, so just mark as potentially available
          // The actual permission will be requested when needed
          hasGyroscope = true;
        } else {
          // For other browsers, check if events fire
          hasGyroscope = true;
        }
      }

      setCapabilities({
        isTouchDevice,
        hasGyroscope,
        prefersReducedMotion,
      });
    };

    checkGyroscope();

    // Listen for reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setCapabilities((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    mediaQuery.addEventListener('change', handleMotionChange);
    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  return capabilities;
}
