'use client';

import { memo, useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import Image from 'next/image';
import { Maximize2, X, Play, Pause } from 'lucide-react';
import styles from './TabletFrame.module.css';

interface TabletFrameProps {
  videoSrc?: string;
  imageSrc?: string;
  alt: string;
  className?: string;
  onExpand?: () => void;
}

/**
 * TabletFrame - Displays video/image in a subtle tablet device frame
 * - Maintains original aspect ratio (no stretching)
 * - Gaps filled with theme-aware background color
 * - Auto-plays video when in viewport (muted, loop)
 * - Fullscreen button for expanded video view
 */
export interface TabletFrameHandle {
  openFullscreen: () => void;
}

export const TabletFrame = memo(forwardRef<TabletFrameHandle, TabletFrameProps>(function TabletFrame({
  videoSrc,
  imageSrc,
  alt,
  className,
  onExpand,
}, ref) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const handleTimeUpdate = useCallback(() => {
    if (fullscreenVideoRef.current) {
      const { currentTime, duration } = fullscreenVideoRef.current;
      if (duration) {
        setProgress((currentTime / duration) * 100);
      }
    }
  }, []);

  // Expose fullscreen control to parent
  useImperativeHandle(ref, () => ({
    openFullscreen: () => {
      openFullscreen();
    }
  }));

  // ... (intersection observer stays) ...

  // Handle fullscreen open
  const openFullscreen = useCallback(() => {
    if (onExpand) {
      onExpand();
      return;
    }
    setIsFullscreen(true);
    // Sync time from inline video to fullscreen video
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      setTimeout(() => {
        if (fullscreenVideoRef.current) {
          fullscreenVideoRef.current.currentTime = currentTime;
          fullscreenVideoRef.current.play().catch(() => { });
        }
      }, 100);
    }
  }, [onExpand]);

  // Handle fullscreen close
  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    // Sync time back
    if (fullscreenVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = fullscreenVideoRef.current.currentTime;
    }
  }, []);

  // Body overflow control
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);


  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === ' ') {
        e.preventDefault();
        if (fullscreenVideoRef.current) {
          if (fullscreenVideoRef.current.paused) {
            fullscreenVideoRef.current.play();
            setIsPlaying(true);
          } else {
            fullscreenVideoRef.current.pause();
            setIsPlaying(false);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, closeFullscreen]);

  // Toggle play/pause
  const togglePlayPause = useCallback(() => {
    if (fullscreenVideoRef.current) {
      if (fullscreenVideoRef.current.paused) {
        fullscreenVideoRef.current.play();
        setIsPlaying(true);
      } else {
        fullscreenVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  return (
    <>
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
              <>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  className={styles.media}
                  aria-label={alt}
                >
                  <track kind="captions" src="/captions/en.vtt" label="English" default />
                </video>
                {/* Fullscreen button */}
                <button
                  className={styles.fullscreenButton}
                  onClick={openFullscreen}
                  aria-label="View fullscreen"
                >
                  <Maximize2 size={18} />
                </button>
              </>
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

      {/* Fullscreen Overlay */}
      {isFullscreen && videoSrc && (
        <div className={styles.fullscreenOverlay} onClick={closeFullscreen}>
          <div className={styles.fullscreenContent} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              className={styles.closeButton}
              onClick={closeFullscreen}
              aria-label="Close fullscreen"
            >
              <X size={24} />
            </button>

            {/* Video container */}
            <div className={styles.videoContainer}>
              <video
                ref={fullscreenVideoRef}
                src={videoSrc}
                autoPlay
                muted
                loop
                playsInline
                onTimeUpdate={handleTimeUpdate}
                className={styles.fullscreenVideo}
                onClick={togglePlayPause}
              />
              <track kind="captions" src="/captions/en.vtt" label="English" default />

              {/* Play/Pause overlay button */}
              <button
                className={styles.playPauseButton}
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={48} /> : <Play size={48} />}
              </button>

              {/* Progress Bar */}
              <div className={styles.progressBarContainer}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Instructions */}
            <div className={styles.instructions}>
              Press <kbd>Space</kbd> to play/pause &bull; <kbd>Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}));
