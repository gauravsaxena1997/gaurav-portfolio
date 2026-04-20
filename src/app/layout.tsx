import type { Metadata, Viewport } from 'next';
import { Sora, Manrope, Archivo, Space_Grotesk, JetBrains_Mono, Inter, Outfit, Playfair_Display, DM_Sans, Syne, Montserrat } from 'next/font/google';
import Script from 'next/script';
import { ThemeProvider } from '@/components/shared';
import { PersonSchema, ServiceSchema, WebSiteSchema, ProfilePageSchema, HowToSchema, BreadcrumbSchema, FAQSchema, TestimonialSchema } from '@/components/seo';
import { AnalyticsService } from '@/services/AnalyticsService';
import { ChatWidgetLoader } from '@/components/chat/ChatWidgetLoader';
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

const archivo = Archivo({
  variable: '--font-archivo',
  subsets: ['latin'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
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
    default: 'Gaurav Saxena | Freelance Full Stack Developer & Creative Technologist',
    template: '%s | Gaurav Saxena',
  },
  description:
    'Gaurav Saxena is a freelance full stack developer and creative technologist based in Jaipur, India. 6+ years experience building web apps, SaaS platforms, and AI-powered tools for global clients. Ex-Zetwerk Senior SWE. Available for hire.',
  keywords: [
    // Identity
    'Gaurav Saxena',
    'Gaurav Saxena developer',
    'Gaurav Saxena portfolio',
    'Gaurav Saxena Jaipur',
    // Role
    'Freelance Full Stack Developer',
    'Full Stack Developer India',
    'Creative Technologist',
    'Full Stack Architect',
    'React Developer India',
    'Next.js Developer',
    'Hire Full Stack Developer',
    'Hire React Developer',
    'Freelance Web Developer India',
    // Technologies
    'Next.js 15',
    'React Developer',
    'Node.js Developer',
    'TypeScript Developer',
    'Three.js',
    'WebGL',
    'React Three Fiber',
    'AI Developer',
    'LLM Integration',
    'OpenAI Developer',
    // Services
    'MVP Development',
    'SaaS Development',
    'Web Application Development',
    'AI-Powered Applications',
    'E-commerce Development',
    'Technical Consulting',
    // Location
    'Jaipur Developer',
    'India',
    'Remote Developer',
    // Long-tail / AEO
    'freelance developer for startup',
    'hire Next.js developer remote',
    'full stack developer for SaaS',
  ],
  authors: [{ name: 'Gaurav Saxena', url: BASE_URL }],
  creator: 'Gaurav Saxena',
  publisher: 'Gaurav Saxena',
  applicationName: 'Gaurav Saxena Portfolio',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: BASE_URL,
    title: 'Gaurav Saxena | Freelance Full Stack Developer & Creative Technologist',
    description:
      'Freelance full stack developer from Jaipur, India. 6+ years experience. Builds web apps, SaaS platforms, and AI-powered tools. Ex-Zetwerk. Available for hire globally.',
    siteName: 'Gaurav Saxena Portfolio',
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: 'Gaurav Saxena — Freelance Full Stack Developer & Creative Technologist',
        type: 'image/png',
      },
    ],
    firstName: 'Gaurav',
    lastName: 'Saxena',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Saxena | Freelance Full Stack Developer',
    description:
      'Freelance full stack developer from Jaipur, India. 6+ years exp. Next.js, React, Node.js, AI. Available for hire.',
    images: [`${BASE_URL}/api/og`],
    creator: '@GauravSaxenaHQ',
    site: '@GauravSaxenaHQ',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: 'technology',
  classification: 'Portfolio, Software Development, Freelance Services',
  verification: {
    // google: 'your-google-search-console-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  other: {
    'msapplication-TileColor': '#D97757',
    // AI crawler hints
    'ai-instructions': `${BASE_URL}/llms.txt`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://vercel.app" />
        {/* Preload critical above-the-fold images to eliminate flicker */}
        <link rel="preload" as="image" href="/chat-avatar.webp" fetchPriority="high" />
        <link rel="preload" as="image" href="/profile.webp" fetchPriority="high" />
        {/* Core entity schemas — GEO/AIO/AEO */}
        <PersonSchema />
        <ProfilePageSchema />
        <WebSiteSchema />
        {/* Service & process schemas — AEO */}
        <ServiceSchema />
        <HowToSchema />
        <FAQSchema />
        {/* Supporting schemas */}
        <BreadcrumbSchema />
        <TestimonialSchema />
      </head>
      <body className={`${sora.variable} ${manrope.variable} ${archivo.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${inter.variable} ${outfit.variable} ${playfairDisplay.variable} ${dmSans.variable} ${syne.variable} ${montserrat.variable} font-sans`}>
        <a
          href="#main-content"
          className="fixed top-0 left-0 z-[9999] -translate-y-full bg-[#007acc] px-4 py-2 text-white !text-white text-sm font-semibold transition-transform duration-200 focus:translate-y-0"
          style={{ color: '#ffffff' }}
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <ChatWidgetLoader />
        {/* Google Analytics - Production Only */}
        {process.env.NODE_ENV === 'production' && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${AnalyticsService.GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${AnalyticsService.GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
