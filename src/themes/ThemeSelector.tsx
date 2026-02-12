'use client';

import { useState, useEffect } from 'react';
import { Code as CodeIcon, Check, Sparkles } from 'lucide-react';
import styles from './ThemeSelector.module.css';

interface ThemeSelectorProps {
  active: string;
  onChange: (theme: string) => void;
  themes: string[];
}

const THEME_LABELS: Record<string, string> = {
  creative: 'Creative',
  github: 'Developer Mode',
};

const THEME_DESCRIPTIONS: Record<string, string> = {
  creative: 'Immersive scroll experience',
  github: 'GitHub-style technical portfolio',
};

const getThemeIcon = (theme: string, size: number = 20) => {
  switch (theme) {
    case 'github':
      return <CodeIcon size={size} />;
    case 'creative':
    default:
      return <Sparkles size={size} />;
  }
};

export function ThemeSelector({ active, onChange, themes }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Avoid hydration mismatch
  }

  const handleThemeChange = (theme: string) => {
    onChange(theme);
    setIsOpen(false);
  };

  const currentTheme = themes.find((t) => t === active) || themes[0];
  const currentIndex = themes.indexOf(currentTheme);
  const nextIndex = (currentIndex + 1) % themes.length;
  const nextTheme = themes[nextIndex];

  return (
    <div className={styles.themeSelector}>
      {/* Quick Toggle Button (always visible) */}
      <button
        className={styles.quickToggle}
        onClick={() => handleThemeChange(nextTheme)}
        aria-label={`Switch to ${THEME_LABELS[nextTheme]}`}
        title={`Switch to ${THEME_LABELS[nextTheme]}`}
      >
        <span className={styles.toggleIcon}>
          {getThemeIcon(currentTheme, 20)}
        </span>
        <span className={styles.toggleText}>
          Try {THEME_LABELS[nextTheme]}
        </span>
      </button>

      {/* Dropdown Menu (optional detailed selector) */}
      {isOpen && (
        <div className={styles.dropdown}>
          {themes.map((theme) => (
            <button
              key={theme}
              className={`${styles.dropdownItem} ${
                theme === active ? styles.dropdownItemActive : ''
              }`}
              onClick={() => handleThemeChange(theme)}
            >
              <div className={styles.dropdownItemContent}>
                <span className={styles.dropdownIcon}>
                  {getThemeIcon(theme, 20)}
                </span>
                <div className={styles.dropdownText}>
                  <span className={styles.dropdownLabel}>
                    {THEME_LABELS[theme]}
                  </span>
                  <span className={styles.dropdownDescription}>
                    {THEME_DESCRIPTIONS[theme]}
                  </span>
                </div>
                {theme === active && (
                  <Check size={16} className={styles.checkmark} />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
