'use client';

import Link from 'next/link';
import { Rss, ArrowRight, Star, Clock } from 'lucide-react';
import { BLOG_POSTS } from '@/data';
import { useSectionAnimation } from '../hooks';
import type { IBlogPost } from '@/data';
import styles from './BlogPreview.module.css';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface BlogItemProps {
  post: IBlogPost;
}

function BlogItem({ post }: BlogItemProps) {
  const isExternal = post.type === 'external' && post.externalUrl;
  const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={styles.blogItem}
    >
      <div className={styles.itemContent}>
        <div className={styles.itemHeader}>
          <span className={styles.bullet}>●</span>
          <h3 className={styles.itemTitle}>{post.title}</h3>
          {post.featured && (
            <span className={styles.featuredBadge}>
              <Star size={12} fill="currentColor" />
              Featured
            </span>
          )}
        </div>

        <div className={styles.itemMeta}>
          <span className={styles.date}>{formatDate(post.publishedAt)}</span>
          {post.readTime && (
            <>
              <span className={styles.separator}>·</span>
              <span className={styles.readTime}>
                <Clock size={12} />
                {post.readTime}
              </span>
            </>
          )}
        </div>

        {post.excerpt && (
          <p className={styles.itemExcerpt}>{post.excerpt}</p>
        )}

        <div className={styles.itemTags}>
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

export function BlogPreview() {
  const sectionTitleRef = useSectionAnimation('blog');

  // Sort posts: featured first, then by date
  const displayPosts = [...BLOG_POSTS]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 5);

  if (BLOG_POSTS.length === 0) return null;

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>

        <div className={styles.feedCard}>
          <div className={styles.feedHeader}>
            <Rss size={20} className={styles.rssIcon} />
            <span className={styles.feedTitle}>RSS FEED</span>
          </div>

          <div className={styles.feedContent}>
            {displayPosts.map((post) => (
              <BlogItem key={post.id} post={post} />
            ))}
          </div>

          <div className={styles.feedFooter}>
            <Link href="/blog" className={styles.viewAllLink}>
              View All Posts
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
