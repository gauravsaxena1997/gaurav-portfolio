'use client';

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useScrollContext } from '../../context/ScrollContext';
import { LaboratoryModal } from '../shared/LaboratoryModal';
import styles from './Header.module.css';

interface HeaderProps {
    currentTheme?: 'creative' | 'github';
    onThemeChange?: (theme: 'creative' | 'github') => void;
}

export function Header({}: HeaderProps): React.JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLabsModalOpen, setIsLabsModalOpen] = useState(false);
  const { activeSection } = useScrollContext();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },

    { id: 'testimonials', label: 'Testimonials' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    // Map navigation IDs to actual section IDs
    const sectionIdMap: Record<string, string> = {
      hero: 'hero-section',
      projects: 'projects-section',
      services: 'services-section',
      testimonials: 'testimonials-section',
      contact: 'contact-section',
    };

    const targetId = sectionIdMap[sectionId] || `${sectionId}-section`;
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <>
      {/* Fixed Header Bar */}
      <header className={styles.header}>
        {/* Left: Hamburger Menu */}
        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Labs Toggle - Experimental Hand Gestures - Hiding for production
        {isDesktop && (
          <button
            className={styles.labsButton}
            onClick={() => setIsLabsModalOpen(true)}
            aria-label="Open experimental laboratory"
            title="Experiment: Hand Gestures"
          >
            <FlaskConical size={20} />
          </button>
        )}
        */}

        {/* Right: Toggles (removed dark/light mode toggle - creative theme is dark-only) */}
        <div className={styles.toggles}>
          {/* Theme Switcher (Creative/GitHub) - Commenting out until GitHub theme is ready */}
          {/* 
          <button
            className={styles.iconButton}
            onClick={() => setIsThemeModalOpen(true)}
            aria-label="View theme options"
          >
            <Palette size={20} />
          </button>
          */}
        </div>
      </header>

      {/* Navigation Overlay */}
      {isMenuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            className={styles.nav}
            onClick={(e) => e.stopPropagation()}
          >
            {sections.map((section) => (
              <button
                key={section.id}
                className={`${styles.navItem} ${activeSection === section.id ? styles.active : ''}`}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Theme Info Modal - Commented out until GitHub theme is ready */}
      {/* 
      <ThemeInfoModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={currentTheme}
        onThemeSwitch={onThemeChange}
      />
      */}
      <LaboratoryModal 
        isOpen={isLabsModalOpen}
        onClose={() => setIsLabsModalOpen(false)}
      />
    </>
  );
}
