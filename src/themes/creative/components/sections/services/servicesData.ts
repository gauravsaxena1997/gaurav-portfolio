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
        title: 'MVP Generation',
        description: 'Rapid prototyping for startups',
        fullDescription: 'Transform your idea into a working prototype. I help you identify core features, build a functional MVP, and validate your concept with real users.',
        features: [
            'Rapid prototyping',
            'Core feature implementation',
            'User testing setup',
            'Market validation'
        ],
        icon: Rocket
    },
    {
        id: 'ui-ux-design',
        number: 2,
        title: 'UI/UX Design',
        description: 'User-centered design',
        fullDescription: 'Craft beautiful, intuitive interfaces that users love. From wireframes to pixel-perfect designs, I ensure your product is both functional and delightful.',
        features: [
            'Wireframing & prototyping',
            'Visual design system',
            'Responsive layouts',
            'Accessibility compliance'
        ],
        icon: Palette
    },
    {
        id: 'development',
        number: 3,
        title: 'Development',
        description: 'Frontend + Backend',
        fullDescription: 'Build robust, scalable applications with modern technologies. Clean code, best practices, and maintainable architecture are my standards.',
        features: [
            'Modern tech stack (React, Next.js, Node.js)',
            'Scalable architecture',
            'Clean, maintainable code',
            'API development'
        ],
        icon: Code
    },
    {
        id: 'integrations',
        number: 4,
        title: 'Integrations',
        description: 'APIs, payments, auth',
        fullDescription: 'Connect your application to the services you need. Seamless integrations with third-party APIs, payment gateways, and authentication providers.',
        features: [
            'Third-party API integration',
            'Payment gateways (Stripe, PayPal)',
            'Authentication (OAuth, JWT)',
            'CRM & analytics tools'
        ],
        icon: Link
    },
    {
        id: 'seo-performance',
        number: 5,
        title: 'SEO & Performance',
        description: 'Optimization',
        fullDescription: 'Maximize your reach and speed. I optimize your application for search engines and ensure lightning-fast performance across all devices.',
        features: [
            'Technical SEO optimization',
            'Performance audits',
            'Core Web Vitals',
            'Analytics setup'
        ],
        icon: TrendingUp
    }
];
