'use client';

import { useState, useEffect } from 'react';
import { GitHubTheme } from '@/themes/github';
import { CreativeTheme } from '@/themes/creative';

export default function Home() {
  // Initialize activeTheme with lazy initialization (prevents hydration mismatch)
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window === 'undefined') return 'creative';
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'github' || saved === 'creative') return saved;
    return 'creative';
  });

  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme);
    localStorage.setItem('portfolio-theme', theme);
  };

  const renderTheme = () => {
    switch (activeTheme) {
      case 'github':
        return (
          <GitHubTheme
            currentTheme={activeTheme as 'creative' | 'github'}
            onThemeChange={handleThemeChange}
          />
        );
      case 'creative':
      default:
        return (
          <CreativeTheme
            currentTheme={activeTheme as 'creative' | 'github'}
            onThemeChange={handleThemeChange}
          />
        );
    }
  };

  return <>{renderTheme()}</>;
}
