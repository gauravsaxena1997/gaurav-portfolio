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
        title: '6+ Years Building Digital Products',
        description: "I've spent 5+ years at product companies and service agencies, shipping for B2B and B2C audiences. Now I bring that same rigor directly to your project. I bring tested frameworks that actually work.",
        icon: Briefcase,
        // Highlights shown in chip stacking animation, not as text
        desktopLayout: 'text-left',
        illustAlign: 'bottom'
    },
    {
        id: 'ai-workflow',
        title: 'AI-Accelerated Development',
        description: "Working without AI is like leaving half your toolkit at home. I leverage custom AI pipelines to automate testing and scaffolding. This means I spend my time solving your complex business problems, not writing boilerplate code.",
        icon: Cpu,
        highlights: [
            'Automated Testing Pipelines',
            'Faster Feature Delivery',
            'Enterprise-Grade Quality',
        ],
        desktopLayout: 'text-right',
        illustAlign: 'center'
    },
    {
        id: 'global',
        title: 'Global Remote Architecture',
        description: "Based in India, architecting for the world. My Async-First workflow eliminates timezone friction. I deliver self-contained updates that let your US/EU team wake up to progress, not blockers.",
        icon: Globe,
        highlights: [
            'Global Remote Experience',
            'Async Communication-First',
            'Zero-Blocker Handoffs',
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

