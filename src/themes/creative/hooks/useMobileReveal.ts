'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface RevealOptions {
    y?: number;
    duration?: number;
    delay?: number;
    start?: string;
    stagger?: number;
    once?: boolean;
}

/**
 * Hook for intersection-triggered fade-up reveal animations on mobile.
 * Desktop (>900px) is bypassed — elements render at final state.
 * Respects prefers-reduced-motion.
 */
export function useMobileReveal<T extends HTMLElement>(options: RevealOptions = {}) {
    const ref = useRef<T>(null);
    const {
        y = 40,
        duration = 0.6,
        delay = 0,
        start = 'top 85%',
        stagger,
        once = true,
    } = options;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Respect reduced motion
        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        // Only on mobile
        if (window.innerWidth > 900) return;

        const ctx = gsap.context(() => {
            const targets = stagger ? Array.from(el.children) : el;

            gsap.fromTo(
                targets,
                { opacity: 0, y },
                {
                    opacity: 1,
                    y: 0,
                    duration,
                    delay,
                    ease: 'power2.out',
                    stagger: stagger || 0,
                    scrollTrigger: {
                        trigger: el,
                        start,
                        toggleActions: once
                            ? 'play none none none'
                            : 'play reverse play reverse',
                    },
                }
            );
        }, el);

        return () => ctx.revert();
    }, [y, duration, delay, start, stagger, once]);

    return ref;
}
