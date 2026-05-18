/* polished v2 · why-bento v3 */
'use client';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, type MotionValue } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Smile, Heart, Users, CreditCard, Activity, Award, Stethoscope,
  Camera, Trophy,
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
  name:        'Cedar Creek Dental',
  tagline:     'Family Dentistry · Cosmetic · Implants',
  doctor:      'Dr. Rachel Halberg, DDS',
  phone:       '(580) 555-0567',
  phoneRaw:    '5805550567',
  email:       'hello@cedarcreekdental.com',
  address:     '320 Oak Ave Suite 200, Lawton, OK 73505',
  hours:       'Mon–Fri · 8am–5pm · Sat by appointment',
  established: 2014,
  yearsServing: new Date().getFullYear() - 2014,
  patients:    '4,800+',
  responseHr:  'Same week',
  rating:      4.9,
  reviewCount: 521,
  license:     'OK Dental Board #DDS-22841',
  insurance:   'In-network with 200+ plans',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Medicine Park','Sterling'],
  /* Premium clinical palette — clinical white + soft mint + warm gold */
  mint:    '#14b8a6',
  mintDeep:'#0f766e',
  gold:    '#d4a574',
  goldDeep:'#a16207',
  ink:     '#0f172a',
  cream:   '#fefdfb',
  rose:    '#fb7185',
};

const SERVICES = [
  { icon: Smile,       title: 'Family Dentistry',      desc: 'Cleanings, fillings, kids&apos; checkups — comfortable visits for the whole family.',  color: '#14b8a6' },
  { icon: Sparkles,    title: 'Cosmetic & Whitening',  desc: 'Professional whitening, veneers, bonding — designed around your natural smile.',     color: '#d4a574' },
  { icon: Activity,    title: 'Dental Implants',       desc: 'Single tooth or full-mouth restoration. Same-day implant consultations available.',  color: '#7c3aed' },
  { icon: Heart,       title: 'Invisalign &amp; Orthodontics', desc: 'Clear aligners for teens &amp; adults. 12-18 months avg. Free consult.',     color: '#fb7185' },
  { icon: Stethoscope, title: 'Emergency Dentistry',   desc: 'Toothache, broken crown, knocked-out tooth — same-day emergency appointments.',     color: '#dc2626' },
  { icon: ShieldCheck, title: 'Sedation Dentistry',    desc: 'Nervous? We offer nitrous and oral sedation so the whole visit is relaxing.',       color: '#0ea5e9' },
];

/* ─── Why-choose-us differentiators — BENTO with visuals ─── */
const WHY = [
  {
    icon: Heart, title: 'Comfort First', stat: '★',
    desc: 'Heated blankets, noise-canceling headphones, sedation options. Most patients say they actually look forward to visits.',
    color: '#fb7185', colorDeep: '#be123c', span: 'lg:col-span-2', visual: 'stars',
  },
  {
    icon: Calendar, title: 'On-Time Guarantee', stat: '< 10m',
    desc: 'Your appointment starts within 10 minutes of your scheduled time — or your next cleaning is free.',
    color: '#14b8a6', colorDeep: '#0f766e', span: 'lg:row-span-2', visual: 'clock',
  },
  {
    icon: CreditCard, title: 'Easy Insurance', stat: '$0',
    desc: 'We file every claim for you and explain your benefits before treatment. No bill surprises.',
    color: '#d4a574', colorDeep: '#a16207', span: '', visual: 'price',
  },
  {
    icon: Award, title: 'Trusted by Families', stat: `${BIZ.patients}`,
    desc: `${BIZ.patients} patients across ${BIZ.yearsServing} years — 4.9 stars on Google, generations seen by Dr. Halberg.`,
    color: '#7c3aed', colorDeep: '#5b21b6', span: '', visual: 'map',
  },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Practice',   suffix: '',  icon: Award },
  { value: BIZ.patients,                label: 'Patients Served',     suffix: '',  icon: Users },
  { value: BIZ.responseHr,              label: 'Appointment Wait',    suffix: '',  icon: Calendar },
  { value: BIZ.rating.toString(),       label: 'Google Rating',       suffix: '★', icon: Star },
];

const GALLERY = [
  { caption: 'Modern operatory',         emoji: '🦷', accent: '#14b8a6', pattern: 'dots'    },
  { caption: 'Whitening · before & after',emoji: '✨', accent: '#d4a574', pattern: 'grid'    },
  { caption: 'Kids appointment area',    emoji: '🧸', accent: '#fb7185', pattern: 'dots'    },
  { caption: '3D imaging suite',         emoji: '📸', accent: '#0ea5e9', pattern: 'stripes' },
  { caption: 'Implant consultation',     emoji: '🪥', accent: '#7c3aed', pattern: 'grid'    },
  { caption: 'Calm waiting lounge',      emoji: '🪴', accent: '#10b981', pattern: 'dots'    },
];

const MARQUEE = [
  { icon:'🦷', text:'In-Network · 200+ Insurance Plans' },
  { icon:'⏱️', text:'On-Time Guarantee · Free Cleaning if Late' },
  { icon:'😌', text:'Sedation Dentistry · Nitrous + Oral Available' },
  { icon:'💰', text:'CareCredit · 0% Financing 24 Months' },
  { icon:'⭐', text:'4.9★ from 521 Local Families' },
  { icon:'🚨', text:'Same-Day Dental Emergencies' },
  { icon:'👨‍👩‍👧‍👦', text:'Family-Friendly · Ages 1 to 101' },
];

const FEATURED = ['ADA Member','OK Dental Association','Invisalign Diamond+ Provider','Best of Lawton 2024','Google 4.9★'];

/* Industry-specific: INSURANCE & FINANCING block */
const INSURANCE_PROVIDERS = [
  'Delta Dental','Cigna','Aetna','MetLife','Guardian','BlueCross BlueShield','Humana','United Healthcare','Ameritas','Principal',
];

const FINANCING = [
  { label:'CareCredit',     desc:'0% APR for 6/12/18/24 months on approved credit' },
  { label:'In-house plans', desc:'$29/mo membership — 2 cleanings + 20% off all treatment' },
  { label:'HSA / FSA',      desc:'We accept all major health spending accounts' },
];

const REVIEWS = [
  { name: 'Amanda C.', city: 'Lawton', rating: 5,
    text: '"I hated going to the dentist my whole life — Dr. Halberg actually listened to my anxiety, offered sedation, and made the whole visit feel like a spa. My kids actually ASK to come now."' },
  { name: 'Robert J.', city: 'Cache', rating: 5,
    text: '"Got two implants here after putting it off for years. Cedar Creek explained every step, filed my insurance, and the final result is indistinguishable from my real teeth. Honest pricing too."' },
  { name: 'Stephanie P.', city: 'Elgin', rating: 5,
    text: '"Cracked a crown on a Sunday. They called me back within an hour, saw me Monday morning, had me out the door in 90 min with a new crown and zero pain. Lifetime patient now."' },
];

const FAQS = [
  { q: 'Do you take my insurance?',                                  a: `We&apos;re in-network with over 200 dental plans including Delta Dental, Cigna, Aetna, MetLife, Guardian, BlueCross BlueShield, Humana, and United Healthcare. Not sure? Call us with your card and we&apos;ll verify benefits in under 5 minutes.` },
  { q: 'I&apos;m really anxious about the dentist. What can you do?', a: 'Most of our new patients say the same thing. We offer nitrous oxide (laughing gas), oral sedation (a pill an hour before), and heated blankets + noise-canceling headphones. Many patients sleep through the whole visit.' },
  { q: 'How much does a dental implant cost?',                       a: 'A single implant runs $3,800–$5,200 depending on the case (including the crown). We offer 0% financing through CareCredit, and most insurance plans cover a portion. Free implant consult — no obligation.' },
  { q: 'Do you see kids?',                                           a: 'Yes — we see kids as young as age 1 (American Dental Association recommendation). Our team is trained in child-friendly visits, and Dr. Halberg has two kids of her own, so she gets it.' },
  { q: 'How fast can I get an appointment?',                         a: 'New patients can usually get in within the same week. Emergencies (active pain, broken tooth) are seen same-day. Just call — we keep emergency slots open every day.' },
  { q: 'Do you do Invisalign or only braces?',                       a: 'We do Invisalign for teens and adults (12 months average treatment, no metal). For complex cases, we refer to a trusted local orthodontist. Free consult either way.' },
  { q: 'What if I don&apos;t have insurance?',                       a: 'We have an in-house membership plan: $29/month gets you 2 cleanings, 2 exams, all X-rays, and 20% off any additional treatment. Most uninsured patients save more than they spend.' },
];

export default function DentistsTemplate() {
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
    <div className="min-h-screen text-slate-900" style={{ background: BIZ.cream, fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Template preview banner */}
      <div className="sticky top-0 z-[100] w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
          <span className="flex items-center gap-2">
            <Link href="/templates" className="opacity-80 hover:opacity-100 underline-offset-2 hover:underline">← All templates</Link>
            <span className="opacity-40">·</span>
            <Sparkles className="w-4 h-4 flex-shrink-0"/>
            <span className="font-semibold">Template Preview</span>
            <span className="hidden md:inline opacity-90">— We customize colors, logo &amp; content to match your brand · $1,497 once</span>
          </span>
          <Link href="/lifetime"
            className="bg-white text-blue-700 font-bold px-3 py-1 rounded-full text-xs hover:scale-105 transition-transform flex items-center gap-1">
            Make This Mine <ArrowRight className="w-3 h-3"/>
          </Link>
        </div>
      </div>

      {/* Top utility bar */}
      <div className="text-white text-xs" style={{ background: BIZ.ink }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`} className="font-bold flex items-center gap-1.5" style={{ color: BIZ.mint }}>
            <Phone className="w-3.5 h-3.5"/>
            <span>New Patients:</span>
            <span className="underline">{BIZ.phone}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] sm:top-[32px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 0 14px ${BIZ.mint}44` }}>
              <Smile className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg">{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-teal-600 transition-colors">Services</a>
            <a href="#insurance" className="hover:text-teal-600 transition-colors">Insurance</a>
            <a href="#why" className="hover:text-teal-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-teal-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-teal-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-teal-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.mint }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-4 py-2.5 rounded-full text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 4px 14px ${BIZ.mint}66` }}>
              <Calendar className="w-4 h-4"/> Book Online
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.cream} 0%, #ecfdf5 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.mint}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.gold}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.mint}15`, border: `1px solid ${BIZ.mint}40`, color: BIZ.mintDeep }}>
              <Heart className="w-3 h-3"/>
              Accepting New Patients
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight" style={{ color: BIZ.ink }}>
              A Smile You&apos;ll<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Love to Wear.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed">
              Family dentistry, cosmetic care, and implants in a calm, modern office. {BIZ.yearsServing} years of gentle, honest dentistry led by {BIZ.doctor}.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 8px 30px ${BIZ.mint}66` }}>
                <Calendar className="w-5 h-5"/> Book My First Visit
              </a>
              <a href={`tel:${BIZ.phoneRaw}`}
                className="font-bold px-7 py-4 rounded-full border-2 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ borderColor: BIZ.mint, color: BIZ.mintDeep }}>
                <Phone className="w-5 h-5"/> Call {BIZ.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-slate-900">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-teal-600"/> In-network: 200+ plans</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-teal-600"/> Sedation available</span>
            </motion.div>
          </div>

          {/* Right: appointment booking mockup card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Smile of the week" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(20,184,166,0.2)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Smile className="w-5 h-5 text-teal-600"/>
                  <span className="text-xs font-bold text-slate-600">SMILE OF THE WEEK</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">Amanda&apos;s 6-month Invisalign result · 100% online appts</p>
              </motion.div>

              {/* Floating "Insurance verified" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(212,165,116,0.25)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-800">Insurance Verified</span>
                </div>
                <p className="text-[10px] text-slate-500">Delta Dental · $0 due at visit</p>
              </motion.div>

              {/* Main booking card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl"
                style={{ boxShadow: '0 30px 80px rgba(15,118,110,0.2)', border: `1px solid ${BIZ.mint}25` }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Schedule Visit</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: BIZ.mint }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.mint }}/>
                    OPEN
                  </span>
                </div>

                <p className="text-xl font-black mb-1" style={{ color: BIZ.ink }}>Pick Your Time</p>
                <p className="text-xs text-slate-500 mb-5">Next available this week</p>

                {/* Available slots */}
                <div className="space-y-2 mb-5">
                  {[
                    { day:'Tue · Jun 3',  time:'9:00 AM',  dr:'Dr. Halberg',  best:true },
                    { day:'Wed · Jun 4',  time:'2:30 PM',  dr:'Dr. Halberg',  best:false },
                    { day:'Thu · Jun 5',  time:'8:30 AM',  dr:'Dr. Patel',    best:false },
                  ].map((s, i) => (
                    <motion.div key={i}
                      whileHover={{ x:4 }}
                      className="rounded-xl p-3 cursor-pointer flex items-center justify-between"
                      style={{
                        background: s.best ? `${BIZ.mint}10` : '#f8fafc',
                        border: `1px solid ${s.best ? BIZ.mint + '40' : '#e2e8f0'}`,
                      }}>
                      <div>
                        <p className="text-xs font-bold" style={{ color: BIZ.ink }}>{s.day}</p>
                        <p className="text-[10px] text-slate-500">{s.dr}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black tabular-nums" style={{ color: s.best ? BIZ.mintDeep : BIZ.ink }}>{s.time}</p>
                        {s.best && <p className="text-[9px] font-bold uppercase" style={{ color: BIZ.gold }}>Recommended</p>}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <button className="w-full py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2"
                  style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})` }}>
                  Confirm Appointment <ArrowRight className="w-4 h-4"/>
                </button>

                <p className="text-[10px] text-center text-slate-400 mt-3">Insurance verified · Text reminders · Easy reschedule</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AS FEATURED IN STRIP */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Member · Accredited · Awarded</span>
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
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${BIZ.mint}15`, color: BIZ.mintDeep }}>
                  <Icon className="w-6 h-6"/>
                </div>
                <p className="text-4xl sm:text-5xl font-black mb-1 tracking-tight" style={{ color: BIZ.mintDeep, fontFamily: '"Playfair Display", serif' }}>
                  {m.value}{m.suffix}
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SCROLLING MARQUEE */}
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.ink, borderColor: `${BIZ.mint}40` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: '#5eead4' }}>{m.text}</span>
              <span className="text-slate-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.mintDeep }}>Full-Service Dentistry</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink }}>
              Everything Your Smile Needs.<br/>One Trusted Office.
            </h2>
            <p className="text-slate-600 text-lg">From kids&apos; first cleaning to full-mouth implants — we do it all, gently, and we explain every step.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  whileHover={{ y:-8, boxShadow: `0 24px 60px ${s.color}30, 0 8px 24px rgba(0,0,0,0.06), 0 0 0 1px ${s.color}30` }}
                  className="group bg-white rounded-3xl p-7 cursor-pointer transition-all"
                  style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.04), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color, boxShadow: `0 4px 14px ${s.color}25` }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.mintDeep }}>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Inside Our Office</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Modern. Calm.<br/>Quietly Excellent.
            </h2>
            <p className="text-slate-600 text-lg italic">A peek into our office, our tech, and the smiles we create.</p>
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
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden cursor-pointer"
                  style={{
                    background: `linear-gradient(135deg, ${g.accent}, ${BIZ.ink})`,
                    boxShadow: `0 12px 40px ${g.accent}30, 0 4px 12px rgba(0,0,0,0.1)`,
                  }}>
                  <div className="absolute inset-0 opacity-25" style={{ backgroundImage: patternBg, backgroundSize: patternSize }}/>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${BIZ.ink}aa, transparent 70%)` }}/>
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
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.gold }}/>
            4,800+ patients seen · <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.mintDeep }}>Book your first visit →</a>
          </p>
        </div>
      </section>

      {/* INSURANCE & FINANCING — unique to dentists */}
      <section id="insurance" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Insurance &amp; Financing</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink }}>
              Care That Fits Your Budget.
            </h2>
            <p className="text-slate-600 text-lg">We file every insurance claim for you, offer 0% financing on big treatment plans, and run our own $29/mo membership for the uninsured.</p>
          </div>

          {/* Insurance providers strip */}
          <div className="mb-12">
            <p className="text-center text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">In-network with 200+ plans, including:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {INSURANCE_PROVIDERS.map(p => (
                <span key={p} className="px-4 py-2 rounded-full text-sm font-bold border"
                  style={{ background: BIZ.cream, color: BIZ.ink, borderColor: `${BIZ.mint}30` }}>
                  {p}
                </span>
              ))}
              <span className="px-4 py-2 rounded-full text-sm font-bold border"
                style={{ background: BIZ.cream, color: BIZ.mintDeep, borderColor: `${BIZ.mint}30` }}>
                + 190 more
              </span>
            </div>
          </div>

          {/* Financing options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FINANCING.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08 }}
                className="rounded-2xl p-6 text-center"
                style={{ background: `linear-gradient(135deg, ${BIZ.gold}10, white)`, border: `1px solid ${BIZ.gold}30` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${BIZ.gold}20`, color: BIZ.goldDeep }}>
                  <CreditCard className="w-6 h-6"/>
                </div>
                <h3 className="font-black text-lg mb-2" style={{ color: BIZ.ink }}>{f.label}</h3>
                <p className="text-slate-600 text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ WHY CHOOSE US — BENTO with animated visuals ═══════ */}
      <section id="why" className="py-20 sm:py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, #f0fdfa 0%, #fef3c7 30%, #fce7f3 60%, #f5f3ff 100%)` }}>
        <motion.div
          animate={{ x: ['0%','50%','0%'], y: ['0%','-30%','0%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.mint}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['0%','-40%','0%'], y: ['0%','30%','0%'] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        <motion.div
          animate={{ x: ['-20%','20%','-20%'], y: ['10%','-10%','10%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/3 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.rose}40, transparent 60%)`, filter: 'blur(90px)' }}/>

        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.mintDeep }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Dentistry the Way It<br/>Should Have Always Been.
            </h2>
            <p className="text-slate-600 text-lg italic">{BIZ.doctor}. Modern tech, comforting visits, honest pricing — backed by {BIZ.patients} patients and {BIZ.yearsServing} years.</p>
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
                            style={{ background: BIZ.ink }}/>
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
                          { city:'Kids',   top:'15%', left:'15%' },
                          { city:'Adults', top:'70%', left:'10%' },
                          { city:'Teens',  top:'20%', left:'70%' },
                          { city:'Seniors',top:'68%', left:'68%' },
                        ].map((c, ci) => (
                          <motion.span key={c.city}
                            animate={{ y:[0,-4,0] }}
                            transition={{ duration: 3+ci*0.3, repeat: Infinity, ease: 'easeInOut', delay: ci*0.5 }}
                            className="absolute text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white shadow-md"
                            style={{ top: c.top, left: c.left, color: w.color, border: `1px solid ${w.color}30` }}>
                            <Smile className="w-2.5 h-2.5 inline mr-0.5"/>{c.city}
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
                            <Heart className="w-7 h-7 fill-current" style={{ color: w.color, filter: `drop-shadow(0 2px 6px ${w.color}66)` }}/>
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
                          In-Network
                          <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rotate-45" style={{ background: w.color }}/>
                        </motion.div>
                        <div className="flex gap-1 mt-2 justify-end">
                          {['Filed','Verified','Paid'].map((l, li) => (
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
                        className="w-14 h-14 rounded-full flex items-center justify-center mb-4 text-white"
                        style={{ background: `linear-gradient(135deg, ${w.color}, ${w.colorDeep})`, boxShadow: `0 8px 24px ${w.color}55` }}>
                        <Icon className="w-7 h-7"/>
                      </motion.div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <h3 className="text-2xl font-black tracking-tight" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
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
              className="inline-flex items-center gap-2 text-white font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform text-lg"
              style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 12px 30px ${BIZ.mint}55` }}>
              Book My First Visit <ArrowRight className="w-5 h-5"/>
            </a>
            <p className="text-slate-500 text-sm mt-3">
              {BIZ.patients} patients · {BIZ.reviewCount} reviews · {BIZ.rating}★ on Google
            </p>
          </div>
        </div>
      </section>

      {/* EMERGENCY BANNER */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.rose}, #be123c)` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight">Dental Emergency?</p>
              <p className="text-white/90 text-sm mt-1">Same-day appointments for active pain, broken crowns, knocked-out teeth.</p>
            </div>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`}
            className="bg-white font-black px-7 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg"
            style={{ color: '#be123c' }}>
            <Phone className="w-5 h-5"/> {BIZ.phone}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.mintDeep }}>Real Patients</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Patients
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
                className="rounded-3xl p-7"
                style={{ background: BIZ.cream, border: `1px solid ${BIZ.mint}20` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.mint}20` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.ink }}>{r.name}</p>
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
            style={{ background: `linear-gradient(135deg, ${BIZ.mintDeep} 0%, #134e4a 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Schedule</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]">
                Your First Visit<br/>Starts Here.
              </h2>
              <p className="text-teal-100 text-lg mb-6">
                Tell us a bit about you and we&apos;ll text you back within an hour with available times. New patients see the doctor on visit one — not a hygienist.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Same-week appointments most days' },
                  { icon: MessageCircle,text: 'Reply by text or call — your pick' },
                  { icon: ShieldCheck,  text: 'Insurance verified before your visit' },
                  { icon: Heart,        text: 'Calm, judgment-free care from day one' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-teal-100">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.gold }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">New or returning patient?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" className="px-4 py-3 rounded-xl border-2 font-bold text-sm transition-all"
                    style={{ borderColor: BIZ.mint, background: `${BIZ.mint}10`, color: BIZ.mintDeep }}>
                    New Patient
                  </button>
                  <button type="button" className="px-4 py-3 rounded-xl border-2 font-bold text-sm text-slate-600 border-slate-200 hover:border-slate-300">
                    Returning
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What brings you in?</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all">
                  <option>Routine cleaning &amp; checkup</option>
                  <option>Cosmetic / whitening consult</option>
                  <option>Dental implant consult</option>
                  <option>Invisalign / orthodontic consult</option>
                  <option>Active pain (dental emergency)</option>
                  <option>Crown, bridge, or filling</option>
                  <option>Second opinion</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Insurance (optional)</label>
                <input type="text" placeholder="e.g. Delta Dental or skip if uninsured"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition-all"/>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 8px 30px ${BIZ.mint}66` }}>
                <Calendar className="w-5 h-5"/> Request Appointment
              </button>
              <p className="text-center text-xs text-slate-500">HIPAA-secure form · We never share your info</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.mintDeep }}>Welcoming Patients From</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.ink }}>
            Southwest Oklahoma&apos;s Trusted Family Dentist
          </h2>
          <p className="text-slate-600 mb-10">Patients drive in from across the region — here&apos;s where they come from.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.cream, color: BIZ.ink, borderColor: `${BIZ.mint}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.mintDeep }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.mintDeep }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.ink }}>
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
                    background: isOpen ? '#f0fdfa' : 'white',
                    borderColor: isOpen ? `${BIZ.mint}50` : '#e5e5e5',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.ink }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.mintDeep }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.mintDeep} 0%, #134e4a 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]">
            Your Best Smile<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.gold}, #fde68a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Starts Here.
            </span>
          </h2>
          <p className="text-teal-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Whether it&apos;s your first cleaning in years, an emergency, or a full smile makeover — you&apos;re in calm, careful hands.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: 'white', color: BIZ.mintDeep, boxShadow: `0 8px 30px ${BIZ.gold}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-teal-100/80 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5"/> In-network 200+ plans</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Sedation available</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-slate-300" style={{ background: BIZ.ink }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})` }}>
                <Smile className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg">{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline} {BIZ.yearsServing} years of gentle, modern dentistry. {BIZ.doctor}.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.mint }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.mint }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.mint }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.mint }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Patients From</p>
            <p className="text-sm text-slate-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>{BIZ.doctor} · Trusted since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.mint}, ${BIZ.mintDeep})`, boxShadow: `0 8px 30px ${BIZ.mint}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
