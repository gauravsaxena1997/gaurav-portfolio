'use client';

import Link from 'next/link';
import { Star } from 'lucide-react';
import { CASE_STUDIES, CATEGORY_LABELS } from '@/data';
import { useSectionAnimation } from '../hooks';
import type { ICaseStudy } from '@/data';
import styles from './CaseStudies.module.css';

interface ProjectCardProps {
  project: ICaseStudy;
}

function StarRating() {
  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={12} className={styles.starFilled} fill="currentColor" />
      ))}
    </div>
  );
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
          <div className={styles.projectMeta}>
            <StarRating />
            <span className={styles.categoryBadge}>{categoryLabel}</span>
          </div>
          <p className={styles.projectDescription}>{project.shortDescription}</p>
          <div className={styles.techStack}>
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech} className={styles.techTag}>
                {tech}
              </span>
            ))}
            {project.techStack.length > 4 && (
              <span className={styles.techTag}>+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function CaseStudies() {
  const sectionTitleRef = useSectionAnimation('projects');

  // Show all featured case studies without filtering
  const featuredCaseStudies = CASE_STUDIES.filter((cs) => cs.featured);

  return (
    <section id="projects" className={styles.caseStudiesSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        {/* Projects list */}
        <div className={styles.projectsList}>
          {featuredCaseStudies.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
