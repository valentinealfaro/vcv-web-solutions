'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, Star, MessageCircle, Award,
  Scissors, Heart, Users, Palette, Wand2,
} from 'lucide-react';

const BIZ = {
  name:        'Velvet & Vine Salon',
  tagline:     'Bespoke Color · Hand-Crafted Cuts · Modern Wellness',
  phone:       '(580) 555-0890',
  phoneRaw:    '5805550890',
  email:       'hello@velvetandvine.com',
  address:     '425 NW Ferris Ave, Lawton, OK 73501',
  hours:       'Tue–Sat · 9am–7pm · Sun by appointment · Mon closed',
  established: 2016,
  yearsServing: new Date().getFullYear() - 2016,
  clients:     '6,400+',
  responseHr:  'Same day',
  rating:      4.9,
  reviewCount: 412,
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Medicine Park','Duncan'],
  /* Palette — rose-gold + deep plum + soft cream */
  plum:    '#581c87',
  plumDeep:'#3b0764',
  rose:    '#f5a896',
  roseDeep:'#c2410c',
  cream:   '#fdf2f8',
  paper:   '#fefcfb',
  gold:    '#d4af37',
};

const STYLISTS = [
  { name:'Olivia',  role:'Color Specialist',    yrs:8, specialty:'Balayage, dimensional color', initials:'OV', accent:'#f5a896' },
  { name:'Marcus',  role:'Master Stylist',      yrs:12, specialty:'Precision cuts, men&apos;s styling', initials:'MA', accent:'#581c87' },
  { name:'Jada',    role:'Texture Specialist',  yrs:6, specialty:'Curls, natural hair, protective styles', initials:'JA', accent:'#a21caf' },
  { name:'Emma',    role:'Wedding & Events',    yrs:9, specialty:'Bridal, special occasion, extensions', initials:'EM', accent:'#d4af37' },
];

const SERVICES = [
  { icon: Scissors,  title: 'Cut & Style',          desc: 'Precision cuts, refresh trims, men&apos;s grooming. Consultations always free.', color:'#581c87' },
  { icon: Palette,   title: 'Color & Highlights',   desc: 'Balayage, foilage, dimensional color, gloss treatments. Goldwell certified.',  color:'#f5a896' },
  { icon: Wand2,     title: 'Hair Treatments',      desc: 'Olaplex, K18, deep conditioning, scalp therapy. Reverse the damage.',          color:'#a21caf' },
  { icon: Heart,     title: 'Bridal &amp; Events',   desc: 'In-salon or on-site styling. Trials included. We make your day perfect.',     color:'#d4af37' },
  { icon: Sparkles,  title: 'Extensions',           desc: 'Hand-tied, tape-in, fusion. Length, volume, or both — installed in 2 hours.', color:'#ec4899' },
  { icon: Users,     title: 'Group &amp; Wedding Parties', desc: 'Private salon buyouts for bridal parties, photoshoots, special events.', color:'#7c3aed' },
];

const WHY = [
  { icon: Award,    title: 'Education-Obsessed',     desc: 'Every stylist trains 40+ hours per year. We bring in master educators from NYC and LA quarterly.' },
  { icon: Heart,    title: 'Consultation Always Free', desc: 'Not sure what you want? Book a free 15-min consult with any stylist. No pressure, just guidance.' },
  { icon: Sparkles, title: 'Luxury Without the Price',desc: 'Premium Aveda &amp; Goldwell color, no big-city markup. Most services 20-30% less than OKC.' },
  { icon: Users,    title: 'Same Stylist Every Time', desc: 'Your stylist learns your hair, your style, your life. Real relationships, not chair-swap chaos.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Open',        suffix: '' },
  { value: BIZ.clients,                 label: 'Clients Served',    suffix: '' },
  { value: BIZ.responseHr,              label: 'Booking Reply',     suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',     suffix: '★' },
];

const REVIEWS = [
  { name: 'Allison K.', city: 'Lawton', rating: 5,
    text: '"Olivia transformed my over-bleached disaster into the most beautiful balayage I&apos;ve ever had. She was honest about timeline (3 visits to get there safely) and the result looks like I just got back from Italy."' },
  { name: 'Megan T.', city: 'Cache', rating: 5,
    text: '"Emma did my wedding hair and trial — flawless both times. She showed up at the venue with everything she needed, kept my bridesmaids calm, and stayed an extra hour for touch-ups. Worth every penny."' },
  { name: 'Tasha R.', city: 'Elgin', rating: 5,
    text: '"Jada is the first stylist in 15 years who actually knows how to cut my curl pattern. She taught me how to style it at home too. Drive 45 min each way and would do it twice as far."' },
];

const FAQS = [
  { q: 'Do you take walk-ins?',                                      a: 'We&apos;re primarily appointment-based to give every guest a calm, unhurried experience. However, we do save 1–2 chairs daily for last-minute bookings — call us and we&apos;ll squeeze you in if we can.' },
  { q: 'How much does color cost?',                                  a: 'Single-process color starts at $95. Partial highlights from $145. Full balayage from $225. Every appointment includes a complimentary consultation, deep conditioning treatment, and gloss. No surprise add-on fees.' },
  { q: 'Do you do men&apos;s cuts?',                                 a: 'Yes — Marcus is our master men&apos;s stylist. Precision cuts, beard trims, gentleman&apos;s styling. $45 for a cut, $65 with style and beard work.' },
  { q: 'How far in advance should I book?',                          a: 'Weekdays usually have same-week openings. Saturdays book 2-3 weeks out. For weddings and big color projects, plan 4-6 weeks ahead. Our online booking shows real-time availability.' },
  { q: 'Do you do extensions?',                                      a: 'Yes — hand-tied wefts, tape-ins, and keratin fusion. We&apos;re certified in NBR (Natural Beaded Rows) and Bellami extensions. Full install in 2 hours, maintenance every 6-8 weeks.' },
  { q: 'What products do you use?',                                  a: 'We&apos;re an Aveda concept salon for haircare, Goldwell for color, and offer Olaplex and K18 for bond repair. All products available for purchase, and we&apos;ll recommend a personalized at-home routine.' },
  { q: 'Do you offer bridal packages?',                              a: 'Yes — bridal trials, day-of styling for the bride, and group packages for bridesmaids. We come to you for getting-ready (within 30 miles) or you can take over our salon. Contact Emma for pricing.' },
];

export default function SalonsTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeStylist, setActiveStylist] = useState(0);
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

      {/* Sticky header */}
      <header className={`sticky top-[36px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})`, boxShadow: `0 0 14px ${BIZ.plum}33` }}>
              <Scissors className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-stone-900 text-base sm:text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
              <p className="text-[10px] text-stone-500 hidden sm:block italic">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            <a href="#services" className="hover:text-purple-700 transition-colors">Services</a>
            <a href="#stylists" className="hover:text-purple-700 transition-colors">Stylists</a>
            <a href="#why" className="hover:text-purple-700 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-purple-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-purple-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-purple-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.plum }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.plum}, ${BIZ.plumDeep})`, boxShadow: `0 4px 14px ${BIZ.plum}66` }}>
              <Calendar className="w-4 h-4"/> Book Now
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.cream} 0%, #f3e8ff 50%, ${BIZ.cream} 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.rose}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.plum}30, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.plum}10`, border: `1px solid ${BIZ.plum}30`, color: BIZ.plumDeep }}>
              <Sparkles className="w-3 h-3"/>
              Aveda Concept Salon · Goldwell Certified
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight"
              style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
              Your Best Hair.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Crafted by Hand.
              </span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-stone-600 max-w-xl mb-8 leading-relaxed">
              Bespoke color, hand-crafted cuts, and modern wellness in a calm Lawton salon. {BIZ.yearsServing} years and {BIZ.clients} clients of expert, education-first hairdressing.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.plum}, ${BIZ.plumDeep})`, boxShadow: `0 8px 30px ${BIZ.plum}66` }}>
                <Calendar className="w-5 h-5"/> Book Online
              </a>
              <a href={`tel:${BIZ.phoneRaw}`}
                className="font-bold px-7 py-4 rounded-full border-2 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ borderColor: BIZ.plum, color: BIZ.plumDeep }}>
                <Phone className="w-5 h-5"/> Call {BIZ.phone}
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-stone-900">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><Award className="w-4 h-4 text-purple-700"/> Aveda Concept</span>
              <span className="inline-flex items-center gap-1.5"><Heart className="w-4 h-4 text-purple-700"/> Free Consultation</span>
            </motion.div>
          </div>

          {/* Right: stylist booking mockup */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Look book" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-44"
                style={{ boxShadow: `0 20px 60px ${BIZ.plum}25` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Palette className="w-5 h-5" style={{ color: BIZ.rose }}/>
                  <span className="text-xs font-bold text-stone-600">LOOK SAVED</span>
                </div>
                <p className="text-xs text-stone-700 font-bold">Bronde Balayage</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Shared with Olivia · 3hr appt</p>
              </motion.div>

              {/* Floating "Loyalty" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: `0 20px 60px ${BIZ.rose}40` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Heart className="w-5 h-5" style={{ color: BIZ.rose }}/>
                  <span className="text-xs font-bold text-stone-800">VIP Member</span>
                </div>
                <p className="text-[10px] text-stone-500">$25 off next color · 7 visits</p>
              </motion.div>

              {/* Main stylist booking card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl"
                style={{ boxShadow: `0 30px 80px ${BIZ.plum}30` }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Pick Your Stylist</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: BIZ.plum }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.rose }}/>
                    OPEN
                  </span>
                </div>

                {/* Stylist grid */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {STYLISTS.map((s, i) => {
                    const isActive = i === activeStylist;
                    return (
                      <motion.div key={s.name}
                        whileHover={{ scale:1.03 }}
                        animate={{ scale: isActive ? 1.05 : 1, opacity: isActive ? 1 : 0.7 }}
                        onMouseEnter={() => setActiveStylist(i)}
                        className="rounded-xl p-3 cursor-pointer"
                        style={{
                          background: isActive ? `${s.accent}10` : '#fafaf9',
                          border: `1.5px solid ${isActive ? s.accent : 'transparent'}`,
                        }}>
                        <div className="w-10 h-10 rounded-full mb-2 flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: `linear-gradient(135deg, ${s.accent}, ${BIZ.plumDeep})` }}>
                          {s.initials}
                        </div>
                        <p className="text-xs font-bold" style={{ color: BIZ.plumDeep }}>{s.name}</p>
                        <p className="text-[9px] text-stone-500">{s.role}</p>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Active stylist detail */}
                <motion.div key={activeStylist}
                  initial={{ opacity:0, y:5 }} animate={{ opacity:1, y:0 }}
                  className="bg-stone-50 rounded-xl p-3 mb-4">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-stone-500 mb-1">Specialty</p>
                  <p className="text-xs text-stone-700">{STYLISTS[activeStylist].specialty}</p>
                  <p className="text-[10px] text-stone-500 mt-1">{STYLISTS[activeStylist].yrs} years experience</p>
                </motion.div>

                <a href="#book" className="w-full py-3 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ background: `linear-gradient(135deg, ${BIZ.plum}, ${BIZ.plumDeep})` }}>
                  Book with {STYLISTS[activeStylist].name} <ArrowRight className="w-4 h-4"/>
                </a>
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
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.plum }}>Our Services</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
              Every Service.<br/>Crafted Around You.
            </h2>
            <p className="text-stone-600 text-lg italic">From a quick refresh trim to bridal styling for a full party — we tailor every visit to your hair, your goals, your day.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.title}
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.07 }}
                  whileHover={{ y:-6 }}
                  className="group bg-white rounded-3xl p-7 cursor-pointer transition-all"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.04)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}15`, color: s.color }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.plum }}>
                    Book this <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STYLIST ROSTER — unique to salons */}
      <section id="stylists" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.rose }}>Meet the Team</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
              Stylists Who Specialize.
            </h2>
            <p className="text-stone-600 text-lg italic">Pick the artist who matches your hair, your goals, and your vibe. Every stylist trains 40+ hours a year — we&apos;re obsessed with the craft.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STYLISTS.map((s, i) => (
              <motion.div key={s.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.08 }}
                whileHover={{ y:-6 }}
                className="rounded-3xl overflow-hidden cursor-pointer"
                style={{ background: `linear-gradient(180deg, ${s.accent}15, white)`, border: `1px solid ${s.accent}30` }}>
                {/* Avatar block */}
                <div className="aspect-[4/5] relative flex items-end justify-center p-6"
                  style={{ background: `linear-gradient(135deg, ${s.accent}40, ${s.accent}10)` }}>
                  <div className="w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-2xl"
                    style={{ background: `linear-gradient(135deg, ${s.accent}, ${BIZ.plumDeep})`, fontFamily: '"Playfair Display", serif' }}>
                    {s.initials}
                  </div>
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2.5 py-1 text-[10px] font-bold flex items-center gap-1"
                    style={{ color: s.accent }}>
                    <Award className="w-3 h-3"/>
                    {s.yrs} yrs
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold mb-1" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>{s.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: s.accent }}>{s.role}</p>
                  <p className="text-stone-600 text-sm leading-relaxed">{s.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.plum }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years.<br/>Real Relationships.<br/>Beautiful Hair.
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6 italic">
              We opened Velvet &amp; Vine in {BIZ.established} on a simple belief: great hair doesn&apos;t happen in a rush. So we built a salon where every guest gets unhurried attention from an expert stylist who knows their hair history.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              No chair-swap chaos. No upsell pressure. No mystery prices. Just expert hairdressing, calm environment, and stylists who remember your name, your kids&apos; names, and how you take your iced latte.
            </p>
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-full hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.plum}, ${BIZ.plumDeep})`, boxShadow: `0 8px 30px ${BIZ.plum}50` }}>
              Book Your First Visit <ArrowRight className="w-5 h-5"/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08 }}
                  className="bg-white rounded-3xl p-6"
                  style={{ boxShadow: '0 1px 3px rgba(88,28,135,0.05), 0 0 0 1px rgba(88,28,135,0.05)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${BIZ.rose}25`, color: BIZ.roseDeep }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{w.desc}</p>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.plum }}>Real Clients</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Clients
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
                style={{ background: BIZ.cream, border: `1px solid ${BIZ.plum}15` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-stone-700 leading-relaxed mb-5 text-sm italic">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.plum}15` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.plumDeep }}>{r.name}</p>
                    <p className="text-xs text-stone-500">{r.city}, OK · Verified Google</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK FORM */}
      <section id="book" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.plum} 0%, ${BIZ.plumDeep} 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.rose }}>Reserve Your Seat</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Book Your Stylist<br/>in 60 Seconds.
              </h2>
              <p className="text-purple-100 text-lg mb-6 italic">
                Pick your service, pick your stylist, pick your time. We&apos;ll confirm by text and send a reminder day-of.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Real-time availability calendar' },
                  { icon: MessageCircle,text: 'Text confirmation + reminder' },
                  { icon: Heart,        text: 'Free 15-min consult for first-time guests' },
                  { icon: Award,        text: 'No deposit · Easy reschedule' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-purple-100">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.rose }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your booking system!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Service</label>
                <select className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all">
                  <option>Cut &amp; style</option>
                  <option>Single-process color</option>
                  <option>Highlights / balayage</option>
                  <option>Color correction</option>
                  <option>Extensions consult</option>
                  <option>Bridal trial</option>
                  <option>Free consultation</option>
                  <option>Other / not sure</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Preferred Stylist</label>
                <select className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all">
                  <option>No preference — first available</option>
                  {STYLISTS.map(s => <option key={s.name}>{s.name} — {s.role}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})`, boxShadow: `0 8px 30px ${BIZ.plum}66` }}>
                <Calendar className="w-5 h-5"/> Request Appointment
              </button>
              <p className="text-center text-xs text-stone-500">No deposit · Easy reschedule</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.plum }}>Clients From</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
            Southwest Oklahoma&apos;s Salon Destination
          </h2>
          <p className="text-stone-600 mb-10 italic">Clients drive in from across the region.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.cream, color: BIZ.plumDeep, borderColor: `${BIZ.plum}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.plum }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.plum }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.plumDeep, fontFamily: '"Playfair Display", serif' }}>
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
                    background: isOpen ? BIZ.cream : 'white',
                    borderColor: isOpen ? `${BIZ.plum}40` : '#e7e5e4',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.plumDeep }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.plum }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.plum} 0%, ${BIZ.plumDeep} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.rose}50, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Ready for Your<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.cream})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Best Hair Yet?
            </span>
          </h2>
          <p className="text-purple-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 italic">
            Pick your stylist, pick your service, pick your time. We&apos;ll handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: 'white', color: BIZ.plumDeep, boxShadow: `0 8px 30px ${BIZ.rose}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#book"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <Calendar className="w-5 h-5"/> Book Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-purple-100/80 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/> Aveda Concept Salon</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-stone-300" style={{ background: BIZ.plumDeep }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})` }}>
                <Scissors className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed mb-4 italic">{BIZ.tagline}. {BIZ.yearsServing} years of expert hairdressing in Lawton.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.rose }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.rose }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.rose }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.rose }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Clients From</p>
            <p className="text-sm text-stone-300 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-purple-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-400">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>Aveda Concept Salon · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.rose}, ${BIZ.plum})`, boxShadow: `0 8px 30px ${BIZ.plum}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
