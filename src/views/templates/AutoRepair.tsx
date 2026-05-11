'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Wrench, Car, Gauge, Battery, Cog, AlertTriangle, Award, FileText, Zap,
} from 'lucide-react';

const BIZ = {
  name:        'Apex Auto Repair',
  tagline:     'ASE-Certified · Honest Quotes · Quick Turnaround',
  phone:       '(580) 555-0678',
  phoneRaw:    '5805550678',
  email:       'service@apexautorepair.com',
  address:     '1850 Sheridan Rd, Lawton, OK 73505',
  hours:       'Mon–Fri · 7am–6pm · Sat 8am–3pm',
  established: 2008,
  yearsServing: new Date().getFullYear() - 2008,
  jobs:        '24,500+',
  responseHr:  'Same day',
  rating:      4.9,
  reviewCount: 894,
  license:     'OK Repair Lic. #ARL-77321',
  insurance:   'Bonded · ASE Master Certified',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Duncan','Marlow','Chickasha'],
  /* Auto palette — bold charcoal + electric red + chrome */
  charcoal:'#18181b',
  red:     '#dc2626',
  redDeep: '#991b1b',
  chrome:  '#a1a1aa',
  cream:   '#fafafa',
};

const SERVICES = [
  { icon: Cog,         title: 'Brakes & Rotors',      desc: 'Squeak, grind, vibration? Free brake inspection. Quote before any work.',  color: '#dc2626' },
  { icon: Battery,     title: 'Batteries & Electrical',desc: 'Free battery test. New battery installed in 20 min with warranty.',        color: '#fbbf24' },
  { icon: Wrench,      title: 'Oil Change & Service',  desc: 'Synthetic, blends, conventional. 30 min in &amp; out. We come to you.',     color: '#3b82f6' },
  { icon: Gauge,       title: 'Diagnostics',           desc: 'Check engine light? Free OBD-II scan. Honest read on what it actually means.', color: '#10b981' },
  { icon: Car,         title: 'AC & Heating',          desc: 'AC not cold? Free leak check. R-1234yf and R-134a recharge.',                color: '#06b6d4' },
  { icon: AlertTriangle,title: 'Transmission Service',  desc: 'Slipping, hard shifts, leaks? Diagnostic before any major recommendation.',  color: '#a855f7' },
];

const WHY = [
  { icon: FileText,    title: 'Photo-Documented Repairs',  desc: 'We text you photos of every problem we find — so you see what we see before approving any work.' },
  { icon: BadgeCheck,  title: 'ASE Master Certified',      desc: 'Every tech is ASE Master certified — the highest level. Not parts-changers. Real diagnosticians.' },
  { icon: Award,       title: '3-Year / 36K-Mile Warranty',desc: 'On every repair. If something we fixed fails within 3 years or 36K miles, we redo it free.' },
  { icon: Clock,       title: 'Same-Day Most Repairs',     desc: 'Drop off in the morning, drive home that night. We&apos;ll text you when it&apos;s ready.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Business',    suffix: '' },
  { value: BIZ.jobs,                    label: 'Cars Serviced',        suffix: '' },
  { value: BIZ.responseHr,              label: 'Most Repairs',         suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',        suffix: '★' },
];

/* Industry-specific: INSTANT QUOTE ESTIMATOR */
const QUOTE_RANGES = [
  { service: 'Oil Change (Synthetic)',          price: '$59–$89',     desc: 'Most cars · 30 min'              },
  { service: 'Front Brake Pads',                price: '$285–$420',   desc: 'Pads + rotor turn or replace'   },
  { service: 'Battery Replacement',             price: '$165–$245',   desc: 'Install + warranty included'    },
  { service: 'Check Engine Diagnostic',         price: '$89',         desc: 'Free with any repair done here' },
  { service: 'AC Recharge (R-134a)',            price: '$165',        desc: 'Includes leak check'            },
  { service: 'Tune-Up (Plugs, Wires, Filters)', price: '$295–$485',   desc: 'Most 4 &amp; 6 cylinder'         },
  { service: 'Alternator Replacement',          price: '$485–$795',   desc: 'Alternator + labor + scan'      },
  { service: 'Tire Rotation & Balance',         price: '$45',         desc: 'All 4 tires · 30 min'           },
];

const REVIEWS = [
  { name: 'Marcus H.', city: 'Lawton', rating: 5,
    text: '"Took my truck to the dealer for a $2,400 transmission quote. Apex diagnosed it as a $185 sensor swap. They literally saved me $2,200. I send everyone here now."' },
  { name: 'Linda M.', city: 'Cache', rating: 5,
    text: '"They text me photos of every issue with quotes — I can decline anything I don&apos;t want done, no pressure. Found out my old shop had been padding bills for years. Never going back."' },
  { name: 'Tony R.', city: 'Elgin', rating: 5,
    text: '"Brake job was $200 less than two other shops, AND they replaced a hose I didn&apos;t know was leaking — for free, since it was right there. These are the good ones."' },
];

const FAQS = [
  { q: 'Do I need an appointment, or can I just drop by?',           a: 'Both work. We accept walk-ins for oil changes, tire rotations, and quick checks. For bigger jobs (brakes, diagnostics, AC), an appointment guarantees same-day turnaround. Book online or call.' },
  { q: 'Do you give free quotes?',                                   a: 'Yes — every quote is free, written, and includes a photo of the problem. The check-engine diagnostic is also free if you have us do the actual repair.' },
  { q: 'What if the quote changes once you start the work?',         a: 'It doesn&apos;t — unless we hit something unexpected (like a rusted bolt or a hidden issue). If that happens, we stop, text you with photos, and re-quote. You decide if we proceed.' },
  { q: 'Do you work on diesel trucks?',                              a: 'Yes — Powerstroke, Cummins, Duramax. We have a dedicated diesel bay and a tech with 15+ years on heavy diesel work. Diesel-specific scan tools too.' },
  { q: 'Do you offer financing?',                                    a: 'Yes — 0% financing for 6 or 12 months on jobs over $300 through Synchrony. Soft credit pull, approval in 60 seconds. Most customers use it for major repairs like transmissions.' },
  { q: 'Are your warranties really 3 years / 36K miles?',            a: 'Yes — on every part we install AND the labor. If a covered repair fails within 3 years or 36K miles (whichever comes first), we redo it for free. Best warranty in southwest OK.' },
  { q: 'Do you do state inspections?',                               a: 'Yes — full Oklahoma vehicle inspections, in and out in 30 minutes. $25 cash or card. We&apos;re a state-certified inspection station.' },
];

export default function AutoRepairTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);
  /* Animated speedometer needle (hero) */
  const needleAngle = useTransform(scrollY, [0, 400], [-115, 25]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-zinc-900" style={{ background: BIZ.cream, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Template preview banner */}
      <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0"/>
            <span className="font-semibold">Template Preview</span>
            <span className="hidden sm:inline opacity-90">— We customize colors, logo &amp; content to match your brand · $1,497 once</span>
          </span>
          <Link href="/lifetime"
            className="bg-white text-blue-700 font-bold px-3 py-1 rounded-full text-xs hover:scale-105 transition-transform flex items-center gap-1">
            Make This Mine <ArrowRight className="w-3 h-3"/>
          </Link>
        </div>
      </div>

      {/* SCROLLING URGENCY BANNER */}
      <div className="overflow-hidden text-white text-xs font-bold uppercase tracking-widest" style={{ background: BIZ.red }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-8 py-2 whitespace-nowrap">
          {[...Array(2)].flatMap((_, copy) => [
            'Free Brake Inspection',
            'Same-Day Most Repairs',
            '3-Year / 36K Warranty',
            'ASE Master Certified',
            '0% Financing Available',
            'Photo-Documented Repairs',
          ].map((t, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3">
              <Zap className="w-3.5 h-3.5"/>
              <span>{t}</span>
              <span className="opacity-50">·</span>
            </span>
          )))}
        </motion.div>
      </div>

      {/* Top utility bar */}
      <div className="text-white text-xs" style={{ background: BIZ.charcoal }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`} className="font-bold flex items-center gap-1.5" style={{ color: BIZ.red }}>
            <Phone className="w-3.5 h-3.5"/>
            <span>Walk-Ins Welcome:</span>
            <span className="underline">{BIZ.phone}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[60px] sm:top-[56px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.charcoal}, ${BIZ.red})`, boxShadow: `0 0 14px ${BIZ.red}44` }}>
              <Wrench className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-black text-zinc-900 text-base sm:text-lg uppercase tracking-tight">{BIZ.name}</p>
              <p className="text-[10px] text-zinc-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold uppercase tracking-wider text-zinc-700">
            <a href="#services" className="hover:text-red-600 transition-colors">Services</a>
            <a href="#estimator" className="hover:text-red-600 transition-colors">Pricing</a>
            <a href="#why" className="hover:text-red-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-red-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-red-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-zinc-900 hover:text-red-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.red }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-black px-4 py-2.5 text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap uppercase tracking-wider"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 4px 14px ${BIZ.red}66`, clipPath: 'polygon(8% 0, 100% 0, 92% 100%, 0 100%)' }}>
              <Calendar className="w-4 h-4"/> Book
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.charcoal} 0%, #09090b 50%, #18181b 100%)` }}>
        {/* Diagonal stripe pattern */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `repeating-linear-gradient(45deg, ${BIZ.red} 0px, ${BIZ.red} 2px, transparent 2px, transparent 30px)`,
        }}/>

        <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.red}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-black uppercase tracking-widest"
              style={{ background: `${BIZ.red}25`, border: `1px solid ${BIZ.red}60`, color: BIZ.red, clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}>
              <Wrench className="w-3 h-3"/>
              ASE Master Certified · Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight uppercase">
              Honest Repairs.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.red}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Same-Day Service.
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-zinc-400 normal-case font-bold">Done Right or We Redo It Free.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-zinc-300 max-w-xl mb-8 leading-relaxed">
              Photo-documented repairs, written quotes before we touch a wrench, and a 3-year / 36K-mile warranty on every job. {BIZ.yearsServing} years of straight-talking auto service.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-black px-7 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}66`, clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
                <Calendar className="w-5 h-5"/> Book Service
              </a>
              <a href="#estimator"
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors uppercase tracking-wider">
                <Gauge className="w-5 h-5"/> See Pricing
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-400"/> 3-Yr / 36K Warranty</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> ASE Master</span>
            </motion.div>
          </div>

          {/* Right: animated speedometer */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Diagnostic" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-md shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: `2px solid ${BIZ.red}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Gauge className="w-4 h-4 text-red-600"/>
                  <span className="text-xs font-black uppercase text-zinc-700 tracking-wider">Code Found</span>
                </div>
                <p className="text-xs text-zinc-700 font-bold">P0420 · Cat efficiency</p>
                <p className="text-[10px] text-green-600 font-bold mt-1">Quote: $185 · Free with repair</p>
              </motion.div>

              {/* Floating "Photo proof" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-md shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-black uppercase text-zinc-800 tracking-wider">Photo Sent</span>
                </div>
                <p className="text-[10px] text-zinc-500">Approved by you · Repair started 11:42</p>
              </motion.div>

              {/* Main speedometer */}
              <div className="aspect-square rounded-full p-1 relative"
                style={{ background: `conic-gradient(from 220deg, ${BIZ.red}, #fbbf24, #22c55e, #22c55e, transparent 270deg)` }}>
                <div className="w-full h-full rounded-full flex items-center justify-center relative" style={{ background: BIZ.charcoal }}>
                  <div className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 50%)' }}/>

                  {/* Tick marks */}
                  {[...Array(11)].map((_, i) => {
                    const angle = -115 + (i * 23);
                    return (
                      <div key={i} className="absolute w-0.5 h-3"
                        style={{
                          background: i >= 8 ? BIZ.red : '#71717a',
                          top: '12%',
                          left: '50%',
                          transformOrigin: '50% 220%',
                          transform: `translateX(-50%) rotate(${angle}deg)`,
                        }}/>
                    );
                  })}

                  {/* Animated needle */}
                  <motion.div
                    style={{ rotate: needleAngle, transformOrigin: '50% 90%' }}
                    className="absolute w-1 h-1/2 rounded-full top-[10%] left-1/2 -translate-x-1/2 origin-bottom"
                    >
                    <div className="w-full h-full rounded-full"
                      style={{ background: `linear-gradient(180deg, ${BIZ.red}, transparent)`, boxShadow: `0 0 12px ${BIZ.red}` }}/>
                  </motion.div>

                  {/* Center hub */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4"
                    style={{ background: BIZ.charcoal, borderColor: BIZ.red }}/>

                  {/* Status text */}
                  <div className="text-center text-white relative z-10 mt-32">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-1">Repair Status</p>
                    <p className="text-2xl font-black uppercase tracking-tight" style={{ color: BIZ.red }}>Ready</p>
                    <p className="text-xs text-zinc-400 mt-1">Total: $312 · Warranty active</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-12 bg-white border-y border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.08 }}
              className="text-center">
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.charcoal }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>What We Fix</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 uppercase" style={{ color: BIZ.charcoal }}>
              Bumper to Bumper.<br/>Bolt to Bolt.
            </h2>
            <p className="text-zinc-600 text-lg">From a $45 oil change to a $4,500 transmission rebuild — same shop, same warranty, same straight talk.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  whileHover={{ y:-6 }}
                  className="group bg-white p-7 cursor-pointer transition-all"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)', clipPath: 'polygon(0 0, 100% 0, 100% 92%, 92% 100%, 0 100%)' }}>
                  <div className="w-14 h-14 flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color, clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-2" style={{ color: BIZ.charcoal }}>{s.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all uppercase tracking-wider" style={{ color: BIZ.red }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSTANT QUOTE ESTIMATOR — unique to auto repair */}
      <section id="estimator" className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>No Surprises</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 uppercase" style={{ color: BIZ.charcoal }}>
              Know the Price<br/>Before You Drop Off.
            </h2>
            <p className="text-zinc-600 text-lg">
              Most shops won&apos;t tell you what anything costs until you&apos;re standing at the counter. We post our flat-rate ranges so you know what to expect.
            </p>
          </div>

          <div className="overflow-hidden border-2"
            style={{ borderColor: BIZ.charcoal, clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {QUOTE_RANGES.map((p, i) => (
                <motion.div key={p.service}
                  initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                  transition={{ delay: i*0.04 }}
                  className="p-5 flex items-start justify-between gap-4 border-b border-r"
                  style={{
                    borderColor: '#e4e4e7',
                    background: i % 2 === 0 ? 'white' : '#fafafa',
                  }}>
                  <div className="min-w-0">
                    <p className="font-black text-base mb-0.5 uppercase tracking-tight" style={{ color: BIZ.charcoal }}>{p.service}</p>
                    <p className="text-xs text-zinc-500">{p.desc}</p>
                  </div>
                  <p className="text-lg font-black flex-shrink-0 tabular-nums" style={{ color: BIZ.red }}>{p.price}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-5 text-center text-xs text-zinc-500 font-bold uppercase tracking-wider" style={{ background: BIZ.charcoal, color: BIZ.chrome }}>
              Prices are flat-rate including parts &amp; labor · Final quote provided in writing
            </div>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Don&apos;t see your job? <a href={`tel:${BIZ.phoneRaw}`} className="font-black hover:underline uppercase tracking-wider" style={{ color: BIZ.red }}>Call for a free quote →</a>
          </p>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05] uppercase" style={{ color: BIZ.charcoal }}>
              {BIZ.yearsServing} Years.<br/>Zero Padded Bills.
            </h2>
            <p className="text-zinc-600 text-lg leading-relaxed mb-6">
              We started Apex in {BIZ.established} after a decade watching customers get bait-and-switched at chain shops. Free $19.99 oil change, $1,800 in &ldquo;recommended services&rdquo; on the way out. We don&apos;t do that here.
            </p>
            <p className="text-zinc-600 text-lg leading-relaxed mb-8">
              Every tech is a W-2 employee — paid by the hour, NOT by what they sell you. Every repair is photo-documented and you approve it before we start. Every job carries our 3-year / 36K warranty. That&apos;s why our reviews look like they do.
            </p>
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-black px-7 py-4 hover:scale-105 transition-transform uppercase tracking-wider"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}50`, clipPath: 'polygon(4% 0, 100% 0, 96% 100%, 0 100%)' }}>
              Book My Visit <ArrowRight className="w-5 h-5"/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08 }}
                  className="bg-white p-6"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', clipPath: 'polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%)' }}>
                  <div className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ background: BIZ.charcoal, color: BIZ.red, clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-black text-lg mb-2 uppercase tracking-tight" style={{ color: BIZ.charcoal }}>{w.title}</h3>
                  <p className="text-zinc-600 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Real Customers</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 uppercase" style={{ color: BIZ.charcoal }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Drivers
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
              <span className="text-sm font-black text-amber-900 uppercase tracking-wider">Verified Google</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.1 }}
                className="p-7"
                style={{ background: BIZ.cream, border: `2px solid ${BIZ.charcoal}10`, clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)' }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-zinc-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: '#e4e4e7' }}>
                  <div className="w-10 h-10 flex items-center justify-center text-white font-black"
                    style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-sm uppercase" style={{ color: BIZ.charcoal }}>{r.name}</p>
                    <p className="text-xs text-zinc-500">{r.city}, OK · Verified</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK FORM */}
      <section id="book" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.charcoal} 0%, #09090b 100%)`, clipPath: 'polygon(0 0, 100% 0, 100% 96%, 96% 100%, 0 100%)' }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Book Service</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05] uppercase">
                Drop In or<br/>Drop Off.
              </h2>
              <p className="text-zinc-300 text-lg mb-6">
                Tell us your vehicle and what&apos;s going on — we&apos;ll text back in under 15 min with available times and a ballpark quote.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Same-day appointments most days' },
                  { icon: MessageCircle,text: 'Text photo updates on every job' },
                  { icon: ShieldCheck,  text: '3-year / 36K-mile warranty' },
                  { icon: BadgeCheck,   text: 'Free quote · No pressure' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-zinc-300">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.red }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white p-6 space-y-4 shadow-2xl"
              style={{ clipPath: 'polygon(0 0, 100% 0, 100% 95%, 95% 100%, 0 100%)' }}
              onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">Year</label>
                  <input type="text" placeholder="2018"
                    className="w-full px-3 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">Make</label>
                  <input type="text" placeholder="Ford"
                    className="w-full px-3 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">Model</label>
                  <input type="text" placeholder="F-150"
                    className="w-full px-3 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">What&apos;s going on?</label>
                <select className="w-full px-4 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all">
                  <option>Check engine light is on</option>
                  <option>Brakes squeaking or grinding</option>
                  <option>Battery / won&apos;t start</option>
                  <option>Routine oil change</option>
                  <option>AC not cold</option>
                  <option>Transmission slipping or hard shift</option>
                  <option>State inspection</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border-2 border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-red-500 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-black px-7 py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform uppercase tracking-wider"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}66`, clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
                <Wrench className="w-5 h-5"/> Get Quote in 15 Min
              </button>
              <p className="text-center text-xs text-zinc-500">No spam · We text once and stop if you ask</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 uppercase" style={{ color: BIZ.charcoal }}>
            Customers Across SW Oklahoma
          </h2>
          <p className="text-zinc-600 mb-10">Drivers come from across the region — here&apos;s where they call home.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 text-sm font-bold border-2 hover:shadow-md transition-all cursor-default uppercase tracking-wider"
                style={{ background: BIZ.cream, color: BIZ.charcoal, borderColor: BIZ.charcoal }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.red }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase" style={{ color: BIZ.charcoal }}>
              Questions, Answered
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}
                  className="border-2 transition-all"
                  style={{
                    background: isOpen ? '#fef2f2' : 'white',
                    borderColor: isOpen ? BIZ.red : '#e4e4e7',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.charcoal }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.red }}/>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      className="px-6 pb-5 text-zinc-700 leading-relaxed">
                      {f.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.charcoal} 0%, #09090b 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.red}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05] uppercase">
            Honest Repairs.<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.red}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Same-Day Service.
            </span>
          </h2>
          <p className="text-zinc-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Free quote in 15 min. Same-day on most repairs. 3-year / 36K warranty on every job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-black px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform text-lg uppercase tracking-wider text-white"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}66`, clipPath: 'polygon(3% 0, 100% 0, 97% 100%, 0 100%)' }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg uppercase tracking-wider">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-zinc-400 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5"/> ASE Master Certified</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> 3-Yr Warranty</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-zinc-300" style={{ background: '#09090b' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}>
                <Wrench className="w-5 h-5"/>
              </div>
              <p className="font-black text-white text-lg uppercase tracking-tight">{BIZ.name}</p>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-4">{BIZ.tagline} {BIZ.yearsServing} years of straight-talking auto service in southwest Oklahoma.</p>
            <p className="text-xs text-zinc-500">{BIZ.license}<br/>{BIZ.insurance}</p>
          </div>

          <div>
            <p className="font-black text-white mb-4 text-sm uppercase tracking-wider">Services</p>
            <ul className="space-y-2 text-sm">
              {SERVICES.map(s => <li key={s.title}><a href="#services" className="hover:text-white transition-colors">{s.title}</a></li>)}
            </ul>
          </div>

          <div>
            <p className="font-black text-white mb-4 text-sm uppercase tracking-wider">Contact</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.red }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.red }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.red }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.red }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-black text-white mb-4 text-sm uppercase tracking-wider">Service Areas</p>
            <p className="text-sm text-zinc-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>Family-owned · ASE Master Certified · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}99`, clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
