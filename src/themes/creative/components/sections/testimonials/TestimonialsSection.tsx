'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TESTIMONIALS } from '@/config/testimonials';
import { TestimonialCard } from './TestimonialCard';
import { SectionDivider } from '@/themes/creative/components/ui';
import styles from './Testimonials.module.css';

gsap.registerPlugin(ScrollTrigger);

export function TestimonialsSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const marqueeRef = useRef<HTMLDivElement>(null);

    // Duplicate testimonials to ensure seamless scrolling if list is short
    // ideally we want enough content to fill screen + buffer.
    // With only 2 items, we need to duplicate significantly (e.g. 4x)
    const MARQUEE_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS, ...TESTIMONIALS];

    useGSAP(() => {
        // Optional: Add scroll-triggered entrance animation for the whole section
        if (containerRef.current) {
            gsap.fromTo(
                containerRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 80%',
                        end: 'top 50%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className={styles.sectionContainer}>
            <div className={styles.sectionHeader}>
                <SectionDivider title="Client Stories" />
            </div>

            <div className={styles.marqueeContainer}>
                <div className={styles.marqueeTrack} ref={marqueeRef}>
                    {MARQUEE_ITEMS.map((item, index) => (
                        <div key={`${item.id}-${index}`} className={styles.desktopCardWrapper}>
                            {/* Wrapper to control width/flex behavior in marquee */}
                            <TestimonialCard
                                data={item}
                                className={styles.desktopCard}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
