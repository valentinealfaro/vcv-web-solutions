/* polished v2 · why-bento v3 */
'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Leaf, Trees, Sprout, Droplets, Sun, Snowflake, Award, Scissors,
  Camera, Trophy, Users,
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

const BIZ = {
  name:        'Greenline Lawn & Landscape',
  tagline:     'Crafted Yards. Honest Crews.',
  phone:       '(580) 555-0456',
  phoneRaw:    '5805550456',
  email:       'hello@greenlinelandscape.com',
  address:     '2200 Cedar Way, Lawton, OK 73505',
  hours:       'Mon–Sat · 7am–6pm',
  established: 2011,
  yearsServing: new Date().getFullYear() - 2011,
  jobs:        '6,800+',
  responseHr:  'Same week',
  rating:      4.9,
  reviewCount: 318,
  license:     'OK Lawn & Landscape Lic. #LL-7741',
  insurance:   'Bonded & $2M Insured',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Sterling'],
  /* Earthy palette — forest + warm earth + bright lime */
  forest:  '#166534',
  earth:   '#92400e',
  lime:    '#84cc16',
  cream:   '#fefdf8',
  charcoal:'#1c1917',
};

const SERVICES = [
  { icon: Scissors, title: 'Weekly Lawn Mowing',     desc: 'Same crew, same day, every week. Edged, blown, hauled — always.',                color: '#84cc16' },
  { icon: Leaf,     title: 'Mulch & Bed Refresh',    desc: 'Fresh hardwood or pine bark mulch, weed pulled, beds edged. Spring & fall.',     color: '#92400e' },
  { icon: Sprout,   title: 'Landscape Design',       desc: 'Full-yard design with 3D plans. Plants, rock, lighting — installed in days.',   color: '#166534' },
  { icon: Droplets, title: 'Sprinkler Service',      desc: 'Install, repair, winterize, and reprogram. Rain sensors and smart controllers.', color: '#0ea5e9' },
  { icon: Trees,    title: 'Tree & Shrub Care',      desc: 'Pruning, removal, stump grinding, and disease treatment. Fully insured.',         color: '#15803d' },
  { icon: Sun,      title: 'Hardscape & Patios',     desc: 'Paver patios, retaining walls, fire pits, and walkways. Built to last decades.',  color: '#a16207' },
];

/* ─── Why-choose-us differentiators — BENTO with visuals ─── */
const WHY = [
  {
    icon: ShieldCheck, title: 'Same Crew Every Visit', stat: '★',
    desc: 'You see the same faces every week. They learn your yard, your dog, and your preferences.',
    color: '#166534', colorDeep: '#14532d', span: 'lg:col-span-2', visual: 'stars',
  },
  {
    icon: BadgeCheck, title: 'Damage-Free Guarantee', stat: '$0',
    desc: 'If we damage anything — sprinkler head, fence, plant — we replace it free. Period.',
    color: '#84cc16', colorDeep: '#4d7c0f', span: 'lg:row-span-2', visual: 'price',
  },
  {
    icon: Calendar, title: 'Show Up When We Say', stat: '30m',
    desc: 'Text alerts when crew is 30 min out. If we miss a visit, the next one is on us.',
    color: '#0ea5e9', colorDeep: '#0369a1', span: '', visual: 'clock',
  },
  {
    icon: Award, title: 'Owner-Trained Foremen', stat: '5+',
    desc: 'Every foreman has 5+ years with us. No revolving-door subcontractors. Ever.',
    color: '#92400e', colorDeep: '#78350f', span: '', visual: 'map',
  },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Business',    suffix: '',  icon: Award },
  { value: BIZ.jobs,                    label: 'Yards Maintained',     suffix: '',  icon: Users },
  { value: BIZ.responseHr,              label: 'Quote Turnaround',     suffix: '',  icon: Clock },
  { value: BIZ.rating.toString(),       label: 'Google Rating',        suffix: '★', icon: Star  },
];

const GALLERY = [
  { caption: 'Fresh mulch · spring',     emoji: '🌱', accent: '#84cc16', pattern: 'dots'    },
  { caption: 'Paver patio · finished',   emoji: '🏡', accent: '#a16207', pattern: 'grid'    },
  { caption: 'Sprinkler install · new',  emoji: '💧', accent: '#0ea5e9', pattern: 'dots'    },
  { caption: 'Backyard makeover',        emoji: '🌿', accent: '#166534', pattern: 'stripes' },
  { caption: 'Fire pit · evening',       emoji: '🔥', accent: '#ea580c', pattern: 'dots'    },
  { caption: 'Crew on a Tuesday morning',emoji: '👷', accent: '#15803d', pattern: 'grid'    },
];

const MARQUEE = [
  { icon:'🌿', text:'Same Crew Every Visit · Always' },
  { icon:'🛡️', text:'Damage-Free Guarantee on Every Job' },
  { icon:'⭐', text:'4.9★ from 318 Lawton-Area Customers' },
  { icon:'📞', text:'Free Quotes Within 24 Hours' },
  { icon:'🌳', text:'Tree & Shrub Care · Fully Insured' },
  { icon:'💧', text:'Hunter / Rainbird / Toro Certified' },
  { icon:'✅', text:'Family-Owned Since 2011' },
];

const FEATURED = ['Best of Lawton 2024','Angi Super Service','OK Landscape Pros','Google 4.9★','BBB Accredited'];

/* Industry-specific section: SEASONAL CALENDAR */
const SEASONS = [
  {
    title: 'Spring',
    months: 'Mar – May',
    color: '#84cc16',
    icon: Sprout,
    services: ['Spring cleanup & dethatch', 'Pre-emergent weed control', 'Fresh mulch + bed edging', 'Sprinkler startup & test'],
  },
  {
    title: 'Summer',
    months: 'Jun – Aug',
    color: '#eab308',
    icon: Sun,
    services: ['Weekly mowing & trimming', 'Fertilization rounds 2 & 3', 'Drought-aware watering plan', 'Hedge & shrub shaping'],
  },
  {
    title: 'Fall',
    months: 'Sep – Nov',
    color: '#ea580c',
    icon: Leaf,
    services: ['Leaf cleanup & blowing', 'Aeration & overseeding', 'Final fertilization', 'Sprinkler winterization'],
  },
  {
    title: 'Winter',
    months: 'Dec – Feb',
    color: '#06b6d4',
    icon: Snowflake,
    services: ['Tree & shrub pruning', 'Hardscape installs (off-season)', 'Spring planning consult', 'Storm cleanup as needed'],
  },
];

const REVIEWS = [
  { name: 'Diane H.', city: 'Lawton', rating: 5,
    text: '"Switched from a corporate lawn company after 4 years of broken sprinklers and rotating crews. Greenline showed up Tuesday at 8am sharp — same time every week for two years now. My yard has never looked better."' },
  { name: 'Carlos M.', city: 'Cache', rating: 5,
    text: '"They designed and installed a full backyard with paver patio, fire pit, and lighting. Took 8 days, came in $2K under quote. The foreman texted me daily photos. Best contractor experience I\'ve had."' },
  { name: 'Beth N.', city: 'Elgin', rating: 5,
    text: '"Their crew accidentally cracked a sprinkler valve. They had it replaced before I even got home from work — no charge, no excuses, no \'we\'ll get to it.\' That is rare."' },
];

const FAQS = [
  { q: 'Do you offer one-time cleanups or weekly service only?',     a: 'Both. We do one-time spring cleanups, fall leaf blowouts, and storm cleanup, as well as weekly/biweekly recurring lawn service. Flat-rate pricing on every job.' },
  { q: 'What does weekly lawn service cost?',                        a: 'Most residential yards run $35–$65 per visit depending on size and complexity. We give you a free flat-rate quote after a 5-minute drive-by — no walk-through needed for a quote.' },
  { q: 'Do you handle sprinkler repairs?',                           a: 'Yes — our team is fully trained on Hunter, Rainbird, Toro, and Orbit systems. We fix broken heads, repair leaks, replace controllers, and winterize/de-winterize systems.' },
  { q: 'Can you redesign my whole yard?',                            a: 'Absolutely. We do full landscape design with 3D plans before installation. Most full backyard makeovers are completed in 1–2 weeks. Free design consult and quote, no obligation.' },
  { q: 'What if it rains on my mow day?',                            a: 'We text you when crew is 30 min out OR when we\'re skipping due to weather. If we skip, your next visit is rescheduled within 48 hours at no extra charge.' },
  { q: 'Are you really insured?',                                    a: `Yes — ${BIZ.license}, fully bonded, $2M general liability, and workers comp on every crew. Ask any foreman to show their ID and insurance card. We are proud to show them.` },
  { q: 'Do you do snow removal?',                                    a: 'Limited storm cleanup for commercial accounts only — most southwest OK winters don\'t get enough snow to make residential plowing practical. We do offer ice-melt and walkway clearing for storm events.' },
];

export default function LandscapersTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeSeason, setActiveSeason] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: BIZ.cream, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Template preview banner */}
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
          <a href={`tel:${BIZ.phoneRaw}`} className="font-bold flex items-center gap-1.5"
            style={{ color: BIZ.lime }}>
            <Phone className="w-3.5 h-3.5"/>
            <span>Free Quote:</span>
            <span className="underline">{BIZ.phone}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] sm:top-[32px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})`, boxShadow: `0 0 16px ${BIZ.lime}44` }}>
              <Leaf className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg">{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-green-700 transition-colors">Services</a>
            <a href="#calendar" className="hover:text-green-700 transition-colors">Seasonal Plan</a>
            <a href="#why" className="hover:text-green-700 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-green-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-green-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-green-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.forest }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})`, boxShadow: `0 4px 14px ${BIZ.forest}66` }}>
              <Calendar className="w-4 h-4"/> Free Quote
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.forest} 0%, #14532d 60%, #166534 100%)` }}>
        {/* Organic blob glows */}
        <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.lime}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.earth}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        {/* Floating leaf pattern */}
        {[
          { top:'15%', left:'8%', delay:0 },
          { top:'68%', left:'18%', delay:1.2 },
          { top:'30%', left:'85%', delay:0.6 },
          { top:'78%', left:'72%', delay:1.8 },
        ].map((p, i) => (
          <motion.div key={i}
            animate={{ y:[0,-20,0], rotate:[0,15,0] }}
            transition={{ duration:6+i, repeat:Infinity, ease:'easeInOut', delay:p.delay }}
            className="absolute pointer-events-none opacity-30"
            style={{ top:p.top, left:p.left }}>
            <Leaf className="w-8 h-8 text-lime-300"/>
          </motion.div>
        ))}

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.lime}25`, border: `1px solid ${BIZ.lime}60`, color: BIZ.lime }}>
              <Leaf className="w-3 h-3"/>
              Family-Owned · Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              The Yard You<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.lime}, #fef08a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Always Wanted
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-green-100/90">— Maintained by People You Trust.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-green-100/90 max-w-xl mb-8 leading-relaxed">
              Same crew every visit. On time, every time. {BIZ.yearsServing} years crafting beautiful yards across southwest Oklahoma.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.lime}, #65a30d)`, color: BIZ.charcoal, boxShadow: `0 8px 30px ${BIZ.lime}66` }}>
                <Calendar className="w-5 h-5"/> Get Free Quote
              </a>
              <a href={`tel:${BIZ.phoneRaw}`}
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5"/> Call {BIZ.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-green-100/80">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-lime-300"/> {BIZ.insurance}</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-lime-300"/> Damage-Free Guarantee</span>
            </motion.div>
          </div>

          {/* Right: rotating seasonal service tiles */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Crew On Site" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-600">SERVICED</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">Tuesday · 8:14 AM</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Mowed, edged, blown</p>
              </motion.div>

              {/* Floating "Next Visit" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-5 h-5 text-green-600"/>
                  <span className="text-xs font-bold text-slate-800">Next Visit</span>
                </div>
                <p className="text-[10px] text-slate-500">Tuesday · 8 AM · Crew B</p>
                <p className="text-[10px] text-green-600 font-semibold mt-1">+ Pre-emergent treatment</p>
              </motion.div>

              {/* Main visual: 4-season tile grid */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Your Yard · Annual Plan</span>
                  <span className="text-[10px] font-bold tabular-nums" style={{ color: BIZ.forest }}>$48/visit</span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  {SEASONS.map((s, i) => {
                    const SIcon = s.icon;
                    const isActive = i === activeSeason;
                    return (
                      <motion.div key={s.title}
                        animate={{ scale: isActive ? 1.05 : 1, opacity: isActive ? 1 : 0.55 }}
                        transition={{ duration: 0.4 }}
                        onMouseEnter={() => setActiveSeason(i)}
                        className="rounded-xl p-3 cursor-pointer"
                        style={{ background: `${s.color}15`, border: `1.5px solid ${isActive ? s.color : 'transparent'}` }}>
                        <SIcon className="w-5 h-5 mb-1" style={{ color: s.color }}/>
                        <p className="text-xs font-bold text-slate-800">{s.title}</p>
                        <p className="text-[9px] text-slate-500">{s.months}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Active season detail */}
                <motion.div key={activeSeason}
                  initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                  className="bg-slate-50 rounded-xl p-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
                    {SEASONS[activeSeason].title} services included
                  </p>
                  <ul className="space-y-1">
                    {SEASONS[activeSeason].services.slice(0,3).map(svc => (
                      <li key={svc} className="text-xs text-slate-700 flex items-start gap-1.5">
                        <Check className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: SEASONS[activeSeason].color }}/>
                        {svc}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${BIZ.cream}, transparent)` }}/>
      </section>

      {/* AS FEATURED IN STRIP */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">As Featured / Awarded</span>
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

      {/* TRUST METRICS */}
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
                  style={{ background: `${BIZ.forest}15`, color: BIZ.forest }}>
                  <Icon className="w-6 h-6"/>
                </div>
                <p className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: BIZ.forest, fontFamily: '"Playfair Display", serif' }}>
                  {m.value}{m.suffix}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SCROLLING MARQUEE */}
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.charcoal, borderColor: `${BIZ.lime}40` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: BIZ.lime }}>{m.text}</span>
              <span className="text-stone-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.charcoal }}>
              From a Quick Cut<br/>to a Full Yard Build
            </h2>
            <p className="text-slate-600 text-lg">Mowing, mulch, design, sprinklers, hardscape — one crew, one bill, one call.</p>
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
                  <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: BIZ.charcoal, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.forest }}>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>Recent Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.charcoal, fontFamily: '"Playfair Display", serif' }}>
              13 Years of Yards.<br/>One Photo at a Time.
            </h2>
            <p className="text-slate-600 text-lg italic">Real lawns, real makeovers, real southwest Oklahoma homes.</p>
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
                    background: `linear-gradient(135deg, ${g.accent}, ${BIZ.charcoal})`,
                    boxShadow: `0 12px 40px ${g.accent}30, 0 4px 12px rgba(0,0,0,0.1)`,
                  }}>
                  <div className="absolute inset-0 opacity-25" style={{ backgroundImage: patternBg, backgroundSize: patternSize }}/>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${BIZ.charcoal}aa, transparent 70%)` }}/>
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
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.forest }}/>
            6,800+ yards in our portfolio · <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.forest }}>Get yours quoted →</a>
          </p>
        </div>
      </section>

      {/* SEASONAL CALENDAR — unique to landscapers */}
      <section id="calendar" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>Your Year-Round Plan</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.charcoal }}>
              One Crew. Every Season.<br/>Nothing You Need to Remember.
            </h2>
            <p className="text-slate-600 text-lg">We schedule every seasonal service on your calendar — pre-emergent in March, aeration in October, sprinkler winterization in November. You never miss a season.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {SEASONS.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1 }}
                  whileHover={{ y:-6 }}
                  className="rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: `linear-gradient(180deg, ${s.color}10, white)`, border: `1px solid ${s.color}30` }}>
                  <div className="p-5 border-b" style={{ borderColor: `${s.color}25`, background: `${s.color}15` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: 'white', color: s.color, boxShadow: `0 4px 14px ${s.color}40` }}>
                      <Icon className="w-6 h-6"/>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight" style={{ color: BIZ.charcoal }}>{s.title}</h3>
                    <p className="text-xs font-bold tracking-wider uppercase" style={{ color: s.color }}>{s.months}</p>
                  </div>
                  <ul className="p-5 space-y-2.5">
                    {s.services.map(svc => (
                      <li key={svc} className="flex items-start gap-2 text-sm text-slate-700">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: s.color }}/>
                        <span>{svc}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center mt-10 text-slate-600">
            All four seasons covered for around <strong style={{ color: BIZ.forest }}>$185/month</strong> on most yards.{' '}
            <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.forest }}>Get exact quote →</a>
          </p>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US — BENTO with animated visuals ═══════ */}
      <section id="why" className="py-20 sm:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #f0fdf4 0%, #fef9c3 30%, #ffedd5 60%, #ecfdf5 100%)` }}>
        <motion.div
          animate={{ x: ['0%','50%','0%'], y: ['0%','-30%','0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.lime}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['0%','-40%','0%'], y: ['0%','30%','0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.forest}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['-20%','20%','-20%'], y: ['10%','-10%','10%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.earth}40, transparent 60%)`, filter: 'blur(90px)' }}/>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.charcoal, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years. Same Crews.<br/>Same Standards.
            </h2>
            <p className="text-slate-600 text-lg">W-2 crews, uniformed, drug-tested, foremen with 5+ years on staff. Show up when we say, leave it cleaner than we found it.</p>
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
                            style={{ background: BIZ.charcoal }}/>
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
                          { city:'5 yr', top:'15%', left:'15%' },
                          { city:'8 yr', top:'70%', left:'10%' },
                          { city:'10 yr',top:'20%', left:'70%' },
                          { city:'12 yr',top:'68%', left:'72%' },
                        ].map((c, ci) => (
                          <motion.span key={c.city}
                            animate={{ y:[0,-4,0] }}
                            transition={{ duration: 3+ci*0.3, repeat: Infinity, ease: 'easeInOut', delay: ci*0.5 }}
                            className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white shadow-md"
                            style={{ top: c.top, left: c.left, color: w.color, border: `1px solid ${w.color}30` }}>
                            <Award className="w-2.5 h-2.5 inline mr-0.5"/>{c.city}
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
                            <Leaf className="w-7 h-7 fill-current" style={{ color: w.color, filter: `drop-shadow(0 2px 6px ${w.color}66)` }}/>
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
                          We Replace It
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45" style={{ background: w.color }}/>
                        </motion.div>
                        <div className="flex gap-1 mt-2 justify-end">
                          {['Spotted','Fixed','Free'].map((l, li) => (
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

                    <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                      <motion.div
                        whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white"
                        style={{ background: `linear-gradient(135deg, ${w.color}, ${w.colorDeep})`, boxShadow: `0 8px 24px ${w.color}55` }}>
                        <Icon className="w-7 h-7"/>
                      </motion.div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-2xl font-black tracking-tight" style={{ color: BIZ.charcoal, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
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
              style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})`, boxShadow: `0 12px 30px ${BIZ.forest}55` }}>
              Get a Free Quote <ArrowRight className="w-5 h-5"/>
            </a>
            <p className="text-slate-500 text-sm mt-3">
              {BIZ.jobs} yards · {BIZ.reviewCount} reviews · {BIZ.rating}★ on Google
            </p>
          </div>
        </div>
      </section>

      {/* SCROLLING TESTIMONIAL BANNER (moving banner!) */}
      <section className="py-8 overflow-hidden" style={{ background: BIZ.charcoal }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-12 whitespace-nowrap text-white text-lg font-bold">
          {[...Array(2)].flatMap((_, copy) => [
            { city:'Lawton',   text:'"Same crew every Tuesday for 2 years"' },
            { city:'Cache',    text:'"Came in $2K under quote on a backyard build"' },
            { city:'Elgin',    text:'"Replaced a sprinkler valve free, no excuses"' },
            { city:'Apache',   text:'"Texts me when crew is 30 min out, every time"' },
            { city:'Walters',  text:'"My yard has never looked better"' },
          ].map((q, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400"/>
              <span style={{ color: BIZ.lime }}>{q.text}</span>
              <span className="text-slate-500">— {q.city}, OK</span>
              <span className="text-slate-700">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>Real Customers</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.charcoal }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Customers
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
                className="rounded-2xl p-7"
                style={{ background: BIZ.cream, border: `1px solid ${BIZ.forest}15` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.forest}15` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.charcoal }}>{r.name}</p>
                    <p className="text-xs text-slate-500">{r.city}, OK · Verified Google</p>
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
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.forest} 0%, #14532d 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lime }}>Free Quote</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
                Tell Us About<br/>Your Yard.
              </h2>
              <p className="text-green-100 text-lg mb-6">
                We&apos;ll text you back with a flat-rate quote in under 24 hours. No walk-through needed for most jobs.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Free estimates, always' },
                  { icon: MessageCircle,text: 'Reply by text or call — your pick' },
                  { icon: ShieldCheck,  text: 'Damage-free guarantee on every visit' },
                  { icon: BadgeCheck,   text: 'Flat-rate pricing — no hourly meter' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-green-100">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.lime }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What do you need?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all">
                  <option>Weekly lawn mowing</option>
                  <option>One-time spring or fall cleanup</option>
                  <option>Mulch &amp; bed refresh</option>
                  <option>Landscape design / makeover</option>
                  <option>Sprinkler install or repair</option>
                  <option>Tree pruning or removal</option>
                  <option>Hardscape / patio install</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Yard size (rough)</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all">
                  <option>Small (under 1/4 acre)</option>
                  <option>Medium (1/4 to 1/2 acre)</option>
                  <option>Large (1/2 to 1 acre)</option>
                  <option>Estate (1+ acres)</option>
                  <option>Not sure — please measure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})`, boxShadow: `0 8px 30px ${BIZ.forest}66` }}>
                <Leaf className="w-5 h-5"/> Get My Free Quote
              </button>
              <p className="text-center text-xs text-slate-500">No spam, ever. We text once and stop if you ask.</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.charcoal }}>
            Greener Yards Across Southwest OK
          </h2>
          <p className="text-slate-600 mb-10">We&apos;re local — here&apos;s where our crews work daily.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.cream, color: BIZ.charcoal, borderColor: `${BIZ.forest}25` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.forest }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.forest }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.charcoal }}>
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
                    background: isOpen ? '#f7fee7' : 'white',
                    borderColor: isOpen ? '#bef264' : '#e5e5e5',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.charcoal }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.forest }}/>
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

      {/* FINAL CTA */}
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.forest} 0%, #14532d 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.lime}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            One Crew. All Year.<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.lime}, #fef08a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              The Yard You Want.
            </span>
          </h2>
          <p className="text-green-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Free quote in under 24 hours. No high-pressure sales call. Just a flat-rate price and a crew that shows up when we say we will.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.lime}, #65a30d)`, color: BIZ.charcoal, boxShadow: `0 8px 30px ${BIZ.lime}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Get Free Quote
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-green-100/80 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> {BIZ.insurance}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5"/> Damage-Free Guarantee</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-slate-300" style={{ background: BIZ.charcoal }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})` }}>
                <Leaf className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg">{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline} {BIZ.yearsServing} years crafting beautiful yards across southwest Oklahoma.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lime }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lime }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lime }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lime }}/><span>{BIZ.hours}</span></li>
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

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.forest}, ${BIZ.lime})`, boxShadow: `0 8px 30px ${BIZ.forest}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
