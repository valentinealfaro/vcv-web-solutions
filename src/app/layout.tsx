import type { Metadata } from 'next';
import React from 'react';
import { Inter, Inter_Tight, Bebas_Neue } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SiteChrome } from '@/components/SiteChrome';
import { Analytics } from '@/components/Analytics';
import Script from 'next/script';

/* ─── Self-hosted fonts via next/font/google ───────────────────────────
   Replaces the external <link rel="stylesheet"> that was render-blocking on
   first paint. Now fonts are bundled, served from our own domain with
   immutable caching, and use display: 'swap' to never block text from
   rendering. Real LCP / CLS improvement on every page load. */
const inter = Inter({
  subsets: ['latin'],
  weight:  ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display:  'swap',
  preload:  true,
});
const interTight = Inter_Tight({
  subsets: ['latin'],
  weight:  ['500', '600', '700', '800', '900'],
  variable: '--font-inter-tight',
  display:  'swap',
  preload:  true,
});
const bebas = Bebas_Neue({
  subsets: ['latin'],
  weight:  ['400'],
  variable: '--font-bebas',
  display:  'swap',
  preload:  false, // display font — fine to load after the LCP
});

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
        url:    `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('VCV WEB SOLUTIONS')}&title=${encodeURIComponent('Websites that generate leads')}&subtitle=${encodeURIComponent('Built in 3–7 days for local businesses · From $97/mo')}&accent=%233b82f6`,
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
    images:      [`${SITE_URL}/api/og?eyebrow=${encodeURIComponent('VCV WEB SOLUTIONS')}&title=${encodeURIComponent('Websites that generate leads')}&subtitle=${encodeURIComponent('Built in 3–7 days for local businesses · From $97/mo')}&accent=%233b82f6`],
  },
  alternates: {
    canonical: SITE_URL,
  },
  /* Search-engine verification slots — paste real codes when you set them up.
     Reads them from env so secrets never live in the repo. */
  verification: {
    google:  process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: {
      'msvalidate.01':    process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
      'yandex-verification': process.env.NEXT_PUBLIC_YANDEX_VERIFICATION   || '',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'Business',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable} ${bebas.variable}`}>
      <head>
        <meta name="theme-color" content="#030712" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
      </head>
      <body className={inter.className}>
        {/* Analytics: GA4 + Meta Pixel + Microsoft Clarity */}
        <Analytics />

        {/* Schema.org JSON-LD — helps Google show rich results */}
        <Script id="ld-organization" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'VCV Web Solutions',
            url: SITE_URL,
            logo: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf',
            description: OG_DESC,
            sameAs: [],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-580-919-1386',
              contactType: 'sales',
              areaServed: 'US',
              availableLanguage: ['English'],
            },
          })}
        </Script>
        <Script id="ld-website" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'VCV Web Solutions',
            url: SITE_URL,
            description: OG_DESC,
            publisher: { '@type': 'Organization', name: 'VCV Web Solutions' },
            potentialAction: {
              '@type': 'SearchAction',
              target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/templates?q={search_term_string}` },
              'query-input': 'required name=search_term_string',
            },
          })}
        </Script>
        <Script id="ld-localbusiness" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'VCV Web Solutions',
            url: SITE_URL,
            telephone: '+1-580-919-1386',
            priceRange: '$47-$1497',
            description: OG_DESC,
            address: { '@type': 'PostalAddress', addressCountry: 'US' },
            openingHours: 'Mo-Sa 09:00-18:00',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              reviewCount: '50',
              bestRating: '5',
              worstRating: '1',
            },
            review: [
              { '@type': 'Review', author: { '@type': 'Person', name: 'Mike R.' }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, reviewBody: 'Booked 3 jobs in the first week. The phone literally has not stopped.' },
              { '@type': 'Review', author: { '@type': 'Person', name: 'Sarah H.' }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, reviewBody: 'Looks like a $20k website. Cost me a fraction of that. Best money I have spent.' },
              { '@type': 'Review', author: { '@type': 'Person', name: 'David L.' }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, reviewBody: 'Our old site got 2 leads a month. New site got 18 in the first 30 days.' },
            ],
          })}
        </Script>
        <Script id="ld-service-nova" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: 'AI Receptionist & Lead Capture',
            provider: { '@type': 'Organization', name: 'VCV Web Solutions' },
            description: 'Nova AI receptionist answers every call 24/7, captures leads, books appointments, and follows up automatically.',
            offers: [
              { '@type': 'Offer', name: 'Starter', price: '147', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Growth',  price: '297', priceCurrency: 'USD' },
              { '@type': 'Offer', name: 'Pro',     price: '497', priceCurrency: 'USD' },
            ],
          })}
        </Script>

        <ThemeProvider>
          <CustomCursor />
          <ErrorBoundary>
            <SiteChrome>{children}</SiteChrome>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
