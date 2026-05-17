import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { STATES, findState } from '@/data/states';
import { INDUSTRIES } from '@/data/industries';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

interface PageProps { params: Promise<{ state: string }> }

/* Tells Next.js to statically generate one route per US state at build
   time, so the 50 pages are all instant-load and Google-friendly. */
export function generateStaticParams() {
  return STATES.map(s => ({ state: s.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { state: slug } = await params;
  const data = findState(slug);
  if (!data) return { title: 'State Not Found' };
  const url = `${SITE_URL}/serving/${data.slug}`;
  const title       = `${data.name} Website Design · Lead-Generating Sites for Local Businesses · VCV`;
  const description = `We build conversion-focused websites for ${data.name} (${data.abbr}) businesses — roofers, dentists, HVAC, plumbers, restaurants and more. Live in 3–7 days, from $97/mo. Free design preview, no upfront cost.`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website', url, siteName: 'VCV Web Solutions',
      title, description,
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: `Website design for ${data.name} businesses` }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og-image.png'] },
  };
}

export default async function Page({ params }: PageProps) {
  const { state: slug } = await params;
  const data = findState(slug);
  if (!data) notFound();

  const url = `${SITE_URL}/serving/${data.slug}`;
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',                item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Service Areas',       item: `${SITE_URL}/serving` },
      { '@type': 'ListItem', position: 3, name: data.name,             item: url },
    ],
  };
  const localBusinessLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VCV Web Solutions',
    url,
    description: `Web design and SEO services for ${data.name} small businesses.`,
    areaServed: {
      '@type': 'State',
      name: data.name,
      addressCountry: 'US',
    },
    telephone: '+1-580-919-1386',
  };

  /* Surface 6 popular industry templates with state-name context. */
  const featuredIndustries = INDUSTRIES.slice(0, 6);

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
            Serving · {data.region} · {data.abbr}
          </p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-5">
            Websites for <span className="gradient-text">{data.name}</span><br/>
            <span className="text-white/55">businesses.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl leading-relaxed mb-7">
            {data.blurb}
          </p>
          <p className="text-gray-400 text-base max-w-2xl leading-relaxed mb-8">
            We build conversion-focused websites for {data.name} small businesses across <strong className="text-white">{INDUSTRIES.length} industries</strong> — from roofing and HVAC to dentists, restaurants, and professional services. Live in 3–7 days. Free design preview before you pay anything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/free-demo"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
              Get my free design preview →
            </Link>
            <Link href="/templates"
              className="inline-flex items-center justify-center gap-2 text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] px-7 py-4 rounded-full font-bold text-base transition-colors">
              Browse {INDUSTRIES.length} templates
            </Link>
          </div>
        </div>
      </section>

      {/* Featured industries */}
      <section className="px-4 sm:px-6 lg:px-8 py-12" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight mb-2">
            Popular {data.name} industries
          </h2>
          <p className="text-gray-400 mb-8">Industry-tuned templates with copy, SEO structure, and lead capture built in.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredIndustries.map(ind => (
              <Link key={ind.slug} href={`/templates/${ind.slug}`}
                className="group flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors hover:bg-white/[0.04]"
                style={{ background:'rgba(255,255,255,0.025)', border:`1px solid ${ind.color}30` }}>
                <span className="text-2xl">{ind.emoji}</span>
                <span className="text-white font-bold text-sm text-center leading-tight">{ind.name}</span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-center" style={{ color: ind.color }}>
                  {data.abbr} ready
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/templates" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-sm font-bold">
              See all {INDUSTRIES.length} templates →
            </Link>
          </div>
        </div>
      </section>

      {/* Why a real site matters in {state} */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-5 text-gray-300 text-lg leading-[1.75]">
          <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Why {data.name} businesses lose to better-ranked competitors</h2>
          <p>
            Even in {data.name}, the customer journey starts on Google. Someone types &ldquo;[your service] near me&rdquo; and either clicks one of the top three results — or they don&apos;t click yours. Slow sites, missing schema, broken mobile layouts, and missing Google Business Profile setup all drop you off page one.
          </p>
          <p>
            Our build process fixes all of that on day one: mobile-perfect design, structured data Google can read, instant page-load, lead-capture forms wired to a CRM, and Google Business Profile + analytics installed before launch. You don&apos;t need to know any of this — we just do it.
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
            Free design preview for your {data.name} business
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-7">
            We design it first. You decide if it&apos;s worth paying for.
          </p>
          <Link href="/free-demo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Get my free preview →
          </Link>
        </div>
      </section>

      {/* Other states (internal linking) */}
      <section className="px-4 sm:px-6 lg:px-8 py-12" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Also serving</p>
          <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-6">All 50 US states</h2>
          <div className="flex flex-wrap gap-2">
            {STATES.filter(s => s.slug !== data.slug).map(s => (
              <Link key={s.slug} href={`/serving/${s.slug}`}
                className="text-xs font-semibold px-3 py-1.5 rounded-full text-gray-400 hover:text-white bg-white/[0.025] border border-white/[0.06] hover:border-white/20 hover:bg-white/[0.05] transition-colors">
                {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
