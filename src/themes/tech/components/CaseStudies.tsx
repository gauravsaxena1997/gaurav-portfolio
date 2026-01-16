'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CASE_STUDIES, CATEGORY_LABELS } from '@/data';
import { useSectionAnimation } from '../hooks';
import type { ICaseStudy } from '@/data';
import styles from './CaseStudies.module.css';

interface ProjectCardProps {
  project: ICaseStudy;
}

function ProjectCard({ project }: ProjectCardProps) {
  const categoryLabel =
    project.categoryLabel || CATEGORY_LABELS[project.category];

  // Generate initials for the icon fallback
  const initials = project.title
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <Link href={`/projects/${project.slug}`} className={styles.projectCard}>
      <div className={styles.cardContent}>
        {/* Left: Icon */}
        <div className={styles.projectIcon}>
          <span className={styles.iconText}>{initials}</span>
        </div>

        {/* Center: Info */}
        <div className={styles.projectInfo}>
          <h3 className={styles.projectTitle}>{project.title}</h3>
          <span className={styles.categoryBadge}>{categoryLabel}</span>
          <p className={styles.projectDescription}>{project.shortDescription}</p>
        </div>
      </div>
    </Link>
  );
}

type FilterType = 'all' | 'client' | 'venture';

export function CaseStudies() {
  const sectionTitleRef = useSectionAnimation('projects');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const featuredCaseStudies = CASE_STUDIES.filter((cs) => cs.featured);

  const filteredProjects = activeFilter === 'all'
    ? featuredCaseStudies
    : featuredCaseStudies.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className={styles.caseStudiesSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        {/* Filter tabs */}
        <div className={styles.filterTabs}>
          <button
            className={`${styles.filterTab} ${activeFilter === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'client' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('client')}
          >
            Freelancing
          </button>
          <button
            className={`${styles.filterTab} ${activeFilter === 'venture' ? styles.activeTab : ''}`}
            onClick={() => setActiveFilter('venture')}
          >
            Personal
          </button>
        </div>

        {/* Projects list */}
        <div className={styles.projectsList}>
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
