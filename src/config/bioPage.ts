// ============================================================
// Bio Link Page Configuration
// Fully isolated config - no portfolio data dependencies
// Update values here to change the bio page content
// ============================================================
import { CONTACT_INFO } from './index';

// --- Type Definitions ---

export interface BioHero {
  name: string;
  handle: string;
  bio: string;
  avatarUrl: string;
}

export interface BioStat {
  label: string;
  value: string;
}

export interface BioMilestone {
  title: string;
}

export interface BioBadge {
  title: string;
  icon?: string; // optional emoji fallback
  iconName?: 'Award' | 'Rocket' | 'Target' | 'Sparkles' | 'ShieldCheck' | 'Trophy';
}

export interface BioLink {
  label: string;
  href: string;
  kind: 'portfolio' | 'social' | 'whatsapp' | 'primary' | 'secondary';
  icon?: string;
  iconName?: 'Linkedin' | 'Github' | 'MessageCircle' | 'CalendarClock' | 'Whatsapp' | 'Calendly';
  prefill?: string;
}

export interface BioCallout {
  text: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BioContactForm {
  heading: string;
  subheading: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  submitLabel: string;
  successMessage: string;
}

export interface BioPageConfig {
  hero: BioHero;
  stats: BioStat[];
  momentumLine: string;
  contactForm: BioContactForm;
  milestones: BioMilestone[];
  badges: BioBadge[];
  links: BioLink[];
  callout: BioCallout;
}

// --- Configuration Data ---

export const bioConfig: BioPageConfig = {
  hero: {
    name: 'Gaurav Saxena',
    handle: '@thenoobfreelancer',
    bio: '6+ years building in corporate, now helping founders ship fast as a freelancer. Shipping products that stay fast, search friendly, and easy to evolve.',
    avatarUrl: '/bio/profile.webp',
  },

  stats: [
    { label: 'Years Building', value: '6+' },
    { label: 'Clients Helped', value: '4' },
    { label: 'Releases Shipped', value: '20+' },
  ],

  momentumLine: 'and counting...',

  contactForm: {
    heading: 'Work With Me',
    subheading: 'Got a project idea? Let\'s make it happen.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'your@email.com',
    messagePlaceholder: 'Tell me about your project...',
    submitLabel: 'Start the conversation',
    successMessage: 'Thanks for reaching out! I\'ll get back to you shortly.',
  },

  milestones: [
    { title: 'Acquire My First Client' },
    { title: 'Post Consistently for 30 Days' },
    { title: 'Publish 3 Case Study Breakdowns' },
  ],

  badges: [
    { title: 'Courage to Start', iconName: 'Rocket' },
  ],

  links: [
    {
      label: 'View My Portfolio',
      href: 'https://gauravsaxena.site',
      kind: 'portfolio',
    },
    {
      label: 'LinkedIn',
      href: CONTACT_INFO.linkedin,
      kind: 'social',
      iconName: 'Linkedin',
    },
    {
      label: 'GitHub',
      href: CONTACT_INFO.github,
      kind: 'social',
      iconName: 'Github',
    },
    {
      label: 'Chat on WhatsApp',
      href: 'https://wa.me/919549992949?text=Hey%20Gaurav%2C%20I%20just%20saw%20your%20bio%20page%20and%20would%20love%20to%20chat%20about%20a%20project.',
      kind: 'whatsapp',
      prefill: 'Hey Gaurav, I just saw your bio page and would love to chat about a project.',
      iconName: 'Whatsapp',
    },
    {
      label: 'Book a Call',
      href: CONTACT_INFO.schedulingUrl,
      kind: 'primary',
      iconName: 'Calendly',
    },
  ],

  callout: {
    text: 'Want to see more of my work and detailed case studies?',
    ctaLabel: 'Visit My Portfolio',
    ctaHref: 'https://gauravsaxena.site',
  },
};
