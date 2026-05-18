import type { Metadata } from 'next';
import Link from 'next/link';
import { STATES } from '@/data/states';

const SITE_URL = 'https://www.vcvwebsolutions.com';
const TITLE       = 'Service Areas — Website Design Across All 50 US States · VCV Web Solutions';
const DESCRIPTION = 'We build conversion-focused websites for small businesses in every US state. Pick yours to see industry templates and local-SEO setup tailored to your market.';
const OG_IMAGE    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('SERVICE AREAS')}&title=${encodeURIComponent('All 50 US states')}&subtitle=${encodeURIComponent('Local SEO and conversion-focused sites · Built in 3–7 days')}&accent=%233b82f6`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/serving` },
  openGraph: {
    type: 'website', url: `${SITE_URL}/serving`, siteName: 'VCV Web Solutions',
    title: TITLE, description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions service areas' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const REGIONS = ['Northeast', 'South', 'Midwest', 'West'] as const;

export default function Page() {
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'VCV Web Solutions — US Service Areas',
    numberOfItems: STATES.length,
    itemListElement: STATES.map((s, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `${SITE_URL}/serving/${s.slug}`,
      name: s.name,
    })),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: `${SITE_URL}/serving` },
    ],
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">Service Areas</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-5">
            <span className="text-white">All 50</span> <span className="gradient-text">US states</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            We build conversion-focused websites for small businesses in every state. Pick yours.
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto space-y-12">
          {REGIONS.map(region => (
            <div key={region}>
              <h2 className="font-display text-2xl md:text-4xl text-white tracking-tight mb-5">{region}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {STATES.filter(s => s.region === region).map(s => (
                  <Link key={s.slug} href={`/serving/${s.slug}`}
                    className="group flex items-center justify-between gap-3 p-4 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <span className="text-white font-bold text-sm">{s.name}</span>
                    <span className="text-blue-400/70 text-[10px] uppercase tracking-widest font-bold group-hover:text-blue-400 transition-colors">
                      {s.abbr} →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
