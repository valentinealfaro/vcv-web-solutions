import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';
const TITLE       = 'About VCV Web Solutions — Lead-Generating Websites for Local Businesses';
const DESCRIPTION = 'We build conversion-focused websites in 3–7 days for local service businesses. No bloated CMS, no upfront cost, no platform lock-in. Designed by people who actually run small businesses.';
const OG_IMAGE    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('ABOUT VCV')}&title=${encodeURIComponent('Websites that earn their keep')}&subtitle=${encodeURIComponent('Speed beats perfection · You own everything · See it before you pay')}&accent=%233b82f6`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/about`,
    siteName: 'VCV Web Solutions',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'About VCV Web Solutions' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const BELIEFS = [
  { t: 'Speed beats perfection',
    d: 'A live site shipping in 5 days that drives 3 leads a week beats a perfect site that takes 4 months. We optimize for time-to-first-call.' },
  { t: 'Owners should own their site',
    d: 'No platform lock-in. You own the domain, the code, the content. Walk away whenever you want and take it with you.' },
  { t: 'See it before you pay for it',
    d: 'We build the design preview first — at no cost. You only commit if the work looks right. Skin in the game on our side, not yours.' },
  { t: 'A website is a tool, not a trophy',
    d: 'Pretty doesn\'t pay the bills. We measure success in calls booked, forms filled, and revenue attributed — not awards.' },
];

const WHO_FOR = [
  'Local service businesses with $50k–$5M in annual revenue',
  'Owners who answer their own phone and want it to ring more',
  'Trades, restaurants, salons, healthcare, professional services',
  'Anyone whose current website is older than 5 years or doesn\'t exist',
];

const WHO_NOT_FOR = [
  'Pre-revenue startups looking for a pitch deck site',
  'Enterprise marketing teams with internal designers',
  'Companies who need a 50-page marketing site with custom CMS',
  'Anyone unwilling to share what their actual business does',
];

export default function Page() {
  /* AboutPage + Organization schema — gives Google a structured "what is this
     company" record that AI Overviews can cite for branded queries. */
  const aboutLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About VCV Web Solutions',
    url: `${SITE_URL}/about`,
    description: DESCRIPTION,
    mainEntity: {
      '@type': 'Organization',
      name: 'VCV Web Solutions',
      url: SITE_URL,
      description: DESCRIPTION,
      foundingDate: '2024',
      areaServed: { '@type': 'Country', name: 'United States' },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-580-919-1386',
        contactType: 'customer support',
        availableLanguage: ['English'],
      },
    },
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',  item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
    ],
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">About</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-6">
            We build websites that <span className="gradient-text">earn their keep.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Not the prettiest sites on the internet — the ones that book the most jobs.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto space-y-6 text-gray-300 text-lg leading-[1.75]">
          <p>
            VCV Web Solutions exists because the gap between &ldquo;agency website&rdquo; and &ldquo;a roofer&apos;s phone ringing&rdquo; is enormous, and almost nobody bridges it well for small local businesses.
          </p>
          <p>
            On one side: $15,000 agency builds that take 4 months and look like a tech startup. On the other: $40/mo template sites that look like 2007 and rank for nothing. Neither helps the person who actually has to answer the phone Monday morning.
          </p>
          <p>
            We pick the middle. Real custom design, mobile-perfect, SEO-built, lead-tracking installed — but launched in <strong className="text-white">3–7 days</strong> and priced where a contractor can actually say yes. <strong className="text-white">$97 a month</strong> for a real lead engine, or <strong className="text-white">$1,497 once</strong> if you&apos;d rather own it forever.
          </p>
          <p>
            We don&apos;t take payment until you see the design. If we don&apos;t deliver leads in 30 days, we keep working free until we do.
          </p>
        </div>
      </section>

      {/* What we believe */}
      <section className="px-4 sm:px-6 lg:px-8 py-16" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">What we believe</p>
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight">Four things we won&apos;t compromise on</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BELIEFS.map((b, i) => (
              <div key={i} className="p-7 rounded-2xl"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-blue-500/40 font-display text-3xl tracking-tight mb-3">0{i + 1}</p>
                <h3 className="text-white font-bold text-xl mb-2 tracking-tight">{b.t}</h3>
                <p className="text-gray-400 leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we work with / not for */}
      <section className="px-4 sm:px-6 lg:px-8 py-16" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
          <div className="p-7 rounded-2xl"
            style={{ background:'rgba(34,197,94,0.04)', border:'1px solid rgba(34,197,94,0.25)' }}>
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Built for</p>
            <h3 className="text-white font-bold text-xl mb-4 tracking-tight">Who we work with</h3>
            <ul className="space-y-2.5">
              {WHO_FOR.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm leading-relaxed">
                  <span className="text-green-400 mt-1 flex-shrink-0">✓</span>{w}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-7 rounded-2xl"
            style={{ background:'rgba(239,68,68,0.04)', border:'1px solid rgba(239,68,68,0.20)' }}>
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Not for</p>
            <h3 className="text-white font-bold text-xl mb-4 tracking-tight">When we&apos;re not the right fit</h3>
            <ul className="space-y-2.5">
              {WHO_NOT_FOR.map((w, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-400 text-sm leading-relaxed">
                  <span className="text-red-400/70 mt-1 flex-shrink-0">✗</span>{w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Think we might fit?
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-7">
            One short conversation, then a free custom design preview within 48 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/free-demo"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
              Get my free preview →
            </Link>
            <Link href="/how-it-works"
              className="inline-flex items-center justify-center gap-2 text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] px-8 py-4 rounded-full font-bold text-base transition-colors">
              See the process
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
