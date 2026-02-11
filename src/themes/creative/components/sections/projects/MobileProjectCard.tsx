'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MobileProjectCard.module.css';
import { MobileProjectCarousel } from '../../layout/MobileProjectCarousel';
import { UnifiedProjectViewer } from '@/components/shared/UnifiedProjectViewer';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const StackingBlurOverlay = () => (
    <div className={styles.stackingBlurOverlay} />
);

interface MobileProjectCardProps {
    project: any;
    index: number;
    zIndex: number;
}

export const MobileProjectCard = ({ project, index, zIndex }: MobileProjectCardProps) => {
    const [isViewerOpen, setIsViewerOpen] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const el = cardRef.current;
            if (!el) return;

            const overlay = el.querySelector(`.${styles.stackingBlurOverlay}`);
            if (overlay) {
                gsap.set(overlay, { opacity: 0 });

                gsap.to(overlay, {
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        start: "top top+=1",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }
        }, cardRef);

        return () => ctx.revert();
    }, []);

    return (
        <>
            <div ref={cardRef} className={styles.projectContainer} style={{ zIndex }}>
                <StackingBlurOverlay />
                {/* Background Decor - Number with Parallax */}
                <BackgroundDecor
                    position={{ top: '15%', right: '5%' }}
                    size="300px"
                    parallaxSpeed={0.15}
                    className={styles.backgroundIcon}
                >
                    <div className={styles.projectNumberWrapper}>
                        <span className={styles.decorHash}>#</span>
                        <span className={styles.decorNumber}>
                            {String(index + 1).padStart(2, '0')}
                        </span>
                    </div>
                </BackgroundDecor>

                {/* Top Section: Title -> Tag -> Separator -> Highlights */}
                <div className={styles.projectTopSection}>
                    {/* Title */}
                    <h3 className={styles.projectTitle}>
                        {project.title}
                    </h3>

                    {/* Tag */}
                    <span className={styles.caseStudyTag}>
                        {project.category === 'case-study' && 'CASE STUDY'}
                        {project.category === 'venture' && 'PERSONAL VENTURE'}
                        {project.category === 'client' && 'CLIENT WORK'}
                        {!['case-study', 'venture', 'client'].includes(project.category) && 'PROJECT'}
                    </span>

                    {/* Common Stats Separator (Standardized) */}
                    <AccentSeparator width="40%" className={styles.projectSeparator} />

                    {/* Highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                        <div className={styles.projectHighlightsList}>
                            <Highlights
                                items={project.highlights}
                                mono
                                className={styles.projectHighlightsOverride}
                            />
                        </div>
                    )}
                </div>

                {/* Spacer to push content apart evenly */}
                <div className={styles.projectSpacer} />

                {/* Bottom Section: Media -> View Live Button */}
                <div className={styles.projectBottomSection}>
                    <div className={styles.projectMediaContainer}>
                        <MobileProjectCarousel
                            videoSrc={project.heroVideo}
                            images={project.images}
                            projectName={project.title}
                            onExpand={() => setIsViewerOpen(true)}
                        />
                    </div>

                    {/* View Live Button - Full Width Block at Bottom */}
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLiveBlockButton}
                        >
                            View Live →
                        </a>
                    )}
                </div>
            </div>

            {/* Fullscreen Viewer */}
            <UnifiedProjectViewer
                isOpen={isViewerOpen}
                onClose={() => setIsViewerOpen(false)}
                videoSrc={project.heroVideo}
                images={project.images}
                initialIndex={0}
                alt={`${project.title} media`}
                title={project.title}
                liveUrl={project.liveUrl}
            />
        </>
    );
};
