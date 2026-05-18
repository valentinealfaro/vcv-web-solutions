import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CITIES, findCity } from '@/data/cities';
import { INDUSTRIES } from '@/data/industries';
import { STATES, findState } from '@/data/states';

const SITE_URL = 'https://www.vcvwebsolutions.com';

interface PageProps { params: Promise<{ slug: string }> }

/* Pre-render every city at build time. Each one is an indexable SEO
   landing surface — Google can match queries like
   "[service] website design [city]" to a unique page. */
export function generateStaticParams() {
  return CITIES.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const c = findCity(slug);
  if (!c) return { title: 'City Not Found' };
  const url = `${SITE_URL}/cities/${c.slug}`;
  const title       = `${c.name} Website Design · Lead-Generating Sites for ${c.name} Businesses · VCV`;
  const description = `Custom websites for ${c.name}, ${c.abbr} local businesses — built for Google rankings, mobile, and lead capture. Live in 3–7 days. Free design preview, no upfront cost.`;
  const ogImage = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent(`SERVING · ${c.abbr}`)}&title=${encodeURIComponent('Websites for ' + c.name + ' businesses')}&subtitle=${encodeURIComponent(c.topIndustries.join(' · ') + ' · From $97/mo')}&accent=%233b82f6`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, siteName: 'VCV Web Solutions',
      title, description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Website design for ${c.name} businesses` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const c = findCity(slug);
  if (!c) notFound();

  const url = `${SITE_URL}/cities/${c.slug}`;
  const stateSlug = findState(c.state.toLowerCase().replace(/\s+/g, '-'))?.slug;

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',          item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Cities',        item: `${SITE_URL}/cities` },
      { '@type': 'ListItem', position: 3, name: c.name,          item: url },
    ],
  };
  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VCV Web Solutions',
    url,
    description: `Website design and local-SEO services for ${c.name}, ${c.abbr} small businesses.`,
    areaServed: {
      '@type': 'City',
      name: c.name,
      addressRegion: c.abbr,
      addressCountry: 'US',
    },
    telephone: '+1-580-919-1386',
  };

  /* Match top industries to actual INDUSTRY data when names align — so
     each callout links to a real template page. Falls back to /templates
     when no exact match. */
  const featured = c.topIndustries
    .map(label => INDUSTRIES.find(i =>
      i.name.toLowerCase().includes(label.toLowerCase().split(' ')[0]) ||
      label.toLowerCase().includes(i.name.toLowerCase().split(' ')[0])
    ))
    .filter((i): i is typeof INDUSTRIES[number] => Boolean(i));

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessLd) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">
            <Link href="/cities" className="hover:text-blue-300">Cities</Link>
            <span className="mx-2 text-gray-700">·</span>
            <Link href={stateSlug ? `/serving/${stateSlug}` : '/serving'} className="hover:text-blue-300">{c.state}</Link>
            <span className="mx-2 text-gray-700">·</span>
            Metro pop. {c.pop}
          </p>
          <h1 className="font-display text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5.25rem)' }}>
            Websites for <span className="gradient-text">{c.name}</span><br/>
            <span className="text-white/55">businesses.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-6">
            {c.blurb}
          </p>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed mb-8">
            We build conversion-focused websites for {c.name}, {c.abbr} small businesses across <strong className="text-white">{INDUSTRIES.length} industries</strong> — designed for Google Map Pack rankings, mobile speed, and turning visitors into phone calls. Live in 3–7 days. Free design preview before you pay anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/free-demo"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-full font-bold text-base transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
              Get my free {c.name} design preview →
            </Link>
            <Link href="/templates"
              className="inline-flex items-center justify-center gap-2 text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] px-7 py-4 rounded-full font-bold text-base transition-[border-color,background-color] duration-200 ease-out">
              Browse {INDUSTRIES.length} templates
            </Link>
          </div>
        </div>
      </section>

      {/* Top industries in this metro */}
      {featured.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-12" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-6xl mx-auto">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Hot in {c.name}</p>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">Top industries we build for in {c.name}</h2>
            <p className="text-gray-400 mb-8">These industries have the strongest local-search demand in {c.name}, {c.abbr}.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {featured.map(ind => (
                <Link key={ind.slug} href={`/templates/${ind.slug}`}
                  className="block p-5 rounded-2xl transition-[background-color,border-color,transform] duration-200 ease-out hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${ind.color}30` }}>
                  <span className="text-3xl mb-2 block">{ind.emoji}</span>
                  <p className="text-white font-bold text-base leading-tight mb-1">{ind.name}</p>
                  <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: ind.color }}>
                    {c.abbr} ready
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why local SEO matters in this city */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-5 text-gray-300 text-lg leading-[1.75]">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Why ranking in {c.name} is the whole game</h2>
          <p>
            In {c.name}, {c.abbr}, the customer journey starts in the same place every time: someone pulls out their phone and types &ldquo;[service] near me&rdquo;. Three businesses show up in the Map Pack. The other 47 fight for the scraps below.
          </p>
          <p>
            Getting into that Map Pack is 80% about your Google Business Profile and 20% about your website. We set up both at launch: complete profile with city-specific service areas, schema markup that tells Google exactly what you do and where you do it, mobile-first design that loads in under two seconds, and conversion-tuned forms that capture leads while interest is hot.
          </p>
          <p>
            And we build the design preview <strong className="text-white">before you pay anything.</strong> See it, approve it, then we launch.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Free design preview for your {c.name} business
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-7">
            We design it first. You decide if it&apos;s worth paying for.
          </p>
          <Link href="/free-demo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Get my free preview →
          </Link>
        </div>
      </section>

      {/* Other cities in region */}
      <section className="px-4 sm:px-6 lg:px-8 py-12" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Also serving</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-6">Other {c.region} cities</h2>
          <div className="flex flex-wrap gap-2">
            {CITIES.filter(o => o.region === c.region && o.slug !== c.slug).map(o => (
              <Link key={o.slug} href={`/cities/${o.slug}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full text-gray-400 hover:text-white bg-white/[0.025] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-[color,background-color,border-color] duration-200">
                {o.name}, {o.abbr}
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/cities" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-bold">
              See all {CITIES.length} cities →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
