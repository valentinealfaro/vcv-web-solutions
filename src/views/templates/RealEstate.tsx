'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, Award,
  Home as HomeIcon, Bed, Bath, Square, TrendingUp, Key, FileText, DollarSign,
} from 'lucide-react';

const BIZ = {
  name:        'Halberg & Associates Realty',
  tagline:     'Southwest Oklahoma · Buy · Sell · Invest',
  agent:       'Sarah Halberg, Lead Broker',
  phone:       '(580) 555-0901',
  phoneRaw:    '5805550901',
  email:       'sarah@halbergrealty.com',
  address:     '912 NW Cache Rd, Lawton, OK 73505',
  hours:       'Mon–Sat · 8am–7pm · Sun by appointment',
  established: 2010,
  yearsServing: new Date().getFullYear() - 2010,
  closed:      '$284M',
  responseHr:  '< 1 hr',
  rating:      5.0,
  reviewCount: 287,
  license:     'OK Broker License #BRK-29841',
  insurance:   'Member NAR · OAR · Lawton MLS',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Sterling','Duncan','Comanche'],
  /* Premium real estate palette — navy + gold + ivory */
  navy:    '#1e3a8a',
  navyDeep:'#172554',
  gold:    '#ca8a04',
  goldDeep:'#a16207',
  ivory:   '#fefce8',
  paper:   '#fffbeb',
  ink:     '#0f172a',
};

const LISTINGS = [
  { addr:'2418 Wilshire Pl', city:'Lawton',  price:'$425,000', beds:4, baths:3, sqft:'2,840', tag:'NEW',         color:'#dc2626' },
  { addr:'1850 Oak Tree Dr', city:'Cache',   price:'$315,000', beds:3, baths:2, sqft:'1,920', tag:'OPEN HOUSE', color:'#10b981' },
  { addr:'732 Sunset Ridge', city:'Elgin',   price:'$549,900', beds:5, baths:4, sqft:'3,420', tag:'PRICE DROP', color:'#f59e0b' },
  { addr:'90 Lakeview Way',  city:'Medicine Park', price:'$685,000', beds:4, baths:3, sqft:'3,100', tag:'WATERFRONT', color:'#0ea5e9' },
  { addr:'415 Maple Ct',     city:'Lawton',  price:'$249,500', beds:3, baths:2, sqft:'1,680', tag:'PENDING',     color:'#a855f7' },
  { addr:'1280 Brick House Rd', city:'Apache', price:'$389,000', beds:4, baths:3, sqft:'2,540', tag:'ACREAGE',  color:'#16a34a' },
];

const SERVICES = [
  { icon: HomeIcon,   title: 'Home Buying',          desc: 'First-timer or 5th house? We negotiate hard, line by line, on every offer.',         color:'#1e3a8a' },
  { icon: Key,        title: 'Home Selling',         desc: 'Pro photography, drone shots, video tours included. Most homes sell in 14 days.',  color:'#ca8a04' },
  { icon: TrendingUp, title: 'Investment Property',  desc: 'Cash-flow analysis, ROI projections, off-market deals. We invest ourselves.',     color:'#10b981' },
  { icon: FileText,   title: 'Free Home Valuation',  desc: 'Instant comps, market trends, and a no-obligation in-person walkthrough.',         color:'#7c3aed' },
  { icon: DollarSign, title: 'Mortgage Connections', desc: 'Vetted local lenders. We&apos;ll match you with the best rate for your situation.',color:'#dc2626' },
  { icon: Award,      title: 'Relocation Help',      desc: 'Moving to Lawton from out of state? We handle everything — schools, neighborhoods, lenders.', color:'#0ea5e9' },
];

const WHY = [
  { icon: TrendingUp, title: 'Top 1% Producer', desc: `${BIZ.closed} in closed sales · 14 years in the local market · Top 1% of OK realtors by volume.` },
  { icon: BadgeCheck, title: 'Licensed Broker', desc: 'Sarah is a fully licensed broker, not just an agent — meaning more contract knowledge and better negotiation power.' },
  { icon: Award,      title: 'Local Market Expert', desc: 'Born in Lawton. Walked every neighborhood. Knows which streets flood, which schools rank, which inspector to trust.' },
  { icon: HomeIcon,   title: 'Concierge Service',   desc: 'We coordinate inspections, repairs, lenders, movers — you just have to show up at closing.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years in Market',    suffix: '' },
  { value: BIZ.closed,                  label: 'Closed Volume',      suffix: '' },
  { value: BIZ.responseHr,              label: 'Response Time',      suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',      suffix: '★' },
];

const REVIEWS = [
  { name: 'Daniel R.', city: 'Lawton', rating: 5,
    text: '"Sarah sold our house in 9 days for $11K over asking. She talked us out of two bad-deal buyers and held out for the right one. Smartest agent we&apos;ve ever worked with."' },
  { name: 'Marcia P.', city: 'Cache', rating: 5,
    text: '"As a first-time buyer, I was terrified. Sarah walked me through every form, every contingency, every inspection finding. We got the house at $8K under list. Lifetime client."' },
  { name: 'Tony &amp; Lisa K.', city: 'Elgin', rating: 5,
    text: '"Bought our investment duplex through Halberg. Sarah ran the cash-flow numbers HONESTLY (told us to walk on two earlier deals). The one we bought is profitable from month one."' },
];

const FAQS = [
  { q: 'How much does it cost to use a Realtor when I&apos;m buying?',  a: 'For buyers, our service is typically free — the seller pays both agents&apos; commission as part of closing. We&apos;ll explain every cost in writing before you make any offer, so there are zero surprises at closing.' },
  { q: 'What commission do you charge sellers?',                       a: 'Our standard listing commission is 5.5% (split with the buyer&apos;s agent). For higher-priced homes ($500K+) we negotiate. We don&apos;t do bait-and-switch &ldquo;1% listings&rdquo; — that often leaves you with no buyer&apos;s agent representation.' },
  { q: 'How fast can you sell my home?',                               a: 'In our market, well-priced and well-presented homes typically go under contract in 14 days. We provide pro photography, drone shots, video tours, and we list across MLS, Zillow, Realtor.com, and our private investor network. Most listings get 3+ offers.' },
  { q: 'I&apos;m relocating from out of state — can you help?',         a: 'Yes — about 30% of our buyers are relocating to Lawton (often Fort Sill or oil &amp; gas). We handle virtual tours, school district guidance, lender introductions, and even movers. Most of our military buyers close in under 30 days.' },
  { q: 'Do you do investment property?',                               a: 'Yes — Sarah owns 8 rentals herself and runs honest cash-flow analysis (not the optimistic kind that gets investors burned). If a deal doesn&apos;t pencil, we tell you. We have access to off-market deals not on Zillow.' },
  { q: 'How accurate is your home valuation?',                         a: 'Our free valuation uses live MLS comps + a 15-min in-person walkthrough — typically within 2-3% of final sale price. Way more accurate than a Zestimate (which can be off by 20%+).' },
];

export default function RealEstateTemplate() {
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

      {/* Top utility bar */}
      <div className="text-white text-xs" style={{ background: BIZ.navyDeep }}>
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1.5 opacity-80">
              <Clock className="w-3.5 h-3.5"/> {BIZ.hours}
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 opacity-80">
              <Award className="w-3.5 h-3.5"/> {BIZ.license}
            </span>
          </div>
          <a href={`tel:${BIZ.phoneRaw}`} className="font-bold flex items-center gap-1.5" style={{ color: BIZ.gold }}>
            <Phone className="w-3.5 h-3.5"/>
            <span>Direct Line:</span>
            <span className="underline">{BIZ.phone}</span>
          </a>
        </div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[36px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.navy}, ${BIZ.navyDeep})`, boxShadow: `0 0 14px ${BIZ.gold}33` }}>
              <HomeIcon className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#listings" className="hover:text-amber-700 transition-colors">Listings</a>
            <a href="#services" className="hover:text-amber-700 transition-colors">Services</a>
            <a href="#why" className="hover:text-amber-700 transition-colors">About Sarah</a>
            <a href="#reviews" className="hover:text-amber-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-amber-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-amber-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.gold }}/>
              {BIZ.phone}
            </a>
            <a href="#contact"
              className="text-white font-bold px-5 py-2.5 text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 4px 14px ${BIZ.gold}66` }}>
              <FileText className="w-4 h-4"/> Free Valuation
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, ${BIZ.navyDeep} 60%, ${BIZ.ink} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-40 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.navy}80, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.gold}20`, border: `1px solid ${BIZ.gold}60`, color: BIZ.gold }}>
              <Award className="w-3 h-3"/>
              Top 1% Realtor · {BIZ.closed} Closed
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight" style={{ fontFamily: '"Playfair Display", serif' }}>
              The Right Home.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.gold}, #fde68a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                The Right Price.
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-blue-200/90 italic font-normal">Negotiated by a Local Pro.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-blue-100/90 max-w-xl mb-8 leading-relaxed">
              {BIZ.yearsServing} years in the southwest Oklahoma market. {BIZ.closed} in closed sales. Honest pricing, hard negotiation, and concierge service from contract to keys.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#contact"
                className="text-white font-bold px-7 py-4 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 8px 30px ${BIZ.gold}66` }}>
                <FileText className="w-5 h-5"/> Get Free Home Valuation
              </a>
              <a href="#listings"
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <HomeIcon className="w-5 h-5"/> Browse Listings
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
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-amber-400"/> Licensed Broker</span>
              <span className="inline-flex items-center gap-1.5"><Award className="w-4 h-4 text-amber-400"/> {BIZ.insurance}</span>
            </motion.div>
          </div>

          {/* Right: featured listing card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "JUST SOLD" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: `0 20px 60px ${BIZ.navy}40`, borderTop: `3px solid ${BIZ.gold}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-3.5 h-3.5 text-green-600"/>
                  </div>
                  <span className="text-xs font-bold text-slate-600">JUST SOLD</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">$11K over asking</p>
                <p className="text-[10px] text-slate-500 mt-0.5">9 days on market · 4 offers</p>
              </motion.div>

              {/* Floating "Open House" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white shadow-2xl p-4 z-10 w-52"
                style={{ boxShadow: `0 20px 60px ${BIZ.gold}40`, borderTop: `3px solid #10b981` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Calendar className="w-5 h-5 text-green-600"/>
                  <span className="text-xs font-bold text-slate-800">OPEN HOUSE</span>
                </div>
                <p className="text-xs text-slate-700 font-bold">Sat 1pm – 3pm</p>
                <p className="text-[10px] text-slate-500">1850 Oak Tree Dr · Cache</p>
              </motion.div>

              {/* Featured listing card */}
              <div className="bg-white shadow-2xl overflow-hidden"
                style={{ boxShadow: `0 30px 80px ${BIZ.navy}50` }}>
                {/* Property image area (gradient placeholder) */}
                <div className="aspect-[4/3] relative" style={{ background: `linear-gradient(135deg, ${BIZ.navy}, ${BIZ.navyDeep}), radial-gradient(circle at 30% 30%, ${BIZ.gold}40, transparent 60%)` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <HomeIcon className="w-20 h-20 text-white/30"/>
                  </div>
                  <span className="absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ background: BIZ.gold }}>
                    Featured Listing
                  </span>
                  <span className="absolute top-3 right-3 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white bg-red-600">
                    NEW
                  </span>
                </div>

                {/* Listing details */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">2418 Wilshire Pl</p>
                  <p className="text-2xl font-black mb-3" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>$425,000</p>

                  <div className="flex items-center gap-3 text-sm text-slate-600 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-4 h-4"/> 4 bed</span>
                    <span className="flex items-center gap-1"><Bath className="w-4 h-4"/> 3 bath</span>
                    <span className="flex items-center gap-1"><Square className="w-4 h-4"/> 2,840 sqft</span>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-bold">Days on market</span>
                      <span className="font-bold text-green-600">3 days</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-bold">Showing requests</span>
                      <span className="font-bold tabular-nums" style={{ color: BIZ.gold }}>12 active</span>
                    </div>
                  </div>

                  <a href="#listings" className="w-full py-3 font-bold text-white text-sm flex items-center justify-center gap-2"
                    style={{ background: `linear-gradient(135deg, ${BIZ.navy}, ${BIZ.navyDeep})` }}>
                    Schedule Showing <ArrowRight className="w-4 h-4"/>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.08 }}
              className="text-center">
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURED LISTINGS — unique to real estate */}
      <section id="listings" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Available Now</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              Active Listings
            </h2>
            <p className="text-slate-600 text-lg">A handful of homes I&apos;m representing right now. Click any listing for full details, photos, and to schedule a showing.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {LISTINGS.map((l, i) => (
              <motion.div key={l.addr}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.07 }}
                whileHover={{ y:-6 }}
                className="group bg-white overflow-hidden cursor-pointer transition-all"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                {/* Image placeholder */}
                <div className="aspect-[4/3] relative" style={{ background: `linear-gradient(135deg, ${BIZ.navy}80, ${BIZ.navyDeep}), radial-gradient(circle at ${30 + i*5}% 30%, ${l.color}40, transparent 60%)` }}>
                  <div className="absolute inset-0 flex items-center justify-center transition-transform group-hover:scale-110">
                    <HomeIcon className="w-16 h-16 text-white/40"/>
                  </div>
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ background: l.color }}>
                    {l.tag}
                  </span>
                  <div className="absolute bottom-3 right-3 bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
                    style={{ color: BIZ.navy }}>
                    {l.city}
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">{l.addr}</p>
                  <p className="text-2xl font-black mb-3" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{l.price}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-600 mb-4">
                    <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5"/> {l.beds}</span>
                    <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5"/> {l.baths}</span>
                    <span className="flex items-center gap-1"><Square className="w-3.5 h-3.5"/> {l.sqft}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.gold }}>
                    View details <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-10 text-slate-500">
            <a href="#contact" className="font-bold hover:underline" style={{ color: BIZ.gold }}>See all 47 active listings →</a>
          </p>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>How We Help</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              Buying, Selling, or Investing<br/>— We Handle It All
            </h2>
            <p className="text-slate-600 text-lg">From first-time buyers to seasoned investors, we negotiate hard and explain everything in plain English.</p>
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
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)', borderLeft: `3px solid ${s.color}` }}>
                  <div className="w-14 h-14 flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.gold }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24" style={{ background: BIZ.ivory }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>About Sarah</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years.<br/>{BIZ.closed} Closed.<br/>One Local Broker.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              I&apos;ve lived in Lawton my entire life, and I&apos;ve been a full-time Realtor since {BIZ.established}. In that time, I&apos;ve closed {BIZ.closed} in volume — placing me in the top 1% of Oklahoma agents by transaction count and dollar volume.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              But what sets me apart isn&apos;t the volume — it&apos;s the approach. I treat every client like family because most of them become exactly that. {BIZ.reviewCount} 5-star reviews. {BIZ.responseHr} response time on every text. And I personally answer every call, every time.
            </p>
            <a href="#contact"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 8px 30px ${BIZ.gold}50` }}>
              Schedule a Free Consultation <ArrowRight className="w-5 h-5"/>
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
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05)', borderTop: `3px solid ${BIZ.gold}` }}>
                  <div className="w-12 h-12 flex items-center justify-center mb-4"
                    style={{ background: BIZ.navy, color: BIZ.gold }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{w.desc}</p>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Real Clients</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Buyers &amp; Sellers
            </h2>
            <div className="inline-flex items-center gap-2 px-4 py-2" style={{ background: '#fef3c7', border: '1px solid #fcd34d' }}>
              {[...Array(5)].map((_,i) => <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
              <span className="text-sm font-bold text-amber-900">Verified Google Reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.1 }}
                className="p-7"
                style={{ background: BIZ.paper, borderTop: `3px solid ${BIZ.gold}` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm italic">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-amber-100">
                  <div className="w-10 h-10 flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})` }}>
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

      {/* CONTACT FORM */}
      <section id="contact" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, ${BIZ.navyDeep} 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Free Consultation</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Buying, Selling,<br/>or Just Curious?
              </h2>
              <p className="text-blue-100 text-lg mb-6">
                Tell me a bit about what you&apos;re looking for. I&apos;ll text you back personally — usually within an hour, even on weekends.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: FileText,      text: 'Free home valuation in 24 hours' },
                  { icon: MessageCircle, text: 'I personally answer every text' },
                  { icon: BadgeCheck,    text: 'No high-pressure sales pitch' },
                  { icon: Award,         text: '5-star service from start to keys' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-blue-100">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.gold }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your CRM!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">I&apos;m looking to...</label>
                <select className="w-full px-4 py-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all">
                  <option>Buy a home</option>
                  <option>Sell my current home</option>
                  <option>Both — buy and sell</option>
                  <option>Investment property</option>
                  <option>Get a free home valuation</option>
                  <option>Just exploring the market</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Property address (if selling)</label>
                <input type="text" placeholder="e.g. 1234 Main St, Lawton OK"
                  className="w-full px-4 py-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 8px 30px ${BIZ.gold}66` }}>
                <FileText className="w-5 h-5"/> Get My Free Consultation
              </button>
              <p className="text-center text-xs text-slate-500">Sarah personally answers every inquiry · No automated bots</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Service Areas</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
            Helping Buyers &amp; Sellers Across SW Oklahoma
          </h2>
          <p className="text-slate-600 mb-10">Local expertise in every neighborhood from Lawton to Comanche.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.ivory, color: BIZ.navy, borderColor: `${BIZ.gold}40` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.gold }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.navy, fontFamily: '"Playfair Display", serif' }}>
              Questions, Answered
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}
                  className="border transition-all"
                  style={{
                    background: isOpen ? BIZ.ivory : 'white',
                    borderColor: isOpen ? `${BIZ.gold}50` : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.navy }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.gold }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.navy} 0%, ${BIZ.navyDeep} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Your Next Home<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.gold}, #fde68a)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Starts With a Call.
            </span>
          </h2>
          <p className="text-blue-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10">
            Free consultation, free home valuation, free advice — no commitment. Let&apos;s talk about what you want.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 flex items-center gap-2 hover:scale-105 transition-transform text-lg text-white"
              style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 8px 30px ${BIZ.gold}66` }}>
              <Phone className="w-5 h-5"/> Call Sarah · {BIZ.phone}
            </a>
            <a href="#contact"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <FileText className="w-5 h-5"/> Free Valuation
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-blue-100/70 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/> Top 1% Realtor</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-3.5 h-3.5"/> Licensed Broker</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-slate-300" style={{ background: BIZ.ink }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.navy}, ${BIZ.navyDeep})` }}>
                <HomeIcon className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">{BIZ.tagline}. {BIZ.yearsServing} years and {BIZ.closed} in closed sales across southwest Oklahoma.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.gold }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.gold }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.gold }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.gold }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Service Areas</p>
            <p className="text-sm text-slate-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>{BIZ.agent} · Licensed since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.gold}, ${BIZ.goldDeep})`, boxShadow: `0 8px 30px ${BIZ.gold}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
