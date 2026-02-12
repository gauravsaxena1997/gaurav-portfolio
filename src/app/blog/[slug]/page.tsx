import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
import { BLOG_POSTS } from '@/data';
import { BlogPostingSchema } from '@/components/seo';
import styles from './page.module.css';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.filter((post) => post.type === 'internal').map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: 'Post Not Found | Gaurav Saxena',
    };
  }

  return {
    title: `${post.title} | Gaurav Saxena`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      tags: post.tags,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // If it's an external post, redirect to the external URL
  if (post.type === 'external' && post.externalUrl) {
    redirect(post.externalUrl);
  }

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <article className={styles.container}>
      <BlogPostingSchema post={post} />
      <Link href="/blog" className={styles.backLink}>
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      <header className={styles.header}>
        <h1 className={`${styles.title} code-font`}>{post.title}</h1>

        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <User size={16} />
            {post.author}
          </span>
          <span className={styles.metaItem}>
            <Calendar size={16} />
            {formattedDate}
          </span>
          {post.readTime && (
            <span className={styles.metaItem}>
              <Clock size={16} />
              {post.readTime}
            </span>
          )}
        </div>

        <div className={styles.tags}>
          {post.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className={styles.content}>
        {post.content ? (
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        ) : (
          <p className={styles.placeholder}>
            Content coming soon...
          </p>
        )}
      </div>

      <footer className={styles.footer}>
        <Link href="/blog" className={styles.footerLink}>
          <ArrowLeft size={16} />
          Back to all posts
        </Link>
      </footer>
    </article>
  );
}
