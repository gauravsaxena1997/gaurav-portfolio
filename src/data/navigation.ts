export interface INavItem {
  id: string;
  label: string;
  href?: string; // Optional external link (for blog, etc.)
}

export const NAV_ITEMS: INavItem[] = [
  { id: 'home', label: 'home' },
  { id: 'projects', label: 'projects' },
  { id: 'services', label: 'services' },
  { id: 'skills', label: 'skills' },
  { id: 'about', label: 'about' },
  { id: 'blog', label: 'blog' },
  { id: 'contact', label: 'contact' },
];

export const SECTIONS = [
  'home',
  'projects',
  'services',
  'skills',
  'testimonials',
  'about',
  'blog',
  'contact',
] as const;

export type SectionId = (typeof SECTIONS)[number];
