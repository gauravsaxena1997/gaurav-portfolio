'use client';

import { memo, useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import styles from './ProjectCarousel.module.css';

interface ProjectCarouselProps {
  images: string[];
  projectName: string;
  className?: string;
}

/**
 * ProjectCarousel - Horizontal swipe carousel for mobile devices
 * Used instead of 3D stack animation which is hard to see on small screens
 */
export const ProjectCarousel = memo(function ProjectCarousel({
  images,
  projectName,
  className,
}: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Only show first 4 screenshots
  const displayImages = images.slice(0, 4);

  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;

    const scrollLeft = carouselRef.current.scrollLeft;
    const itemWidth = carouselRef.current.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);

    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < displayImages.length) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, displayImages.length]);

  const scrollToIndex = useCallback((index: number) => {
    if (!carouselRef.current) return;

    const itemWidth = carouselRef.current.offsetWidth;
    carouselRef.current.scrollTo({
      left: itemWidth * index,
      behavior: 'smooth',
    });
  }, []);

  return (
    <div className={`${styles.container} ${className || ''}`}>
      {/* Scrollable carousel */}
      <div ref={carouselRef} className={styles.carousel} onScroll={handleScroll}>
        {displayImages.map((image, index) => (
          <div key={image} className={styles.slide}>
            <div className={styles.imageWrapper}>
              <Image
                src={image}
                alt={`${projectName} screenshot ${index + 1}`}
                fill
                sizes="90vw"
                className={styles.image}
                priority={index < 2}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className={styles.dots}>
        {displayImages.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === activeIndex ? styles.active : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to screenshot ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
});
