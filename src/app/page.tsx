'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CreativeTheme } from '@/themes/creative/CreativeTheme';
import { LoadingScreen } from '@/themes/creative/components/shared/LoadingScreen';

// Dynamically import MobileLayout to reduce initial bundle size for desktop users
const MobileLayout = dynamic(() => import('@/themes/creative/components/layout/MobileLayout'), {
  loading: () => <LoadingScreen />,
});

export default function Home() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  // This state is needed for CreativeTheme props, preserving existing functionality
  // Default to 'creative' as that's the main theme
  const [activeTheme, setActiveTheme] = useState<'creative' | 'github'>('creative');

  useEffect(() => {
    const checkDevice = () => {
      // Check if viewport width is mobile (standard breakpoint < 768px)
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    // Check on mount
    checkDevice();

    // Listen for resize
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const handleThemeChange = (theme: 'creative' | 'github') => {
    setActiveTheme(theme);
  };

  // Show loading state while detecting device (prevents hydration mismatch flicker)
  if (isMobile === null) {
    return <LoadingScreen />;
  }

  // Render Mobile Layout
  if (isMobile) {
    return <MobileLayout />;
  }

  // Render Desktop Layout (Default)
  // Using CreativeTheme wrapper to ensure full desktop functionality is restored
  // NOTE: This currently forces CreativeTheme. If GitHub theme support is needed in the future,
  // the switch logic from the original file should be restored here.
  return (
    <CreativeTheme
      currentTheme={activeTheme}
      onThemeChange={handleThemeChange}
    />
  );
}
