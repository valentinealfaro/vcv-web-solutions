import type { Metadata } from 'next';
import PricingClient from './pricingClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const TITLE       = 'Pricing — Monthly $97 / Annual $997 / Lifetime $1,497 · VCV Web Solutions';
const DESCRIPTION = 'Simple, transparent pricing for high-converting websites. Monthly from $97, annual saves $173, lifetime $1,497 once. Free design preview, no upfront cost, cancel anytime.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/pricing` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/pricing`,
    siteName: 'VCV Web Solutions',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VCV Web Solutions Pricing' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.png'] },
};

export default function Page() { return <PricingClient />; }
