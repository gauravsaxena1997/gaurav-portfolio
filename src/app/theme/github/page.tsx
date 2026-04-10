'use client';

import { GitHubTheme } from '@/themes/github/GitHubTheme';
import { ThemeProvider } from '@/components/shared';
import { AnalyticsService } from '@/services/AnalyticsService';
import { useEffect } from 'react';

export default function GitHubThemePage() {
  useEffect(() => {
    AnalyticsService.trackPageView('/theme/github');
  }, []);

  return (
    <ThemeProvider>
      <div className="github-theme-preview">
        <GitHubTheme currentTheme="github" />
      </div>
    </ThemeProvider>
  );
}
