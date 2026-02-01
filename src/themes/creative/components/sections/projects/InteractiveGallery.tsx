'use client';

import { memo, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { RotateCcw, Move } from 'lucide-react';
import styles from './InteractiveGallery.module.css';

interface InteractiveGalleryProps {
  images: string[];
  projectName: string;
  className?: string;
}

interface DragPosition {
  x: number;
  y: number;
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

  // Drag state
  const [dragPositions, setDragPositions] = useState<Record<number, DragPosition>>({});
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);
  // Track z-index order: last dragged stays on top
  const [zIndexOrder, setZIndexOrder] = useState<number[]>([]);
  // Track if screenshots are in view for the fixed bar
  const [isBarVisible, setIsBarVisible] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialX: number; initialY: number } | null>(null);
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

  // Reset all positions and z-index order
  const handleReset = useCallback(() => {
    setDragPositions({});
    setZIndexOrder([]);
    setHasInteracted(false);
  }, []);

  // Handle drag start
  const handleMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setHasInteracted(true);
    // Capture current parallax offset so image doesn't jump when drag starts
    const currentParallaxY = parallaxOffsetsRef.current[index] ?? 0;
    const currentPos = dragPositions[index] || { x: 0, y: 0 };
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y + currentParallaxY,  // Include parallax offset
    };
    setDraggingIndex(index);
  }, [dragPositions]);

  // Handle drag move and end
  useEffect(() => {
    if (draggingIndex === null) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartRef.current) return;

      const deltaX = e.clientX - dragStartRef.current.x;
      const deltaY = e.clientY - dragStartRef.current.y;

      const newPos = {
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY,
      };

      setDragPositions(prev => ({
        ...prev,
        [draggingIndex]: newPos,
      }));

      // REAL-TIME update during drag (no transition delay)
      const img = imagesRef.current[draggingIndex];
      if (img) {
        const xOffset = xOffsets[draggingIndex] ?? 0;
        const scale = scales[draggingIndex] ?? 1;
        img.style.transition = 'none';
        img.style.transform = `translate(calc(-50% + ${xOffset}% + ${newPos.x}px), calc(${newPos.y}px)) scale(${scale})`;
      }
    };

    const handleMouseUp = () => {
      const img = imagesRef.current[draggingIndex];
      if (img) {
        // Subtle release effect - very quick transition for a slight "settle" feel
        img.style.transition = 'transform 50ms ease-out';
        // Clear transition after it completes to let parallax take over smoothly
        setTimeout(() => {
          if (img) img.style.transition = '';
        }, 60);
      }

      // Adjust drag position to account for parallax offset
      // When parallax resumes, it will add yOffset, so we subtract it now
      // to keep the image at the same visual position
      const currentParallaxY = parallaxOffsetsRef.current[draggingIndex] ?? 0;
      setDragPositions(prev => {
        const currentPos = prev[draggingIndex] || { x: 0, y: 0 };
        return {
          ...prev,
          [draggingIndex]: {
            x: currentPos.x,
            y: currentPos.y - currentParallaxY,
          },
        };
      });

      setZIndexOrder(prev => {
        const newOrder = prev.filter(i => i !== draggingIndex);
        newOrder.push(draggingIndex);
        return newOrder;
      });
      setDraggingIndex(null);
      dragStartRef.current = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingIndex, xOffsets, scales]);

  // Touch support for mobile
  const handleTouchStart = useCallback((index: number, e: React.TouchEvent) => {
    setHasInteracted(true);
    const touch = e.touches[0];
    // Capture current parallax offset so image doesn't jump when drag starts
    const currentParallaxY = parallaxOffsetsRef.current[index] ?? 0;
    const currentPos = dragPositions[index] || { x: 0, y: 0 };
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y + currentParallaxY,  // Include parallax offset
    };
    setDraggingIndex(index);
  }, [dragPositions]);

  useEffect(() => {
    if (draggingIndex === null) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (!dragStartRef.current) return;
      e.preventDefault();
      const touch = e.touches[0];

      const deltaX = touch.clientX - dragStartRef.current.x;
      const deltaY = touch.clientY - dragStartRef.current.y;

      const newPos = {
        x: dragStartRef.current.initialX + deltaX,
        y: dragStartRef.current.initialY + deltaY,
      };

      setDragPositions(prev => ({
        ...prev,
        [draggingIndex]: newPos,
      }));

      const img = imagesRef.current[draggingIndex];
      if (img) {
        const xOffset = xOffsets[draggingIndex] ?? 0;
        const scale = scales[draggingIndex] ?? 1;
        img.style.transition = 'none';
        img.style.transform = `translate(calc(-50% + ${xOffset}% + ${newPos.x}px), calc(${newPos.y}px)) scale(${scale})`;
      }
    };

    const handleTouchEnd = () => {
      const img = imagesRef.current[draggingIndex];
      if (img) {
        // Subtle release effect - very quick transition for a slight "settle" feel
        img.style.transition = 'transform 50ms ease-out';
        // Clear transition after it completes to let parallax take over smoothly
        setTimeout(() => {
          if (img) img.style.transition = '';
        }, 60);
      }

      // Adjust drag position to account for parallax offset
      // When parallax resumes, it will add yOffset, so we subtract it now
      // to keep the image at the same visual position
      const currentParallaxY = parallaxOffsetsRef.current[draggingIndex] ?? 0;
      setDragPositions(prev => {
        const currentPos = prev[draggingIndex] || { x: 0, y: 0 };
        return {
          ...prev,
          [draggingIndex]: {
            x: currentPos.x,
            y: currentPos.y - currentParallaxY,
          },
        };
      });

      setZIndexOrder(prev => {
        const newOrder = prev.filter(i => i !== draggingIndex);
        newOrder.push(draggingIndex);
        return newOrder;
      });
      setDraggingIndex(null);
      dragStartRef.current = null;
    };

    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [draggingIndex, xOffsets, scales]);

  // Sequential staggered reveal scroll effect
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if screenshots section is in view
      const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
      setIsBarVisible(isInView);

      if (prefersReducedMotion) return;

      // Overall scroll progress (0 = just entered, 1 = fully scrolled through)
      // Extended runway (0.75) to ensure 4th screenshot is fully visible before unpin
      const totalProgress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height * 0.75)
      ));

      imagesRef.current.forEach((img, index) => {
        if (!img || draggingIndex === index) return;

        const threshold = REVEAL_THRESHOLDS[index] ?? 0;
        const speed = RISE_SPEEDS[index] ?? 0.5;
        const startOffset = START_OFFSETS[index] ?? 600;
        const xOffset = xOffsets[index] ?? 0;
        const scale = scales[index] ?? 1;
        const dragPos = dragPositions[index] || { x: 0, y: 0 };

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
        img.style.transform = `translate(calc(-50% + ${xOffset}% + ${dragPos.x}px), calc(${yOffset}px + ${dragPos.y}px)) scale(${scale})`;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [images, xOffsets, scales, dragPositions, draggingIndex]);

  const displayImages = images.slice(0, 4);
  const hasDraggedAny = Object.keys(dragPositions).length > 0;

  // Calculate z-index for each screenshot
  const getZIndex = (index: number): number => {
    if (draggingIndex === index) return 100;
    const orderIndex = zIndexOrder.indexOf(index);
    if (orderIndex === -1) return index + 1;
    return 10 + orderIndex;
  };

  return (
    <div ref={containerRef} className={`${styles.container} ${className || ''}`}>
      {displayImages.map((image, index) => (
        <div
          key={image}
          ref={(el) => { imagesRef.current[index] = el; }}
          className={`${styles.screenshot} ${draggingIndex === index ? styles.dragging : ''}`}
          style={{
            zIndex: getZIndex(index),
            top: 0, // Images start at top, positioned via transform
          }}
          onMouseDown={(e) => handleMouseDown(index, e)}
          onTouchStart={(e) => handleTouchStart(index, e)}
        >
          <Image
            src={image}
            alt={`${projectName} screenshot ${index + 1}`}
            width={0}
            height={0}
            sizes="50vw"
            className={styles.image}
            style={{ width: '100%', height: 'auto' }}
            draggable={false}
          />
        </div>
      ))}

      {/* Fixed interaction bar - fades in/out based on screenshot visibility */}
      <div className={`${styles.interactionBar} ${isBarVisible ? styles.barVisible : ''}`}>
        <div className={styles.hintContent}>
          <Move size={18} className={styles.hintIcon} />
          <span className={styles.hintText}>
            {hasInteracted
              ? 'Nice! Keep dragging to rearrange'
              : 'Drag screenshots to move them around'}
          </span>
        </div>
        {hasDraggedAny && (
          <button
            className={styles.resetButton}
            onClick={handleReset}
            aria-label="Reset positions"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
});
