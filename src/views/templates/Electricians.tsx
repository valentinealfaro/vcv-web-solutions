/* polished v2 */
'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, Zap, ShieldCheck, ChevronDown, Calendar,
  Check, AlertTriangle, Sparkles, ArrowRight, BadgeCheck, Plug,
  Lightbulb, Power, Cpu, Cable, Star, Home as HomeIcon, MessageCircle,
  FileText, Award, Camera, Trophy, Users,
} from 'lucide-react';

const BIZ = {
  name:        'Volt Brothers Electric',
  tagline:     'Safe. Code-Compliant. Same-Day.',
  phone:       '(580) 555-0345',
  phoneRaw:    '5805550345',
  emergency:   '(580) 555-0933',
  email:       'service@voltbrothers.com',
  address:     '789 Industrial Pkwy, Lawton, OK 73505',
  hours:       'Mon–Sat · 7am–7pm',
  emergency24: '24/7 Emergency Electrical',
  established: 2009,
  yearsServing: new Date().getFullYear() - 2009,
  jobs:        '9,800+',
  responseHr:  '< 90 min',
  rating:      4.9,
  reviewCount: 432,
  license:     'OK Master Electrician #ME-89234',
  insurance:   'Bonded & $2M Insured',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Duncan'],
  /* Electrical palette — high-voltage yellow + safety red on slate */
  navy:    '#1e293b',
  primary: '#fbbf24',   // amber-400 — electricity
  deep:    '#f59e0b',
  alert:   '#dc2626',
  glow:    '#fde047',
};

const SERVICES = [
  { icon: Power,     title: 'Panel Upgrades',         desc: 'Outdated 100A panel? We upgrade to 200A+ with whole-home surge protection.',  color: '#f59e0b' },
  { icon: AlertTriangle, title: 'Emergency Repairs',  desc: 'Sparking outlet? Power loss? Burning smell? Tech dispatched in under 90 min.', color: '#dc2626' },
  { icon: Plug,      title: 'Outlet & Switch Install',desc: 'New outlets, USB ports, smart switches, GFCI safety in baths and kitchens.', color: '#06b6d4' },
  { icon: Lightbulb, title: 'Lighting Design',         desc: 'Recessed lights, chandeliers, LED retrofits, landscape and security lighting.', color: '#fbbf24' },
  { icon: Cpu,       title: 'EV Charger Install',      desc: 'Tesla, ChargePoint, JuiceBox. Level 2 stations installed with permits in 1 day.', color: '#10b981' },
  { icon: Cable,     title: 'Whole-Home Rewire',       desc: 'Knob-and-tube or aluminum wiring? Full rewire with zero-damage routing.',     color: '#7c3aed' },
];

const WHY = [
  { icon: ShieldCheck, title: 'Code-Compliant, Every Time', desc: 'Every job permitted, inspected, and signed off. We don\'t cut corners on safety — period.' },
  { icon: Clock,       title: 'Same-Day Service',           desc: 'Most repairs and installs done the day you call. Emergencies in under 90 min, 24/7.' },
  { icon: FileText,    title: 'Upfront Flat-Rate Pricing',  desc: 'Diagnostic is free with any repair. Written quote before we touch a wire. No hourly meter.' },
  { icon: BadgeCheck,  title: 'Lifetime Workmanship Warranty', desc: 'If wiring we installed ever fails, we come back free for as long as you own the home.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Licensed',     suffix: '',  icon: Award },
  { value: BIZ.jobs,                    label: 'Jobs Completed',     suffix: '',  icon: Users },
  { value: BIZ.responseHr,              label: 'Emergency Response', suffix: '',  icon: Clock },
  { value: BIZ.rating.toString(),       label: 'Google Rating',      suffix: '★', icon: Star  },
];

const GALLERY = [
  { caption: 'Panel upgrade · 200A',    emoji: '⚡', accent: '#fbbf24', pattern: 'grid'    },
  { caption: 'Tesla wall connector',     emoji: '🔌', accent: '#10b981', pattern: 'dots'    },
  { caption: 'Whole-home rewire',        emoji: '🏠', accent: '#06b6d4', pattern: 'stripes' },
  { caption: 'Recessed lighting install',emoji: '💡', accent: '#f59e0b', pattern: 'dots'    },
  { caption: 'Outdoor security lights',  emoji: '🔦', accent: '#7c3aed', pattern: 'grid'    },
  { caption: 'Code-compliant inspection',emoji: '📋', accent: '#dc2626', pattern: 'stripes' },
];

const MARQUEE = [
  { icon:'⚡', text:'90-Minute Emergency Response' },
  { icon:'🛡️', text:'Lifetime Workmanship Warranty' },
  { icon:'📋', text:'NEC 2023 Code-Compliant' },
  { icon:'🏆', text:'Master Electrician Owned · OK #ME-89234' },
  { icon:'💰', text:'0% Financing · 24 Months' },
  { icon:'🚗', text:'Tesla / ChargePoint / JuiceBox Certified' },
  { icon:'✅', text:'Permits Pulled · Inspections Passed' },
];

const FEATURED = ['BBB A+ Accredited','OK Master Electricians Assn.','Tesla Certified Installer','Angi Top Pro','HomeAdvisor Elite'];

/* Industry-specific section: Free Safety Inspection block */
const INSPECTION_ITEMS = [
  'Electrical panel age & capacity check',
  'GFCI/AFCI outlet verification (bath, kitchen, exterior)',
  'Smoke + CO detector battery & date audit',
  'Outdoor outlet weatherproofing inspection',
  'Exposed wire / nicked insulation scan',
  'Surge-protector recommendation report',
];

const REVIEWS = [
  { name: 'Travis K.', city: 'Lawton', rating: 5,
    text: '"Sparking outlet in the kitchen at 9pm. Called Volt Brothers — tech was here by 10:15, fixed it for the quoted price, no upsell. He even labeled my whole panel for free before he left."' },
  { name: 'Karen P.', city: 'Cache', rating: 5,
    text: '"Installed a Tesla wall charger in our garage. Pulled the permit, did it in one day, walked me through the whole thing. They were $400 LESS than the dealer recommended electrician. Pros."' },
  { name: 'Marcus R.', city: 'Elgin', rating: 5,
    text: '"Whole-house rewire on a 1958 ranch. They protected every floor with drop cloths, patched every wall they opened, cleaned up daily. Three weeks, zero surprises. These guys are different."' },
];

const FAQS = [
  { q: 'Do you pull permits for the work?',                          a: 'Always. Every job we do — panel upgrade, EV charger, kitchen rewire — gets a permit pulled and a city inspection scheduled before we close out. We handle the paperwork; you get the signed-off final.' },
  { q: 'How much does a panel upgrade cost?',                        a: 'Most 200-amp panel upgrades run $2,495–$3,895 depending on meter relocation, length of feeder, and city permit fees. We give you a flat written quote after a free in-home assessment.' },
  { q: 'Do you install EV chargers?',                                a: 'Yes — Tesla Wall Connector, ChargePoint, JuiceBox, and most other Level 2 chargers. Most installs are one day. We pull the permit and handle the load calc to make sure your panel has capacity.' },
  { q: 'What\'s the difference between a master and journeyman electrician?', a: 'Master electricians (like our owners) can pull their own permits, design systems, and supervise work. Journeymen are licensed to do the hands-on work. Every Volt Brothers job is overseen by a master — that\'s why we\'re fully insured and code-compliant.' },
  { q: 'Do you offer financing for big jobs?',                       a: 'Yes — 0% financing for 12 or 24 months on jobs over $1,500. Soft credit pull, approval in 60 seconds. Most full panel upgrades run about $89/month over 24 months at zero interest.' },
  { q: 'What areas do you serve?',                                   a: 'Lawton, Cache, Elgin, Fletcher, Apache, Walters, Geronimo, Medicine Park, Duncan, and the surrounding southwest Oklahoma region. Outside that 35-mile radius? Call us — emergencies are case-by-case.' },
  { q: 'Are you really licensed and insured?',                       a: `Yes — ${BIZ.license}, fully bonded, $2M general liability, and workers comp on every tech. Ask for ID and license card on arrival. We're proud to show them.` },
];

export default function ElectriciansTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

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

      {/* Top utility bar */}
      <div className="bg-slate-950 text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <a href={`tel:${BIZ.emergency}`} className="font-bold flex items-center gap-1.5"
            style={{ color: BIZ.primary }}>
            <Zap className="w-3.5 h-3.5 animate-pulse"/>
            <span>24/7 Emergency:</span>
            <span className="underline">{BIZ.emergency}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] sm:top-[32px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-slate-900 text-lg flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 0 16px ${BIZ.primary}66` }}>
              <Zap className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg">{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-amber-600 transition-colors">Services</a>
            <a href="#inspection" className="hover:text-amber-600 transition-colors">Safety Inspection</a>
            <a href="#why" className="hover:text-amber-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-amber-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-amber-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.deep }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-slate-900 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 4px 14px ${BIZ.primary}66` }}>
              <Calendar className="w-4 h-4"/> Book Service
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0f172a 60%, #1e293b 100%)` }}>
        {/* Circuit-board pattern */}
        <div className="absolute inset-0 opacity-[0.12]" style={{
          backgroundImage: `linear-gradient(${BIZ.primary} 1px, transparent 1px), linear-gradient(90deg, ${BIZ.primary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}/>

        {/* Pulsing nodes scattered */}
        {[
          { top:'18%', left:'12%', delay:0 },
          { top:'35%', left:'68%', delay:0.7 },
          { top:'62%', left:'22%', delay:1.4 },
          { top:'78%', left:'58%', delay:2.1 },
          { top:'25%', left:'82%', delay:0.4 },
        ].map((n, i) => (
          <motion.div key={i}
            animate={{ scale:[1,1.5,1], opacity:[0.4,1,0.4] }}
            transition={{ duration:2.5, repeat:Infinity, ease:'easeInOut', delay:n.delay }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{ top:n.top, left:n.left, background:BIZ.primary, boxShadow:`0 0 12px ${BIZ.primary}` }}
          />
        ))}

        {/* Decorative glows */}
        <motion.div style={{ y: heroY }} className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.primary}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.alert}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.primary}20`, border: `1px solid ${BIZ.primary}60`, color: BIZ.primary }}>
              <Zap className="w-3 h-3"/>
              Master Electrician Owned · Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              Safe Wiring.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.glow})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Same-Day Service.
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-300">Fixed Right the First Time.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-slate-300 max-w-xl mb-8 leading-relaxed">
              Licensed master electricians, code-compliant work, and a lifetime workmanship warranty. {BIZ.yearsServing} years protecting southwest Oklahoma homes from electrical disasters.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-slate-900 font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
                <Calendar className="w-5 h-5"/> Schedule Service
              </a>
              <a href={`tel:${BIZ.emergency}`}
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <AlertTriangle className="w-5 h-5"/> Emergency Line
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> Master Licensed</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-400"/> {BIZ.insurance}</span>
            </motion.div>
          </div>

          {/* Right: electrical panel visual */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Panel upgraded" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-600">PASSED</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">City Inspection</p>
                <p className="text-[10px] text-slate-500 mt-0.5">200A panel · Code 2023</p>
              </motion.div>

              {/* Floating "EV ready" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Cpu className="w-5 h-5 text-green-600"/>
                  <span className="text-xs font-bold text-slate-800">EV Ready</span>
                </div>
                <p className="text-[10px] text-slate-500">11.5 kW Level 2 · Permit closed</p>
              </motion.div>

              {/* Main panel mockup */}
              <div className="bg-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden border-2"
                style={{ borderColor: BIZ.primary, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${BIZ.primary}30` }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Service Panel</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }}/>
                    <span className="text-[10px] font-bold text-green-400">LIVE</span>
                  </div>
                </div>

                <p className="text-white text-xl font-black mb-5">200A Main · 40-Slot</p>

                {/* Breaker rows */}
                <div className="grid grid-cols-2 gap-1.5 mb-4">
                  {[
                    { label:'KITCHEN', amp:'20A', active:true },
                    { label:'BATH GFCI', amp:'20A', active:true },
                    { label:'EV CHARGER', amp:'50A', active:true, accent:true },
                    { label:'HVAC', amp:'30A', active:true },
                    { label:'WASHER', amp:'20A', active:true },
                    { label:'DRYER', amp:'30A', active:true },
                    { label:'LIVING RM', amp:'15A', active:false },
                    { label:'BEDROOMS', amp:'15A', active:true },
                  ].map((b, i) => (
                    <div key={i} className="rounded-lg px-2 py-1.5 flex items-center justify-between"
                      style={{ background: b.accent ? `${BIZ.primary}25` : 'rgba(255,255,255,0.05)', border: `1px solid ${b.accent ? BIZ.primary : 'rgba(255,255,255,0.1)'}` }}>
                      <span className="text-[9px] font-bold text-slate-300 truncate">{b.label}</span>
                      <span className="text-[9px] font-bold tabular-nums" style={{ color: b.active ? (b.accent ? BIZ.glow : '#86efac') : '#64748b' }}>
                        {b.amp}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-between text-[10px] mb-1.5">
                    <span className="text-slate-400 font-bold">CURRENT LOAD</span>
                    <span className="font-bold tabular-nums" style={{ color: BIZ.primary }}>42.7 / 200 A</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                    <motion.div animate={{ width:['20%','24%','20%'] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${BIZ.primary}, ${BIZ.glow})`, boxShadow: `0 0 12px ${BIZ.primary}` }}/>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgb(248 250 252), transparent)' }}/>
      </section>

      {/* AS FEATURED IN STRIP */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">As Featured / Certified</span>
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
                  style={{ background: `${BIZ.primary}15`, color: BIZ.deep }}>
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

      {/* SCROLLING MARQUEE */}
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.navy, borderColor: `${BIZ.primary}40` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: BIZ.glow }}>{m.text}</span>
              <span className="text-slate-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>Full-Service Electrical</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
              From a Bad Outlet to<br/>a Full Rewire — We Do It All
            </h2>
            <p className="text-slate-600 text-lg">Every job done by a licensed master electrician. Permits handled. Workmanship warrantied for life.</p>
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
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.deep }}>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>Recent Installs</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              Real Work. Real Homes.<br/>Real Code-Compliant.
            </h2>
            <p className="text-slate-600 text-lg">A few favorite jobs from the last year — panels, EV chargers, rewires, and lighting installs.</p>
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
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.deep }}/>
            9,800+ installs in our portfolio · <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.deep }}>Schedule yours →</a>
          </p>
        </div>
      </section>

      {/* FREE SAFETY INSPECTION (unique to electricians) */}
      <section id="inspection" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0f172a 100%)`, border: `1px solid ${BIZ.primary}30` }}>
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: `${BIZ.primary}20`, border: `1px solid ${BIZ.primary}60`, color: BIZ.primary }}>
                <ShieldCheck className="w-3 h-3"/> Free Home Safety Audit
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]">
                Is Your Wiring a<br/>
                <span style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.glow})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Fire Waiting to Happen?
                </span>
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed mb-6">
                Most home electrical fires start at a single overlooked outlet, a tired panel, or an outdated GFCI. A licensed master electrician will inspect your home — free, no obligation, no upsell pressure.
              </p>
              <a href="#book"
                className="inline-flex items-center gap-2 text-slate-900 font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
                Book My Free Safety Inspection <ArrowRight className="w-5 h-5"/>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">What we check — every visit</p>
              <ul className="space-y-3">
                {INSPECTION_ITEMS.map((item, i) => (
                  <motion.li key={item}
                    initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ delay: i*0.06 }}
                    className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${BIZ.primary}25`, color: BIZ.deep }}>
                      <Check className="w-3.5 h-3.5"/>
                    </div>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                <p className="font-bold text-slate-900">$0 · No obligation</p>
                <p className="text-xs text-slate-500 mt-0.5">Most inspections done in 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.navy }}>
              {BIZ.yearsServing} Years of Wiring.<br/>Zero Code Violations.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              We started Volt Brothers in {BIZ.established} after years watching homeowners get hurt by &ldquo;handyman&rdquo; electrical work that wasn&apos;t permitted, wasn&apos;t inspected, and wasn&apos;t safe. We do it the right way every time.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Every tech on our team is a W-2 employee — drug-tested, background-checked, and trained on the latest NEC code. Diagnostics are free with any repair. Flat-rate written quotes before we touch a wire. And every install we&apos;ve done is still working under our lifetime warranty.
            </p>
            <a href="#book"
              className="inline-flex items-center gap-2 text-slate-900 font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}50` }}>
              Schedule a Free Estimate <ArrowRight className="w-5 h-5"/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08 }}
                  className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: BIZ.navy, color: BIZ.primary }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.navy }}>{w.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #991b1b)` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight">Sparks? Burning Smell? No Power?</p>
              <p className="text-white/90 text-sm mt-1">90-minute emergency response, 24/7. No after-hours fees, no holiday surcharge.</p>
            </div>
          </div>
          <a href={`tel:${BIZ.emergency}`}
            className="bg-white text-red-600 font-black px-7 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg">
            <Phone className="w-5 h-5"/> {BIZ.emergency}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>Real Reviews</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy }}>
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
                className="bg-slate-50 rounded-2xl p-7">
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-900"
                    style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})` }}>
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

      {/* BOOK FORM */}
      <section id="book" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0f172a 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.primary }}>Book Service</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
                Tell Us About<br/>Your Job.
              </h2>
              <p className="text-slate-300 text-lg mb-6">
                A licensed electrician will text you back in under 10 minutes. Free quotes on any install over $300.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Clock,        text: 'Same-day appointments most days' },
                  { icon: MessageCircle,text: 'Reply by text or call — your pick' },
                  { icon: ShieldCheck,  text: 'Free diagnostic with any repair' },
                  { icon: BadgeCheck,   text: 'Flat-rate written quote BEFORE we start' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-slate-300">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.primary }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What kind of job?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all">
                  <option>Electrical emergency (sparks/burning smell)</option>
                  <option>Panel upgrade or replacement</option>
                  <option>EV charger install</option>
                  <option>New outlets or switches</option>
                  <option>Lighting install or upgrade</option>
                  <option>Whole-home rewire</option>
                  <option>Free safety inspection</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First & last"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">ZIP / City</label>
                <input type="text" placeholder="73501 or Lawton"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
              </div>
              <button type="submit"
                className="w-full text-slate-900 font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
                <Zap className="w-5 h-5"/> Get a Callback in 10 Min
              </button>
              <p className="text-center text-xs text-slate-500">No spam, ever. We text once and stop if you ask.</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.navy }}>
            Wiring Southwest Oklahoma
          </h2>
          <p className="text-slate-600 mb-10">We&apos;re local — here&apos;s where our trucks roll daily.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="bg-slate-50 px-5 py-2.5 rounded-full text-sm font-bold border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all cursor-default"
                style={{ color: BIZ.navy }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.deep }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.deep }}>FAQ</p>
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
                    background: isOpen ? '#fefce8' : 'white',
                    borderColor: isOpen ? '#fde68a' : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.navy }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.deep }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, #0f172a 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.primary}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            One Call. Powered Right.
          </h2>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Emergency repair, panel upgrade, EV charger, or a full home rewire — we&apos;re fast, safe, and code-compliant on every job.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="text-slate-900 font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-slate-400 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> {BIZ.emergency24}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Master Licensed</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-300 py-14">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-900"
                style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})` }}>
                <Zap className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg">{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline} {BIZ.yearsServing} years of safe, code-compliant electrical work in southwest Oklahoma.</p>
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
          <p>Master Electrician Owned · Locally trusted since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.primary}, ${BIZ.deep})`, boxShadow: `0 8px 30px ${BIZ.primary}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-slate-900"/>
      </a>
    </div>
  );
}
