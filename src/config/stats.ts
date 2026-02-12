import { LucideIcon, Briefcase, Cpu, Globe } from 'lucide-react';

export interface StatItem {
    id: string;
    title: string;
    description: string;
    icon?: LucideIcon;
    // For chips or bullet points
    highlights?: string[];
    // Desktop layout preference
    desktopLayout: 'text-left' | 'text-right';
    illustAlign: 'center' | 'bottom';
}

export const STATS_DATA: StatItem[] = [
    {
        id: 'experience',
        title: '6+ Years Corporate Experience',
        description: "I bring professional-grade development standards to your project. I build systems that are secure, reliable, and designed to scale from day one.",
        icon: Briefcase,
        highlights: [
            'Enterprise-Grade Code',
            'Scalable Systems',
            'Reliable Delivery',
        ],
        desktopLayout: 'text-left',
        illustAlign: 'bottom'
    },
    {
        id: 'ai-workflow',
        title: 'AI-Driven Velocity',
        description: "I use custom AI pipelines to automate the boring stuff—ideation, testing, and boilerplate. You get your product to market 2x faster without sacrificing quality.",
        icon: Cpu,
        highlights: [
            '50% Faster Delivery',
            'Automated QA Testing',
            'Rapid Prototyping',
        ],
        desktopLayout: 'text-right',
        illustAlign: 'center'
    },
    {
        id: 'global',
        title: 'High-Conversion Experiences',
        description: "Visitors ignore boring sites. I build immersive, high-performance interfaces that capture attention instantly and convert casual visitors into loyal customers.",
        icon: Globe,
        highlights: [
            '3D Interactive Webs',
            'Global Performance',
            'Maximized Retention',
        ],
        desktopLayout: 'text-left',
        illustAlign: 'center'
    }
];

/**
 * Chip labels for the interactive chip stacking animation (Stat 1)
 * Used by both desktop (ChipStacking.tsx) and mobile (MobileChipStack.tsx) components
 */
export const CHIP_LABELS = [
    'PERFORMANCE OPTIMIZATION',
    'PORTFOLIO WEBSITES',
    'AI-POWERED APPLICATIONS',
    'HIGH-CONVERSION LANDING PAGES',
    'SEO / GEO / AIO READY',
    'SCALABLE & SECURE',
] as const;

