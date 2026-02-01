'use client';

import { useEffect, useRef, useState } from 'react';
import { LaptopScene } from '@/components/demos/laptop3d/LaptopScene';
import { SERVICES } from './servicesData';
import styles from './ServicesDemo.module.css';
import {
    MvpIllustration,
    UiUxIllustration,
    DevelopmentIllustration,
    IntegrationsIllustration,
    SeoIllustration,
} from './illustrations';

export default function ServicesDemo() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeServiceIndex, setActiveServiceIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            if (!containerRef.current) return;

            const container = containerRef.current;
            const rect = container.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Check if we're in the pinned section
            // Section is active when it's at the top of viewport
            if (rect.top <= 0 && rect.bottom >= windowHeight) {
                // Calculate scroll progress through the pinned section
                // 0 = just entered, 1 = about to exit
                const scrollProgress = Math.abs(rect.top) / (rect.height - windowHeight);

                // Map scroll progress to service index (0-4)
                // Each service gets 20% of the scroll range (1/5 = 0.2)
                const newIndex = Math.min(4, Math.floor(scrollProgress * 5));

                console.log('Scroll Progress:', scrollProgress.toFixed(2), 'Active Index:', newIndex);

                if (newIndex !== activeServiceIndex) {
                    setActiveServiceIndex(newIndex);
                    console.log('Updated active service to:', newIndex, SERVICES[newIndex]?.title);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [activeServiceIndex]);

    return (
        <div className={styles.pageContainer}>
            {/* Intro Section */}
            <section className={styles.intro}>
                <h1 className={styles.mainTitle}>Services</h1>
                <p className={styles.subtitle}>
                    What I offer to bring your vision to life
                </p>
            </section>

            {/* Pinned Services Section */}
            <section ref={containerRef} className={styles.pinnedContainer}>
                {/* Left Column: Laptop (Sticky) */}
                <div className={styles.leftColumn}>
                    <div className={styles.laptopWrapper}>
                        <LaptopScene
                            screenContent={
                                <>
                                    {activeServiceIndex === 0 && <MvpIllustration />}
                                    {activeServiceIndex === 1 && <UiUxIllustration />}
                                    {activeServiceIndex === 2 && <DevelopmentIllustration />}
                                    {activeServiceIndex === 3 && <IntegrationsIllustration />}
                                    {activeServiceIndex === 4 && <SeoIllustration />}
                                </>
                            }
                            showClickText={false}
                            enableMagneticEffect={true}
                            magneticStrength={0.4} // 60% reduced (default is 1.0, so 0.4 is subtle)
                            transparent={true} // No background
                            disableClick={true} // Prevent lid closing
                            defaultOpen={true} // Start in open state
                        />
                    </div>
                </div>

                {/* Right Column: Services (Scroll-reveal) */}
                <div className={styles.rightColumn}>
                    {SERVICES.map((service, index) => (
                        <div
                            key={service.id}
                            className={`${styles.serviceItem} ${activeServiceIndex === index ? styles.activeService : ''
                                }`}
                            data-service-index={index}
                        >
                            <div className={styles.serviceContent}>
                                <div className={styles.serviceHeader}>
                                    <div
                                        className={styles.serviceIcon}
                                        style={{ color: service.color }}
                                    >
                                        <service.icon size={32} strokeWidth={2} />
                                    </div>
                                    <h2 className={styles.serviceTitle}>{service.title}</h2>
                                </div>

                                {/* Vertical Separator */}
                                <div className={styles.separator} style={{ backgroundColor: service.color }} />

                                <p className={styles.serviceDescription}>{service.fullDescription}</p>
                                <ul className={styles.featureList}>
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className={styles.featureItem}>
                                            <span className={styles.checkmark} style={{ color: service.color }}>✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Outro Section */}
            <section className={styles.outro}>
                <h2 className={styles.outroTitle}>Ready to get started?</h2>
                <p className={styles.outroText}>
                    Let's discuss your project and bring your ideas to life.
                </p>
                <a href="#contact" className={styles.ctaButton}>
                    Get in Touch
                </a>
            </section>
        </div>
    );
}
