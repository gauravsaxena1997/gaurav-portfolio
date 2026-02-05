'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase } from 'lucide-react';
import dynamic from 'next/dynamic';
import styles from './MobileLayout.module.css';
import { MobileChipStack } from '@/themes/creative/components/sections/stats/MobileChipStack';
import { AIBrainIllustration } from '@/themes/creative/components/sections/stats/illustrations/AIBrainIllustration';
import { GlobeVisualization } from '@/themes/creative/components/sections/stats/illustrations/GlobeVisualization';
import { getProjectsForDisplay } from '@/themes/creative/components/sections/projects/config';
import { ProjectCarousel } from '@/themes/creative/components/sections/projects/ProjectCarousel';
import { MobileVideoFrame } from './MobileVideoFrame';
import { Header } from '@/themes/creative/components/header/Header';
import { HeroSection } from '@/themes/creative/components/sections/hero/HeroSection';
import { ScrollProvider } from '@/themes/creative/context/ScrollContext';
import { useScrollProgress } from '@/themes/creative/hooks/useScrollProgress';
import { ProgressScrollbar } from '@/themes/creative/components/scroll/ProgressScrollbar';
import { AccentSeparator, Highlights } from '@/themes/creative/components/ui';
import { BackgroundDecor } from '@/themes/creative/components/common/BackgroundDecor';
import { STATS_DATA } from '@/config/stats';

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

        // Register ScrollTrigger for this section
        const trigger = ScrollTrigger.create({
            trigger: element,
            start: 'top bottom', // Start when top of section hits bottom of viewport
            end: 'bottom top',   // End when bottom of section hits top of viewport
            onUpdate: (self) => {
                // Calculate progress: 0 (just entered) -> 1 (just left)
                // We want robust "active" state when it covers the viewport
                updateProgress(self.progress);
            }
        });

        return () => {
            trigger.kill();
        };
    }, [updateProgress]); // updateProgress is stable from hook

    return (
        <div
            ref={containerRef} // Attach ref for ScrollTrigger
            id={domId}
            className={className}
            style={{ ...style, zIndex }}
            data-section={logicalId}
        >
            {children}
        </div>
    );
};

const MobileStatPanel = ({ index }: { index: number }) => {
    const is5050 = index === 0;
    const layoutClass = is5050 ? styles.grid4555 : styles.grid502030;
    const zIndex = 20 + index;
    const stat = STATS_DATA[index];
    const Icon = stat?.icon;

    return (
        <div className={styles.statPanel} style={{ zIndex }}>
            <div className={layoutClass}>
                {/* Text Zone with BackgroundDecor */}
                <div className={styles.textZone}>
                    {/* Background Parallax Icon */}
                    {Icon && (
                        <BackgroundDecor
                            position={{ top: '45%', right: '0%' }}
                            size="200px"
                            parallaxSpeed={0.15}
                            className={styles.backgroundIcon}
                        >
                            <Icon size={200} strokeWidth={1} />
                        </BackgroundDecor>
                    )}
                    <div className={styles.statTextContent}>
                        <h3 className={styles.statTitle}>{stat?.title}</h3>
                        <AccentSeparator width="40%" />
                        <p className={styles.statDescription}>{stat?.description}</p>
                    </div>
                </div>
                {/* Highlights Zone - only for non-5050 layouts */}
                {!is5050 && stat?.highlights && (
                    <div className={styles.listZone}>
                        <Highlights items={stat.highlights} mono />
                    </div>
                )}
                {/* Illustration Zone */}
                <div className={styles.illustrationZone}>
                    {index === 0 && (
                        <div className={styles.illustrationWrapper50}>
                            <MobileChipStack />
                        </div>
                    )}
                    {index === 1 && (
                        <div className={styles.illustrationWrapper40}>
                            <AIBrainIllustration />
                        </div>
                    )}
                    {index === 2 && (
                        <div className={styles.illustrationWrapper40}>
                            <div className={styles.globeClip}>
                                <GlobeVisualization />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProtoProject = ({ project, index, zIndex }: { project: any; index: number; zIndex: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLDivElement>(null);
    const galleryRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            const video = videoRef.current;
            const gallery = galleryRef.current;

            if (!container || !video || !gallery) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=100%',
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                }
            });

            tl.to(video, {
                yPercent: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut'
            }, 0);

            tl.fromTo(gallery,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.5, ease: 'power2.inOut' },
                0
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className={styles.projectContainer} style={{ zIndex }}>
            {/* Background Decor - Number with Parallax */}
            <BackgroundDecor
                position={{ top: '45%', right: '0%' }}
                size="300px" // Large container for the number
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

            <div className={styles.projectTextArea}>
                {/* Title */}
                <h3 className={styles.statTitle} style={{ marginBottom: '0.25rem' }}>
                    {project.title.toUpperCase()}
                </h3>

                {/* Actions Row: Tag & Link */}
                <div className={styles.projectActionRow}>
                    <span className={styles.caseStudyTag}>
                        {project.category === 'case-study' && 'CASE STUDY'}
                        {project.category === 'venture' && 'PERSONAL VENTURE'}
                        {project.category === 'client' && 'CLIENT WORK'}
                        {!['case-study', 'venture', 'client'].includes(project.category) && 'PROJECT'}
                    </span>
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.viewLiveButton}
                        >
                            View Live →
                        </a>
                    )}
                </div>

                <AccentSeparator width="100%" />

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

            <div className={styles.projectMediaContainer}>
                <div ref={videoRef} className={styles.mediaLayer}>
                    <MobileVideoFrame
                        videoSrc={project.heroVideo}
                        imageSrc={project.thumbnail}
                        alt={`${project.title} demo`}
                    />
                </div>
                <div ref={galleryRef} className={styles.mediaLayer}>
                    {project.images && project.images.length > 0 && (
                        <ProjectCarousel
                            images={project.images}
                            projectName={project.title}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Lazy load illustrations
const MvpIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/MvpIllustration').then(mod => ({ default: mod.MvpIllustration })), { ssr: false });
const UiUxIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/UiUxIllustration').then(mod => ({ default: mod.UiUxIllustration })), { ssr: false });
const DevelopmentIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/DevelopmentIllustration').then(mod => ({ default: mod.DevelopmentIllustration })), { ssr: false });
const IntegrationsIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/IntegrationsIllustration').then(mod => ({ default: mod.IntegrationsIllustration })), { ssr: false });
const SeoIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/SeoIllustration').then(mod => ({ default: mod.SeoIllustration })), { ssr: false });

const ProtoServices = ({ zIndex }: { zIndex: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const service1Ref = useRef<HTMLDivElement>(null);
    const service2Ref = useRef<HTMLDivElement>(null);
    const service3Ref = useRef<HTMLDivElement>(null);
    const service4Ref = useRef<HTMLDivElement>(null);
    const service5Ref = useRef<HTMLDivElement>(null);

    // Track active illustration index
    const [activeIndex, setActiveIndex] = React.useState(0);

    // Import ServiceFrame
    const ServiceFrame = dynamic(() => import('./ServiceFrame').then(m => m.ServiceFrame), { ssr: false });

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const container = containerRef.current;
            const refs = [service1Ref.current, service2Ref.current, service3Ref.current, service4Ref.current, service5Ref.current];

            if (!container || refs.some(r => !r)) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=400%', // 4 transitions * 100vh
                    scrub: true,
                    pin: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        // Update active illustration based on scroll progress
                        const progress = self.progress;
                        if (progress < 0.2) setActiveIndex(0);
                        else if (progress < 0.4) setActiveIndex(1);
                        else if (progress < 0.6) setActiveIndex(2);
                        else if (progress < 0.8) setActiveIndex(3);
                        else setActiveIndex(4);
                    }
                }
            });

            // Service 1 → 2
            tl.to(service1Ref.current, { yPercent: -100, opacity: 0, duration: 1 }, 0);
            tl.fromTo(service2Ref.current,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1 },
                0
            );

            // Service 2 → 3
            tl.to(service2Ref.current, { yPercent: -100, opacity: 0, duration: 1 }, 1);
            tl.fromTo(service3Ref.current,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1 },
                1
            );

            // Service 3 → 4
            tl.to(service3Ref.current, { yPercent: -100, opacity: 0, duration: 1 }, 2);
            tl.fromTo(service4Ref.current,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1 },
                2
            );

            // Service 4 → 5
            tl.to(service4Ref.current, { yPercent: -100, opacity: 0, duration: 1 }, 3);
            tl.fromTo(service5Ref.current,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 1 },
                3
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Render current illustration
    const renderIllustration = () => {
        switch (activeIndex) {
            case 0: return <MvpIllustration />;
            case 1: return <UiUxIllustration />;
            case 2: return <DevelopmentIllustration />;
            case 3: return <IntegrationsIllustration />;
            case 4: return <SeoIllustration />;
            default: return <MvpIllustration />;
        }
    };

    return (
        <div ref={containerRef} className={styles.servicesContainer} style={{ zIndex }}>
            {/* TOP 50%: Service text layers */}
            <div className={styles.servicesTextArea}>
                <div ref={service1Ref} className={styles.serviceTextLayer}>
                    <h2>SERVICE 1</h2>
                    <p>MVP Engineering</p>
                    <p className={styles.hint}>↓ Scroll for next</p>
                </div>
                <div ref={service2Ref} className={styles.serviceTextLayer} style={{ opacity: 0, transform: 'translateY(100%)' }}>
                    <h2>SERVICE 2</h2>
                    <p>Design Engineering</p>
                    <p className={styles.hint}>↓ Scroll for next</p>
                </div>
                <div ref={service3Ref} className={styles.serviceTextLayer} style={{ opacity: 0, transform: 'translateY(100%)' }}>
                    <h2>SERVICE 3</h2>
                    <p>Full Stack Architecture</p>
                    <p className={styles.hint}>↓ Scroll for next</p>
                </div>
                <div ref={service4Ref} className={styles.serviceTextLayer} style={{ opacity: 0, transform: 'translateY(100%)' }}>
                    <h2>SERVICE 4</h2>
                    <p>API & Payment Systems</p>
                    <p className={styles.hint}>↓ Scroll for next</p>
                </div>
                <div ref={service5Ref} className={styles.serviceTextLayer} style={{ opacity: 0, transform: 'translateY(100%)' }}>
                    <h2>SERVICE 5</h2>
                    <p>Performance & Growth</p>
                    <p className={styles.hint}>↓ Scroll to Contact</p>
                </div>
            </div>

            {/* BOTTOM 50%: Tablet frame with changing illustrations */}
            <div className={styles.servicesLaptopArea}>
                <ServiceFrame illustration={renderIllustration()} />
            </div>
        </div>
    );
};

const ProtoContact = () => (
    <div className={styles.contactSection}>
        <h2>CONTACT SECTION</h2>
        <p>Final section</p>
    </div>
);

export default function MobileLayout() {
    const projects = getProjectsForDisplay();

    // Theme State for Header
    const [currentTheme, setCurrentTheme] = React.useState<'creative' | 'github'>('creative');
    // Default to dark, but should respect system/local storage if possible eventually
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
                    <div className={styles.sectionLabel}>PROJECTS</div>
                    {projects.map((project, index) => (
                        <ProtoProject
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
                >
                    <div className={styles.sectionLabel}>SERVICES</div>
                    <ProtoServices zIndex={40} />
                </TrackedSection>

                <TrackedSection
                    logicalId="contact"
                    domId="contact-section"
                >
                    <ProtoContact />
                </TrackedSection>
            </div>
        </ScrollProvider>
    );
}
