import type { Metadata, Viewport } from 'next';
import { Sora, Manrope, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/shared';
import { PersonSchema, ServiceSchema, WebSiteSchema, BreadcrumbSchema } from '@/components/seo';
import './globals.css';

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <PersonSchema />
        <ServiceSchema />
        <WebSiteSchema />
        <BreadcrumbSchema />
      </head>
      <body className={`${sora.variable} ${manrope.variable} ${jetbrainsMono.variable} font-sans`}>
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-[9999] -translate-y-full bg-[#007acc] px-4 py-2 text-white !text-white text-sm font-semibold transition-transform duration-200 focus:translate-y-0"
          style={{ color: '#ffffff' }}
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        {/* Defer Analytics to reduce initial blocking time */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ZVFENY0XPB"
          strategy="lazyOnload"
        />
        <Script id="google-analytics" strategy="lazyOnload">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-ZVFENY0XPB', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </body>
    </html>
  );
}
