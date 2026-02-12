'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './MobileLayout.module.css';
import { getProjectsForDisplay } from '@/themes/creative/components/sections/projects/config';
import { Header } from '@/themes/creative/components/header/Header';
import { HeroSection } from '@/themes/creative/components/sections/hero/HeroSection';
import { MobileStatPanel } from '@/themes/creative/components/sections/stats/MobileStatPanel';
import { MobileProjectCard } from '@/themes/creative/components/sections/projects/MobileProjectCard';
import { MobileServicesSection } from '@/themes/creative/components/sections/services/MobileServicesSection';
import { MobileContactSection } from '@/themes/creative/components/sections/contact/MobileContactSection';
import { ScrollProvider } from '@/themes/creative/context/ScrollContext';
import { useScrollProgress } from '@/themes/creative/hooks/useScrollProgress';
import { ProgressScrollbar } from '@/themes/creative/components/scroll/ProgressScrollbar';

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
    zIndex
}: {
    logicalId: string;
    domId: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    zIndex?: number;
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
            style={{ ...style, zIndex }}
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
    const [themeMode, setThemeMode] = React.useState<'dark' | 'light'>('dark');

    const handleThemeChange = (theme: 'creative' | 'github') => {
        setCurrentTheme(theme);
    };

    const handleModeToggle = () => {
        const newMode = themeMode === 'dark' ? 'light' : 'dark';
        setThemeMode(newMode);
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newMode);
        }
    };

    // Set initial theme
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', themeMode);
        }
    }, [themeMode]);

    return (
        <ScrollProvider>
            <ProgressScrollbar />
            <div className={styles.mobileLayoutRoot}>
                <Header
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeChange}
                    themeMode={themeMode}
                    onModeToggle={handleModeToggle}
                />

                <TrackedSection
                    logicalId="hero"
                    domId="hero-section"
                    style={{ position: 'relative' }}
                    zIndex={0}
                >
                    <HeroSection />
                </TrackedSection>

                <TrackedSection
                    logicalId="stats"
                    domId="stats-section"
                    zIndex={10}
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
                            zIndex={30 + index}
                        />
                    ))}
                </TrackedSection>

                <TrackedSection
                    logicalId="services"
                    domId="services-section"
                    zIndex={35}
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <div className={styles.sectionLabel}>What I Offer</div>
                    <MobileServicesSection zIndex={40} />
                </TrackedSection>

                <TrackedSection
                    logicalId="contact"
                    domId="contact-section"
                    zIndex={50}
                    style={{ position: 'relative', background: 'var(--creative-bg-secondary)' }}
                >
                    <MobileContactSection />
                </TrackedSection>
            </div>
        </ScrollProvider>
    );
}
