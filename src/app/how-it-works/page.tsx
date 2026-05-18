import type { Metadata } from 'next';
import Link from 'next/link';

const SITE_URL = 'https://www.vcvwebsolutions.com';
const TITLE       = 'How It Works — From Inquiry to Live Site in 3–7 Days · VCV Web Solutions';
const DESCRIPTION = 'See the exact 7-step process: free design preview, approval, build, launch, SEO setup, lead-tracking install, and 30-day results review. No upfront cost.';
const OG_IMAGE    = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent('HOW IT WORKS')}&title=${encodeURIComponent('Inquiry to live site in 7 days')}&subtitle=${encodeURIComponent('Seven steps · No upfront cost · You approve before payment')}&accent=%2306b6d4`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/how-it-works` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/how-it-works`,
    siteName: 'VCV Web Solutions',
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'How VCV Web Solutions builds your site' }],
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
};

const STEPS = [
  { n: '01', t: 'You reach out',
    desc: 'Fill the form, call (580) 919-1386, or text. Takes 60 seconds. Tell us your business, services, and rough idea of what you want.' },
  { n: '02', t: 'We learn your business',
    desc: 'Short discovery — no boilerplate. We look at your current site (if any), your competitors, what local search looks like for your category, and where leads currently fall through.' },
  { n: '03', t: 'We build a free design preview',
    desc: 'Within 48 hours we send you a live custom mockup — actual homepage, your colors, your photos if you have them, your copy direction. No payment required to see it.' },
  { n: '04', t: 'You approve or request changes',
    desc: 'You give feedback. We iterate. The preview is yours regardless of whether you move forward. Most clients approve after one revision round.' },
  { n: '05', t: 'We launch in 3–7 days',
    desc: 'On approval we connect your domain (or register one), set up hosting + SSL, build the inner pages, install Google Business Profile + analytics, and ship the live site.' },
  { n: '06', t: 'We install lead tracking',
    desc: 'Every form, call link, and click-to-text is wired so you can see exactly which channels produce leads. UTM tracking lets you measure cost-per-lead per campaign.' },
  { n: '07', t: '30-day results check-in',
    desc: 'After 30 days we review the analytics with you. If the site is not generating leads we optimize at no extra charge until it does. Then we keep maintaining it month over month.' },
];

const FAQS = [
  { q: 'Do I have to pay before I see anything?', a: 'No. The first design preview is built before any payment. You only commit if you like what we show you.' },
  { q: 'What if I do not have logos or photos?',  a: 'We can use stock-quality imagery and a clean type-driven design until you have your own assets. You can swap them in any time.' },
  { q: 'How long does it actually take?',         a: 'Most local-business sites launch in 3–7 days from approval. Larger sites (e-commerce, multi-location, custom integrations) take longer and are quoted separately.' },
  { q: 'Can I cancel later?',                     a: 'Yes. Monthly plans are month-to-month. Annual plans are paid up front. Lifetime plans are one-time. You own your domain and content either way.' },
];

export default function Page() {
  /* HowTo schema — Google can render this as a step-by-step rich result */
  const howToLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How VCV Web Solutions builds your website in 3–7 days',
    description: DESCRIPTION,
    totalTime: 'P7D',
    estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '97' },
    step: STEPS.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.t,
      text: s.desc,
    })),
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',         item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'How It Works', item: `${SITE_URL}/how-it-works` },
    ],
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.10) 0%, transparent 70%)' }}/>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">How It Works</p>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tight leading-[1.02] mb-5">
            From inquiry to <span className="gradient-text">live site in 7 days</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Seven steps. No upfront cost. You see the design first, approve, then we launch.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <ol className="max-w-4xl mx-auto space-y-3">
          {STEPS.map((s, i) => (
            <li key={s.n}
              className="relative grid grid-cols-[auto,1fr] gap-5 md:gap-8 p-7 md:p-9 rounded-2xl"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-blue-500/40 font-display text-4xl md:text-6xl font-extrabold leading-none tracking-tight">
                {s.n}
              </div>
              <div>
                <h2 className="text-white font-extrabold text-xl md:text-2xl mb-2 tracking-tight">{s.t}</h2>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <span aria-hidden="true"
                  className="absolute left-7 md:left-9 -bottom-3 w-px h-3 bg-gradient-to-b from-blue-500/40 to-transparent" />
              )}
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="px-4 sm:px-6 lg:px-8 py-16" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4 text-center">Quick answers</p>
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-extrabold text-center mb-10">Common questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <details key={i} className="group rounded-2xl"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <summary className="cursor-pointer list-none px-6 py-5 flex items-center justify-between gap-4">
                  <span className="text-white font-bold text-base md:text-lg">{f.q}</span>
                  <span className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 bg-white/[0.06] group-open:rotate-45 transition-transform">
                    <span className="text-white text-xl leading-none -mt-px">+</span>
                  </span>
                </summary>
                <p className="px-6 pb-6 text-gray-300 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Ready for step 01?
          </h2>
          <p className="text-gray-300 text-base md:text-lg mb-7">
            Free custom design preview in 48 hours. No credit card. No commitment.
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
