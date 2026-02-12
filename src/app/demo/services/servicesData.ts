import { Rocket, Palette, Code, Link, TrendingUp } from 'lucide-react';

export const SERVICES = [
    {
        id: 'mvp-generation',
        number: 1,
        title: 'MVP Generation',
        description: 'From ideation to demo',
        fullDescription: 'Transform your idea into a working prototype. I help you identify core features, build a functional MVP, and validate your concept with real users.',
        features: [
            'Rapid prototyping',
            'Core feature implementation',
            'User testing setup',
            'Market validation',
        ],
        color: '#FF6B6B', // Vibrant red
        icon: Rocket,
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
            'Accessibility compliance',
        ],
        color: '#4ECDC4', // Turquoise
        icon: Palette,
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
            'API development',
        ],
        color: '#95E1D3', // Mint green
        icon: Code,
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
            'CRM & analytics tools',
        ],
        color: '#F38181', // Coral
        icon: Link,
    },
    {
        id: 'seo-performance',
        number: 5,
        title: 'SEO & Performance',
        description: 'Optimization',
        fullDescription: 'Ensure your application is fast, accessible, and discoverable. Optimize for search engines, improve load times, and enhance user experience.',
        features: [
            'SEO best practices',
            'Performance optimization',
            'Lighthouse score improvement',
            'Core Web Vitals',
        ],
        color: '#AA96DA', // Lavender
        icon: TrendingUp,
    },
];

export type Service = typeof SERVICES[number];
