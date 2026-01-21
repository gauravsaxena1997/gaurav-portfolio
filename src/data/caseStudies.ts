// ============================================
// CATEGORY-SPECIFIC CONTENT INTERFACES
// ============================================

// Freelancing Work - Client projects
export interface IFreelanceContent {
  brief: string[]; // What the client needed (bullet points)
  scope: string[]; // What I built / scope of work (bullet points)
  impact?: string[]; // Results/metrics (optional)
}

// Personal Venture - Side projects
export interface IVentureContent {
  story: string[]; // Why I built this, the inspiration (bullet points)
  whatItDoes: string[]; // Core functionality (bullet points)
  whyUseIt: string[]; // Value proposition, who it's for (bullet points)
}

// Case Study - Demonstrations/experiments
export interface ICaseStudyContent {
  concept: string[]; // What this project demonstrates (bullet points)
  approach: string[]; // How it was built, process used (bullet points)
  toolsUsed?: string[]; // Detailed breakdown of tools/AI used
  learnings?: string[]; // What I learned (bullet points)
}

// ============================================
// MAIN INTERFACE
// ============================================

export interface ICaseStudy {
  id: string;
  slug: string;
  title: string;
  client?: string;
  clientLogo?: string;
  category: 'client' | 'venture' | 'case-study';
  categoryLabel?: string;
  featured: boolean;

  // Brief (for cards on main page)
  shortDescription: string;
  thumbnail: string;

  // Category-specific content (use one based on category)
  freelanceContent?: IFreelanceContent;
  ventureContent?: IVentureContent;
  caseStudyContent?: ICaseStudyContent;

  // Common fields
  techStack: string[];
  features: string[];
  highlights?: string[]; // Stats/metrics shown as badges

  // Links
  liveUrl?: string;
  githubUrl?: string;

  // Media
  heroVideo?: string; // Video for hero section
  images?: string[];
  youtubeUrl?: string;

  // Related testimonial
  testimonialId?: string;
}

// Category display labels
export const CATEGORY_LABELS = {
  client: 'Freelancing Work',
  venture: 'Personal Venture',
  'case-study': 'Case Study',
} as const;

export type CategoryType = keyof typeof CATEGORY_LABELS;

export const CASE_STUDIES: ICaseStudy[] = [
  // ============================================
  // CASE STUDIES
  // ============================================
  {
    id: 'lumore',
    slug: 'lumore',
    title: 'Lumore - AI-Powered Cosmetic E-commerce Demo',
    category: 'case-study',
    featured: true,
    shortDescription:
      'Luxury skincare e-commerce showcasing end-to-end AI-powered development - from branding to deployment',
    thumbnail: '/projects/lumore-hero.webp',

    caseStudyContent: {
      concept: [
        'Demonstrating the power of AI for end-to-end product development',
        'Covering UI/UX design, frontend development, and complete asset creation',
        'Showcasing how AI can be leveraged across the entire development lifecycle',
        'Building a polished, production-ready e-commerce experience',
      ],
      approach: [
        'Started with ideation using ChatGPT - brand name "Lumore", SKU planning, product names',
        'Created a high-level homepage blueprint with 13+ sections',
        'Generated image prompts using ChatGPT and Claude',
        'Used Google Gemini for all product images, hero images, testimonial portraits',
        'Used Google Veo for AI video generation for promotional sections',
        'Claude Code handled the entire UI/UX layouting and frontend development',
      ],
      toolsUsed: [
        'ChatGPT - Brand ideation, SKU planning, copywriting, image & video prompts',
        'Claude - UI/UX design decisions, prompt refinement',
        'Claude Code - Complete frontend development and UI implementation',
        'Google Gemini - All product images, hero images, testimonial portraits, magazine covers',
        'Google Veo - AI video generation for promotional sections',
      ],
      learnings: [
        'AI can help you build anything if you have the interest and creativity',
        'No deep knowledge of traditional design tools like Figma required',
        'Creativity and thought process are enough to leverage AI effectively',
        'AI bridges the gap between vision and execution',
      ],
    },

    highlights: [
      '100% AI-Generated Assets',
      '~90% AI-Assisted Code',
      'Built in 2 Days',
      '13+ Homepage Sections',
    ],
    techStack: [
      'Next.js',
      'React',
      'Tailwind CSS',
      'Framer Motion',
      'Lucide Icons',
      'Vercel',
    ],
    features: [
      'Animated Hero with Product Orbit',
      'Sticky Scroll Brand Story',
      'Vertical Product Showcase',
      'Parallax Products In Motion',
      'Interactive Brand Motto',
      'Bundle/Combo Cards',
      'Honeycomb Ingredient Grid',
      'Horizontal Scroll Testimonials',
      'Magazine Press Section',
      'Founder Story Section',
      'Blog Highlights Grid',
      'Authorized Retailers',
      'Smooth Framer Motion Animations',
    ],
    liveUrl: 'https://lumore.vercel.app',
    heroVideo: '/projects/lumore-demo-video.mp4',
    images: [
      '/projects/lumore-hero.webp',
      '/projects/lumore-screenshot-1.webp',
      '/projects/lumore-screenshot-2.webp',
      '/projects/lumore-screenshot-3.webp',
      '/projects/lumore-screenshot-4.webp',
    ],
  },

  // ============================================
  // FREELANCING WORK
  // ============================================
  {
    id: 'cultureticks',
    slug: 'cultureticks',
    title: 'Cultural Events Ticketing Platform',
    category: 'client',
    featured: true,
    shortDescription: 'Ticketing platform with 30,000+ events across the US',
    thumbnail: '/projects/cultureticks-thumb.jpg',

    freelanceContent: {
      brief: [
        'Client needed a scalable platform to aggregate cultural events',
        'Multiple data sources to be integrated into one unified experience',
        'Seamless ticket discovery for users across the United States',
      ],
      scope: [
        'Built a full-stack web application with event discovery',
        'Implemented venue directories and category browsing',
        'Added location-based search functionality',
        'SEO optimization to ensure events rank well in search results',
      ],
      impact: [
        '30,000+ events listed on the platform',
        'SEO-optimized pages for search visibility',
        'Multi-city venue support with location filtering',
      ],
    },

    highlights: ['30K+ Events', 'SEO Optimized', 'Multi-City'],
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
    title: 'Roamonn - Group & Corporate Travel Platform',
    client: 'Bunkdays Outdoor Recreation Pvt. Ltd.',
    category: 'client',
    featured: true,
    shortDescription:
      'Full-stack travel platform with group tour bookings, corporate & educational tour portfolios, and a comprehensive admin panel for complete content management',
    thumbnail: '/projects/roamonn-hero.webp',

    freelanceContent: {
      brief: [
        'Travel company needed a highly comprehensive travel website with multiple service lines',
        'Group Tours with full booking functionality where travelers can join group trips',
        'Corporate Tours as a portfolio where businesses browse packages and request quotes',
        'Educational Tours listing for schools and institutions to explore and inquire',
        'Fully functional admin panel to manage all tours, content, and configurations without developer help',
      ],
      scope: [
        'Built complete Group Tours module with tour categories, detailed listings, and booking system',
        'Created Corporate Tours portfolio with package showcases and quote request functionality',
        'Developed Educational Tours section with institutional tour listings and inquiry forms',
        'Implemented comprehensive Admin Dashboard with 10+ management modules',
        'Built admin modules for Tours, Users, Bookings, Enquiries, FAQs, Promo Banners, Landing Pages, and Gallery',
        'Integrated ImageKit for optimized media management and CDN delivery',
        'Added WhatsApp integration for instant customer communication',
        'Implemented form validations, character limits, and input sanitization throughout',
        'Built responsive design using ShadCN UI components and Tailwind CSS',
      ],
      impact: [
        'Single platform managing 3 distinct tour categories with unified admin control',
        'Admin can configure every tour detail, pricing, and availability without developer intervention',
        'Streamlined enquiry system handling both booking requests and quote inquiries',
        '50+ destinations and 10,000+ happy travelers served through the platform',
      ],
    },

    highlights: ['3 Tour Categories', 'Full Admin Panel', 'Booking System', '10+ Admin Modules'],
    techStack: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'ShadCN UI', 'Vite'],
    features: [
      'Group Tour Bookings',
      'Corporate Tours Portfolio',
      'Educational Tours Listing',
      'Comprehensive Admin Dashboard',
      'Tour Category Management',
      'Bookings & Orders Management',
      'Enquiries Management',
      'FAQs Management',
      'Dynamic Promo Banners',
      'Landing Pages Builder',
      'Gallery Management',
      'User Management',
      'ImageKit Media Integration',
      'WhatsApp Integration',
      'Responsive Mobile Design',
    ],
    liveUrl: 'https://roamonn.com',
    images: [
      '/projects/roamonn-hero.webp',
      '/projects/roamonn-screenshot-1.webp',
      '/projects/roamonn-screenshot-2.webp',
      '/projects/roamonn-screenshot-3.webp',
      '/projects/roamonn-screenshot-4.webp',
      '/projects/roamonn-screenshot-5.webp',
    ],
  },
  {
    id: 'punit-portfolio',
    slug: 'punit-portfolio',
    title: 'Power BI Engineer Portfolio',
    client: 'Punit Gauttam',
    category: 'client',
    featured: true,
    shortDescription:
      'A unique portfolio for a Senior Data & Power BI Engineer with UI inspired by Power BI dashboards and Power Automate workflows',
    thumbnail: '/projects/punit-hero.webp',

    freelanceContent: {
      brief: [
        'Data analyst specializing in Power BI, Power Automate, and business intelligence',
        'Wanted a portfolio that reflects his domain expertise visually',
        'UI should feel like Power BI dashboards and Power Automate workflow diagrams',
        'Stand out from typical developer portfolios with data-driven design',
      ],
      scope: [
        'Designed dark theme inspired by GitHub and Power BI aesthetics',
        'Created SQL query visualization for skills section - showing expertise through meta-design',
        'Built interactive Power Automate workflow diagrams with triggers, conditions, and actions',
        'Implemented animated career timeline with professional experience',
        'Project showcases with technical breakdowns highlighting RLS and governance',
        'Integrated contact form powered by Power Automate',
      ],
      impact: [
        'Unique portfolio that demonstrates tools through actual examples',
        'Design language that resonates with BI professionals and recruiters',
        'Meta-approach: showing technical credibility rather than just telling',
      ],
    },

    highlights: [
      'Power BI Inspired UI',
      'Workflow Diagrams',
      'SQL Skills Display',
      'Interactive Animations',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    features: [
      'Power BI Dashboard Aesthetic',
      'Power Automate Workflow Visualization',
      'SQL Query Skills Section',
      'Animated Career Timeline',
      'Project Case Studies',
      'Interactive Flowcharts',
      'Dark Tech Theme',
      'Power Automate Contact Form',
    ],
    liveUrl: 'https://punitgauttam.vercel.app/',
    heroVideo: '/projects/punit-portfolio-demo-video.mp4',
    images: [
      '/projects/punit-hero.webp',
      '/projects/punit-screenshot-1.webp',
      '/projects/punit-screenshot-2.webp',
      '/projects/punit-screenshot-3.webp',
      '/projects/punit-screenshot-4.webp',
    ],
  },

  // ============================================
  // PERSONAL VENTURES
  // ============================================
  {
    id: 'superhuman-flow',
    slug: 'superhuman-flow',
    title: 'Superhuman Flow',
    category: 'venture',
    featured: true,
    shortDescription:
      'A productivity-focused brand helping users take control of their time and focus - starting with a feature-rich Pomodoro timer',
    thumbnail: '/projects/superhumanflow-hero.webp',

    ventureContent: {
      story: [
        'Building a productivity suite where users have more control over their time and focus',
        'Started with a Pomodoro timer as the first product in the suite',
        'Frustrated with existing apps that were cluttered, ad-filled, or required subscriptions',
        'Wanted to create something beautiful, distraction-free, and completely free',
        'Planning to expand with more tools like journal app and habit tracking',
      ],
      whatItDoes: [
        'Customizable Pomodoro timer with focus, short break, and long break sessions',
        'Built-in task management with projects, priorities, and time tracking',
        'Music integration with 16+ ambient sounds and YouTube focus music',
        'Dedicated YouTube channel with curated focus and concentration music',
        'Beautiful themes with 10+ gradient and image backgrounds',
        'Achievement system with streaks, milestones, and daily targets',
        'Statistics dashboard with weekly insights and activity timeline',
        'Works offline as an installable Progressive Web App',
      ],
      whyUseIt: [
        'All premium features completely free - no subscriptions, no ads',
        'More features than paid alternatives like Forest, Pomofocus, or Focus Keeper',
        'No account required - just open and start focusing',
        '20+ keyboard shortcuts for power users',
        'Ambient sounds and dedicated YouTube channel with focus music',
        'Track your productivity with streaks, achievements, and detailed stats',
        'Install on any device and use offline',
      ],
    },

    highlights: [
      '100% Free Forever',
      'Music & Sounds',
      'Task Management',
      'Works Offline',
    ],
    techStack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'PWA'],
    features: [
      'Customizable Pomodoro Timer',
      'Task & Project Management',
      'Ambient Sounds Mixer',
      'YouTube Music Integration',
      'Beautiful Themes & Backgrounds',
      'Achievement System',
      'Streak Tracking',
      'Statistics Dashboard',
      'Keyboard Shortcuts',
      'Offline Support (PWA)',
      'Session History',
      'Daily Targets',
    ],
    liveUrl: 'https://www.superhumanflow.com',
    youtubeUrl: 'https://www.youtube.com/@SuperhumanFlow',
    heroVideo: '/projects/superhumanflow-demo-video.mp4',
    images: [
      '/projects/superhumanflow-hero.webp',
      '/projects/superhumanflow-screenshot-1.webp',
      '/projects/superhumanflow-screenshot-2.webp',
      '/projects/superhumanflow-screenshot-3.webp',
      '/projects/superhumanflow-screenshot-4.webp',
    ],
  },
];
