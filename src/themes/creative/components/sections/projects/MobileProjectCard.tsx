'use client';

import React from 'react';
import styles from './MobileProjectCard.module.css';
import { MobileProjectCarousel } from '../../layout/MobileProjectCarousel';
import { UnifiedProjectViewer } from '@/components/shared/UnifiedProjectViewer';
import { AccentSeparator } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { useMobileReveal } from '@/themes/creative/hooks/useMobileReveal';
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
    const cardRef = useMobileReveal<HTMLDivElement>({ y: 30, delay: index * 0.05 });

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
                    <h3 className={styles.projectTitle}>
                        {project.title}
                    </h3>

                    {/* Separator */}
                    <AccentSeparator width="40%" className={styles.projectSeparator} />

                    {/* Description */}
                    <p className={styles.projectDescription}>
                        {project.shortDescription}
                    </p>

                    {/* Key Features with Icons */}
                    {project.keyFeatures && project.keyFeatures.length > 0 ? (
                        <div className={styles.keyFeaturesGrid}>
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
