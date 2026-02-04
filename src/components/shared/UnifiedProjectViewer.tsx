'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

interface UnifiedProjectViewerProps {
    isOpen: boolean;
    onClose: () => void;
    videoSrc?: string;
    images?: string[];
    initialIndex?: number; // 0 = Video, 1+ = Images
    alt?: string;
    title?: string;
    liveUrl?: string;
}

export function UnifiedProjectViewer({
    isOpen,
    onClose,
    videoSrc,
    images = [],
    initialIndex = 0,
    alt = 'Project Media',
    title,
    liveUrl,
}: UnifiedProjectViewerProps) {
    // Total slides = (1 if video exists) + images.length
    const hasVideo = !!videoSrc;
    const totalSlides = (hasVideo ? 1 : 0) + images.length;

    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Video State
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null); // Direct DOM Ref
    const requestRef = useRef<number>();
    const [isPlaying, setIsPlaying] = useState(true);

    // Reset index when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
            setIsPlaying(true);
            // Reset progress bar width directly
            if (progressBarRef.current) {
                progressBarRef.current.style.width = '0%';
            }
        }
    }, [isOpen, initialIndex]);

    // Lock Body Scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Smooth Progress Bar Animation Loop
    const animateProgress = useCallback(() => {
        if (videoRef.current && progressBarRef.current) {
            const { currentTime, duration } = videoRef.current;
            if (duration) {
                const percent = (currentTime / duration) * 100;
                // Direct DOM update for 60fps smoothness without re-renders
                progressBarRef.current.style.width = `${percent}%`;
            }
        }
        requestRef.current = requestAnimationFrame(animateProgress);
    }, []);

    // Manage Animation Loop
    useEffect(() => {
        const isVideoSlide = hasVideo && currentIndex === 0;

        if (isPlaying && isVideoSlide) {
            requestRef.current = requestAnimationFrame(animateProgress);
        } else {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        }

        return () => {
            if (requestRef.current) {
                cancelAnimationFrame(requestRef.current);
            }
        };
    }, [isPlaying, hasVideo, currentIndex, animateProgress]);

    // Navigation Logic
    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    }, [totalSlides]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
    }, [totalSlides]);

    // Keyboard Support
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') goToPrev();
            if (e.key === 'ArrowRight') goToNext();

            // Spacebar for video play/pause if on video slide
            const isVideoSlide = hasVideo && currentIndex === 0;
            if (e.key === ' ' && isVideoSlide) {
                e.preventDefault();
                togglePlayPause();
            }
        },
        [isOpen, onClose, goToNext, goToPrev, hasVideo, currentIndex]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Pause video when leaving video slide
    useEffect(() => {
        if (hasVideo && currentIndex !== 0 && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [currentIndex, hasVideo]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    };

    if (!isOpen) return null;

    const isVideoSlide = hasVideo && currentIndex === 0;
    // If hasVideo is true, image index is currentIndex - 1. If false, currentIndex.
    const imageIndex = hasVideo ? currentIndex - 1 : currentIndex;

    return (
        <div style={styles.overlay} onClick={onClose}>
            {/* Header Bar */}
            <div style={styles.header} onClick={(e) => e.stopPropagation()}>
                <div style={styles.headerLeft}>
                    {title && <h2 style={styles.projectTitle}>{title}</h2>}
                </div>
                <div style={styles.headerRight}>
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.liveButton}
                        >
                            View Live
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 6 }}>
                                <path d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                        </a>
                    )}
                    <button style={styles.closeButton} onClick={onClose} aria-label="Close">
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div style={styles.content} onClick={(e) => e.stopPropagation()}>

                {/* Navigation - Previous */}
                {totalSlides > 1 && (
                    <button
                        style={{ ...styles.navButton, left: 16 }}
                        onClick={goToPrev}
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={32} />
                    </button>
                )}

                {/* Main Content Area */}
                <div style={styles.mediaContainer}>
                    {isVideoSlide ? (
                        <div style={styles.videoWrapper}>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                autoPlay
                                muted={false}
                                id="fullscreen-video-player"
                                muted // Start muted for autoplay
                                loop
                                playsInline
                                style={styles.fullscreenVideo}
                                onClick={togglePlayPause}
                            />
                            {/* Play/Pause Overlay */}
                            <button
                                style={{
                                    ...styles.playPauseButton,
                                    opacity: isPlaying ? 0 : 1,
                                }}
                                onClick={togglePlayPause}
                                className="play-pause-btn"
                            >
                                {isPlaying ? <Pause size={48} /> : <Play size={48} />}
                            </button>

                            {/* Progress Bar (Direct DOM update) */}
                            <div style={styles.progressBarContainer}>
                                <div
                                    ref={progressBarRef}
                                    style={{
                                        ...styles.progressBarFill,
                                        width: '0%', // Controlled via JS
                                    }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={styles.imageWrapper}>
                            <Image
                                src={images[imageIndex]}
                                alt={`${alt} ${imageIndex + 1}`}
                                fill
                                style={{ objectFit: 'contain' }}
                                quality={100}
                                sizes="90vw"
                                priority
                            />
                        </div>
                    )}
                </div>

                {/* Navigation - Next */}
                {totalSlides > 1 && (
                    <button
                        style={{ ...styles.navButton, right: 16 }}
                        onClick={goToNext}
                        aria-label="Next slide"
                    >
                        <ChevronRight size={32} />
                    </button>
                )}

                {/* Counter */}
                {totalSlides > 1 && (
                    <div style={styles.counter}>
                        {currentIndex + 1} / {totalSlides}
                    </div>
                )}
            </div>
            {/* CSS for hover effects */}
            <style jsx>{`
        .play-pause-btn:hover {
            opacity: 1 !important;
        }
      `}</style>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#000000',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 40px',
        zIndex: 20,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)',
        pointerEvents: 'none', // Allow clicks to pass through if not hitting buttons
    },
    headerLeft: {
        pointerEvents: 'auto',
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        pointerEvents: 'auto',
    },
    projectTitle: {
        color: 'white',
        fontSize: '18px',
        fontWeight: 500,
        letterSpacing: '0.5px',
        margin: 0,
    },
    liveButton: {
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 500,
        background: 'rgba(255, 255, 255, 0.15)',
        padding: '8px 16px',
        borderRadius: '20px',
        backdropFilter: 'blur(10px)',
        transition: 'background 0.2s',
    },
    closeButton: {
        background: 'rgba(255, 255, 255, 0.15)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: 'white',
        backdropFilter: 'blur(10px)',
        transition: 'background 0.2s',
    },
    content: {
        position: 'relative',
        flex: 1,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'rgba(255, 255, 255, 0.1)',
        border: 'none',
        borderRadius: 8,
        padding: 8,
        cursor: 'pointer',
        color: 'white',
        zIndex: 10,
    },
    mediaContainer: {
        position: 'relative',
        width: '90vw',
        height: '80vh', // Slightly smaller to account for header
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
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
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    counter: {
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'white',
        fontSize: 14,
        fontFamily: 'system-ui',
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '6px 16px',
        borderRadius: 20,
    },
    playPauseButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(0, 0, 0, 0.5)',
        border: 'none',
        borderRadius: '50%',
        padding: '20px',
        cursor: 'pointer',
        color: 'white',
        transition: 'opacity 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '4px',
        background: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '0 0 4px 4px',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        background: '#cda882',
        width: '0%', // Start at 0
        // removed transition: width linear... to allow rAF to control it instantly
    }
};
