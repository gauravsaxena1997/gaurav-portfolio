'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import styles from './MobileLayout.module.css';
import { getProjectsForDisplay } from '@/themes/creative/components/sections/projects/config';
import { Header } from '@/themes/creative/components/header/Header';
import { HeroSection } from '@/themes/creative/components/sections/hero/HeroSection';
import { ScrollProvider } from '@/themes/creative/context/ScrollContext';
import { useScrollProgress } from '@/themes/creative/hooks/useScrollProgress';
import { ProgressScrollbar } from '@/themes/creative/components/scroll/ProgressScrollbar';

// Regular imports for preloaded components
import { MobileStatPanel } from '@/themes/creative/components/sections/stats/MobileStatPanel';

// Dynamic imports for heavy below-fold sections
const MobileProjectCard = dynamic(
    () => import('@/themes/creative/components/sections/projects/MobileProjectCard').then(mod => mod.MobileProjectCard),
    { ssr: false }
);
const MobileServicesSection = dynamic(
    () => import('@/themes/creative/components/sections/services/MobileServicesSection').then(mod => mod.MobileServicesSection),
    { ssr: false }
);
const MobileContactSection = dynamic(
    () => import('@/themes/creative/components/sections/contact/MobileContactSection').then(mod => mod.MobileContactSection),
    { ssr: false }
);

const MobileTestimonialsSection = dynamic(
    () => import('@/themes/creative/components/sections/testimonials/MobileTestimonialsSection').then(mod => mod.MobileTestimonialsSection),
    { ssr: false }
);

import '../../styles/theme.css';
import '../../styles/scrollbar.css';

// Re-register ScrollTrigger in this scope to be safe
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

// Helper to track scroll progress for navigation state
const TrackedSection = ({
    logicalId,
    domId,
    children,
    className,
    style,
}: {
    logicalId: string;
    domId: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { updateProgress } = useScrollProgress({ sectionId: logicalId });

    useLayoutEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const trigger = ScrollTrigger.create({
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            onUpdate: (self) => {
                updateProgress(self.progress);
            }
        });

        return () => {
            trigger.kill();
        };
    }, [updateProgress]);

    return (
        <div
            ref={containerRef}
            id={domId}
            className={className}
            style={style}
            data-section={logicalId}
        >
            {children}
        </div>
    );
};

export default function MobileLayout() {
    const projects = getProjectsForDisplay();

    // Theme State for Header
    const [currentTheme, setCurrentTheme] = React.useState<'creative' | 'github'>('creative');

    const handleThemeChange = (theme: 'creative' | 'github') => {
        setCurrentTheme(theme);
    };

    return (
        <ScrollProvider>
            <ProgressScrollbar />
            <div className={styles.mobileLayoutRoot}>
                <Header
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeChange}
                />

                <TrackedSection
                    logicalId="hero"
                    domId="hero-section"
                    style={{ position: 'relative' }}
                >
                    <HeroSection />
                </TrackedSection>

                <TrackedSection
                    logicalId="stats"
                    domId="stats-section"
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <div className={styles.statsContainer}>
                        {[0, 1, 2].map((i) => (
                            <MobileStatPanel key={i} index={i} />
                        ))}
                    </div>
                </TrackedSection>

                <TrackedSection
                    logicalId="projects"
                    domId="projects-section"
                    className={styles.projectsWrapper}
                >
                    <div className={styles.sectionLabel}>Selected Projects</div>
                    {projects.map((project, index) => (
                        <MobileProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                        />
                    ))}
                </TrackedSection>

                <TrackedSection
                    logicalId="services"
                    domId="services-section"
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <div className={styles.sectionLabel}>What I Offer</div>
                    <MobileServicesSection />
                </TrackedSection>

                <TrackedSection
                    logicalId="testimonials"
                    domId="testimonials-section"
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <MobileTestimonialsSection />
                </TrackedSection>

                <TrackedSection
                    logicalId="contact"
                    domId="contact-section"
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <MobileContactSection />
                </TrackedSection>
            </div>
        </ScrollProvider>
    );
}
