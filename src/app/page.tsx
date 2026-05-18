import Script from 'next/script';
import HomeClient from './HomeClient';

const SITE_URL = 'https://www.vcvwebsolutions.com';

const HOME_FAQ = [
  { q: 'How much does a website cost?',
    a: 'Monthly plans start at $97/mo. Annual is $997/yr (save $173). Lifetime is $1,497 one-time, no recurring fees. Setup is $247, waived on annual and lifetime plans.' },
  { q: 'How long does it take to build my site?',
    a: 'Most sites launch in 3–7 days from approval. We build a free design preview within 48 hours of your request — you only commit if you like what you see.' },
  { q: 'Do I really get a free demo before paying?',
    a: 'Yes. We build a custom mockup of your site first. No credit card needed. No commitment. You see exactly what you\'re getting before any money changes hands.' },
  { q: 'What if I don\'t get any leads?',
    a: 'Every site comes with a 30-day results guarantee. If it isn\'t generating leads after 30 days, we optimize it at no extra cost until it does.' },
  { q: 'Do I own the website?',
    a: '100%. Your domain, your code, your content. No platform lock-in. You can leave any time and take everything with you.' },
  { q: 'Can you handle SEO and ads?',
    a: 'Yes — every site is SEO-optimized from launch, including Google Business Profile setup. We also manage Google Ads + Meta Ads on Annual and Lifetime plans.' },
];

export default function Page() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HOME_FAQ.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }],
  };

  return (
    <>
      <Script id="ld-home-faq" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faqLd)}
      </Script>
      <Script id="ld-home-breadcrumb" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumbLd)}
      </Script>
      <HomeClient />
    </>
  );
}
