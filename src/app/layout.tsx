import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SiteChrome } from '@/components/SiteChrome';
import { Analytics } from '@/components/Analytics';
import Script from 'next/script';

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
        {/* Preload the primary font stylesheet so it doesn't render-block above the fold */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@500;600;700;800;900&family=Bebas+Neue&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Inter+Tight:wght@500;600;700;800;900&family=Bebas+Neue&display=swap"
        />
      </head>
      <body>
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
