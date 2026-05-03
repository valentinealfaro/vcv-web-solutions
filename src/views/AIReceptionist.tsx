'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone, MessageSquare, ArrowRight, CheckCircle2, Clock, Bell, Sparkles,
  Zap, Shield, TrendingUp, Calendar, Bot, AlertTriangle, DollarSign,
  PhoneOff, Mic, BellRing, Smartphone, Headphones, Loader2,
} from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import {
  ParticleCanvas, StaticElectricity, MarqueeBand, SectionOrbs, GridOverlay,
} from '@/components/PageEffects';

const NOVA_NUMBER      = '(580) 656-9429';
const NOVA_NUMBER_RAW  = '+15806569429';
const VCV_NUMBER       = '+15809191386';

/* ─── Image placeholders — swap these later ─────────────────── */
const IMG = {
  hero:        'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1200&q=70',
  novaPortrait:'https://images.unsplash.com/photo-1535378917042-10a22c95931a?auto=format&fit=crop&w=600&q=70',
  problem:     'https://images.unsplash.com/photo-1580974511812-23dbf83a39be?auto=format&fit=crop&w=1000&q=70',
  solution:    'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=70',
  contractor:  'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=600&q=70',
  dental:      'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&w=600&q=70',
  restaurant:  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=70',
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
  { icon:<Smartphone className="w-5 h-5"/>,   title:'Local 580 Number',             desc:'Caller ID shows your local area code so prospects actually answer.',      color:'#ec4899' },
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
  { n:5, title:'Soft Close',            desc:'"Valentine will reach out within 1 business day to get you set up."' },
];

const STACK = [
  {
    title:'AI Receptionist (Nova)',
    items:[
      'Answers every call instantly · 24/7',
      'Local 580 area-code number',
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

export default function AIReceptionist() {
  const [billing, setBilling] = useState<'monthly'|'annual'>('monthly');
  const [loading, setLoading] = useState(false);
  const [err, setErr]         = useState('');

  const handleBuy = async () => {
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          productName: `Never Miss a Call System — ${billing === 'annual' ? 'Annual' : 'Monthly'}`,
          amount:       billing === 'annual' ? 299700 : 29700,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e:unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
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
              <motion.div
                animate={{ scale: [1, 1.04, 1] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/40 rounded-full px-4 py-1.5 mb-5">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse"/>
                <span className="text-red-400 font-bold text-xs tracking-wide">ONLY 10 SPOTS THIS MONTH</span>
              </motion.div>

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
                <a href="#bundle"
                  className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                  See the Bundle <ArrowRight className="w-4 h-4"/>
                </a>
              </div>

              <div className="flex flex-wrap gap-4 mt-8 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Setup in 24-48 hrs</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Cancel anytime</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-400"/> Local 580 number</span>
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
      <section className="py-24 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.25} dotOp={0.1}/>

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

          {/* Big phone number card */}
          <motion.div {...fade(0.15)} className="relative max-w-2xl mx-auto mb-10">
            <div className="absolute -inset-4 rounded-[28px]"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.4),rgba(6,182,212,0.3),rgba(59,130,246,0.3))',
                filter:'blur(40px)' }}/>
            <motion.a href={`tel:${NOVA_NUMBER_RAW}`}
              whileHover={{ scale:1.02 }} whileTap={{ scale:0.98 }}
              className="relative block p-10 md:p-14 rounded-[24px] text-center"
              style={{ background:'rgba(5,15,25,0.95)', border:'2px solid rgba(34,197,94,0.5)',
                boxShadow:'0 0 60px rgba(34,197,94,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' }}>

              <motion.div
                animate={{ scale:[1,1.1,1] }}
                transition={{ duration:1.5, repeat:Infinity, ease:'easeInOut' }}
                className="w-20 h-20 mx-auto mb-5 rounded-full flex items-center justify-center"
                style={{ background:'linear-gradient(135deg,#22c55e,#06b6d4)',
                  boxShadow:'0 0 40px rgba(34,197,94,0.6)' }}>
                <Phone className="w-9 h-9 text-white"/>
              </motion.div>

              <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-3">📞 Call Nova Now</p>
              <p className="font-display text-5xl md:text-7xl text-white mb-4"
                style={{ textShadow:'0 0 30px rgba(34,197,94,0.6)' }}>
                {NOVA_NUMBER}
              </p>
              <p className="text-green-400 font-bold text-base mb-2">⚡ Live Demo · Answers in 1 Ring</p>
              <p className="text-gray-500 text-sm">Tap the number to call from your phone</p>
            </motion.a>
          </motion.div>

          {/* What to ask */}
          <motion.div {...fade(0.25)} className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {NICHES.map((n, i) => (
              <motion.div key={i} {...fade(0.05 * i)}
                className="glass-card p-5 text-left">
                <div className="aspect-video rounded-xl overflow-hidden mb-4 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={n.img} alt={n.label} loading="lazy"
                    className="w-full h-full object-cover"/>
                  <div className="absolute inset-0" style={{ background:'linear-gradient(to top, rgba(5,15,25,0.85), transparent)' }}/>
                </div>
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">If you&apos;re a</p>
                <p className="text-white font-bold text-lg mb-1">{n.label}</p>
                <p className="text-gray-400 text-sm">Roleplay: {n.copy}</p>
              </motion.div>
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

          {/* Stack of value */}
          <div className="grid md:grid-cols-3 gap-5 mb-12">
            {STACK.map((s, i) => (
              <motion.div key={i} {...fade(0.08 * i)}
                className="glass-card p-7"
                style={{ borderColor:`${s.color}30` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background:`${s.color}20`, color:s.color, border:`1px solid ${s.color}50` }}>
                  {s.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-4">{s.title}</h3>
                <ul className="space-y-2.5">
                  {s.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color:s.color }}/>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Pricing card */}
          <motion.div {...fade(0.2)} className="max-w-3xl mx-auto">
            <div className="relative p-px rounded-[24px]"
              style={{ background:'linear-gradient(135deg,rgba(34,197,94,0.5),rgba(6,182,212,0.4),rgba(59,130,246,0.3))',
                boxShadow:'0 0 80px rgba(34,197,94,0.15)' }}>
              <div className="rounded-[23px] p-8 md:p-10 text-center"
                style={{ background:'rgba(5,12,22,0.97)', backdropFilter:'blur(24px)' }}>

                {/* Toggle */}
                <div className="inline-flex p-1 rounded-full mb-6"
                  style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
                  {(['monthly','annual'] as const).map(b => (
                    <button key={b} onClick={() => setBilling(b)}
                      className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                        billing === b ? 'bg-white text-gray-900' : 'text-gray-400 hover:text-white'
                      }`}>
                      {b === 'monthly' ? 'Monthly' : 'Annual (save $600)'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-gray-600 text-2xl font-bold line-through decoration-red-500/70">
                    {billing === 'annual' ? '$5,964' : '$497'}
                  </span>
                  <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
                    50% OFF LAUNCH
                  </span>
                </div>

                <div className="flex items-end justify-center gap-2 mb-3">
                  <span className="font-display text-7xl md:text-8xl text-white"
                    style={{ textShadow:'0 0 40px rgba(34,197,94,0.5)' }}>
                    ${billing === 'annual' ? '2,997' : '297'}
                  </span>
                  <span className="text-gray-400 text-2xl mb-3">{billing === 'annual' ? '/yr' : '/mo'}</span>
                </div>

                {billing === 'monthly' && (
                  <p className="text-blue-400 text-sm font-semibold mb-4">+ $197 one-time setup fee</p>
                )}
                {billing === 'annual' && (
                  <p className="text-green-400 text-sm font-bold mb-4">✓ Save $600 · Setup fee waived</p>
                )}

                {err && <p className="text-red-400 text-xs mb-3">{err}</p>}

                <motion.button onClick={handleBuy} disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60 mb-3"
                  animate={{
                    backgroundImage:[
                      'linear-gradient(135deg,#22c55e,#06b6d4)',
                      'linear-gradient(135deg,#06b6d4,#3b82f6)',
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      'linear-gradient(135deg,#8b5cf6,#ec4899)',
                      'linear-gradient(135deg,#ec4899,#22c55e)',
                    ],
                    boxShadow:[
                      '0 0 24px rgba(34,197,94,0.55)',
                      '0 0 24px rgba(6,182,212,0.55)',
                      '0 0 24px rgba(59,130,246,0.55)',
                      '0 0 24px rgba(139,92,246,0.55)',
                      '0 0 24px rgba(236,72,153,0.55)',
                    ],
                  }}
                  transition={{ duration: 4.5, repeat: Infinity, ease:'linear' }}>
                  {loading
                    ? <><Loader2 className="w-5 h-5 animate-spin"/> Redirecting...</>
                    : <>Get Set Up — Live in 24-48hrs <ArrowRight className="w-5 h-5"/></>}
                </motion.button>

                <p className="text-gray-500 text-xs">
                  Secure checkout · Powered by Stripe · Cancel anytime
                </p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mt-6">
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
              { title:'Extra Call Volume', price:'+$50–100/mo', desc:'For high-traffic businesses pushing past the included minutes.' },
              { title:'CRM System',         price:'+$97/mo',     desc:'Pipeline, contact history, and task automation built-in.' },
              { title:'Google Ads',         price:'+$300–1,000', desc:'Pro ad management — pay-per-click campaigns we run for you.' },
              { title:'SEO Pages',          price:'+$500',       desc:'Niche-targeted landing pages that rank for local searches.' },
            ].map((a, i) => (
              <motion.div key={i} {...fade(0.06 * i)}
                whileHover={{ y:-3 }}
                className="glass-card p-6 text-center">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Add-on</p>
                <h4 className="text-white font-bold text-lg mb-2">{a.title}</h4>
                <p className="font-display text-3xl gradient-text mb-3">{a.price}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{a.desc}</p>
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

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
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
              <a href={`tel:${VCV_NUMBER}`}
                className="glass-card text-white px-10 py-5 rounded-full font-semibold text-base inline-flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                <MessageSquare className="w-5 h-5 text-blue-400"/> Talk to Valentine
              </a>
            </div>

            <FreeDemoButton size="md" label="Or Get a Free Website Preview" rounded="full" />

            <p className="text-gray-600 text-sm mt-6">
              Setup in 24-48 hrs · Cancel anytime · No credit card to test the demo
            </p>
          </motion.div>
        </div>
      </section>

    </div>
  );
}
