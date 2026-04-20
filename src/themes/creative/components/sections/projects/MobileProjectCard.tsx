'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MobileProjectCard.module.css';
import { MobileProjectCarousel } from '../../layout/MobileProjectCarousel';
import { UnifiedProjectViewer } from '@/components/shared/UnifiedProjectViewer';
import { AccentSeparator } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}
import {
  BotMessageSquare, BarChart3, Smartphone, ShieldCheck,
  Network, Palette, FileCode2,
  Sparkles, Zap, ShoppingBag, Film,
  Star, Layers, Globe, TrendingUp, type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  BotMessageSquare, BarChart3, Smartphone, ShieldCheck,
  Network, Palette, FileCode2,
  Sparkles, Zap, ShoppingBag, Film,
  Star, Layers, Globe, TrendingUp,
};



interface MobileProjectCardProps {
    project: import('./config').ProjectDisplayData;
    index: number;
}

export const MobileProjectCard = ({ project, index }: MobileProjectCardProps) => {
    const [isViewerOpen, setIsViewerOpen] = React.useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const separatorRef = useRef<HTMLDivElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const featuresRef = useRef<HTMLDivElement>(null);
    const mediaRef = useRef<HTMLDivElement>(null);

    // Alternating slide: even cards from left, odd from right
    const slideX = index % 2 === 0 ? -36 : 36;

    useLayoutEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        if (typeof window === 'undefined' || window.innerWidth > 900) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
            });

            // Card slides in from alternating side
            tl.fromTo(el, { opacity: 0, x: slideX }, { opacity: 1, x: 0, duration: 0.65, ease: 'power3.out' }, 0);

            if (titleRef.current) {
                tl.fromTo(titleRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.15);
            }
            if (separatorRef.current) {
                tl.fromTo(separatorRef.current, { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 0.3);
            }
            if (descRef.current) {
                tl.fromTo(descRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 0.38);
            }
            if (featuresRef.current) {
                const items = Array.from(featuresRef.current.children);
                if (items.length > 0) {
                    tl.fromTo(items, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, stagger: 0.06, ease: 'power2.out' }, 0.48);
                }
            }
            if (mediaRef.current) {
                tl.fromTo(mediaRef.current, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)' }, 0.3);
            }
        }, el);

        return () => ctx.revert();
    }, [index, slideX]);

    return (
        <>
            <div ref={cardRef} className={styles.projectContainer} data-project-card={index}>
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
                {/* Top Section */}
                <div className={styles.projectTopSection}>
                    {/* Title */}
                    <h3 ref={titleRef} className={styles.projectTitle}>
                        {project.title}
                    </h3>

                    {/* Separator */}
                    <div ref={separatorRef} style={{ display: 'contents' }}>
                        <AccentSeparator width="40%" className={styles.projectSeparator} />
                    </div>

                    {/* Description */}
                    <p ref={descRef} className={styles.projectDescription}>
                        {project.shortDescription}
                    </p>

                    {/* Key Features with Icons */}
                    {project.keyFeatures && project.keyFeatures.length > 0 ? (
                        <div ref={featuresRef} className={styles.keyFeaturesGrid}>
                            {project.keyFeatures.slice(0, 4).map((kf: { icon: string; text: string }, i: number) => {
                                const Icon = ICON_MAP[kf.icon] ?? Star;
                                return (
                                    <div key={i} className={styles.keyFeatureItem}>
                                        <span className={styles.keyFeatureIconWrap}>
                                            <Icon size={12} strokeWidth={2} />
                                        </span>
                                        <span className={styles.keyFeatureText}>{kf.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        project.features && project.features.length > 0 && (
                            <ul className={styles.featureList}>
                                {project.features.slice(0, 4).map((feat: string, i: number) => (
                                    <li key={i} className={styles.featureItem}>
                                        <span className={styles.featureDot} aria-hidden="true" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                        )
                    )}

                    {/* Tech Stack Badges */}
                    {project.techStack && project.techStack.length > 0 && (
                        <div className={styles.techStackRow}>
                            {project.techStack.map((tech: string) => (
                                <span key={tech} className={styles.techBadge}>{tech}</span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottom Section: Media -> View Live Button */}
                <div className={styles.projectBottomSection}>
                    <div ref={mediaRef} className={styles.projectMediaContainer}>
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
            </div >

            {/* Fullscreen Viewer */}
            < UnifiedProjectViewer
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
