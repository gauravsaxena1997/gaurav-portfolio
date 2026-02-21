import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './bio.css';

const inter = Inter({
  variable: '--font-bio',
  subsets: ['latin'],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#000000',
};

export const metadata: Metadata = {
  title: 'Gaurav Saxena | Builder & Creative Technologist',
  description:
    'Builder, consultant, and creative technologist helping indie founders ship faster. Connect with me.',
  openGraph: {
    type: 'website',
    title: 'Gaurav Saxena | Builder & Creative Technologist',
    description:
      'Builder, consultant, and creative technologist helping indie founders ship faster.',
    images: [{ url: '/bio/profile.webp', width: 400, height: 400, alt: 'Gaurav Saxena' }],
  },
  robots: { index: true, follow: true },
};

export default function BioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.variable} bio-root`}>
      {children}
    </div>
  );
}
