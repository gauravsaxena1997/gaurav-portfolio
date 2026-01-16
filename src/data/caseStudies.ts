export interface ICaseStudy {
  id: string;
  slug: string;
  title: string;
  client?: string;
  clientLogo?: string;
  category: 'client' | 'venture';
  categoryLabel?: string;
  featured: boolean;

  // Brief (for cards on main page)
  shortDescription: string;
  thumbnail: string;

  // Full case study
  problem?: string;
  solution?: string;
  results?: string[];

  techStack: string[];
  features: string[];

  // Links
  liveUrl?: string;
  githubUrl?: string;

  // Media
  images?: string[];
  youtubeUrl?: string;

  // Related testimonial
  testimonialId?: string;
}

// Category display labels
export const CATEGORY_LABELS = {
  client: 'Freelancing Work',
  venture: 'Personal Venture',
} as const;

export type CategoryType = keyof typeof CATEGORY_LABELS;

export const CASE_STUDIES: ICaseStudy[] = [
  {
    id: 'cultureticks',
    slug: 'cultureticks',
    title: 'Cultural Events Ticketing Platform',
    category: 'client',
    featured: true,
    shortDescription: 'Ticketing platform with 30,000+ events across the US',
    thumbnail: '/projects/cultureticks-thumb.jpg',
    problem:
      'Client needed a scalable platform to aggregate and sell tickets for cultural events nationwide.',
    solution:
      'Built a modern web application with event discovery, venue directories, and SEO optimization.',
    results: [
      '30,000+ events listed',
      'SEO-optimized for search visibility',
      'Multi-city venue support',
    ],
    techStack: ['Next.js', 'React', 'Node.js', 'PostgreSQL'],
    features: [
      'Event Discovery',
      'Venue Directory',
      'Category Browsing',
      'Location-based Search',
    ],
    liveUrl: 'https://cultureticks.com',
  },
  {
    id: 'roamonn',
    slug: 'roamonn',
    title: 'Travel & Forex Services Platform',
    category: 'client',
    featured: true,
    shortDescription:
      'Comprehensive platform for holidays, visa, and forex services',
    thumbnail: '/projects/roamonn-thumb.jpg',
    problem:
      'Travel agency needed a digital presence to showcase their services and attract customers.',
    solution:
      'Created a modern, responsive website with service showcases and inquiry forms.',
    techStack: ['React', 'Node.js'],
    features: ['Holiday Packages', 'Visa Services', 'Forex Exchange'],
    liveUrl: 'https://roamonn.vercel.app',
  },
  {
    id: 'punit-portfolio',
    slug: 'punit-portfolio',
    title: 'Data Analytics Team Portfolio',
    client: 'Punit Gauttam',
    category: 'client',
    featured: true,
    shortDescription: 'Unique portfolio showcasing data analytics expertise',
    thumbnail: '/projects/punit-thumb.jpg',
    problem:
      'Data analytics professional needed a portfolio to showcase team capabilities.',
    solution:
      'Built a visually striking portfolio with interactive project showcases and skills visualization.',
    techStack: ['Next.js', 'React', 'Tailwind'],
    features: ['Team Showcase', 'Project Gallery', 'Skills Visualization'],
    liveUrl: 'https://punitgauttam.vercel.app/',
  },
  {
    id: 'superhuman-flow',
    slug: 'superhuman-flow',
    title: 'Superhuman Flow',
    category: 'venture',
    featured: true,
    shortDescription: 'Productivity suite with beautiful Pomodoro timer',
    thumbnail: '/projects/superhuman-flow-thumb.jpg',
    problem: 'Most productivity tools are cluttered and distracting.',
    solution:
      'Created a beautiful, distraction-free Pomodoro timer with premium UX.',
    results: [
      'PWA Support',
      'WCAG 2.1 AA Compliant',
      'Keyboard-first design',
    ],
    techStack: ['Next.js', 'React', 'PWA', 'Tailwind'],
    features: [
      'Pomodoro Timer',
      'Custom Themes',
      'Keyboard Shortcuts',
      'Offline Support',
    ],
    liveUrl: 'https://www.superhumanflow.com',
    youtubeUrl: 'https://www.youtube.com/@SuperhumanFlow',
    images: [
      '/projects/superhuman-flow-1.jpg',
      '/projects/superhuman-flow-2.jpg',
    ],
  },
];
