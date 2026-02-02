import type { Metadata, Viewport } from 'next';
import { Fira_Code, Inter } from 'next/font/google';
import { GoogleAnalytics } from '@next/third-parties/google';
import { ThemeProvider } from '@/components/shared';
import { PersonSchema, ServiceSchema, WebSiteSchema } from '@/components/seo';
import './globals.css';

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

// Creative Theme Typography - Inter for body (clean, readable)
const inter = Inter({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
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
    default: 'Gaurav Saxena | Creative Technologist & Full Stack Architect',
    template: '%s | Gaurav Saxena',
  },
  description:
    'Building immersive, high-performance web platforms that drive growth. Full Stack Architect specializing in scalable systems and AI-driven engineering.',
  keywords: [
    'Creative Technologist',
    'Creative Engineer',
    'Full Stack Architect',
    'Next.js 15',
    'Three.js',
    'WebGL',
    'React Three Fiber',
    'System Architecture',
    'Gaurav Saxena',
    'Full Stack Developer',
    'Freelancer',
    'Web Developer',
    'React Developer',
    'Node.js Developer',
    'TypeScript',
    'Jaipur',
    'India',
    'Hire Developer',
    'Web Application Development',
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
    title: 'Gaurav Saxena | Creative Technologist & Full Stack Architect',
    description:
      'Building immersive, high-performance web platforms that drive growth.',
    siteName: 'Gaurav Saxena Portfolio',
    images: [
      {
        url: '/api/og',
        width: 1200,
        height: 630,
        alt: 'Gaurav Saxena - Creative Technologist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Saxena | Creative Technologist',
    description:
      'Building immersive, high-performance web platforms that drive growth.',
    images: ['/api/og'],
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
    canonical: './',
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
      <head>
        {/* Load Archivo Expanded via Google Fonts CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Expanded:wght@700;800&display=swap"
          rel="stylesheet"
        />
        <PersonSchema />
        <ServiceSchema />
        <WebSiteSchema />
      </head>
      <body className={`${firaCode.variable} ${inter.variable}`}>
        <ThemeProvider>{children}</ThemeProvider>
        <GoogleAnalytics gaId="G-ZVFENY0XPB" />
      </body>
    </html>
  );
}
