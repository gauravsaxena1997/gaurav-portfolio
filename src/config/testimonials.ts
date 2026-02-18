export interface Testimonial {
    id: string;
    name: string;
    designation: string;
    quote: string;
    projectUrl?: string; // Optional: Link to the project or client site
    avatar?: string; // Optional: Path to image in public folder
}

export const TESTIMONIALS: Testimonial[] = [
    {
        id: 'cultureticks',
        name: 'Maxwell Truluck',
        designation: 'CEO/Founder — CultureTicks',
        quote: "Gaurav was an incredibly efficient and proactive worker. He was fantastic at performing due diligence on new materials and absorbed information incredibly quickly. I would highly recommend his services to anyone and everyone.",
        projectUrl: 'https://cultureticks.com',
        // No avatar provided -> Will fallback to "MT" initials
    },
    {
        id: 'punit',
        name: 'Punit Gauttam',
        designation: 'Senior Data & BI Engineer',
        quote: "Working with Gaurav was a smooth and valuable experience. He combines consulting mindset, web development skills, and content understanding to deliver well-rounded solutions. He communicates clearly, meets commitments, and focuses on quality. I’d recommend him to anyone looking for a reliable freelance partner who can handle both strategy and execution.",
        projectUrl: 'https://punitgauttam.vercel.app',
        avatar: '/images/testimonials/punit.webp'
    }
];
