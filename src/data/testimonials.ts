export interface ITestimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company?: string;
  image?: string;
  projectId?: string; // Links to case study
}

// Empty for now - user will add when they collect testimonials
export const TESTIMONIALS: ITestimonial[] = [];
