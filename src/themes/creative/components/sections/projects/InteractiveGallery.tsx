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
  // Drives BOTH container height AND scroll handler progress (single source of truth).
  // Container must be at least (ANIMATION_SCROLL_DISTANCE_VH + SETTLE_BUFFER_VH) × vh tall
  // so the sticky image stack stays in viewport until both stickies (left text + right images)
  // release together when the container bottom exits the viewport.
  ANIMATION_SCROLL_DISTANCE_VH: 1.5, // page scroll (in vh) for stack to fully dock
  SETTLE_BUFFER_VH: 0.1,             // 10% vh settle before both sides scroll away
  // Must match --project-sticky-offset in ProjectSection.module.css
  STICKY_OFFSET_PX: 72,
};

function getXOffset(index: number, isPortrait: boolean): number {
  if (isPortrait) {
    return (index % 2 === 0) ? GALLERY_CONFIG.PORTRAIT_SPREAD : -GALLERY_CONFIG.PORTRAIT_SPREAD;
  }
  return GALLERY_CONFIG.STAGGER_OFFSETS[index % GALLERY_CONFIG.STAGGER_OFFSETS.length];
}

function getScale(index: number): number {
  return GALLERY_CONFIG.SCALES[index % GALLERY_CONFIG.SCALES.length];
}

/**
 * InteractiveGallery — Staggered screenshot reveal driven by scroll.
 *
 * Layout strategy (solves "dead scroll" on right):
 *   The outer container (.container) is in normal flow and scrolls with the page.
 *   Animation progress is read from container.getBoundingClientRect().top so it
 *   still advances as the user scrolls.
 *
 *   Inside the container, a sticky inner wrapper (.stickyStack) is pinned at
 *   top: STICKY_OFFSET_PX — the same offset as the left sticky text column.
 *   Screenshots are positioned absolute inside the sticky wrapper.
 *
 *   This means:
 *   - Animation drives screenshot positions (via JS transform) ✓
 *   - Screenshots stay visible in the viewport throughout the scroll window ✓
 *   - Sticky wrapper releases exactly when the container bottom exits viewport ✓
 *   - Container height = (AnimDist + buffer) × vh so both stickies (left text
 *     and right images) release at the same moment → whole project exits together ✓
 *   - No dead right column after stack settles.
 */
export const InteractiveGallery = memo(function InteractiveGallery({
  images,
  projectName,
  className,
}: InteractiveGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const displayImages = useMemo(() => images.slice(0, GALLERY_CONFIG.MAX_DISPLAY_IMAGES), [images]);

  // Set container height so the sticky image stack stays visible for the full
  // animation + settle window, then both stickies release simultaneously.
  useEffect(() => {
    const setHeight = () => {
      if (!containerRef.current) return;
      const vh = window.innerHeight;

      // Container must be at least (AnimDist + buffer) × vh so its bottom doesn't
      // exit the viewport before animation ends.  The sticky wrapper inside will
      // release exactly when container.bottom crosses viewport top, which happens
      // at Y = S + containerHeight.  Left sticky releases at Y = S + containerHeight - vh.
      // With containerHeight = (1.5 + 0.1) × vh both releases coincide within 0.1 vh.
      const required =
        vh * (GALLERY_CONFIG.ANIMATION_SCROLL_DISTANCE_VH + GALLERY_CONFIG.SETTLE_BUFFER_VH);

      containerRef.current.style.minHeight = `${Math.ceil(required)}px`;
      containerRef.current.style.height    = `${Math.ceil(required)}px`;
    };

    const timer = setTimeout(setHeight, 100);
    window.addEventListener('resize', setHeight);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', setHeight);
    };
  }, [displayImages.length]);

  // Sequential staggered reveal — L → R → C pattern becomes visible on scroll.
  // Progress is driven by the OUTER container's rect.top (normal-flow), NOT the
  // sticky wrapper, so it still advances as the user scrolls.
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (prefersReducedMotion) return;

      const ANIMATION_SCROLL_DISTANCE = windowHeight * GALLERY_CONFIG.ANIMATION_SCROLL_DISTANCE_VH;
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
      {/*
        Sticky inner wrapper — pins screenshots at the same top offset as the left
        sticky text column.  Screenshots are absolute inside this wrapper so they
        stay in the viewport as the outer container (in normal flow) scrolls beneath.
        When the container bottom exits the viewport the wrapper un-sticks and the
        images scroll away together with the left text.
      */}
      <div className={styles.stickyStack}>
        {displayImages.map((image, index) => {
          const isPortrait = image.toLowerCase().includes('mobile') || image.toLowerCase().includes('portrait');
          const imgWidth  = isPortrait ? 550  : 1600;
          const imgHeight = isPortrait ? 1000 : 900;

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
    </div>
  );
});
