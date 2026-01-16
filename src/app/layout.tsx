import type { Metadata, Viewport } from 'next';
import { Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/shared';
import './globals.css';

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const BASE_URL = 'https://gauravsaxena.site';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f4f4' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1e1e' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Gaurav Saxena | Full Stack Developer & Freelancer',
    template: '%s | Gaurav Saxena',
  },
  description:
    'Freelance Full Stack Developer with 5+ years of experience building scalable web applications. Specializing in React, Next.js, Angular, Node.js, and cloud technologies. Available for hire.',
  keywords: [
    'Gaurav Saxena',
    'Full Stack Developer',
    'Freelancer',
    'Web Developer',
    'React Developer',
    'Next.js Developer',
    'Angular Developer',
    'Node.js Developer',
    'TypeScript',
    'JavaScript',
    'Jaipur',
    'India',
    'Hire Developer',
    'Web Application Development',
    'Startup Developer',
  ],
  authors: [{ name: 'Gaurav Saxena', url: BASE_URL }],
  creator: 'Gaurav Saxena',
  publisher: 'Gaurav Saxena',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
    description:
      'Freelance Full Stack Developer with 5+ years of experience. Building scalable web applications for startups and businesses.',
    siteName: 'Gaurav Saxena Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Gaurav Saxena - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
    description:
      'Freelance Full Stack Developer with 5+ years of experience. Building scalable web applications.',
    images: ['/og-image.png'],
    creator: '@gauravsaxena',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'technology',
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
  other: {
    'msapplication-TileColor': '#007acc',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
