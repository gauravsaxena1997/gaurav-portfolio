'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { SERVICES } from './servicesData';
import { BackgroundDecor } from '../../common/BackgroundDecor';
import { Highlights, AccentSeparator } from '../../ui';
import styles from './ServicesSection.module.css';

// Lazy load illustrations
// Lazy load illustrations
const AiAppIllustration = dynamic(() => import('./illustrations/AiAppIllustration').then(mod => ({ default: mod.AiAppIllustration })), { ssr: false });
const ImmersiveWebIllustration = dynamic(() => import('./illustrations/ImmersiveWebIllustration').then(mod => ({ default: mod.ImmersiveWebIllustration })), { ssr: false });
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
    const visibleIndices = useRef(new Set<number>());

    // ✅ Intersection Observer for Active State (Laptop Updates)
    useEffect(() => {
        const observerOptions = {
            root: null,
            /* Only trigger when element is in the top 60% of screen, ignoring the bottom 40%
               This delays the 'entry' event until the card has scrolled up significantly. */
            rootMargin: '-10% 0px -40% 0px',
            threshold: 0 // Trigger as soon as it crosses the restricted rootMargin
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                const index = Number(entry.target.getAttribute('data-index'));
                if (!isNaN(index)) {
                    if (entry.isIntersecting) {
                        visibleIndices.current.add(index);
                    } else {
                        visibleIndices.current.delete(index);
                    }
                }
            });

            // Active Service = The highest index currently visible (top of the sticky stack)
            const indices = Array.from(visibleIndices.current);
            const maxIndex = indices.length > 0 ? Math.max(...indices) : 0;

            setActiveServiceIndex(prev => prev !== maxIndex ? maxIndex : prev);
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        // Wait for render
        setTimeout(() => {
            const items = document.querySelectorAll(`.${styles.serviceItem}`);
            items.forEach((item) => observer.observe(item));
        }, 100);

        return () => observer.disconnect();
    }, []);

    // Get current illustration
    const renderIllustration = () => {
        switch (activeServiceIndex) {
            case 0: return <AiAppIllustration />;
            case 1: return <ImmersiveWebIllustration />;
            case 2: return <DevelopmentIllustration />;
            case 3: return <IntegrationsIllustration />;
            case 4: return <SeoIllustration />;
            default: return <AiAppIllustration />;
        }
    };

    return (
        <section id="services-section" className={styles.servicesSection}>
            <div className={styles.contentWrapper}>
                {/* Left Column: Sticky Laptop Animation */}
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

                {/* Right Column: Scrolling Sticky Stack */}
                <div className={styles.rightColumn}>
                    {SERVICES.map((service, index) => (
                        <div
                            key={service.id}
                            className={styles.serviceItem}
                            data-index={index}
                        >
                            {/* Background Decorative Icon - Moved outside content wrapper for proper positioning */}
                            <BackgroundDecor
                                position={{ bottom: '5%', right: '5%' }}
                                size="240px"
                                parallaxSpeed={0.15}
                                className={styles.serviceIconDecor}
                            >
                                <service.icon size={240} strokeWidth={1} />
                            </BackgroundDecor>

                            <div className={styles.serviceContent}>

                                <div className={styles.headerWrapper}>
                                    <div className={styles.serviceHeader}>
                                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                                    </div>
                                    <AccentSeparator />
                                </div>

                                <p className={styles.serviceDescription}>{service.fullDescription}</p>
                                <Highlights items={service.features} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
