import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDES } from '@/data/guides';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const TITLE       = 'Guides — Practical Web & Local-SEO Advice for Small Businesses · VCV';
const DESCRIPTION = 'Plain-language guides for service-business owners on local SEO, website ROI, and what actually moves the needle. No fluff, no upsells.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    type: 'website', url: `${SITE_URL}/guides`, siteName: 'VCV Web Solutions',
    title: TITLE, description: DESCRIPTION,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'VCV Web Solutions Guides' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ['/og-image.png'] },
};

export default function Page() {
  const blogLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'VCV Web Solutions Guides',
    url: `${SITE_URL}/guides`,
    description: DESCRIPTION,
    publisher: { '@type': 'Organization', name: 'VCV Web Solutions', url: SITE_URL },
    blogPost: GUIDES.map(g => ({
      '@type': 'BlogPosting',
      headline:     g.title,
      url:          `${SITE_URL}/guides/${g.slug}`,
      datePublished: g.publishedAt,
      dateModified:  g.updatedAt,
      description:  g.description,
    })),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
    ],
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">Guides</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-5">
            Plain advice for <span className="gradient-text">small business owners.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            No fluff. No upsells. Just what works for getting more leads from a website.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {GUIDES.map(g => (
            <Link key={g.slug} href={`/guides/${g.slug}`}
              className="block p-7 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/25">
                  {g.category}
                </span>
                <span className="text-gray-500 text-xs">{g.readingTime}</span>
                <span className="text-gray-600 text-xs">·</span>
                <time className="text-gray-500 text-xs" dateTime={g.updatedAt}>
                  Updated {new Date(g.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </time>
              </div>
              <h2 className="text-white text-2xl md:text-3xl font-extrabold tracking-tight leading-tight mb-3">
                {g.title}
              </h2>
              <p className="text-gray-400 leading-relaxed">{g.description}</p>
              <span className="inline-flex items-center gap-1.5 text-blue-400 text-sm font-bold mt-4">
                Read the guide →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
