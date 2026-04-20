'use client';

import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export type AnimationType =
    | 'slideUp'
    | 'slideFromLeft'
    | 'slideFromRight'
    | 'clipReveal'
    | 'scaleIn'
    | 'staggerChildren'
    | 'fadeIn';

interface SectionAnimationOptions {
    type?: AnimationType;
    duration?: number;
    delay?: number;
    staggerDelay?: number;
    start?: string;
    once?: boolean;
    distance?: number;
    ease?: string;
    childSelector?: string;
}

/**
 * Rich GSAP scroll-triggered animation hook for mobile sections.
 * Supports slideUp, slideFromLeft/Right, clipReveal, scaleIn, staggerChildren.
 * Desktop (>900px) and reduced-motion users get immediate final state.
 */
export function useMobileSectionAnimation<T extends HTMLElement>(
    options: SectionAnimationOptions = {}
) {
    const ref = useRef<T>(null);
    const {
        type = 'slideUp',
        duration = 0.7,
        delay = 0,
        staggerDelay = 0.1,
        start = 'top bottom',
        once = true,
        distance = 40,
        ease = 'power3.out',
        childSelector,
    } = options;

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        // Only animate on mobile
        if (window.innerWidth > 900) return;

        const ctx = gsap.context(() => {
            const trigger = {
                trigger: el,
                start,
                toggleActions: once ? 'play none none none' : 'play reverse play reverse',
            };

            switch (type) {
                case 'slideUp': {
                    gsap.fromTo(
                        el,
                        { opacity: 0, y: distance },
                        { opacity: 1, y: 0, duration, delay, ease, scrollTrigger: trigger }
                    );
                    break;
                }

                case 'slideFromLeft': {
                    gsap.fromTo(
                        el,
                        { opacity: 0, x: -distance },
                        { opacity: 1, x: 0, duration, delay, ease, scrollTrigger: trigger }
                    );
                    break;
                }

                case 'slideFromRight': {
                    gsap.fromTo(
                        el,
                        { opacity: 0, x: distance },
                        { opacity: 1, x: 0, duration, delay, ease, scrollTrigger: trigger }
                    );
                    break;
                }

                case 'clipReveal': {
                    gsap.fromTo(
                        el,
                        {
                            clipPath: 'inset(100% 0% 0% 0%)',
                            opacity: 1,
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0%)',
                            opacity: 1,
                            duration,
                            delay,
                            ease: 'power4.out',
                            scrollTrigger: trigger,
                        }
                    );
                    break;
                }

                case 'scaleIn': {
                    gsap.fromTo(
                        el,
                        { opacity: 0, scale: 0.92, transformOrigin: 'center bottom' },
                        { opacity: 1, scale: 1, duration, delay, ease: 'back.out(1.4)', scrollTrigger: trigger }
                    );
                    break;
                }

                case 'staggerChildren': {
                    const targets = childSelector
                        ? Array.from(el.querySelectorAll(childSelector))
                        : Array.from(el.children);

                    if (targets.length === 0) break;

                    gsap.fromTo(
                        targets,
                        { opacity: 0, y: distance },
                        {
                            opacity: 1,
                            y: 0,
                            duration,
                            delay,
                            ease,
                            stagger: staggerDelay,
                            scrollTrigger: trigger,
                        }
                    );
                    break;
                }

                case 'fadeIn': {
                    gsap.fromTo(
                        el,
                        { opacity: 0 },
                        { opacity: 1, duration, delay, ease, scrollTrigger: trigger }
                    );
                    break;
                }
            }
        }, el);

        return () => ctx.revert();
    }, [type, duration, delay, staggerDelay, start, once, distance, ease, childSelector]);

    return ref;
}

/**
 * Animate multiple named elements inside a container with coordinated timing.
 * Pass refs as an object: { title, separator, body, illustration }
 */
export function useMobileCoordinatedReveal(
    containerRef: React.RefObject<HTMLElement | null>,
    options: {
        start?: string;
        once?: boolean;
    } = {}
) {
    const titleRef = useRef<HTMLElement>(null);
    const separatorRef = useRef<HTMLElement>(null);
    const bodyRef = useRef<HTMLElement>(null);
    const listRef = useRef<HTMLElement>(null);
    const illustrationRef = useRef<HTMLElement>(null);
    const { start = 'top 85%', once = true } = options;

    useLayoutEffect(() => {
        if (!containerRef.current) return;

        const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        if (window.innerWidth > 900) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start,
                    toggleActions: once ? 'play none none none' : 'play reverse play reverse',
                },
            });

            if (titleRef.current) {
                tl.fromTo(
                    titleRef.current,
                    { opacity: 0, y: 24 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
                    0
                );
            }

            if (separatorRef.current) {
                tl.fromTo(
                    separatorRef.current,
                    { scaleX: 0, transformOrigin: 'left center' },
                    { scaleX: 1, duration: 0.5, ease: 'power2.out' },
                    0.2
                );
            }

            if (bodyRef.current) {
                tl.fromTo(
                    bodyRef.current,
                    { opacity: 0, y: 16 },
                    { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' },
                    0.3
                );
            }

            if (listRef.current) {
                const items = Array.from(listRef.current.children);
                if (items.length > 0) {
                    tl.fromTo(
                        items,
                        { opacity: 0, x: -16 },
                        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', stagger: 0.07 },
                        0.45
                    );
                }
            }

            if (illustrationRef.current) {
                tl.fromTo(
                    illustrationRef.current,
                    { opacity: 0, scale: 0.88, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'back.out(1.2)' },
                    0.25
                );
            }
        }, containerRef.current!);

        return () => ctx.revert();
    }, [containerRef, start, once]);

    return { titleRef, separatorRef, bodyRef, listRef, illustrationRef };
}
