import { CASE_STUDIES } from './caseStudies';
import type { ICaseStudy } from './caseStudies';

// Featured project slugs - single source of truth
// Order determines display order in search dropdown and projects sidebar
export const FEATURED_PROJECT_SLUGS = [
  'lumore',
  'cultureticks',
  'roamonn',
] as const;

export type FeaturedProjectSlug = (typeof FEATURED_PROJECT_SLUGS)[number];

// Get featured projects data from case studies
export const FEATURED_PROJECTS: ICaseStudy[] = FEATURED_PROJECT_SLUGS.map(
  (slug) => CASE_STUDIES.find((cs) => cs.slug === slug)!
).filter(Boolean);
