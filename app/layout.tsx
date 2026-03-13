import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from 'next-themes';
import SessionWrapper from '@/components/layout/SessionWrapper';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://newssphere.com'),
  title: {
    default: 'NewsSphere - Breaking News, Analysis & Insights',
    template: '%s | NewsSphere',
  },
  description: 'Your premier source for breaking news, in-depth analysis, and global insights.',
  keywords: ['news', 'breaking news', 'world news', 'technology', 'business', 'sports'],
  openGraph: {
    type: 'website',
    siteName: 'NewsSphere',
    title: 'NewsSphere - Breaking News, Analysis & Insights',
    description: 'Your premier source for breaking news, in-depth analysis, and global insights.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'NewsSphere' }],
  },
  twitter: { card: 'summary_large_image', creator: '@NewsSphere' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap" rel="stylesheet" />
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
          <script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`} crossOrigin="anonymous" />
        )}
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white min-h-screen" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <SessionWrapper>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
            <Toaster position="bottom-right" />
          </SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
