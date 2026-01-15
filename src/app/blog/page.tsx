'use client';

import { useState, useMemo } from 'react';
import { BLOG_POSTS } from '@/data';
import { BlogCard, BlogSearch } from '@/components/blog';
import styles from './page.module.css';

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return BLOG_POSTS;

    const query = searchQuery.toLowerCase();
    return BLOG_POSTS.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.title} code-font`}>&lt;blog/&gt;</h1>
        <p className={styles.subtitle}>
          Thoughts on web development, productivity, and building digital products.
        </p>
      </div>

      <BlogSearch value={searchQuery} onChange={setSearchQuery} />

      {featuredPosts.length > 0 && (
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} code-font`}>// featured</h2>
          <div className={styles.featuredGrid}>
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {regularPosts.length > 0 && (
        <section className={styles.section}>
          <h2 className={`${styles.sectionTitle} code-font`}>// all posts</h2>
          <div className={styles.grid}>
            {regularPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {filteredPosts.length === 0 && (
        <div className={styles.empty}>
          <p>No posts found matching &quot;{searchQuery}&quot;</p>
        </div>
      )}
    </div>
  );
}
