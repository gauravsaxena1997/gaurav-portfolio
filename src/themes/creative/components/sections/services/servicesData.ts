import { Rocket, Palette, Code, Link, TrendingUp, type LucideIcon } from 'lucide-react';

export interface ServiceData {
    id: string;
    number: number;
    title: string;
    description: string;
    fullDescription: string;
    features: string[];
    icon: LucideIcon;
}

export const SERVICES: ServiceData[] = [
    {
        id: 'mvp-generation',
        number: 1,
        title: 'MVP Engineering',
        description: '0 to 1 Architecture',
        fullDescription: 'Transform abstract concepts into investable MVPs. I build scalable foundations using Next.js and Supabase that are ready for rapid iteration and user validation.',
        features: [
            'Rapid Component Scaffolding',
            'Scalable DB Schema Design',
            'Auth & User Management',
            'CI/CD Pipeline Setup'
        ],
        icon: Rocket
    },
    {
        id: 'ui-ux-design',
        number: 2,
        title: 'Design Engineering',
        description: 'Systems & Interactions',
        fullDescription: 'Bridge the gap between design and code. I adhere to pixel-perfect implementation of Figma files while enhancing them with fluid micro-interactions and accessible patterns.',
        features: [
            'Figma to React Implementation',
            'Design Token Architecture',
            'Framer Motion Animations',
            'WCAG 2.1 AA Accessibility'
        ],
        icon: Palette
    },
    {
        id: 'development',
        number: 3,
        title: 'Full Stack Architecture',
        description: 'Scalable Systems',
        fullDescription: 'Build robust, scalable applications that grow with your business. I architect distributed systems using Next.js and Node.js that handle high traffic and complex logic without breaking.',
        features: [
            'Next.js 15 / React 19 Ecosystem',
            'Type-Safe Backend Systems',
            'Scalable Database Design',
            'Cloud-Ready Infrastructure'
        ],
        icon: Code
    },
    {
        id: 'integrations',
        number: 4,
        title: 'API & Payment Systems',
        description: 'Seamless Connectivity',
        fullDescription: 'Connect your application to the global economy. I specialize in secure implementation of Payment Gateways (Stripe/Razorpay), Auth Providers, and connecting your tools (CRM/Email) for automation.',
        features: [
            'Stripe & Razorpay Payments',
            'Secure User Authentication',
            'Real-time Updates',
            'CMS Integration'
        ],
        icon: Link
    },
    {
        id: 'seo-performance',
        number: 5,
        title: 'Performance & Growth',
        description: 'Speed & SEO',
        fullDescription: 'Speed is a feature. I optimize applications for instant load times and Google ranking. A faster site means better user retention and higher conversion rates.',
        features: [
            'Instant Load Speeds',
            'Google SEO Optimization',
            'Mobile Performance Tuning',
            'Analytics & Growth Tracking'
        ],
        icon: TrendingUp
    }
];
