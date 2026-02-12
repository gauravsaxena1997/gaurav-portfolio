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
        id: 'ai-web-apps',
        number: 1,
        title: 'AI-Enhanced Web Apps',
        description: 'Smart Automation',
        fullDescription: 'Build smart applications that automate tasks and engage users. I integrate intelligent features directly into your product to save time and increase value.',
        features: [
            'Smart Customer Chat',
            'Automated Data Entry',
            'Personalized Content',
            'Intelligent Search'
        ],
        icon: Rocket
    },
    {
        id: 'immersive-tech',
        number: 2,
        title: '3D & Immersive Web',
        description: 'Premium Design',
        fullDescription: 'Stand out with a website that looks and feels premium. I build interactive experiences that tell your brand story and keep visitors engaged longer.',
        features: [
            'Interactive Product Demos',
            'Smooth Scroll Effects',
            'Visual Storytelling',
            'Modern 3D Graphics'
        ],
        icon: Palette
    },
    {
        id: 'enterprise-systems',
        number: 3,
        title: 'Enterprise B2B/B2C Portals',
        description: 'High-Scale Architecture',
        fullDescription: 'Leverage my 6+ years of corporate experience. I build secure, role-based dashboards and customer portals designed to handle complex data and high user volume.',
        features: [
            'Role-Based Access Control',
            'Complex Data Dashboards',
            'Secure Data Handling',
            'High-Availability Systems'
        ],
        icon: Code
    },
    {
        id: 'integrations',
        number: 4,
        title: 'FinTech & SaaS Infrastructure',
        description: 'Seamless Connectivity',
        fullDescription: 'Connect your application to the global economy. I specialize in secure implementation of Payment Gateways (Stripe/Razorpay), Auth Providers, and complex SaaS workflows.',
        features: [
            'Stripe & Razorpay Payments',
            'Secure Authentication Flows',
            'SaaS Subscription Models',
            'Third-party Integrations'
        ],
        icon: Link
    },
    {
        id: 'seo-performance',
        number: 5,
        title: 'Technical SEO & Performance',
        description: 'Core Web Vitals',
        fullDescription: 'Speed is a feature. I optimize applications for instant load times and Google ranking. A faster site means better user retention and higher conversion rates.',
        features: [
            'Instant Load Speeds',
            'Google SEO Optimization',
            'Core Web Vitals Tuning',
            'Analytics & Growth Tracking'
        ],
        icon: TrendingUp
    }
];
