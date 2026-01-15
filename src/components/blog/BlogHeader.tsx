'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import styles from './BlogHeader.module.css';

export function BlogHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Gaurav Saxena</span>
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            <Home size={18} />
            Home
          </Link>
          <Link href="/blog" className={`${styles.navLink} ${styles.active}`}>
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
