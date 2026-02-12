'use client';

import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Palette } from 'lucide-react';
import { useScrollContext } from '../../context/ScrollContext';
import { ThemeInfoModal } from '@/components/shared/ThemeInfoModal';
import styles from './Header.module.css';

interface HeaderProps {
  currentTheme: 'creative' | 'github';
  onThemeChange: (theme: 'creative' | 'github') => void;
  themeMode: 'dark' | 'light';
  onModeToggle: () => void;
}

export function Header({ currentTheme, onThemeChange, themeMode, onModeToggle }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { activeSection } = useScrollContext();

  // Only render theme-dependent icon after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const sections = [
    { id: 'hero', label: 'Home' },
    { id: 'projects', label: 'Projects' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  const scrollToSection = (sectionId: string) => {
    // Map navigation IDs to actual section IDs
    const sectionIdMap: Record<string, string> = {
      hero: 'hero-section',
      projects: 'projects-section',
      services: 'services-section',
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

        {/* Right: Toggles */}
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

          {/* Mode Toggle (Dark/Light) - RIGHT */}
          <button
            className={styles.iconButton}
            onClick={onModeToggle}
            aria-label={mounted ? `Switch to ${themeMode === 'dark' ? 'light' : 'dark'} mode` : 'Toggle theme mode'}
            suppressHydrationWarning
          >
            {mounted ? (
              themeMode === 'dark' ? <Sun size={20} /> : <Moon size={20} />
            ) : (
              // Placeholder during SSR - use a neutral icon or the Sun icon
              <Sun size={20} />
            )}
          </button>
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
    </>
  );
}
