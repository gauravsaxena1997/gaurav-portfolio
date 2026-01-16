export interface INavItem {
  id: string;
  label: string;
  href?: string; // Optional external link (for blog, etc.)
}

export const NAV_ITEMS: INavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'Services' },
  { id: 'skills', label: 'Skills' },
  { id: 'blog', label: 'Blog' },
  { id: 'contact', label: 'Contact' },
];

export const SECTIONS = [
  'home',
  'projects',
  'services',
  'skills',
  'testimonials',
  'blog',
  'contact',
] as const;

export type SectionId = (typeof SECTIONS)[number];
