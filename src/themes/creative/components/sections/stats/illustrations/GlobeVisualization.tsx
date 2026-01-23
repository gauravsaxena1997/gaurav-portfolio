'use client';

import { memo, useRef, useEffect, useCallback } from 'react';
import createGlobe from 'cobe';

interface GlobeVisualizationProps {
  className?: string;
}

/**
 * Interactive WebGL dot-matrix globe using Cobe library
 * Cropped view - cut from right (20%) and bottom (25%)
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
    const autoRotateSpeed = prefersReducedMotion ? 0 : 0.004;

    // Globe size - make it larger than container for cropping effect
    const size = 450;

    canvasRef.current.width = size * 2;
    canvasRef.current.height = size * 2;
    canvasRef.current.style.width = `${size}px`;
    canvasRef.current.style.height = `${size}px`;

    globeRef.current = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.72, 0.52, 0.04],
      glowColor: [0.1, 0.1, 0.1],
      markers: [
        { location: [28.6139, 77.209], size: 0.08 },
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
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        maxHeight: '38vh',
        overflow: 'hidden',
      }}
    >
      {/* Canvas positioned to crop right 20% and bottom 25% */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOut={handlePointerOut}
        onPointerMove={handlePointerMove}
        style={{
          position: 'absolute',
          top: '-10%',
          left: '-15%',
          width: '130%',
          height: '130%',
          touchAction: 'none',
        }}
        aria-label="Interactive 3D globe showing global availability"
      />
    </div>
  );
});
