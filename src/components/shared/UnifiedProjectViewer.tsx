'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { AnalyticsService } from '@/services/AnalyticsService';

// Preload images using browser API
function preloadImages(srcs: string[]) {
  if (typeof window === 'undefined') return;
  srcs.forEach((src) => {
    const img = new window.Image();
    img.src = src;
  });
}

// Preload with link tags for better performance
function addPreloadLinks(srcs: string[]) {
  srcs.forEach((src) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

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
    const [videoError, setVideoError] = useState(false);
    
    // Total slides = (1 if video exists and is loadable) + images.length
    const hasVideo = !!videoSrc && !videoError;
    const totalSlides = (hasVideo ? 1 : 0) + images.length;

    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Swipe State
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    // Video State
    const videoRef = useRef<HTMLVideoElement>(null);
    const progressBarRef = useRef<HTMLDivElement>(null); // Direct DOM Ref
    const requestRef = useRef<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(true);

    // Track loaded images
    const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());
    
    // Reset index and preload images when opening
    useEffect(() => {
        if (isOpen) {
            // Use requestAnimationFrame to avoid synchronous setState
            requestAnimationFrame(() => {
                setCurrentIndex(initialIndex);
                setIsPlaying(true);
                setVideoError(false);
                setLoadedImages(new Set()); // Reset loaded state
            });
            // Reset progress bar width directly
            if (progressBarRef.current) {
                progressBarRef.current.style.width = '0%';
            }
            
            // Preload all images immediately when gallery opens
            if (images.length > 0) {
                preloadImages(images);
                addPreloadLinks(images);
            }
        }
    }, [isOpen, initialIndex, images]);

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
    const animateProgress = useCallback(function animationLoop() {
        if (videoRef.current && progressBarRef.current) {
            const { currentTime, duration } = videoRef.current;
            if (duration) {
                const percent = (currentTime / duration) * 100;
                // Direct DOM update for 60fps smoothness without re-renders
                progressBarRef.current.style.width = `${percent}%`;
            }
        }
        requestRef.current = requestAnimationFrame(animationLoop);
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

    const togglePlayPause = useCallback(() => {
        if (videoRef.current) {
            if (videoRef.current.paused) {
                videoRef.current.play();
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }, []);

    // Swipe Handlers
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

        if (isLeftSwipe) goToNext();
        if (isRightSwipe) goToPrev();

        setTouchStart(0);
        setTouchEnd(0);
    };

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
        [isOpen, onClose, goToNext, goToPrev, hasVideo, currentIndex, togglePlayPause]
    );

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Hide header when viewer is open
    useEffect(() => {
        const header = document.querySelector('header');
        if (header) {
            if (isOpen) {
                (header as HTMLElement).style.display = 'none';
            } else {
                (header as HTMLElement).style.display = '';
            }
        }
        return () => {
            // Restore header on cleanup
            if (header) {
                (header as HTMLElement).style.display = '';
            }
        };
    }, [isOpen]);

    // Pause video when leaving video slide
    useEffect(() => {
        if (hasVideo && currentIndex !== 0 && videoRef.current) {
            videoRef.current.pause();
            requestAnimationFrame(() => {
                setIsPlaying(false);
            });
        }
    }, [currentIndex, hasVideo]);

    if (!isOpen) return null;

    const isVideoSlide = hasVideo && currentIndex === 0;
    // If hasVideo is true, image index is currentIndex - 1. If false, currentIndex.
    const imageIndex = hasVideo ? currentIndex - 1 : currentIndex;

    return (
        <div style={styles.overlay} onClick={onClose}>
            {/* Top Navigation Bar: Minimalist & Clean */}
            <div
                style={styles.header}
                onClick={(e) => e.stopPropagation()}
                className="viewer-nav-top"
            >
                <div style={styles.headerLeft}>
                    {title && <h2 style={styles.projectTitle}>{title}</h2>}
                </div>
                <div style={styles.headerRight}>
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.liveButtonHeader}
                            className="view-live-cta-desktop"
                            onClick={() => title && AnalyticsService.trackProjectInteraction('click_live_demo', title)}
                        >
                            Visit Website
                            <ChevronRight size={14} style={{ marginLeft: 4 }} />
                        </a>
                    )}
                    <button style={styles.closeButton} onClick={onClose} aria-label="Close">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div
                style={styles.content}
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Desktop Navigation - Previous */}
                {totalSlides > 1 && (
                    <button
                        style={{ ...styles.navButton, left: 24 }}
                        onClick={goToPrev}
                        aria-label="Previous slide"
                        className="nav-btn-desktop"
                    >
                        <ChevronLeft size={28} />
                    </button>
                )}

                {/* Main Media Core */}
                <div style={styles.mediaContainer}>
                    {isVideoSlide ? (
                        <div style={styles.videoWrapper}>
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                autoPlay
                                id="fullscreen-video-player"
                                muted
                                loop
                                playsInline
                                style={styles.fullscreenVideo}
                                onClick={togglePlayPause}
                                onError={() => setVideoError(true)}
                            />
                            {!isPlaying && (
                                <button
                                    style={styles.playPauseButton}
                                    onClick={togglePlayPause}
                                >
                                    <Play size={40} fill="currentColor" />
                                </button>
                            )}
                            {/* Video Progress Bar - YouTube Style */}
                            <div style={styles.progressBarContainer}>
                                <div ref={progressBarRef} style={styles.progressBar} />
                            </div>
                        </div>
                    ) : (
                        // Render all images but only show current (prevents loading delays)
                        images.map((imgSrc, idx) => {
                            const isCurrent = idx === imageIndex;
                            const isAdjacent = Math.abs(idx - imageIndex) <= 1; // Prev, current, next
                            
                            // Only render current and adjacent images
                            if (!isCurrent && !isAdjacent) return null;
                            
                            return (
                                <div 
                                    key={imgSrc} 
                                    style={{
                                        ...styles.imageWrapper,
                                        visibility: isCurrent ? 'visible' : 'hidden',
                                        opacity: isCurrent ? 1 : 0,
                                        zIndex: isCurrent ? 1 : 0,
                                        position: 'absolute',
                                    }}
                                >
                                    <Image
                                        src={imgSrc}
                                        alt={`${alt} ${idx + 1}`}
                                        fill
                                        style={{ objectFit: 'contain' }}
                                        quality={100}
                                        sizes="95vw"
                                        priority={isCurrent || isAdjacent}
                                        onLoad={() => {
                                            setLoadedImages(prev => new Set([...prev, idx]));
                                        }}
                                    />
                                    {/* Skeleton placeholder while loading */}
                                    {!loadedImages.has(idx) && (
                                        <div style={styles.imageSkeleton} />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Desktop Navigation - Next */}
                {totalSlides > 1 && (
                    <button
                        style={{ ...styles.navButton, right: 24 }}
                        onClick={goToNext}
                        aria-label="Next slide"
                        className="nav-btn-desktop"
                    >
                        <ChevronRight size={28} />
                    </button>
                )}
            </div>

            {/* Bottom Controls / CTA Bar - Always visible for both video and images */}
            <div
                style={styles.footer}
                onClick={(e) => e.stopPropagation()}
                className="viewer-nav-bottom"
            >
                {totalSlides > 1 && (
                    <div style={styles.carouselNav}>
                         <button className="page-btn" onClick={goToPrev}><ChevronLeft size={18} /></button>
                         <span style={styles.counter}>{currentIndex + 1} / {totalSlides}</span>
                         <button className="page-btn" onClick={goToNext}><ChevronRight size={18} /></button>
                    </div>
                )}
                
                {liveUrl && (
                    <a
                        href={liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.liveButtonFooter}
                        className="view-live-cta-mobile"
                        onClick={() => title && AnalyticsService.trackProjectInteraction('click_live_demo', title)}
                    >
                        Visit Website
                        <ChevronRight size={14} style={{ marginLeft: 4 }} />
                    </a>
                )}
            </div>

            <style jsx>{`
                .page-btn {
                    background: #f5f5f5;
                    border: 1px solid #e5e5e5;
                    border-radius: 8px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #555;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .page-btn:hover {
                    background: #e8e8e8;
                }
                
                .view-live-cta-desktop {
                    display: flex !important;
                }
                
                .view-live-cta-mobile {
                    display: none !important;
                }
                
                @media (max-width: 768px) {
                    .nav-btn-desktop { display: none !important; }
                    .view-live-cta-desktop { display: none !important; }
                    .view-live-cta-mobile { 
                        display: flex !important;
                        flex: 1;
                        justify-content: center;
                        font-weight: 700 !important;
                        letter-spacing: 0.02em;
                        border-radius: 9999px !important;
                    }
                    
                    .viewer-nav-bottom {
                        flex-direction: column !important;
                        padding: 16px 20px calc(16px + env(safe-area-inset-bottom)) !important;
                    }
                }
                
                @media (min-width: 769px) {
                    .viewer-nav-bottom {
                        flex-direction: row !important;
                        justify-content: center !important;
                        padding: 12px 24px !important;
                    }
                }
                
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
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
        backgroundColor: '#ffffff',
        zIndex: 2147483647,
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        borderBottom: '1px solid #f0f0f0',
        background: '#ffffff',
        height: '72px',
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    projectTitle: {
        color: '#111111',
        fontSize: '18px',
        fontWeight: 700,
        margin: 0,
    },
    closeButton: {
        background: '#f5f5f5',
        border: '1px solid #e5e5e5',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#111111',
        transition: 'all 0.2s',
    },
    content: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fafafa',
        overflow: 'hidden',
    },
    mediaContainer: {
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10px',
    },
    videoWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    fullscreenVideo: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'contain',
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: '#ffffff',
        border: '1px solid #e5e5e5',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#111111',
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    },
    footer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '16px 24px',
        background: '#ffffff',
        borderTop: '1px solid #f0f0f0',
        minHeight: '64px',
    },
    carouselNav: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
    },
    progressBarContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '5px',
        background: 'rgba(255, 255, 255, 0.3)',
        cursor: 'pointer',
        zIndex: 20,
    },
    progressBar: {
        height: '100%',
        background: '#ff6b3d',
        width: '0%',
    },
    counter: {
        fontSize: '13px',
        fontWeight: 600,
        color: '#666666',
        minWidth: '40px',
        textAlign: 'center',
    },
    liveButtonHeader: {
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 700,
        background: '#ff6b3d',
        padding: '10px 20px',
        borderRadius: '9999px', // Capsule
        transition: 'all 0.2s ease',
        boxShadow: '0 4px 12px rgba(255, 107, 61, 0.2)',
    },
    liveButtonFooter: {
        display: 'flex',
        alignItems: 'center',
        color: '#ffffff',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: 600,
        background: '#ff6b3d',
        padding: '14px 24px',
        borderRadius: '9999px', // Capsule
        transition: 'transform 0.2s',
    },
    playPauseButton: {
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.9)',
        border: 'none',
        borderRadius: '50%',
        width: '64px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#111111',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        zIndex: 10,
    },
    imageSkeleton: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        zIndex: 0,
    }
};
