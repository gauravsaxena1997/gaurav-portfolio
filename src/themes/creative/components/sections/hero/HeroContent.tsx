'use client';

import { HERO_CONTENT } from '@/config';
import { SocialLinks } from './SocialLinks';
import { AccentSeparator } from '../../ui';
import styles from './HeroSection.module.css';

interface HeroContentProps {
  /** Whether to apply entrance animations (mobile only) */
  animate: boolean;
  /** Optional extra className for styling */
  className?: string;
  /** Custom click handler for CTA */
  onCtaClick?: () => void;
}

export function HeroContent({ animate, className, onCtaClick }: HeroContentProps) {
  const animClass = animate ? styles.animateIn : '';
  const contentClassName = `${styles.heroContent} ${className ?? ''}`.trim();

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className={contentClassName}>
      <p className={`${styles.greeting} ${animClass} greeting`}>
        {HERO_CONTENT.greeting.text} <span className={styles.greetingAccent}>{HERO_CONTENT.greeting.accent}</span>
      </p>

      {/* Hero Name - dominant, 70% visual weight */}
      <h1 className={`${styles.heroName} ${animClass} heroName`}>
        {HERO_CONTENT.name}
      </h1>

      {/* Positioning Line - memorable tagline (Client Benefit) */}
      <p className={`${styles.heroTagline} ${animClass} heroTagline`}>
        {HERO_CONTENT.tagline}
      </p>

      {/* Supporting Text - value-focused description (SEO Keywords retained) */}
      <p className={`${styles.heroSubtitle} ${animClass} heroSubtitle`}>
        {HERO_CONTENT.subtitle}
      </p>

      <AccentSeparator className={`${animClass} socialDivider`} />

      {/* Action Row: Social Links + CTA */}
      <div
        className={`${styles.actionRow} ${animClass} actionRow flex items-center gap-[var(--space-xl)]`}
      >
        <SocialLinks className={styles.socialLinks} />
        <button
          className={styles.heroCTA}
          onClick={handleCtaClick}
        >
          Let's Talk
        </button>
      </div>
    </div>
  );
}
