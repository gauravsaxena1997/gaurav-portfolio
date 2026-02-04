export const CONTACT_INFO = {
    email: 'gauravsaxena.jaipur@gmail.com',
    location: 'Remote / Jaipur, IN',
    availability: 'Open for Projects',
    schedulingUrl: 'https://calendly.com/gauravsaxena/30min',
    get mailto() {
        return `mailto:${this.email}`;
    }
};

export const SOCIAL_LINKS = [
    {
        name: 'linkedin',
        href: 'https://linkedin.com/in/gauravsaxena27',
        label: 'Connect on LinkedIn',
    },
    {
        name: 'github',
        href: 'https://github.com/itsgsaxena',
        label: 'View GitHub profile',
    },
    {
        name: 'email',
        href: CONTACT_INFO.mailto,
        label: 'Send an email',
    },
];

export const HERO_CONTENT = {
    greeting: {
        text: 'Freelancer · Creative',
        accent: 'Technologist',
    },
    name: 'GAURAV SAXENA',
    tagline: 'Building immersive, high-performance web platforms that drive growth.',
    subtitle: 'Full Stack Architect specializing in scalable systems, 3D experiences, and AI-driven engineering.',
};
