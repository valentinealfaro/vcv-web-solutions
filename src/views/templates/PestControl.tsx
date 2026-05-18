'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Bug, Award, AlertTriangle, Home as HomeIcon, Leaf, Users, Zap, Activity,
} from 'lucide-react';

const BIZ = {
  name:        'Trail&apos;s End Pest Solutions',
  nameSafe:    'Trail\'s End Pest Solutions',
  tagline:     'Family-Safe · Pet-Safe · Permanent Results',
  phone:       '(580) 555-0923',
  phoneRaw:    '5805550923',
  emergency:   '(580) 555-0944',
  email:       'service@trailsendpest.com',
  address:     '3210 SE Industrial Dr, Lawton, OK 73501',
  hours:       'Mon–Sat · 7am–7pm · Same-day service available',
  emergency24: 'Bee/Wasp Emergencies 24/7',
  established: 2012,
  yearsServing: new Date().getFullYear() - 2012,
  jobs:        '14,200+',
  responseHr:  'Same day',
  rating:      4.9,
  reviewCount: 567,
  license:     'OK Pest Control Lic. #PCO-7732',
  insurance:   'Bonded · $2M Insured · EPA Certified',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Duncan','Marlow'],
  /* Outdoor-trades palette — olive + earth + safety orange */
  olive:    '#65a30d',
  oliveDeep:'#3f6212',
  earth:    '#78350f',
  earthDeep:'#451a03',
  safety:   '#f97316',
  safetyDeep:'#c2410c',
  cream:    '#fefce8',
  paper:    '#fafaf9',
};

/* Common SW Oklahoma pests — for the "what we treat" radar section */
const PESTS = [
  { name:'Termites',   season:'Year-round', threat:'High',   icon:'🪵', color:'#dc2626',
    desc:'Subterranean &amp; drywood. Free inspection &amp; bait stations.' },
  { name:'Ants',       season:'Spring–Fall', threat:'Medium', icon:'🐜', color:'#92400e',
    desc:'Fire ants, carpenter ants, sugar ants. Indoor &amp; outdoor.' },
  { name:'Roaches',    season:'Year-round', threat:'High',   icon:'🪳', color:'#7c2d12',
    desc:'German &amp; American. Gel bait + IGR for permanent control.' },
  { name:'Mice / Rats',season:'Fall–Winter', threat:'High',   icon:'🐀', color:'#525252',
    desc:'Sealed exclusion + bait stations. Humane removal options.' },
  { name:'Mosquitoes', season:'Spring–Fall', threat:'Medium', icon:'🦟', color:'#0ea5e9',
    desc:'Yard misting + breeding-site treatment. Mosquito-free patios.' },
  { name:'Wasps / Bees',season:'Summer',     threat:'High',   icon:'🐝', color:'#eab308',
    desc:'Same-day removal. Beekeeper-relocation when possible.' },
  { name:'Bed Bugs',   season:'Year-round', threat:'High',   icon:'🛏️', color:'#7c3aed',
    desc:'Heat treatment + chemical. Single visit eliminates infestation.' },
  { name:'Spiders',    season:'Year-round', threat:'Medium', icon:'🕷️', color:'#1e293b',
    desc:'Brown recluse + black widow specialists. Web removal included.' },
];

const SERVICES = [
  { icon: HomeIcon,   title: 'Home Pest Control',    desc: 'Quarterly preventative treatments. One price covers ants, roaches, spiders, more.', color:'#65a30d' },
  { icon: AlertTriangle, title: 'Termite Inspection &amp; Treatment', desc: 'Free annual inspection. Bait stations + liquid barrier. 25-year warranty.', color:'#dc2626' },
  { icon: Bug,        title: 'Bed Bug Heat Treatment',desc: 'Single-visit thermal treatment. Eliminates eggs, no chemical residue. Pet-safe.', color:'#7c3aed' },
  { icon: Activity,   title: 'Mosquito Yard Service', desc: 'Monthly misting Apr–Oct. Patio &amp; yard mosquito-free in 24 hours.',                color:'#0ea5e9' },
  { icon: Zap,        title: 'Wasp &amp; Bee Removal', desc: 'Same-day removal. Beekeeper relocation for honeybees when possible.',                color:'#eab308' },
  { icon: ShieldCheck,title: 'Rodent Exclusion',     desc: 'Seal every entry point + bait stations. Permanent rodent solution, not just traps.', color:'#525252' },
];

const WHY = [
  { icon: Leaf,        title: 'Family &amp; Pet Safe',     desc: 'EPA-registered products applied responsibly. Kids and pets back inside in 30 min, no exception.' },
  { icon: BadgeCheck,  title: 'Same-Day Service',          desc: 'Most calls scheduled same day. Wasp emergencies dispatched in under 2 hours, 24/7.' },
  { icon: ShieldCheck, title: 'Free Re-Treats',            desc: 'If pests come back between scheduled visits, we re-treat free. No questions, no extra fee.' },
  { icon: Award,       title: 'Quarterly Plans · No Contracts', desc: 'Cancel anytime. Most clients stay because they want to — not because we made them sign a year deal.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Local',         suffix: '' },
  { value: BIZ.jobs,                    label: 'Homes Treated',       suffix: '' },
  { value: BIZ.responseHr,              label: 'Service Response',    suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',       suffix: '★' },
];

const REVIEWS = [
  { name: 'Brandon S.', city: 'Lawton', rating: 5,
    text: '"Had a terrible roach problem in our rental — 3 other companies sprayed and they came back within 2 weeks. Trail&apos;s End used gel bait + IGR and we&apos;ve been roach-free for 14 months. Game changer."' },
  { name: 'Helen J.', city: 'Cache', rating: 5,
    text: '"Found termites during a home sale inspection. Trail&apos;s End was at the house in 4 hours, treated the foundation, and provided the WDI report we needed for closing. Saved our deal. Lifetime customer."' },
  { name: 'Marcus T.', city: 'Elgin', rating: 5,
    text: '"Mosquitoes made our backyard unusable every June. After their first yard treatment we sat outside that night without a single bite. Whole family changed how we use our house. Worth every penny."' },
];

const FAQS = [
  { q: 'Are the chemicals safe for kids and pets?',                 a: 'Yes. We use EPA-registered products applied at responsible concentrations. Indoor treatments dry in 30 minutes — kids and pets are safe to come back inside immediately after. Outdoor treatments are dry in 1-2 hours.' },
  { q: 'How much does quarterly home pest control cost?',           a: 'Most homes run $89-$129 per quarterly visit (4 visits per year, around $400/year). Includes ants, roaches, spiders, silverfish, earwigs, and most common household pests. No long-term contracts.' },
  { q: 'Do you offer one-time treatments or only contracts?',       a: 'Both. We do one-time treatments for active issues ($150-$295 depending on pest and severity) AND quarterly preventative plans. No contracts on either — cancel anytime.' },
  { q: 'How do you handle bed bugs?',                               a: 'We do single-visit thermal heat treatment — heat the entire house to 135°F for 6+ hours. Kills bed bugs at every life stage including eggs, no chemical residue. Most chemical-only treatments take 3-5 visits.' },
  { q: 'What about termites? Is the 25-year warranty real?',        a: 'Yes — our termite warranty covers re-treatment AND damage repair for 25 years on liquid barrier installs (transferable when you sell). We do free annual inspections to keep the warranty active.' },
  { q: 'Do you remove bees, or do you have to kill them?',          a: 'For honeybees, we coordinate with local beekeepers to relocate them whenever possible (usually free to you). For wasps, hornets, and yellow jackets, we treat and remove the nest same-day.' },
  { q: 'Are you licensed and insured?',                             a: `Yes — ${BIZ.license}, fully bonded, $2M general liability, EPA-certified applicators on every truck. We&apos;ll show you our credentials and chemical labels on request.` },
];

export default function PestControlTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [activePest, setActivePest] = useState(0);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen text-stone-900" style={{ background: BIZ.paper, fontFamily: 'Inter, system-ui, sans-serif' }}>

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
      <div className="text-white text-xs" style={{ background: BIZ.earthDeep }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <a href={`tel:${BIZ.emergency}`} className="font-bold flex items-center gap-1.5" style={{ color: BIZ.safety }}>
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse"/>
            <span>Bee/Wasp 24/7:</span>
            <span className="underline">{BIZ.emergency}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.olive}, ${BIZ.oliveDeep})`, boxShadow: `0 0 14px ${BIZ.olive}33` }}>
              <Bug className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-stone-900 text-base sm:text-lg">{BIZ.nameSafe}</p>
              <p className="text-[10px] text-stone-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            <a href="#services" className="hover:text-lime-700 transition-colors">Services</a>
            <a href="#pests" className="hover:text-lime-700 transition-colors">What We Treat</a>
            <a href="#why" className="hover:text-lime-700 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-lime-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-lime-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-lime-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.oliveDeep }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 4px 14px ${BIZ.safety}66` }}>
              <Calendar className="w-4 h-4"/> Free Inspection
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.earthDeep} 0%, #1c1917 50%, ${BIZ.oliveDeep} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.olive}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.safety}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.olive}25`, border: `1px solid ${BIZ.olive}60`, color: '#bef264' }}>
              <Leaf className="w-3 h-3"/>
              Family-Safe · EPA Certified · Since {BIZ.established}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight">
              Pests Out.<br/>
              <span style={{ background: `linear-gradient(135deg, #bef264, ${BIZ.safety})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Family Safe.
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-stone-300">Same-Day Service.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-stone-300 max-w-xl mb-8 leading-relaxed">
              EPA-certified treatments that work the first time. Kids and pets safely back inside in 30 minutes. {BIZ.yearsServing} years of permanent pest solutions in southwest Oklahoma.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 8px 30px ${BIZ.safety}66` }}>
                <Calendar className="w-5 h-5"/> Free Inspection
              </a>
              <a href={`tel:${BIZ.phoneRaw}`}
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5"/> Call {BIZ.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-stone-300">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-lime-400"/> EPA Certified</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-lime-400"/> {BIZ.insurance.split('·')[0].trim()}</span>
            </motion.div>
          </div>

          {/* Right: pest radar visual */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Treated" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: `0 20px 60px ${BIZ.oliveDeep}40` }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-stone-600">TREATED</span>
                </div>
                <p className="text-xs text-stone-700 font-bold">Quarterly · Plan A</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Next visit · 12 weeks</p>
              </motion.div>

              {/* Floating "Pet safe" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: `0 20px 60px ${BIZ.safety}40` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Leaf className="w-5 h-5 text-lime-600"/>
                  <span className="text-xs font-bold text-stone-800">Pet-Safe in 30 min</span>
                </div>
                <p className="text-[10px] text-stone-500">EPA-registered · Indoor &amp; outdoor</p>
              </motion.div>

              {/* Main radar card */}
              <div className="rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                style={{ background: BIZ.earthDeep, boxShadow: `0 30px 80px rgba(0,0,0,0.5), 0 0 40px ${BIZ.olive}30`, border: `2px solid ${BIZ.olive}` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-lime-300">Pest Activity Radar</span>
                  <span className="text-[10px] font-bold flex items-center gap-1 text-orange-300">
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.safety }}/>
                    SCANNING
                  </span>
                </div>

                {/* Radar circle */}
                <div className="relative aspect-square mb-4 rounded-full"
                  style={{ background: `radial-gradient(circle, ${BIZ.oliveDeep}, ${BIZ.earthDeep})`, border: `1px solid ${BIZ.olive}50` }}>
                  {/* Concentric rings */}
                  {[0.3, 0.55, 0.8].map((scale, i) => (
                    <div key={i} className="absolute inset-0 rounded-full border"
                      style={{ borderColor: `${BIZ.olive}30`, transform: `scale(${scale})` }}/>
                  ))}

                  {/* Pulsing center */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full">
                    <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                      style={{ background: `linear-gradient(90deg, ${BIZ.safety}, transparent)`, transformOrigin: '0 50%' }}/>
                  </motion.div>

                  {/* Pest pings */}
                  {[
                    { top:'25%', left:'30%', icon:'🐜' },
                    { top:'60%', left:'70%', icon:'🪳' },
                    { top:'70%', left:'25%', icon:'🕷️' },
                    { top:'30%', left:'72%', icon:'🦟' },
                  ].map((p, i) => (
                    <motion.div key={i}
                      animate={{ scale:[1,1.2,1], opacity:[0.7,1,0.7] }}
                      transition={{ duration:2, repeat:Infinity, ease:'easeInOut', delay:i*0.4 }}
                      className="absolute text-2xl"
                      style={{ top:p.top, left:p.left, transform:'translate(-50%, -50%)' }}>
                      {p.icon}
                    </motion.div>
                  ))}

                  {/* Center dot */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                    style={{ background: BIZ.safety, boxShadow: `0 0 16px ${BIZ.safety}` }}/>
                </div>

                <div className="text-center text-white">
                  <p className="text-[10px] uppercase tracking-widest text-lime-300/70 mb-1">Detected this week</p>
                  <p className="text-3xl font-black tabular-nums" style={{ color: BIZ.safety }}>4 species</p>
                  <p className="text-xs text-stone-400 mt-1">All treated · Zero callbacks</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-12 bg-white border-y border-stone-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.08 }}
              className="text-center">
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.oliveDeep }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.oliveDeep }}>What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.earthDeep }}>
              Permanent Pest Solutions.<br/>One Local Team.
            </h2>
            <p className="text-stone-600 text-lg">From ants in the kitchen to termites in the walls — we treat them all, kid- and pet-safe.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  whileHover={{ y:-6 }}
                  className="group bg-white rounded-2xl p-7 cursor-pointer transition-all"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BIZ.earthDeep }}>{s.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.oliveDeep }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PEST RADAR — unique to pest control */}
      <section id="pests" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.safety }}>What We Treat</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.earthDeep }}>
              Common Pests in<br/>Southwest Oklahoma
            </h2>
            <p className="text-stone-600 text-lg">Hover over each pest to see the threat level, season, and how we treat it.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {PESTS.map((p, i) => (
              <motion.div key={p.name}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.05 }}
                whileHover={{ y:-6 }}
                onMouseEnter={() => setActivePest(i)}
                onClick={() => setActivePest(i)}
                className="rounded-2xl p-5 cursor-pointer text-center transition-all"
                style={{
                  background: i === activePest ? `${p.color}15` : 'white',
                  border: `2px solid ${i === activePest ? p.color : '#e7e5e4'}`,
                  boxShadow: i === activePest ? `0 8px 30px ${p.color}30` : '0 1px 3px rgba(0,0,0,0.04)',
                }}>
                <div className="text-5xl mb-2">{p.icon}</div>
                <p className="font-black text-sm uppercase tracking-tight" style={{ color: BIZ.earthDeep }}>{p.name}</p>
                <p className="text-[10px] mt-1" style={{ color: p.color }}>{p.season}</p>
              </motion.div>
            ))}
          </div>

          {/* Active pest detail */}
          <motion.div key={activePest}
            initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
            className="max-w-2xl mx-auto rounded-2xl p-6"
            style={{ background: `${PESTS[activePest].color}10`, border: `1px solid ${PESTS[activePest].color}40` }}>
            <div className="flex items-start gap-4">
              <div className="text-5xl">{PESTS[activePest].icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <h3 className="text-2xl font-black" style={{ color: BIZ.earthDeep }}>{PESTS[activePest].name}</h3>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: `${PESTS[activePest].color}25`, color: PESTS[activePest].color }}>
                      {PESTS[activePest].threat} Threat
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                      {PESTS[activePest].season}
                    </span>
                  </div>
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">{PESTS[activePest].desc}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.oliveDeep }}>Why {BIZ.nameSafe}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.earthDeep }}>
              {BIZ.yearsServing} Years.<br/>Zero Callbacks.<br/>One Local Team.
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6">
              We started Trail&apos;s End in {BIZ.established} after years of watching the big chains spray once and disappear — leaving customers with re-infestations within weeks. We do it differently.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              Every tech is a W-2 employee, EPA-certified, and trained on the latest integrated pest management. Quarterly plans without contracts. Re-treatments are always free between visits. Family-safe products applied responsibly. That&apos;s why we have {BIZ.reviewCount} 5-star reviews.
            </p>
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 8px 30px ${BIZ.safety}50` }}>
              Schedule My Free Inspection <ArrowRight className="w-5 h-5"/>
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
                    style={{ background: BIZ.oliveDeep, color: 'white' }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.earthDeep }}>{w.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* URGENCY BANNER */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight">Wasps? Hornets? Bees in the Eaves?</p>
              <p className="text-white/90 text-sm mt-1">2-hour emergency response, 24/7. Same-day removal — we don&apos;t leave you stranded.</p>
            </div>
          </div>
          <a href={`tel:${BIZ.emergency}`}
            className="bg-white font-black px-7 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg"
            style={{ color: BIZ.safetyDeep }}>
            <Phone className="w-5 h-5"/> {BIZ.emergency}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.oliveDeep }}>Real Customers</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.earthDeep }}>
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
                style={{ background: BIZ.cream, border: `1px solid ${BIZ.oliveDeep}15` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-stone-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.oliveDeep}15` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.olive}, ${BIZ.earthDeep})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.earthDeep }}>{r.name}</p>
                    <p className="text-xs text-stone-500">{r.city}, OK · Verified Google</p>
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
            style={{ background: `linear-gradient(135deg, ${BIZ.earthDeep} 0%, ${BIZ.oliveDeep} 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: '#bef264' }}>Free Inspection</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
                Tell Us What&apos;s<br/>Bugging You.
              </h2>
              <p className="text-stone-200 text-lg mb-6">
                We&apos;ll send a tech for a free, no-obligation inspection. Most quoted same-day, treated within 24 hours.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Same-day inspections most days' },
                  { icon: MessageCircle,text: 'Reply by text or call — your pick' },
                  { icon: Leaf,         text: 'Family- and pet-safe products' },
                  { icon: ShieldCheck,  text: 'Free re-treats between visits' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-stone-200">
                    <item.icon className="w-4 h-4" style={{ color: '#bef264' }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">What are you seeing?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-100 transition-all">
                  <option>Ants (kitchen, bathroom, or yard)</option>
                  <option>Roaches (urgent)</option>
                  <option>Mice or rats</option>
                  <option>Termites or wood damage</option>
                  <option>Wasps, hornets, or bees (urgent)</option>
                  <option>Mosquitoes (yard treatment)</option>
                  <option>Bed bugs</option>
                  <option>Spiders</option>
                  <option>Quarterly preventative plan</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Urgency</label>
                <select className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-100 transition-all">
                  <option>Active infestation — need help fast</option>
                  <option>Saw a few — preventative</option>
                  <option>Annual termite inspection</option>
                  <option>Setting up quarterly service</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-lime-600 focus:ring-2 focus:ring-lime-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 8px 30px ${BIZ.safety}66` }}>
                <Bug className="w-5 h-5"/> Schedule Free Inspection
              </button>
              <p className="text-center text-xs text-stone-500">No spam · We text once and stop if you ask</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.oliveDeep }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.earthDeep }}>
            Pest-Free Across Southwest Oklahoma
          </h2>
          <p className="text-stone-600 mb-10">We&apos;re local — here&apos;s where our trucks roll daily.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.cream, color: BIZ.earthDeep, borderColor: `${BIZ.oliveDeep}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.oliveDeep }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.oliveDeep }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.earthDeep }}>
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
                    borderColor: isOpen ? '#bef264' : '#e7e5e4',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.earthDeep }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.oliveDeep }}/>
                  </button>
                  {isOpen && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}
                      className="px-6 pb-5 text-stone-700 leading-relaxed">
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.earthDeep} 0%, ${BIZ.oliveDeep} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.safety}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            Pest-Free Home.<br/>
            <span style={{ background: `linear-gradient(135deg, #bef264, ${BIZ.safety})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Family Safe.
            </span>
          </h2>
          <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Free inspection. Same-day service. EPA-certified. {BIZ.yearsServing} years of permanent pest solutions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg text-white"
              style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 8px 30px ${BIZ.safety}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-stone-400 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5"/> Family-Safe</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> EPA Certified</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-stone-300" style={{ background: BIZ.earthDeep }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.olive}, ${BIZ.oliveDeep})` }}>
                <Bug className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg">{BIZ.nameSafe}</p>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4">{BIZ.tagline}. {BIZ.yearsServing} years of permanent pest solutions in southwest Oklahoma.</p>
            <p className="text-xs text-stone-500">{BIZ.license}<br/>{BIZ.insurance}</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.safety }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.safety }}/><a href={`tel:${BIZ.emergency}`} className="hover:text-white transition-colors">{BIZ.emergency} (Bee 24/7)</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.safety }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.safety }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.safety }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Service Areas</p>
            <p className="text-sm text-stone-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-stone-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BIZ.nameSafe}. All rights reserved.</p>
          <p>Family-owned · EPA Certified · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.safety}, ${BIZ.safetyDeep})`, boxShadow: `0 8px 30px ${BIZ.safety}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
