import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { INDUSTRIES, findIndustry } from '@/data/industries';

const View = dynamic(() => import('@/views/IndustryLanding'));

const SITE_URL = 'https://www.vcvwebsolutions.com';

interface PageProps {
  params: Promise<{ industry: string }>;
}

/* ── Static generation: pre-render every industry page at build time ── */
export function generateStaticParams() {
  return INDUSTRIES.map(i => ({ industry: i.slug }));
}

/* ── Per-page SEO metadata (unique title + description for every URL) ── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { industry: slug } = await params;
  const data = findIndustry(slug);
  if (!data) return { title: 'Page Not Found' };

  const url = `${SITE_URL}/ai-receptionist/${data.slug}`;
  const ogImage = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent(`NOVA · ${data.heroEyebrow}`)}&title=${encodeURIComponent('Never miss a call again')}&subtitle=${encodeURIComponent(`24/7 AI receptionist for ${data.pluralLabel}`)}&accent=${encodeURIComponent(data.color)}&emoji=${encodeURIComponent(data.emoji)}`;
  return {
    title: data.metaTitle,
    description: data.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      url,
      siteName: 'VCV Web Solutions',
      title: data.metaTitle,
      description: data.metaDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: data.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.metaTitle,
      description: data.metaDescription,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { industry: slug } = await params;
  const data = findIndustry(slug);
  if (!data) notFound();
  return <View industry={data} />;
}
