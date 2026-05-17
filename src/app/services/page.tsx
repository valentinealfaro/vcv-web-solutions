import type { Metadata } from 'next';
import ServicesClient from './servicesClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export const metadata: Metadata = {
  title:       'Services — Website Design, SEO, Paid Ads, Social · VCV Web Solutions',
  description: 'Everything local businesses need online: conversion-focused website design, SEO, Google Ads, and social media — all built to generate leads.',
  alternates: { canonical: `${SITE_URL}/services` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/services`,
    siteName: 'VCV Web Solutions',
    title:       'Services — Website Design, SEO, Paid Ads, Social · VCV Web Solutions',
    description: 'Everything local businesses need online: conversion-focused website design, SEO, Google Ads, and social media — all built to generate leads.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VCV Web Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:       'Services — Website Design, SEO, Paid Ads, Social · VCV Web Solutions',
    description: 'Everything local businesses need online: conversion-focused website design, SEO, Google Ads, and social media — all built to generate leads.',
    images: ['/og-image.png'],
  },
};

export default function Page() { return <ServicesClient />; }
