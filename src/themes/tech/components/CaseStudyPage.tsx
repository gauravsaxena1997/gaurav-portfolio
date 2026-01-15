'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Github,
  Youtube,
  CheckCircle,
} from 'lucide-react';
import { CATEGORY_LABELS } from '@/data';
import { useTheme } from '@/hooks';
import type { ICaseStudy } from '@/data';
import styles from './CaseStudyPage.module.css';

interface CaseStudyPageProps {
  caseStudy: ICaseStudy;
  prevProject: ICaseStudy | null;
  nextProject: ICaseStudy | null;
}

export function CaseStudyPage({
  caseStudy,
  prevProject,
  nextProject,
}: CaseStudyPageProps) {
  const { isDarkTheme } = useTheme();
  const categoryLabel =
    caseStudy.categoryLabel || CATEGORY_LABELS[caseStudy.category];

  return (
    <div className={`tech-theme ${!isDarkTheme ? 'light-theme' : ''}`}>
      <div className={styles.pageContainer}>
        {/* Back Navigation */}
        <Link href="/#projects" className={styles.backLink}>
          <ArrowLeft size={18} />
          Back to Portfolio
        </Link>

        {/* Hero Section */}
        <div className={styles.heroSection}>
          <div className={styles.heroPlaceholder}>
            <span>{caseStudy.title.charAt(0)}</span>
          </div>
        </div>

        {/* Project Header */}
        <div className={styles.projectHeader}>
          <h1 className={`${styles.projectTitle} code-font`}>
            {caseStudy.title}
          </h1>
          <span
            className={`${styles.categoryBadge} ${
              caseStudy.category === 'venture'
                ? styles.ventureBadge
                : styles.clientBadge
            }`}
          >
            {categoryLabel}
          </span>
          <div className={styles.techStack}>
            {caseStudy.techStack.map((tech) => (
              <span key={tech} className={styles.techChip}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className={styles.contentGrid}>
          {/* Problem Section */}
          {caseStudy.problem && (
            <div className={styles.contentSection}>
              <h2 className={`${styles.sectionHeading} code-font`}>
                {'// THE PROBLEM'}
              </h2>
              <p className={styles.sectionText}>{caseStudy.problem}</p>
            </div>
          )}

          {/* Solution Section */}
          {caseStudy.solution && (
            <div className={styles.contentSection}>
              <h2 className={`${styles.sectionHeading} code-font`}>
                {'// THE SOLUTION'}
              </h2>
              <p className={styles.sectionText}>{caseStudy.solution}</p>
              {caseStudy.features.length > 0 && (
                <ul className={styles.featureList}>
                  {caseStudy.features.map((feature) => (
                    <li key={feature}>
                      <span className={styles.bullet}>&gt;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Results Section */}
          {caseStudy.results && caseStudy.results.length > 0 && (
            <div className={styles.contentSection}>
              <h2 className={`${styles.sectionHeading} code-font`}>
                {'// RESULTS'}
              </h2>
              <ul className={styles.resultsList}>
                {caseStudy.results.map((result) => (
                  <li key={result}>
                    <CheckCircle size={18} className={styles.checkIcon} />
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* YouTube Section (for Superhuman Flow) */}
        {caseStudy.youtubeUrl && (
          <div className={styles.youtubeSection}>
            <h2 className={`${styles.sectionHeading} code-font`}>
              {'// FOCUS MUSIC FOR PRODUCTIVITY'}
            </h2>
            <div className={styles.youtubeContent}>
              <Youtube size={48} className={styles.youtubeIcon} />
              <p className={styles.youtubeText}>
                Check out the Superhuman Flow YouTube channel for focus music
                and productivity content.
              </p>
              <a
                href={caseStudy.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.youtubeButton}
              >
                <Youtube size={18} />
                Visit YouTube Channel
              </a>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {caseStudy.liveUrl && (
            <a
              href={caseStudy.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.primaryButton}
            >
              <ExternalLink size={18} />
              Visit Live Site
            </a>
          )}
          {caseStudy.githubUrl && (
            <a
              href={caseStudy.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryButton}
            >
              <Github size={18} />
              View Code
            </a>
          )}
        </div>

        {/* Project Navigation */}
        <div className={styles.projectNavigation}>
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className={styles.navLink}
            >
              <ArrowLeft size={18} />
              <span className={styles.navLabel}>Previous</span>
              <span className={styles.navTitle}>{prevProject.title}</span>
            </Link>
          ) : (
            <div></div>
          )}
          {nextProject && (
            <Link
              href={`/projects/${nextProject.slug}`}
              className={`${styles.navLink} ${styles.navLinkRight}`}
            >
              <span className={styles.navLabel}>Next</span>
              <span className={styles.navTitle}>{nextProject.title}</span>
              <ArrowRight size={18} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
