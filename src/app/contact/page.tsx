import type { Metadata } from 'next';
import ContactClient from './contactClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export const metadata: Metadata = {
  title:       'Contact VCV Web Solutions — Free Design Preview · 24-hr Reply',
  description: 'Call (580) 919-1386 or send a message. Free custom design preview within 48 hours. We reply within 24 hours.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/contact`,
    siteName: 'VCV Web Solutions',
    title:       'Contact VCV Web Solutions — Free Design Preview · 24-hr Reply',
    description: 'Call (580) 919-1386 or send a message. Free custom design preview within 48 hours. We reply within 24 hours.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VCV Web Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:       'Contact VCV Web Solutions — Free Design Preview · 24-hr Reply',
    description: 'Call (580) 919-1386 or send a message. Free custom design preview within 48 hours. We reply within 24 hours.',
    images: ['/og-image.png'],
  },
};

export default function Page() { return <ContactClient />; }
