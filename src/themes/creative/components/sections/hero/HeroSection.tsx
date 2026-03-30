'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HeroContent } from './HeroContent';
import styles from './HeroSection.module.css';

// Dynamic imports for the 3D grid hero, so it doesn't block the main thread
const HeroGridSection = dynamic(() => import('./HeroConceptB').then(m => m.HeroGridSection), { 
  ssr: false,
  loading: () => <FallbackHero /> 
});

// A lightweight fallback while ThreeJS canvas loads — same light cream as final
function FallbackHero() {
  return (
    <div className={styles.heroContainer} style={{ background: '#FFFBF7' }}>
      <div className="absolute inset-0 z-10 flex items-center" style={{ pointerEvents: 'none' }}>
        <div className={styles.heroTwoCol}>
          <div className={styles.heroTextCol}>
            <HeroContent animate={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  // Emit event to unblock other entrance animations (like GuideBar)
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('hero-entrance-complete'));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-screen">
      <HeroGridSection />
    </div>
  );
}
