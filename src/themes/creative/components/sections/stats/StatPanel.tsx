'use client';

import { ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';
import styles from './StatPanel.module.css';
import { StatPanelDesktop } from './StatPanelDesktop';
import { StatPanelMobile } from './StatPanelMobile';

interface StatPanelProps {
  /** Panel title */
  title: string;
  /** Personal description paragraph (first person, 2 sentences) */
  description: string;
  /** Highlight/result items with checkmarks */
  highlights?: string[];
  illustration?: ReactNode;
  icon?: LucideIcon;

  // Layout Config
  desktopLayout?: 'text-left' | 'text-right';
  illustAlign?: 'center' | 'bottom';
  highlightsLocation?: 'text' | 'illustration';
}

/**
 * Main StatPanel component serving as a wrapper.
 * Switches between Desktop and Mobile implementations via CSS.
 */
export function StatPanel(props: StatPanelProps) {
  return (
    <>
      <div className={styles.desktopWrapper}>
        <StatPanelDesktop {...props} />
      </div>
      <div className={styles.mobileWrapper}>
        <StatPanelMobile />
      </div>
    </>
  );
}
