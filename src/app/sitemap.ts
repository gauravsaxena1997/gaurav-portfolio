import { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/data/caseStudies';
import { BLOG_POSTS } from '@/data/blog';

const BASE_URL = 'https://gauravsaxena.site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];

  // Project/Case study pages
  const projectPages: MetadataRoute.Sitemap = CASE_STUDIES.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Blog post pages (only internal posts)
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.filter(
    (post) => post.type === 'internal'
  ).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
