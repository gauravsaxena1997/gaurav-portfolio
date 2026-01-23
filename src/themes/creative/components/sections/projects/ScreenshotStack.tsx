'use client';

import { memo, useRef, useEffect, useMemo, useState, useCallback } from 'react';
import Image from 'next/image';
import { RotateCcw, Move } from 'lucide-react';
import styles from './ScreenshotStack.module.css';

interface ScreenshotStackProps {
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

// Parallax speeds - REVERSED: First moves FASTEST to reveal ones behind
const PARALLAX_SPEEDS = [1.0, 0.7, 0.45, 0.25];

// Base vertical positions (pixels from top)
const BASE_POSITIONS = [0, 200, 400, 600];

/**
 * ScreenshotStack - Scattered overlapping screenshot display with parallax + DRAG
 */
export const ScreenshotStack = memo(function ScreenshotStack({
  images,
  projectName,
  className,
}: ScreenshotStackProps) {
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
    const currentPos = dragPositions[index] || { x: 0, y: 0 };
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
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
        img.style.transition = '';
      }
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
    const currentPos = dragPositions[index] || { x: 0, y: 0 };
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialX: currentPos.x,
      initialY: currentPos.y,
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
        img.style.transition = '';
      }
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

  // Parallax scroll effect + bar visibility tracking
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Check if screenshots section is in view
      // Bar visible when: container top is above 80% of viewport AND container bottom is below 20% of viewport
      const isInView = rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
      setIsBarVisible(isInView);

      if (prefersReducedMotion) return;

      const progress = Math.max(0, Math.min(1,
        (windowHeight - rect.top) / (windowHeight + rect.height * 0.5)
      ));

      imagesRef.current.forEach((img, index) => {
        if (!img || draggingIndex === index) return;

        const speed = PARALLAX_SPEEDS[index] ?? 0.25;
        const xOffset = xOffsets[index] ?? 0;
        const scale = scales[index] ?? 1;
        const dragPos = dragPositions[index] || { x: 0, y: 0 };

        const yOffset = (1 - progress) * speed * 300;

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
            top: `${BASE_POSITIONS[index] ?? index * 200}px`,
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
