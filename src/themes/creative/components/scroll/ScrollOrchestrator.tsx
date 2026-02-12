'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Briefcase, Cpu, Globe } from 'lucide-react';
import { useScrollContext } from '../../context/ScrollContext';
import { HeroSection } from '../sections/hero';
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
import { ErrorBoundary } from '@/components/shared';
import { LoadingSkeleton, SectionDivider } from '../ui';
import styles from './ScrollOrchestrator.module.css';

// Lazy load heavy 3D/physics components
const AIBrainIllustration = dynamic(
  () => import('../sections/stats').then((mod) => ({ default: mod.AIBrainIllustration })),
  {
    loading: () => <LoadingSkeleton type="laptop" />,
    ssr: false,
  }
);

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
        { id: '#contact-section', name: 'contact' },
      ];

      sections.forEach(({ id, name }) => {
        ScrollTrigger.create({
          trigger: id,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => setActiveSection(name as any),
          onEnterBack: () => setActiveSection(name as any),
        });
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



        {/* DESKTOP LAYOUT (CSS Toggle) */}
        <div className={styles.desktopStats}>
          {/* Panel 1: Experience (50/50 Split, Bottom Aligned Chips) */}
          <div className={styles.statRow}>
            <StatPanel
              title="6+ Years Corporate Experience"
              description="I bring professional-grade development standards to your project. I build systems that are secure, reliable, and designed to scale from day one."
              highlights={[
                'Enterprise-Grade Code',
                'Scalable Systems',
                'Reliable Delivery',
              ]}
              illustration={
                <ErrorBoundary fallback={<div className="p-4 text-center">Chip stacking unavailable</div>}>
                  <ChipStacking />
                </ErrorBoundary>
              }
              // Mobile props ignored by desktop wrapper
              desktopLayout="text-left"
              illustAlign="bottom"
              icon={Briefcase}
            />
          </div>

          {/* Panel 2: AI-Supported Workflow (50/50 Split, Center Aligned Robot) */}
          <div className={styles.statRow}>
            <StatPanel
              title="AI-Driven Velocity"
              description="I use custom AI pipelines to automate the boring stuff—ideation, testing, and boilerplate. You get your product to market 2x faster without sacrificing quality."
              highlights={[
                '50% Faster Delivery',
                'Automated QA Testing',
                'Rapid Prototyping',
              ]}
              illustration={
                <ErrorBoundary fallback={<div className="p-4 text-center">3D model unavailable</div>}>
                  <AIBrainIllustration />
                </ErrorBoundary>
              }
              desktopLayout="text-right"
              highlightsLocation="text"
              illustAlign="center"
              icon={Cpu}
            />
          </div>

          {/* Panel 3: Global Availability (50/50 Split, Center Aligned Globe) */}
          <div className={styles.statRow}>
            <StatPanel
              title="High-Conversion Experiences"
              description="Visitors ignore boring sites. I build immersive, high-performance interfaces that capture attention instantly and convert casual visitors into loyal customers."
              highlights={[
                '3D Interactive Webs',
                'Global Performance',
                'Maximized Retention',
              ]}
              illustration={
                <ErrorBoundary fallback={<div className="p-4 text-center">Globe visualization unavailable</div>}>
                  <GlobeVisualization />
                </ErrorBoundary>
              }
              desktopLayout="text-left"
              highlightsLocation="text"
              illustAlign="center"
              icon={Globe}
            />
          </div>
        </div>
      </section>

      {/* ===== SECTION DIVIDER: Stats → Projects ===== */}
      <SectionDivider title="SELECTED PROJECTS" />

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects-section" className={styles.projectsSection}>
        <ProjectSection />
      </section>

      {/* ===== SECTION DIVIDER: Projects → Services ===== */}
      <SectionDivider title="WHAT I OFFER" />

      {/* ===== SERVICES SECTION ===== */}
      <section id="services-section">
        <ServicesSection />
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact-section" className={styles.contactSection}>
        <ContactSection />
      </section>
    </div>
  );
}
