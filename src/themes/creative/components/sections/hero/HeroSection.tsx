'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { HeroContent } from './HeroContent';
import styles from './HeroSection.module.css';

// Dynamic imports for the 3D concept so it doesn't block the main thread
const HeroConceptB = dynamic(() => import('./HeroConceptB').then(m => m.HeroConceptB), { 
  ssr: false,
  loading: () => <FallbackHero /> 
});

// A lightweight fallback while ThreeJS canvas loads
function FallbackHero() {
  return (
    <div className={styles.heroContainer}>
      <div className="absolute inset-0 z-0 bg-[#09090B]" />
      <div className="absolute inset-0 z-10 flex items-center">
        <HeroContent animate={false} />
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
      <HeroConceptB />
    </div>
  );
}
