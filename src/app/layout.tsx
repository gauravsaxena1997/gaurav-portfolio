import type { Metadata } from 'next';
import { Fira_Code } from 'next/font/google';
import { ThemeProvider } from '@/components/shared';
import './globals.css';

const firaCode = Fira_Code({
  variable: '--font-fira-code',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
  description:
    'Senior Software Engineer and Full Stack Developer with 5+ years of experience. Specializing in Angular, Node.js, MongoDB, and building scalable web applications.',
  keywords: [
    'Gaurav Saxena',
    'Full Stack Developer',
    'Freelancer',
    'Web Developer',
    'Angular Developer',
    'Node.js Developer',
    'MEAN Stack',
    'Jaipur',
    'India',
  ],
  authors: [{ name: 'Gaurav Saxena' }],
  creator: 'Gaurav Saxena',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
    description:
      'Senior Software Engineer and Full Stack Developer with 5+ years of experience.',
    siteName: 'Gaurav Saxena Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gaurav Saxena | Full Stack Developer & Freelancer',
    description:
      'Senior Software Engineer and Full Stack Developer with 5+ years of experience.',
  },
  robots: {
    index: true,
    follow: true,
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
