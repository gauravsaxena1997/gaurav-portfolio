'use client';

import { useTheme } from '@/hooks';
import { TESTIMONIALS, BLOG_POSTS } from '@/data';
import { useScrollSpy } from './hooks';
import {
  Navbar,
  ScrollToTop,
  Hero,
  CaseStudies,
  Services,
  Skills,
  Testimonials,
  BlogPreview,
  Contact,
} from './components';
import './styles/theme.css';

export function TechTheme() {
  const { isDarkTheme } = useTheme();
  const activeSection = useScrollSpy();

  return (
    <div className={`tech-theme ${!isDarkTheme ? 'light-theme' : ''}`}>
      <Navbar activeSection={activeSection} />
      <ScrollToTop />
      <main id="main-content">
        <Hero />
        <CaseStudies />
        <Services />
        <Skills />
        {TESTIMONIALS.length > 0 && <Testimonials />}
        {BLOG_POSTS.length > 0 && <BlogPreview />}
        <Contact />
      </main>
    </div>
  );
}
