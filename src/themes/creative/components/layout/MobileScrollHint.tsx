'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './MobileScrollHint.module.css';

/**
 * Bouncing chevron scroll hint — only visible on mobile, fades out after first scroll.
 */
export function MobileScrollHint() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (window.innerWidth > 900) return;

        // Bounce loop
        const anim = gsap.to(el, {
            y: 8,
            duration: 0.9,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
        });

        // Fade out on first scroll
        const handleScroll = () => {
            gsap.to(el, { opacity: 0, duration: 0.4, onComplete: () => { anim.kill(); } });
            window.removeEventListener('scroll', handleScroll);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            anim.kill();
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div ref={ref} className={styles.scrollHint} aria-hidden="true">
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </div>
    );
}
