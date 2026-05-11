/* polished v2 */
'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, animate as motionAnimate } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check, Camera,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Home as HomeIcon, AlertTriangle, FileText, CloudRain, Hammer,
  Wrench, Droplet, Trophy, Award, Users, Zap, Play, Eye, TrendingUp, X,
} from 'lucide-react';

/* Cloudfront clip already loaded elsewhere in the project — used as a video texture */
const DEMO_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260416_101255_3099d3e4-d0cf-4e59-9666-97fbf521ac71.mp4';

/* Animated number counter — counts from 0 to target on viewport enter */
function CountUp({ to, suffix = '', prefix = '' }: { to: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = motionAnimate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (n) => setVal(Math.floor(n)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

/* Recent insurance wins — live ticker data */
const RECENT_WINS = [
  { name:'Mike S.',    city:'Norman',       initial:'$7,400',  final:'$10,800', time:'2 hrs ago'   },
  { name:'Sarah K.',   city:'Edmond',       initial:'$5,200',  final:'$8,100',  time:'5 hrs ago'   },
  { name:'David M.',   city:'Tulsa',        initial:'$11,800', final:'$14,300', time:'8 hrs ago'   },
  { name:'Karen P.',   city:'Broken Arrow', initial:'$4,900',  final:'$7,600',  time:'1 day ago'   },
  { name:'Marcus T.',  city:'Lawton',       initial:'$9,200',  final:'$12,400', time:'1 day ago'   },
  { name:'Linda R.',   city:'Stillwater',   initial:'$6,500',  final:'$9,100',  time:'2 days ago'  },
  { name:'James W.',   city:'Moore',        initial:'$8,300',  final:'$11,200', time:'2 days ago'  },
  { name:'Trisha B.',  city:'Yukon',        initial:'$5,800',  final:'$8,700',  time:'3 days ago'  },
];

/* Video stories with mock metadata */
const VIDEOS = [
  { title:'90-Second Storm Inspection Walkthrough', duration:'1:32', label:'Inspection',   color:'#dc2626' },
  { title:'Full Tear-Off &amp; Install in One Day',  duration:'4:18', label:'Install',     color:'#0ea5e9' },
  { title:'How We Won a $3,400 Insurance Re-File',   duration:'2:47', label:'Claim Story', color:'#16a34a' },
];

/* ─── Single source of truth for the demo business ─── */
const BIZ = {
  name:        'Oklahoma Roofing Experts',
  tagline:     'Licensed · Insured · Storm-Ready',
  phone:       '(580) 919-1386',
  phoneRaw:    '5809191386',
  emergency:   '(580) 919-1386',
  email:       'help@oklahomaroofingexperts.com',
  address:     'Serving all of Oklahoma · HQ Lawton',
  hours:       'Mon–Sat · 7am–7pm',
  emergency24: '24/7 Storm Damage Response',
  established: 2014,
  yearsServing: new Date().getFullYear() - 2014,
  jobs:        '500+',
  responseHr:  '24–48 hrs',
  avgSettlement: '$3,200',
  rating:      4.9,
  reviewCount: 287,
  license:     'OK Licensed Roofing Contractor #80003234',
  insurance:   'Fully Insured · $2M Liability',
  areas: ['Lawton','Oklahoma City','Tulsa','Edmond','Norman','Broken Arrow','Stillwater','Moore','Yukon','Mustang','Cache','Elgin','Medicine Park'],
  /* Storm palette — deep navy + urgent red + shingle cream */
  storm:    '#1e3a5f',
  stormDeep:'#0f172a',
  alert:    '#dc2626',
  alertDeep:'#991b1b',
  cream:    '#f5f5f4',
  paper:    '#fafaf9',
  ink:      '#0c1117',
  copper:   '#c2410c',
};

const SERVICES = [
  { icon: HomeIcon,      title: 'Roof Replacement',     desc: 'Full tear-off + install. GAF and Owens Corning shingles. Most homes done in a single day.', color: '#dc2626' },
  { icon: Wrench,        title: 'Roof Repair',          desc: 'Missing shingles, leaks, soft spots, flashing. Free inspection, written quote before we start.', color: '#1e3a5f' },
  { icon: CloudRain,     title: 'Storm &amp; Hail Damage', desc: 'Free damage inspection within 48 hours of any storm. We document for your insurance.',     color: '#0ea5e9' },
  { icon: FileText,      title: 'Insurance Claims',     desc: 'We work directly with your adjuster, fight lowball offers, and document every detail.',    color: '#7c3aed' },
  { icon: Droplet,       title: 'Gutter Install &amp; Repair', desc: 'Seamless aluminum, copper, and oversized gutters. Leaf guards available.',            color: '#0284c7' },
  { icon: AlertTriangle, title: 'Emergency Tarping',    desc: 'Active leak? We&apos;ll tarp the damage same-day to prevent further water intrusion.',       color: '#c2410c' },
];

const WHY = [
  { icon: FileText,    title: 'Insurance Claim Experts',  desc: `We've recovered an average of ${BIZ.avgSettlement} more than initial adjuster estimates. We fight lowball offers — and we usually win.` },
  { icon: Clock,       title: '24–48 Hour Inspection',    desc: 'Free, no-obligation inspection scheduled within 48 hours of your call. We come to you, on your schedule.' },
  { icon: Zap,         title: 'Most Roofs · One Day',      desc: 'Tear-off and install completed in a single day on most homes. Less mess, less stress, less time exposed.' },
  { icon: ShieldCheck, title: '100% Satisfaction',         desc: 'If you&apos;re not happy with the work, we come back free until you are. That&apos;s our written guarantee.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Business',  suffix: '',  icon: Award },
  { value: BIZ.jobs,                    label: 'Homes Restored',     suffix: '',  icon: Users },
  { value: BIZ.responseHr,              label: 'Inspection Response',suffix: '',  icon: Clock },
  { value: BIZ.rating.toString(),       label: 'Google Rating',      suffix: '★', icon: Star  },
];

/* Insurance claim process — unique-to-roofers section */
const CLAIM_STEPS = [
  {
    step: '01',
    title: 'Free Damage Inspection',
    desc: 'We climb the roof, photograph every impact, and produce a full damage report — within 48 hours of your call.',
    icon: Camera,
    accent: '#0ea5e9',
  },
  {
    step: '02',
    title: 'File with Your Insurance',
    desc: 'We file the claim for you (or with you) and provide the supporting documentation. No paperwork stress.',
    icon: FileText,
    accent: '#7c3aed',
  },
  {
    step: '03',
    title: 'Meet the Adjuster',
    desc: 'We&apos;re on the roof when your insurance adjuster arrives. We point out every covered detail. They rarely miss anything with us there.',
    icon: Users,
    accent: '#dc2626',
  },
  {
    step: '04',
    title: 'Restore Your Home',
    desc: 'Once approved, your roof goes on — often in a single day. You pay your deductible. We handle the rest.',
    icon: HomeIcon,
    accent: '#16a34a',
  },
];

/* Storm damage checklist — second unique section */
const STORM_CHECKS = [
  'Hail dents in shingles, vents, gutters, and AC units',
  'Missing or curled shingles after high wind',
  'Granules in gutters or downspouts (sign of wear)',
  'Water stains on ceilings or attic decking',
  'Cracked or lifted flashing around chimneys / vents',
  'Damaged or detached gutter sections',
];

const REVIEWS = [
  {
    name: 'Daniel R.', city: 'Edmond', rating: 5,
    text: '"State Farm offered $7,400 for hail damage. Oklahoma Roofing Experts had the adjuster come back out, walked the roof with him, and we ended up with $10,800. They fought for me and won."',
  },
  {
    name: 'Linda H.', city: 'Norman', rating: 5,
    text: '"After the May storm, half the neighborhood was waiting on quotes. They were at my door the next morning, had a detailed report by lunch, and the new roof was on within 3 weeks. Professional from start to finish."',
  },
  {
    name: 'Marcus T.', city: 'Tulsa', rating: 5,
    text: '"Got 3 quotes. Oklahoma Roofing Experts walked the roof with me, pointed out two leaks the others missed, and ended up at the middle price. Their crew finished the whole tear-off and install in 9 hours. Zero callbacks."',
  },
];

const FAQS = [
  { q: 'Do you really do free inspections?',                          a: 'Yes — completely free, no obligation. We climb the roof, document every detail with photos and a written report, and email it to you within 24 hours. We&apos;d rather earn your trust than charge for a quote.' },
  { q: 'How does the insurance claim process work?',                  a: 'We do the inspection first. If you have storm/hail damage, we help you file the claim with your insurance and provide the documentation. We meet your adjuster on the roof to ensure they see everything. You pay only your deductible — we handle the rest with your insurance.' },
  { q: 'What if my adjuster denies my claim?',                        a: 'It happens — adjusters sometimes miss damage or low-ball estimates. We&apos;ve recovered an average of $3,200 more than initial estimates by fighting for reinspections and providing detailed supplemental documentation. We don&apos;t give up easily.' },
  { q: 'How long does a roof replacement actually take?',             a: 'Most residential roofs are completed in a single day — tear-off in the morning, new roof on by evening. Larger or more complex roofs may take 2-3 days. We clean up every nail and shingle scrap before we leave.' },
  { q: 'What roofing materials do you install?',                      a: 'We&apos;re certified installers for GAF, Owens Corning, CertainTeed, and Atlas shingles. We also do metal roofing, tile, and TPO commercial flat roofs. We&apos;ll recommend the best fit for your home, climate, and budget.' },
  { q: 'Are you licensed and insured?',                               a: `Yes — ${BIZ.license}, fully bonded, and we carry $2M in general liability plus workers comp on every crew. We&apos;ll show our credentials on the first visit. Always verify any roofer before you sign.` },
  { q: 'What if I have an active leak right now?',                    a: 'Call us immediately at ' + BIZ.emergency + '. We provide same-day emergency tarping to stop the water until we can do a full repair or replacement. Don&apos;t wait — water damage spreads fast inside walls.' },
];

/* Photo gallery */
const GALLERY = [
  { caption: 'Storm damage · before',    emoji: '⛈️', accent: '#dc2626', pattern: 'stripes' },
  { caption: 'Brand new roof · after',   emoji: '🏠', accent: '#0ea5e9', pattern: 'dots'    },
  { caption: 'Hail impact documented',   emoji: '📸', accent: '#7c3aed', pattern: 'grid'    },
  { caption: 'GAF tear-off in progress', emoji: '🔨', accent: '#c2410c', pattern: 'stripes' },
  { caption: 'Approved insurance check', emoji: '📋', accent: '#16a34a', pattern: 'dots'    },
  { caption: 'Family-owned crew',        emoji: '👷', accent: '#1e3a5f', pattern: 'grid'    },
];

/* Marquee value props */
const MARQUEE = [
  { icon:'🏠', text:'500+ Oklahoma Homes Restored' },
  { icon:'💰', text:`Avg ${BIZ.avgSettlement} MORE in Insurance Settlements` },
  { icon:'⚡', text:'24-48 Hour Free Inspection' },
  { icon:'🔨', text:'Most Roofs Installed in One Day' },
  { icon:'🛡️', text:'GAF Certified · BBB Accredited' },
  { icon:'☔', text:'Emergency Tarping · Same Day' },
  { icon:'✅', text:'100% Satisfaction Guaranteed' },
];

const FEATURED = ['BBB Accredited Business','GAF Certified Installer','OK Licensed Roofers','Angi Super Service','HomeAdvisor Elite Pro'];

export default function RoofersTemplate() {
  const [openFaq,    setOpenFaq]    = useState<number | null>(0);
  const [scrolled,   setScrolled]   = useState(false);
  const [stickyOpen, setStickyOpen] = useState(true);
  const [viewers,    setViewers]    = useState(7);
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 600], [0, 150]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Fake "live viewers" counter — adjusts every 4-7 seconds for social proof */
  useEffect(() => {
    const id = setInterval(() => {
      setViewers(v => Math.max(3, Math.min(14, v + (Math.random() > 0.5 ? 1 : -1))));
    }, 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: BIZ.paper, fontFamily: 'Inter, system-ui, sans-serif' }}>

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

      {/* Top utility bar — emergency red */}
      <div className="text-white text-xs" style={{ background: BIZ.stormDeep }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <MapPin className="w-3.5 h-3.5"/> {BIZ.address}
            </span>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`} className="font-bold flex items-center gap-1.5" style={{ color: BIZ.alert }}>
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse"/>
            <span>Storm Damage? Call:</span>
            <span className="underline tracking-tight">{BIZ.phone}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.storm}, ${BIZ.stormDeep})`, boxShadow: `0 0 14px ${BIZ.storm}44` }}>
              <HomeIcon className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-black text-slate-900 text-base sm:text-lg tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-red-600 transition-colors">Services</a>
            <a href="#claims" className="hover:text-red-600 transition-colors">Insurance Claims</a>
            <a href="#why" className="hover:text-red-600 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-red-600 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-red-600 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-red-600 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.alert }}/>
              {BIZ.phone}
            </a>
            <a href="#inspect"
              className="text-white font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 4px 14px ${BIZ.alert}66` }}>
              <Camera className="w-4 h-4"/> Free Inspection
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.stormDeep} 0%, ${BIZ.storm} 60%, ${BIZ.stormDeep} 100%)` }}>
        {/* Video texture background — looping demo footage with mix-blend for depth */}
        <video
          src={DEMO_VIDEO}
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full pointer-events-none select-none"
          style={{ objectFit: 'cover', mixBlendMode: 'overlay', opacity: 0.35 }}
        />
        {/* Scrim over video for legibility */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(135deg, ${BIZ.stormDeep}cc 0%, ${BIZ.storm}aa 60%, ${BIZ.stormDeep}dd 100%)` }}/>

        {/* Lightning flash — periodic full-screen white flash */}
        <motion.div
          animate={{ opacity: [0, 0, 0, 0, 0.8, 0, 0.5, 0, 0, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeOut', times: [0, 0.4, 0.5, 0.51, 0.52, 0.55, 0.57, 0.6, 0.7, 1] }}
          className="absolute inset-0 bg-white pointer-events-none mix-blend-overlay"
        />

        {/* Storm cloud / glow */}
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.alert}40, transparent 60%)`, filter: 'blur(100px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, #0ea5e9 0%, transparent 60%)`, filter: 'blur(100px)', opacity: 0.5 }}/>
        </motion.div>

        {/* Animated rain lines */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
          {[...Array(60)].map((_, i) => (
            <motion.div key={i}
              animate={{ y: [-100, 900] }}
              transition={{ duration: 1.2 + (i % 3) * 0.4, repeat: Infinity, ease: 'linear', delay: (i * 0.05) % 2 }}
              className="absolute w-px h-14"
              style={{
                left: `${(i * 1.7) % 100}%`,
                background: 'linear-gradient(180deg, transparent, rgba(186,230,253,0.7), transparent)',
              }}
            />
          ))}
        </div>

        {/* Live viewers badge — social proof */}
        <motion.div
          initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
          transition={{ delay:1 }}
          className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold"
          style={{ background:'rgba(15,23,42,0.7)', border:'1px solid rgba(220,38,38,0.5)', backdropFilter:'blur(8px)' }}>
          <motion.div animate={{ scale:[1,1.3,1], opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
            className="w-1.5 h-1.5 rounded-full" style={{ background:'#22c55e' }}/>
          <span className="text-white">{viewers} viewing now · 23 inspections booked today</span>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.alert}25`, border: `1px solid ${BIZ.alert}60`, color: '#fca5a5' }}>
              <AlertTriangle className="w-3 h-3"/>
              Storm Damage? Free Inspection in 48 Hrs
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight"
              style={{ fontFamily: '"Playfair Display", serif' }}>
              When the Storm<br/>Hits Your Roof,<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                We Hit Back Harder.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-blue-100/90 max-w-xl mb-8 leading-relaxed">
              Free storm damage inspections. Insurance claim experts. {BIZ.jobs} Oklahoma homes restored — and an average of <strong className="text-white">{BIZ.avgSettlement} more</strong> in settlements than initial adjuster estimates.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#inspect"
                className="text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
                <Camera className="w-5 h-5"/> Schedule Free Inspection
              </a>
              <a href={`tel:${BIZ.phoneRaw}`}
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-xl border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Phone className="w-5 h-5"/> Call {BIZ.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-blue-100/80">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-green-400"/> Licensed &amp; Insured</span>
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-green-400"/> BBB Accredited</span>
            </motion.div>
          </div>

          {/* Right: damage assessment report card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Insurance Approved" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-600">APPROVED</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">+$3,400 over initial</p>
                <p className="text-[10px] text-slate-500 mt-0.5">State Farm · claim #28419</p>
              </motion.div>

              {/* Floating "Crew dispatched" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Hammer className="w-5 h-5 text-orange-600"/>
                  <span className="text-xs font-bold text-slate-800">Crew Dispatched</span>
                </div>
                <p className="text-[10px] text-slate-500">Mon · 7am · 6 hours estimated</p>
              </motion.div>

              {/* Main damage report card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
                style={{ boxShadow: '0 30px 80px rgba(0,0,0,0.5)', border: `2px solid ${BIZ.alert}30` }}>
                {/* Top tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Damage Report</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: BIZ.alert }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.alert }}/>
                    URGENT
                  </span>
                </div>

                {/* Address */}
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Property Inspected</p>
                <p className="text-lg font-black mb-4 tracking-tight" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>2418 Wilshire Pl, Norman OK</p>

                {/* Checklist */}
                <div className="space-y-2.5 mb-4">
                  {[
                    { label:'Hail impacts (front slope)',  count:'47', severity:'high' },
                    { label:'Missing shingles',             count:'12', severity:'med'  },
                    { label:'Damaged flashing',             count:'3',  severity:'med'  },
                    { label:'Gutter dents documented',      count:'8',  severity:'low'  },
                  ].map((d, i) => (
                    <motion.div key={d.label}
                      initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
                      transition={{ delay: 0.5 + i*0.1 }}
                      className="flex items-center justify-between p-2 rounded-lg"
                      style={{ background: '#fef2f2' }}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: d.severity === 'high' ? BIZ.alert : d.severity === 'med' ? '#f59e0b' : '#0ea5e9' }}>
                          <Check className="w-3 h-3 text-white"/>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">{d.label}</span>
                      </div>
                      <span className="text-xs font-black tabular-nums flex-shrink-0" style={{ color: BIZ.alert }}>{d.count}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Estimate */}
                <div className="bg-slate-900 rounded-xl p-3 text-white">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                    <span className="text-slate-400">Settlement won</span>
                    <span className="text-green-400">+$3,400 over initial</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 text-xs">Initial: $7,400</span>
                    <span className="font-black text-2xl tabular-nums" style={{ color: '#22c55e' }}>$10,800</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: `linear-gradient(to top, ${BIZ.paper}, transparent)` }}/>
      </section>

      {/* AS FEATURED IN STRIP */}
      <section className="py-6 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Accredited · Certified · Trusted</span>
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

      {/* TRUST METRICS — with animated count-up */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { count: BIZ.yearsServing, suffix:'',  label:'Years in Business',  icon: Award  },
            { count: 500,              suffix:'+', label:'Homes Restored',     icon: Users  },
            { count: 24,               suffix:'h', label:'Inspection Response', icon: Clock },
            { count: 49,               suffix:'★', label:'Google Rating · /10', icon: Star  },
          ].map((m, i) => {
            const Icon = m.icon;
            return (
              <motion.div key={m.label}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08 }}
                className="text-center">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: `${BIZ.alert}10`, color: BIZ.alert }}>
                  <Icon className="w-6 h-6"/>
                </div>
                <p className="text-4xl sm:text-5xl font-black mb-1 tracking-tight tabular-nums" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
                  <CountUp to={m.count} suffix={m.suffix}/>
                </p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* SCROLLING MARQUEE */}
      <section className="overflow-hidden py-4 border-y" style={{ background: BIZ.stormDeep, borderColor: `${BIZ.alert}40` }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 whitespace-nowrap text-white">
          {[...Array(2)].flatMap((_, copy) => MARQUEE.map((m, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 text-sm font-bold">
              <span className="text-xl">{m.icon}</span>
              <span style={{ color: '#fca5a5' }}>{m.text}</span>
              <span className="text-slate-600">·</span>
            </span>
          )))}
        </motion.div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>What We Do</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              From a Quick Patch<br/>to a Full Tear-Off
            </h2>
            <p className="text-slate-600 text-lg">Every project documented for insurance. Every estimate written. Every crew uniformed and background-checked.</p>
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
                  <h3 className="text-xl font-bold mb-2 tracking-tight" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.alert }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INSURANCE CLAIM PROCESS — unique to roofers */}
      <section id="claims" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>How Insurance Claims Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              We Handle the Paperwork.<br/>You Pay Your Deductible.
            </h2>
            <p className="text-slate-600 text-lg">Most homeowners never realize how much settlement money insurance leaves on the table. We&apos;ve recovered an average of <strong style={{ color: BIZ.alert }}>{BIZ.avgSettlement} more</strong> per claim by fighting for re-inspections and detailed supplements.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CLAIM_STEPS.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div key={c.step}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative rounded-2xl p-7 transition-all"
                  style={{
                    background: `linear-gradient(180deg, ${c.accent}10, white)`,
                    border: `1px solid ${c.accent}30`,
                    boxShadow: `0 8px 30px ${c.accent}15`,
                  }}>
                  <span className="absolute -top-4 left-7 text-5xl font-black opacity-20 tracking-tighter" style={{ color: c.accent, fontFamily: '"Playfair Display", serif' }}>
                    {c.step}
                  </span>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 relative"
                    style={{ background: c.accent, color: 'white', boxShadow: `0 4px 14px ${c.accent}55` }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>{c.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>

          {/* Settlement-win callout */}
          <motion.div initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }}
            className="mt-12 rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6"
            style={{ background: `linear-gradient(135deg, ${BIZ.storm}, ${BIZ.stormDeep})` }}>
            <div className="text-white">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#fbbf24' }}>Real Customer · Real Result</p>
              <p className="text-2xl sm:text-3xl font-black mb-1 leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                State Farm offered $7,400.<br/>
                <span style={{ color: '#22c55e' }}>We secured $10,800.</span>
              </p>
              <p className="text-blue-100/80 text-sm">That&apos;s a +46% settlement increase — and it&apos;s not unusual.</p>
            </div>
            <a href="#inspect"
              className="flex-shrink-0 font-bold px-7 py-4 rounded-xl text-white flex items-center gap-2 hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
              <Camera className="w-5 h-5"/> Start My Free Inspection
            </a>
          </motion.div>
        </div>
      </section>

      {/* LIVE INSURANCE WINS TICKER — high-conversion social proof */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background:'#dcfce7', border:'1px solid #86efac', color:'#15803d' }}>
              <motion.div animate={{ scale:[1,1.4,1], opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
                className="w-1.5 h-1.5 rounded-full" style={{ background:'#16a34a' }}/>
              Live · Updated continuously
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-3" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              Insurance Wins · This Week
            </h2>
            <p className="text-slate-600 text-lg">Real customers, real claims re-filed, real settlements. These are the numbers your roofer doesn&apos;t want you to see.</p>
          </div>

          <div className="rounded-3xl overflow-hidden border-2"
            style={{ borderColor: '#dcfce7', background: 'linear-gradient(180deg, #f0fdf4, white)' }}>
            <div className="grid grid-cols-12 gap-0 text-[10px] font-bold uppercase tracking-widest text-slate-500 px-5 py-3 border-b"
              style={{ background: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className="col-span-3">Homeowner</div>
              <div className="col-span-2 hidden sm:block">City</div>
              <div className="col-span-3 sm:col-span-2 text-right">Initial</div>
              <div className="col-span-3 text-right">Final</div>
              <div className="col-span-3 sm:col-span-2 text-right">Increase</div>
            </div>
            {RECENT_WINS.map((w, i) => {
              const init = parseInt(w.initial.replace(/[^0-9]/g, ''));
              const fin  = parseInt(w.final.replace(/[^0-9]/g, ''));
              const incPct = Math.round(((fin - init) / init) * 100);
              return (
                <motion.div key={`${w.name}-${i}`}
                  initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  className="grid grid-cols-12 gap-0 px-5 py-4 items-center text-sm border-b last:border-b-0"
                  style={{ borderColor: '#f1f5f9' }}>
                  <div className="col-span-3 min-w-0">
                    <p className="font-bold truncate" style={{ color: BIZ.storm }}>{w.name}</p>
                    <p className="text-[10px] text-slate-500 sm:hidden">{w.city} · {w.time}</p>
                  </div>
                  <div className="col-span-2 hidden sm:block">
                    <p className="text-slate-700 text-xs">{w.city}</p>
                    <p className="text-[10px] text-slate-400">{w.time}</p>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <p className="text-slate-500 text-xs tabular-nums">{w.initial}</p>
                  </div>
                  <div className="col-span-3 text-right">
                    <p className="font-black tabular-nums" style={{ color: '#16a34a' }}>{w.final}</p>
                  </div>
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold tabular-nums px-2 py-0.5 rounded-full"
                      style={{ background: '#dcfce7', color: '#15803d' }}>
                      <TrendingUp className="w-3 h-3"/> +{incPct}%
                    </span>
                  </div>
                </motion.div>
              );
            })}
            <div className="px-5 py-4 text-center text-xs font-bold uppercase tracking-widest"
              style={{ background: '#f8fafc', color: '#16a34a' }}>
              <CountUp to={284900} prefix="+$" suffix=" recovered for clients this year"/>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Curious what your claim is worth? <a href="#inspect" className="font-bold hover:underline" style={{ color: BIZ.alert }}>Get a free inspection →</a>
          </p>
        </div>
      </section>

      {/* STORM DAMAGE CHECKLIST */}
      <section className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            style={{ background: `linear-gradient(135deg, ${BIZ.storm} 0%, ${BIZ.stormDeep} 100%)`, border: `1px solid ${BIZ.alert}30` }}>
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full text-xs font-bold uppercase tracking-widest"
                style={{ background: `${BIZ.alert}25`, border: `1px solid ${BIZ.alert}60`, color: '#fca5a5' }}>
                <CloudRain className="w-3 h-3"/> After a Storm Hits
              </div>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Don&apos;t Wait Until<br/>
                <span style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Water Hits Your Ceiling.
                </span>
              </h2>
              <p className="text-blue-100/90 text-lg leading-relaxed mb-6">
                Most storm damage is invisible from the ground. By the time you see a water stain, the leak has been there for weeks. A free inspection now is the difference between a $400 repair and a $20,000 ceiling replacement.
              </p>
              <a href="#inspect"
                className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
                Book Free Storm Inspection <ArrowRight className="w-5 h-5"/>
              </a>
            </div>

            <div className="bg-white rounded-2xl p-7 shadow-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Hidden damage we always check</p>
              <ul className="space-y-3">
                {STORM_CHECKS.map((item, i) => (
                  <motion.li key={item}
                    initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                    transition={{ delay: i*0.06 }}
                    className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${BIZ.alert}20`, color: BIZ.alert }}>
                      <Check className="w-3.5 h-3.5"/>
                    </div>
                    <span className="text-slate-700 text-sm leading-relaxed">{item}</span>
                  </motion.li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                <p className="font-bold text-slate-900">100% Free · No obligation</p>
                <p className="text-xs text-slate-500 mt-0.5">Most inspections complete in 30 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years.<br/>500+ Roofs.<br/>Zero Run-Around.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              We started this company because we were tired of watching Oklahoma homeowners get bait-and-switched after every storm — $19 inspection fees that turned into pressure to sign on the spot, low-balled insurance claims, fly-by-night out-of-state crews. We don&apos;t do that.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Family-owned in Lawton. Background-checked W-2 crews. {BIZ.license}. Every roof inspected for free, every claim documented thoroughly, every install warrantied. {BIZ.reviewCount} verified Google reviews tell the story.
            </p>
            <a href="#inspect"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-xl hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}50` }}>
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
                  className="bg-slate-50 rounded-2xl p-6 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: BIZ.storm, color: 'white' }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2 tracking-tight" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY */}
      <section className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Recent Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              500+ Roofs. One Photo at a Time.
            </h2>
            <p className="text-slate-600 text-lg">Real storm damage, real insurance wins, real Oklahoma homes restored.</p>
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
                    background: `linear-gradient(135deg, ${g.accent}, ${BIZ.stormDeep})`,
                    boxShadow: `0 12px 40px ${g.accent}30, 0 4px 12px rgba(0,0,0,0.1)`,
                  }}>
                  <div className="absolute inset-0 opacity-25" style={{ backgroundImage: patternBg, backgroundSize: patternSize }}/>
                  <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 50% 100%, ${BIZ.stormDeep}aa, transparent 70%)` }}/>
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
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.alert }}/>
            500+ Oklahoma homes restored · <a href="#inspect" className="font-bold hover:underline" style={{ color: BIZ.alert }}>Start your inspection →</a>
          </p>
        </div>
      </section>

      {/* WATCH OUR WORK — video stories */}
      <section className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Watch Our Work</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              The Stories Behind<br/>the Roofs.
            </h2>
            <p className="text-slate-600 text-lg">Real Oklahoma homes. Real damage. Real insurance fights — and real wins.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIDEOS.map((v, i) => (
              <motion.div key={v.title}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.1 }}
                whileHover={{ y:-6 }}
                className="group relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer"
                style={{ boxShadow: `0 12px 40px ${v.color}25, 0 4px 12px rgba(0,0,0,0.1)` }}>
                {/* Looping muted video texture */}
                <video
                  src={DEMO_VIDEO}
                  autoPlay muted loop playsInline
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit: 'cover', filter: `hue-rotate(${i * 60}deg) saturate(1.2) brightness(0.7)` }}
                />
                {/* Colored gradient overlay */}
                <div className="absolute inset-0"
                  style={{ background: `linear-gradient(135deg, ${v.color}88, ${BIZ.stormDeep}cc)` }}/>
                {/* Bottom scrim */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(0,0,0,0.85), transparent 60%)` }}/>

                {/* Play button */}
                <motion.div
                  whileHover={{ scale: 1.15 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.95)', boxShadow: `0 8px 30px rgba(0,0,0,0.4)` }}>
                  <Play className="w-7 h-7 ml-1" style={{ color: BIZ.storm, fill: BIZ.storm }}/>
                </motion.div>

                {/* Label top-left */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                  style={{ background: v.color }}>
                  {v.label}
                </span>

                {/* Duration top-right */}
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold tabular-nums bg-black/50 text-white backdrop-blur">
                  {v.duration}
                </span>

                {/* Title bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white font-bold text-sm leading-tight tracking-tight">{v.title}</p>
                  <p className="text-white/60 text-[10px] mt-1 flex items-center gap-1">
                    <Eye className="w-3 h-3"/> {(1240 + i*430).toLocaleString()} views
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            <Trophy className="w-4 h-4 inline mr-1" style={{ color: BIZ.alert }}/>
            More stories on our YouTube · <a href="#inspect" className="font-bold hover:underline" style={{ color: BIZ.alert }}>Get your own inspection →</a>
          </p>
        </div>
      </section>

      {/* EMERGENCY BANNER */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <CloudRain className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>Active Leak? Storm Just Hit?</p>
              <p className="text-white/90 text-sm mt-1">Same-day emergency tarping. We&apos;ll stop the water until we can do the full repair.</p>
            </div>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`}
            className="bg-white font-black px-7 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg"
            style={{ color: BIZ.alertDeep }}>
            <Phone className="w-5 h-5"/> {BIZ.phone}
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Real Customers</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Oklahomans
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
                style={{ background: BIZ.cream, border: `1px solid ${BIZ.storm}10` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.storm})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.storm }}>{r.name}</p>
                    <p className="text-xs text-slate-500">{r.city}, OK · Verified Google</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INSPECTION REQUEST FORM */}
      <section id="inspect" className="py-20 sm:py-24" style={{ background: BIZ.cream }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.storm} 0%, ${BIZ.stormDeep} 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Schedule My Free Inspection</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                One Form.<br/>One Free Inspection.<br/>Zero Obligation.
              </h2>
              <p className="text-blue-100/90 text-lg mb-6">
                Tell us what&apos;s going on. We&apos;ll text or call you back within 1 hour to schedule. Most inspections happen within 48 hours of your request — sooner during storm season.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Clock,        text: 'Free inspection within 24-48 hours' },
                  { icon: MessageCircle,text: 'Reply by text or phone — your pick' },
                  { icon: FileText,     text: 'Detailed written report + photos' },
                  { icon: BadgeCheck,   text: 'No deposit · No high-pressure sales' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-blue-100">
                    <item.icon className="w-4 h-4" style={{ color: '#fca5a5' }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-2xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What&apos;s the situation?</label>
                <select className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all">
                  <option>Recent storm / hail damage</option>
                  <option>Active leak (URGENT)</option>
                  <option>Insurance claim assistance</option>
                  <option>Missing or curling shingles</option>
                  <option>Routine roof inspection</option>
                  <option>Full roof replacement quote</option>
                  <option>Gutter install or repair</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Property address</label>
                <input type="text" placeholder="Street + city"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
                <Camera className="w-5 h-5"/> Schedule My Free Inspection
              </button>
              <p className="text-center text-xs text-slate-500">No spam · We text once and stop if you ask</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
            Servicing All of Oklahoma
          </h2>
          <p className="text-slate-600 mb-10">From Lawton to Tulsa — we roll trucks statewide for storm response and installs.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.cream, color: BIZ.storm, borderColor: `${BIZ.alert}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.alert }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.alert }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.storm, fontFamily: '"Playfair Display", serif' }}>
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
                    background: isOpen ? '#fef2f2' : 'white',
                    borderColor: isOpen ? `${BIZ.alert}40` : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.storm }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.alert }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.storm} 0%, ${BIZ.stormDeep} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.alert}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Your Roof Is Worth<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.alert}, #fbbf24)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              A Free Inspection.
            </span>
          </h2>
          <p className="text-blue-100/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            No deposit. No high-pressure sales. Just an honest look at what your roof needs — and an honest conversation about what insurance will cover.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform text-lg text-white"
              style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#inspect"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-xl border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Camera className="w-5 h-5"/> Book Inspection
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-blue-100/70 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><AlertTriangle className="w-3.5 h-3.5"/> {BIZ.emergency24}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> Licensed &amp; Insured</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-slate-300" style={{ background: BIZ.stormDeep }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})` }}>
                <HomeIcon className="w-5 h-5"/>
              </div>
              <p className="font-black text-white text-lg tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline}. {BIZ.yearsServing} years of honest, insurance-savvy roofing across Oklahoma.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.alert }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.alert }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.alert }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.alert }}/><span>{BIZ.hours}<br/><strong className="text-white">{BIZ.emergency24}</strong></span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Service Areas</p>
            <p className="text-sm text-slate-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>Licensed · Insured · BBB Accredited · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className={`lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse transition-opacity ${stickyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 8px 30px ${BIZ.alert}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>

      {/* STICKY BOTTOM 60-SECOND QUOTE BAR — high conversion */}
      {stickyOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2, type: 'spring', stiffness: 80 }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t-2"
          style={{
            background: `linear-gradient(135deg, ${BIZ.stormDeep}f5, ${BIZ.storm}f5)`,
            borderColor: BIZ.alert,
            backdropFilter: 'blur(12px)',
            boxShadow: `0 -8px 40px rgba(0,0,0,0.4), 0 -2px 10px ${BIZ.alert}40`,
          }}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
            {/* Pulse dot */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <motion.div animate={{ scale:[1,1.4,1], opacity:[1,0.5,1] }} transition={{ duration:1.5, repeat:Infinity }}
                className="w-2 h-2 rounded-full" style={{ background: BIZ.alert }}/>
              <span className="text-[10px] font-bold uppercase tracking-widest text-red-300">Free Inspection</span>
            </div>

            {/* Headline */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm sm:text-base leading-tight tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
                Storm damage? Get a free inspection in <span style={{ color: '#fbbf24' }}>60 seconds</span>.
              </p>
              <p className="text-blue-200/80 text-[10px] sm:text-xs hidden sm:block">No deposit · No high-pressure sales · Most inspections within 48 hrs</p>
            </div>

            {/* Quick form (desktop) */}
            <form onSubmit={e => { e.preventDefault(); alert('Demo only — wire to your CRM!'); }}
              className="hidden md:flex items-center gap-2 flex-shrink-0">
              <input type="tel" placeholder="Your phone"
                className="px-3 py-2 rounded-lg text-sm text-slate-900 bg-white/95 border-0 focus:outline-none focus:ring-2 focus:ring-red-300 w-40"/>
              <button type="submit"
                className="text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
                style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 4px 14px ${BIZ.alert}66` }}>
                <Camera className="w-4 h-4"/> Get Inspection
              </button>
            </form>

            {/* Phone CTA (mobile + fallback) */}
            <a href={`tel:${BIZ.phoneRaw}`}
              className="md:hidden text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-1.5 whitespace-nowrap flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.alert}, ${BIZ.alertDeep})`, boxShadow: `0 4px 14px ${BIZ.alert}66` }}>
              <Phone className="w-4 h-4"/> Call
            </a>

            {/* Dismiss */}
            <button
              onClick={() => setStickyOpen(false)}
              className="text-white/50 hover:text-white transition-colors flex-shrink-0"
              aria-label="Dismiss">
              <X className="w-4 h-4"/>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
