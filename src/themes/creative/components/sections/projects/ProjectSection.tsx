import { memo, useRef, useEffect, useState, createRef, useMemo } from 'react';
import { useScrollContext } from '../../../context/ScrollContext';
import { getProjectsForDisplay } from './config';
import { TabletFrame, TabletFrameHandle } from './TabletFrame';
import { InteractiveGallery } from './InteractiveGallery';
import { ProjectCarousel } from './ProjectCarousel';
import { BackgroundDecor } from '../../common/BackgroundDecor';
import { Highlights, AccentSeparator, GuideBar } from '../../ui';
import { UnifiedProjectViewer } from '@/components/shared/UnifiedProjectViewer';
import { ProjectSchema } from '@/components/seo';
import { AnalyticsService } from '@/services/AnalyticsService';
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

  // Guide Bar State
  const [guideState, setGuideState] = useState<{
    message: string;
    actionLabel: string;
    action: 'video' | 'gallery' | null;
    targetIndex: number;
  } | null>(null);

  // Unified Viewer State
  const [isUnifiedOpen, setIsUnifiedOpen] = useState(false);
  const [unifiedTargetProject, setUnifiedTargetProject] = useState<number>(0);
  const [unifiedStartType, setUnifiedStartType] = useState<'video' | 'gallery'>('video');

  const { setCurrentProjectIndex, setIsInProjectsSection } = useScrollContext();

  const projects = getProjectsForDisplay();

  // Create refs for TabletFrames to trigger fullscreen (Optional now, if still needed for individual clicks?)
  // Keeping specific fullscreen for TabletFrame interaction itself if user clicks the frame directly.
  const projectRefs = useMemo(() =>
    Array(projects.length).fill(0).map(() => createRef<TabletFrameHandle>()),
    [projects.length]
  );

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      setIsInProjectsSection(inProjectsSection);

      if (!inProjectsSection) {
        setGuideState(null);
        return;
      }

      // Calculate which project is active based on scroll position
      const slides = container.querySelectorAll(`.${styles.projectSlide}`);
      let foundActive = false;

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
          foundActive = true;

          // Determine context (Video/Info vs Images)
          // Look for the gallery wrapper within this slide to see its position
          const gallery = slide.querySelector(`[data-id="gallery-${index}"]`);
          if (gallery) {
            const galleryRect = gallery.getBoundingClientRect();
            // If gallery is entering the "active" zone (started entering viewport or above fold)
            // Threshold: Gallery top is above 60% of viewport height (coming up)
            const isGalleryActive = galleryRect.top < viewportHeight * 0.7;

            setGuideState(isGalleryActive ? {
              message: "View Demo / Images in Full Screen",
              actionLabel: "Click Here",
              action: 'gallery',
              targetIndex: index
            } : {
              message: "View Demo / Images in Full Screen",
              actionLabel: "Click Here",
              action: 'video',
              targetIndex: index
            });
          } else {
            // Fallback if no gallery
            setGuideState({
              message: "View Demo / Images in Full Screen",
              actionLabel: "Click Here",
              action: 'video',
              targetIndex: index
            });
          }
        }
      });

      if (!foundActive) {
        setGuideState(null);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeProjectIndex, setCurrentProjectIndex, setIsInProjectsSection]);

  // Handle Guide Bar Actions - NOW UNIFIED
  const handleGuideAction = () => {
    if (!guideState) return;

    setUnifiedTargetProject(guideState.targetIndex);

    // Determine start index based on action
    // 'video' starts at index 0
    // 'gallery' starts at index 1 (since index 0 is video)
    setUnifiedStartType(guideState.action || 'video');
    setIsUnifiedOpen(true);
  };

  const activeProject = projects[unifiedTargetProject];
  // Calculate initial index: if action was gallery, we want to start at first image. 
  // If video exists, first image is index 1. If not, index 0.
  // Assuming all projects have video for now based on TabletFrame logic.
  const hasVideo = !!activeProject?.heroVideo;
  const initialViewerIndex = 0; // Always start from video/demo as per user request

  return (
    <div ref={containerRef} className={styles.projectsContainer}>
      {projects.map((project, index) => (
        <div key={project.id} className={styles.projectSlide}>
          <ProjectSchema project={project} />
          {/* Left Column - Becomes Sticky */}
          <div className={styles.leftColumn}>
            <div className={styles.stickyContent}>

              {/* Background Decorative Number */}
              <BackgroundDecor
                position={{ bottom: '15%', right: '10%' }}
                size="200px"
                parallaxSpeed={0.12}
                className={styles.projectNumberDecor}
              >
                <div className={styles.projectNumberWrapper}>
                  <span className={styles.decorHash}>#</span>
                  <span className={styles.decorNumber}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </BackgroundDecor>

              {/* Row 1: Header (Title / Tag) */}
              <div className="flex items-center gap-[var(--space-md)] mb-[var(--space-md)]">
                <div className={styles.titleStack}>
                  <h2 className={styles.projectName}>{project.title}</h2>
                  <div className="flex items-center gap-6 mt-2 flex-wrap">
                    <span className={styles.categoryBadge}>
                      {project.category === 'case-study' && 'Case Study'}
                      {project.category === 'venture' && 'Personal Venture'}
                      {project.category === 'client' && 'Client Work'}
                    </span>

                    {/* CTA Moved Here */}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
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
                  </div>
                </div>
              </div>

              {/* Accent separator - matches Services pattern */}
              <AccentSeparator />

              {/* Row 2: About Text (Large & Bold) */}
              <div className={styles.aboutSection}>
                <p className={styles.description}>{project.shortDescription}</p>
              </div>

              {/* Row 3: Key Highlights with shared Highlights component */}
              {project.highlights && project.highlights.length > 0 && (
                <div className={styles.highlightsSection}>
                  <Highlights items={project.highlights} />
                </div>
              )}

              {/* CTA Removed from here (Moved to Header) */}

            </div>
          </div>

          {/* Right Column - Hero Video + Screenshots */}
          <div className={styles.rightColumn}>
            {/* Hero Video in Tablet Frame */}
            <div className={styles.heroMedia}>
              <TabletFrame
                ref={projectRefs[index]}
                videoSrc={project.heroVideo}
                imageSrc={project.thumbnail}
                alt={`${project.title} demo`}
                onExpand={() => {
                  setUnifiedTargetProject(index);
                  setUnifiedStartType('video');
                  setIsUnifiedOpen(true);
                  AnalyticsService.trackProjectInteraction('view_project', project.title);
                }}
              />
            </div>

            {/* Screenshots with Parallax - Wrapped to scroll over sticky video */}
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

      {/* Persistent GuideBar for Section Context */}
      <GuideBar
        forceVisible={!!guideState}
        isPersistent={true}
        message={guideState?.message}
        actionLabel={guideState?.actionLabel}
        onAction={handleGuideAction}
        showGreeting={false}
      />

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

