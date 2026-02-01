'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import styles from './EntranceAnimation.module.css';

interface EntranceAnimationProps {
  onComplete: () => void;
  skipAnimation?: boolean; // For reduced motion
}

export function EntranceAnimation({ onComplete, skipAnimation = false }: EntranceAnimationProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (skipAnimation) {
      // Immediate completion for reduced motion
      onComplete();
      return;
    }

    // Single smooth timeline - overlay slides up
    const tl = gsap.timeline();

    // Slide overlay up with smooth easing
    tl.to(overlayRef.current, {
      y: '-100%',
      duration: 1.2,
      ease: 'power3.inOut',
      delay: 0.1,
    })
    // Trigger content animation BEFORE overlay finishes (overlap = no flicker)
    .call(() => {
      onComplete();
    }, [], '-=0.4') // Call onComplete 400ms before overlay animation ends
    // Remove overlay from DOM after animation completes
    .call(() => {
      setIsComplete(true);
    });

    return () => {
      tl.kill();
    };
  }, [skipAnimation, onComplete]);

  if (isComplete) return null;

  return (
    <div className={styles.container}>
      <div ref={overlayRef} className={styles.overlay} />
    </div>
  );
}
