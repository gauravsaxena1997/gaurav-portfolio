'use client';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { useScrollContext } from '../../../context/ScrollContext';
import { useDeviceCapabilities } from '../../../hooks/useDeviceCapabilities';
import { SpotlightEffect, SpotlightMode } from './SpotlightEffect';
import { LighthouseIllustration } from './LighthouseIllustration';
import { SocialLinks } from './SocialLinks';
import { Snackbar, SnackbarKey } from '../../ui';
import styles from './HeroSection.module.css';

// localStorage key for snackbar dismissal
const SPOTLIGHT_HINT_DISMISSED_KEY = 'spotlight-hint-dismissed';
// Delay before showing the hint snackbar (in milliseconds)
const HINT_DELAY_MS = 8000;

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
}

/**
 * Hero content - tagline, title, subtitle
 * Single layer - mix-blend-mode handles color inversion automatically
 */
function HeroContent({ animate }: HeroContentProps) {
  const animClass = animate ? styles.animateIn : '';

  return (
    <div className={styles.heroContent}>
      <p className={`${styles.greeting} ${animClass}`}>Hi, I&apos;m Gaurav Saxena</p>
      <p className={`${styles.tagline} ${animClass}`}>Software Engineer & Creative Developer</p>
      <h1 className={`${styles.heroTitle} ${animClass}`}>
        Crafting Digital
        <br />
        <span className={styles.titleAccent}>Experiences</span>
      </h1>
      <p className={`${styles.heroSubtitle} ${animClass}`}>
        I build performant, accessible, and visually engaging web experiences
        that blend technical excellence with creative innovation.
      </p>
      <SocialLinks className={animClass} />
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
 * Uses two-layer system: base layer + clipped overlay for color inversion
 */
export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { activeSection } = useScrollContext();
  const { isTouchDevice, prefersReducedMotion } = useDeviceCapabilities();

  // Container dimensions for lamp position calculation
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Spotlight toggle state
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(true);

  // Snackbar hint visibility state
  const [showHintSnackbar, setShowHintSnackbar] = useState(false);

  // Animation state for mobile entrance animations
  const [hasAnimated, setHasAnimated] = useState(false);

  // Determine spotlight mode based on device capabilities
  const spotlightMode: SpotlightMode = useMemo(() => {
    if (prefersReducedMotion) return 'static';
    if (!isTouchDevice) return 'mouse';
    return 'touch'; // Touch devices use touch-to-position mode
  }, [isTouchDevice, prefersReducedMotion]);

  // Check if hero section is active for performance optimization
  const isActive = activeSection === 'hero' || activeSection === 'stats';

  // Trigger entrance animations on mount (mobile only)
  useEffect(() => {
    if (isTouchDevice && !prefersReducedMotion) {
      // Small delay to ensure layout is ready
      const timer = setTimeout(() => setHasAnimated(true), 100);
      return () => clearTimeout(timer);
    } else {
      // No animations on desktop or reduced motion
      setHasAnimated(false);
    }
  }, [isTouchDevice, prefersReducedMotion]);

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

  // Auto-show hint snackbar after delay if user hasn't dismissed it before
  useEffect(() => {
    // Check if user has already dismissed the hint
    const isDismissed = localStorage.getItem(SPOTLIGHT_HINT_DISMISSED_KEY) === 'true';
    if (isDismissed) return;

    // Only show if user is on hero section
    if (!isActive) return;

    const timer = setTimeout(() => {
      // Double-check user is still on hero section
      if (isActive) {
        setShowHintSnackbar(true);
      }
    }, HINT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [isActive]);

  // Handle snackbar dismissal
  const handleDismissHint = useCallback(() => {
    setShowHintSnackbar(false);
    // Remember dismissal in localStorage
    try {
      localStorage.setItem(SPOTLIGHT_HINT_DISMISSED_KEY, 'true');
    } catch {
      // localStorage might be unavailable in some contexts
    }
  }, []);

  return (
    <div ref={containerRef} className={styles.heroContainer}>
      {/* Content Layer */}
      <div className={styles.baseLayer}>
        <HeroContent animate={hasAnimated && isTouchDevice} />
      </div>

      {/* Spotlight Overlay - mix-blend-mode: difference automatically inverts colors */}
      <SpotlightEffect
        containerRef={containerRef}
        lighthouseOrigin={lighthouseOrigin}
        mode={spotlightMode}
        isActive={isActive}
        isEnabled={isSpotlightEnabled}
      />

      {/* Non-blending layer - sits ABOVE spotlight, unaffected by mix-blend-mode */}
      <div className={styles.nonBlendingLayer}>
        {/* Lighthouse - inside non-blending layer to prevent color inversion */}
        <div
          className={`
            ${styles.lighthouse}
            ${styles.lighthouseClickable}
            ${isTouchDevice ? styles.lighthouseMobile : ''}
            ${hasAnimated && isTouchDevice ? styles.animateIn : ''}
            ${isSpotlightEnabled && isTouchDevice ? styles.glowActive : ''}
          `.trim()}
        >
          <LighthouseIllustration isLampOn={isSpotlightEnabled} onClick={handleToggle} />
        </div>
      </div>

      {/* Hint snackbar - shows once after delay for first-time visitors */}
      <Snackbar isVisible={showHintSnackbar} onClose={handleDismissHint}>
        {isTouchDevice ? (
          <>Tap the lighthouse to toggle the spotlight</>
        ) : (
          <>
            Click the lighthouse or press <SnackbarKey>L</SnackbarKey> to toggle spotlight
          </>
        )}
      </Snackbar>
    </div>
  );
}
