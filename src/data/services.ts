export interface IService {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

export const SERVICES: IService[] = [
  {
    id: 'web-development',
    title: 'Web Application Development',
    description: 'Custom React/Angular applications that scale',
    icon: 'code',
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
    features: ['Responsive Design', 'Component Libraries', 'Design Systems'],
  },
  {
    id: 'consulting',
    title: 'Technical Consulting',
    description: 'Architecture reviews and code audits',
    icon: 'lightbulb',
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
    features: [
      'Performance Audits',
      'SEO Optimization',
      'Post-launch Monitoring',
      'Security Audits',
    ],
  },
];
