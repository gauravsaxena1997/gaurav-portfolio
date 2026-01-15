'use client';

import { Search } from 'lucide-react';
import styles from './BlogSearch.module.css';

interface BlogSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function BlogSearch({ value, onChange }: BlogSearchProps) {
  return (
    <div className={styles.searchContainer}>
      <Search size={20} className={styles.searchIcon} />
      <input
        type="text"
        placeholder="Search blogs..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}
