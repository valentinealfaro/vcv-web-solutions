import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const Terms = dynamic(() => import('@/views/Terms'));

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export const metadata: Metadata = {
  title:       'Terms & Privacy · VCV Web Solutions',
  description: 'Terms of service and privacy policy for VCV Web Solutions.',
  alternates:  { canonical: `${SITE_URL}/terms` },
  robots:      { index: true, follow: true },
};

export default function Page() {
  return <Terms />;
}
