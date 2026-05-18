import type { Metadata } from 'next';
import Link from 'next/link';
import { CITIES } from '@/data/cities';

const SITE_URL = 'https://www.vcvwebsolutions.com';

export const metadata: Metadata = {
  title:       'Cities We Serve — Website Design for Local Businesses · VCV Web Solutions',
  description: `We build conversion-focused websites for small businesses in ${CITIES.length} top US metros. Find your city — see local industries, real launches, and a free design preview offer.`,
  alternates:  { canonical: `${SITE_URL}/cities` },
  openGraph: {
    type: 'website', url: `${SITE_URL}/cities`, siteName: 'VCV Web Solutions',
    title: 'Cities We Serve — Website Design for Local Businesses',
    description: `${CITIES.length} top US metros covered.`,
    images: [{ url: `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('CITIES WE SERVE')}&title=${encodeURIComponent(CITIES.length + ' top US metros')}&subtitle=${encodeURIComponent('Local SEO · Free design preview · From $97/mo')}&accent=%233b82f6`, width: 1200, height: 630, alt: 'Cities We Serve' }],
  },
};

const REGIONS = ['Northeast', 'Midwest', 'South', 'West'] as const;

export default function Page() {
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Cities',       item: `${SITE_URL}/cities` },
    ],
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">Cities we serve</p>
          <h1 className="font-display text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize: 'clamp(2.75rem, 7.5vw, 5.5rem)' }}>
            Websites built for<br/>
            <span className="gradient-text">{CITIES.length} top US metros.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Pick your city to see the industries we&apos;ve launched in your market, plus what makes local search win locally.
          </p>
        </div>
      </section>

      {/* By region */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20 space-y-12">
        {REGIONS.map(region => {
          const inRegion = CITIES.filter(c => c.region === region);
          if (inRegion.length === 0) return null;
          return (
            <div key={region} className="max-w-6xl mx-auto">
              <h2 className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">{region}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {inRegion.map(c => (
                  <Link key={c.slug} href={`/cities/${c.slug}`}
                    className="block p-5 rounded-2xl transition-[background-color,border-color,transform] duration-200 ease-out active:scale-[0.98] hover:-translate-y-0.5"
                    style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-baseline justify-between gap-3 mb-1.5">
                      <p className="text-white font-bold text-lg leading-tight">{c.name}</p>
                      <span className="text-gray-500 text-xs font-mono">{c.abbr}</span>
                    </div>
                    <p className="text-gray-400 text-xs leading-snug line-clamp-2">{c.blurb}</p>
                    <p className="text-blue-400 text-[10px] uppercase tracking-widest font-bold mt-3">
                      {c.topIndustries.join(' · ')}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
