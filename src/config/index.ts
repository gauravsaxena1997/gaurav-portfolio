export const CONTACT_INFO = {
    email: 'gauravsaxena.jaipur@gmail.com',
    location: 'Remote / Jaipur, IN',
    availability: 'Open for Projects',
    schedulingUrl: 'https://calendly.com/gauravsaxena/30min',
    github: 'https://github.com/gauravsaxena1997',
    linkedin: 'https://linkedin.com/in/gauravsaxena1997',
    get mailto() {
        return `mailto:${this.email}`;
    }
};

export const SOCIAL_LINKS = [
    {
        name: 'linkedin',
        href: 'https://linkedin.com/in/gauravsaxena1997',
        label: 'Connect on LinkedIn',
    },
    {
        name: 'github',
        href: 'https://github.com/gauravsaxena1997',
        label: 'View GitHub profile',
    }
];

export const HERO_CONTENT = {
    greeting: {
        text: 'Creative Technologist',
        accent: '& Senior Engineer',
    },
    name: 'GAURAV SAXENA',
    tagline: 'Merging 6+ Years of Corporate Experience with Modern AI & Creative Design.',
    subtitle: 'I build scalable, high-performance platforms that help your business grow. Specialist in Interactive Web Experiences and Smart Applications.',
};

// Re-export FAQ data for convenience
export { FAQ_ITEMS } from './faq';
export type { FAQItem } from './faq';

