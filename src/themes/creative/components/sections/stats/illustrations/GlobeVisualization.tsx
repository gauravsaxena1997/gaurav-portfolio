'use client';

import { memo, useRef, useEffect, useCallback, useState } from 'react';
import createGlobe from 'cobe';

interface GlobeVisualizationProps {
  className?: string;
}

/**
 * Interactive WebGL dot-matrix globe using Cobe library
 * BIGGER globe with cropping on RIGHT and BOTTOM sides only
 * No top crop - the top of the globe is fully visible
 * Theme-aware colors for light and dark modes
 */
export const GlobeVisualization = memo(function GlobeVisualization({
  className,
}: GlobeVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const phiRef = useRef(0);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Detect dark/light mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  const handlePointerOut = useCallback(() => {
    pointerInteracting.current = null;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerInteracting.current !== null) {
      const delta = e.clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
    }
  }, []);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const autoRotateSpeed = prefersReducedMotion ? 0 : 0.002; // Slower, smoother rotation

    // Globe size - 10% bigger (was 550)
    const size = 605;

    canvasRef.current.width = size * 2;
    canvasRef.current.height = size * 2;
    canvasRef.current.style.width = `${size}px`;
    canvasRef.current.style.height = `${size}px`;

    // Theme-aware colors
    // Light Mode: warm brown dots on light surface
    // Dark Mode: warm beige dots on dark surface
    const themeColors = isDarkMode
      ? {
          dark: 0.9,                          // Dark globe surface
          baseColor: [0.85, 0.78, 0.68] as [number, number, number],  // Warm beige dots (visible on dark)
          glowColor: [0.25, 0.22, 0.18] as [number, number, number],  // Subtle warm glow
        }
      : {
          dark: 0.1,                          // Light globe surface
          baseColor: [0.55, 0.45, 0.35] as [number, number, number],  // Warm brown dots (visible on light)
          glowColor: [0.85, 0.80, 0.72] as [number, number, number],  // Warm beige glow
        };

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: themeColors.dark,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: themeColors.baseColor,
      markerColor: [0.72, 0.52, 0.04],  // Golden yellow markers
      glowColor: themeColors.glowColor,
      markers: [
        { location: [28.6139, 77.209], size: 0.08 },      // India (New Delhi)
        { location: [37.7749, -122.4194], size: 0.08 },   // USA (San Francisco)
        { location: [25.2048, 55.2708], size: 0.08 },     // UAE (Dubai)
        { location: [51.5074, -0.1278], size: 0.08 },     // UK (London)
      ],
      onRender: (state) => {
        if (pointerInteracting.current !== null) {
          phiRef.current += pointerInteractionMovement.current / 200;
          pointerInteractionMovement.current = 0;
        } else {
          phiRef.current += autoRotateSpeed;
        }
        state.phi = phiRef.current;
      },
    });

    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
    }

    return () => {
      if (globeRef.current) {
        globeRef.current.destroy();
      }
    };
  }, [isDarkMode]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '42vh',
        overflow: 'hidden',
      }}
    >
      {/*
        Canvas positioned to crop from RIGHT and BOTTOM:
        - top: 0 (no top crop - globe starts at container top)
        - right: negative value pushes globe right, cropping from right edge
        - Large size + overflow:hidden crops from bottom
      */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        style={{
          position: 'absolute',
          top: '0',           // No top crop
          right: '-15%',      // Push right to crop from right edge
          width: '140%',      // Bigger than container
          height: '140%',     // Bigger - bottom gets cropped by overflow:hidden
          maxWidth: '660px',  // Slightly larger max for 10% size increase
          touchAction: 'none',
        }}
        aria-label="Interactive 3D globe showing global availability"
      />
    </div>
  );
});
