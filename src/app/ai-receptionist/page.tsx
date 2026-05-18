import type { Metadata } from 'next';
import AIReceptionistClient from './ai-receptionistClient';

const SITE_URL = 'https://www.vcvwebsolutions.com';
const OG_IMAGE = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('AI RECEPTIONIST · NOVA')}&title=${encodeURIComponent('Never miss another phone call')}&subtitle=${encodeURIComponent('24/7 AI answering · Books jobs · Texts you the lead instantly')}&accent=%2322c55e`;

export const metadata: Metadata = {
  title:       'Nova AI Receptionist — 24/7 Call Answering · VCV Web Solutions',
  description: 'Never miss a call. Nova answers every phone call 24/7, books appointments, and texts you the lead instantly. Try free for 14 days.',
  alternates: { canonical: `${SITE_URL}/ai-receptionist` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/ai-receptionist`,
    siteName: 'VCV Web Solutions',
    title:       'Nova AI Receptionist — 24/7 Call Answering · VCV Web Solutions',
    description: 'Never miss a call. Nova answers every phone call 24/7, books appointments, and texts you the lead instantly. Try free for 14 days.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:       'Nova AI Receptionist — 24/7 Call Answering · VCV Web Solutions',
    description: 'Never miss a call. Nova answers every phone call 24/7, books appointments, and texts you the lead instantly. Try free for 14 days.',
    images: [OG_IMAGE],
  },
};

export default function Page() { return <AIReceptionistClient />; }
