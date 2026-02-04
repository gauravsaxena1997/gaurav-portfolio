'use client';

import { memo, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './InteractiveGallery.module.css';

interface InteractiveGalleryProps {
  images: string[];
  projectName: string;
  className?: string;
}

// Seeded random generator for consistent results
function seededRandom(seed: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  for (let i = 0; i <= index; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
  }
  return (hash % 1000) / 1000; // 0 to 1
}

// Generate random X offsets (±20% from center)
function generateXOffsets(count: number, seed: string): number[] {
  return Array.from({ length: count }, (_, i) => {
    const rand = seededRandom(seed + 'x', i);
    return (rand - 0.5) * 40; // -20% to +20%
  });
}

// Generate random scale variations (0.9 to 1.1)
function generateScales(count: number, seed: string): number[] {
  return Array.from({ length: count }, (_, i) => {
    const rand = seededRandom(seed + 's', i);
    return 0.9 + rand * 0.2; // 0.9 to 1.1
  });
}

// Movement speeds - how fast each image rises
const RISE_SPEEDS = [1.0, 0.85, 0.7, 0.55];

// Staggered reveal thresholds - when each image starts appearing (0-1 progress)
// 1st: 0%, 2nd: 20%, 3rd: 40%, 4th: 60%
const REVEAL_THRESHOLDS = [0, 0.2, 0.4, 0.6];

// Base starting positions (pixels below viewport center) - Reduced gaps
const START_OFFSETS = [600, 750, 900, 1050];

// Final vertical gaps (cumulative) - Decreasing pattern for tighter fan
const FINAL_GAPS = [0, 45, 80, 105]; // 0, +45, +35, +25

/**
 * InteractiveGallery - Scattered overlapping screenshot display with parallax + DRAG
 */
export const InteractiveGallery = memo(function InteractiveGallery({
  images,
  projectName,
  className,
}: InteractiveGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Track current parallax offsets for each image (updated by scroll handler)
  const parallaxOffsetsRef = useRef<number[]>([]);

  const xOffsets = useMemo(
    () => generateXOffsets(images.length, projectName),
    [images.length, projectName]
  );
  const scales = useMemo(
    () => generateScales(images.length, projectName),
    [images.length, projectName]
  );

  // Sequential staggered reveal scroll effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if screenshots section is in view
      // const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
      // setIsBarVisible(isInView); // Removed logic

      if (prefersReducedMotion) return;

      // Overall scroll progress (0 = just entered, 1 = fully scrolled through)
      // Extended runway (0.75) to ensure 4th screenshot is fully visible before unpin
      const totalProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height * 0.75)
      ));

      imagesRef.current.forEach((img, index) => {
        if (!img) return;

        const threshold = REVEAL_THRESHOLDS[index] ?? 0;
        const speed = RISE_SPEEDS[index] ?? 0.5;
        const startOffset = START_OFFSETS[index] ?? 600;
        const xOffset = xOffsets[index] ?? 0;
        const scale = scales[index] ?? 1;

        // Calculate this image's local progress (0 = not started, 1 = done)
        // Each image starts at its threshold and completes by end
        const localProgress = Math.max(0, Math.min(1,
          (totalProgress - threshold) / (1 - threshold)
        ));

        // Opacity: fade in as localProgress goes from 0 to 0.3
        const opacity = Math.min(1, localProgress / 0.3);

        // Vertical position: start below, rise to final stacked position
        // Final position uses decreasing gaps for tighter fan formation
        const finalY = FINAL_GAPS[index] ?? 0;
        const yOffset = startOffset * (1 - localProgress * speed) + finalY;

        // Track current parallax offset for this image (used when drag starts)
        parallaxOffsetsRef.current[index] = yOffset;

        // Apply transform and opacity
        img.style.opacity = String(opacity);
        img.style.transform = `translate(calc(-50% + ${xOffset}%), calc(${yOffset}px)) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [images, xOffsets, scales]);

  const displayImages = images.slice(0, 4);

  // Calculate z-index for each screenshot (simple stacked order)
  const getZIndex = (index: number): number => {
    return index + 1;
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {displayImages.map((image, index) => (
        <div
          key={image}
          ref={(el) => { imagesRef.current[index] = el; }}
          className={styles.screenshot}
          style={{
            zIndex: getZIndex(index),
            top: 0, // Images start at top, positioned via transform
          }}
        >
          <Image
            src={image}
            alt={`${projectName} screenshot ${index + 1}`}
            width={0}
            height={0}
            sizes="50vw"
            className={styles.image}
            style={{ width: '100%', height: 'auto' }}
          />
        </div>
      ))}
    </div>
  );
});
