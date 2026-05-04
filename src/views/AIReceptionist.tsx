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

interface Tier {
  id:        string;
  name:      string;
  tag:       string;
  price:     number;
  priceMax?: number;       // for ranges like Pro $297–$397
  priceCents:number;       // amount sent to Stripe
  callsLabel:string;
  features:  string[];
  color:     string;
  popular:   boolean;
}

const TIERS: Tier[] = [
  {
    id: 'starter',
    name: 'Starter',
    tag: 'Gets foot in door',
    price: 97,
    priceCents: 9700,
    callsLabel: '50–100 calls / month',
    features: [
      'Basic answering + lead capture',
      'Local number in your area code',
      'Instant text + email alerts',
      'Missed-call auto-text reply',
      '24/7 coverage',
    ],
    color: '#3b82f6',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    tag: 'MOST POPULAR',
    price: 197,
    priceCents: 19700,
    callsLabel: '200–300 calls / month',
    features: [
      'Everything in Starter',
      'Appointment booking',
      'SMS conversations with callers',
      'Live transfer when you\'re free',
      'Lead-capture website included',
    ],
    color: '#10b981',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    tag: 'Serious businesses',
    price: 297,
    priceMax: 397,
    priceCents: 29700,
    callsLabel: 'Unlimited / high volume',
    features: [
      'Everything in Growth',
      'CRM system included',
      'Day 1 / Day 3 / Day 7 follow-ups',
      'Priority support',
      'Custom integrations',
    ],
    color: '#a855f7',
    popular: false,
  },
];

export default function AIReceptionist() {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [err, setErr]             = useState('');

  const handleBuy = async (tier: Tier) => {
    setLoadingId(tier.id); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          productName:  `Never Miss a Call — ${tier.name} Plan`,
          amount:        tier.priceCents,
          setupFee:      19700,                     // $197 auto-added at checkout
          setupFeeName: 'One-Time Setup Fee ($197)',
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

  // 30-day free trial of Growth — customer pays only the $197 setup fee
  const handleTrial = async (tier: Tier) => {
    setLoadingId(`${tier.id}-trial`); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          productName: `${tier.name} Plan — 30 Day FREE Trial (first month free, $${tier.price}/mo after)`,
          amount:       19700,  // $197 setup only — no monthly charge today
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
              {/* Both pills — left-aligned, wrap on small screens */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ duration: 2.2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-full px-4 py-1.5">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                  <span className="text-red-400 font-bold text-xs tracking-wide">ONLY 10 SPOTS THIS MONTH</span>
                </motion.div>

                <motion.div
                  animate={{ boxShadow:[
                    '0 0 14px rgba(255,193,7,0.3)',
                    '0 0 24px rgba(255,193,7,0.55)',
                    '0 0 14px rgba(255,193,7,0.3)',
                  ]}}
                  transition={{ duration: 2.4, repeat: Infinity }}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-1.5"
                  style={{ background:'rgba(255,193,7,0.12)', border:'1px solid rgba(255,193,7,0.5)' }}>
                  <span className="text-yellow-300 font-bold text-xs tracking-wide">
                    🎁 Try Nova FREE for 30 Days · Just $197 Setup
                  </span>
                </motion.div>
              </div>

              <h1 className="font-display leading-none text-white mb-6"
                style={{ fontSize:'clamp(3rem, 8vw, 6.5rem)', textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
                NEVER MISS<br/>
                <span className="gradient-text">ANOTHER CALL</span>
              </h1>

              <p className="text-gray-300 text-xl leading-relaxed mb-8 max-w-xl">
                Our AI receptionist <strong className="text-white">Nova</strong> answers every call —
                day, night, weekends — books jobs and texts you the lead instantly.
                <span className="block mt-3 text-gray-400">
                  Miss 2 jobs a week? That&apos;s $2,000–$5,000 lost. Stop it today.
                </span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
                  whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }}
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
                  className="px-8 py-4 rounded-full font-bold text-white text-base inline-flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5"/> Call Nova: {NOVA_NUMBER}
                </motion.a>
                <a href="#try-it-live"
                  className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                  <Mic className="w-4 h-4 text-blue-400"/> Try Nova Now <ArrowRight className="w-4 h-4"/>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Setup in 24-48 hrs</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Local number for your area</span>
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
            <p className="neon-badge mb-5 mx-auto w-fit">📞 Try It Live</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-5 leading-none"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4), 0 0 80px rgba(6,182,212,0.25)' }}>
              CALL NOVA<br/>
              <span className="gradient-text">RIGHT NOW</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
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
            <p className="neon-badge mb-5 mx-auto w-fit" style={{ borderColor:'rgba(239,68,68,0.5)', color:'#fca5a5' }}>The Problem</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-5 leading-none">
              MISSED CALLS =<br/>
              <span className="gradient-text-warm">LOST MONEY</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
            <p className="neon-badge mb-4 mx-auto w-fit">The Difference</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-3 leading-none">
              BEFORE vs <span className="gradient-text">AFTER NOVA</span>
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
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
            <p className="neon-badge mb-5 mx-auto w-fit">The Solution</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-5 leading-none">
              MEET<br/><span className="gradient-text">NOVA</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
            <p className="neon-badge mb-5 mx-auto w-fit">Features</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-5 leading-none">
              EVERYTHING <span className="gradient-text">INCLUDED</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
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
            <p className="neon-badge mb-5 mx-auto w-fit">Demo Flow</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-5 leading-none">
              WHAT HAPPENS<br/><span className="gradient-text">WHEN YOU CALL</span>
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
            <p className="neon-badge mb-5 mx-auto w-fit">Bundle Offer</p>
            <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none"
              style={{ textShadow:'0 0 60px rgba(34,197,94,0.4)' }}>
              THE NEVER MISS<br/>
              <span className="gradient-text">A CALL SYSTEM</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              AI Receptionist + Lead-Machine Website + Automation. One bundle. One price.
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

          {/* Pick a plan heading */}
          <motion.div {...fade(0.15)} className="text-center mb-7">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">Pick Your Plan</p>
            <h3 className="font-display text-3xl md:text-4xl text-white">
              Start where you are. Scale as you grow.
            </h3>
          </motion.div>

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
                      <Zap className="w-3 h-3"/> {tier.tag}
                    </motion.div>
                  </div>
                )}

                <div className="rounded-[21px] p-7 h-full flex flex-col"
                  style={{
                    background: 'rgba(5,12,22,0.97)',
                    backdropFilter: 'blur(24px)',
                  }}>

                  {/* Plan name */}
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                    {tier.name}
                  </p>
                  {!tier.popular && (
                    <p className="text-gray-500 text-xs mb-3">{tier.tag}</p>
                  )}
                  {tier.popular && <div className="mb-3"/>}

                  {/* Price */}
                  <div className="flex items-end gap-1 mb-1">
                    <span className="font-display text-5xl text-white"
                      style={{ textShadow:`0 0 25px ${tier.color}55` }}>
                      ${tier.price}
                    </span>
                    {tier.priceMax && (
                      <span className="text-gray-400 text-2xl mb-1">–${tier.priceMax}</span>
                    )}
                    <span className="text-gray-500 text-sm mb-2 ml-1">/mo</span>
                  </div>

                  <p className="text-blue-400 text-sm font-semibold mb-5">{tier.callsLabel}</p>

                  {/* Features */}
                  <ul className="space-y-2.5 mb-7 flex-1">
                    {tier.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: tier.color }}/>
                        <span className="text-gray-300">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <motion.button
                    onClick={() => handleBuy(tier)}
                    disabled={loadingId !== null}
                    whileHover={{ scale: loadingId ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
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
                      : <>Buy Now <ArrowRight className="w-4 h-4"/></>}
                  </motion.button>

                  {/* ── 30-day FREE trial — Growth plan only ─────────────── */}
                  {tier.id === 'growth' && (
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
                          : <>🎁 Try Free 30 Days — Only $197 Setup</>}
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
            <div className="rounded-2xl p-5 mb-5 text-center"
              style={{ background:'rgba(255,193,7,0.08)', border:'1px solid rgba(255,193,7,0.3)' }}>
              <p className="text-yellow-300 font-bold text-sm">
                👉 One-time Setup Fee: <span className="text-white text-base">$197</span>
                <span className="text-green-400 font-bold text-xs ml-2">· Auto-added at checkout</span>
                <span className="block text-gray-400 font-normal text-xs mt-1">
                  Includes phone setup, Nova training, and website launch
                </span>
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
              { id:'addon-volume', title:'Extra Call Volume', price:'+$50–100/mo', priceCents: 5000,  color:'#3b82f6', desc:'For high-traffic businesses pushing past the included minutes.' },
              { id:'addon-crm',    title:'CRM System',         price:'+$97/mo',     priceCents: 9700,  color:'#8b5cf6', desc:'Pipeline, contact history, and task automation built-in.' },
              { id:'addon-ads',    title:'Google Ads',         price:'+$300–1,000', priceCents: 30000, color:'#10b981', desc:'Pro ad management — pay-per-click campaigns we run for you.' },
              { id:'addon-seo',    title:'SEO Pages',          price:'+$500',       priceCents: 50000, color:'#f97316', desc:'Niche-targeted landing pages that rank for local searches.' },
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
                    : <>Buy Now <ArrowRight className="w-4 h-4"/></>}
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

    </div>
  );
}
