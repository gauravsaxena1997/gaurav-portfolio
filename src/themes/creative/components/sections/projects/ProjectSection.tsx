import { memo, useRef, useEffect, useState, useCallback } from 'react';
import { useScrollContext } from '../../../context/ScrollContext';
import { getProjectsForDisplay } from './config';
import { InteractiveGallery } from './InteractiveGallery';
import { ProjectCarousel } from './ProjectCarousel';

import { AccentSeparator } from '../../ui';
import { UnifiedProjectViewer } from '@/components/shared/UnifiedProjectViewer';
import { ProjectSchema } from '@/components/seo';
import { AnalyticsService } from '@/services/AnalyticsService';
import {
  BotMessageSquare, BarChart3, Smartphone, ShieldCheck,
  Network, Palette, FileCode2,
  Sparkles, Zap, ShoppingBag, Film,
  Star, Layers, Globe, TrendingUp,
  CheckCircle, Rocket, type LucideIcon,
} from 'lucide-react';
import styles from './ProjectSection.module.css';

const ICON_MAP: Record<string, LucideIcon> = {
  BotMessageSquare, BarChart3, Smartphone, ShieldCheck,
  Network, Palette, FileCode2,
  Sparkles, Zap, ShoppingBag, Film,
  Star, Layers, Globe, TrendingUp,
  CheckCircle, Rocket,
};

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


  // Unified Viewer State
  const [isUnifiedOpen, setIsUnifiedOpen] = useState(false);
  const [unifiedTargetProject, setUnifiedTargetProject] = useState<number>(0);
  const preloadCache = useRef<Set<string>>(new Set());

  const {
    setCurrentProjectIndex,
    setIsInProjectsSection,
    isInProjectsSection: currentIsInProjects,
  } = useScrollContext();

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

  // Preload helper: images and video head request
  const preloadMedia = useCallback(async (index: number) => {
    if (!projects[index]) return;
    const { heroVideo, thumbnail, images } = projects[index];
    const tasks: Promise<unknown>[] = [];

    const enqueueImage = (src?: string) => {
      if (!src || preloadCache.current.has(src)) return;
      preloadCache.current.add(src);
      tasks.push(new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = () => resolve(true);
        img.src = src;
      }));
    };

    enqueueImage(thumbnail);
    images?.forEach(enqueueImage);

    if (heroVideo && !preloadCache.current.has(heroVideo)) {
      preloadCache.current.add(heroVideo);
      tasks.push(fetch(heroVideo, { method: 'HEAD' }).catch(() => null));
    }

    return Promise.all(tasks);
  }, [projects]);

  // Preload current + next project when index changes (non-blocking)
  useEffect(() => {
    // Fire-and-forget preloading - don't block rendering
    preloadMedia(activeProjectIndex);
    preloadMedia(activeProjectIndex + 1);
  }, [activeProjectIndex, preloadMedia]);

  // Scroll handler for project tracking and GuideBar logic
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      // Check if we're in the projects section
      // Relaxed check: Show as soon as top is within 50% of viewport
      const inProjectsSection = rect.top < viewportHeight * 0.5 && rect.bottom >= viewportHeight * 0.5;

      // GUARD: Only update context if value has changed
      if (inProjectsSection !== currentIsInProjects) {
        setIsInProjectsSection(inProjectsSection);
      }

      if (!inProjectsSection) {
        return;
      }

      // Calculate which project is active based on scroll position
      const slides = container.querySelectorAll(`.${styles.projectSlide}`);

      slides.forEach((slide, index) => {
        const slideRect = slide.getBoundingClientRect();

        // Check if this slide is the dominant one (occupies > 50% of viewport)
        // Or if it's the one currently filling the screen
        const isVisible = slideRect.top < viewportHeight * 0.6 && slideRect.bottom > viewportHeight * 0.4;

          if (isVisible) {
            if (index !== activeProjectIndex) {
              setActiveProjectIndex(index);
              setCurrentProjectIndex(index);
            }
          }
        });

    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProjectIndex, currentIsInProjects, setCurrentProjectIndex, setIsInProjectsSection]);


  const activeProject = projects[unifiedTargetProject];
  const initialViewerIndex = 0; // Always start from video/demo as per user request

  return (
    <div ref={containerRef} className={styles.projectsContainer}>
      {projects.map((project, index) => (
        <div key={project.id} className={styles.projectSlide} data-project-slide={index}>
          <ProjectSchema project={project} />
          {/* Left Column - Becomes Sticky */}
          <div className={styles.leftColumn}>
            <div className={styles.stickyContent}>

              {/* Background Decorative Number — pure CSS, no GSAP parallax.
                  Parallax was the root cause of inconsistent positioning: each
                  projectSlide has a different height (driven by the right-column
                  gallery), so GSAP's scrub progress differed per project even
                  when the sticky text was visually in the same viewport state. */}
              <div
                className={styles.projectNumberDecor}
                aria-hidden="true"
              >
                <div className={styles.projectNumberWrapper}>
                  <span className={styles.decorHash}>#</span>
                  <span className={styles.decorNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Row 1: Header (Title / Tag) */}
              <div className="flex items-center">
                <div className={styles.titleStack}>
                  <h2 className={styles.projectName}>{project.title}</h2>
                  <div className="flex items-center gap-4 mt-2 flex-wrap">
                    {/* Primary CTA (View Live) */}
                    {(project.liveUrl || project.slug) && (
                      <a
                        href={project.liveUrl || `/projects/${project.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.ctaButton}
                        aria-label={`View Live: ${project.title}`}
                        title={`View Live: ${project.title}`}
                        onClick={() => AnalyticsService.trackProjectInteraction('click_live_demo', project.title)}
                      >
                        View Live
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <path d="M7 17L17 7M17 7H7M17 7V17" />
                        </svg>
                      </a>
                    )}

                    {/* Secondary CTA (View Gallery) */}
                    <button
                      onClick={() => {
                        setUnifiedTargetProject(index);
                        setIsUnifiedOpen(true);
                        AnalyticsService.trackProjectInteraction('view_project_gallery', project.title);
                      }}
                      className={styles.secondaryButton}
                      aria-label={`View Gallery for ${project.title}`}
                    >
                      View Gallery
                    </button>
                  </div>
                </div>
              </div>

              <AccentSeparator />

              {/* Row 2: About Text (Large & Bold) */}
              <div className={styles.aboutSection}>
                <p className={styles.description}>{project.shortDescription}</p>
              </div>

              {/* Row 3: Key Features with Icons */}
              {project.keyFeatures && project.keyFeatures.length > 0 ? (
                <div className={styles.keyFeaturesGrid}>
                  {project.keyFeatures.slice(0, 4).map((kf: { icon: string; text: string }, i: number) => {
                    const Icon = ICON_MAP[kf.icon] ?? Star;
                    return (
                      <div key={i} className={styles.keyFeatureItem}>
                        <span className={styles.keyFeatureIconWrap}>
                          <Icon size={13} strokeWidth={2} />
                        </span>
                        <span className={styles.keyFeatureText}>{kf.text}</span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                project.features && project.features.length > 0 && (
                  <ul className={styles.featureList}>
                    {project.features.slice(0, 4).map((feat: string, i: number) => (
                      <li key={i} className={styles.featureItem}>
                        <span className={styles.featureDot} aria-hidden="true" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                )
              )}

              {/* Row 4: Tech Stack Badges */}
              {project.techStack && project.techStack.length > 0 && (
                <div className={styles.techStackRow}>
                  {project.techStack.map((tech: string) => (
                    <span key={tech} className={styles.techBadge}>{tech}</span>
                  ))}
                </div>
              )}

              {/* CTA Removed from here (Moved to Header) */}

            </div>
          </div>

          {/* Right Column - Screenshots only */}
          <div className={styles.rightColumn}>
            {/* Screenshots with Parallax */}
            {project.images && project.images.length > 0 && (
              <div className={styles.galleryWrapper} data-id={`gallery-${index}`}>
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
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Unified Project Viewer - Replaces separate ImageViewer/FullscreenVideo */}
      {activeProject && (
        <UnifiedProjectViewer
          isOpen={isUnifiedOpen}
          onClose={() => setIsUnifiedOpen(false)}
          videoSrc={activeProject.heroVideo}
          images={activeProject.images}
          initialIndex={initialViewerIndex}
          alt={activeProject.title}
          title={activeProject.title}
          liveUrl={activeProject.liveUrl}
        />
      )}
    </div>
  );
});

