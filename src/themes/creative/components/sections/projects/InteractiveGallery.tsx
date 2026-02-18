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

// Dynamic constants for spacing calculation
const CONSTANT_VERTICAL_GAP = 35; // Fixed pixel gap between stacked images
const BASE_START_OFFSET = 300;    // Starting pixels below viewport — tight so images appear quickly
const OFFSET_INCREMENT = 250;     // Additional offset per image index (reduced to minimize dead scroll)
const MAX_DISPLAY_IMAGES = 6;     // Cap at 6 images for performance

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

  // Slice images to max limit to prevent excessive DOM nodes
  const displayImages = useMemo(() => images.slice(0, MAX_DISPLAY_IMAGES), [images]);

  // Track current parallax offsets for each image (updated by scroll handler)
  const parallaxOffsetsRef = useRef<number[]>([]);

  const xOffsets = useMemo(
    () => generateXOffsets(displayImages.length, projectName),
    [displayImages.length, projectName]
  );
  const scales = useMemo(
    () => generateScales(displayImages.length, projectName),
    [displayImages.length, projectName]
  );

  // Set gallery container height based on stacked images (mount + resize only).
  useEffect(() => {
    const setHeight = () => {
      if (!containerRef.current) return;
      const vh = window.innerHeight;
      const n = displayImages.length;
      const firstImg = imagesRef.current[0];
      const imgHeight = firstImg?.getBoundingClientRect().height || 320;
      const stackedHeight = (n - 1) * CONSTANT_VERTICAL_GAP + imgHeight;

      // Gallery just needs to fit stacked images plus a bit of breathing room.
      // Animation is driven by a fixed scroll distance (below), not container height.
      const galleryHeight = stackedHeight + vh * 0.15;
      containerRef.current.style.minHeight = `${Math.ceil(galleryHeight)}px`;

      // Set parent slide height to right column content so sticky unpins exactly when content ends.
      const slide = containerRef.current.closest('[class*="projectSlide"]') as HTMLElement;
      if (slide) {
        const rightCol = containerRef.current.closest('[class*="rightColumn"]') as HTMLElement;
        if (rightCol) {
          const rightHeight = rightCol.scrollHeight;
          // Cap excessive height to avoid dead scroll; ensure at least viewport + 200px for sticky
          const minNeeded = vh + 200;
          const capped = Math.max(minNeeded, Math.min(rightHeight, vh * 1.70));
          slide.style.minHeight = `${Math.ceil(capped)}px`;
        }
      }
    };

    const timer = setTimeout(setHeight, 400);
    window.addEventListener('resize', setHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setHeight);
    };
  }, [displayImages.length]);

  // Sequential staggered reveal using fixed scroll distance (1.5 × viewport), decoupled from container height.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (prefersReducedMotion) return;

      const ANIMATION_SCROLL_DISTANCE = windowHeight * 1.5;
      const scrolledInto = windowHeight - rect.top;
      const totalProgress = Math.max(0, Math.min(1, scrolledInto / ANIMATION_SCROLL_DISTANCE));

      imagesRef.current.forEach((img, index) => {
        if (!img) return;

        const n = Math.max(1, displayImages.length - 1);
        const threshold = index * (0.4 / n);
        const speed = 1.0;
        const startOffset = BASE_START_OFFSET + index * OFFSET_INCREMENT;
        const finalY = index * CONSTANT_VERTICAL_GAP;
        const localProgress = Math.max(0, Math.min(1, (totalProgress - threshold) / Math.max(0.01, 1 - threshold)));

        const opacity = Math.min(1, localProgress / 0.12);
        const yOffset = startOffset * (1 - localProgress * speed) + finalY;

        img.style.opacity = String(opacity);
        const xOffset = xOffsets[index] ?? 0;
        const scale = scales[index] ?? 1;
        img.style.transform = `translate(calc(-50% + ${xOffset}%), calc(${yOffset}px)) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayImages, xOffsets, scales]);


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
