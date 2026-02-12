'use client';

import { useRef, useEffect, ReactNode, useId } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BackgroundDecor.module.css';

// Register GSAP plugin
if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export interface BackgroundDecorProps {
    /** The icon, number, or element to render as background decoration */
    children: ReactNode;

    /** Positioning - at least one vertical and one horizontal value required */
    position: {
        top?: string;
        bottom?: string;
        left?: string;
        right?: string;
    };

    /** Size of the container (width & height) - Default: "300px" */
    size?: string;

    /** Animation type - Default: "none" */
    animate?: 'rotate' | 'none';

    /** Parallax scroll speed - Default: 0.15 (0 = disabled, 0.1-0.3 recommended) */
    parallaxSpeed?: number;

    /** Override default accent color */
    color?: string;

    /** Additional CSS classes */
    className?: string;

    /** Variant for different backgrounds (e.g., lit-layer in Stats) */
    variant?: 'default' | 'inverted';
}

/**
 * BackgroundDecor Component
 * 
 * Renders a large, low-opacity decorative element in the background
 * with optional parallax scrolling and rotation animation.
 * 
 * Fixed values (non-configurable for visual consistency):
 * - Opacity: 0.06
 * - Z-index: -1
 * - Pointer-events: none
 * 
 * @example
 * ```tsx
 * <BackgroundDecor
 *   position={{ top: '5%', right: '5%' }}
 *   size="250px"
 *   parallaxSpeed={0.15}
 * >
 *   <Briefcase size={250} strokeWidth={0.5} />
 * </BackgroundDecor>
 * ```
 */
export function BackgroundDecor({
    children,
    position,
    size = '300px',
    animate = 'none',
    parallaxSpeed = 0.15,
    color,
    className = '',
    variant = 'default',
}: BackgroundDecorProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const uniqueId = useId();

    // Set up parallax effect with GSAP ScrollTrigger
    useEffect(() => {
        // Skip if no parallax, no ref, or SSR
        if (parallaxSpeed === 0 || !wrapperRef.current || typeof window === 'undefined') {
            return;
        }

        const element = wrapperRef.current;
        const parentSection = element.closest('section') || element.parentElement;

        if (!parentSection) return;

        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) return;

        // Create parallax effect - moves element vertically based on viewport height
        // Using 'y' (pixels) ensuring consistent movement distance regardless of element size
        // speed 0.15 * window.innerHeight = approx 15% of screen height movement
        // Multiplied by 1.25 to boost intensity as per user feedback (Revision 10)
        const movement = -Math.round(window.innerHeight * parallaxSpeed * 1.25);

        const animation = gsap.to(element, {
            y: movement, // Negative moves up as we scroll down
            ease: 'none',
            scrollTrigger: {
                id: `bg-decor-${uniqueId}`,
                trigger: parentSection,
                start: 'top bottom', // Start when section enters viewport from below
                end: 'bottom top',   // End when section leaves viewport above
                scrub: 0,            // Direct 1:1 scrubbing for immediate response
            },
        });

        // Cleanup ScrollTrigger on unmount
        return () => {
            animation.scrollTrigger?.kill();
            animation.kill();
        };
    }, [parallaxSpeed, uniqueId]);

    // Build inline styles for positioning
    const positionStyles: React.CSSProperties = {
        ...(position.top !== undefined && { top: position.top }),
        ...(position.bottom !== undefined && { bottom: position.bottom }),
        ...(position.left !== undefined && { left: position.left }),
        ...(position.right !== undefined && { right: position.right }),
        width: size,
        height: size,
        ...(color && { color }),
    };

    // Build class names
    const wrapperClasses = [
        styles.wrapper,
        animate === 'rotate' && styles.animateRotate,
        variant === 'inverted' && styles.invertedVariant,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            ref={wrapperRef}
            className={wrapperClasses}
            style={positionStyles}
            aria-hidden="true"
        >
            <div className={styles.element}>{children}</div>
        </div>
    );
}

export default BackgroundDecor;
