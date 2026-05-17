import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const WebsiteOnboarding = dynamic(() => import('@/views/WebsiteOnboarding'));

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export const metadata: Metadata = {
  title:       'Website Onboarding · VCV Web Solutions',
  description: 'Onboarding form for new VCV Web Solutions clients.',
  alternates:  { canonical: `${SITE_URL}/website-onboarding` },
  robots:      { index: false, follow: false },
};

export default function Page() {
  return <WebsiteOnboarding />;
}
