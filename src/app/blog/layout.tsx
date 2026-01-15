import '@/styles/blog-theme.css';
import { BlogHeader } from '@/components/blog';

export const metadata = {
  title: 'Blog | Gaurav Saxena',
  description: 'Thoughts on web development, productivity, and building digital products.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="blog-theme">
      <BlogHeader />
      <main className="blog-main">
        {children}
      </main>
    </div>
  );
}
