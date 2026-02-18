'use client';

import { useMediaQuery } from '@/hooks/use-media-query';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useScrollContext } from '../../context/ScrollContext';
import { HeroSection } from '../sections/hero';
import { AIBrainIllustration } from '../sections/stats';
// Dynamic imports for heavy below-fold sections
const ProjectSection = dynamic(
  () => import('../sections/projects').then((mod) => mod.ProjectSection),
  { ssr: false }
);
const ContactSection = dynamic(
  () => import('../sections/contact').then((mod) => mod.ContactSection),
  { ssr: false }
);
const ServicesSection = dynamic(
  () => import('../sections/services').then((mod) => mod.ServicesSection),
  { ssr: false }
);
const StatPanel = dynamic(
  () => import('../sections/stats').then((mod) => mod.StatPanel),
  { ssr: false }
);
const TestimonialsSection = dynamic(
  () => import('../sections/testimonials/TestimonialsSection').then((mod) => mod.TestimonialsSection),
  { ssr: false }
);
import { ErrorBoundary } from '@/components/shared';
import { LoadingSkeleton, SectionDivider } from '../ui';
import { STATS_DATA } from '@/config/stats';
import styles from './ScrollOrchestrator.module.css';

// Lazy load remaining heavy 3D/physics components
const ChipStacking = dynamic(
  () => import('../sections/stats').then((mod) => ({ default: mod.ChipStacking })),
  {
    loading: () => <LoadingSkeleton type="chips" />,
    ssr: false,
  }
);

const GlobeVisualization = dynamic(
  () => import('../sections/stats').then((mod) => ({ default: mod.GlobeVisualization })),
  {
    loading: () => <LoadingSkeleton type="globe" />,
    ssr: false,
  }
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Services section now uses dedicated component

export function ScrollOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setActiveSection, setTotalProgress } = useScrollContext();
  const isDesktopStats = useMediaQuery('(min-width: 900px)');

  // Preserve scroll position across refreshes (reload only, not fresh address-bar navigations).
  // Root cause: GSAP ScrollTrigger.refresh() fires after React hydration and resets
  // scroll to 0. We restore AFTER that first refresh, and only when nav type is reload.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const KEY = 'scroll-restore';

    // Save position before page unloads
    const save = () => {
      try { sessionStorage.setItem(KEY, String(window.scrollY)); } catch {}
    };
    window.addEventListener('beforeunload', save);

    // Detect navigation type (reload vs navigate)
    const navEntry = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined);
    const navType = navEntry?.type || (performance as any).navigation?.type;
    const isReload = navType === 'reload' || navType === (performance as any).navigation?.TYPE_RELOAD;

    // Read saved target
    let target: number | null = null;
    try {
      const stored = sessionStorage.getItem(KEY);
      if (stored) {
        const parsed = parseInt(stored, 10);
        if (!Number.isNaN(parsed) && parsed > 0) target = parsed;
      }
    } catch {}

    // Only restore on reload, and only if we have a target
    if (!isReload || target === null) {
      return () => window.removeEventListener('beforeunload', save);
    }

    // Prevent browser's own scroll restoration from interfering
    try { history.scrollRestoration = 'manual'; } catch {}

    // Jump to top immediately so there's no flash of wrong position
    window.scrollTo(0, 0);

    const savedTarget = target;

    // GSAP ScrollTrigger fires a 'refresh' event after it initializes and
    // recalculates all trigger positions — this is what was resetting our scroll.
    // We listen for that first refresh, then restore position after it completes.
    let restored = false;
    const onFirstRefresh = () => {
      if (restored) return;
      restored = true;
      ScrollTrigger.removeEventListener('refresh', onFirstRefresh);

      // Small extra delay to let any post-refresh layout settle
      setTimeout(() => {
        window.scrollTo({ top: savedTarget, behavior: 'smooth' });
      }, 50);
    };

    ScrollTrigger.addEventListener('refresh', onFirstRefresh);

    // Fallback: if ScrollTrigger never fires refresh (e.g., no triggers registered yet),
    // restore after 800ms anyway
    const fallback = setTimeout(() => {
      if (!restored) {
        restored = true;
        ScrollTrigger.removeEventListener('refresh', onFirstRefresh);
        window.scrollTo({ top: savedTarget, behavior: 'smooth' });
      }
    }, 800);

    return () => {
      window.removeEventListener('beforeunload', save);
      ScrollTrigger.removeEventListener('refresh', onFirstRefresh);
      clearTimeout(fallback);
    };
  }, []);


  useGSAP(
    () => {
      // Global progress tracker
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => setTotalProgress(self.progress),
      });

      // Section Activators
      const sections = [
        { id: '#hero-section', name: 'hero' },
        { id: '#stats-section', name: 'stats' },
        { id: '#projects-section', name: 'projects' },
        { id: '#services-section', name: 'services' },
        { id: '#testimonials-section', name: 'testimonials' },
        { id: '#contact-section', name: 'contact' },
      ];

      sections.forEach(({ id, name }) => {
        // Special case for Contact: Only trigger when it's well into view
        // to avoid stealing focus from Testimonials
        if (name === 'contact') {
          ScrollTrigger.create({
            trigger: id,
            start: 'top 80%', // Trigger only when top is near bottom of viewport
            end: 'bottom bottom',
            onEnter: () => setActiveSection(name as any),
            onEnterBack: () => setActiveSection(name as any),
          });
        } else {
          ScrollTrigger.create({
            trigger: id,
            start: 'top 60%', // Slightly relaxed from 50%
            end: 'bottom 40%',
            onEnter: () => setActiveSection(name as any),
            onEnterBack: () => setActiveSection(name as any),
          });
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={styles.orchestrator}>
      {/* ===== HERO SECTION ===== */}
      <section id="hero-section" className={styles.verticalSection}>
        <HeroSection />
      </section>

      {/* ===== STATS SECTION (Alternating Layout) ===== */}
      <section id="stats-section" className={styles.statsContainer}>

        {/* DESKTOP LAYOUT (Only render if wide enough to prevent physics issues) */}
        {isDesktopStats && (
          <div className={styles.desktopStats}>
            {STATS_DATA.map((stat, index) => {
              const isLast = index === STATS_DATA.length - 1;

              // Determine illustration based on index/ID
              // Note: In a larger app, illustrations could be in the config mapping or a lookup object
              let illustration = null;
              if (index === 0) {
                illustration = (
                  <ErrorBoundary fallback={<div className="p-4 text-center">Chip stacking unavailable</div>}>
                    <ChipStacking />
                  </ErrorBoundary>
                );
              } else if (index === 1) {
                illustration = (
                  <ErrorBoundary fallback={<div className="p-4 text-center">3D model unavailable</div>}>
                    <AIBrainIllustration />
                  </ErrorBoundary>
                );
              } else {
                illustration = (
                  <ErrorBoundary fallback={<div className="p-4 text-center">Globe visualization unavailable</div>}>
                    <GlobeVisualization />
                  </ErrorBoundary>
                );
              }

              return (
                <div key={stat.id} className={styles.statRow}>
                  <StatPanel
                    title={stat.title}
                    description={stat.description}
                    highlights={stat.highlights}
                    illustration={illustration}
                    desktopLayout={stat.desktopLayout}
                    highlightsLocation={index === 0 ? undefined : "text"} // Keep existing logic: ChipStack has bullets in illust, others in text
                    illustAlign={stat.illustAlign}
                    icon={stat.icon}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ===== SECTION DIVIDER: Stats → Projects ===== */}
      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects-section" className={styles.projectsSection}>
        <SectionDivider title="SELECTED PROJECTS" />
        <ProjectSection />
      </section>

      {/* ===== SECTION DIVIDER: Projects → Services ===== */}
      {/* ===== SERVICES SECTION ===== */}
      <section id="services-section" className={styles.scrollSection}>
        <SectionDivider title="WHAT I OFFER" />
        <ServicesSection />
      </section>

      {/* ===== TESTIMONIALS SECTION ===== */}
      <section id="testimonials-section" className={styles.scrollSection}>
        <TestimonialsSection />
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact-section" className={styles.contactSection}>
        <ContactSection />
      </section>
    </div>
  );
}
