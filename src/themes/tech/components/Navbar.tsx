'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { NAV_ITEMS } from '@/data';
import { useTheme } from '@/hooks';
import type { SectionId } from '@/data';
import styles from './Navbar.module.css';

interface NavbarProps {
  activeSection: SectionId;
}

export function Navbar({ activeSection }: NavbarProps) {
  const { isDarkTheme, toggleTheme } = useTheme();
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  const toggleNavbar = (close?: boolean) => {
    setNavbarCollapsed(close ?? !navbarCollapsed);
  };

  return (
    <nav
      className={`${styles.navbar} ${
        isDarkTheme ? styles.navbarDark : styles.navbarLight
      }`}
    >
      <div className={styles.container}>
        <a href="#home" className={`${styles.navbarBrand} code-font`}>
          &lt;GS/&gt;
        </a>
        <button
          className={styles.navbarToggler}
          type="button"
          onClick={() => toggleNavbar()}
          aria-expanded={!navbarCollapsed}
          aria-label="Toggle navigation"
        >
          <span className={styles.navbarTogglerIcon}></span>
        </button>
        <div
          className={`${styles.navbarCollapse} ${
            !navbarCollapsed ? styles.show : ''
          }`}
        >
          <ul className={styles.navbarNav}>
            {NAV_ITEMS.map((item) => (
              <li key={item.id} className={styles.navItem}>
                {item.href ? (
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${styles.slideLine}`}
                    onClick={() => toggleNavbar(true)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={`#${item.id}`}
                    className={`${styles.navLink} ${styles.slideLine} ${
                      activeSection === item.id ? styles.active : ''
                    }`}
                    onClick={() => toggleNavbar(true)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
