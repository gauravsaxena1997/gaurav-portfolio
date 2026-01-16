import { MetadataRoute } from 'next';
import { CASE_STUDIES } from '@/data/caseStudies';
import { BLOG_POSTS } from '@/data/blog';

const BASE_URL = 'https://gauravsaxena.site';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Project/Case study pages
  const projectPages: MetadataRoute.Sitemap = CASE_STUDIES.map((project) => ({
    url: `${BASE_URL}/projects/${project.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Blog post pages (only internal posts)
  const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.filter(
    (post) => post.type === 'internal'
  ).map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.publishedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...projectPages, ...blogPages];
}
