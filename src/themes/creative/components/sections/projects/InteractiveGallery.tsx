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
const BASE_START_OFFSET = 200;    // Starting pixels below viewport (reduced from 600 for earlier appearance)
const OFFSET_INCREMENT = 150;     // Additional offset per image index
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

  // Sequential staggered reveal scroll effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (prefersReducedMotion) return;

      // Overall scroll progress (0 = just entered, 1 = fully scrolled through)
      const totalProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height * 0.75)
      ));

      imagesRef.current.forEach((img, index) => {
        if (!img) return;

        // Dynamic Calculation Logic
        // 1. Threshold: Distribute 0 to 0.6 range across all images
        // This ensures the last image starts animating before the section ends
        const threshold = index * (0.6 / Math.max(1, displayImages.length - 1));

        // 2. Speed: Slightly faster for later images to catch up? 
        // Actually, uniform speed or slight deceleration works best for stacking.
        // Let's use a gentle gradient from 1.0 down to 0.6
        const speed = 1.0 - (index * (0.4 / Math.max(1, displayImages.length - 1)));

        // 3. Start Offset: Increase starting distance for later images
        const startOffset = BASE_START_OFFSET + (index * OFFSET_INCREMENT);

        // 4. Final Position: Consistent gap (e.g., 0, 35, 70, 105...)
        const finalY = index * CONSTANT_VERTICAL_GAP;

        // Calculate this image's local progress
        const localProgress = Math.max(0, Math.min(1,
          (totalProgress - threshold) / (1 - threshold)
        ));

        // Opacity: fade in as localProgress goes from 0 to 0.15 (reduced from 0.3 for earlier appearance)
        const opacity = Math.min(1, localProgress / 0.15);

        // Calculate current Y position
        const yOffset = startOffset * (1 - localProgress * speed) + finalY;

        // Apply transform
        img.style.opacity = String(opacity);
        // Use fixed xOffsets array we generated earlier
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
