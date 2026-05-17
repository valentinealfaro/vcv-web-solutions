import type { Metadata } from 'next';
import PortfolioClient from './our-workClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const TITLE       = 'Our Work — Live Websites for 34 Industries · VCV Web Solutions';
const DESCRIPTION = "Browse 34 live conversion-focused websites we've built for local service businesses. Real sites. Real conversions. From $97/mo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/our-work` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/our-work`,
    siteName: 'VCV Web Solutions',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VCV Web Solutions Portfolio' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.png'] },
};

export default function Page() { return <PortfolioClient />; }
