/* polished v2 · why-bento v3 */
'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, Droplet, Wrench, Star, ShieldCheck,
  ChevronDown, Calendar, Check, Zap, MessageCircle, AlertTriangle,
  Sparkles, ArrowRight, BadgeCheck, FileText, Camera, Trophy,
  Flame, Search, Home as HomeIcon, Award, Users,
} from 'lucide-react';

/* ─── 3D Tilt Card · cursor-tracked rotation ─── */
function TiltCard({ children, className, style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    (ry as MotionValue<number>).set((px - 0.5) * 14);
    (rx as MotionValue<number>).set((0.5 - py) * 14);
  };
  const onLeave = () => { (rx as MotionValue<number>).set(0); (ry as MotionValue<number>).set(0); };
  return (
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d', rotateX: rx, rotateY: ry }}>
      {children}
    </motion.div>
  );
}

/* ─── Single source of truth for the demo business ───
   Edit this object to rebrand the entire template. ─── */
const BIZ = {
  name:        'Anchor Plumbing & Drain',
  tagline:     'Honest Plumbing, Done Right the First Time',
  phone:       '(580) 555-0234',
  phoneRaw:    '5805550234',
  emergency:   '(580) 555-0922',
  email:       'help@anchorplumbingok.com',
  address:     '4521 Cache Rd, Lawton, OK 73505',
  hours:       'Mon–Sat · 7am–8pm',
  emergency24: '24/7 Emergency Service',
  established: 2007,
  yearsServing: new Date().getFullYear() - 2007,
  jobs:        '12,300+',
  responseHr:  '< 60 min',
  rating:      4.9,
  reviewCount: 612,
  license:     'OK Master Plumber Lic. #ML-44218',
  insurance:   'Fully Bonded & $2M Insured',
  /* Service area cities */
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Duncan','Marlow','Chickasha'],
  /* Brand colors — used inline so the template is self-contained */
  navy:    '#0c1e3e',
  primary: '#06b6d4',   // cyan — water
  deep:    '#0284c7',   // sky — secondary
  alert:   '#dc2626',   // red — emergency
  cream:   '#f0f9ff',
};

/* ─── Services offered ─── */
const SERVICES = [
  { icon: AlertTriangle, title: 'Emergency Plumbing', desc: 'Burst pipes, flooding, sewage backup — we\'re dispatched in under 60 min, 24/7.', color: '#dc2626' },
  { icon: Droplet,       title: 'Drain Cleaning',     desc: 'Clogged sink, shower, or main line? Hydro-jetting clears it permanently.',       color: '#0ea5e9' },
  { icon: Flame,         title: 'Water Heater',       desc: 'Tank, tankless, gas, electric — same-day install with 12-year warranties.',      color: '#ef4444' },
  { icon: Search,        title: 'Leak Detection',     desc: 'Non-invasive thermal + acoustic scanning. We find it without tearing up walls.', color: '#10b981' },
  { icon: Wrench,        title: 'Sewer Line Repair',  desc: 'Trenchless pipe lining — no digging up your yard. 50-year warranty available.',  color: '#7c3aed' },
  { icon: HomeIcon,      title: 'Repipe & Remodel',   desc: 'Full-home repipes, bathroom remodels, kitchen plumbing. Permits handled.',       color: '#f97316' },
];

/* ─── Why-choose-us differentiators — BENTO with visuals ─── */
const WHY = [
  {
    icon: FileText, title: 'Upfront Flat-Rate Pricing', stat: '$0',
    desc: 'You see the price BEFORE we turn a wrench. No hourly meter, no surprises, no "while we\'re here" upsells.',
    color: '#06b6d4', colorDeep: '#0e7490', span: 'lg:col-span-2', visual: 'price',
  },
  {
    icon: Clock, title: '60-Minute Response', stat: '< 60m',
    desc: 'Real emergencies get a tech in under an hour, 24/7/365. Including holidays, weekends, 3am.',
    color: '#dc2626', colorDeep: '#991b1b', span: 'lg:row-span-2', visual: 'clock',
  },
  {
    icon: ShieldCheck, title: 'Drug-Tested Master Plumbers', stat: '★',
    desc: 'Every tech is W-2, drug-tested, background-checked, and licensed. Never a subcontractor.',
    color: '#7c3aed', colorDeep: '#5b21b6', span: '', visual: 'stars',
  },
  {
    icon: BadgeCheck, title: 'Cleaner Than We Found It', stat: '100%',
    desc: 'Boot covers, drop cloths, and we haul away every piece of old pipe. Your floor stays clean.',
    color: '#10b981', colorDeep: '#047857', span: '', visual: 'map',
  },
];

/* ─── Trust strip metrics ─── */
const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Business',   suffix: '',  icon: Award },
  { value: BIZ.jobs,                    label: 'Jobs Completed',      suffix: '',  icon: Users },
  { value: BIZ.responseHr,              label: 'Emergency Response',  suffix: '',  icon: Clock },
  { value: BIZ.rating.toString(),       label: 'Google Rating',       suffix: '★', icon: Star  },
];

/* ─── Photo gallery cards (CSS-only premium placeholders) ─── */
const GALLERY = [
  { caption: 'Master plumber on-call',  emoji: '👨‍🔧', accent: '#06b6d4', pattern: 'dots'    },
  { caption: 'Burst pipe · fixed',      emoji: '💧',   accent: '#dc2626', pattern: 'grid'    },
  { caption: 'Tankless install',        emoji: '🔥',   accent: '#f97316', pattern: 'dots'    },
  { caption: 'Hydro-jet in action',     emoji: '🚿',   accent: '#0ea5e9', pattern: 'stripes' },
  { caption: 'Trenchless sewer line',   emoji: '🛠️',   accent: '#7c3aed', pattern: 'grid'    },
  { caption: 'Bathroom remodel · done', emoji: '🛁',   accent: '#10b981', pattern: 'dots'    },
];

/* ─── Marquee value props (scrolling band) ─── */
const MARQUEE = [
  { icon:'⚡', text:'60-Minute Emergency Response' },
  { icon:'💰', text:'Flat-Rate Pricing · No Surprises' },
  { icon:'🛡️', text:'Master Plumber Licensed · OK #ML-44218' },
  { icon:'⭐', text:'4.9★ from 612 Customers' },
  { icon:'🧼', text:'Boot Covers · Drop Cloths · Clean Job' },
  { icon:'📞', text:'Free Estimates Within 24 Hours' },
  { icon:'🔧', text:'50-Year Trenchless Sewer Warranty' },
];

/* ─── As Featured In ─── */
const FEATURED = ['BBB A+ Accredited','Angi Super Service','HomeAdvisor Top Pro','Nextdoor Fave','OK Plumbers Assn.'];

/* ─── Upfront pricing — THE trust differentiator for plumbers ─── */
const PRICING = [
  { service: 'Service Call (Diagnostic)',  price: '$0',          note: 'Free with any repair' },
  { service: 'Drain Cleaning — Single',    price: '$149–$249',   note: 'Sink, shower, or toilet line' },
  { service: 'Main Line Hydro-Jet',        price: '$425–$795',   note: 'Permanent clog removal' },
  { service: 'Water Heater Repair',        price: '$185–$520',   note: 'Most repairs same day' },
  { service: 'Water Heater Replacement',   price: '$1,495–$3,800', note: 'Tank · Tankless extra' },
  { service: 'Leak Detection (Slab/Wall)', price: '$285',        note: 'Thermal + acoustic scan' },
  { service: 'Toilet Replacement',         price: '$395–$650',   note: 'Includes new wax ring + install' },
  { service: 'Burst Pipe Emergency',       price: '$285–$895',   note: 'Stop, repair, water restored' },
];

/* ─── Testimonials ─── */
const REVIEWS = [
  {
    name: 'Megan R.', city: 'Lawton', rating: 5,
    text: '"Pipe burst at 11pm on a Sunday. They had a tech here in 48 minutes, water back on by 1am. Told me the exact price before starting. No emergency markup, no upsell. These are the good ones."',
  },
  {
    name: 'David W.', city: 'Cache', rating: 5,
    text: '"Got 4 quotes for a tankless water heater. Anchor was actually the most expensive — but they were the only ones who measured the gas line capacity BEFORE quoting. Other guys would have sold me a unit that wouldn\'t work. Worth the $300 extra."',
  },
  {
    name: 'Patty L.', city: 'Elgin', rating: 5,
    text: '"They snaked my main line and the tech said \'you\'ll be fine for a year — schedule a hydro-jet next spring instead of doing it now.\' He literally talked me out of more expensive service. Lifetime customer."',
  },
];

/* ─── FAQs ─── */
const FAQS = [
  { q: 'Do you charge for emergency service?',                       a: 'No emergency markup, no overtime fees, no holiday surcharges. We charge the same flat rate at 3am Sunday as we do at 10am Tuesday. The price you see is the price you pay.' },
  { q: 'How fast can you get here?',                                 a: 'For true plumbing emergencies (active flooding, burst pipe, sewage backup) we guarantee a technician at your door in under 60 minutes within our service area, 24/7. Non-emergency same-day appointments are usually available.' },
  { q: 'Do you offer financing for water heaters or repipes?',       a: 'Yes — 0% financing for 12, 24, or 48 months on approved credit. Most water heater replacements run $40–$95/month. Soft credit pull, approval in under 60 seconds.' },
  { q: 'Are your prices really fixed, or will it change on-site?',   a: 'Truly flat-rate. We diagnose for free, then give you a written price BEFORE we start. If the job changes scope, we stop, re-quote, and you decide. No surprise add-ons. Ever.' },
  { q: 'What areas do you serve?',                                   a: 'Lawton, Cache, Elgin, Fletcher, Apache, Walters, Geronimo, Medicine Park, Duncan, Marlow, Chickasha, and surrounding southwest Oklahoma. Outside that radius? Call us — emergencies are case-by-case.' },
  { q: 'Are you licensed, bonded, and insured?',                     a: `Yes. ${BIZ.license}, fully bonded, and carry $2M in liability insurance. Every tech is also individually licensed and certified. Ask for credentials on arrival — we\'re proud to show them.` },
  { q: 'Do you offer a warranty?',                                   a: 'All repairs come with a 1-year labor warranty. New installs carry the manufacturer warranty (typically 6–12 years on water heaters, 50 years on trenchless sewer lining). If a covered repair fails, we come back free — period.' },
];

export default function PlumbersTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  /* Sticky header shadow on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ═══════ Template preview banner (sales context) ═══════ */}
      <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <Link href="/templates" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">← All templates</Link>
            <span className="opacity-40">·</span>
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

      {/* ═══════ Top utility bar ═══════ */}
      <div className="bg-slate-900 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href={`tel:${BIZ.emergency}`} className="font-bold flex items-center gap-1.5"
              style={{ color: BIZ.alert }}>
              <AlertTriangle className="w-3.5 h-3.5 animate-pulse"/>
              <span>24/7 Emergency:</span>
              <span className="underline">{BIZ.emergency}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ═══════ Sticky header ═══════ */}
      <header className={`sticky top-[36px] sm:top-[32px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.navy})` }}>
              A
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg">{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-cyan-600 transition-colors">Services</a>
            <a href="#pricing" className="hover:text-cyan-600 transition-colors">Pricing</a>
            <a href="#why" className="hover:text-cyan-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-cyan-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-cyan-600 transition-colors">FAQ</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-cyan-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.primary }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 4px 14px ${BIZ.primary}66` }}>
              <Calendar className="w-4 h-4"/> Book Online
            </a>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0c1e3e 50%, #0e7490 100%)` }}>
        {/* Decorative glows */}
        <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.primary}60, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.alert}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        {/* Animated water-drop pattern */}
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.8) 1px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '60px 60px, 80px 80px',
        }}/>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.primary}25`, border: `1px solid ${BIZ.primary}60`, color: '#67e8f9' }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.primary }}/>
              {BIZ.license.split(' ').slice(0,3).join(' ')} · Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              When Water Goes<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.primary}, #67e8f9)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Where It Shouldn&apos;t
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-cyan-100/90">— We&apos;re On The Way.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-cyan-100/90 max-w-xl mb-8 leading-relaxed">
              Master plumbers at your door in under 60 minutes. Flat-rate pricing before we start. {BIZ.yearsServing} years of honest plumbing across southwest Oklahoma.
            </motion.p>

            {/* Dual CTA */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href={`tel:${BIZ.emergency}`}
                className="text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #b91c1c)`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
                <AlertTriangle className="w-5 h-5"/> Emergency: {BIZ.emergency}
              </a>
              <a href="#book"
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Calendar className="w-5 h-5"/> Schedule Service
              </a>
            </motion.div>

            {/* Hero trust strip */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-cyan-100/80">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> Master Plumber Licensed</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-400"/> {BIZ.insurance}</span>
            </motion.div>
          </div>

          {/* Right: Live dispatch card mockup */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Issue Fixed" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-600">RESOLVED</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">Water restored</p>
                <p className="text-[10px] text-slate-500 mt-0.5">52 min on-site · $285</p>
              </motion.div>

              {/* Floating "Tech ETA" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-52"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.navy})` }}>MJ</div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-slate-800">Mike J. · Master</p>
                    <p className="text-[10px] text-slate-500">12 yrs · 4.98★</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-semibold">ARRIVING</span>
                  <span className="text-sm font-black text-slate-900">22 min</span>
                </div>
              </motion.div>

              {/* Main dispatch card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
                {/* Top status bar */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: BIZ.alert }}/>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Live Dispatch</span>
                  </div>
                  <span className="text-[10px] text-slate-400 tabular-nums">12:47 PM</span>
                </div>

                {/* Service header */}
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Active Service Call</p>
                <p className="text-xl font-black mb-3" style={{ color: BIZ.navy }}>Burst Pipe Repair</p>

                <div className="space-y-3 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><MapPin className="w-3.5 h-3.5"/> Customer</span>
                    <span className="font-bold text-slate-800">Cache, OK</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><Clock className="w-3.5 h-3.5"/> Response time</span>
                    <span className="font-bold text-green-600">48 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><FileText className="w-3.5 h-3.5"/> Quote (flat-rate)</span>
                    <span className="font-bold text-slate-800">$285</span>
                  </div>
                </div>

                {/* Animated pulse map */}
                <div className="relative h-24 rounded-xl overflow-hidden mb-4"
                  style={{ background: `linear-gradient(135deg, ${BIZ.cream}, #e0f2fe)` }}>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(6,182,212,0.15) 1px, transparent 1px)',
                    backgroundSize: '12px 12px',
                  }}/>
                  {/* Pulsing radar */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <motion.div animate={{ scale:[1,2.5], opacity:[0.6,0] }}
                        transition={{ duration:2, repeat:Infinity, ease:'easeOut' }}
                        className="absolute inset-0 w-4 h-4 rounded-full"
                        style={{ background: BIZ.primary }}/>
                      <motion.div animate={{ scale:[1,2.5], opacity:[0.4,0] }}
                        transition={{ duration:2, repeat:Infinity, ease:'easeOut', delay:0.7 }}
                        className="absolute inset-0 w-4 h-4 rounded-full"
                        style={{ background: BIZ.primary }}/>
                      <div className="w-4 h-4 rounded-full relative z-10 border-2 border-white shadow-lg" style={{ background: BIZ.primary }}/>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    <span>Tech En Route</span>
                    <span>ETA 22 min</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div animate={{ width:['25%','60%','25%'] }} transition={{ duration:6, repeat:Infinity, ease:'easeInOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${BIZ.primary}, ${BIZ.deep})` }}/>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #f8fafc, transparent)' }}/>
      </section>

      {/* ═══════ AS FEATURED IN STRIP ═══════ */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">As Featured / Rated</span>
          {FEATURED.map((f, i) => (
            <motion.span key={f}
              initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
              transition={{ delay: i*0.1 }}
              className="text-sm font-bold tracking-tight text-slate-400 hover:text-slate-700 transition-colors cursor-default"
              style={{ fontFamily: '"Playfair Display", serif' }}>
              {f}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ═══════ TRUST METRICS STRIP ═══════ */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08 }}
                className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${BIZ.primary}15`, color: BIZ.primary }}>
                  <Icon className="w-6 h-6"/>
                </div>
                <p className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
                  {m.value}{m.suffix}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ═══════ SCROLLING VALUE PROPS MARQUEE ═══════ */}
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.navy, borderColor: `${BIZ.primary}40` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: '#67e8f9' }}>{m.text}</span>
              <span className="text-slate-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* ═══════ SERVICES GRID ═══════ */}
      <section id="services" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Full-Service Plumbing</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              From a Drip to a Disaster<br/>— We Fix It All
            </h2>
            <p className="text-slate-600 text-lg">Every job done by a licensed master plumber. Flat-rate pricing. Workmanship warrantied for a full year.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  whileHover={{ y:-8, boxShadow: `0 24px 60px ${s.color}30, 0 8px 24px rgba(0,0,0,0.06), 0 0 0 1px ${s.color}30` }}
                  className="group bg-white rounded-2xl p-7 cursor-pointer transition-all"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color, boxShadow: `0 4px 14px ${s.color}25` }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.primary }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ PHOTO GALLERY (premium CSS placeholders) ═══════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Recent Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              Pipes Fixed.<br/>Customers Happy.
            </h2>
            <p className="text-slate-600 text-lg">Photos from real jobs, real customers, real southwest Oklahoma homes.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {GALLERY.map((g, i) => {
              const patternBg =
                g.pattern === 'dots'    ? `radial-gradient(circle at 30% 30%, ${g.accent}40 1.5px, transparent 1.5px)` :
                g.pattern === 'grid'    ? `linear-gradient(${g.accent}25 1px, transparent 1px), linear-gradient(90deg, ${g.accent}25 1px, transparent 1px)` :
                                          `repeating-linear-gradient(45deg, ${g.accent}30 0, ${g.accent}30 1px, transparent 1px, transparent 14px)`;
              const patternSize = g.pattern === 'grid' ? '28px 28px' : g.pattern === 'dots' ? '20px 20px' : 'auto';
              return (
                <motion.div key={g.caption}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.06 }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${g.accent}, ${BIZ.navy})`,
                    boxShadow: `0 12px 40px ${g.accent}30, 0 4px 12px rgba(0,0,0,0.1)`,
                  }}>
                  <div className="absolute inset-0 opacity-25" style={{ backgroundImage: patternBg, backgroundSize: patternSize }}/>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${BIZ.navy}aa, transparent 70%)` }}/>
                  <div className="absolute inset-0 flex items-center justify-center text-7xl transition-transform group-hover:scale-110 opacity-40" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
                    {g.emoji}
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)` }}>
                    <span className="text-white font-bold text-sm tracking-tight">{g.caption}</span>
                    <Camera className="w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.primary }}/>
            12,300+ jobs in our portfolio · <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.primary }}>Schedule yours →</a>
          </p>
        </div>
      </section>

      {/* ═══════ UPFRONT PRICING — THE differentiator ═══════ */}
      <section id="pricing" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Upfront Pricing</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              No Hourly Meter.<br/>No Surprise Bills.
            </h2>
            <p className="text-slate-600 text-lg">
              We&apos;re one of the only plumbers in southwest Oklahoma that posts our prices online. You get a written quote BEFORE we start — and that&apos;s the price you pay.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border" style={{ borderColor: '#e0f2fe' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {PRICING.map((p, i) => (
                <motion.div key={p.service}
                  initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
                  transition={{ delay: i*0.04 }}
                  className="p-5 flex items-start justify-between gap-4 border-b border-r"
                  style={{
                    borderColor: '#f1f5f9',
                    background: i % 2 === 0 ? 'white' : '#f8fafc',
                  }}>
                  <div className="min-w-0">
                    <p className="font-bold text-base mb-0.5" style={{ color: BIZ.navy }}>{p.service}</p>
                    <p className="text-xs text-slate-500">{p.note}</p>
                  </div>
                  <p className="font-display text-lg font-black flex-shrink-0 tabular-nums" style={{ color: BIZ.primary }}>{p.price}</p>
                </motion.div>
              ))}
            </div>
            <div className="p-5 text-center text-xs text-slate-500" style={{ background: '#f1f5f9' }}>
              Prices are flat-rate, including parts &amp; labor. Final quote provided in writing before any work begins.
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t see what you need? <a href={`tel:${BIZ.phoneRaw}`} className="font-bold hover:underline" style={{ color: BIZ.primary }}>Call for a free quote →</a>
          </p>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US — BENTO with animated visuals ═══════ */}
      <section id="why" className="py-20 sm:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #ecfeff 0%, #fef2f2 30%, #f3e8ff 60%, #ecfdf5 100%)` }}>
        {/* Drifting glow blobs */}
        <motion.div
          animate={{ x: ['0%','50%','0%'], y: ['0%','-30%','0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.primary}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['0%','-40%','0%'], y: ['0%','30%','0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.alert}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['-20%','20%','-20%'], y: ['10%','-10%','10%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, #7c3aed40, transparent 60%)`, filter: 'blur(90px)' }}/>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years of Plumbing.<br/>Zero Bait-and-Switch.
            </h2>
            <p className="text-slate-600 text-lg">Family-owned, W-2 master plumbers, flat-rate pricing — so they earn the same whether they fix it or replace it. We think it shows.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:auto-rows-[280px]" style={{ perspective: 1200 }}>
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title}
                  initial={{ opacity:0, y:40, scale:0.95 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1, type:'spring', stiffness:80 }}
                  className={`relative ${w.span}`}>
                  <TiltCard
                    className="relative h-full rounded-3xl p-7 overflow-hidden cursor-pointer"
                    style={{
                      background: `linear-gradient(135deg, ${w.color}18 0%, ${w.color}08 40%, white 70%, ${w.color}22 100%)`,
                      boxShadow: `0 16px 50px ${w.color}35, 0 4px 14px rgba(0,0,0,0.06), 0 0 0 1px ${w.color}40, inset 0 1px 0 rgba(255,255,255,0.6)`,
                    }}>
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                      style={{ background: `linear-gradient(90deg, ${w.color}, ${w.colorDeep}, ${w.color})` }}/>
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                      style={{ background: `linear-gradient(to top, ${w.color}30, transparent)` }}/>
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i*0.5 }}
                      className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${w.color}40, transparent 70%)`, filter: 'blur(40px)' }}/>
                    <span className="absolute top-5 right-5 text-[80px] leading-none font-black opacity-[0.08] tracking-tighter pointer-events-none"
                      style={{ color: w.color, fontFamily: '"Playfair Display", serif' }}>
                      {String(i+1).padStart(2,'0')}
                    </span>

                    {/* Per-card visual */}
                    {w.visual === 'clock' && (
                      <div className="absolute -bottom-6 -right-6 w-44 h-44 pointer-events-none">
                        <div className="relative w-full h-full rounded-full border-[3px] flex items-center justify-center"
                          style={{ borderColor: `${w.color}30`, background: `radial-gradient(circle, white, ${w.color}10)` }}>
                          {[...Array(12)].map((_, t) => (
                            <div key={t} className="absolute w-0.5 h-2 rounded-full"
                              style={{ background: t % 3 === 0 ? w.color : `${w.color}50`, top: '8%', left: '50%', transformOrigin: '50% 540%', transform: `translateX(-50%) rotate(${t*30}deg)` }}/>
                          ))}
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-1 h-[40%] rounded-full origin-bottom top-[10%] left-1/2 -translate-x-1/2"
                            style={{ background: w.color, boxShadow: `0 0 10px ${w.color}` }}/>
                          <motion.div animate={{ rotate: 360 }} transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-1.5 h-[28%] rounded-full origin-bottom top-[22%] left-1/2 -translate-x-1/2"
                            style={{ background: BIZ.navy }}/>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white" style={{ background: w.color }}/>
                        </div>
                      </div>
                    )}

                    {w.visual === 'map' && (
                      <div className="absolute -bottom-4 -right-4 w-52 h-52 pointer-events-none">
                        <div className="absolute inset-0 flex items-center justify-center">
                          {[0.4, 0.6, 0.85].map((s, ri) => (
                            <motion.div key={ri}
                              animate={{ scale: [s, s*1.15, s], opacity: [0.4, 0.1, 0.4] }}
                              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: ri*0.5 }}
                              className="absolute inset-0 rounded-full border-2"
                              style={{ borderColor: `${w.color}40` }}/>
                          ))}
                          <div className="relative w-4 h-4 rounded-full" style={{ background: w.color, boxShadow: `0 0 16px ${w.color}` }}>
                            <motion.div animate={{ scale:[1,2.2,1], opacity:[0.6,0,0.6] }} transition={{ duration:2, repeat:Infinity }}
                              className="absolute inset-0 rounded-full" style={{ background: w.color }}/>
                          </div>
                        </div>
                        {[
                          { city:'Clean', top:'15%', left:'15%' },
                          { city:'On Time',top:'70%', left:'10%' },
                          { city:'Tidy',  top:'20%', left:'70%' },
                          { city:'Pro',   top:'68%', left:'72%' },
                        ].map((c, ci) => (
                          <motion.span key={c.city}
                            animate={{ y:[0,-4,0] }}
                            transition={{ duration: 3+ci*0.3, repeat: Infinity, ease: 'easeInOut', delay: ci*0.5 }}
                            className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white shadow-md"
                            style={{ top: c.top, left: c.left, color: w.color, border: `1px solid ${w.color}30` }}>
                            <Check className="w-2.5 h-2.5 inline mr-0.5"/>{c.city}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {w.visual === 'stars' && (
                      <div className="absolute bottom-5 right-5 flex gap-1 pointer-events-none">
                        {[...Array(5)].map((_, si) => (
                          <motion.div key={si}
                            initial={{ scale: 0, rotate: -30 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 + si*0.12, type: 'spring', stiffness: 200 }}>
                            <Star className="w-7 h-7 fill-current" style={{ color: w.color, filter: `drop-shadow(0 2px 6px ${w.color}66)` }}/>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {w.visual === 'price' && (
                      <div className="absolute bottom-5 right-5 pointer-events-none">
                        <motion.div
                          animate={{ rotate: [-5, 5, -5] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                          className="relative px-4 py-2 rounded-xl text-white font-black text-sm tracking-tight"
                          style={{ background: `linear-gradient(135deg, ${w.color}, ${w.colorDeep})`, boxShadow: `0 8px 20px ${w.color}55` }}>
                          Flat Rate
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45" style={{ background: w.color }}/>
                        </motion.div>
                        <div className="flex gap-1 mt-2 justify-end">
                          {['Quote','Approve','Done'].map((l, li) => (
                            <motion.span key={l}
                              initial={{ opacity: 0, y: 10 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: 0.5 + li*0.15 }}
                              className="inline-flex items-center gap-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ background: 'white', color: w.color, border: `1px solid ${w.color}30` }}>
                              <Check className="w-2.5 h-2.5"/>{l}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                      <motion.div
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white"
                        style={{ background: `linear-gradient(135deg, ${w.color}, ${w.colorDeep})`, boxShadow: `0 8px 24px ${w.color}55` }}>
                        <Icon className="w-7 h-7"/>
                      </motion.div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-2xl font-black tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${w.color}15`, color: w.color }}>{w.stat}</span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed max-w-[28ch]">{w.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 12px 30px ${BIZ.primary}55` }}>
              Schedule a Free Estimate <ArrowRight className="w-5 h-5"/>
            </a>
            <p className="text-slate-500 text-sm mt-3">
              {BIZ.jobs} jobs · {BIZ.reviewCount} reviews · {BIZ.rating}★ on Google
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ EMERGENCY BANNER ═══════ */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #991b1b)` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight">Water Where It Shouldn&apos;t Be?</p>
              <p className="text-white/90 text-sm mt-1">60-minute response, 24/7 — no after-hours fees, no holiday surcharge.</p>
            </div>
          </div>
          <a href={`tel:${BIZ.emergency}`}
            className="bg-white text-red-600 font-black px-7 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg">
            <Phone className="w-5 h-5"/> {BIZ.emergency}
          </a>
        </div>
      </section>

      {/* ═══════ REVIEWS ═══════ */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Real Customers</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Reviews
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
              <span className="text-sm font-bold text-amber-900">Verified Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.1 }}
                className="bg-slate-50 rounded-2xl p-7">
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.navy})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.navy }}>{r.name}</p>
                    <p className="text-xs text-slate-500">{r.city}, OK · Verified Google</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ SCHEDULE / BOOK FORM ═══════ */}
      <section id="book" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0e7490 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3 text-cyan-300">Book Service</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
                Tell Us What&apos;s<br/>Going On.
              </h2>
              <p className="text-cyan-100/90 text-lg mb-6">
                Fill in the form and a licensed plumber will text you back in under 10 minutes — even on weekends.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Clock,        text: 'Same-day appointments most days' },
                  { icon: MessageCircle,text: 'Reply by text or call — your pick' },
                  { icon: ShieldCheck,  text: 'Free diagnostic with any repair' },
                  { icon: BadgeCheck,   text: 'Flat-rate price BEFORE we start' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-cyan-100">
                    <item.icon className="w-4 h-4 text-cyan-300"/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What&apos;s the problem?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all">
                  <option>Active leak / flooding (EMERGENCY)</option>
                  <option>Clogged drain or toilet</option>
                  <option>No hot water</option>
                  <option>Water heater replacement</option>
                  <option>Burst pipe</option>
                  <option>Sewer line backup</option>
                  <option>Bathroom or kitchen remodel</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First & last"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">ZIP / City</label>
                <input type="text" placeholder="73501 or Lawton"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-all"/>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
                <Zap className="w-5 h-5"/> Get a Callback in 10 Min
              </button>
              <p className="text-center text-xs text-slate-500">No spam, ever. We text once and stop if you ask.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ SERVICE AREAS ═══════ */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.navy }}>
            Plumbing Southwest Oklahoma
          </h2>
          <p className="text-slate-600 mb-10">We live here. Here&apos;s the dirt-road radius we cover.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="bg-slate-50 px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all cursor-default"
                style={{ color: BIZ.navy }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.primary }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.navy }}>
              Questions, Answered
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}
                  className="rounded-2xl border transition-all"
                  style={{
                    background: isOpen ? '#ecfeff' : 'white',
                    borderColor: isOpen ? '#a5f3fc' : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.navy }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.primary }}/>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      className="px-6 pb-5 text-slate-700 leading-relaxed">
                      {f.a}
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0e7490 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.primary}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            One Call. Done Right.
          </h2>
          <p className="text-cyan-100/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Emergency repair, routine service, or a full remodel — we&apos;ll be there fast, charge fairly, and clean up after ourselves.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-cyan-100/70 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> {BIZ.emergency24}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Master Plumber Licensed</span>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.navy})` }}>A</div>
              <p className="font-bold text-white text-lg">{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline}. {BIZ.yearsServing} years of honest plumbing in southwest Oklahoma.</p>
            <p className="text-xs text-slate-500">{BIZ.license}<br/>{BIZ.insurance}</p>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Services</p>
            <ul className="space-y-2 text-sm">
              {SERVICES.map(s => <li key={s.title}><a href="#services" className="hover:text-white transition-colors">{s.title}</a></li>)}
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.primary }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.alert }}/><a href={`tel:${BIZ.emergency}`} className="hover:text-white transition-colors">{BIZ.emergency} (24/7)</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.primary }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.primary }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.primary }}/><span>{BIZ.hours}<br/><strong className="text-white">{BIZ.emergency24}</strong></span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Service Areas</p>
            <p className="text-sm text-slate-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>Family-owned · Locally trusted since {BIZ.established}</p>
        </div>
      </footer>

      {/* Floating sticky call button (mobile) */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
