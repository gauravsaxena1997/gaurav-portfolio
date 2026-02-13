'use client';

import { memo } from 'react';

interface LighthouseIllustrationProps {
  /** Whether the lamp is on (controls lamp glow) */
  isLampOn?: boolean;
  /** CSS class name */
  className?: string;
  /** Click handler for toggling spotlight */
  onClick?: () => void;
}

/**
 * SVG lighthouse illustration with theme-aware colors
 * Includes rocky cliff/land base for grounded appearance
 * Colors invert automatically via mix-blend-mode on spotlight overlay
 */
export const LighthouseIllustration = memo(function LighthouseIllustration({
  isLampOn = true,
  className,
  onClick,
}: LighthouseIllustrationProps) {
  // Color scheme based on lamp state
  // Using warm sand beige for tower parts - premium feel, contrasts well with rocks
  // and doesn't invert badly with spotlight's mix-blend-mode
  const colors = {
    tower: '#D4C4B0',                  // Warm sand beige
    towerStripe: '#C9B89D',            // Slightly darker beige for stripes
    lampHouse: '#BFB09C',              // Darker beige for lamp house
    lamp: isLampOn ? 'var(--creative-accent-subtle)' : '#C9B89D',
    lampGlow: isLampOn ? 'var(--creative-accent-subtle)' : 'transparent',
    roof: '#A89880',                   // Darker roof for contrast
    base: '#BFB09C',                   // Match lamp house
    window: '#4A4035',                 // Dark warm brown windows
    // Land/cliff colors - Natural rock tones (neutral grays with slight warmth)
    // Avoid using text-primary/secondary to prevent extreme contrast in light/dark modes
    cliffDark: 'var(--creative-rock-dark)',   // #4a4a4a equivalent in theme
    cliffMid: 'var(--creative-rock-mid)',     // #6b6b6b equivalent
    cliffLight: 'var(--creative-rock-light)', // #8c8c8c equivalent
  };

  return (
    <svg
      viewBox="0 0 140 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      onClick={onClick}
      style={{
        ...(onClick ? { cursor: 'pointer', outline: 'none' } : {}),
        // GPU acceleration to prevent sub-pixel flickering during scroll
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
      shapeRendering="geometricPrecision"
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? (isLampOn ? 'Turn off spotlight' : 'Turn on spotlight') : undefined}
      aria-hidden={!onClick}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {/* Glow effect for lamp */}
      <defs>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={colors.lampGlow} stopOpacity="0.6" />
          <stop offset="100%" stopColor={colors.lampGlow} stopOpacity="0" />
        </radialGradient>
        <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Rocky cliff/land - tapers to a point on the left, full height on right */}
      {/* Main land mass - diagonal shoreline tapering left */}
      {/* Rocky cliff/land - tapers to a point on the left, full height on right */}
      {/* Main land mass - diagonal shoreline tapering left. Opaque for visibility */}
      <path
        d="M0 230 L 35 175 C 45 172, 50 170, 60 172 L 60 175 L 80 175 L 80 172 C 95 170, 110 168, 140 165 L 140 230 Z"
        fill={colors.cliffDark}
        opacity="0.9" // Increased from 0.5
      />
      {/* Middle layer - follows the taper */}
      <path
        d="M15 230 L 40 180 C 50 177, 55 176, 62 177 L 62 175 L 78 175 L 78 177 C 100 174, 120 172, 140 175 L 140 230 Z"
        fill={colors.cliffMid}
        opacity="0.7" // Increased from 0.35
      />
      {/* Top surface layer - closest to lighthouse */}
      <path
        d="M30 230 L 48 188 C 55 185, 60 184, 65 185 L 65 175 L 75 175 L 75 185 C 95 182, 115 180, 140 185 L 140 230 Z"
        fill={colors.cliffLight}
        opacity="0.5" // Increased from 0.25
      />
      {/* Rock texture details along the slope */}
      <ellipse cx="50" cy="200" rx="6" ry="3" fill={colors.cliffMid} opacity="0.4" />
      <ellipse cx="110" cy="195" rx="8" ry="4" fill={colors.cliffMid} opacity="0.4" />
      <ellipse cx="70" cy="210" rx="5" ry="2" fill={colors.cliffDark} opacity="0.3" />
      <ellipse cx="125" cy="215" rx="7" ry="3" fill={colors.cliffDark} opacity="0.3" />

      {/* Lighthouse group - centered on the land */}
      <g transform="translate(20, 0)">
        {/* Base/foundation */}
        <rect x="20" y="165" width="60" height="15" rx="2" fill={colors.base} />

        {/* Tower body - single unified path to prevent seam flickering */}
        <path
          d="M30 165 L25 90 L75 90 L70 165 Z"
          fill={colors.tower}
        />

        {/* Horizontal stripes */}
        <rect x="27" y="105" width="46" height="8" fill={colors.towerStripe} opacity="0.3" />
        <rect x="28" y="125" width="44" height="8" fill={colors.towerStripe} opacity="0.3" />
        <rect x="29" y="145" width="42" height="8" fill={colors.towerStripe} opacity="0.3" />

        {/* Windows */}
        <rect x="42" y="110" width="6" height="10" rx="1" fill={colors.window} />
        <rect x="52" y="110" width="6" height="10" rx="1" fill={colors.window} />
        <rect x="42" y="130" width="6" height="10" rx="1" fill={colors.window} />
        <rect x="52" y="130" width="6" height="10" rx="1" fill={colors.window} />
        <rect x="47" y="150" width="6" height="12" rx="1" fill={colors.window} />

        {/* Lamp house gallery (balcony) */}
        <rect x="20" y="85" width="60" height="5" rx="1" fill={colors.base} />

        {/* Lamp house structure */}
        <rect x="30" y="50" width="40" height="35" rx="2" fill={colors.lampHouse} />

        {/* Lamp house windows (glass panels) */}
        <rect x="33" y="53" width="8" height="29" rx="1" fill={colors.window} opacity="0.7" />
        <rect x="43" y="53" width="14" height="29" rx="1" fill={colors.window} opacity="0.7" />
        <rect x="59" y="53" width="8" height="29" rx="1" fill={colors.window} opacity="0.7" />

        {/* The lamp/light itself */}
        <circle
          cx="50"
          cy="67"
          r="12"
          fill="url(#lampGlow)"
          style={{ transition: 'fill 0.3s ease' }}
        />
        <circle
          cx="50"
          cy="67"
          r="8"
          fill={colors.lamp}
          filter={isLampOn ? 'url(#glowFilter)' : undefined}
          style={{ transition: 'fill 0.3s ease' }}
        />

        {/* Roof */}
        <path
          d="M25 50 L50 20 L75 50 Z"
          fill={colors.roof}
        />

        {/* Roof finial (top piece) */}
        <rect x="48" y="12" width="4" height="10" rx="1" fill={colors.roof} />
        <circle cx="50" cy="10" r="4" fill={colors.roof} />
      </g>
    </svg>
  );
});
