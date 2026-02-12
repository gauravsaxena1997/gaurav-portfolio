'use client';

import { useTheme } from '@/hooks';
import { BLOG_POSTS } from '@/data';
import { useActiveSection } from './hooks';
import {
  AnnouncementBar,
  GitHubHeader,
  Hero,
  CaseStudies,
  Services,
  Skills,
  BlogPreview,
  Contact,
} from './components';
import './styles/theme.css';
import styles from './GitHubTheme.module.css';

interface GitHubThemeProps {
  currentTheme?: 'creative' | 'github';
  onThemeChange?: (theme: 'creative' | 'github') => void;
}

export function GitHubTheme({ currentTheme = 'github', onThemeChange }: GitHubThemeProps = {}) {
  const { isDarkTheme } = useTheme();
  const { activeSection, navigateToSection } = useActiveSection();

  return (
    <div className={`tech-theme ${!isDarkTheme ? 'light-theme' : ''}`}>
      <AnnouncementBar />
      <GitHubHeader
        activeSection={activeSection}
        onNavigate={navigateToSection}
        currentTheme={currentTheme}
        onThemeChange={onThemeChange}
      />
      <main id="main-content" className={styles.mainContent}>
        {activeSection === 'home' && <Hero onNavigate={navigateToSection} />}
        {activeSection === 'projects' && <CaseStudies />}
        {activeSection === 'services' && <Services />}
        {activeSection === 'skills' && <Skills />}
        {activeSection === 'blog' && BLOG_POSTS.length > 0 && <BlogPreview />}
        {activeSection === 'contact' && <Contact />}
      </main>
    </div>
  );
}
