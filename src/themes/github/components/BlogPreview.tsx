'use client';

import { MessageSquare, ArrowRight, Star, Clock, Tag, Megaphone, Lightbulb, HelpCircle, Presentation } from 'lucide-react';
import { BLOG_POSTS } from '@/data';
import type { IBlogPost } from '@/data';
import styles from './BlogPreview.module.css';

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Map categories to icons
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  announcement: <Megaphone size={14} />,
  idea: <Lightbulb size={14} />,
  'q&a': <HelpCircle size={14} />,
  show: <Presentation size={14} />,
};

interface BlogItemProps {
  post: IBlogPost;
}

function BlogItem({ post }: BlogItemProps) {
  const isExternal = post.type === 'external' && post.externalUrl;
  const href = isExternal ? post.externalUrl! : `/blog/${post.slug}`;
  const category = post.tags[0]?.toLowerCase() || 'show';

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className={styles.discussionItem}
    >
      <div className={styles.discussionIcon}>
        <MessageSquare size={18} />
      </div>
      <div className={styles.discussionContent}>
        <div className={styles.discussionHeader}>
          <h3 className={styles.discussionTitle}>{post.title}</h3>
          {post.featured && (
            <span className={styles.featuredBadge}>
              <Star size={12} fill="currentColor" />
              Pinned
            </span>
          )}
        </div>

        <div className={styles.discussionMeta}>
          <span className={styles.categoryBadge}>
            {CATEGORY_ICONS[category] || <Tag size={14} />}
            {post.tags[0] || 'General'}
          </span>
          <span className={styles.metaSeparator}>•</span>
          <span className={styles.date}>{formatDate(post.publishedAt)}</span>
          {post.readTime && (
            <>
              <span className={styles.metaSeparator}>•</span>
              <span className={styles.readTime}>
                <Clock size={12} />
                {post.readTime}
              </span>
            </>
          )}
        </div>

        {post.excerpt && (
          <p className={styles.discussionExcerpt}>{post.excerpt}</p>
        )}

        <div className={styles.discussionTags}>
          {post.tags.slice(1, 4).map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <MessageSquare size={48} className={styles.emptyIcon} />
      <h3 className={styles.emptyTitle}>No discussions yet</h3>
      <p className={styles.emptyText}>
        Blog posts and articles will appear here.
        <br />
        Check back soon for updates!
      </p>
    </div>
  );
}

export function BlogPreview() {
  // Sort posts: featured first, then by date
  const displayPosts = [...BLOG_POSTS]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
    .slice(0, 6);

  return (
    <section id="blog" className={styles.blogSection}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <MessageSquare size={20} className={styles.headerIcon} />
          <div className={styles.headerText}>
            <h1 className={styles.title}>Discussions</h1>
            <p className={styles.subtitle}>
              {BLOG_POSTS.length > 0
                ? 'Articles, tutorials, and thoughts on development'
                : 'A space for sharing ideas and knowledge'}
            </p>
          </div>
        </div>

        {/* Discussions Card */}
        <div className={styles.discussionsCard}>
          <div className={styles.cardContent}>
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <BlogItem key={post.id} post={post} />
              ))
            ) : (
              <EmptyState />
            )}
          </div>

          <div className={styles.cardFooter}>
            <a href="/blog" target="_blank" rel="noopener noreferrer" className={styles.viewAllLink}>
              View all posts
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
