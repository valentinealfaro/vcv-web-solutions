import type { Metadata } from 'next';
import { INDUSTRIES } from '@/data/industries';
import TemplatesGallery from '@/views/TemplatesGallery';

const SITE_URL = 'https://www.vcvwebsolutions.com';
const OG_IMAGE = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('TEMPLATE GALLERY')}&title=${encodeURIComponent('34 live website templates')}&subtitle=${encodeURIComponent('Filter by industry · Live demos · From $97/mo')}&accent=%238b5cf6`;

export const metadata: Metadata = {
  title:       '34 Live Website Templates · Filter by Industry · VCV Web Solutions',
  description: 'Browse 34 conversion-ready website templates for local businesses — roofing, HVAC, plumbing, restaurants, dentists, law firms, gyms, and more. Live demos. SEO + mobile optimized. From $97/mo.',
  alternates: { canonical: `${SITE_URL}/templates` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/templates`,
    siteName: 'VCV Web Solutions',
    title: '34 Live Website Templates · Filter by Industry',
    description: 'Production-ready website templates for 34 industries. Live demos, full SEO, mobile-perfect, from $97/mo.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions Template Gallery' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '34 Live Website Templates · Filter by Industry',
    description: 'Live demos for 34 industries. Pick yours, customize, launch in 3–7 days.',
    images: [OG_IMAGE],
  },
};

export default function Page() {
  /* ItemList — helps Google surface this as a rich result */
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'VCV Web Solutions Template Gallery',
    numberOfItems: INDUSTRIES.length,
    itemListElement: INDUSTRIES.map((i, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/templates/${i.slug}`,
      name: `${i.name} Website Template`,
    })),
  };

  /* BreadcrumbList — Google uses this for the breadcrumb snippet in SERP */
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates',item: `${SITE_URL}/templates` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <TemplatesGallery industries={INDUSTRIES} />
    </>
  );
}
