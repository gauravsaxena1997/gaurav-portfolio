'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks';
import styles from './ThemeToggle.module.css';

export function ThemeToggle() {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <div
      className={`${styles.themeToggleBar} ${
        !isDarkTheme ? styles.lightMode : ''
      }`}
    >
      <div className={styles.toggleText}>
        <span>
          {isDarkTheme ? 'Let there be light!' : 'Embrace the darkness!'}
        </span>
      </div>
      <button className={styles.themeSwitch} onClick={toggleTheme}>
        <div className={styles.switchHandle}>
          {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
        </div>
      </button>
    </div>
  );
}
