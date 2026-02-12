'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const checkDevice = useCallback(() => {
    // Check if viewport width is mobile (standard breakpoint < 768px)
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
  }, []);

  useEffect(() => {
    // Check on mount (immediate, no debounce)
    checkDevice();

    // Debounced resize handler to prevent layout thrashing
    const handleResize = () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(checkDevice, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [checkDevice]);

  const handleThemeChange = (theme: 'creative' | 'github') => {
    setActiveTheme(theme);
  };

  // Show loading state while detecting device (prevents hydration mismatch flicker)
  if (isMobile === null) {
    return <LoadingScreen />;
  }

  // Render Mobile Layout
  if (isMobile) {
    return (
      <div id="main-content">
        <MobileLayout />
      </div>
    );
  }

  // Render Desktop Layout (Default)
  // Using CreativeTheme wrapper to ensure full desktop functionality is restored
  // NOTE: This currently forces CreativeTheme. If GitHub theme support is needed in the future,
  // the switch logic from the original file should be restored here.
  return (
    <div id="main-content">
      <CreativeTheme
        currentTheme={activeTheme}
        onThemeChange={handleThemeChange}
      />
    </div>
  );
}
