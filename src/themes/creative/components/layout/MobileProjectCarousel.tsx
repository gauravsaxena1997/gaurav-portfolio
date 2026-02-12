'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Maximize2 } from 'lucide-react';
import styles from './MobileProjectCarousel.module.css';

interface MobileProjectCarouselProps {
    videoSrc?: string;
    images?: string[];
    projectName: string;
    onExpand: () => void;
}

/**
 * Mobile-optimized project carousel with tablet frame
 * - First slide: Video (if available)
 * - Subsequent slides: Images
 * - Navigation: Swipe gestures + Dots
 * - Expand button: Opens UnifiedProjectViewer
 * - Dynamic height based on content aspect ratio
 */
export function MobileProjectCarousel({
    videoSrc,
    images = [],
    projectName,
    onExpand,
}: MobileProjectCarouselProps) {
    const hasVideo = !!videoSrc;
    const totalSlides = (hasVideo ? 1 : 0) + images.length;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Reset to first slide when project changes
    useEffect(() => {
        setCurrentIndex(0);
    }, [projectName]);

    const goToNext = () => {
        setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    };

    const goToPrev = () => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
    };

    // Swipe gesture handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        }
        if (isRightSwipe) {
            goToPrev();
        }

        // Reset
        setTouchStart(0);
        setTouchEnd(0);
    };

    const isVideoSlide = hasVideo && currentIndex === 0;
    const imageIndex = hasVideo ? currentIndex - 1 : currentIndex;

    // If no media, show placeholder
    if (totalSlides === 0) {
        return (
            <div className={styles.tabletWrapper}>
                <div className={styles.tabletBezel}>
                    <div className={styles.screenArea}>
                        <div className={styles.noMedia}>No media available</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.tabletWrapper}>
            {/* Tablet Frame */}
            <div
                className={styles.tabletBezel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Camera Notch (renamed class in CSS, keeping markup compatible) */}
                <div className={styles.topBezel}>
                    <div className={styles.camera} />
                </div>

                {/* Screen area */}
                <div className={styles.screenArea}>
                    {isVideoSlide ? (
                        <video
                            ref={videoRef}
                            className={styles.mediaContent}
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    ) : (
                        <Image
                            src={images[imageIndex]}
                            alt={`${projectName} - Image ${imageIndex + 1}`}
                            fill
                            className={styles.mediaContent}
                            style={{ objectFit: 'contain' }}
                            sizes="(max-width: 768px) 90vw, 50vw"
                        />
                    )}

                    {/* Expand Button (Using new bottom-right CSS) */}
                    <button
                        className={styles.expandButton}
                        onClick={onExpand}
                        aria-label="View fullscreen"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
                {/* Dots Indicator (Inside frame, bottom centered) */}
                {totalSlides > 1 && (
                    <div className={styles.dotsContainer}>
                        {Array.from({ length: totalSlides }).map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.dot} ${index === currentIndex ? styles.dotActive : ''}`}
                                onClick={() => goToSlide(index)}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
