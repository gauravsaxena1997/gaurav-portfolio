'use client';

import { useState, useEffect, useRef } from 'react';
import { SERVICES } from './servicesData';
import { BackgroundDecor } from '../../common/BackgroundDecor';
import { Highlights, AccentSeparator } from '../../ui';
import styles from './ServicesSection.module.css';

// Regular imports for preloaded components
import { AiAppIllustration } from './illustrations/AiAppIllustration';
import { ImmersiveWebIllustration } from './illustrations/ImmersiveWebIllustration';
import { DevelopmentIllustration } from './illustrations/DevelopmentIllustration';
import { IntegrationsIllustration } from './illustrations/IntegrationsIllustration';
import { SeoIllustration } from './illustrations/SeoIllustration';
import { LaptopScene } from '@/components/demos/laptop3d';

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
        <section className={styles.servicesSection} data-services-section>
            <div className={`${styles.contentWrapper} flex flex-col w-full mx-auto relative lg:flex-row lg:items-start`}>
                {/* Left Column: Sticky Laptop Animation */}
                <div className={`${styles.leftColumn} w-full h-[50vh] sticky top-[var(--header-height)] flex items-center justify-center z-[5] pointer-events-none lg:w-1/2 lg:h-[var(--viewport-height)] lg:self-start`}>
                    <div className={`${styles.laptopContainer} w-full h-full flex items-center justify-center relative scale-[0.85] lg:scale-100`}>
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
                <div className={`${styles.rightColumn} w-full relative z-[10] flex flex-col lg:w-1/2`}>
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
                                    <div className={`${styles.serviceHeader} flex items-center gap-[var(--space-lg)] mb-0`}>
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
