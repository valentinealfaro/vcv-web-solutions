import type { Metadata } from 'next';
import ContactClient from './contactClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const OG_IMAGE = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('CONTACT')}&title=${encodeURIComponent('Free design preview in 48 hours')}&subtitle=${encodeURIComponent('Call (580) 919-1386 · We reply within 24 hrs · No credit card')}&accent=%2306b6d4`;

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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:       'Contact VCV Web Solutions — Free Design Preview · 24-hr Reply',
    description: 'Call (580) 919-1386 or send a message. Free custom design preview within 48 hours. We reply within 24 hours.',
    images: [OG_IMAGE],
  },
};

export default function Page() { return <ContactClient />; }
