'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface SectionProgress {
  id: string;
  progress: number; // 0-1
  isActive: boolean;
}

interface ScrollContextValue {
  // Overall progress (0-1) across all sections
  totalProgress: number;
  setTotalProgress: (progress: number) => void;

  // Current active section
  activeSection: string;
  setActiveSection: (section: string) => void;

  // Individual section progress
  sectionProgress: Record<string, SectionProgress>;
  updateSectionProgress: (id: string, progress: number) => void;

  // Scroll direction
  scrollDirection: 'up' | 'down' | null;
  setScrollDirection: (direction: 'up' | 'down' | null) => void;

  // Is currently scrolling
  isScrolling: boolean;
  setIsScrolling: (scrolling: boolean) => void;

  // Project section state
  currentProjectIndex: number;
  setCurrentProjectIndex: (index: number) => void;
  isInProjectsSection: boolean;
  setIsInProjectsSection: (isIn: boolean) => void;
}

const ScrollContext = createContext<ScrollContextValue | undefined>(undefined);

// Section weights for progress calculation
const SECTION_WEIGHTS: Record<string, number> = {
  hero: 1,
  'hero-stats-transition': 0.5,
  stats: 3, // 3 panels
  'stats-projects-transition': 0.5,
  projects: 4,
  'projects-services-transition': 0.5,
  services: 5,
  'services-contact-transition': 0.5,
  contact: 1,
  'contact-credits-transition': 0.5,
  credits: 1,
};

const TOTAL_WEIGHT = Object.values(SECTION_WEIGHTS).reduce((sum, w) => sum + w, 0);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [totalProgress, setTotalProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [sectionProgress, setSectionProgress] = useState<Record<string, SectionProgress>>({});
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [isInProjectsSection, setIsInProjectsSection] = useState(false);

  const updateSectionProgress = useCallback((id: string, progress: number) => {
    setSectionProgress((prev) => ({
      ...prev,
      [id]: {
        id,
        progress: Math.max(0, Math.min(1, progress)),
        isActive: progress > 0 && progress < 1,
      },
    }));

    // Calculate total progress based on weighted sections
    setSectionProgress((prev) => {
      let weightedProgress = 0;
      let cumulativeWeight = 0;

      const sectionOrder = Object.keys(SECTION_WEIGHTS);

      for (const sectionId of sectionOrder) {
        const weight = SECTION_WEIGHTS[sectionId];
        const sectionData = prev[sectionId];

        if (sectionData) {
          // Add completed weight plus partial progress of current section
          if (sectionData.progress >= 1) {
            cumulativeWeight += weight;
          } else if (sectionData.progress > 0) {
            cumulativeWeight += weight * sectionData.progress;
          }
        }
      }

      weightedProgress = cumulativeWeight / TOTAL_WEIGHT;
      setTotalProgress(Math.max(0, Math.min(1, weightedProgress)));

      return prev;
    });
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        totalProgress,
        setTotalProgress,
        activeSection,
        setActiveSection,
        sectionProgress,
        updateSectionProgress,
        scrollDirection,
        setScrollDirection,
        isScrolling,
        setIsScrolling,
        currentProjectIndex,
        setCurrentProjectIndex,
        isInProjectsSection,
        setIsInProjectsSection,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext() {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
}

export { SECTION_WEIGHTS, TOTAL_WEIGHT };
