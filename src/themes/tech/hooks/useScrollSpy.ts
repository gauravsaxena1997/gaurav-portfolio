'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SectionId } from '@/data';
import { SECTIONS } from '@/data';

export function useScrollSpy() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  const isElementInViewport = useCallback((el: Element) => {
    const rect = el.getBoundingClientRect();
    return rect.top <= 150 && rect.bottom >= 150;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      for (const section of SECTIONS) {
        const element = document.getElementById(section);
        if (element && isElementInViewport(element)) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isElementInViewport]);

  return activeSection;
}
