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
  keyFeatures?: { icon: string; text: string }[]; // Icon + short text for project card display

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
    id: 'moniqo',
    slug: 'moniqo',
    title: 'Moniqo: AI Finance SaaS',
    category: 'case-study',
    featured: true,
    shortDescription:
      'An AI-powered personal finance SaaS showcasing how any application can be enriched with production-grade AI features. Demonstrates an intelligent financial chatbot, AI-generated dashboard insights, and real-time anomaly detection built on a full-stack mobile-first architecture.',
    thumbnail: '/projects/moniqo-hero.webp',

    caseStudyContent: {
      concept: [
        'Showcasing how AI features can be seamlessly integrated into any SaaS application',
        'Demonstrating a multi-agent AI approach to financial analysis and insights',
        'Building a production-grade finance tool with real-world auth, database, and AI layers',
        'Proving that AI copilots can meaningfully enhance user experience beyond simple chatbots',
      ],
      approach: [
        'Built a full-stack personal finance application with mobile-first responsive design',
        'Integrated a dedicated AI Financial Chatbot with session persistence and follow-up suggestions',
        'Layered AI-generated dashboard cards: Health Score, Forecast, Weekly Report, Insights, Anomaly Detection',
        'Implemented production-grade JWT authentication with access/refresh token rotation',
        'Seeded with 508 realistic transactions across 14 account types over 12 months',
      ],
      toolsUsed: [
        'Next.js (App Router) - Full-stack framework with server actions',
        'Prisma + Postgres SQL - Database ORM and relational data layer',
        'OpenAI / LLM API - Powers the financial chatbot and AI insight cards',
        'JWT (jose) - Secure httpOnly cookie-based authentication',
        'Framer Motion - Smooth UI animations and transitions',
      ],
      learnings: [
        'AI insights are most valuable when they are contextual and data-grounded',
        'Multi-agent AI cards that stream independently improve perceived performance significantly',
        'Production-grade auth with JWT and refresh rotation is essential even for demonstrations',
      ],
    },

    highlights: [
      'AI Financial Copilot',
      'Multi-Agent Insights',
      'Mobile-First Architecture',
      'Full-Stack SaaS',
    ],
    techStack: [
      'Next.js',
      'Postgres SQL',
      'JWT',
      'OpenAI',
      'Framer Motion',
    ],
    features: [
      'Dedicated AI Financial Chatbot with session persistence and smart follow-up suggestions',
      'AI Dashboard Cards: Health Score, Cashflow Forecast, Weekly Report and Spending Insights',
      'Real-time Spending Anomaly Detection with intelligent alerting',
      'Transactions, Budgets and Multi-currency support across 14 account types',
    ],
    keyFeatures: [
      { icon: 'BotMessageSquare', text: 'AI Financial Chatbot' },
      { icon: 'BarChart3',        text: 'AI Dashboard Insights' },
      { icon: 'Smartphone',       text: 'Mobile-First Design' },
      { icon: 'ShieldCheck',      text: 'Production-Grade Auth' },
    ],
    heroVideo: '/projects/moniqo-demo-video.webm',
    liveUrl: 'https://moniqo.vercel.app/',
    images: [
      '/projects/moniqo-dashboard.webp',
      '/projects/moniqo-reports.webp',
      '/projects/moniqo-ai-cashflow.webp',
      '/projects/moniqo-screenshot-3-mobile.webp',
      '/projects/moniqo-screenshot-4-mobile.webp',
      '/projects/moniqo-screenshot-5-mobile.webp',
    ],
  },
  {
    id: 'artifexa',
    slug: 'artifexa',
    title: 'Artifexa: AI Agent Orchestration',
    category: 'case-study',
    featured: true,
    shortDescription:
      'An AI Agent Orchestration platform demonstrating how multiple specialized AI systems can collaborate to solve complex tasks. Currently features two production-ready examples: Vision Canvas, which transforms rough creative ideas into detailed prompts for image and video generation, and Product Architect, which converts vague product concepts into structured technical documentation, PRDs, and test cases.',
    thumbnail: '/projects/artifexa-hero.webp',

    caseStudyContent: {
      concept: [
        'Demonstrating how multiple AI agents can communicate and collaborate to complete complex workflows',
        'Building specialized AI teams where each agent handles a specific task and validates the others work',
        'Proving that coordinated AI systems deliver more reliable results than single AI models working alone',
        'Showcasing practical applications through two studios: Vision Canvas for creative content and Product Architect for technical planning',
      ],
      approach: [
        'Designed a coordinated AI system where multiple agents pass work between each other, checking quality at each step',
        'Built Vision Canvas Studio: transforms simple descriptions into detailed, ready-to-use prompts for image and video generation',
        'Built Product Architect Studio: converts rough product ideas into complete technical specifications, user stories, and architecture diagrams',
        'Implemented a 3-step workflow: understand request → assign to right AI specialist → combine and validate final output',
        'Added automated quality checks between stages to ensure consistent, professional results',
      ],
      toolsUsed: [
        'Next.js (App Router) - Core framework for both studios',
        'Framer Motion - Scroll-driven sticky animations and card transitions',
        'Zod - Schema validation for deterministic agent output contracts',
        'LLM APIs - Underlying intelligence for both orchestration pipelines',
        'Lucide Icons + Tailwind CSS - Clean, minimal UI system',
      ],
      learnings: [
        'Multi-agent reliability depends on output contracts, not just model quality',
        'Deterministic sync via schema validation eliminates hallucination drift in pipelines',
        'Scroll-driven animation is highly effective for communicating complex system architecture',
      ],
    },

    highlights: [
      'Multi-Agent Coordination',
      'Zero-Hallucination Flows',
      'Quality Validation',
      'Production-Ready Workflows',
    ],
    techStack: [
      'Next.js',
      'Framer Motion',
      'Zod',
      'OpenAI',
    ],
    features: [
      'Multi-agent coordination system where AI specialists collaborate and validate each others work',
      'Vision Canvas Studio: transforms your creative ideas into optimized prompts for image and video generation',
      'Product Architect Studio: turns rough product concepts into structured PRDs, technical specs, and test cases',
      'Built-in quality validation between workflow stages for reliable, consistent outputs',
    ],
    keyFeatures: [
      { icon: 'Network',    text: 'Multi-Agent Coordination' },
      { icon: 'ShieldCheck', text: 'Zero-Hallucination Flows' },
      { icon: 'CheckCircle', text: 'Quality Validation' },
      { icon: 'Rocket', text: 'Production-Ready Workflows' },
    ],
    heroVideo: '/projects/artifexa-demo-video.webm',
    liveUrl: 'https://artifexa.vercel.app/',
    images: [
      '/projects/artifexa-screenshot-1.webp',
      '/projects/artifexa-screenshot-2.webp',
      '/projects/artifexa-screenshot-3.webp',
      '/projects/artifexa-screenshot-4.webp',
      '/projects/artifexa-screenshot-5.webp',
      '/projects/artifexa-screenshot-6.webp',
      '/projects/artifexa-screenshot-7.webp',
      '/projects/artifexa-screenshot-8.webp',
    ],
  },
  {
    id: 'lumore',
    slug: 'lumore',
    title: 'Lumore: AI-Powered Landing Page',
    category: 'case-study',
    featured: true,
    shortDescription:
      'An AI-powered cosmetic brand landing page demonstrating rapid UI/UX prototyping and AI asset generation. Features consistent AI-generated product imagery, brand characters, and promotional video that are production-ready and copyright-free. Built in 24 hours showcasing how AI tools can deliver high-fidelity marketing pages without traditional design software or stock assets.',
    thumbnail: '/projects/lumore-hero.webp',

    caseStudyContent: {
      concept: [
        'Demonstrating rapid landing page prototyping using AI tools for both design and asset generation',
        'Showcasing ability to create consistent, on-brand product imagery and characters using AI',
        'Proving that AI-generated visuals can be production-ready and copyright-free for commercial use',
        'Building a high-converting landing page with 13+ sections including hero, products, testimonials, and brand story',
      ],
      approach: [
        'Rapid brand ideation: created brand name "Lumore", product lineup, and visual identity using ChatGPT',
        'Designed 13+ section landing page with hero, product showcase, bundles, ingredients, testimonials, and founder story',
        'Generated consistent product imagery and brand characters using Google Gemini - all copyright-free',
        'Created promotional video content using Google Veo for hero and marketing sections',
        'Built complete UI/UX layout and responsive frontend in 24 hours using Claude Code',
        'Zero traditional design tools used - no Figma, no Photoshop, no stock photos',
      ],
      toolsUsed: [
        'ChatGPT - Brand ideation, SKU planning, copywriting, image & video prompts',
        'Claude - UI/UX design decisions, prompt refinement',
        'Claude Code - Complete frontend development and UI implementation',
        'Google Gemini - All product images, hero images, testimonial portraits, magazine covers',
        'Google Veo - AI video generation for promotional sections',
      ],
      learnings: [
        'AI can rapidly produce production-ready, copyright-free visuals that replace traditional stock assets',
        'Strong UI/UX skills combined with AI tools enable 24-hour landing page delivery',
        'Consistent brand imagery is achievable through well-crafted AI prompts',
        'Rapid prototyping is now possible without traditional design software',
      ],
    },

    highlights: [
      '24-Hour Rapid Build',
      'AI-Generated Assets',
      'Copyright-Free Imagery',
      'Conversion-Ready UI',
    ],
    techStack: [
      'Next.js',
      'Google Gemini',
      'Google Veo',
      'Claude Code',
    ],
    features: [
      'AI-generated consistent product imagery and brand characters - all copyright-free and production-ready',
      'High-converting landing page sections: hero, product showcase, bundles, testimonials, brand story',
      'Smooth animations: product orbit hero, sticky scroll brand narrative, parallax product motion',
      'Built complete marketing page in 24 hours using AI tools for UI design, copywriting, images, and video',
    ],
    keyFeatures: [
      { icon: 'Zap',        text: '24-Hour Rapid Prototype' },
      { icon: 'Sparkles',   text: 'AI Product Imagery' },
      { icon: 'ShieldCheck', text: 'Copyright-Free Assets' },
      { icon: 'TrendingUp', text: 'Conversion-Focused UI' },
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
    shortDescription: 'Scalable Event Discovery Engine handling 30k+ active listings with geo-spatial search.',
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

    highlights: ['High-Scale Aggregator', 'Geo-Spatial Search', 'SEO Optimized', '30k+ Listings'],
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
    title: 'Roamonn - Travel Platform',
    client: 'Bunkdays Outdoor Recreation Pvt. Ltd.',
    category: 'client',
    featured: true,
    shortDescription:
      'Enterprise Travel Management System with unified admin for group, corporate, and educational tours.',
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

    highlights: ['Enterprise RBAC', 'Multi-Tenant System', 'Payment Gateways', 'Complex Admin'],
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
    liveUrl: 'https://roamonn.vercel.app/',
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
      'Interactive Data Engineering Portfolio featuring live SQL visualization and workflow automation.',
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
      'Interactive Visualization',
      'Workflow Automation',
      'React + Framer',
      'Data-Driven UX',
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
      'Offline-First Productivity Suite (PWA) with local sync and focus analytics.',
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
      'Offline-First PWA',
      'LocalSync DB',
      'Focus Analytics',
      'Zero-Latency',
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
