'use client';

import Link from 'next/link';
import { ExternalLink, Calendar, Clock } from 'lucide-react';
import type { IBlogPost } from '@/data';
import styles from './BlogCard.module.css';

interface BlogCardProps {
  post: IBlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const isExternal = post.type === 'external' && post.externalUrl;
  const CardWrapper = isExternal ? 'a' : Link;
  const cardProps = isExternal
    ? {
        href: post.externalUrl!,
        target: '_blank',
        rel: 'noopener noreferrer',
      }
    : { href: `/blog/${post.slug}` };

  return (
    <CardWrapper
      {...cardProps}
      className={`${styles.card} ${featured ? styles.featured : ''}`}
    >
      <div className={styles.gradientLine}></div>

      {/* Thumbnail */}
      <div className={styles.thumbnail}>
        <div className={styles.thumbnailPlaceholder}>
          <span>{post.title.charAt(0)}</span>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={`${styles.title} code-font`}>{post.title}</h3>

        <p className={styles.excerpt}>{post.excerpt}</p>

        {/* Meta info */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <Calendar size={14} />
            {formattedDate}
          </span>
          {post.readTime && (
            <span className={styles.metaItem}>
              <Clock size={14} />
              {post.readTime}
            </span>
          )}
          {post.type === 'external' && (
            <span className={styles.externalBadge}>
              <ExternalLink size={14} />
              External
            </span>
          )}
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </CardWrapper>
  );
}
