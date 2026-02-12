'use client';

import { useCallback, useState, useRef, useEffect } from 'react';

interface Use3DTiltOptions {
  /** Maximum tilt angle in degrees (default: 12) */
  maxTilt?: number;
  /** Perspective distance in pixels (default: 800) */
  perspective?: number;
  /** Scale factor on hover (default: 1.02) */
  scale?: number;
  /** Transition speed in ms (default: 400) */
  speed?: number;
  /** Disable tilt effect (for mobile/reduced motion) */
  disabled?: boolean;
}

interface TiltStyle {
  transform: string;
  transition: string;
}

interface Use3DTiltReturn {
  tiltStyle: TiltStyle;
  onMouseMove: (e: React.MouseEvent<HTMLElement>) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * Hook for creating a cursor-following 3D tilt effect
 * Desktop only - automatically disabled on touch devices and when prefers-reduced-motion is set
 */
export function use3DTilt(options: Use3DTiltOptions = {}): Use3DTiltReturn {
  const {
    maxTilt = 12,
    perspective = 800,
    scale = 1.02,
    speed = 400,
    disabled = false,
  } = options;

  const ref = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState<TiltStyle>({
    transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
    transition: `transform ${speed}ms ease-out`,
  });
  const [isHovering, setIsHovering] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Check for touch device and reduced motion preference
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsEnabled(!isTouchDevice && !prefersReducedMotion && !disabled);
  }, [disabled]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isEnabled || !ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Calculate distance from center (-1 to 1)
      const percentX = (e.clientX - centerX) / (rect.width / 2);
      const percentY = (e.clientY - centerY) / (rect.height / 2);

      // Calculate tilt angles (inverted for natural feel)
      const tiltX = -percentY * maxTilt;
      const tiltY = percentX * maxTilt;

      setTiltStyle({
        transform: `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(${scale})`,
        transition: 'transform 100ms ease-out',
      });
    },
    [isEnabled, maxTilt, perspective, scale]
  );

  const onMouseEnter = useCallback(() => {
    if (!isEnabled) return;
    setIsHovering(true);
  }, [isEnabled]);

  const onMouseLeave = useCallback(() => {
    if (!isEnabled) return;
    setIsHovering(false);
    setTiltStyle({
      transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`,
      transition: `transform ${speed}ms ease-out`,
    });
  }, [isEnabled, perspective, speed]);

  return {
    tiltStyle: isEnabled ? tiltStyle : {
      transform: 'none',
      transition: 'none',
    },
    onMouseMove,
    onMouseEnter,
    onMouseLeave,
    ref,
  };
}
