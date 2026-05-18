import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Landing = dynamic(() => import('@/views/Landing'));

const SITE_URL = 'https://www.vcvwebsolutions.com';
const TITLE = 'Free Design Preview — See Your New Website Before You Pay · VCV Web Solutions';
const DESC  = 'We build a fully custom website preview for your business in 48 hours. No credit card, no commitment — see exactly what you\'re getting before any payment.';
const OG    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('FREE DESIGN PREVIEW')}&title=${encodeURIComponent('See your site before you pay')}&subtitle=${encodeURIComponent('Custom mockup in 48 hours · From $97/mo after approval')}&accent=%2322c55e`;

export const metadata: Metadata = {
  title:       TITLE,
  description: DESC,
  alternates:  { canonical: `${SITE_URL}/free-demo` },
  openGraph: {
    type: 'website', url: `${SITE_URL}/free-demo`, siteName: 'VCV Web Solutions',
    title: TITLE, description: DESC,
    images: [{ url: OG, width: 1200, height: 630, alt: 'Free custom website design preview' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

export default function Page() {
  return <Landing />;
}
