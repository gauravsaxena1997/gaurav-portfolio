'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import styles from './SectionDivider.module.css';

gsap.registerPlugin(ScrollTrigger);

interface SectionDividerProps {
    /** The heading text to display */
    title: string;
    /** Optional additional className */
    className?: string;
}

/**
 * SectionDivider - Scroll-through section header
 * 
 * Displays a large, centered heading with decorative line
 * that fades in as it enters the viewport.
 */
export function SectionDivider({ title, className = '' }: SectionDividerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const container = containerRef.current;
            if (!container) return;

            // Fade-in animation as divider enters viewport
            gsap.fromTo(
                container,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.95,
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: container,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse',
                    },
                }
            );
        },
        { scope: containerRef }
    );

    return (
        <div ref={containerRef} className={`${styles.divider} ${className}`}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.line} />
        </div>
    );
}
