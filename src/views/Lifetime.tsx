'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import {
  CheckCircle2, ArrowRight, Shield, Infinity as InfinityIcon,
  Zap, Loader2, Sparkles, Clock, Award, Lock, TrendingDown,
} from 'lucide-react';
import { CheckoutUpsellModal, CheckoutPayload } from '@/components/CheckoutUpsellModal';

/* ── Lifetime offer config — one place to change pricing ── */
const LIFETIME_PRICE        = 1497;
const LIFETIME_PRICE_CENTS  = 149700;
const LIFETIME_ORIG_PRICE   = 2997;
const SETUP_FEE_VALUE       = 247;          // waived — shown as savings

/* ── Cost comparison data (drives the math section) ── */
const COMPARISONS = [
  {
    name: 'Wix / Squarespace',
    monthly: 30,
    setupFee: 0,
    note: 'DIY builder — you do the work',
    color: '#9ca3af',
  },
  {
    name: 'Typical Web Agency',
    monthly: 197,
    setupFee: 1500,
    note: 'Monthly fees + setup',
    color: '#f97316',
  },
  {
    name: 'VCV Lifetime',
    monthly: 0,
    setupFee: LIFETIME_PRICE,
    note: 'One price. Forever.',
    color: '#3b82f6',
    highlight: true,
  },
];

/* ── Template gallery — replace `image` URLs with real screenshots ──
   The structure is data-driven so you can swap visuals without touching
   the page layout. Use 16:10 ratio screenshots for best results. ── */
interface Template {
  slug:    string;
  name:    string;
  emoji:   string;
  color:   string;
  /** Replace with a real screenshot URL — placeholder gradient is used when null */
  image:   string | null;
  tagline: string;
  /** When true, card links to /templates/{slug} — set when the template page exists */
  live?:   boolean;
}

const TEMPLATES: Template[] = [
  { slug:'roofers',       name:'Roofers',        emoji:'🏠', color:'#dc2626', image:null, tagline:'Storm-season ready · Insurance claim experts', live:true },
  { slug:'hvac',          name:'HVAC',           emoji:'❄️', color:'#06b6d4', image:null, tagline:'24/7 emergency booking', live:true },
  { slug:'plumbers',      name:'Plumbers',       emoji:'🔧', color:'#0ea5e9', image:null, tagline:'Same-day call capture', live:true },
  { slug:'electricians',  name:'Electricians',   emoji:'⚡', color:'#eab308', image:null, tagline:'Licensed-pro authority', live:true },
  { slug:'landscapers',   name:'Landscapers',    emoji:'🌿', color:'#22c55e', image:null, tagline:'Seasonal quote flow', live:true },
  { slug:'dentists',      name:'Dentists',       emoji:'🦷', color:'#14b8a6', image:null, tagline:'Insurance + booking built-in', live:true },
  { slug:'auto-repair',   name:'Auto Repair',    emoji:'🚗', color:'#dc2626', image:null, tagline:'Quote-by-photo intake', live:true },
  { slug:'restaurants',   name:'Restaurants',    emoji:'🍽️', color:'#b91c1c', image:null, tagline:'Menu + reservations + reviews', live:true },
  { slug:'salons',        name:'Salons',         emoji:'💇', color:'#a855f7', image:null, tagline:'Stylist booking, no app needed', live:true },
  { slug:'real-estate',   name:'Real Estate',    emoji:'🏘️', color:'#ca8a04', image:null, tagline:'IDX-ready listing pages', live:true },
  { slug:'med-spas',      name:'Med Spas',       emoji:'💆', color:'#7c3aed', image:null, tagline:'Service menu + before/after', live:true },
  { slug:'pest-control',  name:'Pest Control',   emoji:'🐜', color:'#65a30d', image:null, tagline:'Seasonal callouts + plans', live:true },
];

/* ── What you actually get ── */
const DELIVERABLES = [
  { icon:Zap,            label:'Custom design',           sub:'Tailored to your business, not a cookie-cutter template'   },
  { icon:CheckCircle2,   label:'Mobile-responsive',       sub:'Looks perfect on every phone, tablet, and desktop'         },
  { icon:TrendingDown,   label:'SEO-optimized',           sub:'Built to rank on Google for your service + your city'      },
  { icon:Lock,           label:'SSL + security forever',  sub:'Encrypted, secure, lifetime security patches'              },
  { icon:InfinityIcon,   label:'Hosting included for life',sub:'No hosting bills, no surprise charges — ever'              },
  { icon:Sparkles,       label:'Google Business setup',   sub:'We optimize your Google profile to send you free leads'    },
  { icon:Award,          label:'You own everything',      sub:'Domain, code, content — all yours. We don\'t hold it hostage' },
  { icon:Shield,         label:'30-day money-back',       sub:'Don\'t love it? Full refund within 30 days. No questions.'  },
];

/* ── FAQs — designed to kill cold-traffic objections ── */
const FAQS = [
  {
    q: 'Is this really lifetime, or is there a catch?',
    a: 'Really lifetime. One payment of $1,497 — no monthly fee, no annual renewal, no surprise charges. Hosting, SSL, and security patches are included for as long as you own the business. You own the domain (renewal is ~$15/yr direct from the registrar — we don\'t mark it up).',
  },
  {
    q: 'What happens if VCV goes out of business?',
    a: 'You own the code and the domain — we hand them over on day one. If we ever shut down, your site stays live on whatever host you want. We also offer a 30-day money-back guarantee on top, so the risk is fully on us.',
  },
  {
    q: 'Why is it so cheap compared to other agencies?',
    a: 'Other agencies charge $200/month forever because their business depends on lock-in. Ours doesn\'t. We make our margin on the build, then automate hosting so it costs us almost nothing to keep your site live. Your win is the cheaper price; our win is no churn and happy referrals.',
  },
  {
    q: 'How long until my site is live?',
    a: 'Most sites go live in 7 days from when we get your content. We do the heavy lifting — you just fill out a short onboarding form (logo, photos, services, hours) and approve the design.',
  },
  {
    q: 'Can I make changes after it\'s live?',
    a: 'Yes. You get 4 free content updates per year (text changes, new photos, new services). Beyond that, updates are $97 each — far cheaper than the $200/month most agencies charge for the same thing.',
  },
  {
    q: 'What about SEO — do I need to pay extra?',
    a: 'No. SEO foundations are baked in: fast load times, schema markup, mobile-optimized layout, and Google Business setup. Most of our clients see Google rankings improve in 30-60 days without paying for ads.',
  },
  {
    q: 'Do you build for my industry?',
    a: 'Almost certainly. We have proven templates for 30+ local-service industries (roofers, dentists, plumbers, HVAC, salons, restaurants, and more). If yours isn\'t in our gallery, we still build it — we just start from a clean custom design.',
  },
  {
    q: 'What if I already have a website?',
    a: 'Even better. We rebuild it, redirect your old URLs so you don\'t lose any SEO, and migrate everything for you. The old site stays live until the new one goes live — zero downtime.',
  },
];

/* ── Page component ── */
export default function Lifetime() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');
  const [openFaq,   setOpenFaq]   = useState<number | null>(null);

  const submitToStripe = async (payload: CheckoutPayload) => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  /* Inline CTA button — reused across the page */
  const CTAButton = ({ size = 'lg', label }: { size?: 'lg' | 'md'; label?: string }) => (
    <motion.button
      onClick={() => setModalOpen(true)}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      animate={{
        backgroundImage: [
          'linear-gradient(135deg,#ef4444,#f97316)',
          'linear-gradient(135deg,#f97316,#eab308)',
          'linear-gradient(135deg,#eab308,#22c55e)',
          'linear-gradient(135deg,#22c55e,#06b6d4)',
          'linear-gradient(135deg,#06b6d4,#3b82f6)',
          'linear-gradient(135deg,#3b82f6,#8b5cf6)',
          'linear-gradient(135deg,#8b5cf6,#ec4899)',
          'linear-gradient(135deg,#ec4899,#ef4444)',
        ],
        boxShadow: [
          '0 0 24px rgba(239,68,68,0.55)',
          '0 0 24px rgba(249,115,22,0.55)',
          '0 0 24px rgba(234,179,8,0.55)',
          '0 0 24px rgba(34,197,94,0.55)',
          '0 0 24px rgba(6,182,212,0.55)',
          '0 0 24px rgba(59,130,246,0.55)',
          '0 0 24px rgba(139,92,246,0.55)',
          '0 0 24px rgba(236,72,153,0.55)',
        ],
      }}
      transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
      className={`text-white font-bold rounded-xl flex items-center justify-center gap-2 group ${
        size === 'lg' ? 'px-8 py-4 text-base sm:text-lg' : 'px-6 py-3 text-sm'
      }`}>
      {loading
        ? <><Loader2 className="w-5 h-5 animate-spin"/> Redirecting...</>
        : <>{label || 'Claim My Lifetime Website'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/></>
      }
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none"/>

      {/* ════════ HERO ════════ */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6">
        <div className="absolute top-20 left-1/4 w-[500px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none"/>
        <div className="absolute top-20 right-1/4 w-[500px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none"/>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full"
            style={{ background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.35)' }}>
            <Sparkles className="w-3.5 h-3.5 text-blue-400"/>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-widest">Lifetime Website Offer</span>
          </motion.div>

          <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl leading-[0.95] mb-6">
            One Price.<br/>
            <span className="gradient-text">Yours Forever.</span>
          </motion.h1>

          <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Stop renting your website at $30–$200/month forever. Pay <span className="text-white font-bold">${LIFETIME_PRICE.toLocaleString()} once</span> — and never see another bill.
          </motion.p>

          {/* Anchor pricing block */}
          <motion.div initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:0.3 }}
            className="flex items-end justify-center gap-3 mb-3 flex-wrap">
            <span className="text-gray-600 text-2xl font-bold line-through decoration-red-500/70 mb-2">${LIFETIME_ORIG_PRICE.toLocaleString()}</span>
            <span className="font-display text-7xl sm:text-8xl text-white" style={{ textShadow:'0 0 40px rgba(59,130,246,0.5)' }}>
              ${LIFETIME_PRICE.toLocaleString()}
            </span>
            <span className="text-gray-400 text-2xl mb-3">once</span>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="flex items-center justify-center gap-3 flex-wrap mb-8 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30 text-green-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5"/> 30-day money-back
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5"/> No recurring fees ever
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5"/> Setup fee waived (${SETUP_FEE_VALUE} value)
            </span>
          </motion.div>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <CTAButton size="lg"/>
            <p className="text-gray-500 text-sm">Live in 7 days · Secure Stripe checkout</p>
          </motion.div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
        </div>
      </section>

      {/* ════════ THE MATH (loss aversion) ════════ */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-red-400 font-bold text-xs uppercase tracking-widest mb-3">The Math Nobody Shows You</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-4">
              You're About to <span className="gradient-text">Save $9,000+</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Here's what a website actually costs you over 10 years — depending on who you pick.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {COMPARISONS.map((c, i) => {
              const tenYearMonthly = c.monthly * 12 * 10;
              const tenYearTotal   = tenYearMonthly + c.setupFee;
              return (
                <motion.div key={c.name}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1 }}
                  className={`rounded-2xl p-6 ${c.highlight ? 'relative' : ''}`}
                  style={{
                    background: c.highlight
                      ? 'linear-gradient(145deg, rgba(10,20,60,0.95), rgba(22,10,48,0.95))'
                      : 'rgba(6,10,22,0.85)',
                    border: c.highlight
                      ? `1.5px solid ${c.color}99`
                      : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: c.highlight
                      ? `0 0 60px ${c.color}40`
                      : 'none',
                  }}>
                  {c.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap"
                      style={{ background:`${c.color}`, color:'#fff' }}>
                      WINNER
                    </div>
                  )}
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{c.name}</p>
                  <p className="text-gray-500 text-xs mb-5">{c.note}</p>

                  <div className="space-y-2 mb-5 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>Setup</span>
                      <span className="tabular-nums">${c.setupFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Monthly</span>
                      <span className="tabular-nums">{c.monthly ? `$${c.monthly}` : '—'}</span>
                    </div>
                    <div className="h-px bg-white/10 my-2"/>
                    <div className="flex justify-between text-gray-300 font-semibold">
                      <span>5 years</span>
                      <span className="tabular-nums">${(c.monthly * 60 + c.setupFee).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">10-year total</p>
                    <p className="font-display text-4xl tabular-nums" style={{ color: c.highlight ? c.color : '#fff' }}>
                      ${tenYearTotal.toLocaleString()}
                    </p>
                    {c.highlight && (
                      <p className="text-green-400 text-xs font-bold mt-1">
                        ↓ Save ${(2400 * 10 - LIFETIME_PRICE).toLocaleString()} vs Wix
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <CTAButton size="md" label="Lock In My Lifetime Price"/>
          </div>
        </div>
      </section>

      {/* ════════ WHAT YOU GET ════════ */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-950/10 via-transparent to-purple-950/10 pointer-events-none"/>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">What's Included</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-4">
              Everything You Need.<br/>
              <span className="gradient-text">Nothing You Don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DELIVERABLES.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.05 }}
                  className="p-5 rounded-2xl"
                  style={{ background:'rgba(6,10,22,0.85)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background:'rgba(59,130,246,0.15)', color:'#3b82f6' }}>
                    <Icon className="w-5 h-5"/>
                  </div>
                  <p className="text-white font-bold text-sm mb-1">{d.label}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{d.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ TEMPLATES GALLERY ════════ */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-purple-400 font-bold text-xs uppercase tracking-widest mb-3">Industry Templates</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-4">
              Pick Your <span className="gradient-text">Starting Point</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Every template is built for one industry — designed to convert visitors in <em>your</em> business, not look pretty in a portfolio. We customize it for your brand.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {TEMPLATES.map((t, i) => {
              const card = (
                <motion.div
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.04 }}
                  whileHover={{ y:-4 }}
                  className="group rounded-2xl overflow-hidden cursor-pointer h-full"
                  style={{
                    background:'rgba(6,10,22,0.85)',
                    border: t.live ? `1px solid ${t.color}60` : '1px solid rgba(255,255,255,0.08)',
                    boxShadow: t.live ? `0 0 24px ${t.color}25` : 'none',
                  }}>
                  {/* Image / placeholder */}
                  <div className="relative aspect-[16/10] overflow-hidden"
                    style={{
                      background: t.image
                        ? `url(${t.image}) center/cover`
                        : `linear-gradient(135deg, ${t.color}30, ${t.color}10), radial-gradient(circle at 30% 30%, ${t.color}40, transparent 60%)`,
                    }}>
                    {!t.image && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl opacity-70 group-hover:scale-110 transition-transform">{t.emoji}</span>
                      </div>
                    )}
                    {t.live && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: t.color, color: '#fff', boxShadow: `0 0 12px ${t.color}80` }}>
                        ● Live Demo
                      </span>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
                    <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                      <span className="text-white font-bold text-sm">{t.name}</span>
                      <span className={`text-xs flex items-center gap-1 transition-opacity ${t.live ? 'text-white font-bold opacity-100' : 'text-white/70 opacity-0 group-hover:opacity-100'}`}>
                        {t.live ? 'View →' : <>Preview <ArrowRight className="w-3 h-3"/></>}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-gray-500 text-xs">{t.tagline}</p>
                  </div>
                </motion.div>
              );

              return t.live ? (
                <Link key={t.slug} href={`/templates/${t.slug}`} target="_blank" rel="noopener noreferrer">
                  {card}
                </Link>
              ) : (
                <div key={t.slug}>{card}</div>
              );
            })}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            + 22 more industries available · Don't see yours? <button onClick={() => setModalOpen(true)} className="text-blue-400 hover:text-blue-300 font-semibold">We still build it →</button>
          </p>
        </div>
      </section>

      {/* ════════ HOW IT WORKS ════════ */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green-400 font-bold text-xs uppercase tracking-widest mb-3">How It Works</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-4">
              Live in <span className="gradient-text">7 Days</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step:'1', title:'Pay Once',       sub:`Secure Stripe checkout. $${LIFETIME_PRICE} one-time. Done.`,        icon:CheckCircle2 },
              { step:'2', title:'Quick Onboarding', sub:'5-minute form: logo, photos, services, hours. We handle the rest.', icon:Clock        },
              { step:'3', title:'We Build',         sub:'Custom site in 3–7 days. You review, request tweaks, approve.',     icon:Sparkles     },
              { step:'4', title:'Live Forever',     sub:'Your site goes live. Hosting, SSL, security all on us. Forever.',   icon:InfinityIcon },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.step}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1 }}
                  className="relative p-6 rounded-2xl"
                  style={{ background:'rgba(6,10,22,0.85)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full flex items-center justify-center font-display text-lg"
                    style={{ background:'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow:'0 0 18px rgba(59,130,246,0.5)' }}>
                    {s.step}
                  </div>
                  <Icon className="w-6 h-6 text-blue-400 mb-3"/>
                  <p className="text-white font-bold mb-1">{s.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{s.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ GUARANTEE ════════ */}
      <section className="py-16 px-4 sm:px-6 relative">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            className="relative p-8 sm:p-12 rounded-3xl text-center"
            style={{
              background:'linear-gradient(145deg, rgba(34,197,94,0.08), rgba(6,10,22,0.85))',
              border:'1.5px solid rgba(34,197,94,0.35)',
              boxShadow:'0 0 80px rgba(34,197,94,0.15)',
            }}>
            <Shield className="w-16 h-16 text-green-400 mx-auto mb-4"/>
            <h3 className="font-display text-4xl sm:text-5xl mb-3">
              30-Day Money-Back <span className="gradient-text">Guarantee</span>
            </h3>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
              Don't love your new website? Full refund within 30 days. No emails, no forms, no questions. The risk is entirely on us — that's how confident we are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ════════ FAQ ════════ */}
      <section className="py-20 px-4 sm:px-6 relative">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">Frequently Asked</p>
            <h2 className="font-display text-5xl sm:text-6xl mb-4">
              Questions, <span className="gradient-text">Answered</span>
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <motion.div key={i}
                  initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.03 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background:'rgba(6,10,22,0.85)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors">
                    <span className="font-bold text-white text-sm sm:text-base pr-4">{faq.q}</span>
                    <span className="text-blue-400 text-2xl flex-shrink-0 transition-transform"
                      style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0)' }}>+</span>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      className="px-5 pb-4 text-gray-400 text-sm leading-relaxed">
                      {faq.a}
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════ FINAL CTA ════════ */}
      <section className="py-24 px-4 sm:px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"/>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h2 className="font-display text-5xl sm:text-7xl mb-6 leading-tight">
            One Decision.<br/>
            <span className="gradient-text">A Website For Life.</span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
            Pay once. Own it forever. Save $9,000+ over the next 10 years. Backed by our 30-day money-back guarantee.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <CTAButton size="lg"/>
          </div>

          <div className="flex items-center justify-center gap-3 flex-wrap text-xs text-gray-500">
            <span className="inline-flex items-center gap-1"><Lock className="w-3.5 h-3.5"/> Secure Stripe checkout</span>
            <span className="text-gray-700">·</span>
            <span className="inline-flex items-center gap-1"><Shield className="w-3.5 h-3.5"/> 30-day refund</span>
            <span className="text-gray-700">·</span>
            <span className="inline-flex items-center gap-1"><InfinityIcon className="w-3.5 h-3.5"/> Yours forever</span>
          </div>
        </div>
      </section>

      {/* Upsell modal — fires Stripe redirect on Continue */}
      <CheckoutUpsellModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        context="website"
        planName="Lifetime Website"
        planAmount={LIFETIME_PRICE_CENTS}
        planPriceLabel={`$${LIFETIME_PRICE.toLocaleString()} once`}
        setupFeeCents={0}
        setupFeeName=""
        productName="VCV Web Solutions — Lifetime Website"
        loading={loading}
        onConfirm={submitToStripe}
      />
    </div>
  );
}
