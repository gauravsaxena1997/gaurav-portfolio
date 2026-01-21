'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SectionId } from '@/data';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<SectionId>('home');

  // Handle hash change and initial load
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (hash) {
        setActiveSection(hash);
      } else {
        setActiveSection('home');
      }
    };

    // Set initial section from URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigate to a section
  const navigateToSection = useCallback((sectionId: SectionId) => {
    setActiveSection(sectionId);
    // Update URL hash without scrolling
    window.history.pushState(null, '', `/#${sectionId}`);
  }, []);

  return { activeSection, navigateToSection };
}
