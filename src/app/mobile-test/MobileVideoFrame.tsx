'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './proto.module.css';

interface MobileVideoFrameProps {
    videoSrc?: string;
    imageSrc?: string;
    alt: string;
}

/**
 * Mobile-optimized video/image frame with tablet bezel and progress bar
 * - Shows media in a tablet-like frame with rounded corners
 * - Progress bar shows actual video progress or 100% for static images
 * - Maintains aspect ratio with proper scaling
 */
export function MobileVideoFrame({ videoSrc, imageSrc, alt }: MobileVideoFrameProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [progress, setProgress] = useState(0);

    // Track video progress
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updateProgress = () => {
            const percentage = (video.currentTime / video.duration) * 100;
            setProgress(percentage || 0);
        };

        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('loadedmetadata', updateProgress);

        return () => {
            video.removeEventListener('timeupdate', updateProgress);
            video.removeEventListener('loadedmetadata', updateProgress);
        };
    }, []);

    // For images, show 100% progress (static)
    const displayProgress = videoSrc ? progress : 100;

    return (
        <div className={styles.tabletWrapper}>
            {/* Tablet Frame */}
            <div className={styles.tabletBezel}>
                {/* Top bezel with camera */}
                <div className={styles.topBezel}>
                    <div className={styles.camera} />
                </div>

                {/* Screen area */}
                <div className={styles.screenArea}>
                    {videoSrc ? (
                        <video
                            ref={videoRef}
                            className={styles.mediaContent}
                            src={videoSrc}
                            autoPlay
                            loop
                            muted
                            playsInline
                            poster={imageSrc}
                        />
                    ) : imageSrc ? (
                        <Image
                            src={imageSrc}
                            alt={alt}
                            fill
                            className={styles.mediaContent}
                            style={{ objectFit: 'contain' }}
                        />
                    ) : (
                        <div className={styles.noMediaPlaceholder}>NO MEDIA</div>
                    )}

                    {/* Media Progress Bar */}
                    <div className={styles.progressBarContainer}>
                        <div className={styles.progressBarTrack}>
                            <div
                                className={styles.progressBarFill}
                                style={{ width: `${displayProgress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom bezel */}
                <div className={styles.bottomBezel} />
            </div>
        </div>
    );
}
