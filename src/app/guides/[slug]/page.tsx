import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GUIDES, findGuide } from '@/data/guides';

const SITE_URL = 'https://www.vcvwebsolutions.com';

interface PageProps { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GUIDES.map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) return { title: 'Guide Not Found' };
  const url = `${SITE_URL}/guides/${g.slug}`;
  const ogImage = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent(`GUIDE · ${g.category.toUpperCase()}`)}&title=${encodeURIComponent(g.title)}&subtitle=${encodeURIComponent(g.readingTime + ' · Practical advice for small business owners')}&accent=%233b82f6`;
  return {
    title:       `${g.title} · VCV Web Solutions Guides`,
    description: g.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      siteName: 'VCV Web Solutions',
      title: g.title,
      description: g.description,
      publishedTime: g.publishedAt,
      modifiedTime:  g.updatedAt,
      authors: ['VCV Web Solutions'],
      images: [{ url: ogImage, width: 1200, height: 630, alt: g.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: g.title,
      description: g.description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const g = findGuide(slug);
  if (!g) notFound();
  const url = `${SITE_URL}/guides/${g.slug}`;

  const articleImage = `${SITE_URL}/api/og?eyebrow=${encodeURIComponent(`GUIDE · ${g.category.toUpperCase()}`)}&title=${encodeURIComponent(g.title)}&subtitle=${encodeURIComponent(g.readingTime + ' · Practical advice for small business owners')}&accent=%233b82f6`;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline:     g.title,
    description:  g.description,
    image:        articleImage,
    datePublished: g.publishedAt,
    dateModified:  g.updatedAt,
    author:    { '@type': 'Organization', name: 'VCV Web Solutions', url: SITE_URL },
    publisher: { '@type': 'Organization', name: 'VCV Web Solutions', url: SITE_URL,
                 logo: { '@type': 'ImageObject', url: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    articleSection: g.category,
    wordCount: g.sections.reduce((s, sec) => s + sec.paragraphs.join(' ').split(/\s+/).length, 0),
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',   item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Guides', item: `${SITE_URL}/guides` },
      { '@type': 'ListItem', position: 3, name: g.title,  item: url },
    ],
  };

  const otherGuides = GUIDES.filter(o => o.slug !== g.slug).slice(0, 2);

  return (
    <div className="bg-[#030712] min-h-screen text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      {/* Hero */}
      <article className="pt-28 pb-16">
        <header className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <Link href="/guides" className="inline-flex items-center text-blue-400 hover:text-blue-300 text-sm mb-6">
            ← All guides
          </Link>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/25">
              {g.category}
            </span>
            <span className="text-gray-500 text-xs">{g.readingTime}</span>
            <span className="text-gray-600 text-xs">·</span>
            <time className="text-gray-500 text-xs" dateTime={g.updatedAt}>
              Updated {new Date(g.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </time>
          </div>
          <h1 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-[1.05] mb-6">
            {g.title}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">{g.description}</p>
        </header>

        {/* Key takeaways */}
        <aside className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="p-6 rounded-2xl"
            style={{ background:'rgba(59,130,246,0.06)', border:'1px solid rgba(59,130,246,0.25)' }}>
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Key takeaways</p>
            <ul className="space-y-2.5">
              {g.takeaways.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-200 leading-relaxed">
                  <span className="text-blue-400 font-bold flex-shrink-0">•</span>{t}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Body */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 text-gray-300">
          {g.sections.map((s, i) => (
            <section key={i}>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-tight mb-4">{s.heading}</h2>
              {s.paragraphs.map((p, j) => (
                <p key={j} className="text-lg leading-[1.75] mb-4">{p}</p>
              ))}
            </section>
          ))}
        </div>
      </article>

      {/* Inline CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto rounded-3xl p-8 md:p-10 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h3 className="font-display text-2xl md:text-3xl text-white tracking-tight mb-3">Want us to build this for you?</h3>
          <p className="text-gray-300 mb-6">Free custom design preview within 48 hours. No credit card needed.</p>
          <Link href="/free-demo"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Get my free design preview →
          </Link>
        </div>
      </section>

      {/* Other guides */}
      <section className="px-4 sm:px-6 lg:px-8 py-12" style={{ borderTop:'1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h3 className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">More guides</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {otherGuides.map(o => (
              <Link key={o.slug} href={`/guides/${o.slug}`}
                className="block p-5 rounded-2xl transition-colors"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-2">{o.category}</p>
                <p className="text-white font-bold text-lg leading-tight mb-2">{o.title}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{o.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
