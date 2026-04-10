'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { SpotlightEffect } from './SpotlightEffect';
import { LighthouseIllustration } from './LighthouseIllustration';
import styles from './LighthouseHero.module.css';

const SVG_LAMP_Y_RATIO = 67 / 230;

function GenericHeroContent({ animate, className }: { animate: boolean, className?: string }) {
  const animClass = animate ? styles.animateIn : '';
  const contentClassName = `${styles.heroContent} ${className ?? ''}`.trim();

  return (
    <div className={contentClassName}>
      <p className={`${styles.greeting} ${animClass} greeting`}>
        Designing resilience.
      </p>
      <h1 className={`${styles.heroName} ${animClass} heroName`}>
        Guiding Light
      </h1>
      <p className={`${styles.heroTagline} ${animClass} heroTagline`}>
        We build robust digital infrastructure that illuminates your path forward.
      </p>
      <p className={`${styles.heroSubtitle} ${animClass} heroSubtitle`}>
        A beautiful CSS blend-mode spotlight effect that automatically tracks cursor movement 
        and elegantly inverts text colors as it passes over them.
      </p>
      <div className={`${styles.actionRow} ${animClass} actionRow`} style={{ marginTop: '2rem' }}>
        <button className={styles.heroCTA}>
          Discover Features
        </button>
      </div>
    </div>
  );
}

export function LighthouseHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lighthouseRef = useRef<HTMLDivElement>(null);
  
  const [lighthouseOrigin, setLighthouseOrigin] = useState({ x: 0.92, y: 0.65 });
  const [isSpotlightEnabled, setIsSpotlightEnabled] = useState(false);
  const [isMounted] = useState(true);

  const updateLampPosition = useCallback(() => {
    if (!containerRef.current || !lighthouseRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const lighthouseRect = lighthouseRef.current.getBoundingClientRect();

    if (containerRect.width === 0 || containerRect.height === 0) return;

    const lighthouseLeft = lighthouseRect.left - containerRect.left;
    const lighthouseTop = lighthouseRect.top - containerRect.top;

    const lampX = lighthouseLeft + (lighthouseRect.width * 0.5);
    const lampY = lighthouseTop + (lighthouseRect.height * SVG_LAMP_Y_RATIO);

    setLighthouseOrigin({
      x: lampX / containerRect.width,
      y: lampY / containerRect.height,
    });
  }, []);

  useEffect(() => {
    updateLampPosition();

    const timer = setTimeout(() => setIsSpotlightEnabled(true), 500);

    const handleResize = () => requestAnimationFrame(updateLampPosition);
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateLampPosition]);

  return (
    <div ref={containerRef} className={styles.heroContainer} style={{ background: '#09090B', height: '100vh', width: '100%' }}>
      {/* Base Layer */}
      <div className={styles.baseLayer}>
        <GenericHeroContent animate={isMounted} />
      </div>

      {/* Spotlight Effect */}
      <SpotlightEffect
        containerRef={containerRef}
        lighthouseOrigin={lighthouseOrigin}
        mode="mouse"
        isActive={true}
        isEnabled={isSpotlightEnabled}
      />

      {/* Lit text layer - clipped to spotlight beam */}
      <div className={`${styles.litLayer} ${isSpotlightEnabled ? styles.litLayerActive : ''}`} aria-hidden="true">
        <GenericHeroContent animate={false} />
      </div>

      {/* Non-blending layer for lighthouse */}
      <div className={styles.nonBlendingLayer}>
        <div ref={lighthouseRef} className={`${styles.lighthouse} ${styles.lighthouseClickable}`}>
          <LighthouseIllustration isLampOn={isSpotlightEnabled} onClick={() => setIsSpotlightEnabled(!isSpotlightEnabled)} />
        </div>
      </div>
    </div>
  );
}
