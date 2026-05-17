import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findIndustry } from '@/data/industries';
import GenericTemplate from '@/views/templates/GenericTemplate';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const SLUG = 'vets';

export function generateMetadata(): Metadata {
  const data = findIndustry(SLUG);
  if (!data) return { title: 'Template Not Found' };
  const url = `${SITE_URL}/templates/${data.slug}`;
  const title = `${data.name} Website Template · Live Demo by VCV Web Solutions`;
  const description = `Conversion-ready website template for ${data.pluralLabel}. SEO-optimized, mobile-perfect, launched in 3–7 days. See the live demo and get yours customized free.`;
  const ogImage = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent(data.heroEyebrow)}&title=${encodeURIComponent(data.name + ' Website Template')}&subtitle=${encodeURIComponent('Live demo · Free design preview · From $97/mo')}&accent=${encodeURIComponent(data.color)}&emoji=${encodeURIComponent(data.emoji)}`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, siteName: 'VCV Web Solutions',
      title, description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${data.name} website template` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default function Page() {
  const data = findIndustry(SLUG);
  if (!data) notFound();
  const url = `${SITE_URL}/templates/${data.slug}`;
  const service = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: `Website Design for ${data.pluralLabel}`,
    name: `${data.name} Website Template`,
    description: `Conversion-ready website built specifically for ${data.pluralLabel}.`,
    provider: { '@type': 'Organization', name: 'VCV Web Solutions', url: SITE_URL },
    areaServed: { '@type': 'Country', name: 'United States' },
    offers: { '@type': 'Offer', price: '97', priceCurrency: 'USD', url },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',      item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Templates', item: `${SITE_URL}/templates` },
      { '@type': 'ListItem', position: 3, name: data.name,   item: url },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <GenericTemplate industry={data} />
    </>
  );
}
