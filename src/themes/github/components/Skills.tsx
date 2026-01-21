'use client';

import { Tag } from 'lucide-react';
import { SKILL_CATEGORIES } from '@/data';
import styles from './Skills.module.css';

const getIconUrl = (icon: string): string => {
  const iconMappings: Record<string, string> = {
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
    docker: '/icons/docker-original.svg',
    amazonwebservices: '/icons/amazonwebservices-original.svg',
    git: '/icons/git-original.svg',
    github: '/icons/github-original.svg',
    vercel: '/icons/vercel-original.svg',
    linux: '/icons/linux-original.svg',
    figma: '/icons/figma-original.svg',
    css3: '/icons/css3-original.svg',
    sass: '/icons/sass-original.svg',
    html5: '/icons/html5-original.svg',
    supabase: '/icons/supabase-original.svg',
    firebase: '/icons/firebase-original.svg',
    stripe: '/icons/stripe-original.svg',
    graphql: '/icons/graphql-plain.svg',
    postman: '/icons/postman-original.svg',
  };

  return iconMappings[icon] || `/icons/${icon}-original.svg`;
};

const DARK_ICONS = ['nextjs', 'express', 'github', 'vercel', 'stripe'];

export function Skills() {
  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <Tag size={20} className={styles.headerIcon} />
          <div className={styles.headerText}>
            <h1 className={styles.title}>Skills & Technologies</h1>
            <p className={styles.subtitle}>Browse by category or explore featured topics</p>
          </div>
        </div>

        {/* Skill Categories - 2x2 Grid */}
        <div className={styles.categoriesGrid}>
          {SKILL_CATEGORIES.map((category) => (
            <div key={category.category} className={styles.categoryCard}>
              <h3 className={styles.categoryTitle}>{category.label}</h3>
              <div className={styles.skillsGrid}>
                {category.skills.map((skill) => (
                  <div key={skill.name} className={styles.skillBadge}>
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
          ))}
        </div>
      </div>
    </section>
  );
}
