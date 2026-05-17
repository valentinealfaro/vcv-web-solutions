'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, MessageSquare, ArrowRight, CheckCircle2, Clock, Bell, Sparkles,
  Zap, Shield, TrendingUp, Calendar, Bot, AlertTriangle, DollarSign,
  PhoneOff, Mic, BellRing, Smartphone, Headphones, Loader2,
} from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import { TryNovaButton } from '@/components/TryNovaButton';
import { EqualizerCanvas } from '@/components/EqualizerCanvas';
import { CheckoutUpsellModal } from '@/components/CheckoutUpsellModal';
import { ROICalculator } from '@/components/ROICalculator';
import { CountdownTimer } from '@/components/CountdownTimer';
import {
  ParticleCanvas, StaticElectricity, MarqueeBand, SectionOrbs, GridOverlay,
} from '@/components/PageEffects';

const NOVA_NUMBER      = '(580) 656-9429';
const NOVA_NUMBER_RAW  = '+15806569429';
const VCV_NUMBER       = '+15809191386';

/* ─── Local image assets in /public/nova ─────────────────────── */
const IMG = {
  hero:         '/nova/nova-hero.png',
  novaPortrait: '/nova/nova-waiting.png',
  problem:      '/nova/missed-call-revenue.png',
  beforeNova:   '/nova/before-nova.png',
  solution:     '/nova/after-nova.png',
  contractor:   '/nova/construction-lead.png',
  dental:       '/nova/dentist-lead.png',
  restaurant:   '/nova/restaurant-lead.png',
};

const fade   = (d=0) => ({ initial:{opacity:0,y:30}, whileInView:{opacity:1,y:0}, transition:{delay:d,duration:0.6}, viewport:{once:true} });
const slideL = (d=0) => ({ initial:{opacity:0,x:-30}, whileInView:{opacity:1,x:0}, transition:{delay:d,duration:0.6}, viewport:{once:true} });
const slideR = (d=0) => ({ initial:{opacity:0,x:30 }, whileInView:{opacity:1,x:0}, transition:{delay:d,duration:0.6}, viewport:{once:true} });

const FEATURES = [
  { icon:<Phone className="w-5 h-5"/>,        title:'Answers Every Call 24/7',     desc:'Instant pickup — no voicemail, no missed leads, no after-hours blackout.', color:'#3b82f6' },
  { icon:<Mic className="w-5 h-5"/>,          title:'Sounds Human',                 desc:'Natural voice. Doesn\'t feel robotic. Customers won\'t even know.',         color:'#8b5cf6' },
  { icon:<BellRing className="w-5 h-5"/>,     title:'Instant Owner Alerts',         desc:'Every lead → text + email to you within seconds of the call ending.',     color:'#06b6d4' },
  { icon:<Calendar className="w-5 h-5"/>,     title:'Books Appointments',           desc:'Optional calendar integration — Nova locks in jobs while you work.',      color:'#10b981' },
  { icon:<MessageSquare className="w-5 h-5"/>,title:'Missed-Call Auto-Text',        desc:'If a call slips through, customer gets an SMS in 30 seconds flat.',        color:'#f97316' },
  { icon:<Smartphone className="w-5 h-5"/>,   title:'Local Number for Your Area',   desc:'We pick a number in your area code so callers see a familiar number and pick up.', color:'#ec4899' },
  { icon:<Headphones className="w-5 h-5"/>,   title:'Live Transfer Option',         desc:'Hot leads can be patched straight to your cell when you\'re available.',  color:'#a855f7' },
  { icon:<Sparkles className="w-5 h-5"/>,     title:'7-Day Follow-Up SMS',          desc:'Day 1, Day 3, Day 7 reminders so leads never go cold.',                   color:'#22c55e' },
];

const NICHES = [
  { img: IMG.contractor, label:'Contractors',  copy:'Customer needing an estimate' },
  { img: IMG.dental,     label:'Dentists',     copy:'Patient booking a cleaning'   },
  { img: IMG.restaurant, label:'Restaurants',  copy:'Caller making a reservation'  },
];

const STEPS = [
  { n:1, title:'Nova Answers',          desc:'"Hi! Thanks for calling. Are you a business owner or trying the demo?"' },
  { n:2, title:'Asks About Your Biz',   desc:'"What kind of business do you run?" — then roleplays a customer.' },
  { n:3, title:'Roleplays Live',        desc:'Acts like a real customer — estimate request, booking, etc.' },
  { n:4, title:'Captures Your Info',    desc:'Grabs your name + phone before ending the call.' },
  { n:5, title:'Soft Close',            desc:'"Our team will reach out within 1 business day to get you set up."' },
];

const STACK = [
  {
    title:'AI Receptionist (Nova)',
    items:[
      'Answers every call instantly · 24/7',
      'Local number in your area code',
      'Speaks naturally — not robotic',
      'Captures name, phone, job request',
      'Books appointments (optional)',
      'Instant text/email notifications',
      'After-hours + weekend coverage',
      'Live transfer when needed',
      'SMS follow-up sequence',
    ],
    color:'#3b82f6',
    icon:<Bot className="w-6 h-6"/>,
  },
  {
    title:'Lead-Machine Website',
    items:[
      '1–5 page high-converting site',
      'Mobile optimized',
      'Call button always visible',
      'Lead form connected to Nova',
      'Local-SEO optimized',
      'Fast loading + modern design',
      'Hosting + maintenance included',
    ],
    color:'#8b5cf6',
    icon:<TrendingUp className="w-6 h-6"/>,
  },
  {
    title:'Automation System',
    items:[
      'Missed call → auto-text in 30s',
      'Form fill → instant response',
      'Lead captured → owner alert',
      'Day-1, Day-3, Day-7 follow-ups',
    ],
    color:'#06b6d4',
    icon:<Zap className="w-6 h-6"/>,
  },
];

import { NOVA_TIERS as TIERS, type NovaTier as Tier } from '@/data/novaTiers';
import { BillingToggle, type Billing } from '@/components/BillingToggle';

export default function AIReceptionist() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [err, setErr]             = useState('');
  const [modalTier,    setModalTier]    = useState<Tier | null>(null);  // Nova tier modal
  const [bundleModalOpen, setBundleModalOpen] = useState(false);        // Mega bundle modal
  const [billing, setBilling] = useState<Billing>('monthly');           // Monthly vs Annual toggle

  // Click "Buy Now" on a tier → open upsell modal first
  const handleBuy = (tier: Tier) => { setErr(''); setModalTier(tier); };

  // Generic Stripe submitter used by every checkout flow on this page
  const submitToStripe = async (payload: import('@/components/CheckoutUpsellModal').CheckoutPayload, loadId: string) => {
    setLoadingId(loadId); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e:unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
      setLoadingId(null);
    }
  };

  // 30-day free trial — customer pays only the $147 setup fee, no monthly today
  const handleTrial = async (tier: Tier) => {
    setLoadingId(`${tier.id}-trial`); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          productName: `${tier.name} Plan — 30 Day FREE Trial (first month free, $${tier.price}/mo after)`,
          amount:       14700,  // $147 setup only — no monthly charge today
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e:unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <ParticleCanvas />
        <SectionOrbs variant="blue" />
        <GridOverlay gridOp={0.3} dotOp={0.12} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* Left copy */}
            <motion.div {...slideL()}>
              {/* Trust pills — static, no competing scale/glow loops */}
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                  <span className="text-red-400 font-bold text-xs tracking-wide">ONLY 10 SPOTS THIS MONTH</span>
                </div>

                <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                  style={{ background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.5)' }}>
                  <span className="text-yellow-300 font-bold text-xs tracking-wide">
                    Try Nova FREE for 30 Days · Just $147 setup
                  </span>
                </div>

                <CountdownTimer message="Free trial offer ends today" variant="banner"/>
              </div>

              <h1 className="font-display text-white tracking-tight leading-[1.02] mb-6"
                style={{ fontSize:'clamp(3rem, 8vw, 6.5rem)' }}>
                Never miss<br/>
                <span className="gradient-text">another call.</span>
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mb-8 max-w-xl">
                Our AI receptionist <strong className="text-white">Nova</strong> answers every call —
                day, night, weekends — books jobs and texts you the lead instantly.
                <span className="block mt-3 text-gray-400">
                  Miss 2 jobs a week? That&apos;s $2,000–$5,000 lost. Stop it today.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-stretch">

                {/* ── CALL NOVA — primary, two-line ───────────────────── */}
                <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                  whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                  animate={{
                    backgroundImage:[
                      'linear-gradient(135deg,#22c55e,#06b6d4)',
                      'linear-gradient(135deg,#06b6d4,#3b82f6)',
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      'linear-gradient(135deg,#8b5cf6,#22c55e)',
                    ],
                    boxShadow:[
                      '0 8px 28px rgba(34,197,94,0.45),  inset 0 1px 0 rgba(255,255,255,0.25)',
                      '0 8px 28px rgba(6,182,212,0.45),  inset 0 1px 0 rgba(255,255,255,0.25)',
                      '0 8px 28px rgba(59,130,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                      '0 8px 28px rgba(139,92,246,0.45), inset 0 1px 0 rgba(255,255,255,0.25)',
                    ],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="relative px-7 py-3.5 rounded-2xl flex items-center gap-3.5 overflow-hidden"
                  style={{ minWidth: 260 }}>
                  {/* shine sweep */}
                  <motion.span
                    className="absolute inset-0 pointer-events-none"
                    initial={{ x: '-110%' }}
                    animate={{ x: '110%' }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 1.5 }}
                    style={{ background:'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)', width:'40%' }}
                  />
                  {/* phone icon — pulsing white circle */}
                  <motion.div
                    animate={{ scale:[1, 1.12, 1], boxShadow:[
                      '0 0 0 rgba(255,255,255,0.4)',
                      '0 0 18px rgba(255,255,255,0.6)',
                      '0 0 0 rgba(255,255,255,0.4)',
                    ]}}
                    transition={{ duration: 1.6, repeat: Infinity, ease:'easeInOut' }}
                    className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.4)' }}>
                    <Phone className="w-5 h-5 text-white"/>
                  </motion.div>
                  {/* two-line label */}
                  <div className="relative z-10 text-left leading-tight">
                    <p className="text-white/85 text-[11px] font-bold uppercase tracking-widest">Call Nova</p>
                    <p className="text-white text-xl font-display tracking-wide" style={{ textShadow:'0 1px 6px rgba(0,0,0,0.35)' }}>
                      {NOVA_NUMBER}
                    </p>
                  </div>
                </motion.a>

                {/* ── TRY NOVA NOW — secondary, mic-themed, two-line ────── */}
                <motion.a href="#try-it-live"
                  whileHover={{ scale:1.03, y:-2 }} whileTap={{ scale:0.97 }}
                  className="relative px-7 py-3.5 rounded-2xl flex items-center gap-3.5 overflow-hidden group"
                  style={{
                    minWidth: 260,
                    background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(20,30,50,0.95))',
                    border: '1.5px solid rgba(139,92,246,0.45)',
                    boxShadow: '0 8px 28px rgba(139,92,246,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}>
                  {/* animated purple/pink gradient on hover */}
                  <motion.span
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    style={{ background:'linear-gradient(135deg,rgba(139,92,246,0.25),rgba(236,72,153,0.18))' }}
                  />
                  {/* mic icon with pulse rings */}
                  <div className="relative z-10 w-11 h-11 flex-shrink-0">
                    <motion.div
                      animate={{ scale:[1, 1.6], opacity:[0.5, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease:'easeOut' }}
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{ border:'2px solid rgba(139,92,246,0.5)' }}
                    />
                    <motion.div
                      animate={{ boxShadow:[
                        '0 0 12px rgba(139,92,246,0.5)',
                        '0 0 22px rgba(236,72,153,0.7)',
                        '0 0 12px rgba(139,92,246,0.5)',
                      ]}}
                      transition={{ duration: 2, repeat: Infinity, ease:'easeInOut' }}
                      className="relative w-11 h-11 rounded-full flex items-center justify-center"
                      style={{ background:'linear-gradient(135deg,#8b5cf6,#ec4899)' }}>
                      <Mic className="w-5 h-5 text-white"/>
                    </motion.div>
                  </div>
                  {/* two-line label */}
                  <div className="relative z-10 text-left leading-tight">
                    <p className="text-purple-300 text-[11px] font-bold uppercase tracking-widest">Talk in Browser</p>
                    <p className="text-white text-xl font-display tracking-wide flex items-center gap-1.5">
                      Try Nova Now
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                    </p>
                  </div>
                </motion.a>
              </div>

              <div className="flex flex-wrap gap-2 mt-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-400"
                  style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.4)' }}>
                  💰 30-Day Money-Back Guarantee
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-blue-300"
                  style={{ background:'rgba(59,130,246,0.12)', border:'1px solid rgba(59,130,246,0.4)' }}>
                  ⚡ Live in 24-48 hrs
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-purple-300"
                  style={{ background:'rgba(168,85,247,0.12)', border:'1px solid rgba(168,85,247,0.4)' }}>
                  🔒 Cancel anytime
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-cyan-300"
                  style={{ background:'rgba(6,182,212,0.12)', border:'1px solid rgba(6,182,212,0.4)' }}>
                  📞 Local number, your area
                </span>
              </div>
            </motion.div>

            {/* Right image — hero */}
            <motion.div {...slideR(0.1)} className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl"
                  style={{ background:'linear-gradient(135deg,rgba(37,99,235,0.4),rgba(124,58,237,0.3))',
                    filter:'blur(60px)', transform:'scale(1.1)' }}/>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={IMG.hero} alt="AI receptionist taking calls" loading="lazy"
                  className="relative rounded-3xl w-full h-full object-cover"
                  style={{ border:'2px solid rgba(255,255,255,0.1)', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}/>
                {/* Floating badge */}
                <motion.div className="absolute -bottom-5 -left-5 glass-card p-4 flex items-center gap-3"
                  animate={{ y:[0,-8,0] }} transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}>
                  <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-400"/>
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">Live Right Now</p>
                    <p className="text-green-400 text-xs">Nova is answering calls</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <MarqueeBand />

      {/* ══════════ TRY IT LIVE — DEMO SECTION ══════════ */}
      <section id="try-it-live" className="py-24 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>
        <EqualizerCanvas opacity={0.42}/>
        {/* dim scrim so cards stay readable over bars */}
        <div className="absolute inset-0 pointer-events-none" style={{ background:'rgba(4,10,22,0.55)', zIndex:1 }}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div {...fade()}>
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Try it live</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Call Nova <span className="gradient-text">right now.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Pretend you&apos;re a customer. Nova will answer, ask questions, and show
              you exactly how it works. <strong className="text-white">No signup. No forms. Just call and test it.</strong>
            </p>
          </motion.div>

          {/* TWO ways to demo: phone call OR browser mic — equal-height cards */}
          <motion.div {...fade(0.15)} className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto mb-8 items-stretch">

            {/* OPTION 1 — Phone call */}
            <div className="relative h-full">
              {/* Outer glow to match TryNovaButton */}
              <div className="absolute -inset-3 rounded-[28px] pointer-events-none"
                style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.4),rgba(6,182,212,0.3),rgba(59,130,246,0.25))', filter:'blur(28px)', opacity:0.55 }}/>
              <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
                className="relative block w-full h-full p-6 md:p-8 rounded-[22px] text-center flex flex-col items-center justify-center"
                style={{
                  minHeight: 320,
                  background:'rgba(5,15,25,0.95)',
                  border:'2px solid rgba(34,197,94,0.5)',
                  boxShadow:'0 0 50px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.06)',
                  backdropFilter:'blur(24px)',
                }}>

                <motion.div
                  animate={{ scale:[1,1.06,1], boxShadow:[
                    '0 0 25px rgba(34,197,94,0.5)',
                    '0 0 40px rgba(34,197,94,0.7)',
                    '0 0 25px rgba(34,197,94,0.5)',
                  ]}}
                  transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
                  className="w-20 h-20 mb-4 rounded-full flex items-center justify-center"
                  style={{ background:'linear-gradient(135deg,#22c55e,#06b6d4)' }}>
                  <Phone className="w-9 h-9 text-white"/>
                </motion.div>

                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">📞 Call from Your Phone</p>
                <p className="font-display text-3xl md:text-4xl text-white mb-2"
                  style={{ textShadow:'0 0 25px rgba(34,197,94,0.5)' }}>
                  {NOVA_NUMBER}
                </p>
                <p className="text-green-400 text-sm font-bold mb-2">⚡ Answers in 1 Ring</p>
                <p className="text-gray-500 text-xs">Tap to call · Standard rates apply</p>
              </motion.a>
            </div>

            {/* OPTION 2 — Browser mic via Vapi */}
            <TryNovaButton />

          </motion.div>

          <motion.p {...fade(0.2)} className="text-center mb-10">
            <span
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-white text-sm font-semibold"
              style={{
                background: 'rgba(5,12,22,0.92)',
                border: '1px solid rgba(34,197,94,0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 0 24px rgba(34,197,94,0.18), 0 8px 24px rgba(0,0,0,0.55)',
              }}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
              Pick whichever is easier — both connect you straight to Nova
            </span>
          </motion.p>

          {/* What to ask — each card calls Nova on tap */}
          <motion.div {...fade(0.25)} className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {NICHES.map((n, i) => (
              <motion.a key={i} {...fade(0.05 * i)}
                href={`tel:${NOVA_NUMBER_RAW}`}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card p-5 text-center group cursor-pointer"
                style={{ transition: 'border-color 0.3s ease' }}>
                <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.img} alt={n.label} loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"/>
                  <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(5,15,25,0.85), transparent)' }}/>
                </div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">If you&apos;re a</p>
                <p className="text-white font-bold text-lg mb-1">{n.label}</p>
                <p className="text-gray-400 text-sm mb-3">Roleplay: {n.copy}</p>
                {/* Call-Nova CTA */}
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-green-400"
                  style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.4)' }}>
                  <Phone className="w-3 h-3"/> Call Nova
                </span>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ PROBLEM SECTION ══════════ */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <StaticElectricity/>
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.25} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-14">
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">The problem</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Missed calls = <span className="gradient-text-warm">lost money.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Every unanswered call is a competitor closing the job instead.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...slideL()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.problem} alt="Missed call notifications" loading="lazy"
                className="rounded-2xl w-full"
                style={{ border:'1px solid rgba(255,255,255,0.08)', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}/>
            </motion.div>
            <motion.div {...slideR(0.1)} className="space-y-4">
              {[
                { icon:<PhoneOff className="w-5 h-5"/>, stat:'62%',     label:'of after-hours calls go to voicemail and never call back' },
                { icon:<DollarSign className="w-5 h-5"/>, stat:'$2-5K', label:'lost per week from missing just 2 jobs' },
                { icon:<Clock className="w-5 h-5"/>,    stat:'24/7',    label:'is when leads call — not just business hours' },
                { icon:<AlertTriangle className="w-5 h-5"/>, stat:'30s', label:'is all the patience customers have before calling a competitor' },
              ].map((p, i) => (
                <motion.div key={i} {...fade(0.08 * i)}
                  className="glass-card p-5 flex items-center gap-5"
                  style={{ borderColor:'rgba(239,68,68,0.18)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'rgba(239,68,68,0.15)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.3)' }}>
                    {p.icon}
                  </div>
                  <div>
                    <p className="font-display text-3xl text-white leading-none mb-1"
                      style={{ textShadow:'0 0 15px rgba(239,68,68,0.4)' }}>{p.stat}</p>
                    <p className="text-gray-400 text-sm">{p.label}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ BEFORE vs AFTER NOVA ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">The difference</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-3"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
              Before vs <span className="gradient-text">after Nova.</span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto leading-relaxed">
              Same business. Same calls. Different outcome.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* BEFORE */}
            <motion.div {...slideL()}
              className="relative rounded-2xl overflow-hidden"
              style={{ border:'2px solid rgba(239,68,68,0.35)', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background:'rgba(239,68,68,0.18)', border:'1px solid rgba(239,68,68,0.5)', backdropFilter:'blur(8px)' }}>
                <PhoneOff className="w-4 h-4 text-red-400"/>
                <span className="text-red-400 text-xs font-black uppercase tracking-wider">Before Nova</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.beforeNova} alt="Before Nova — missed calls and lost leads" loading="lazy"
                className="w-full h-auto block"/>
              <div className="p-5 bg-[#0a0f1e]">
                <p className="text-white font-bold mb-1">Calls go to voicemail. Leads go to competitors.</p>
                <p className="text-gray-400 text-sm">Phone rings, no answer, customer hangs up and dials the next contractor.</p>
              </div>
            </motion.div>

            {/* AFTER */}
            <motion.div {...slideR(0.1)}
              className="relative rounded-2xl overflow-hidden"
              style={{ border:'2px solid rgba(34,197,94,0.45)', boxShadow:'0 0 60px rgba(34,197,94,0.15), 0 20px 60px rgba(0,0,0,0.5)' }}>
              <div className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{ background:'rgba(34,197,94,0.18)', border:'1px solid rgba(34,197,94,0.5)', backdropFilter:'blur(8px)' }}>
                <Phone className="w-4 h-4 text-green-400"/>
                <span className="text-green-400 text-xs font-black uppercase tracking-wider">After Nova</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.solution} alt="After Nova — every call captured and converted" loading="lazy"
                className="w-full h-auto block"/>
              <div className="p-5 bg-[#0a0f1e]">
                <p className="text-white font-bold mb-1">Every call answered. Every lead captured.</p>
                <p className="text-gray-400 text-sm">Nova picks up on the first ring, qualifies the caller, and texts you the lead instantly.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ SOLUTION ══════════ */}
      <section className="py-24 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="cyan"/>
        <GridOverlay gridOp={0.25} dotOp={0.1}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-14">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">The solution</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Meet <span className="gradient-text">Nova.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Your 24/7 AI receptionist. Answers, qualifies, books, and texts you every lead.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div {...slideL()} className="relative">
              <div className="absolute -inset-4 rounded-3xl"
                style={{ background:'linear-gradient(135deg,rgba(37,99,235,0.3),rgba(124,58,237,0.25))', filter:'blur(50px)' }}/>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={IMG.novaPortrait} alt="Nova — AI receptionist" loading="lazy"
                className="relative rounded-3xl w-full aspect-square object-cover"
                style={{ border:'2px solid rgba(37,99,235,0.3)', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}/>
            </motion.div>

            <motion.div {...slideR(0.1)}>
              <h3 className="font-display text-4xl text-white mb-5 leading-tight">
                Sounds Human.<br/>
                <span className="gradient-text">Works 24/7.</span><br/>
                Never Calls In Sick.
              </h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Nova picks up on the first ring, asks the exact questions you would,
                and sends you the lead — name, number, job, urgency — before the
                call even ends.
              </p>
              <div className="space-y-3">
                {[
                  'Speaks naturally — not a robot',
                  'Captures every lead automatically',
                  'Books jobs while you work',
                  'Texts you the second a call ends',
                ].map((p, i) => (
                  <motion.div key={i} {...fade(0.06 * i)} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.4)' }}>
                      <CheckCircle2 className="w-4 h-4 text-green-400"/>
                    </div>
                    <span className="text-white font-medium">{p}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES GRID ══════════ */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <ParticleCanvas/>
        <SectionOrbs variant="blue"/>
        <GridOverlay gridOp={0.2} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-14">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Features</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Everything <span className="gradient-text">included.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Not just an AI — a complete missed-call recovery system.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={i} {...fade(0.04 * i)}
                whileHover={{ y:-4, scale:1.02 }}
                className="glass-card p-6 group"
                style={{ borderColor:`${f.color}25` }}>
                <motion.div
                  animate={{ boxShadow:[`0 0 8px ${f.color}40`,`0 0 18px ${f.color}80`,`0 0 8px ${f.color}40`] }}
                  transition={{ duration:2.5 + i * 0.2, repeat:Infinity }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${f.color}18`, color:f.color, border:`1px solid ${f.color}40` }}>
                  {f.icon}
                </motion.div>
                <h4 className="text-white font-bold text-base mb-2">{f.title}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ DEMO FLOW (5 STEPS) ══════════ */}
      <section className="py-24 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.22} dotOp={0.08}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-14">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Demo flow</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
              What happens <span className="gradient-text">when you call.</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <motion.div key={i} {...slideL(0.07 * i)}
                className="flex gap-5 glass-card p-6">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-display text-2xl"
                  style={{ background:'linear-gradient(135deg,#3b82f6,#7c3aed)', color:'#fff', boxShadow:'0 0 20px rgba(59,130,246,0.4)' }}>
                  {s.n}
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-1">{s.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ BUNDLE OFFER ══════════ */}
      <section id="bundle" className="py-24 bg-[#030712] relative overflow-hidden">
        <ParticleCanvas/>
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.25} dotOp={0.1}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-12">
            <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Pricing</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}>
              Stop losing jobs<br/>
              <span className="gradient-text">from missed calls.</span>
            </h2>
            <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Nova answers calls, captures leads, books appointments, and follows up automatically
              so small businesses can turn more calls into paying customers.
            </p>
          </motion.div>

          {/* Compact "what's inside" row — 3 icons, no card clutter */}
          <motion.div {...fade(0.1)} className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-10 max-w-3xl mx-auto">
            {STACK.map((s, i) => (
              <div key={i} className="flex items-center gap-2.5 px-4 py-2 rounded-full"
                style={{ background:`${s.color}12`, border:`1px solid ${s.color}35` }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="text-white font-semibold text-sm whitespace-nowrap">{s.title}</span>
                {i < STACK.length - 1 && <span className="text-gray-600 ml-1 hidden md:inline">+</span>}
              </div>
            ))}
          </motion.div>


          {/* Monthly / Annual toggle */}
          <BillingToggle value={billing} onChange={setBilling} className="mb-8" />

          {/* Three-tier pricing grid */}
          {err && <p className="text-red-400 text-sm text-center mb-4">{err}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {TIERS.map((tier, i) => (
              <motion.div key={tier.id} {...fade(0.08 * i)}
                whileHover={{ y: -6 }}
                className="relative p-px rounded-[22px]"
                style={{
                  background: tier.popular
                    ? `linear-gradient(135deg,${tier.color}cc,${tier.color}66,#06b6d488)`
                    : `linear-gradient(135deg,${tier.color}55,rgba(255,255,255,0.06))`,
                  boxShadow: tier.popular
                    ? `0 0 60px ${tier.color}40, 0 0 100px ${tier.color}20`
                    : `0 0 30px rgba(0,0,0,0.4)`,
                  transform: tier.popular ? 'scale(1.04)' : 'scale(1)',
                }}>

                {/* Popular badge */}
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      animate={{ boxShadow:[
                        `0 0 14px ${tier.color}99`,
                        `0 0 28px ${tier.color}cc`,
                        `0 0 14px ${tier.color}99`,
                      ]}}
                      transition={{ duration:2, repeat:Infinity }}
                      className="text-white text-xs font-black px-4 py-1.5 rounded-full inline-flex items-center gap-1.5 whitespace-nowrap"
                      style={{ background:`linear-gradient(135deg,${tier.color},#06b6d4)` }}>
                      <Zap className="w-3 h-3"/> MOST POPULAR
                    </motion.div>
                  </div>
                )}

                <div className="rounded-[21px] p-6 md:p-7 h-full flex flex-col"
                  style={{
                    background: 'rgba(5,12,22,0.97)',
                    backdropFilter: 'blur(24px)',
                  }}>

                  {/* Plan name */}
                  <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-1">
                    {tier.name}
                  </p>
                  {/* Positioning line — outcome focused */}
                  <p className="text-gray-300 text-sm leading-snug mb-4 min-h-[44px]">
                    {tier.positioning}
                  </p>

                  {/* Price — flips with billing toggle */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-6xl text-white"
                      style={{ textShadow:`0 0 25px ${tier.color}55` }}>
                      ${billing === 'annual' ? tier.priceAnnual.toLocaleString() : tier.price}
                    </span>
                    <span className="text-gray-300 text-sm mb-2 ml-1">
                      {billing === 'annual' ? '/yr' : '/mo'}
                    </span>
                  </div>

                  {billing === 'annual' && (
                    <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 mb-1.5"
                      style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.35)' }}>
                      <span className="text-green-400 text-xs font-bold">
                        Save ${tier.annualSavings} · 2 months free
                      </span>
                    </div>
                  )}

                  <p className="text-sm font-semibold mb-5" style={{ color: tier.color }}>
                    {tier.callsLabel}
                  </p>

                  {/* Features — brighter text + bigger line height */}
                  <ul className="space-y-3 mb-7 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0"
                          style={{ color: tier.color }}/>
                        <span className="text-gray-100">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Outcome-based CTA */}
                  <motion.button
                    onClick={() => handleBuy(tier)}
                    disabled={loadingId !== null}
                    whileHover={{ scale: loadingId ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60"
                    animate={tier.popular ? {
                      backgroundImage:[
                        'linear-gradient(135deg,#22c55e,#06b6d4)',
                        'linear-gradient(135deg,#06b6d4,#3b82f6)',
                        'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                        'linear-gradient(135deg,#8b5cf6,#22c55e)',
                      ],
                      boxShadow:[
                        '0 0 22px rgba(34,197,94,0.55)',
                        '0 0 22px rgba(6,182,212,0.55)',
                        '0 0 22px rgba(59,130,246,0.55)',
                        '0 0 22px rgba(139,92,246,0.55)',
                      ],
                    } : { backgroundImage: `linear-gradient(135deg,${tier.color},${tier.color}cc)` }}
                    transition={tier.popular
                      ? { duration: 4.2, repeat: Infinity, ease:'linear' }
                      : { duration: 0.3 }}
                    style={!tier.popular ? { boxShadow: `0 0 18px ${tier.color}55` } : undefined}>
                    {loadingId === tier.id
                      ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                      : <>{tier.ctaLabel} <ArrowRight className="w-4 h-4"/></>}
                  </motion.button>

                  {/* ── 30-day FREE trial — Growth plan only ─────────────── */}
                  {(tier.id === 'starter' || tier.id === 'growth') && (
                    <>
                      <div className="flex items-center gap-2 my-3">
                        <div className="flex-1 h-px bg-white/10"/>
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-white/10"/>
                      </div>
                      <motion.button
                        onClick={() => handleTrial(tier)}
                        disabled={loadingId !== null}
                        whileHover={{ scale: loadingId ? 1 : 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                        style={{
                          background: 'rgba(255,193,7,0.12)',
                          border: '1.5px solid rgba(255,193,7,0.5)',
                          color: '#fde68a',
                          boxShadow: '0 0 14px rgba(255,193,7,0.18)',
                        }}>
                        {loadingId === `${tier.id}-trial`
                          ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                          : <>🎁 Try Free 30 Days — Only $147 Setup</>}
                      </motion.button>
                      <p className="text-center text-gray-500 text-[11px] mt-2 leading-relaxed">
                        First month FREE · No charge for 30 days · Cancel before day 30 = pay nothing further
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Setup fee + trust strip */}
          <motion.div {...fade(0.3)} className="max-w-3xl mx-auto">
            <div className="rounded-2xl p-5 md:p-6 mb-5 text-center"
              style={{ background:'rgba(255,193,7,0.10)', border:'1.5px solid rgba(255,193,7,0.4)', boxShadow:'0 0 24px rgba(255,193,7,0.12)' }}>
              <p className="text-yellow-300 font-bold text-base mb-2">
                👉 One-Time Setup Fee: <span className="text-white text-xl">$147</span>
                <span className="text-green-400 font-bold text-xs ml-2">· Auto-added at checkout</span>
              </p>
              <p className="text-gray-200 text-sm leading-relaxed">
                Includes phone number setup, Nova voice training, business script setup,
                appointment rules, call routing, and assistant configuration.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon:<Zap className="w-4 h-4"/>,    text:'Setup in 24-48 hrs' },
                { icon:<Shield className="w-4 h-4"/>, text:'Cancel anytime'     },
                { icon:<Bell className="w-4 h-4"/>,   text:'Only 10 spots left' },
              ].map((t, i) => (
                <div key={i} className="text-center p-3 rounded-xl"
                  style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <div className="text-blue-400 flex justify-center mb-1">{t.icon}</div>
                  <p className="text-gray-300 text-xs font-semibold">{t.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ COST OF A MISSED CALL ══════════ */}
      <section className="py-20 relative overflow-hidden bg-[#040a16]">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">The math</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
              What is one missed call<br/>
              <span className="gradient-text-warm">costing you?</span>
            </h2>
            <p className="text-gray-200 text-lg max-w-2xl mx-auto leading-relaxed">
              Every unanswered phone call is money walking into a competitor&apos;s pocket.
              Here&apos;s what one lost lead is really worth:
            </p>
          </motion.div>

          {/* Cost cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-10">
            {[
              { emoji:'🔨',  label:'Contractor job',         range:'$5,000–$20,000+' },
              { emoji:'🏠',  label:'Roof replacement',       range:'$10,000+'        },
              { emoji:'🚿',  label:'Bathroom remodel',       range:'$8,000–$15,000+' },
              { emoji:'🦷',  label:'Dentist new patient',    range:'$500–$2,000+'    },
              { emoji:'🍽️',  label:'Restaurant catering',    range:'$300–$2,500+'    },
            ].map((c, i) => (
              <motion.div key={i} {...fade(0.05 * i)}
                className="rounded-2xl p-4 md:p-5 text-center"
                style={{
                  background: 'rgba(239,68,68,0.06)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  boxShadow: '0 0 24px rgba(239,68,68,0.08)',
                }}>
                <div className="text-3xl mb-2">{c.emoji}</div>
                <p className="text-gray-100 text-xs md:text-sm font-bold mb-2 leading-tight">{c.label}</p>
                <p className="font-display text-base md:text-lg text-white whitespace-nowrap"
                  style={{ textShadow:'0 0 12px rgba(239,68,68,0.5)' }}>
                  {c.range}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Summary + CTA */}
          <motion.div {...fade(0.2)} className="text-center max-w-3xl mx-auto">
            <p className="text-gray-100 text-lg md:text-xl leading-relaxed mb-6">
              If Nova helps you save just <span className="text-yellow-300 font-bold">one missed opportunity</span>,
              it can pay for itself many times over.
            </p>
            <a href="#bundle"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-white text-base"
              style={{
                background:'linear-gradient(135deg,#22c55e,#06b6d4,#3b82f6)',
                boxShadow:'0 0 28px rgba(34,197,94,0.55), 0 8px 24px rgba(0,0,0,0.4)',
              }}>
              Never Miss Another Lead <ArrowRight className="w-5 h-5"/>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ══════════ ROI CALCULATOR + COMPARISON ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Run the numbers</p>
            <h2 className="font-display text-white tracking-tight leading-[1.05]"
              style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}>
              See exactly <span className="gradient-text">what Nova</span><br/>
              will make you.
            </h2>
          </motion.div>

          <ROICalculator/>
        </div>
      </section>

      {/* ══════════ NOVA vs HUMAN vs VOICEMAIL ══════════ */}
      <section className="py-20 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="blue"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="neon-badge mb-4 mx-auto w-fit">The Comparison</p>
            <h2 className="font-display text-4xl md:text-6xl text-white mb-3 leading-tight">
              NOVA vs THE <span className="gradient-text">ALTERNATIVES</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
            {[
              { title:'Voicemail',          tag:'Free, but expensive',     price:'$0/mo',
                rows:[
                  { label:'Answers calls',         val:false },
                  { label:'Captures lead info',    val:false },
                  { label:'Books appointments',    val:false },
                  { label:'Follows up after',      val:false },
                  { label:'Available 24/7',        val:false },
                  { label:'Lost revenue',          val:'Massive', bad:true },
                ],
                color:'#ef4444', popular:false,
              },
              { title:'Nova AI',          tag:'You',                    price:'$77–$247/mo',
                rows:[
                  { label:'Answers calls',         val:true },
                  { label:'Captures lead info',    val:true },
                  { label:'Books appointments',    val:true },
                  { label:'Follows up after',      val:true },
                  { label:'Available 24/7',        val:true },
                  { label:'Lost revenue',          val:'Near zero' },
                ],
                color:'#22c55e', popular:true,
              },
              { title:'Human Receptionist', tag:'The old way',             price:'$3,500+/mo',
                rows:[
                  { label:'Answers calls',         val:true },
                  { label:'Captures lead info',    val:true },
                  { label:'Books appointments',    val:true },
                  { label:'Follows up after',      val:'Sometimes' },
                  { label:'Available 24/7',        val:false },
                  { label:'Lost revenue',          val:'Some', bad:true },
                ],
                color:'#a855f7', popular:false,
              },
            ].map((col, i) => (
              <motion.div key={i} {...fade(0.08 * i)}
                className="relative p-px rounded-2xl"
                style={{
                  background: col.popular
                    ? `linear-gradient(135deg,${col.color}cc,${col.color}66,#06b6d488)`
                    : `linear-gradient(135deg,${col.color}55,rgba(255,255,255,0.05))`,
                  boxShadow: col.popular ? `0 0 50px ${col.color}40` : 'none',
                  transform: col.popular ? 'scale(1.04)' : 'scale(1)',
                }}>
                {col.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 text-white text-[10px] font-black px-3 py-1 rounded-full whitespace-nowrap"
                    style={{ background:`linear-gradient(135deg,${col.color},#06b6d4)`, boxShadow:`0 0 14px ${col.color}99` }}>
                    👇 YOUR BEST OPTION
                  </div>
                )}
                <div className="rounded-[15px] p-6"
                  style={{ background:'rgba(5,12,22,0.97)' }}>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{col.tag}</p>
                  <h3 className="font-display text-3xl text-white mb-1">{col.title}</h3>
                  <p className="text-sm font-bold mb-5" style={{ color: col.color }}>{col.price}</p>

                  <ul className="space-y-2.5">
                    {col.rows.map((r, j) => (
                      <li key={j} className="flex items-center justify-between text-sm gap-2">
                        <span className="text-gray-300">{r.label}</span>
                        <span className="font-bold text-right flex-shrink-0">
                          {r.val === true && <span className="text-green-400">✓</span>}
                          {r.val === false && <span className="text-red-400">✗</span>}
                          {typeof r.val === 'string' && (
                            <span className={r.bad ? 'text-red-400 text-xs' : 'text-green-400 text-xs'}>
                              {r.val}
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-gray-300 text-base mt-8 max-w-2xl mx-auto">
            A human receptionist costs <strong className="text-white">$3,500+/month</strong> and goes home at 5 pm.
            Nova works <strong className="text-white">24/7 for ~10% of the price.</strong>
          </p>
        </div>
      </section>

      {/* ══════════ SOCIAL PROOF / TESTIMONIALS ══════════ */}
      <section className="py-16 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="cyan"/>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="neon-badge mb-3 mx-auto w-fit">Real Results</p>
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">
              BUSINESSES <span className="gradient-text">USING NOVA</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              { quote:'Nova caught 14 calls our voicemail would have lost in the first week. Booked 3 jobs that night.', name:'Mike R.', role:'Roofing Contractor · Tulsa, OK', stars:5, color:'#22c55e' },
              { quote:'Cancelled my answering service ($425/mo) the day Nova went live. Better quality calls, fraction of the cost.', name:'Sarah L.', role:'Dental Practice · Austin, TX', stars:5, color:'#3b82f6' },
              { quote:'Customers told us they thought Nova was a real receptionist. Pays for itself with a single estimate booking.', name:'Jorge M.', role:'HVAC · Phoenix, AZ', stars:5, color:'#a855f7' },
            ].map((t, i) => (
              <motion.div key={i} {...fade(0.08 * i)}
                className="rounded-2xl p-6"
                style={{ background:`${t.color}10`, border:`1px solid ${t.color}30`, boxShadow:`0 0 24px ${t.color}10` }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, k) => (
                    <span key={k} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-100 text-base leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </motion.div>
            ))}
          </div>

          {/* Trust strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mt-10 text-xs text-gray-300">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)' }}>
              ✅ <strong>30-Day Money-Back Guarantee</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:'rgba(59,130,246,0.1)', border:'1px solid rgba(59,130,246,0.3)' }}>
              ⚡ <strong>Live in 24-48 hrs</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:'rgba(168,85,247,0.1)', border:'1px solid rgba(168,85,247,0.3)' }}>
              🔒 <strong>Cancel anytime</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background:'rgba(251,191,36,0.1)', border:'1px solid rgba(251,191,36,0.3)' }}>
              💳 <strong>Secure Stripe checkout</strong>
            </span>
          </div>
        </div>
      </section>

      {/* ══════════ MEGA BUNDLE — NOVA + WEBSITE ══════════ */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#030712 0%,#0a0f1e 50%,#030712 100%)' }}>
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.2} dotOp={0.08}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          <motion.div {...fade()} className="text-center mb-10">
            <motion.div
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-5"
              style={{ background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.5)' }}>
              <span className="text-yellow-300 font-bold text-xs tracking-widest">🎁 BEST VALUE BUNDLE</span>
            </motion.div>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(6,182,212,0.25)' }}>
              NOVA + <span className="gradient-text">LEAD WEBSITE</span>
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Pair Nova with a high-converting website that captures leads even when she&apos;s not on a call.
              <span className="block mt-2 text-gray-400 text-base">Two products, one bundled price, one setup fee.</span>
            </p>
          </motion.div>

          {/* Bundle card */}
          <motion.div {...fade(0.15)} className="relative max-w-3xl mx-auto">
            <div className="absolute -inset-4 rounded-[28px] pointer-events-none"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.45),rgba(6,182,212,0.35),rgba(59,130,246,0.3))', filter:'blur(48px)', opacity:0.55 }}/>
            <div className="relative p-px rounded-[24px]"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.6),rgba(6,182,212,0.5),rgba(139,92,246,0.4))' }}>
              <div className="rounded-[23px] p-8 md:p-10"
                style={{ background:'rgba(5,12,22,0.97)', backdropFilter:'blur(24px)' }}>

                {/* Two-column comparison */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Nova column */}
                  <div className="rounded-2xl p-5"
                    style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.3)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'rgba(34,197,94,0.18)', border:'1px solid rgba(34,197,94,0.4)' }}>
                        <Bot className="w-5 h-5 text-green-400"/>
                      </div>
                      <p className="text-white font-bold">Nova Growth</p>
                    </div>
                    <p className="text-green-400 text-2xl font-display mb-1">$147<span className="text-sm text-gray-400">/mo</span></p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Answers every call 24/7</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Books appointments + SMS</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-green-400"/> Live transfer when you&apos;re free</li>
                    </ul>
                  </div>

                  {/* Website column */}
                  <div className="rounded-2xl p-5"
                    style={{ background:'rgba(139,92,246,0.06)', border:'1px solid rgba(139,92,246,0.3)' }}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ background:'rgba(139,92,246,0.18)', border:'1px solid rgba(139,92,246,0.4)' }}>
                        <TrendingUp className="w-5 h-5 text-purple-400"/>
                      </div>
                      <p className="text-white font-bold">Lead Website</p>
                    </div>
                    <p className="text-purple-400 text-2xl font-display mb-1">$97<span className="text-sm text-gray-400">/mo</span></p>
                    <ul className="space-y-1.5 text-xs text-gray-300">
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> Custom-built lead-gen site</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> SEO + mobile optimized</li>
                      <li className="flex items-start gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-purple-400"/> Lead form connected to Nova</li>
                    </ul>
                  </div>
                </div>

                {/* Plus equals */}
                <div className="flex items-center justify-center gap-3 mb-6 text-gray-500 text-sm">
                  <span className="line-through">Separately: <span className="text-white font-bold">$244/mo</span></span>
                  <span>·</span>
                  <span className="text-green-400 font-bold">Bundle saves $47/mo</span>
                </div>

                {/* Bundle price */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">Bundle Price</p>
                  <div className="flex items-end justify-center gap-2 mb-2">
                    <span className="font-display text-7xl md:text-8xl text-white"
                      style={{ textShadow:'0 0 40px rgba(34,197,94,0.5)' }}>
                      $197
                    </span>
                    <span className="text-gray-400 text-2xl mb-3">/mo</span>
                  </div>
                  <p className="text-blue-400 text-sm font-semibold">+ $197 one-time setup (saves $197 vs. paying both setups)</p>
                </div>

                {/* Buy button */}
                <motion.button
                  onClick={() => { setErr(''); setBundleModalOpen(true); }}
                  disabled={loadingId !== null}
                  whileHover={{ scale: loadingId ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60"
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
                  transition={{ duration: 4.2, repeat: Infinity, ease:'linear' }}>
                  {loadingId === 'bundle-mega'
                    ? <><Loader2 className="w-5 h-5 animate-spin"/> Redirecting...</>
                    : <>Get the Full Bundle — Save $761 Year 1 <ArrowRight className="w-5 h-5"/></>}
                </motion.button>

                <div className="grid grid-cols-3 gap-2 mt-5 text-center">
                  <div className="text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">Save $197</span>
                    setup fees
                  </div>
                  <div className="text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">Save $47</span>
                    /month
                  </div>
                  <div className="text-xs text-gray-400 py-2 rounded-lg" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.06)' }}>
                    <span className="block text-green-400 font-bold mb-0.5">$761</span>
                    saved Year 1
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ UPSELL / ADD-ONS ══════════ */}
      <section className="py-24 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.2} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-12">
            <p className="neon-badge mb-5 mx-auto w-fit">Add-Ons</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-5 leading-none">
              SCALE UP <span className="gradient-text">ANYTIME</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Start with the bundle. Add modules as you grow.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { id:'addon-volume', title:'Extra Call Volume', price:'+$47/mo',  priceCents: 4700,  color:'#3b82f6', desc:'200 extra calls/month for high-traffic businesses pushing past the included minutes.' },
              { id:'addon-crm',    title:'CRM System',         price:'+$77/mo',  priceCents: 7700,  color:'#8b5cf6', desc:'Pipeline, contact history, and task automation built-in.' },
              { id:'addon-ads',    title:'Google Ads',         price:'+$247/mo', priceCents: 24700, color:'#10b981', desc:'Pro ad management — pay-per-click campaigns we run for you.' },
              { id:'addon-seo',    title:'SEO Pages',          price:'+$497',    priceCents: 49700, color:'#f97316', desc:'Niche-targeted landing pages that rank for local searches.' },
            ].map((a, i) => (
              <motion.div key={a.id} {...fade(0.06 * i)}
                whileHover={{ y:-3 }}
                className="glass-card p-6 text-center flex flex-col"
                style={{ borderColor: `${a.color}30` }}>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Add-on</p>
                <h4 className="text-white font-bold text-lg mb-2">{a.title}</h4>
                <p className="font-display text-3xl gradient-text mb-3">{a.price}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{a.desc}</p>

                <motion.button
                  onClick={async () => {
                    setLoadingId(a.id); setErr('');
                    try {
                      const res = await fetch('/api/create-checkout-session', {
                        method:'POST', headers:{'Content-Type':'application/json'},
                        body: JSON.stringify({
                          productName: `${a.title} — Add-on`,
                          amount:       a.priceCents,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
                      window.location.href = data.url;
                    } catch (e:unknown) {
                      setErr(e instanceof Error ? e.message : 'Something went wrong');
                      setLoadingId(null);
                    }
                  }}
                  disabled={loadingId !== null}
                  whileHover={{ scale: loadingId ? 1 : 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full py-2.5 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{
                    background: `linear-gradient(135deg, ${a.color}, ${a.color}cc)`,
                    boxShadow: `0 0 16px ${a.color}55`,
                  }}>
                  {loadingId === a.id
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                    : <>Add to Plan <ArrowRight className="w-4 h-4"/></>}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <StaticElectricity/>
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.3} dotOp={0.1}/>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fade()}>
            <motion.div
              animate={{ scale:[1,1.04,1] }}
              transition={{ duration:2, repeat:Infinity }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-full px-5 py-2 mb-5">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
              <span className="text-red-400 font-bold text-xs tracking-wide">ONLY 10 BUSINESSES THIS MONTH</span>
            </motion.div>

            <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(6,182,212,0.25)' }}>
              STOP MISSING<br/>
              <span className="gradient-text">JOBS TODAY</span>
            </h2>
            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Call Nova. Hear it work. Then we&apos;ll have you live in 24-48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap mb-6">
              <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
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
                className="px-10 py-5 rounded-full font-bold text-white text-lg inline-flex items-center justify-center gap-2">
                <Phone className="w-6 h-6"/> Call Nova: {NOVA_NUMBER}
              </motion.a>
              <FreeDemoButton size="md" label="Get a Free Website Preview" rounded="full" />
            </div>

            <p className="text-gray-600 text-sm mt-6">
              Setup in 24-48 hrs · Cancel anytime · No credit card to test the demo
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upsell modal — Nova tiers */}
      {modalTier && (
        <CheckoutUpsellModal
          open={modalTier !== null}
          onClose={() => setModalTier(null)}
          context="nova"
          planName={`${modalTier.name} Plan${billing === 'annual' ? ' · Annual' : ''}`}
          planAmount={billing === 'annual' ? modalTier.priceCentsAnnual : modalTier.priceCents}
          planPriceLabel={billing === 'annual' ? `$${modalTier.priceAnnual.toLocaleString()}/yr` : `$${modalTier.price}/mo`}
          setupFeeCents={14700}
          setupFeeName="One-Time Setup Fee ($147)"
          productName={`Never Miss a Call — ${modalTier.name} Plan${billing === 'annual' ? ' · Annual (saves $' + modalTier.annualSavings + ')' : ''}`}
          loading={loadingId === modalTier.id}
          onConfirm={(payload) => submitToStripe(payload, modalTier.id)}
        />
      )}

      {/* Upsell modal — Mega bundle (Nova + Website) */}
      <CheckoutUpsellModal
        open={bundleModalOpen}
        onClose={() => setBundleModalOpen(false)}
        context="bundle"
        planName="Nova + Lead Website Bundle"
        planAmount={19700}
        planPriceLabel="$197/mo"
        setupFeeCents={19700}
        setupFeeName="One-Time Setup ($197) — phone, Nova training, website launch"
        productName="Nova + Lead Website Bundle"
        loading={loadingId === 'bundle-mega'}
        onConfirm={(payload) => submitToStripe(payload, 'bundle-mega')}
      />

    </div>
  );
}
