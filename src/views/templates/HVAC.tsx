/* polished v2 · premium-motion v3 */
'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, Snowflake, Flame, Star, ShieldCheck,
  Wrench, Wind, Award, ChevronDown, Calendar, Check, Camera,
  Zap, Sparkles, Users, Truck, ArrowRight, MessageCircle, AlertTriangle,
  ThermometerSun, CreditCard, BadgeCheck, Trophy,
} from 'lucide-react';

/* ─── 3D Tilt Card · cursor-tracked rotation for a "moving card" feel ─── */
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
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ ...style, transformStyle: 'preserve-3d', rotateX: rx, rotateY: ry }}>
      {children}
    </motion.div>
  );
}

/* ─── Cursor-tracked spotlight overlay ─── */
function SpotlightOverlay({ color = 'rgba(255,255,255,0.12)' }: { color?: string }) {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  return (
    <motion.div
      onMouseMove={(e) => {
        const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        x.set(((e.clientX - r.left) / r.width) * 100);
        y.set(((e.clientY - r.top) / r.height) * 100);
      }}
      className="absolute inset-0 pointer-events-auto"
      style={{
        background: `radial-gradient(600px circle at var(--mx) var(--my), ${color}, transparent 50%)`,
        ['--mx' as string]: useTransform(x, v => `${v}%`),
        ['--my' as string]: useTransform(y, v => `${v}%`),
      } as React.CSSProperties}
    />
  );
}

/* ─── Animated wave divider between sections ─── */
function WaveDivider({ from, to, flip = false }: { from: string; to: string; flip?: boolean }) {
  return (
    <div className="relative w-full" style={{ background: from, height: 80 }}>
      <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="absolute inset-0 w-full h-full"
        style={{ transform: flip ? 'scaleY(-1)' : 'none' }}>
        <motion.path
          initial={{ d: 'M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z' }}
          animate={{
            d: [
              'M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z',
              'M0,40 C360,10 1080,70 1440,40 L1440,80 L0,80 Z',
              'M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z',
            ],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
          fill={to}
        />
      </svg>
    </div>
  );
}

/* ─── Single source of truth for the demo business ───
   Edit this object to rebrand the entire template. ─── */
const BIZ = {
  name:        'Comfort Pro HVAC',
  tagline:     'Heating & Cooling Done Right',
  phone:       '(580) 555-0123',
  phoneRaw:    '5805550123',
  emergency:   '(580) 555-0911',
  email:       'service@comfortprohvac.com',
  address:     '1234 Main St, Lawton, OK 73501',
  hours:       'Mon–Sat · 7am–7pm',
  emergency24: '24/7 Emergency Service',
  established: 2002,
  yearsServing: new Date().getFullYear() - 2002,
  jobs:        '8,400+',
  responseHr:  '< 2 hrs',
  rating:      4.9,
  reviewCount: 487,
  license:     'OK Lic. #C-58291',
  insurance:   'Bonded & Insured',
  /* Service area cities — show as chips in footer + a section */
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Sterling','Marlow'],
  /* Brand colors — used inline so the template is self-contained */
  navy:    '#0a2540',
  blue:    '#0066cc',
  orange:  '#ff6b35',
  cream:   '#fafbfc',
};

/* ─── Services offered ─── */
const SERVICES = [
  { icon: Snowflake,      title: 'AC Repair',       desc: 'Same-day diagnostic. Fixed right, the first time.',           color: '#0284c7' },
  { icon: Wind,           title: 'AC Installation', desc: 'New high-efficiency systems with up to 60-month financing.',  color: '#0ea5e9' },
  { icon: Flame,          title: 'Heating Repair',  desc: '24/7 emergency furnace service — never sleep cold.',          color: '#ea580c' },
  { icon: ThermometerSun, title: 'Furnace Install', desc: 'Trane, Carrier, Lennox — manufacturer-certified installers.', color: '#dc2626' },
  { icon: Sparkles,       title: 'Indoor Air Quality', desc: 'Air purifiers, humidifiers, duct cleaning, UV systems.',   color: '#10b981' },
  { icon: Truck,          title: 'Commercial HVAC', desc: 'Restaurants, offices, retail — scheduled service contracts.', color: '#7c3aed' },
];

/* ─── Why-choose-us differentiators — BENTO with visuals ─── */
const WHY = [
  {
    icon: Clock, title: '2-Hour Response', stat: '< 2h',
    desc: 'AC down? Furnace out? We\'re on your doorstep in under 2 hours, 24/7 — including holidays and weekends.',
    color: '#ef4444', colorDeep: '#b91c1c', span: 'lg:col-span-2', visual: 'clock',
  },
  {
    icon: Award, title: '22 Years Local', stat: '22',
    desc: 'Family-owned in Lawton since 2002. We live here. Our kids go to school here. Your neighbors already trust us.',
    color: '#3b82f6', colorDeep: '#1d4ed8', span: 'lg:row-span-2', visual: 'map',
  },
  {
    icon: ShieldCheck, title: '100% Satisfaction', stat: '100%',
    desc: 'Not happy? We come back free until you are. Written, signed, guaranteed.',
    color: '#10b981', colorDeep: '#047857', span: '', visual: 'stars',
  },
  {
    icon: BadgeCheck, title: 'Upfront Pricing', stat: '$0',
    desc: 'Flat-rate quotes before we start. Zero surprises, zero hourly meter, zero "while we\'re here" upsells.',
    color: '#f59e0b', colorDeep: '#b45309', span: '', visual: 'price',
  },
];

/* ─── Trust strip metrics ─── */
const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Serving',     suffix: ' years', icon: Award },
  { value: BIZ.jobs,                    label: 'Jobs Completed',    suffix: '',       icon: Users },
  { value: BIZ.responseHr,              label: 'Avg Response Time', suffix: '',       icon: Clock },
  { value: BIZ.rating.toString(),       label: 'Google Rating',     suffix: '★',     icon: Star  },
];

/* ─── Photo gallery cards (CSS-only premium placeholders) ─── */
const GALLERY = [
  { caption: 'Master tech on site',    emoji: '👷', accent: '#3b82f6', pattern: 'dots' },
  { caption: 'New install · before',   emoji: '🌡️', accent: '#ef4444', pattern: 'grid' },
  { caption: 'New install · after',    emoji: '❄️', accent: '#06b6d4', pattern: 'dots' },
  { caption: 'Inside the shop',        emoji: '🔧', accent: '#a16207', pattern: 'stripes' },
  { caption: 'Trane · Carrier · Lennox', emoji: '🏆', accent: BIZ.orange, pattern: 'grid' },
  { caption: 'Happy family · 22 yrs',  emoji: '🏡', accent: '#10b981', pattern: 'dots' },
];

/* ─── Marquee value props (scrolling band) ─── */
const MARQUEE = [
  { icon:'⚡', text:'2-Hour Emergency Response' },
  { icon:'🛡️', text:'Lifetime Workmanship Warranty' },
  { icon:'💰', text:'0% Financing · 60 Months' },
  { icon:'🏆', text:'Best of Lawton · 5 Years Running' },
  { icon:'🔧', text:'Trane · Carrier · Lennox Certified' },
  { icon:'📞', text:'Free Quotes · No Pressure' },
  { icon:'✅', text:'EPA Section 608 Universal Certified' },
];

/* ─── As Featured In ─── */
const FEATURED = ['Lawton Constitution','KSWO News 7','Angi Top Rated','BBB A+','Nextdoor Fave'];

/* ─── Testimonials ─── */
const REVIEWS = [
  {
    name: 'Sarah M.', city: 'Lawton', rating: 5,
    text: '"AC died on the hottest day of the year. They were here in 90 minutes, had us cool again before dinner. Honest pricing, polite techs. We\'re customers for life."',
  },
  {
    name: 'James T.', city: 'Cache', rating: 5,
    text: '"Got 3 quotes for a new furnace. Comfort Pro was the middle price but they spent an hour explaining everything. Install was clean, on time, and they hauled away the old unit. Worth every dollar."',
  },
  {
    name: 'Linda K.', city: 'Elgin', rating: 5,
    text: '"I\'ve used them 4 times in 6 years — never once felt upsold. Last week they actually told me my unit had 2 more years left and didn\'t need replacement yet. Who does that?"',
  },
];

/* ─── FAQs ─── */
const FAQS = [
  { q: 'Do you offer 24/7 emergency service?',                       a: 'Yes. We answer the phone 24/7/365 and have technicians on call every night and weekend. For true emergencies (no heat in winter, no AC over 95°), we guarantee a 2-hour response window.' },
  { q: 'How much does a new AC system cost?',                        a: 'Most full home AC installs run $4,500–$9,500 depending on home size and SEER rating. We offer 0% financing for up to 60 months, and a free in-home estimate with no obligation.' },
  { q: 'Do you service my area?',                                    a: 'We serve Lawton, Cache, Elgin, Fletcher, Apache, Walters, Geronimo, Medicine Park, Sterling, Marlow, and surrounding areas within 30 miles. Outside that? Call us — we still help when we can.' },
  { q: 'What brands do you install?',                                a: 'We\'re factory-certified on Trane, Carrier, Lennox, and Goodman. We\'ll recommend the best fit for your home and budget — never a one-size-fits-all upsell.' },
  { q: 'Do you offer maintenance plans?',                            a: 'Yes. Our Comfort Club is $19/month and includes 2 tune-ups per year, priority emergency service, 15% off all repairs, and no overtime fees. Most members save more than they spend.' },
  { q: 'Are you licensed and insured?',                              a: `Yes — ${BIZ.license}, fully bonded and insured. We carry $2M in liability coverage. Ask any tech to show their ID and license card on arrival.` },
];

export default function HVACTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  /* Sticky header background switch */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-900 font-sans" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

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
              style={{ color: BIZ.orange }}>
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
              style={{ background: `linear-gradient(135deg, ${BIZ.blue}, ${BIZ.navy})` }}>
              C
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg">{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-blue-600 transition-colors">Services</a>
            <a href="#why" className="hover:text-blue-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-blue-600 transition-colors">Reviews</a>
            <a href="#financing" className="hover:text-blue-600 transition-colors">Financing</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">FAQ</a>
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.blue }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 4px 14px rgba(255,107,53,0.4)' }}>
              <Calendar className="w-4 h-4"/> Book Online
            </a>
          </div>
        </div>
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0f172a 60%, ${BIZ.blue} 100%)` }}>
        {/* Cursor-tracked spotlight overlay */}
        <SpotlightOverlay color="rgba(251,146,60,0.18)"/>

        {/* Drifting particle field — snowflakes + heat motes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(22)].map((_, i) => {
            const isOrange = i % 3 === 0;
            const size = 4 + ((i * 13) % 10);
            const left = (i * 17 + 8) % 100;
            const dur = 14 + ((i * 7) % 10);
            const delay = (i * 0.6) % 6;
            return (
              <motion.div key={i}
                animate={{ y: ['-10%', '110%'], x: ['0%', `${(i % 2 ? 1 : -1) * 30}px`], rotate: [0, 360] }}
                transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
                className="absolute"
                style={{ top: '-5%', left: `${left}%`, width: size, height: size }}>
                <div className="w-full h-full rounded-full"
                  style={{ background: isOrange ? `radial-gradient(circle, ${BIZ.orange}cc, transparent 70%)` : 'radial-gradient(circle, rgba(186,230,253,0.8), transparent 70%)' }}/>
              </motion.div>
            );
          })}
        </div>

        {/* Decorative glows */}
        <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          ><div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.orange}50, transparent 60%)`, filter: 'blur(80px)' }}/></motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none"
          ><div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.blue}80, transparent 60%)`, filter: 'blur(80px)' }}/></motion.div>

        {/* Animated gradient mesh background — slowly shifts */}
        <motion.div
          animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(120deg, transparent 30%, ${BIZ.orange}25 50%, transparent 70%)`,
            backgroundSize: '200% 100%',
          }}/>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}/>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.orange}20`, border: `1px solid ${BIZ.orange}50`, color: BIZ.orange }}>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.orange }}/>
              Family-Owned Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              Cool Homes.<br/>
              Warm Hearts.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Done Right.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-blue-100/90 max-w-xl mb-8 leading-relaxed">
              Honest pricing, expert technicians, and a 2-hour emergency response. {BIZ.yearsServing} years of trusted service across southwest Oklahoma.
            </motion.p>

            {/* Dual CTA */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 8px 30px rgba(255,107,53,0.5)' }}>
                <Calendar className="w-5 h-5"/> Schedule Service
              </a>
              <a href={`tel:${BIZ.emergency}`}
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5"/> Emergency: {BIZ.emergency}
              </a>
            </motion.div>

            {/* Hero trust strip */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-blue-100/80">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> {BIZ.license}</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-400"/> {BIZ.insurance}</span>
            </motion.div>
          </div>

          {/* Right: Thermostat-style visual */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating cards */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-6 -right-4 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Snowflake className="w-4 h-4" style={{ color: BIZ.blue }}/>
                  <span className="text-xs font-bold text-slate-600">AC RUNNING</span>
                </div>
                <p className="text-3xl font-black text-slate-900">68°F</p>
                <p className="text-[10px] text-green-600 font-semibold mt-1">↓ 7° in 4 minutes</p>
              </motion.div>

              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-4 h-4 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-700">Tech En Route</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">Mike T. · ETA 23 min<br/>10 yrs · 4.97★ rating</p>
              </motion.div>

              {/* Main thermostat */}
              <div className="aspect-square rounded-full p-1 flex items-center justify-center"
                style={{ background: `conic-gradient(from 220deg, ${BIZ.orange}, #fbbf24, ${BIZ.blue}, ${BIZ.blue}, transparent 270deg)` }}>
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center relative">
                  <div className="absolute inset-4 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.1), transparent 50%)' }}/>
                  <div className="text-center text-white relative z-10">
                    <p className="text-[10px] uppercase tracking-widest text-blue-200/70 mb-1">Current Temp</p>
                    <p className="text-7xl font-black leading-none">72°</p>
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <Snowflake className="w-4 h-4 text-blue-300"/>
                      <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Cooling</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom curve */}
        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #fafbfc, transparent)' }}/>
      </section>

      {/* ═══════ AS FEATURED IN STRIP ═══════ */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">As Featured In</span>
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
                  style={{ background: `${BIZ.blue}10`, color: BIZ.blue }}>
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
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.navy, borderColor: `${BIZ.orange}30` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: '#fbbf24' }}>{m.text}</span>
              <span className="text-slate-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* ═══════ SERVICES GRID ═══════ */}
      <section id="services" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              Full-Service HVAC<br/>Across Southwest Oklahoma
            </h2>
            <p className="text-slate-600 text-lg">From a quick fix on the hottest day of summer to a full system replacement — we do it all, and we do it right.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: 1200 }}>
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:40, scale:0.9 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08, type:'spring', stiffness:80 }}>
                  <TiltCard
                    className="group relative bg-white rounded-2xl p-7 cursor-pointer overflow-hidden"
                    style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                    {/* Animated radial glow that follows the tilt — sits behind content */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ background: `radial-gradient(circle at 50% 0%, ${s.color}25, transparent 60%)` }}/>
                    {/* Animated corner accent */}
                    <motion.div
                      animate={{ rotate: [0, 8, 0, -8, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: i*0.5 }}
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${s.color}, transparent 70%)`, filter: 'blur(20px)' }}/>

                    <div className="relative" style={{ transform: 'translateZ(40px)' }}>
                      <motion.div
                        whileHover={{ rotate: [0, -10, 10, 0], scale: 1.15 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{ background: `${s.color}15`, color: s.color, boxShadow: `0 4px 14px ${s.color}25` }}>
                        <Icon className="w-7 h-7"/>
                      </motion.div>
                      <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                      <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.blue }}>
                        Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                      </span>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Wave divider between slate-50 services and white gallery */}
      <WaveDivider from="#f8fafc" to="#ffffff"/>

      {/* ═══════ PHOTO GALLERY (premium CSS placeholders) ═══════ */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>See Our Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              22 Years of Craftsmanship.<br/>One Photo at a Time.
            </h2>
            <p className="text-slate-600 text-lg">Real installs, real homes, real results. Browse a few favorite jobs from the last year.</p>
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
                  whileHover={{ scale: 1.05, rotate: i % 2 ? 1 : -1 }}
                  style={{
                    background: `linear-gradient(135deg, ${g.accent}, ${BIZ.navy}), linear-gradient(45deg, ${g.accent}80, transparent)`,
                    boxShadow: `0 12px 40px ${g.accent}30, 0 4px 12px rgba(0,0,0,0.1)`,
                  }}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer">
                  {/* Independent continuous float — wrapped so it doesn't fight whileInView */}
                  <motion.div
                    animate={{ y: [0, i % 2 ? -10 : 10, 0] }}
                    transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
                    className="absolute inset-0">
                  {/* Pattern overlay */}
                  <div className="absolute inset-0 opacity-25" style={{ backgroundImage: patternBg, backgroundSize: patternSize }}/>
                  {/* Soft vignette */}
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${BIZ.navy}aa, transparent 70%)` }}/>
                  {/* Center emoji icon */}
                  <div className="absolute inset-0 flex items-center justify-center text-7xl transition-transform group-hover:scale-110 opacity-40" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
                    {g.emoji}
                  </div>
                  {/* Caption bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between"
                    style={{ background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)` }}>
                    <span className="text-white font-bold text-sm tracking-tight">{g.caption}</span>
                    <Camera className="w-4 h-4 text-white/60 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.orange }}/>
            Hundreds more installs in our portfolio · <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.blue }}>Schedule yours →</a>
          </p>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US — BENTO with animated visuals ═══════ */}
      <section id="why" className="py-20 sm:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #fef3c7 0%, #fee2e2 25%, #dbeafe 60%, #dcfce7 100%)` }}>
        {/* Decorative background motion — multiple drifting blobs */}
        <motion.div
          animate={{ x: ['0%','50%','0%'], y: ['0%','-30%','0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.orange}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['0%','-40%','0%'], y: ['0%','30%','0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.blue}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['-20%','20%','-20%'], y: ['10%','-10%','10%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, #10b98140, transparent 60%)`, filter: 'blur(90px)' }}/>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years.<br/>500+ Promises Kept.
            </h2>
            <p className="text-slate-600 text-lg">Family-owned, W-2 crews, paid hourly not by commission — so they earn the same whether they fix it or replace it. We think it shows.</p>
          </div>

          {/* Bento grid · 3 cols × 2 rows · 4 cards in irregular sizes */}
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
                    {/* Top accent stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl"
                      style={{ background: `linear-gradient(90deg, ${w.color}, ${w.colorDeep}, ${w.color})` }}/>
                    {/* Bottom soft color wash */}
                    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
                      style={{ background: `linear-gradient(to top, ${w.color}30, transparent)` }}/>

                    {/* Animated corner glow that shifts */}
                    <motion.div
                      animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.2, 1] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: i*0.5 }}
                      className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
                      style={{ background: `radial-gradient(circle, ${w.color}40, transparent 70%)`, filter: 'blur(40px)' }}/>

                    {/* Big Playfair number — corner tag */}
                    <span className="absolute top-5 right-5 text-[80px] leading-none font-black opacity-[0.08] tracking-tighter pointer-events-none"
                      style={{ color: w.color, fontFamily: '"Playfair Display", serif' }}>
                      {String(i+1).padStart(2,'0')}
                    </span>

                    {/* Card-specific visual element */}
                    {w.visual === 'clock' && (
                      <div className="absolute -bottom-6 -right-6 w-44 h-44 pointer-events-none">
                        <div className="relative w-full h-full rounded-full border-[3px] flex items-center justify-center"
                          style={{ borderColor: `${w.color}30`, background: `radial-gradient(circle, white, ${w.color}10)` }}>
                          {[...Array(12)].map((_, t) => (
                            <div key={t} className="absolute w-0.5 h-2 rounded-full"
                              style={{
                                background: t % 3 === 0 ? w.color : `${w.color}50`,
                                top: '8%',
                                left: '50%',
                                transformOrigin: '50% 540%',
                                transform: `translateX(-50%) rotate(${t*30}deg)`,
                              }}/>
                          ))}
                          {/* Animated minute hand */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-1 h-[40%] rounded-full origin-bottom top-[10%] left-1/2 -translate-x-1/2"
                            style={{ background: w.color, boxShadow: `0 0 10px ${w.color}` }}/>
                          {/* Hour hand */}
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-1.5 h-[28%] rounded-full origin-bottom top-[22%] left-1/2 -translate-x-1/2"
                            style={{ background: BIZ.navy }}/>
                          {/* Center */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white" style={{ background: w.color }}/>
                        </div>
                      </div>
                    )}

                    {w.visual === 'map' && (
                      <div className="absolute -bottom-4 -right-4 w-52 h-52 pointer-events-none">
                        {/* Radar rings */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          {[0.4, 0.6, 0.85].map((s, ri) => (
                            <motion.div key={ri}
                              animate={{ scale: [s, s*1.15, s], opacity: [0.4, 0.1, 0.4] }}
                              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: ri*0.5 }}
                              className="absolute inset-0 rounded-full border-2"
                              style={{ borderColor: `${w.color}40` }}/>
                          ))}
                          {/* Center pin */}
                          <div className="relative w-4 h-4 rounded-full" style={{ background: w.color, boxShadow: `0 0 16px ${w.color}` }}>
                            <motion.div animate={{ scale:[1,2.2,1], opacity:[0.6,0,0.6] }} transition={{ duration:2, repeat:Infinity }}
                              className="absolute inset-0 rounded-full" style={{ background: w.color }}/>
                          </div>
                        </div>
                        {/* Floating city labels */}
                        {[
                          { city:'Lawton', top:'15%', left:'15%' },
                          { city:'Cache',  top:'70%', left:'10%' },
                          { city:'Elgin',  top:'20%', left:'70%' },
                          { city:'Apache', top:'68%', left:'72%' },
                        ].map((c, ci) => (
                          <motion.span key={c.city}
                            animate={{ y:[0,-4,0] }}
                            transition={{ duration: 3+ci*0.3, repeat: Infinity, ease: 'easeInOut', delay: ci*0.5 }}
                            className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white shadow-md"
                            style={{ top: c.top, left: c.left, color: w.color, border: `1px solid ${w.color}30` }}>
                            <MapPin className="w-2.5 h-2.5 inline mr-0.5"/>{c.city}
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
                          style={{ background: `linear-gradient(135deg, ${w.color}, #ea580c)`, boxShadow: `0 8px 20px ${w.color}55` }}>
                          $0 Surprises
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45"
                            style={{ background: w.color }}/>
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
                        style={{ background: `linear-gradient(135deg, ${w.color}, ${w.color}dd)`, boxShadow: `0 8px 24px ${w.color}55` }}>
                        <Icon className="w-7 h-7"/>
                      </motion.div>

                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-2xl font-black tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                        <span className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: `${w.color}15`, color: w.color }}>
                          {w.stat}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed max-w-[28ch]">{w.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA strip */}
          <div className="mt-12 text-center">
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-xl hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #ea580c)`, boxShadow: `0 12px 30px ${BIZ.orange}55` }}>
              Schedule Your Free Estimate <ArrowRight className="w-5 h-5"/>
            </a>
            <p className="text-slate-500 text-sm mt-3">
              {BIZ.jobs} jobs · {BIZ.reviewCount} reviews · {BIZ.rating}★ on Google
            </p>
          </div>
        </div>
      </section>

      {/* ═══════ EMERGENCY BANNER ═══════ */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #dc2626)` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight">No Heat? No Cool? No Problem.</p>
              <p className="text-white/90 text-sm mt-1">2-hour emergency response, 24/7/365 — including holidays.</p>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>Real Reviews</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Customers
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
              <span className="text-sm font-bold text-amber-900">Verified Google Reviews</span>
            </div>
          </div>

          {/* Auto-scrolling review carousel — two rows drifting opposite directions */}
          <div className="relative overflow-hidden">
            {/* Fade masks on edges for premium feel */}
            <div className="absolute top-0 bottom-0 left-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, white, transparent)' }}/>
            <div className="absolute top-0 bottom-0 right-0 w-24 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to left, white, transparent)' }}/>

            {/* Row 1 — drifts left */}
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 mb-6 whitespace-nowrap">
              {[...Array(2)].flatMap((_, copy) => REVIEWS.map((r, i) => (
                <div key={`r1-${copy}-${i}`} className="bg-slate-50 rounded-2xl p-7 flex-shrink-0 w-[380px] whitespace-normal"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="flex mb-4">
                    {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${BIZ.blue}, ${BIZ.navy})` }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: BIZ.navy }}>{r.name}</p>
                      <p className="text-xs text-slate-500">{r.city}, OK · Verified Google</p>
                    </div>
                  </div>
                </div>
              )))}
            </motion.div>

            {/* Row 2 — drifts right (opposite direction) */}
            <motion.div
              animate={{ x: ['-50%', '0%'] }}
              transition={{ duration: 45, repeat: Infinity, ease: 'linear' }}
              className="flex gap-6 whitespace-nowrap">
              {[...Array(2)].flatMap((_, copy) => REVIEWS.map((r, i) => (
                <div key={`r2-${copy}-${i}`} className="bg-slate-50 rounded-2xl p-7 flex-shrink-0 w-[380px] whitespace-normal"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)', borderTop: `3px solid ${BIZ.orange}` }}>
                  <div className="flex mb-4">
                    {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                  </div>
                  <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #ea580c)` }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: BIZ.navy }}>{r.name}</p>
                      <p className="text-xs text-slate-500">{r.city}, OK · Verified Google</p>
                    </div>
                  </div>
                </div>
              )))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════ FINANCING ═══════ */}
      <section id="financing" className="py-20 sm:py-24" style={{ background: BIZ.navy }}>
        <div className="max-w-5xl mx-auto px-4 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>Affordable Financing</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]">
                0% Interest.<br/>
                <span style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  60 Months.
                </span>
              </h2>
              <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
                Don&apos;t let a broken AC drain your savings. We partner with top-rated lenders to offer 0% financing on approved credit — so you can replace your system today and pay over time.
              </p>
              <ul className="space-y-3 mb-8">
                {['Approval in 60 seconds','No prepayment penalty','Soft credit pull, no impact','Loans from $500 to $25,000'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-blue-100/90">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-green-400"/>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href="#book"
                className="inline-flex items-center gap-2 font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 8px 30px rgba(255,107,53,0.4)' }}>
                <CreditCard className="w-5 h-5"/> Apply for Financing
              </a>
            </div>

            <div className="relative">
              <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Sample Monthly Payment</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-6xl font-black" style={{ color: BIZ.navy }}>$117</span>
                  <span className="text-slate-500 font-semibold">/mo</span>
                </div>
                <p className="text-sm text-slate-600 mb-6">$7,000 system · 60 months · 0% APR</p>
                <div className="grid grid-cols-2 gap-3 pt-6 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">System Price</p>
                    <p className="text-lg font-bold" style={{ color: BIZ.navy }}>$7,000</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Interest</p>
                    <p className="text-lg font-bold text-green-600">$0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ SCHEDULE / BOOK FORM ═══════ */}
      <section id="book" className="py-20 sm:py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.cream} 0%, #eff6ff 100%)`, border: '1px solid #dbeafe' }}>
            <div>
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>Book Service</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ color: BIZ.navy }}>
                Schedule in 30 Seconds
              </h2>
              <p className="text-slate-600 text-lg mb-6">
                Tell us what&apos;s going on and we&apos;ll text you back within 10 minutes — even on weekends.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Clock,        text: 'Same-day appointments available' },
                  { icon: MessageCircle,text: 'Reply by text or call — your choice' },
                  { icon: ShieldCheck,  text: 'Free estimates on all installs' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-slate-700">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.blue }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What&apos;s the problem?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option>AC not cooling</option>
                  <option>No heat</option>
                  <option>Weird noise / smell</option>
                  <option>Need a new system</option>
                  <option>Routine maintenance</option>
                  <option>Indoor air quality</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">ZIP / City</label>
                <input type="text" placeholder="73501 or Lawton"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"/>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 8px 30px rgba(255,107,53,0.4)' }}>
                <Zap className="w-5 h-5"/> Get a Callback in 10 Min
              </button>
              <p className="text-center text-xs text-slate-500">No spam, ever. We text once and stop if you ask.</p>
            </form>
          </div>
        </div>
      </section>

      {/* ═══════ SERVICE AREAS ═══════ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.navy }}>
            Proudly Serving Southwest Oklahoma
          </h2>
          <p className="text-slate-600 mb-10">We&apos;re local. We live here too. Here&apos;s where we work.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="bg-white px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-default"
                style={{ color: BIZ.navy }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.blue }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-20 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.orange }}>FAQ</p>
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
                    background: isOpen ? '#f0f9ff' : 'white',
                    borderColor: isOpen ? '#bae6fd' : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.navy }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.blue }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, ${BIZ.blue} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.orange}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            Comfort is One Call Away.
          </h2>
          <p className="text-blue-100/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Whether you need an emergency repair, a new system, or just want a tune-up — we&apos;re ready.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 8px 30px rgba(255,107,53,0.5)' }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-blue-100/70 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> {BIZ.emergency24}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> {BIZ.license}</span>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-slate-900 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white text-lg"
                style={{ background: `linear-gradient(135deg, ${BIZ.blue}, ${BIZ.navy})` }}>C</div>
              <p className="font-bold text-white text-lg">{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline}. {BIZ.yearsServing} years of trusted service in southwest Oklahoma.</p>
            <p className="text-xs text-slate-500">{BIZ.license} · {BIZ.insurance}</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.orange }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.orange }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.orange }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.orange }}/><span>{BIZ.hours}<br/><strong className="text-white">{BIZ.emergency24}</strong></span></li>
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
        style={{ background: `linear-gradient(135deg, ${BIZ.orange}, #f97316)`, boxShadow: '0 8px 30px rgba(255,107,53,0.6)' }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
