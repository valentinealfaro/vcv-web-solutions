import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.vcvwebsolutions.com';
const TITLE       = 'Client Reviews — 4.9 / 5 from 50+ Local Businesses · VCV Web Solutions';
const DESCRIPTION = 'Real reviews from real businesses we have launched. Roofers, dentists, HVAC, plumbers — see what they say about our 3–7 day launches and lead-generating sites.';
const OG_IMAGE    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('★★★★★ · 4.9 / 5')}&title=${encodeURIComponent('Trusted by 50+ local businesses')}&subtitle=${encodeURIComponent('Roofers · Dentists · HVAC · Plumbers · Real reviews from real owners')}&accent=%23eab308`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/reviews` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/reviews`,
    siteName: 'VCV Web Solutions',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'VCV Web Solutions Reviews' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const REVIEWS = [
  { name: 'Mike R.',   role: 'Owner · Tulsa Roofing Co.',     industry: 'Roofing',     rating: 5, quote: 'A storm rolled through Tuesday night and the new site caught 14 calls our voicemail would have lost. Booked 3 re-roofs that week — paid for the year.' },
  { name: 'Sarah H.',  role: 'Owner · Sparkle Cleaning',      industry: 'Cleaning',    rating: 5, quote: 'Looks like a $20k website. Cost me a fraction of that. Best money I have spent on my business — period.' },
  { name: 'David L.',  role: 'GM · Cool Air HVAC',            industry: 'HVAC',        rating: 5, quote: 'Our old site got 2 leads a month. The new one got 18 in the first 30 days. Maintenance-plan attach rate went from 8% to 31%.' },
  { name: 'James T.',  role: 'Anchor Plumbing & Drain',       industry: 'Plumbing',    rating: 5, quote: 'Launched in 5 days. We are #1 on Google for "plumber Lawton" within a month. Phone hasn\'t stopped ringing.' },
  { name: 'Lisa A.',   role: 'Manager · BrightSmile Dental',  industry: 'Dental',      rating: 5, quote: 'New patient form submissions tripled. Front desk used to spend 30 minutes per call — now most info comes pre-filled.' },
  { name: 'Rob M.',    role: 'Founder · TimberGuard Trees',   industry: 'Tree Service',rating: 5, quote: 'After hurricane season last year we couldn\'t answer half the calls. With the new site + Nova answering, every single lead got captured.' },
  { name: 'Jen P.',    role: 'Owner · Studio J Salon',        industry: 'Salons',      rating: 5, quote: 'Online booking finally works. My chair is full a week ahead and I never have to call anyone back to confirm.' },
  { name: 'Carlos V.', role: 'Owner · Carlos Auto Repair',    industry: 'Auto',        rating: 5, quote: 'Trust matters in this business. Customers say the new website made them feel like we\'re a legit shop — first-time appointments up 55%.' },
  { name: 'Megan K.',  role: 'Director · Lawton Med Spa',     industry: 'Med Spa',     rating: 5, quote: 'Before/after gallery on the new site sells consultations before they even pick up the phone. Conversion rate doubled.' },
];

export default function Page() {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'VCV Web Solutions',
    url: SITE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: REVIEWS.length.toString(),
      bestRating: '5',
      worstRating: '1',
    },
    review: REVIEWS.map(r => ({
      '@type': 'Review',
      author:        { '@type': 'Person', name: r.name },
      reviewRating:  { '@type': 'Rating', ratingValue: r.rating.toString(), bestRating: '5', worstRating: '1' },
      reviewBody:    r.quote,
      itemReviewed:  { '@type': 'Service', name: `${r.industry} website by VCV Web Solutions` },
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',    item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Reviews', item: `${SITE_URL}/reviews` },
    ],
  };

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(234,179,8,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">Client Reviews</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-5">
            <span className="text-white">{avgRating} / 5</span>
            <span className="block text-yellow-400/80 text-2xl md:text-3xl font-normal mt-3">from {REVIEWS.length} local businesses</span>
          </h1>
          <div className="inline-flex items-center gap-1 mb-5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-7 h-7 fill-current text-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 15l-5.6 3.2L5.8 11.9 1 7.5l6.4-.6L10 1z"/>
              </svg>
            ))}
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Roofers, dentists, HVAC, plumbers and more — here&apos;s what business owners say after their site launched.
          </p>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REVIEWS.map((r, i) => (
            <article key={i}
              className="p-6 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(r.rating)].map((_, j) => (
                  <svg key={j} className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 15l-5.6 3.2L5.8 11.9 1 7.5l6.4-.6L10 1z"/>
                  </svg>
                ))}
                <span className="ml-2 text-[10px] uppercase tracking-widest text-yellow-400/80 font-bold">{r.industry}</span>
              </div>
              <p className="text-gray-100 text-base leading-relaxed mb-5">&ldquo;{r.quote}&rdquo;</p>
              <p className="text-white font-bold text-sm leading-tight">{r.name}</p>
              <p className="text-gray-500 text-xs">{r.role}</p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Want your business here next?
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-7">
            Free custom design preview within 48 hours. No credit card needed.
          </p>
          <Link href="/free-demo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Get my free design preview →
          </Link>
        </div>
      </section>
    </div>
  );
}
