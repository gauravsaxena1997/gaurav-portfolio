'use client';

import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';

interface AIBrainIllustrationProps {
  className?: string;
}

/**
 * Cute floating AI Robot - matches reference design exactly
 * Googly eyes with pupil tracking, floating animation, no legs
 */
export const AIBrainIllustration = memo(function AIBrainIllustration({
  className,
}: AIBrainIllustrationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);

  // Floating animation
  useEffect(() => {
    if (!svgRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const robot = svgRef.current.querySelector('.robot-body');
    if (robot) {
      gsap.to(robot, {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: 'sine.inOut',
      });
    }

    return () => {
      if (robot) gsap.killTweensOf(robot);
    };
  }, []);

  // Googly eye tracking - pupil follows cursor
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;

    const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
    const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

    // Pupil movement within eye bounds
    const maxPupilMove = 6;
    setPupilOffset({
      x: Math.max(-maxPupilMove, Math.min(maxPupilMove, deltaX * maxPupilMove * 1.5)),
      y: Math.max(-maxPupilMove, Math.min(maxPupilMove, deltaY * maxPupilMove)),
    });

    // Subtle head tilt
    setHeadTilt(deltaX * 2);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width: '100%', height: '100%', maxHeight: '38vh' }}
      aria-hidden="true"
    >
      <defs>
        {/* Gradients for 3D shading */}
        <linearGradient id="robotBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#d0d0d0" />
        </linearGradient>
        <linearGradient id="robotBodyGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="50%" stopColor="#2a2a2a" />
          <stop offset="100%" stopColor="#1a1a1a" />
        </linearGradient>
        <linearGradient id="visorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a2a3a" />
          <stop offset="100%" stopColor="#0a1520" />
        </linearGradient>
        {/* Eye glow */}
        <filter id="eyeGlowFilter" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Shadow blur */}
        <filter id="shadowBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Shadow underneath */}
      <ellipse
        cx="100"
        cy="192"
        rx="35"
        ry="6"
        fill="var(--creative-text-secondary)"
        opacity="0.15"
        filter="url(#shadowBlur)"
      />

      <g className="robot-body" transform={`rotate(${headTilt}, 100, 100)`}>
        {/* Body - egg/oval shape */}
        <ellipse
          cx="100"
          cy="145"
          rx="42"
          ry="38"
          fill="url(#robotBodyGrad)"
        />
        {/* Body highlight */}
        <ellipse
          cx="88"
          cy="138"
          rx="18"
          ry="14"
          fill="white"
          opacity="0.4"
        />

        {/* Left Arm */}
        <ellipse
          cx="52"
          cy="140"
          rx="14"
          ry="20"
          fill="url(#robotBodyGrad)"
        />
        <circle cx="50" cy="155" r="9" fill="url(#robotBodyGrad)" />
        {/* Arm highlight */}
        <ellipse cx="48" cy="135" rx="5" ry="7" fill="white" opacity="0.3" />

        {/* Right Arm */}
        <ellipse
          cx="148"
          cy="140"
          rx="14"
          ry="20"
          fill="url(#robotBodyGrad)"
        />
        <circle cx="150" cy="155" r="9" fill="url(#robotBodyGrad)" />
        {/* Arm highlight */}
        <ellipse cx="152" cy="135" rx="5" ry="7" fill="white" opacity="0.3" />

        {/* Head - pill/capsule shape */}
        <rect
          x="40"
          y="30"
          width="120"
          height="85"
          rx="42"
          fill="url(#robotBodyGrad)"
        />
        {/* Head highlight */}
        <ellipse
          cx="75"
          cy="50"
          rx="25"
          ry="15"
          fill="white"
          opacity="0.5"
        />

        {/* Ear pieces - curved */}
        <ellipse cx="35" cy="70" rx="8" ry="15" fill="#c0c0c0" />
        <ellipse cx="165" cy="70" rx="8" ry="15" fill="#c0c0c0" />

        {/* Slight curve on top (no antenna) */}
        <ellipse cx="100" cy="32" rx="15" ry="4" fill="url(#robotBodyGrad)" />

        {/* Face visor/screen - dark rounded area */}
        <rect
          x="50"
          y="42"
          width="100"
          height="60"
          rx="28"
          fill="url(#visorGrad)"
        />

        {/* Left Eye - white sclera + moving pupil */}
        <ellipse
          cx="75"
          cy="72"
          rx="14"
          ry="16"
          fill="white"
          opacity="0.95"
        />
        {/* Pupil - moves with cursor */}
        <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
          <ellipse
            cx="75"
            cy="72"
            rx="8"
            ry="10"
            fill="var(--creative-accent)"
            filter="url(#eyeGlowFilter)"
          />
          {/* Pupil highlight */}
          <ellipse
            cx="72"
            cy="69"
            rx="3"
            ry="4"
            fill="white"
            opacity="0.7"
          />
        </g>

        {/* Right Eye - white sclera + moving pupil */}
        <ellipse
          cx="125"
          cy="72"
          rx="14"
          ry="16"
          fill="white"
          opacity="0.95"
        />
        {/* Pupil - moves with cursor */}
        <g transform={`translate(${pupilOffset.x}, ${pupilOffset.y})`}>
          <ellipse
            cx="125"
            cy="72"
            rx="8"
            ry="10"
            fill="var(--creative-accent)"
            filter="url(#eyeGlowFilter)"
          />
          {/* Pupil highlight */}
          <ellipse
            cx="122"
            cy="69"
            rx="3"
            ry="4"
            fill="white"
            opacity="0.7"
          />
        </g>

        {/* Smile */}
        <path
          d="M 88 90 Q 100 98 112 90"
          stroke="var(--creative-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
});
