'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useScrollContext } from '../../context/ScrollContext';
import { PlaceholderSection } from './PlaceholderSection';
import { HeroSection } from '../sections/hero';
import { ProjectPlaceholder } from './ProjectPlaceholder';
import {
  StatPanel,
  AIBrainIllustration,
  LaptopCard,
  GlobeVisualization,
} from '../sections/stats';
import styles from './ScrollOrchestrator.module.css';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Sample projects
const SAMPLE_PROJECTS = [
  { name: 'Project Alpha', index: 0 },
  { name: 'Project Beta', index: 1 },
  { name: 'Project Gamma', index: 2 },
];

// Services list for vertical scroll section
const SERVICES = [
  { title: 'MVP Generation', desc: 'From ideation to demo' },
  { title: 'UI/UX Design', desc: 'User-centered design' },
  { title: 'Development', desc: 'Frontend + Backend' },
  { title: 'Integrations', desc: 'APIs, payments, auth' },
  { title: 'SEO & Performance', desc: 'Optimization' },
];

export function ScrollOrchestrator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroStatsRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectsServicesRef = useRef<HTMLDivElement>(null);
  const servicesContactRef = useRef<HTMLDivElement>(null);
  const contactCreditsRef = useRef<HTMLDivElement>(null);

  const {
    setActiveSection,
    setTotalProgress,
  } = useScrollContext();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Hero → Stats horizontal scroll
      if (heroStatsRef.current) {
        const heroStatsContainer = heroStatsRef.current;
        const heroStatsWidth = heroStatsContainer.scrollWidth - window.innerWidth;

        // Add extra scroll buffer on mobile to ensure last panel is fully visible
        const isMobile = window.innerWidth <= 900;
        const scrollBuffer = isMobile ? window.innerWidth * 0.3 : 0;

        gsap.to(heroStatsContainer, {
          x: -heroStatsWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#hero-stats-section',
            start: 'top top',
            end: () => `+=${heroStatsWidth + scrollBuffer}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress < 0.25) {
                setActiveSection('hero');
              } else {
                setActiveSection('stats');
              }
            },
          },
        });
      }

      // Stats → Projects: Diagonal scroll effect
      if (projectsRef.current) {
        // On mobile, start diagonal animation later to avoid overlap with last stat panel
        const isMobile = window.innerWidth <= 900;
        const startPosition = isMobile ? 'top 80%' : 'top bottom';

        gsap.fromTo(
          projectsRef.current,
          {
            x: '30vw',
            y: '30vh',
            opacity: 0.5,
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#projects-section',
              start: startPosition,
              end: 'top top',
              scrub: 1,
              onLeave: () => {
                if (projectsRef.current) {
                  gsap.set(projectsRef.current, { clearProps: 'transform' });
                }
              },
              onEnterBack: () => {
                if (projectsRef.current) {
                  gsap.set(projectsRef.current, { x: 0, y: 0 });
                }
              },
            },
          }
        );
      }

      // Projects section
      ScrollTrigger.create({
        trigger: '#projects-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection('projects'),
        onEnterBack: () => setActiveSection('projects'),
      });

      // Services section
      ScrollTrigger.create({
        trigger: '#services-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection('services'),
        onEnterBack: () => setActiveSection('services'),
      });

      // Contact section
      ScrollTrigger.create({
        trigger: '#contact-section',
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection('contact'),
        onEnterBack: () => setActiveSection('contact'),
      });

      // Credits section
      ScrollTrigger.create({
        trigger: '#credits-section',
        start: 'top center',
        end: 'bottom bottom',
        onEnter: () => setActiveSection('credits'),
        onEnterBack: () => setActiveSection('credits'),
      });

      // Projects → Services horizontal transition
      if (projectsServicesRef.current) {
        const container = projectsServicesRef.current;
        const scrollWidth = container.scrollWidth - window.innerWidth;

        gsap.to(container, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#projects-services-transition',
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress < 0.5) {
                setActiveSection('projects');
              } else {
                setActiveSection('services');
              }
            },
          },
        });
      }

      // Services → Contact horizontal transition
      if (servicesContactRef.current) {
        const container = servicesContactRef.current;
        const scrollWidth = container.scrollWidth - window.innerWidth;

        gsap.to(container, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#services-contact-transition',
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress < 0.5) {
                setActiveSection('services');
              } else {
                setActiveSection('contact');
              }
            },
          },
        });
      }

      // Contact → Credits horizontal transition
      if (contactCreditsRef.current) {
        const container = contactCreditsRef.current;
        const scrollWidth = container.scrollWidth - window.innerWidth;

        gsap.to(container, {
          x: -scrollWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: '#contact-credits-transition',
            start: 'top top',
            end: () => `+=${scrollWidth}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            onUpdate: (self) => {
              if (self.progress < 0.5) {
                setActiveSection('contact');
              } else {
                setActiveSection('credits');
              }
            },
          },
        });
      }

      // Global progress calculation
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          setTotalProgress(self.progress);
        },
      });

      // Refresh on resize
      const handleResize = () => ScrollTrigger.refresh();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    },
    { scope: containerRef, dependencies: [] }
  );

  return (
    <div ref={containerRef} className={styles.orchestrator}>
      {/* ===== HERO + STATS (Horizontal Scroll) ===== */}
      <section id="hero-stats-section" className={styles.horizontalSection}>
        <div ref={heroStatsRef} className={styles.horizontalContainer}>
          {/* Hero Panel */}
          <div className={`${styles.panel} ${styles.fullPanel}`}>
            <HeroSection />
          </div>

          {/* Stats Panels - compact, full height utilization */}

          {/* Panel 1: AI-Assisted Development */}
          <div className={`${styles.panel} ${styles.statPanel}`}>
            <StatPanel
              title="AI-Assisted Development"
              description="I use Claude, Cursor, and Copilot daily. AI handles the repetitive work so I focus on what matters."
              highlights={[
                '50% faster delivery',
                'AI catches edge cases',
                'Consistent code quality',
              ]}
              illustration={<AIBrainIllustration />}
              illustrationPosition="bottom"
            />
          </div>

          {/* Panel 2: Proven Track Record */}
          <div className={`${styles.panel} ${styles.statPanel}`}>
            <StatPanel
              title="Proven Track Record"
              description="5+ years building products at startups and enterprises. Now I bring that experience to your project."
              highlights={[
                '5+ years experience',
                '1000+ users served',
                'Startup to enterprise',
              ]}
              illustration={<LaptopCard />}
              illustrationPosition="top"
            />
          </div>

          {/* Panel 3: Global Availability */}
          <div className={`${styles.panel} ${styles.statPanel}`}>
            <StatPanel
              title="Global Availability"
              description="I work across time zones with clients in US, EU, and APAC. Async-first, but always available when it matters."
              highlights={[
                '24/7 for critical issues',
                'Overlap with any timezone',
                'Async communication pro',
              ]}
              illustration={<GlobeVisualization />}
              illustrationPosition="bottom"
            />
          </div>
        </div>
      </section>

      {/* ===== PROJECTS (Vertical Scroll, comes in diagonally) ===== */}
      <section id="projects-section" ref={projectsRef} className={styles.projectsSection}>
        <ProjectPlaceholder projects={SAMPLE_PROJECTS} />
      </section>

      {/* ===== PROJECTS → SERVICES TRANSITION (Horizontal) ===== */}
      <section id="projects-services-transition" className={styles.horizontalTransition}>
        <div ref={projectsServicesRef} className={styles.transitionContainer}>
          {/* End of Projects panel - Other Projects */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>Other Projects</span>
              <p className={styles.transitionSubtext}>More work to explore</p>
            </div>
          </div>
          {/* Start of Services panel */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>Services</span>
              <p className={styles.transitionSubtext}>What I offer</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES ===== */}
      <section id="services-section" className={styles.servicesSection}>
        <div className={styles.servicesHeader}>
          <h2 className={styles.sectionTitle}>SERVICES</h2>
          <p className={styles.sectionSubtitle}>What I offer</p>
        </div>
        <div className={styles.servicesContent}>
          {SERVICES.map((service, i) => (
            <div key={service.title} className={styles.serviceItem}>
              <span className={styles.serviceNumber}>{String(i + 1).padStart(2, '0')}</span>
              <div className={styles.serviceInfo}>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDesc}>{service.desc}</p>
              </div>
              <div className={styles.serviceIllustration}>
                <span>Illustration placeholder</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SERVICES → CONTACT TRANSITION (Horizontal) ===== */}
      <section id="services-contact-transition" className={styles.horizontalTransition}>
        <div ref={servicesContactRef} className={styles.transitionContainer}>
          {/* End of Services panel */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>SEO & Performance</span>
              <p className={styles.transitionSubtext}>Last service item</p>
            </div>
          </div>
          {/* Start of Contact panel */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>Contact</span>
              <p className={styles.transitionSubtext}>Get in touch</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact-section" className={styles.contactSection}>
        <div className={styles.contactContent}>
          <div className={styles.contactIllustration}>
            <div className={styles.characterPlaceholder}>
              <span>Animated Character</span>
              <span className={styles.characterSubtext}>Eye tracking + expressions</span>
            </div>
          </div>
          <div className={styles.contactForm}>
            <h2 className={styles.contactTitle}>Get in Touch</h2>
            <div className={styles.formPlaceholder}>
              <div className={styles.formField}>Name</div>
              <div className={styles.formField}>Email</div>
              <div className={styles.formField}>Message</div>
              <div className={styles.formButton}>Send Message</div>
            </div>
            <div className={styles.scheduleButton}>Schedule a Call</div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT → CREDITS TRANSITION (Horizontal) ===== */}
      <section id="contact-credits-transition" className={styles.horizontalTransition}>
        <div ref={contactCreditsRef} className={styles.transitionContainer}>
          {/* End of Contact panel */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>Send Message</span>
              <p className={styles.transitionSubtext}>Or schedule a call</p>
            </div>
          </div>
          {/* Start of Credits panel */}
          <div className={styles.transitionPanel}>
            <div className={styles.transitionContent}>
              <span className={styles.transitionLabel}>Credits</span>
              <p className={styles.transitionSubtext}>Inspirations & thanks</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CREDITS ===== */}
      <section id="credits-section" className={styles.creditsSection}>
        <div className={styles.creditsContent}>
          <h2 className={styles.creditsTitle}>Credits & Inspirations</h2>
          <p className={styles.creditsSubtitle}>Thank you to these amazing portfolios for inspiration</p>
          <div className={styles.creditsList}>
            {[
              'michalgrzebisz.com',
              'robinmastromarino.com',
              'masontywong.com',
              'parthsharma.me',
              'remyjouni.dev',
              'robbowen.digital',
            ].map((site) => (
              <div key={site} className={styles.creditItem}>
                <div className={styles.creditThumb}>Thumbnail</div>
                <span className={styles.creditLink}>{site}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
