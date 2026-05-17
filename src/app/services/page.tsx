import type { Metadata } from 'next';
import ServicesClient from './servicesClient';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const OG_IMAGE = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('SERVICES')}&title=${encodeURIComponent('Website Design · SEO · Paid Ads · Social')}&subtitle=${encodeURIComponent('Everything local businesses need online to generate leads')}&accent=%238b5cf6`;

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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions' }],
  },
  twitter: {
    card: 'summary_large_image',
    title:       'Services — Website Design, SEO, Paid Ads, Social · VCV Web Solutions',
    description: 'Everything local businesses need online: conversion-focused website design, SEO, Google Ads, and social media — all built to generate leads.',
    images: [OG_IMAGE],
  },
};

export default function Page() { return <ServicesClient />; }
