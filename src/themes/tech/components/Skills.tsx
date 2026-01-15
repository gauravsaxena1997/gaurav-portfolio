'use client';

import { useState } from 'react';
import { SKILL_CATEGORIES } from '@/data';
import { useSectionAnimation } from '../hooks';
import styles from './Skills.module.css';

// Icon URL with fallback handling
const getIconUrl = (icon: string) => {
  // Special mappings for icons that need different paths
  const iconMappings: Record<string, string> = {
    postman: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg',
    stripe: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/stripe/stripe-original.svg',
    vercel: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg',
  };

  if (iconMappings[icon]) {
    return iconMappings[icon];
  }

  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${icon}/${icon}-original.svg`;
};

export function Skills() {
  const sectionTitleRef = useSectionAnimation('skills');
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].category);

  const activeSkills = SKILL_CATEGORIES.find(
    (cat) => cat.category === activeCategory
  )?.skills || [];

  return (
    <section id="skills" className={styles.skillsSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        <div className={styles.skillsLayout}>
          {/* Left Sidebar - Categories */}
          <div className={styles.sidebar}>
            {SKILL_CATEGORIES.map((category) => (
              <button
                key={category.category}
                className={`${styles.categoryButton} ${
                  activeCategory === category.category ? styles.activeCategory : ''
                }`}
                onClick={() => setActiveCategory(category.category)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Right Content - Skills Grid */}
          <div className={styles.skillsContent}>
            <div className={styles.skillsGrid}>
              {activeSkills.map((skill) => (
                <div key={skill.name} className={styles.skillCard}>
                  <div className={styles.iconWrapper}>
                    <img
                      src={getIconUrl(skill.icon)}
                      alt={skill.name}
                      className={styles.skillIcon}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        // Try plain version as fallback
                        if (target.src.includes('-original')) {
                          target.src = `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${skill.icon}/${skill.icon}-plain.svg`;
                        } else {
                          // Final fallback - hide broken image
                          target.style.display = 'none';
                        }
                      }}
                    />
                  </div>
                  <span className={styles.skillName}>{skill.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
