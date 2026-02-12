export interface IService {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  benefit?: string; // Three-tier communication: What's in it for them
  proof?: string; // Three-tier communication: Evidence/example
}

export const SERVICES: IService[] = [
  {
    id: 'web-development',
    title: 'Web Application Development',
    description: 'Custom React/Angular applications that scale',
    icon: 'code',
    benefit: 'Fast, responsive apps that users love',
    proof: 'Built Lumore in 2 days with AI assistance',
    features: [
      'Single Page Applications',
      'Progressive Web Apps',
      'API Development',
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Development',
    description: 'Online stores with seamless payment integration',
    icon: 'shopping-cart',
    benefit: 'Start selling online in weeks, not months',
    proof: 'Integrated payments for multiple clients',
    features: [
      'Product Catalogs & Inventory',
      'Stripe & Shopify Integration',
      'Cart & Checkout Flows',
      'Order Management',
    ],
  },
  {
    id: 'mvp-development',
    title: 'MVP Development',
    description: 'Rapid prototyping for startups and new ideas',
    icon: 'rocket',
    benefit: 'Validate your idea without breaking the bank',
    proof: 'Delivered Roamonn MVP in record time',
    features: [
      'Quick Iteration Cycles',
      'Proof of Concept Builds',
      'Investor-Ready Demos',
      'Launch in Weeks',
    ],
  },
  {
    id: 'saas-development',
    title: 'SaaS Development',
    description: 'Subscription-based software solutions',
    icon: 'cloud',
    benefit: 'Build recurring revenue streams',
    proof: 'Architected multi-tenant SaaS platforms',
    features: [
      'Multi-tenant Architecture',
      'Billing & Subscriptions',
      'User Management',
      'Analytics Dashboards',
    ],
  },
  {
    id: 'backend-integrations',
    title: 'Backend & Integrations',
    description: 'Connect your app to essential services',
    icon: 'plug',
    benefit: 'Seamless third-party integrations',
    proof: 'Integrated Stripe, Auth0, Firebase',
    features: [
      'Payment Processing (Stripe, Razorpay)',
      'Email Services & Notifications',
      'Authentication & Authorization',
      'Real-time Databases',
    ],
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Development',
    description: 'Beautiful, accessible interfaces',
    icon: 'palette',
    benefit: 'Interfaces users actually enjoy',
    proof: 'Designed and built award-winning UIs',
    features: ['Responsive Design', 'Component Libraries', 'Design Systems'],
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description: 'Architecture reviews and code audits',
    icon: 'lightbulb',
    benefit: 'Make informed technical decisions',
    proof: '5+ years of full-stack experience',
    features: [
      'Code Reviews',
      'Performance Optimization',
      'Tech Stack Decisions',
    ],
  },
  {
    id: 'optimization-audits',
    title: 'Optimization & Audits',
    description: 'Ensure your app performs, ranks, and stays secure',
    icon: 'shield-check',
    benefit: 'Faster load times, higher rankings',
    proof: 'Achieved 90+ Lighthouse scores',
    features: [
      'Performance Audits',
      'SEO Optimization',
      'Post-launch Monitoring',
      'Security Audits',
    ],
  },
];
