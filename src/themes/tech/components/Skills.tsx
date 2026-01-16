'use client';

import { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '@/data';
import { useSectionAnimation } from '../hooks';
import styles from './Skills.module.css';

// Local icon URL mappings - icons stored in public/icons/ to avoid CDN proxy issues
const getIconUrl = (icon: string): string => {
  const iconMappings: Record<string, string> = {
    // Web
    react: '/icons/react-original.svg',
    angularjs: '/icons/angularjs-original.svg',
    nextjs: '/icons/nextjs-original.svg',
    typescript: '/icons/typescript-original.svg',
    javascript: '/icons/javascript-original.svg',
    tailwindcss: '/icons/tailwindcss-original.svg',
    nodejs: '/icons/nodejs-original.svg',
    express: '/icons/express-original.svg',
    postgresql: '/icons/postgresql-original.svg',
    mongodb: '/icons/mongodb-original.svg',
    redis: '/icons/redis-original.svg',
    // DevOps
    docker: '/icons/docker-original.svg',
    amazonwebservices: '/icons/amazonwebservices-original.svg',
    git: '/icons/git-original.svg',
    github: '/icons/github-original.svg',
    vercel: '/icons/vercel-original.svg',
    linux: '/icons/linux-original.svg',
    // UI/UX
    figma: '/icons/figma-original.svg',
    css3: '/icons/css3-original.svg',
    sass: '/icons/sass-original.svg',
    html5: '/icons/html5-original.svg',
    // Integrations
    supabase: '/icons/supabase-original.svg',
    firebase: '/icons/firebase-original.svg',
    stripe: '/icons/stripe-original.svg',
    graphql: '/icons/graphql-plain.svg',
    postman: '/icons/postman-original.svg',
  };

  return iconMappings[icon] || `/icons/${icon}-original.svg`;
};

// Icons that are dark/black and need inversion in dark mode
const DARK_ICONS = ['nextjs', 'express', 'github', 'vercel', 'stripe'];

interface SkillRowProps {
  category: (typeof SKILL_CATEGORIES)[number];
}

function SkillRow({ category }: SkillRowProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (trackRef.current && scrollerRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const scrollerWidth = scrollerRef.current.scrollWidth;
        setShouldAnimate(scrollerWidth > trackWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  return (
    <div className={styles.categoryRow}>
      <div className={styles.categoryLabel}>{category.label}</div>
      <div ref={trackRef} className={styles.skillsTrack}>
        <div
          ref={scrollerRef}
          className={`${styles.skillsScroller} ${shouldAnimate ? styles.animate : ''}`}
        >
          {category.skills.map((skill) => (
            <div key={skill.name} className={styles.skillCard}>
              <img
                src={getIconUrl(skill.icon)}
                alt={skill.name}
                className={`${styles.skillIcon} ${DARK_ICONS.includes(skill.icon) ? styles.darkIcon : ''}`}
                loading="lazy"
              />
              <span className={styles.skillName}>{skill.name}</span>
            </div>
          ))}
          {/* Duplicate only when animating for seamless loop */}
          {shouldAnimate &&
            category.skills.map((skill) => (
              <div key={`${skill.name}-dup`} className={styles.skillCard}>
                <img
                  src={getIconUrl(skill.icon)}
                  alt={skill.name}
                  className={`${styles.skillIcon} ${DARK_ICONS.includes(skill.icon) ? styles.darkIcon : ''}`}
                  loading="lazy"
                />
                <span className={styles.skillName}>{skill.name}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export function Skills() {
  const sectionTitleRef = useSectionAnimation('skills');

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        <div className={styles.skillsContainer}>
          {SKILL_CATEGORIES.map((category) => (
            <SkillRow key={category.category} category={category} />
          ))}
        </div>
      </div>
    </section>
  );
}
