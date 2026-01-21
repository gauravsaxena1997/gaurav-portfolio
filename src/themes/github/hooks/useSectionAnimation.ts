'use client';

import { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';

export function useSectionAnimation(sectionId: string) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    if (!elementRef.current || isAnimated) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimated) {
            const typed = new Typed(elementRef.current!, {
              strings: [`&lt;${sectionId}/&gt;`],
              typeSpeed: 50,
              showCursor: false,
              loop: false,
            });

            setIsAnimated(true);
            observer.unobserve(entry.target);

            return () => typed.destroy();
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
      }
    );

    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [sectionId, isAnimated]);

  return elementRef;
}
