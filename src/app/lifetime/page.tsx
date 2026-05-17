import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Lifetime = dynamic(() => import('@/views/Lifetime'));

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const TITLE = 'Lifetime Website — Pay $1,497 Once, Own It Forever · VCV Web Solutions';
const DESC  = 'Stop renting your website at $30–$200/month forever. Pay $1,497 once, own the site for life. Same conversion-focused build, no recurring fees.';
const OG    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('LIFETIME WEBSITE')}&title=${encodeURIComponent('One price. Yours forever.')}&subtitle=${encodeURIComponent('$1,497 once · No monthly fees ever · Save $9,000+ over 10 yrs')}&accent=%233b82f6`;

export const metadata: Metadata = {
  title:       TITLE,
  description: DESC,
  alternates:  { canonical: `${SITE_URL}/lifetime` },
  openGraph: {
    type: 'website', url: `${SITE_URL}/lifetime`, siteName: 'VCV Web Solutions',
    title: TITLE, description: DESC,
    images: [{ url: OG, width: 1200, height: 630, alt: 'Lifetime website — $1,497 once' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESC, images: [OG] },
};

export default function Page() {
  return <Lifetime />;
}
