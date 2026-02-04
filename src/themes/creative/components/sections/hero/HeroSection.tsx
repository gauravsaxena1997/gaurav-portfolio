'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useScrollContext } from '../../../context/ScrollContext';
import { useDeviceCapabilities } from '../../../hooks/useDeviceCapabilities';
import { HERO_CONTENT } from '@/config';
import { SpotlightEffect, SpotlightMode } from './SpotlightEffect';
import { LighthouseIllustration } from './LighthouseIllustration';
import { SocialLinks } from './SocialLinks';
import { AccentSeparator } from '../../ui';
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
        {HERO_CONTENT.greeting.text} <span className={styles.greetingAccent}>{HERO_CONTENT.greeting.accent}</span>
      </p>

      {/* Hero Name - dominant, 70% visual weight */}
      <h1 className={`${styles.heroName} ${animClass} heroName`}>
        {HERO_CONTENT.name}
      </h1>

      {/* Positioning Line - memorable tagline (Client Benefit) */}
      <p className={`${styles.heroTagline} ${animClass} heroTagline`}>
        {HERO_CONTENT.tagline}
      </p>

      {/* Supporting Text - value-focused description (SEO Keywords retained) */}
      <p className={`${styles.heroSubtitle} ${animClass} heroSubtitle`}>
        {HERO_CONTENT.subtitle}
      </p>

      <AccentSeparator className={`${animClass} socialDivider`} />

      {/* Action Row: Social Links + CTA */}
      <div className={`${styles.actionRow} ${animClass} actionRow`}>
        <SocialLinks className={styles.socialLinks} />
        <button
          className={styles.heroCTA}
          onClick={() => {
            const element = document.getElementById('contact-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          Let's Talk
        </button>
      </div>
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
    // Mobile: clamp(120px, 40vw, 180px), anchored to bottom-right corner
    // MATCHING CSS CHANGE: .lighthouseMobile width
    lighthouseWidth = Math.min(180, Math.max(120, 40 * vw));
    rightOffset = 0;
    bottomOffset = 0;

    const lighthouseHeight = lighthouseWidth / SVG_ASPECT_RATIO;
    // Lighthouse positioned at the bottom-right corner
    const lighthouseX = containerWidth - lighthouseWidth;
    const lighthouseY = containerHeight - lighthouseHeight;

    // Lamp position within the SVG
    const lampX = lighthouseX + (lighthouseWidth * 0.5); // Lamp is at horizontal center of SVG
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

    // Text is now visible by default (CSS opacity: 1).
    // We only animate the spotlight/guide bar here.

    tl.to({}, { duration: 0.5 }) // Brief delay before spotlight turns on
      // Enable spotlight after delay
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

  // Scroll-based lighthouse control - turn off when scrolling past 50% of Hero section
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Track previous state to avoid unnecessary toggles
    let wasLightOn = isSpotlightEnabled;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        const visibilityRatio = entry.intersectionRatio;

        // Toggle lighthouse based on 50% threshold
        if (visibilityRatio > 0.5) {
          // More than 50% visible - turn light ON (if it was off)
          if (!wasLightOn) {
            setIsSpotlightEnabled(true);
            wasLightOn = true;
          }
        } else if (visibilityRatio <= 0.5 && visibilityRatio > 0) {
          // Less than 50% visible - turn light OFF (if it was on)
          if (wasLightOn) {
            setIsSpotlightEnabled(false);
            wasLightOn = false;
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0], // Fine-grained tracking
        rootMargin: '0px',
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []); // Run once on mount


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
