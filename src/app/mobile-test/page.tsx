'use client';

import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import styles from './proto.module.css';
import './proto-projects.css';
import { ChipFallAnimation } from '@/themes/creative/components/sections/stats/ChipFallAnimation';
import { AIBrainIllustration } from '@/themes/creative/components/sections/stats/illustrations/AIBrainIllustration';
import { GlobeVisualization } from '@/themes/creative/components/sections/stats/illustrations/GlobeVisualization';
import { getProjectsForDisplay } from '@/themes/creative/components/sections/projects/config';
import { ProjectCarousel } from '@/themes/creative/components/sections/projects/ProjectCarousel';
import { MobileVideoFrame } from './MobileVideoFrame';

gsap.registerPlugin(ScrollTrigger);

const ProtoHeader = () => (
    <header className={styles.header}>FIXED HEADER (80px)</header>
);

const ProtoHero = () => (
    <section className={styles.hero}>
        <div className={styles.placeholderBox}>
            <h1>HERO SECTION</h1>
            <p>Sticky Z:10</p>
        </div>
    </section>
);

const ProtoStatPanel = ({ index }: { index: number }) => {
    const is5050 = index === 0;
    const layoutClass = is5050 ? styles.grid5050 : styles.grid402040;
    const zIndex = 20 + index;

    return (
        <div className={styles.statPanel} style={{ zIndex }}>
            <div className={layoutClass}>
                <div className={`${styles.placeholderBox} ${styles.textZone}`}>
                    STAT {index + 1}: TEXT {is5050 ? '(50%)' : '(40%)'}
                </div>
                {!is5050 && (
                    <div className={`${styles.placeholderBox} ${styles.listZone}`}>
                        HIGHLIGHTS (20%)
                    </div>
                )}
                <div className={styles.illustrationZone}>
                    {index === 0 && (
                        <div className={styles.illustrationWrapper50}>
                            <ChipFallAnimation />
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
            <div className={styles.projectTextArea}>
                <h2>PROJECT {index + 1}</h2>
                <h3>{project.title.toUpperCase()}</h3>
                <p className={styles.projectDescription}>{project.shortDescription}</p>

                {project.highlights && project.highlights.length > 0 && (
                    <div className={styles.projectHighlights}>
                        {project.highlights.map((highlight: string) => (
                            <span key={highlight} className={styles.projectBadge}>
                                {highlight}
                            </span>
                        ))}
                    </div>
                )}

                {project.liveUrl && (
                    <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.projectCTA}
                    >
                        View Live →
                    </a>
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

const ProtoServices = ({ zIndex }: { zIndex: number }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const service1Ref = useRef<HTMLDivElement>(null);
    const service2Ref = useRef<HTMLDivElement>(null);
    const service3Ref = useRef<HTMLDivElement>(null);
    const service4Ref = useRef<HTMLDivElement>(null);
    const service5Ref = useRef<HTMLDivElement>(null);

    // Track active illustration index
    const [activeIndex, setActiveIndex] = React.useState(0);

    // Lazy load illustrations
    const MvpIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/MvpIllustration').then(mod => ({ default: mod.MvpIllustration })), { ssr: false });
    const UiUxIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/UiUxIllustration').then(mod => ({ default: mod.UiUxIllustration })), { ssr: false });
    const DevelopmentIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/DevelopmentIllustration').then(mod => ({ default: mod.DevelopmentIllustration })), { ssr: false });
    const IntegrationsIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/IntegrationsIllustration').then(mod => ({ default: mod.IntegrationsIllustration })), { ssr: false });
    const SeoIllustration = dynamic(() => import('@/themes/creative/components/sections/services/illustrations/SeoIllustration').then(mod => ({ default: mod.SeoIllustration })), { ssr: false });

    // Import ServiceFrame
    const { ServiceFrame } = require('./ServiceFrame');

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

// Import Real Header and ScrollProvider
import { Header } from '@/themes/creative/components/header/Header';
import { HeroSection } from '@/themes/creative/components/sections/hero/HeroSection';
import { ScrollProvider } from '@/themes/creative/context/ScrollContext';

export default function MobileTestPage() {
    const projects = getProjectsForDisplay();

    // Theme State for Header
    const [currentTheme, setCurrentTheme] = React.useState<'creative' | 'github'>('creative');
    const [themeMode, setThemeMode] = React.useState<'dark' | 'light'>('dark');

    const handleThemeChange = (theme: 'creative' | 'github') => {
        setCurrentTheme(theme);
    };

    const handleModeToggle = () => {
        setThemeMode(prev => prev === 'dark' ? 'light' : 'dark');
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', themeMode === 'dark' ? 'light' : 'dark');
        }
    };

    // Set initial theme
    useLayoutEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute('data-theme', themeMode);
        }
    }, []);

    return (
        <ScrollProvider>
            <div className={styles.protoRoot}>
                {/* Real Header replacing ProtoHeader */}
                <Header
                    currentTheme={currentTheme}
                    onThemeChange={handleThemeChange}
                    themeMode={themeMode}
                    onModeToggle={handleModeToggle}
                />

                {/* Real Hero Section - sticky by default on mobile via CSS */}
                <div style={{ position: 'relative', zIndex: 0 }}>
                    <HeroSection />
                </div>

                <div className={styles.statsContainer}>
                    {[0, 1, 2].map((i) => (
                        <ProtoStatPanel key={i} index={i} />
                    ))}
                </div>

                <div className={styles.projectsWrapper}>
                    <div className={styles.sectionLabel}>PROJECTS</div>
                    {projects.map((project, index) => (
                        <ProtoProject
                            key={project.id}
                            project={project}
                            index={index}
                            zIndex={30 + index}
                        />
                    ))}
                </div>

                <div className={styles.sectionLabel}>SERVICES</div>
                <ProtoServices zIndex={40} />

                <ProtoContact />
            </div>
        </ScrollProvider>
    );
}
