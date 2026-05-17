'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, ArrowRight, CheckCircle2, Loader2, Mic,
  TrendingUp, Clock, Bot, AlertTriangle, ChevronDown,
} from 'lucide-react';
import { TryNovaButton } from '@/components/TryNovaButton';
import { EqualizerCanvas } from '@/components/EqualizerCanvas';
import { ROICalculator } from '@/components/ROICalculator';
import { CheckoutUpsellModal } from '@/components/CheckoutUpsellModal';
import { ParticleCanvas, MarqueeBand, SectionOrbs, GridOverlay } from '@/components/PageEffects';
import type { IndustryData } from '@/data/industries';
import { NOVA_TIERS as TIERS, type NovaTier as Tier } from '@/data/novaTiers';
import { BillingToggle, type Billing } from '@/components/BillingToggle';

const NOVA_NUMBER     = '(580) 656-9429';
const NOVA_NUMBER_RAW = '+15806569429';

const fade   = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, transition:{delay:d,duration:0.55}, viewport:{once:true} });
const slideL = (d=0) => ({ initial:{opacity:0,x:-30}, whileInView:{opacity:1,x:0}, transition:{delay:d,duration:0.6}, viewport:{once:true} });
const slideR = (d=0) => ({ initial:{opacity:0,x:30 }, whileInView:{opacity:1,x:0}, transition:{delay:d,duration:0.6}, viewport:{once:true} });

export default function IndustryLanding({ industry }: { industry: IndustryData }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [err, setErr] = useState('');
  const [modalTier, setModalTier] = useState<Tier | null>(null);
  const [openFaq, setOpenFaq] = useState(0);
  const [billing, setBilling] = useState<Billing>('monthly');

  const handleBuy = (tier: Tier) => { setErr(''); setModalTier(tier); };

  const submitToStripe = async (
    payload: import('@/components/CheckoutUpsellModal').CheckoutPayload,
    loadId: string,
  ) => {
    setLoadingId(loadId); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ ...payload, productName: `${payload.productName} · for ${industry.name}` }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e:unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
      setLoadingId(null);
    }
  };

  const accent = industry.color;

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <ParticleCanvas/>
        <SectionOrbs variant="blue"/>
        <GridOverlay gridOp={0.2} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Industry eyebrow + scarcity row */}
          <motion.div className="flex flex-wrap items-center justify-center gap-2 mb-6"
            initial={{opacity:0, y:-10}} animate={{opacity:1, y:0}}>
            <span className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background:`${accent}1a`, border:`1px solid ${accent}55` }}>
              <span className="text-xl">{industry.emoji}</span>
              <span className="text-xs font-bold tracking-widest" style={{ color: accent }}>
                {industry.heroEyebrow}
              </span>
            </span>
            <motion.span
              animate={{ scale:[1, 1.04, 1] }} transition={{ duration:2, repeat:Infinity }}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.4)' }}>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
              <span className="text-red-400 font-bold text-xs tracking-wide">ONLY 10 SPOTS THIS MONTH</span>
            </motion.span>
            <motion.span
              animate={{ boxShadow:[
                '0 0 14px rgba(255,193,7,0.3)',
                '0 0 24px rgba(255,193,7,0.55)',
                '0 0 14px rgba(255,193,7,0.3)',
              ]}}
              transition={{ duration:2.4, repeat:Infinity }}
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5"
              style={{ background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.5)' }}>
              <span className="text-yellow-300 font-bold text-xs tracking-wide">
                🎁 14-Day Free Trial · $147 Setup
              </span>
            </motion.span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{opacity:0, y:24}} animate={{opacity:1, y:0}} transition={{delay:0.1}}
            className="font-display text-center text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize:'clamp(2.5rem, 7vw, 5.5rem)' }}>
            {industry.heroHeadline.split('\n').map((line, i) =>
              <span key={i} className={i === 1 ? 'gradient-text block' : 'block'}>
                {line}
              </span>
            )}
          </motion.h1>

          <motion.p
            initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.2}}
            className="text-center text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            {industry.heroSubhead}
          </motion.p>

          {/* Pain snapshot */}
          <motion.div
            initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{delay:0.3}}
            className="max-w-3xl mx-auto mb-8 rounded-2xl p-4 text-center"
            style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.3)' }}>
            <p className="flex items-start gap-2 justify-center text-gray-200 text-sm md:text-base">
              <AlertTriangle className="w-4 h-4 mt-1 text-red-400 flex-shrink-0"/>
              <span><strong className="text-red-400">Sound familiar?</strong> {industry.painSnapshot}</span>
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{delay:0.35}}
            className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-2xl mx-auto">
            <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
              whileHover={{scale:1.04}} whileTap={{scale:0.97}}
              animate={{
                backgroundImage:[
                  'linear-gradient(135deg,#22c55e,#06b6d4)',
                  'linear-gradient(135deg,#06b6d4,#3b82f6)',
                  'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  'linear-gradient(135deg,#8b5cf6,#22c55e)',
                ],
                boxShadow:[
                  '0 0 24px rgba(34,197,94,0.55)',
                  '0 0 24px rgba(6,182,212,0.55)',
                  '0 0 24px rgba(59,130,246,0.55)',
                  '0 0 24px rgba(139,92,246,0.55)',
                ],
              }}
              transition={{ duration:5, repeat:Infinity, ease:'linear' }}
              className="flex-1 px-6 py-4 rounded-2xl font-bold text-white inline-flex items-center justify-center gap-2.5 w-full sm:w-auto">
              <Phone className="w-5 h-5"/>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-bold uppercase tracking-widest opacity-85">Call Nova Now</div>
                <div className="text-lg font-display">{NOVA_NUMBER}</div>
              </div>
            </motion.a>
            <a href="#pricing"
              className="flex-1 glass-card text-white px-6 py-4 rounded-2xl font-semibold text-base inline-flex items-center justify-center gap-2 w-full sm:w-auto">
              See {industry.name} Pricing <ArrowRight className="w-4 h-4"/>
            </a>
          </motion.div>

          {/* Trust pills */}
          <div className="flex flex-wrap gap-2 justify-center mt-7 text-xs">
            {[
              { e:'💰', t:'30-Day Money-Back', c:'34,197,94' },
              { e:'⚡', t:'Live in 24-48 hrs', c:'59,130,246' },
              { e:'🔒', t:'Cancel anytime',    c:'168,85,247' },
              { e:'📞', t:'Local number',      c:'6,182,212'  },
            ].map((p,i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold"
                style={{ color:`rgb(${p.c})`, background:`rgba(${p.c},0.12)`, border:`1px solid rgba(${p.c},0.4)` }}>
                {p.e} {p.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MarqueeBand/>

      {/* ══════════ STATS ══════════ */}
      <section className="py-16 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h2 {...fade()}
            className="font-display text-3xl md:text-5xl text-white text-center mb-10 leading-tight">
            The reality for <span className="gradient-text">{industry.pluralLabel}</span>:
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {industry.stats.map((s, i) => (
              <motion.div key={i} {...fade(0.05*i)}
                className="rounded-2xl p-6 text-center"
                style={{ background:'rgba(239,68,68,0.07)', border:'1px solid rgba(239,68,68,0.25)' }}>
                <p className="font-display text-4xl md:text-5xl text-white mb-2"
                  style={{ textShadow:'0 0 18px rgba(239,68,68,0.4)' }}>
                  {s.value}
                </p>
                <p className="text-gray-300 text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ TRY IT LIVE ══════════ */}
      <section id="try-it-live" className="py-20 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <EqualizerCanvas opacity={0.4}/>
        <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(4,10,22,0.6)', zIndex:1 }}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...fade()}>
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Try it live</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-3"
              style={{ fontSize: 'clamp(2rem, 5.5vw, 4rem)' }}>
              Call Nova as a <span className="gradient-text">{industry.name.toLowerCase()} customer.</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto mb-8">
              Pretend you&apos;re calling about: <strong className="text-white">{industry.scriptCaller}</strong>
            </p>
          </motion.div>

          <motion.div {...fade(0.15)} className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto items-stretch">
            <div className="relative h-full">
              <div className="absolute -inset-3 rounded-[28px] pointer-events-none"
                style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.4),rgba(6,182,212,0.3),rgba(59,130,246,0.25))', filter:'blur(28px)', opacity:0.55 }}/>
              <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                whileHover={{scale:1.02}} whileTap={{scale:0.98}}
                className="relative block w-full h-full p-6 md:p-8 rounded-[22px] text-center flex flex-col items-center justify-center"
                style={{
                  minHeight: 320,
                  background:'rgba(5,15,25,0.95)',
                  border:'2px solid rgba(34,197,94,0.5)',
                  boxShadow:'0 0 50px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                  backdropFilter:'blur(24px)',
                }}>
                <motion.div
                  animate={{scale:[1,1.06,1]}}
                  transition={{duration:2,repeat:Infinity}}
                  className="w-20 h-20 mb-4 rounded-full flex items-center justify-center"
                  style={{background:'linear-gradient(135deg,#22c55e,#06b6d4)', boxShadow:'0 0 35px rgba(34,197,94,0.55)'}}>
                  <Phone className="w-9 h-9 text-white"/>
                </motion.div>
                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">📞 Call from Your Phone</p>
                <p className="font-display text-3xl md:text-4xl text-white mb-2">{NOVA_NUMBER}</p>
                <p className="text-green-400 text-sm font-bold mb-2">⚡ Answers in 1 Ring</p>
                <p className="text-gray-500 text-xs">Tap to call</p>
              </motion.a>
            </div>

            <TryNovaButton/>
          </motion.div>
        </div>
      </section>

      {/* ══════════ WHAT NOVA HANDLES ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="blue"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">What Nova handles</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(1.85rem, 5vw, 3.5rem)' }}>
              Every kind of call <br className="md:hidden"/>
              <span className="gradient-text">{industry.pluralLabel}</span> get.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto mb-12">
            {industry.leadTypes.map((lt, i) => (
              <motion.div key={i} {...fade(0.04*i)}
                className="rounded-xl p-4 flex items-center gap-3"
                style={{ background:`${accent}10`, border:`1px solid ${accent}35` }}>
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: accent }}/>
                <span className="text-white font-semibold text-sm">{lt}</span>
              </motion.div>
            ))}
          </div>

          {/* Sample script */}
          <motion.div {...fade(0.1)} className="max-w-3xl mx-auto rounded-2xl p-6 md:p-8"
            style={{ background:'rgba(5,12,22,0.97)', border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 8px 40px rgba(0,0,0,0.5)' }}>
            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-4 flex items-center gap-2">
              <Mic className="w-3.5 h-3.5"/> Sample call
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                  style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
                  YOU
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm p-3"
                  style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-gray-200 text-sm leading-relaxed">&ldquo;{industry.scriptCaller}&rdquo;</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background:'linear-gradient(135deg,#22c55e,#06b6d4)', boxShadow:'0 0 14px rgba(34,197,94,0.4)' }}>
                  <Bot className="w-4 h-4 text-white"/>
                </div>
                <div className="flex-1 rounded-2xl rounded-tl-sm p-3"
                  style={{ background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.3)' }}>
                  <p className="text-gray-100 text-sm leading-relaxed">&ldquo;{industry.scriptNova}&rdquo;</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ PAIN → OUTCOME ══════════ */}
      <section className="py-20 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Before vs after</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(1.85rem, 5vw, 3.5rem)' }}>
              From <span className="text-red-400">losing leads</span> to <span className="gradient-text">booking jobs.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            <motion.div {...slideL()}
              className="rounded-2xl p-6"
              style={{ background:'rgba(239,68,68,0.06)', border:'1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-red-400 text-xs font-bold uppercase tracking-widest mb-4">Before Nova</p>
              <ul className="space-y-3">
                {industry.painPoints.map((p, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-200">
                    <AlertTriangle className="w-4 h-4 mt-1 text-red-400 flex-shrink-0"/>
                    <span className="text-sm leading-relaxed">{p}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...slideR(0.1)}
              className="rounded-2xl p-6"
              style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.4)', boxShadow:'0 0 32px rgba(34,197,94,0.1)' }}>
              <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-4">After Nova</p>
              <ul className="space-y-3">
                {industry.outcomes.map((o, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-gray-100">
                    <CheckCircle2 className="w-4 h-4 mt-1 text-green-400 flex-shrink-0"/>
                    <span className="text-sm leading-relaxed">{o}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ ROI CALCULATOR ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-8">
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Run your numbers</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(1.85rem, 5vw, 3.5rem)' }}>
              See what Nova will <span className="gradient-text">make {industry.pluralLabel}.</span>
            </h2>
          </motion.div>
          <ROICalculator/>
        </div>
      </section>

      {/* ══════════ TESTIMONIAL ══════════ */}
      <section className="py-16 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="cyan"/>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()}
            className="rounded-3xl p-8 md:p-10 text-center"
            style={{ background:`${accent}10`, border:`1px solid ${accent}40`, boxShadow:`0 0 36px ${accent}15` }}>
            <div className="flex justify-center gap-0.5 mb-4">
              {Array.from({length:5}).map((_,k)=>(<span key={k} className="text-yellow-400 text-xl">★</span>))}
            </div>
            <p className="text-gray-100 text-lg md:text-2xl leading-relaxed mb-5 italic">
              &ldquo;{industry.quote}&rdquo;
            </p>
            <p className="text-white font-bold">{industry.quoter}</p>
            <p className="text-gray-400 text-sm">{industry.quoteRole}</p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="pricing" className="py-20 bg-[#030712] relative overflow-hidden">
        <ParticleCanvas/>
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.22} dotOp={0.1}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Pricing</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
              Stop losing jobs from<br/>
              <span className="gradient-text">missed calls.</span>
            </h2>
          </motion.div>

          {/* Monthly / Annual toggle */}
          <BillingToggle value={billing} onChange={setBilling} className="mb-7"/>

          {err && <p className="text-red-400 text-sm text-center mb-4">{err}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-7">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.id} {...fade(0.06*i)}
                whileHover={{ y:-5 }}
                className="relative p-px rounded-[22px]"
                style={{
                  background: tier.popular
                    ? `linear-gradient(135deg,${tier.color}cc,${tier.color}66,#06b6d488)`
                    : `linear-gradient(135deg,${tier.color}55,rgba(255,255,255,0.06))`,
                  boxShadow: tier.popular
                    ? `0 0 50px ${tier.color}40`
                    : '0 0 24px rgba(0,0,0,0.4)',
                  transform: tier.popular ? 'scale(1.04)' : 'scale(1)',
                }}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <div className="text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap"
                      style={{ background:`linear-gradient(135deg,${tier.color},#06b6d4)`, boxShadow:`0 0 14px ${tier.color}99` }}>
                      ⚡ MOST POPULAR
                    </div>
                  </div>
                )}
                <div className="rounded-[21px] p-6 h-full flex flex-col"
                  style={{ background:'rgba(5,12,22,0.97)' }}>
                  <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">{tier.name}</p>
                  <p className="text-gray-300 text-sm leading-snug mb-3 min-h-[40px]">{tier.positioning}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-5xl text-white" style={{ textShadow:`0 0 22px ${tier.color}55` }}>
                      ${billing === 'annual' ? tier.priceAnnual.toLocaleString() : tier.price}
                    </span>
                    <span className="text-gray-300 text-sm mb-2 ml-1">
                      {billing === 'annual' ? '/yr' : '/mo'}
                    </span>
                  </div>
                  {billing === 'annual' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-1.5"
                      style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.35)' }}>
                      <span className="text-green-400 text-xs font-bold">Save ${tier.annualSavings} · 2 months free</span>
                    </div>
                  )}
                  <p className="text-sm font-semibold mb-5" style={{ color: tier.color }}>
                    {tier.callsLabel}
                  </p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tier.color }}/>
                        <span className="text-gray-100">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={() => handleBuy(tier)}
                    disabled={loadingId !== null}
                    whileHover={{ scale: loadingId ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                    animate={tier.popular ? {
                      backgroundImage:[
                        'linear-gradient(135deg,#22c55e,#06b6d4)',
                        'linear-gradient(135deg,#06b6d4,#3b82f6)',
                        'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                        'linear-gradient(135deg,#8b5cf6,#22c55e)',
                      ],
                    } : { backgroundImage:`linear-gradient(135deg,${tier.color},${tier.color}cc)` }}
                    transition={tier.popular ? { duration: 4.2, repeat: Infinity, ease:'linear' } : { duration: 0.3 }}
                    style={!tier.popular ? { boxShadow:`0 0 18px ${tier.color}55` } : undefined}>
                    {loadingId === tier.id
                      ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                      : <>{tier.ctaLabel} <ArrowRight className="w-4 h-4"/></>}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Setup fee box */}
          <motion.div {...fade(0.2)} className="max-w-3xl mx-auto rounded-2xl p-5 text-center"
            style={{ background:'rgba(255,193,7,0.10)', border:'1.5px solid rgba(255,193,7,0.4)' }}>
            <p className="text-yellow-300 font-bold text-base mb-1">
              👉 One-Time Setup Fee: <span className="text-white text-xl">$147</span>
              <span className="text-green-400 font-bold text-xs ml-2">· Auto-added at checkout</span>
            </p>
            <p className="text-gray-200 text-sm">
              Includes phone number setup, Nova voice training, {industry.name.toLowerCase()}-specific call scripts,
              appointment rules, and full assistant configuration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="py-16 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-8">
            <p className="text-purple-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Common questions</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(1.85rem, 5vw, 3.5rem)' }}>
              FAQ for <span className="gradient-text">{industry.pluralLabel}.</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {industry.faqs.map((f, i) => (
              <motion.div key={i} {...fade(0.04*i)}
                className="rounded-xl overflow-hidden"
                style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left gap-4">
                  <span className="text-white font-bold text-base">{f.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }}>
                    <ChevronDown className="w-5 h-5 text-gray-400"/>
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <p className="px-5 pb-4 text-gray-200 text-sm leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.22} dotOp={0.1}/>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fade()}>
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Last step</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.25rem, 7vw, 5.5rem)' }}>
              {industry.ctaHeadline}
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              Call Nova first. Hear her work. Then we&apos;ll have you live in 24-48 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-xl mx-auto">
              <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                whileHover={{scale:1.04}} whileTap={{scale:0.97}}
                animate={{
                  backgroundImage:[
                    'linear-gradient(135deg,#22c55e,#06b6d4)',
                    'linear-gradient(135deg,#06b6d4,#3b82f6)',
                    'linear-gradient(135deg,#3b82f6,#22c55e)',
                  ],
                  boxShadow:[
                    '0 0 30px rgba(34,197,94,0.6)',
                    '0 0 30px rgba(6,182,212,0.6)',
                    '0 0 30px rgba(59,130,246,0.6)',
                  ],
                }}
                transition={{ duration:4, repeat:Infinity, ease:'linear' }}
                className="flex-1 px-8 py-4 rounded-full font-bold text-white text-base inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                <Phone className="w-5 h-5"/> Call Nova: {NOVA_NUMBER}
              </motion.a>
              <Link href="#pricing"
                className="flex-1 glass-card text-white px-8 py-4 rounded-full font-semibold text-base inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                <TrendingUp className="w-5 h-5"/> View Pricing
              </Link>
            </div>
            <p className="text-gray-500 text-xs mt-5">
              <Clock className="w-3 h-3 inline-block mr-1"/>
              Setup in 24-48 hrs · 30-day money-back · Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upsell modal */}
      {modalTier && (
        <CheckoutUpsellModal
          open={modalTier !== null}
          onClose={() => setModalTier(null)}
          context="nova"
          planName={`${modalTier.name} Plan · ${industry.name}${billing === 'annual' ? ' · Annual' : ''}`}
          planAmount={billing === 'annual' ? modalTier.priceCentsAnnual : modalTier.priceCents}
          planPriceLabel={billing === 'annual' ? `$${modalTier.priceAnnual.toLocaleString()}/yr` : `$${modalTier.price}/mo`}
          setupFeeCents={14700}
          setupFeeName="One-Time Setup Fee ($147)"
          productName={`Never Miss a Call — ${modalTier.name} Plan · ${industry.name}${billing === 'annual' ? ' · Annual (saves $' + modalTier.annualSavings + ')' : ''}`}
          loading={loadingId === modalTier.id}
          onConfirm={(payload) => submitToStripe(payload, modalTier.id)}
        />
      )}
    </div>
  );
}
