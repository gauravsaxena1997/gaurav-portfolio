'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useScrollContext } from '../../../context/ScrollContext';
import { useDeviceCapabilities } from '../../../hooks/useDeviceCapabilities';
import { SpotlightEffect, SpotlightMode } from './SpotlightEffect';
import { LighthouseIllustration } from './LighthouseIllustration';
import { SocialLinks } from './SocialLinks';
import styles from './HeroSection.module.css';

// SVG lamp position: cy="67" in 230-height SVG, with lighthouse group translated by 20
// Lamp Y = 67 (in lighthouse coords), so ratio = 67/230 = ~0.29 from top
const SVG_LAMP_Y_RATIO = 67 / 230;
// SVG aspect ratio (width/height) - now 140x230 with land
const SVG_ASPECT_RATIO = 140 / 230;
// Lighthouse is translated 20 units right in the SVG, lamp at x=50+20=70
// So lamp X ratio = 70/140 = 0.5 (centered)


interface HeroContentProps {
  /** Whether to apply entrance animations (mobile only) */
  animate: boolean;
  /** Optional extra className for styling */
  className?: string;
}

/**
 * Hero content - new design system structure
 * Hierarchy: Eyebrow → Name (70% weight) → Positioning → Supporting → Social
 */
function HeroContent({ animate, className }: HeroContentProps) {
  const animClass = animate ? styles.animateIn : '';
  const contentClassName = `${styles.heroContent} ${className ?? ''}`.trim();

  return (
    <div className={contentClassName}>
      <p className={`${styles.greeting} ${animClass} greeting`}>
        Freelancer &middot; Creative <span className={styles.greetingAccent}>Technologist</span>
      </p>

      {/* Hero Name - dominant, 70% visual weight */}
      <h1 className={`${styles.heroName} ${animClass} heroName`}>
        GAURAV SAXENA
      </h1>

      {/* Positioning Line - memorable tagline (Client Benefit) */}
      <p className={`${styles.heroTagline} ${animClass} heroTagline`}>
        Building immersive, high-performance web platforms that drive growth.
      </p>

      {/* Supporting Text - value-focused description (SEO Keywords retained) */}
      <p className={`${styles.heroSubtitle} ${animClass} heroSubtitle`}>
        Full Stack Architect specializing in scalable systems, 3D experiences, and AI-driven engineering.
      </p>

      <div className={`${styles.socialDivider} ${animClass} socialDivider`} aria-hidden="true" />

      {/* Social Links */}
      <SocialLinks className={`${animClass} socialLinks`} />
    </div>
  );
}

/**
 * Calculate lamp position based on container dimensions and device type
 * The lamp is at cy="67" in a 180-height SVG, positioned at bottom-right (or center for mobile)
 */
function calculateLampPosition(
  containerWidth: number,
  containerHeight: number,
  isTouchDevice: boolean
): { x: number; y: number } {
  // Parse clamp values for lighthouse width
  // Desktop: clamp(80px, 10vw, 140px)
  // Mobile: clamp(60px, 15vw, 100px)
  const vw = containerWidth / 100;

  let lighthouseWidth: number;
  let rightOffset: number;
  let bottomOffset: number;

  if (isTouchDevice) {
    // Mobile: clamp(100px, 30vw, 150px), anchored to bottom-right corner
    lighthouseWidth = Math.min(150, Math.max(100, 30 * vw));
    rightOffset = 0;
    bottomOffset = 0;

    const lighthouseHeight = lighthouseWidth / SVG_ASPECT_RATIO;
    // Lighthouse positioned at the corner, lamp is at 50% of width (centered in SVG)
    const lighthouseX = containerWidth - lighthouseWidth / 2;
    const lighthouseY = containerHeight - lighthouseHeight;

    // Lamp position within the SVG
    const lampX = lighthouseX;
    const lampY = lighthouseY + lighthouseHeight * SVG_LAMP_Y_RATIO;

    return {
      x: lampX / containerWidth,
      y: lampY / containerHeight,
    };
  } else {
    // Desktop: clamp(145px, 18vw, 240px), anchored to bottom-right corner
    lighthouseWidth = Math.min(240, Math.max(145, 18 * vw));
    rightOffset = 0;
    bottomOffset = 0;

    const lighthouseHeight = lighthouseWidth / SVG_ASPECT_RATIO;

    // Lighthouse positioned at bottom-right corner, lamp at center of SVG width
    const lighthouseX = containerWidth - lighthouseWidth / 2;
    const lighthouseY = containerHeight - lighthouseHeight;

    // Lamp position within the SVG
    const lampX = lighthouseX;
    const lampY = lighthouseY + lighthouseHeight * SVG_LAMP_Y_RATIO;

    return {
      x: lampX / containerWidth,
      y: lampY / containerHeight,
    };
  }
}

/**
 * HeroSection - Main hero component with lighthouse spotlight effect
 * Uses blend mode for natural color inversion effect
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useScrollContext();
  const { isTouchDevice, prefersReducedMotion } = useDeviceCapabilities();

  // Container dimensions for lamp position calculation
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Spotlight toggle state - disabled initially, enabled after entrance animation
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(false);

  // Determine spotlight mode based on device capabilities
  const spotlightMode: SpotlightMode = useMemo(() => {
    if (prefersReducedMotion) return 'static';
    if (!isTouchDevice) return 'mouse';
    return 'touch'; // Touch devices use touch-to-position mode
  }, [isTouchDevice, prefersReducedMotion]);

  // Check if hero section is active for performance optimization
  const isActive = activeSection === 'hero' || activeSection === 'stats';

  // Entrance animation on mount
  useEffect(() => {
    // Don't animate if user prefers reduced motion
    if (prefersReducedMotion) {
      setIsSpotlightEnabled(true);
      return;
    }

    // GSAP staggered entrance animation
    const tl = gsap.timeline();

    // Set initial state (redundant safety in case CSS doesn't load)
    gsap.set(['.greeting', '.heroName', '.heroTagline', '.heroSubtitle', '.socialDivider', '.socialLinks'], {
      opacity: 0,
      // Removed x: -30 to avoid horizontal overflow/gaps
    });

    // Staggered animation sequence (fade-in only)
    tl.to(
      ['.greeting', '.heroName', '.heroTagline', '.heroSubtitle', '.socialDivider', '.socialLinks'],
      {
        opacity: 1,
        // Removed x: 0
        duration: 0.375, // 25% faster than 0.5s
        ease: 'power2.out',
        stagger: 0.09, // 25% faster than 0.12s (90ms delay between each element)
        // Total time: 0.375s + (5 × 0.09s) = 0.825s
      }
    )
      // Enable spotlight after all text finishes
      .call(() => {
        setIsSpotlightEnabled(true);
        // Wait a moment after lighthouse lights up, then emit event for GuideBar
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('hero-entrance-complete'));
        }, 500); // 500ms after lighthouse lights up
      });

    return () => {
      tl.kill(); // Cleanup on unmount
    };
  }, [prefersReducedMotion]);

  // Track container dimensions with ResizeObserver
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateDimensions = () => {
      setContainerDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      });
    };

    // Initial measurement
    updateDimensions();

    const resizeObserver = new ResizeObserver(updateDimensions);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Calculate lamp position dynamically
  const lighthouseOrigin = useMemo(() => {
    if (containerDimensions.width === 0 || containerDimensions.height === 0) {
      // Fallback to approximate positions before measurement
      return isTouchDevice ? { x: 0.5, y: 0.7 } : { x: 0.92, y: 0.65 };
    }
    return calculateLampPosition(
      containerDimensions.width,
      containerDimensions.height,
      isTouchDevice
    );
  }, [containerDimensions.width, containerDimensions.height, isTouchDevice]);

  // Keyboard handler for 'L' key toggle
  const handleToggle = useCallback(() => {
    setIsSpotlightEnabled(prev => !prev);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only respond to 'L' key when not typing in an input
      if (
        event.key.toLowerCase() === 'l' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        handleToggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleToggle]);


  return (
    <div ref={containerRef} className={styles.heroContainer}>
      {/* Content Layer */}
      <div className={styles.baseLayer}>
        <HeroContent animate={false} />
      </div>

      {/* Spotlight Overlay - deterministic beam with explicit text colors */}
      <SpotlightEffect
        containerRef={containerRef}
        lighthouseOrigin={lighthouseOrigin}
        mode={spotlightMode}
        isActive={isActive}
        isEnabled={isSpotlightEnabled}
      />

      {/* Lit text layer - clipped to spotlight beam */}
      <div
        className={`${styles.litLayer} ${isSpotlightEnabled ? styles.litLayerActive : ''}`.trim()}
        aria-hidden="true"
      >
        <HeroContent animate={false} />
      </div>

      {/* Non-blending layer - sits ABOVE spotlight, unaffected by mix-blend-mode */}
      <div className={styles.nonBlendingLayer}>
        {/* Lighthouse - inside non-blending layer to prevent color inversion */}
        <div
          className={`
            ${styles.lighthouse}
            ${styles.lighthouseClickable}
            ${isTouchDevice ? styles.lighthouseMobile : ''}
          `.trim()}
        >
          <LighthouseIllustration isLampOn={isSpotlightEnabled} onClick={handleToggle} />
        </div>
      </div>
    </div>
  );
}
