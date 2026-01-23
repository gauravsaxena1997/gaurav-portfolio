'use client';

import { memo } from 'react';
import styles from './DashboardScreen.module.css';

interface StatCardProps {
  title: string;
  value: string;
  icon?: string;
}

function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      {icon && <span className={styles.statIcon}>{icon}</span>}
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statTitle}>{title}</span>
    </div>
  );
}

export const DashboardScreen = memo(function DashboardScreen() {
  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerDot} />
        <span className={styles.headerTitle}>Developer Stats</span>
      </header>

      <div className={styles.statsGrid}>
        <StatCard title="Experience" value="5+ yrs" icon="⏱" />
        <StatCard title="Projects" value="50+" icon="📦" />
        <StatCard title="Users" value="1000+" icon="👥" />
        <StatCard title="Tech Stack" value="15+" icon="🛠" />
      </div>

      <div className={styles.footer}>
        <div className={styles.activityBar}>
          <span className={styles.activityDot} />
          <span className={styles.activityText}>Building something new...</span>
        </div>
      </div>
    </div>
  );
});
