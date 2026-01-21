'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Maximize2, Play, Pause } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function VideoPlayer({
  src,
  poster,
  autoPlay = true,
  loop = true,
  className,
  style,
}: VideoPlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fullscreenVideoRef = useRef<HTMLVideoElement>(null);

  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
    // Sync time from inline video to fullscreen video
    if (videoRef.current && fullscreenVideoRef.current) {
      fullscreenVideoRef.current.currentTime = videoRef.current.currentTime;
    }
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
    // Sync time back
    if (fullscreenVideoRef.current && videoRef.current) {
      videoRef.current.currentTime = fullscreenVideoRef.current.currentTime;
    }
  }, []);

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

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
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
    },
    [isFullscreen, closeFullscreen]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const togglePlayPause = useCallback(() => {
    const video = isFullscreen ? fullscreenVideoRef.current : videoRef.current;
    if (video) {
      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [isFullscreen]);

  return (
    <>
      {/* Inline video player */}
      <div style={{ position: 'relative', ...style }} className={className}>
        <video
          ref={videoRef}
          autoPlay={autoPlay}
          muted
          loop={loop}
          playsInline
          poster={poster}
          style={styles.inlineVideo}
          onEnded={(e) => {
            if (loop) {
              e.currentTarget.currentTime = 0;
              e.currentTarget.play();
            }
          }}
        >
          <source src={src} type="video/mp4" />
        </video>

        {/* Fullscreen button overlay */}
        <button
          style={styles.fullscreenButton}
          onClick={openFullscreen}
          aria-label="View fullscreen"
        >
          <Maximize2 size={20} />
        </button>
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div style={styles.overlay} onClick={closeFullscreen}>
          <div style={styles.content} onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button style={styles.closeButton} onClick={closeFullscreen} aria-label="Close">
              <X size={24} />
            </button>

            {/* Video container */}
            <div style={styles.videoContainer}>
              <video
                ref={fullscreenVideoRef}
                autoPlay
                muted
                loop={loop}
                playsInline
                poster={poster}
                style={styles.fullscreenVideo}
                onClick={togglePlayPause}
                onEnded={(e) => {
                  if (loop) {
                    e.currentTarget.currentTime = 0;
                    e.currentTarget.play();
                  }
                }}
              >
                <source src={src} type="video/mp4" />
              </video>

              {/* Play/Pause overlay */}
              <button
                style={styles.playPauseButton}
                onClick={togglePlayPause}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={48} /> : <Play size={48} />}
              </button>
            </div>

            {/* Instructions */}
            <div style={styles.instructions}>
              Press <kbd style={styles.kbd}>Space</kbd> to play/pause &bull; <kbd style={styles.kbd}>Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Inline styles for theme-agnostic design
const styles: Record<string, React.CSSProperties> = {
  inlineVideo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    background: 'rgba(0, 0, 0, 0.7)',
    border: 'none',
    borderRadius: 6,
    padding: 8,
    cursor: 'pointer',
    color: 'white',
    zIndex: 10,
    transition: 'background 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: 8,
    padding: 8,
    cursor: 'pointer',
    color: 'white',
    zIndex: 10,
    transition: 'background 0.2s',
  },
  videoContainer: {
    position: 'relative',
    width: '90vw',
    height: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullscreenVideo: {
    maxWidth: '100%',
    maxHeight: '100%',
    width: 'auto',
    height: 'auto',
    objectFit: 'contain',
    cursor: 'pointer',
  },
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.5)',
    border: 'none',
    borderRadius: '50%',
    padding: 20,
    cursor: 'pointer',
    color: 'white',
    opacity: 0,
    transition: 'opacity 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructions: {
    position: 'absolute',
    bottom: 24,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  kbd: {
    display: 'inline-block',
    padding: '2px 6px',
    fontSize: 11,
    fontFamily: 'system-ui, -apple-system, sans-serif',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    marginLeft: 4,
    marginRight: 4,
  },
};
