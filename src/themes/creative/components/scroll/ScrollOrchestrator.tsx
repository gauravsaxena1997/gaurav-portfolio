'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Briefcase, Cpu, Globe } from 'lucide-react';
import { useScrollContext } from '../../context/ScrollContext';
import { HeroSection } from '../sections/hero';
import { ProjectSection } from '../sections/projects';
import { ContactSection } from '../sections/contact';
import { ServicesSection } from '../sections/services';
import { StatPanel } from '../sections/stats';
import { ErrorBoundary } from '@/components/shared';
import { LoadingSkeleton } from '../ui';
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

      // Stat Panel Wipe Animation (Left-to-Right)
      // Stat Panel Wipe Animation
      const statPanels = document.querySelectorAll('[data-stat-panel]');
      statPanels.forEach((panel) => {
        const litLayer = panel.querySelector('[data-lit-layer]') as HTMLElement;
        // UNIFIED ANIMATION: All panels wipe Left-to-Right
        // Start: inset(0 100% 0 0) -> Hidden (Right edge at left side)
        // End: inset(0 0% 0 0) -> Revealed (Right edge at right side)
        const startClip = 'inset(0 100% 0 0)';
        const endClip = 'inset(0 0% 0 0)';

        // Initial State
        gsap.set(litLayer, {
          clipPath: startClip,
          webkitClipPath: startClip,
          opacity: 1, // Ensure visible internally
        });

        // Animation
        gsap.to(litLayer, {
          clipPath: endClip,
          webkitClipPath: endClip,
          ease: 'none',
          overwrite: 'auto', // Prevent conflict on potential refresh
          scrollTrigger: {
            trigger: panel,
            start: 'top 75%', // REVERTED: Standard scroll trigger for wipe
            end: 'center center',
            scrub: 0.5, // 0.5s lag for smoothness
          }
        });

        // Highlight Entrance Animation (Relocated) - SEQUENCED
        const highlightItems = panel.querySelectorAll('[data-highlight-item]');
        if (highlightItems.length > 0) {
          gsap.fromTo(highlightItems,
            {
              y: 30,
              autoAlpha: 0,
              scale: 0.9
            },
            {
              y: 0,
              autoAlpha: 1,
              scale: 1,
              duration: 0.6,
              stagger: 0.15,
              delay: 0.2, // Short delay after wipe
              ease: 'back.out(1.7)',
              scrollTrigger: {
                trigger: panel,
                start: 'top 25%', // Wait for 75-80% visibility
                toggleActions: 'play reverse play reverse',
              }
            }
          );
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
        {/* Panel 1: Experience (50/50 Split, Bottom Aligned Chips) */}
        <div className={styles.statRow} data-stat-panel>
          <StatPanel
            title="6+ Years Building Digital Products"
            description="I've spent 5+ years at product companies and service agencies, shipping for B2B and B2C audiences. Now I bring that same rigor directly to your project. I bring tested frameworks that actually work."
            illustration={
              <ErrorBoundary fallback={<div className="p-4 text-center">Chip stacking unavailable</div>}>
                <ChipStacking />
              </ErrorBoundary>
            }
            desktopLayout="text-left"
            illustAlign="bottom"
            icon={Briefcase}
          />
        </div>

        {/* Panel 2: AI-Supported Workflow (50/50 Split, Center Aligned Robot) */}
        <div className={styles.statRow} data-stat-panel>
          <StatPanel
            title="AI-Accelerated Development"
            description="Working without AI is like leaving half your toolkit at home. I leverage custom AI pipelines to automate testing and scaffolding. This means I spend my time solving your complex business problems, not writing boilerplate code."
            highlights={[
              'Automated Testing Pipelines',
              'Faster Feature Delivery',
              'Enterprise-Grade Quality',
            ]}
            illustration={
              <ErrorBoundary fallback={<div className="p-4 text-center">3D model unavailable</div>}>
                <AIBrainIllustration />
              </ErrorBoundary>
            }
            desktopLayout="text-right"
            highlightsLocation="illustration"
            illustAlign="center"
            icon={Cpu}
          />
        </div>

        {/* Panel 3: Global Availability (50/50 Split, Center Aligned Globe) */}
        <div className={styles.statRow} data-stat-panel>
          <StatPanel
            title="Global Remote Architecture"
            description="Based in India, architecting for the world. My Async-First workflow eliminates timezone friction. I deliver self-contained updates that let your US/EU team wake up to progress, not blockers."
            highlights={[
              'Global Remote Experience',
              'Async Communication-First',
              'Zero-Blocker Handoffs',
            ]}
            illustration={
              <ErrorBoundary fallback={<div className="p-4 text-center">Globe visualization unavailable</div>}>
                <GlobeVisualization />
              </ErrorBoundary>
            }
            desktopLayout="text-left"
            highlightsLocation="illustration"
            illustAlign="center"
            icon={Globe}
          />
        </div>
      </section>

      {/* ===== PROJECTS SECTION ===== */}
      <section id="projects-section" className={styles.projectsSection}>
        <ProjectSection />
      </section>


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
