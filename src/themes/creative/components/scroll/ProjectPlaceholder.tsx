'use client';

import { useRef, useEffect } from 'react';
import { useScrollContext } from '../../context/ScrollContext';
import styles from './ProjectPlaceholder.module.css';

interface ProjectData {
  name: string;
  index: number;
}

interface ProjectPlaceholderProps {
  projects: ProjectData[];
}

export function ProjectPlaceholder({ projects }: ProjectPlaceholderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const { setCurrentProjectIndex, setIsInProjectsSection, isInProjectsSection } = useScrollContext();
  const lastProjectRef = useRef(0);

  // Total number of slides (2 per project)
  const totalFeaturedSlides = projects.length * 2;

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const featuredProjectsHeight = totalFeaturedSlides * viewportHeight;
      const containerScrollTop = Math.max(0, -rect.top);

      // Show header only during featured projects (hide when entering "Other Projects")
      // Hide header when we've scrolled past the last featured project slide
      const inFeaturedSection = rect.top <= 0 &&
        containerScrollTop < featuredProjectsHeight - viewportHeight;
      setIsInProjectsSection(inFeaturedSection);

      // Calculate active project and update header with flip animation
      if (containerScrollTop >= 0 && containerScrollTop < featuredProjectsHeight) {
        const currentSlideIndex = Math.floor(containerScrollTop / viewportHeight);
        const projectIndex = Math.min(
          projects.length - 1,
          Math.max(0, Math.floor(currentSlideIndex / 2))
        );

        if (projectIndex !== lastProjectRef.current) {
          const numberEl = numberRef.current;
          const nameEl = nameRef.current;

          if (numberEl && nameEl) {
            // Add flipping class
            numberEl.classList.add(styles.flipping);
            nameEl.classList.add(styles.flipping);

            // After 150ms, update content and remove flipping class
            setTimeout(() => {
              const project = projects[projectIndex];
              numberEl.textContent = String(project.index + 1).padStart(2, '0');
              nameEl.textContent = project.name.toUpperCase();

              numberEl.classList.remove(styles.flipping);
              nameEl.classList.remove(styles.flipping);
            }, 150);
          }

          lastProjectRef.current = projectIndex;
          setCurrentProjectIndex(projectIndex);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [projects, totalFeaturedSlides, setCurrentProjectIndex, setIsInProjectsSection]);

  const initialProject = projects[0];

  return (
    <div ref={containerRef} className={styles.projectsContainer}>
      {/* Project Header - Part of the same canvas during diagonal animation */}
      {/* Hidden when fixed header takes over (isInProjectsSection = true) */}
      <div ref={headerRef} className={`${styles.projectHeader} ${isInProjectsSection ? styles.hidden : ''}`}>
        <div ref={numberRef} className={styles.projectNumber}>
          {String(initialProject.index + 1).padStart(2, '0')}
        </div>
        <span className={styles.divider}>|</span>
        <h2 ref={nameRef} className={styles.projectName}>
          {initialProject.name.toUpperCase()}
        </h2>
      </div>

      {/* Scrollable content area - each slide is 100vh */}
      <div className={styles.scrollableContent}>
        {projects.map((project) => (
          <div key={project.name} className={styles.projectSlides}>
            {/* Slide 1: About + Hero */}
            <div className={styles.slide}>
              <div className={styles.slideInner}>
                <div className={styles.twoColumns}>
                  <div className={styles.leftColumn}>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>ABOUT</h3>
                      <p className={styles.placeholderText}>
                        Project description for {project.name}. This is a placeholder
                        for the actual project description that will explain what
                        the project does and its key purpose.
                      </p>
                    </div>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>KEY HIGHLIGHTS</h3>
                      <ul className={styles.placeholderList}>
                        <li>Highlight 1</li>
                        <li>Highlight 2</li>
                        <li>Highlight 3</li>
                      </ul>
                    </div>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>HERO ACTION</h3>
                      <div className={styles.buttonPlaceholder}>View Live</div>
                    </div>
                  </div>
                  <div className={styles.rightColumn}>
                    <div className={styles.tabletFrame}>
                      <div className={styles.tabletScreen}>
                        <span className={styles.mediaPlaceholder}>HERO VIDEO/IMAGE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Details + Screenshots */}
            <div className={styles.slide}>
              <div className={styles.slideInner}>
                <div className={styles.twoColumns}>
                  <div className={styles.leftColumn}>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>TECH STACK</h3>
                      <div className={styles.techTags}>
                        <span className={styles.tag}>React</span>
                        <span className={styles.tag}>Next.js</span>
                        <span className={styles.tag}>TypeScript</span>
                      </div>
                    </div>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>CHALLENGES</h3>
                      <p className={styles.placeholderText}>Technical challenges overcome</p>
                    </div>
                    <div className={styles.placeholder}>
                      <h3 className={styles.placeholderTitle}>RESULTS</h3>
                      <p className={styles.placeholderText}>Outcomes and metrics</p>
                    </div>
                  </div>
                  <div className={styles.rightColumn}>
                    <div className={styles.screenshotStack}>
                      <div className={`${styles.screenshot} ${styles.screenshot1}`}>
                        <span>Screenshot 1</span>
                      </div>
                      <div className={`${styles.screenshot} ${styles.screenshot2}`}>
                        <span>Screenshot 2</span>
                      </div>
                      <div className={`${styles.screenshot} ${styles.screenshot3}`}>
                        <span>Screenshot 3</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Other Projects to Explore */}
        <div className={styles.otherProjects}>
          <h2 className={styles.otherProjectsTitle}>Other Projects to Explore</h2>
          <div className={styles.projectCards}>
            {['Project D', 'Project E', 'Project F', 'Project G'].map((name) => (
              <div key={name} className={styles.projectCard}>
                <div className={styles.cardImage}>
                  <span>Thumbnail</span>
                </div>
                <h3 className={styles.cardTitle}>{name}</h3>
                <p className={styles.cardDesc}>Brief description</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
