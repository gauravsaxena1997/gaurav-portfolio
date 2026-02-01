'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SERVICES } from './servicesData';
import styles from './ServicesSection.module.css';

// Lazy load illustrations
const MvpIllustration = dynamic(() => import('./illustrations/MvpIllustration').then(mod => ({ default: mod.MvpIllustration })), { ssr: false });
const UiUxIllustration = dynamic(() => import('./illustrations/UiUxIllustration').then(mod => ({ default: mod.UiUxIllustration })), { ssr: false });
const DevelopmentIllustration = dynamic(() => import('./illustrations/DevelopmentIllustration').then(mod => ({ default: mod.DevelopmentIllustration })), { ssr: false });
const IntegrationsIllustration = dynamic(() => import('./illustrations/IntegrationsIllustration').then(mod => ({ default: mod.IntegrationsIllustration })), { ssr: false });
const SeoIllustration = dynamic(() => import('./illustrations/SeoIllustration').then(mod => ({ default: mod.SeoIllustration })), { ssr: false });

// Lazy load LaptopScene
const LaptopScene = dynamic(
    () => import('@/components/demos/laptop3d').then(mod => ({ default: mod.LaptopScene })),
    { ssr: false, loading: () => <div className={styles.laptopLoading}>Loading...</div> }
);

export function ServicesSection() {
    const [activeServiceIndex, setActiveServiceIndex] = useState(0);
    const containerRef = useRef<HTMLElement>(null);
    const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Scroll-based service switching (Progress Calculation like Demo)
    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if we're intersecting or inside the section
            // We want to calculate progress as we scroll through the component
            if (rect.top <= windowHeight && rect.bottom >= 0) {
                // Calculate acceptable scroll range
                // We add windowHeight to make sure it tracks as soon as it enters
                const scrolled = Math.abs(Math.min(0, rect.top));
                const totalScrollableHeight = rect.height - windowHeight;

                // Avoid division by zero
                if (totalScrollableHeight <= 0) return;

                const scrollProgress = Math.min(1, Math.max(0, scrolled / totalScrollableHeight));

                // Map scroll progress to service index (0-4)
                const newIndex = Math.min(4, Math.floor(scrollProgress * 5));

                if (newIndex !== activeServiceIndex) {
                    setActiveServiceIndex(newIndex);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeServiceIndex]);

    // Get current illustration based on active service
    const renderIllustration = () => {
        switch (activeServiceIndex) {
            case 0: return <MvpIllustration />;
            case 1: return <UiUxIllustration />;
            case 2: return <DevelopmentIllustration />;
            case 3: return <IntegrationsIllustration />;
            case 4: return <SeoIllustration />;
            default: return <MvpIllustration />;
        }
    };

    return (
        <section ref={containerRef} className={styles.servicesSection}>
            <div className={styles.stickyContainer}>
                {/* Left Column: Pinned Laptop */}
                <div className={styles.leftColumn}>
                    <div className={styles.laptopContainer}>
                        <LaptopScene
                            screenContent={renderIllustration()}
                            showClickText={false}
                            enableMagneticEffect={true}
                            transparent={true}
                            defaultOpen={true}
                            disableClick={true}
                            magneticStrength={0.3}
                        />
                    </div>
                </div>

                {/* Right Column: Stacked Service Details */}
                <div className={styles.rightColumn}>
                    {SERVICES.map((service, index) => (
                        <div
                            key={service.id}
                            ref={(el) => { serviceRefs.current[index] = el; }}
                            className={`${styles.serviceItem} ${index === activeServiceIndex ? styles.active : ''}`}
                        >
                            <div className={styles.serviceContent}>
                                <div className={styles.headerWrapper}>
                                    <div className={styles.serviceHeader}>
                                        <div className={styles.serviceIcon}>
                                            <service.icon size={32} strokeWidth={2} />
                                        </div>
                                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                                    </div>
                                    <div className={styles.separator} />
                                </div>

                                <p className={styles.serviceDescription}>{service.fullDescription}</p>
                                <ul className={styles.featureList}>
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className={styles.featureItem}>
                                            <span className={styles.checkmark}>✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
