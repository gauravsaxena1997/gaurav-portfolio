'use client';

import { memo, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import styles from './InteractiveGallery.module.css';

interface InteractiveGalleryProps {
  images: string[];
  projectName: string;
  className?: string;
}

// Deterministic left / right / center stagger pattern:
// index 0 → left  (-18%)
// index 1 → right (+18%)
// index 2 → center(0%)
// index 3 → left  (-12%)
// index 4 → right (+12%)
// Center all gallery constants for easy adjustment
const GALLERY_CONFIG = {
  VERTICAL_GAP: 80,          // Reduced gap for slightly smaller images
  BASE_START_OFFSET: 280,
  OFFSET_INCREMENT: 360,
  MAX_DISPLAY_IMAGES: 5,
  STAGGER_OFFSETS: [-16, 16, 0, -10, 10], // Base horizontal offsets (percent)
  PORTRAIT_SPREAD: 25,       // Wider horizontal spread for portrait images
  SCALES: [1.02, 0.98, 1.0, 1.01, 0.99],
};

function getXOffset(index: number, isPortrait: boolean): number {
  // Logic: For portrait images (usually index 3, 4+), use wider horizontal spread
  if (isPortrait) {
    return (index % 2 === 0) ? GALLERY_CONFIG.PORTRAIT_SPREAD : -GALLERY_CONFIG.PORTRAIT_SPREAD;
  }
  return GALLERY_CONFIG.STAGGER_OFFSETS[index % GALLERY_CONFIG.STAGGER_OFFSETS.length];
}

function getScale(index: number): number {
  return GALLERY_CONFIG.SCALES[index % GALLERY_CONFIG.SCALES.length];
}

/**
 * InteractiveGallery - Staggered left/right/center screenshot reveal with parallax
 * Images appear on scroll in a L → R → C pattern for clear visual rhythm.
 */
export const InteractiveGallery = memo(function InteractiveGallery({
  images,
  projectName,
  className,
}: InteractiveGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  // Slice images to max limit to prevent excessive DOM nodes
  const displayImages = useMemo(() => images.slice(0, GALLERY_CONFIG.MAX_DISPLAY_IMAGES), [images]);

  // Set gallery container height based on stacked images (mount + resize only).
  useEffect(() => {
    const setHeight = () => {
      if (!containerRef.current) return;
      const vh = window.innerHeight;
      const n = displayImages.length;
      const firstImg = imagesRef.current[0];
      const imgHeight = firstImg?.getBoundingClientRect().height || 320;
      const stackedHeight = (n - 1) * GALLERY_CONFIG.VERTICAL_GAP + imgHeight;

      // Gallery just needs to fit stacked images plus a bit of breathing room.
      const galleryHeight = stackedHeight + vh * 0.45;
      containerRef.current.style.minHeight = `${Math.ceil(galleryHeight)}px`;

      // Set parent slide height to right column content so sticky unpins exactly when content ends.
      const slide = containerRef.current.closest('[class*="projectSlide"]') as HTMLElement;
      if (slide) {
        const rightCol = containerRef.current.closest('[class*="rightColumn"]') as HTMLElement;
        if (rightCol) {
          const rightHeight = rightCol.scrollHeight;
          const minNeeded = vh + 200;
          const capped = Math.max(minNeeded, Math.min(rightHeight, vh * 1.80));
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

  // Sequential staggered reveal — L → R → C pattern becomes visible on scroll.
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
        const startOffset = GALLERY_CONFIG.BASE_START_OFFSET + index * GALLERY_CONFIG.OFFSET_INCREMENT;
        const finalY = index * GALLERY_CONFIG.VERTICAL_GAP;
        const localProgress = Math.max(0, Math.min(1, (totalProgress - threshold) / Math.max(0.01, 1 - threshold)));

        const opacity = Math.min(1, localProgress / 0.12);
        const yOffset = startOffset * (1 - localProgress * speed) + finalY;

        img.style.opacity = String(opacity);
        const isPortrait = displayImages[index]?.toLowerCase().includes('mobile') || displayImages[index]?.toLowerCase().includes('portrait');
        const xOffset = getXOffset(index, isPortrait);
        const scale = getScale(index);
        img.style.transform = `translate(calc(-50% + ${xOffset}%), calc(${yOffset}px)) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [displayImages]);


  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {displayImages.map((image, index) => {
        const isPortrait = image.toLowerCase().includes('mobile') || image.toLowerCase().includes('portrait');
        const imgWidth = isPortrait ? 550 : 1600; // Increased width for better resolution/size
        const imgHeight = isPortrait ? 1000 : 900; // Increased height limit

        return (
          <div
            key={image}
            ref={(el) => { imagesRef.current[index] = el; }}
            className={`${styles.screenshot} ${isPortrait ? styles.portrait : ''}`}
            style={{
              zIndex: index + 1,
              top: 0,
            }}
          >
            <Image
              src={image}
              alt={`${projectName} screenshot ${index + 1}`}
              width={imgWidth}
              height={imgHeight}
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.image}
              style={{ width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '72vh' }}
              priority={index === 0}
              loading={index <= 1 ? 'eager' : 'lazy'}
              placeholder="blur"
              blurDataURL="data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAADQAQCdASoIAAUAAUAmJYgCdAEO/gHOAAD++P/////////////////////8"
            />
          </div>
        );
      })}
    </div>
  );
});

