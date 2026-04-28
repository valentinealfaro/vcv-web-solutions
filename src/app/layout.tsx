import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { CustomCursor } from '@/components/CustomCursor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MobileStickyBar } from '@/components/MobileStickyBar';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const OG_DESC  = 'High-converting websites built in 3-7 days for local service businesses. SEO-optimized, mobile-ready, and engineered to generate leads — not just look pretty.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'VCV Web Solutions — Websites That Generate Leads',
  description: OG_DESC,
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf',
  },
  openGraph: {
    type:        'website',
    url:         SITE_URL,
    siteName:    'VCV Web Solutions',
    title:       'VCV Web Solutions — Websites That Generate Leads',
    description: OG_DESC,
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'VCV Web Solutions — We build websites that generate leads',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@vcvwebsolutions',
    title:       'VCV Web Solutions — Websites That Generate Leads',
    description: OG_DESC,
    images:      ['/og-image.png'],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#030712" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <CustomCursor />
        <Navbar />
        <ErrorBoundary>
          <main>{children}</main>
        </ErrorBoundary>
        <Footer />
        <FloatingCTA />

        <MobileStickyBar />
      </body>
    </html>
  );
}
