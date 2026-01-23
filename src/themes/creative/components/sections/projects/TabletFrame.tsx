'use client';

import { memo, useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './TabletFrame.module.css';

interface TabletFrameProps {
  videoSrc?: string;
  imageSrc?: string;
  alt: string;
  className?: string;
}

/**
 * TabletFrame - Displays video/image in a subtle tablet device frame
 * - Maintains original aspect ratio (no stretching)
 * - Gaps filled with theme-aware background color
 * - Auto-plays video when in viewport (muted, loop)
 */
export const TabletFrame = memo(function TabletFrame({
  videoSrc,
  imageSrc,
  alt,
  className,
}: TabletFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // Intersection Observer for lazy video playback
  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsInView(entry.isIntersecting);
          if (video) {
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Autoplay might be blocked, that's okay
              });
            } else {
              video.pause();
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`${styles.tabletFrame} ${className || ''}`}>
      {/* Tablet bezel frame */}
      <div className={styles.frameBezel}>
        {/* Camera notch at top */}
        <div className={styles.cameraNotch}>
          <div className={styles.camera} />
        </div>

        {/* Screen area - background color fills gaps */}
        <div className={styles.screenArea}>
          {videoSrc ? (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              preload="metadata"
              className={styles.media}
              aria-label={alt}
            />
          ) : imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              className={styles.media}
              priority={false}
            />
          ) : (
            <div className={styles.placeholder}>
              <span>No media available</span>
            </div>
          )}
        </div>

        {/* Bottom bezel (home indicator area) */}
        <div className={styles.bottomBezel}>
          <div className={styles.homeIndicator} />
        </div>
      </div>
    </div>
  );
});
