'use client';

import { useEffect, useRef, useState } from 'react';
import { SKILL_CATEGORIES } from '@/data';
import { useSectionAnimation } from '../hooks';
import styles from './Skills.module.css';

// Comprehensive icon URL mappings
const getIconUrl = (icon: string): string => {
  const iconMappings: Record<string, string> = {
    // Web
    react: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    angularjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/angularjs/angularjs-original.svg',
    nextjs: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    typescript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    javascript: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg',
    tailwindcss: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg',
    nodejs: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    express: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg',
    postgresql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    mongodb: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg',
    redis: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg',
    // DevOps
    docker: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    amazonwebservices: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
    git: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    github: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg',
    vercel: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
    linux: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg',
    // UI/UX
    figma: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg',
    css3: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg',
    sass: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sass/sass-original.svg',
    html5: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg',
    // Integrations
    supabase: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/supabase/supabase-original.svg',
    firebase: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg',
    stripe: 'https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg',
    graphql: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/graphql/graphql-plain.svg',
    postman: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg',
  };

  return iconMappings[icon] || `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}/${icon}-original.svg`;
};

// Icons that are dark/black and need inversion in dark mode
const DARK_ICONS = ['nextjs', 'express', 'github', 'vercel'];

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
