'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import type { CharacterState } from './hooks/useCharacterTracking';
import styles from './InteractiveCharacter.module.css';

interface InteractiveCharacterProps {
  characterState: CharacterState;
  className?: string;
}

/**
 * Interactive Character with eye tracking and expressions
 * Personalized SVG based on Gaurav's photo
 *
 * Features:
 * - Modern undercut hairstyle, swept to the right
 * - Medium brown skin tone
 * - No glasses
 * - Light stubble
 * - Eye tracking & head tilt
 * - Expression-based mouth animation
 */
export const InteractiveCharacter = memo(function InteractiveCharacter({
  characterState,
  className,
}: InteractiveCharacterProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [blinking, setBlinking] = useState(false);

  // Random blink effect (every 3-6 seconds)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };

    const scheduleNextBlink = () => {
      const delay = 3000 + Math.random() * 3000;
      return setTimeout(() => {
        blink();
        blinkTimer = scheduleNextBlink();
      }, delay);
    };

    let blinkTimer = scheduleNextBlink();

    return () => {
      clearTimeout(blinkTimer);
    };
  }, []);

  // Floating animation
  useEffect(() => {
    if (!svgRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const character = svgRef.current.querySelector('.character-body');
    if (character) {
      gsap.to(character, {
        y: -6,
        repeat: -1,
        yoyo: true,
        duration: 3,
        ease: 'sine.inOut',
      });
    }

    return () => {
      if (character) gsap.killTweensOf(character);
    };
  }, []);

  // Calculate eye and mouth positions based on state
  const pupilOffsetX = characterState.eyeX * 6;
  const pupilOffsetY = characterState.eyeY * 4;
  const headRotation = characterState.headTiltX * 0.5;

  // Expression: mouth curve based on expression value (0-100)
  const smileCurve = (characterState.expression - 50) / 50;
  const mouthY = 158 + smileCurve * -6;
  const mouthCurve = 166 + smileCurve * 10;

  // Eyebrow position based on expression
  const eyebrowRaise = (characterState.expression - 50) / 100 * 4;

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <svg
        ref={svgRef}
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.svg}
        aria-label="Gaurav's animated character illustration"
      >
        <defs>
          {/* Skin gradient - Medium brown/olive tone */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4956a" />
            <stop offset="50%" stopColor="#c68642" />
            <stop offset="100%" stopColor="#a67035" />
          </linearGradient>

          {/* Skin shadow for depth */}
          <linearGradient id="skinShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c68642" />
            <stop offset="100%" stopColor="#8d5524" />
          </linearGradient>

          {/* Hair gradient - Near black */}
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2d2d2d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Hair highlight */}
          <linearGradient id="hairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="100%" stopColor="#2d2d2d" />
          </linearGradient>

          {/* Shirt gradient - Black like in photo */}
          <linearGradient id="shirtGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>

          {/* Shadow filter */}
          <filter id="charShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>

          {/* Eye highlight filter */}
          <filter id="eyeHighlight" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Stubble pattern */}
          <pattern id="stubblePattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.5" fill="#1a1a1a" opacity="0.3" />
            <circle cx="3" cy="3" r="0.4" fill="#1a1a1a" opacity="0.25" />
          </pattern>
        </defs>

        {/* Shadow underneath */}
        <ellipse
          cx="100"
          cy="272"
          rx="50"
          ry="8"
          fill="var(--creative-text-secondary)"
          opacity="0.12"
          filter="url(#charShadow)"
        />

        <g
          className="character-body"
          transform={`rotate(${headRotation}, 100, 150)`}
        >
          {/* ===== SHOULDERS & BLACK T-SHIRT ===== */}
          <path
            d="M 40 230 Q 40 195 100 195 Q 160 195 160 230 L 160 280 L 40 280 Z"
            fill="url(#shirtGrad)"
          />
          {/* Shirt collar (crew neck) */}
          <path
            d="M 82 195 Q 100 208 118 195"
            stroke="#3a3a3a"
            strokeWidth="2"
            fill="none"
          />
          {/* Subtle shirt fold highlight */}
          <ellipse
            cx="72"
            cy="240"
            rx="12"
            ry="18"
            fill="white"
            opacity="0.05"
          />

          {/* ===== NECK ===== */}
          <rect
            x="82"
            y="168"
            width="36"
            height="32"
            fill="url(#skinGrad)"
          />
          {/* Neck shadow */}
          <ellipse
            cx="100"
            cy="195"
            rx="18"
            ry="5"
            fill="#8d5524"
            opacity="0.3"
          />

          {/* ===== FACE/HEAD - Oval with defined jaw ===== */}
          <ellipse
            cx="100"
            cy="105"
            rx="52"
            ry="62"
            fill="url(#skinGrad)"
          />
          {/* Jaw definition */}
          <path
            d="M 55 120 Q 60 160 100 168 Q 140 160 145 120"
            fill="url(#skinShadow)"
            opacity="0.15"
          />

          {/* Face highlight (forehead/cheek) */}
          <ellipse
            cx="75"
            cy="85"
            rx="20"
            ry="25"
            fill="white"
            opacity="0.12"
          />

          {/* ===== EARS ===== */}
          <ellipse cx="48" cy="110" rx="7" ry="13" fill="url(#skinGrad)" />
          <ellipse cx="152" cy="110" rx="7" ry="13" fill="url(#skinGrad)" />
          {/* Inner ear detail */}
          <ellipse cx="49" cy="110" rx="3" ry="7" fill="#a67035" opacity="0.4" />
          <ellipse cx="151" cy="110" rx="3" ry="7" fill="#a67035" opacity="0.4" />

          {/* ===== HAIR - Modern Undercut Style ===== */}
          {/* Faded sides (shorter hair visible as skin tone with texture) */}
          <path
            d="M 48 70 Q 48 90 52 110 L 55 110 Q 52 90 55 75 Q 58 60 48 70"
            fill="url(#hairGrad)"
            opacity="0.6"
          />
          <path
            d="M 152 70 Q 152 90 148 110 L 145 110 Q 148 90 145 75 Q 142 60 152 70"
            fill="url(#hairGrad)"
            opacity="0.6"
          />

          {/* Main top hair - Volume, swept to the right */}
          <path
            d="M 52 75
               Q 55 40 85 35
               Q 115 32 140 45
               Q 155 55 150 70
               Q 145 55 120 50
               Q 90 48 70 55
               Q 55 62 52 75"
            fill="url(#hairGrad)"
          />

          {/* Hair volume/layers - swept right */}
          <path
            d="M 58 68
               Q 65 45 95 40
               Q 125 38 145 52
               Q 140 45 110 42
               Q 80 42 65 52
               Q 55 60 58 68"
            fill="url(#hairHighlight)"
          />

          {/* Hair strand detail - swept to right */}
          <path
            d="M 70 50 Q 90 45 120 48 Q 140 52 145 58"
            stroke="#3a3a3a"
            strokeWidth="1"
            fill="none"
            opacity="0.3"
          />
          <path
            d="M 65 55 Q 85 48 115 50 Q 135 54 142 62"
            stroke="#3a3a3a"
            strokeWidth="1"
            fill="none"
            opacity="0.2"
          />

          {/* ===== EYEBROWS - Thick, well-defined ===== */}
          <path
            d={`M 60 ${88 - eyebrowRaise} Q 72 ${84 - eyebrowRaise} 85 ${87 - eyebrowRaise}`}
            stroke="#1a1a1a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d={`M 115 ${87 - eyebrowRaise} Q 128 ${84 - eyebrowRaise} 140 ${88 - eyebrowRaise}`}
            stroke="#1a1a1a"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />

          {/* ===== EYES - Almond shaped, dark brown ===== */}
          {/* Left eye */}
          <ellipse
            cx="72"
            cy="105"
            rx="14"
            ry={blinking ? 2 : 11}
            fill="white"
          />
          {!blinking && (
            <g transform={`translate(${pupilOffsetX}, ${pupilOffsetY})`}>
              {/* Iris - dark brown */}
              <ellipse
                cx="72"
                cy="105"
                rx="7"
                ry="9"
                fill="#2d1810"
              />
              {/* Pupil */}
              <ellipse
                cx="72"
                cy="105"
                rx="3"
                ry="4"
                fill="#0a0a0a"
              />
              {/* Eye highlight */}
              <ellipse
                cx="69"
                cy="102"
                rx="2.5"
                ry="3"
                fill="white"
                opacity="0.9"
                filter="url(#eyeHighlight)"
              />
            </g>
          )}

          {/* Right eye */}
          <ellipse
            cx="128"
            cy="105"
            rx="14"
            ry={blinking ? 2 : 11}
            fill="white"
          />
          {!blinking && (
            <g transform={`translate(${pupilOffsetX}, ${pupilOffsetY})`}>
              {/* Iris - dark brown */}
              <ellipse
                cx="128"
                cy="105"
                rx="7"
                ry="9"
                fill="#2d1810"
              />
              {/* Pupil */}
              <ellipse
                cx="128"
                cy="105"
                rx="3"
                ry="4"
                fill="#0a0a0a"
              />
              {/* Eye highlight */}
              <ellipse
                cx="125"
                cy="102"
                rx="2.5"
                ry="3"
                fill="white"
                opacity="0.9"
                filter="url(#eyeHighlight)"
              />
            </g>
          )}

          {/* ===== NOSE - Straight, medium sized ===== */}
          <path
            d="M 100 108 L 98 128 Q 95 135 100 138 Q 105 135 102 128 L 100 108"
            fill="url(#skinShadow)"
            opacity="0.25"
          />
          {/* Nose tip */}
          <ellipse
            cx="100"
            cy="136"
            rx="5"
            ry="4"
            fill="url(#skinGrad)"
          />
          {/* Nostrils hint */}
          <ellipse cx="95" cy="138" rx="2" ry="1.5" fill="#8d5524" opacity="0.3" />
          <ellipse cx="105" cy="138" rx="2" ry="1.5" fill="#8d5524" opacity="0.3" />

          {/* ===== STUBBLE - Light texture ===== */}
          {/* Chin stubble */}
          <ellipse
            cx="100"
            cy="162"
            rx="20"
            ry="8"
            fill="url(#stubblePattern)"
            opacity="0.4"
          />
          {/* Jaw stubble - left */}
          <path
            d="M 60 145 Q 65 158 80 165 Q 90 168 100 168"
            fill="none"
            stroke="url(#stubblePattern)"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Jaw stubble - right */}
          <path
            d="M 140 145 Q 135 158 120 165 Q 110 168 100 168"
            fill="none"
            stroke="url(#stubblePattern)"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Upper lip stubble hint */}
          <rect
            x="85"
            y="148"
            width="30"
            height="5"
            fill="url(#stubblePattern)"
            opacity="0.25"
          />

          {/* ===== MOUTH - Confident slight smile ===== */}
          <path
            d={`M 82 ${mouthY} Q 100 ${mouthCurve} 118 ${mouthY}`}
            stroke="#a85d5d"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      </svg>
    </div>
  );
});
