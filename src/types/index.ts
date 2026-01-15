// Re-export all data types
export type {
  IProfile,
  IEducation,
  ICaseStudy,
  CategoryType,
  IService,
  ITestimonial,
  ITechSkill,
  INavItem,
  SectionId,
} from '@/data';

// Theme types
export type ThemeMode = 'dark' | 'light';
export type ThemeName = 'tech' | 'brutalist' | 'minimalist' | 'retro';

export interface ThemeConfig {
  name: ThemeName;
  displayName: string;
  description: string;
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';
