'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Search, Monitor, Smartphone, CheckCircle2, ExternalLink } from 'lucide-react';
import type { IndustryData } from '@/data/industries';

/* Industry → category map. Anything not listed falls into "Local Services". */
const CATEGORY_OVERRIDES: Record<string, string> = {
  roofers: 'Home Services', hvac: 'Home Services', plumbers: 'Home Services',
  electricians: 'Home Services', contractors: 'Home Services',
  landscapers: 'Home Services', 'pest-control': 'Home Services',
  'tree-services': 'Home Services', painters: 'Home Services',
  'pool-services': 'Home Services', 'garage-doors': 'Home Services',
  locksmiths: 'Home Services', 'junk-removal': 'Home Services',
  movers: 'Home Services', cleaning: 'Home Services',
  'carpet-cleaning': 'Home Services', 'commercial-cleaning': 'Home Services',
  solar: 'Home Services', 'auto-repair': 'Home Services',

  lawyers: 'Professional Services', 'tax-prep': 'Professional Services',
  photographers: 'Professional Services', 'real-estate': 'Professional Services',

  dentists: 'Health & Wellness', vets: 'Health & Wellness',
  chiropractors: 'Health & Wellness', therapists: 'Health & Wellness',
  'med-spa': 'Health & Wellness', salons: 'Health & Wellness',

  restaurants: 'Food & Hospitality', 'wedding-venues': 'Food & Hospitality',
  daycare: 'Family & Education', tutors: 'Family & Education',
  gyms: 'Family & Education',
};
const categoryOf = (slug: string) => CATEGORY_OVERRIDES[slug] ?? 'Local Services';

const CATEGORIES = ['All', 'Home Services', 'Professional Services', 'Health & Wellness', 'Food & Hospitality', 'Family & Education'];

type ViewMode = 'desktop' | 'mobile';

/* ─── Browser frame mockup — used in desktop preview ─── */
function DesktopFrame({ ind }: { ind: IndustryData }) {
  return (
    <div className="relative aspect-[16/10] rounded-xl overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${ind.color}22, ${ind.color}06)`,
               border: `1px solid ${ind.color}44` }}>
      <div className="absolute top-0 inset-x-0 h-6 flex items-center gap-1.5 px-3"
        style={{ background: 'rgba(0,0,0,0.6)', borderBottom: `1px solid ${ind.color}28` }}>
        <span className="w-2 h-2 rounded-full bg-red-500/70" />
        <span className="w-2 h-2 rounded-full bg-yellow-500/70" />
        <span className="w-2 h-2 rounded-full bg-green-500/70" />
        <span className="ml-2 text-[8px] text-gray-400 font-mono truncate">{ind.slug}-pros.com</span>
      </div>
      <div className="absolute inset-x-0 top-6 bottom-0 flex flex-col items-center justify-center text-center px-3">
        <span className="text-2xl mb-1">{ind.emoji}</span>
        <span className="inline-block text-[8px] font-bold tracking-widest px-1.5 py-0.5 rounded mb-1.5"
          style={{ background:`${ind.color}28`, color: ind.color }}>
          {ind.heroEyebrow}
        </span>
        <div className="text-white font-extrabold text-sm md:text-base leading-tight mb-1.5 tracking-tight">
          {ind.heroHeadline.split('\n').map((l, i) => (
            <span key={i} className="block" style={i === 1 ? { color: ind.color } : undefined}>{l}</span>
          ))}
        </div>
        <span className="text-[8px] font-bold px-2 py-1 rounded text-white"
          style={{ background: ind.color }}>Get a quote</span>
        <div className="mt-2 grid grid-cols-3 gap-1 w-full px-2">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-1 rounded" style={{ background: `${ind.color}${i === 1 ? '44' : '22'}` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Phone frame mockup — used in mobile preview ─── */
function MobileFrame({ ind }: { ind: IndustryData }) {
  return (
    <div className="relative mx-auto rounded-[18px] overflow-hidden"
      style={{ width: '52%', aspectRatio: '9 / 19',
               background: `linear-gradient(180deg, ${ind.color}22, ${ind.color}06)`,
               border: `2px solid #1c1c1c`,
               boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 0 4px #0a0a0a inset` }}>
      <div className="absolute top-0 inset-x-0 h-5 flex items-center justify-center"
        style={{ background: '#000' }}>
        <div className="w-14 h-1 rounded-full bg-gray-700" />
      </div>
      <div className="absolute inset-x-0 top-5 bottom-3 flex flex-col items-center justify-center text-center px-3">
        <span className="text-3xl mb-2">{ind.emoji}</span>
        <span className="inline-block text-[7px] font-bold tracking-widest px-1.5 py-0.5 rounded mb-2"
          style={{ background:`${ind.color}28`, color: ind.color }}>
          {ind.heroEyebrow}
        </span>
        <div className="text-white font-extrabold text-xs leading-tight mb-2 tracking-tight">
          {ind.heroHeadline.split('\n').map((l, i) => (
            <span key={i} className="block" style={i === 1 ? { color: ind.color } : undefined}>{l}</span>
          ))}
        </div>
        <span className="text-[7px] font-bold px-2 py-1 rounded text-white"
          style={{ background: ind.color }}>Get a quote</span>
      </div>
    </div>
  );
}

export default function TemplatesGallery({ industries }: { industries: IndustryData[] }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('All');
  const [view, setView] = useState<ViewMode>('desktop');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return industries.filter(i => {
      const matchesQ = !q || i.name.toLowerCase().includes(q) || i.pluralLabel.toLowerCase().includes(q) || i.slug.includes(q);
      const matchesC = category === 'All' || categoryOf(i.slug) === category;
      return matchesQ && matchesC;
    });
  }, [industries, query, category]);

  return (
    <div className="bg-[#030712] min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.18) 0%, transparent 70%)' }}/>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <span className="inline-block text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-5">Our work · Template gallery</span>
          <h1 className="font-display text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize: 'clamp(2.75rem, 7.5vw, 5.5rem)' }}>
            34 live websites,<br/>
            <span className="gradient-text">one for every industry.</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Real working demos we&apos;ve built for local businesses. Pick yours, we customize it, launch in 3–7 days. Conversion-ready, SEO-built, mobile-perfect.
          </p>
          <div className="inline-flex items-center gap-2 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Live demos</span>
            <span className="text-gray-700">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Free customization</span>
            <span className="text-gray-700">·</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-blue-500" /> From $97/mo</span>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="sticky top-16 z-40 px-4 sm:px-6 lg:px-8 py-3 backdrop-blur-xl"
        style={{ background: 'rgba(3,7,18,0.85)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search industries (e.g. roof, dental, salon)…"
              className="w-full pl-10 pr-3 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.08] transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto -mx-1 px-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold transition-[background-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.96] ${
                  category === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white border border-white/10'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {/* Desktop / Mobile toggle */}
          <div className="flex items-center gap-1 rounded-full p-1"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <button onClick={() => setView('desktop')}
              aria-label="Desktop preview"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                view === 'desktop' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}>
              <Monitor className="w-3.5 h-3.5"/> Desktop
            </button>
            <button onClick={() => setView('mobile')}
              aria-label="Mobile preview"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                view === 'mobile' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
              }`}>
              <Smartphone className="w-3.5 h-3.5"/> Mobile
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 text-sm mb-6">
            Showing <span className="text-white font-bold">{filtered.length}</span> of {industries.length} templates
          </p>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-block p-5 rounded-full bg-white/[0.04] border border-white/10 mb-5">
                <Search className="w-7 h-7 text-gray-500" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">No templates match that search</h3>
              <p className="text-gray-400 mb-5">We build custom for any industry — request a quote.</p>
              <Link href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-bold text-sm transition-[background-color,transform] duration-200 ease-out active:scale-[0.97]">
                Request a custom template <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`${view}-${category}-${filtered.length}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((ind, i) => (
                  <motion.div key={ind.slug}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i, 12) * 0.03, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}>
                    <Link href={`/templates/${ind.slug}`}
                      className="group block rounded-2xl overflow-hidden p-3 transition-transform duration-200 ease-out hover:-translate-y-1 active:scale-[0.98] active:translate-y-0"
                      style={{
                        background:'rgba(5,12,22,0.97)',
                        border:`1px solid ${ind.color}30`,
                        boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${ind.color}10`,
                      }}>
                      {view === 'desktop' ? <DesktopFrame ind={ind}/> : (
                        <div className="aspect-[16/10] flex items-center justify-center py-3">
                          <MobileFrame ind={ind}/>
                        </div>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl flex-shrink-0">{ind.emoji}</span>
                            <h3 className="text-white font-bold text-base leading-tight truncate">{ind.name}</h3>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0"
                            style={{ background:`${ind.color}18`, color: ind.color, border:`1px solid ${ind.color}40` }}>
                            {categoryOf(ind.slug).replace(' &', '')}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs leading-snug mb-3 line-clamp-2 min-h-[28px]">
                          {ind.heroSubhead.split('.').slice(0, 1).join('.') + '.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold group-hover:gap-2 transition-[gap] duration-200 ease-out"
                            style={{ color: ind.color }}>
                            View live demo <ExternalLink className="w-3 h-3"/>
                          </span>
                          <span className="text-[10px] text-gray-500 font-mono">from $97/mo</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto rounded-3xl p-10 md:p-14 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.10), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.25)' }}>
          <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
            Don&apos;t see your industry?
          </h2>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto mb-8">
            We build custom for anyone. Tell us about your business and we&apos;ll send you a free custom demo within 3 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/free-demo"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-[background-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
              Get my free design preview <ArrowRight className="w-5 h-5"/>
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center justify-center gap-2 text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] px-8 py-4 rounded-full font-bold text-base transition-colors">
              See pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
