'use client';

import { useState, useEffect } from 'react';
import { GitHubTheme } from '@/themes/github';
import { CreativeTheme } from '@/themes/creative';
import { ThemeSelector } from '@/themes/ThemeSelector';

export default function Home() {
  const [activeTheme, setActiveTheme] = useState('creative');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme preference from localStorage
    const saved = localStorage.getItem('portfolio-theme');
    if (saved && (saved === 'github' || saved === 'creative')) {
      setActiveTheme(saved);
    }
  }, []);

  const handleThemeChange = (theme: string) => {
    setActiveTheme(theme);
    localStorage.setItem('portfolio-theme', theme);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  const renderTheme = () => {
    switch (activeTheme) {
      case 'github':
        return <GitHubTheme />;
      case 'creative':
      default:
        return <CreativeTheme />;
    }
  };

  return (
    <>
      {renderTheme()}
      <ThemeSelector
        active={activeTheme}
        onChange={handleThemeChange}
        themes={['creative', 'github']}
      />
    </>
  );
}
