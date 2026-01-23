'use client';

import { memo, useRef, useEffect, useState } from 'react';
import { useScrollContext } from '../../../context/ScrollContext';
import { getProjectsForDisplay } from './config';
import { TabletFrame } from './TabletFrame';
import { InteractiveGallery } from './InteractiveGallery';
import { ProjectCarousel } from './ProjectCarousel';
import styles from './ProjectSection.module.css';

/**
 * ProjectSection - Redesigned with clean vertical scrolling
 * Features:
 * - Single slide per project with extended height for scroll space
 * - Left column: All content (becomes sticky while scrolling)
 * - Right column: Hero video (tablet) + Screenshots (parallax)
 * - Clean vertical scroll, no diagonal animation
 */
export const ProjectSection = memo(function ProjectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const { setCurrentProjectIndex, setIsInProjectsSection } = useScrollContext();

  const projects = getProjectsForDisplay();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Scroll handler for project tracking
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if we're in the projects section
      const inProjectsSection = rect.top <= 0 && rect.bottom >= viewportHeight;
      setIsInProjectsSection(inProjectsSection);

      // Calculate which project is active based on scroll position
      if (inProjectsSection) {
        const slides = container.querySelectorAll(`.${styles.projectSlide}`);
        slides.forEach((slide, index) => {
          const slideRect = slide.getBoundingClientRect();
          // Project is active when its slide is in view
          if (slideRect.top <= viewportHeight * 0.5 && slideRect.bottom >= viewportHeight * 0.5) {
            if (index !== activeProjectIndex) {
              setActiveProjectIndex(index);
              setCurrentProjectIndex(index);
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProjectIndex, setCurrentProjectIndex, setIsInProjectsSection]);

  return (
    <div ref={containerRef} className={styles.projectsContainer}>
      {projects.map((project, index) => (
        <div key={project.id} className={styles.projectSlide}>
          {/* Left Column - Becomes Sticky */}
          <div className={styles.leftColumn}>
            <div className={styles.stickyContent}>
              {/* Project Number & Name */}
              <div className={styles.projectHeader}>
                <span className={styles.projectNumber}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.divider}>|</span>
                <h2 className={styles.projectName}>{project.title.toUpperCase()}</h2>
              </div>

              {/* Category Badge with Tooltip */}
              <div
                className={styles.categoryBadge}
                data-tooltip={
                  project.category === 'case-study'
                    ? 'Deep-dive analysis with problem, solution & results'
                    : project.category === 'venture'
                      ? 'Self-initiated project exploring new ideas'
                      : 'Professional engagement for external clients'
                }
              >
                {project.category === 'case-study' && 'Case Study'}
                {project.category === 'venture' && 'Personal Venture'}
                {project.category === 'client' && 'Client Work'}
              </div>

              {/* CTA Button - Prioritized position */}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.ctaButton}
                >
                  View Live
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </a>
              )}

              {/* About */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>ABOUT</h3>
                <p className={styles.description}>{project.shortDescription}</p>
              </div>

              {/* Key Highlights */}
              {project.highlights && project.highlights.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>KEY HIGHLIGHTS</h3>
                  <div className={styles.highlights}>
                    {project.highlights.map((highlight) => (
                      <span key={highlight} className={styles.highlightBadge}>
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack */}
              {project.techStack && project.techStack.length > 0 && (
                <div className={styles.section}>
                  <h3 className={styles.sectionTitle}>TECH STACK</h3>
                  <div className={styles.techTags}>
                    {project.techStack.map((tech) => (
                      <span key={tech} className={styles.techTag}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

                          </div>
          </div>

          {/* Right Column - Hero Video + Screenshots */}
          <div className={styles.rightColumn}>
            {/* Hero Video in Tablet Frame */}
            <div className={styles.heroMedia}>
              <TabletFrame
                videoSrc={project.heroVideo}
                imageSrc={project.thumbnail}
                alt={`${project.title} demo`}
              />
            </div>

            {/* Screenshots with Parallax */}
            {project.images && project.images.length > 0 && (
              <>
                {isMobile ? (
                  <ProjectCarousel
                    images={project.images}
                    projectName={project.title}
                  />
                ) : (
                  <InteractiveGallery
                    images={project.images}
                    projectName={project.title}
                  />
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
});
