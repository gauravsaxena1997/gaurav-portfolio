import { CASE_STUDIES, ICaseStudy } from '@/data/caseStudies';

// Featured project IDs - easy to swap projects by changing these
export const FEATURED_PROJECT_IDS = [
  'lumore',
  'superhuman-flow',
  'punit-portfolio',
] as const;

export type FeaturedProjectId = (typeof FEATURED_PROJECT_IDS)[number];

// Get featured projects from case studies data
export const getFeaturedProjects = (): ICaseStudy[] => {
  return FEATURED_PROJECT_IDS.map((id) => CASE_STUDIES.find((p) => p.id === id)).filter(
    (p): p is ICaseStudy => p !== undefined
  );
};

// Get project display data with index
export interface ProjectDisplayData extends ICaseStudy {
  index: number;
}

export const getProjectsForDisplay = (): ProjectDisplayData[] => {
  return getFeaturedProjects().map((project, index) => ({
    ...project,
    index,
  }));
};
