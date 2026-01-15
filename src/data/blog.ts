export interface IBlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  thumbnail?: string;
  author: string;
  publishedAt: string;
  tags: string[];
  featured: boolean;
  type: 'internal' | 'external';
  externalUrl?: string;
  readTime?: string;
}

export const BLOG_POSTS: IBlogPost[] = [
  {
    id: 'new-year-planning-2025',
    slug: 'new-year-planning-guide-2025',
    title:
      'New Year Planning Guide 2026: James Clear, Tim Ferriss & Ali Abdaal Methods',
    excerpt:
      'Plan your best 2026 with proven frameworks from James Clear (Atomic Habits), Tim Ferriss (Past Year Review), Ali Abdaal (Feel-Good Productivity) & Brian P. Moran (12 Week Year).',
    thumbnail: '/blog/new-year-planning-thumb.jpg',
    author: 'Gaurav Saxena',
    publishedAt: '2026-01-01',
    tags: ['Productivity', 'Goal Setting', 'Atomic Habits'],
    featured: true,
    type: 'external',
    externalUrl:
      'https://www.superhumanflow.com/blog/new-year-life-planning-guide-2025',
    readTime: '15 min read',
  },
];

// Helper function to get featured posts
export const getFeaturedPosts = () =>
  BLOG_POSTS.filter((post) => post.featured);

// Helper function to search posts
export const searchPosts = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return BLOG_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(lowerQuery) ||
      post.excerpt.toLowerCase().includes(lowerQuery) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
};

// Helper function to get post by slug
export const getPostBySlug = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);
