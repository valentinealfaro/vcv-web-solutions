'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, BadgeCheck, Star, MessageCircle, ShieldCheck,
  Heart, Award, Activity, Droplet, Zap, Wand2, Leaf, Stethoscope,
} from 'lucide-react';

const BIZ = {
  name:        'Aura Med Spa & Wellness',
  tagline:     'Physician-Led · Modern Aesthetics · Whole-Body Wellness',
  doctor:      'Dr. Mira Patel, MD',
  phone:       '(580) 555-0912',
  phoneRaw:    '5805550912',
  email:       'hello@auramedspa.com',
  address:     '618 NW Cherry St, Lawton, OK 73501',
  hours:       'Tue–Sat · 9am–7pm · Sun by appointment · Mon closed',
  established: 2018,
  yearsServing: new Date().getFullYear() - 2018,
  clients:     '5,200+',
  responseHr:  'Same day',
  rating:      4.9,
  reviewCount: 384,
  license:     'OK Medical License #MD-39214',
  insurance:   'Physician-supervised · CareCredit accepted',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Medicine Park','Duncan','Chickasha','Walters'],
  /* Serene wellness palette — lavender + sage + bone */
  lavender:    '#c4b5fd',
  lavenderDeep:'#7c3aed',
  sage:        '#84cc16',
  sageDeep:    '#4d7c0f',
  bone:        '#fefce8',
  paper:       '#fafaf9',
  ink:         '#1e1b4b',
};

const TREATMENTS = [
  { name:'Botox & Dysport',         price:'$13/unit', duration:'15 min', desc:'Smooth fine lines, prevent new wrinkles',         color:'#c4b5fd' },
  { name:'Dermal Fillers',          price:'$595+',    duration:'45 min', desc:'Restore volume, sculpt cheeks, lips, jawline',  color:'#a78bfa' },
  { name:'Hydrafacial',             price:'$185',     duration:'60 min', desc:'Cleanse, exfoliate, hydrate. Instant glow.',     color:'#84cc16' },
  { name:'Laser Hair Removal',      price:'$129/area',duration:'30 min', desc:'Permanent reduction. 6-session package available.', color:'#0ea5e9' },
  { name:'Microneedling + PRP',     price:'$425',     duration:'90 min', desc:'Stimulate collagen with your own platelets',   color:'#e11d48' },
  { name:'IV Hydration Therapy',    price:'$125+',    duration:'45 min', desc:'Hangover, immunity, beauty, energy blends',      color:'#06b6d4' },
];

const SERVICES = [
  { icon: Sparkles, title: 'Injectables', desc: 'Botox, Dysport, Restylane, Juvederm. Done by RN injectors trained personally by Dr. Patel.', color:'#c4b5fd' },
  { icon: Droplet,  title: 'Medical Facials',     desc: 'Hydrafacial, chemical peels, dermaplaning, custom medical-grade skincare protocols.',  color:'#84cc16' },
  { icon: Zap,      title: 'Laser Treatments',    desc: 'Hair removal, IPL photofacial, laser skin resurfacing. FDA-cleared devices only.',     color:'#0ea5e9' },
  { icon: Activity, title: 'Body Sculpting',      desc: 'Emsculpt, CoolSculpting, Morpheus8. Non-invasive fat reduction and skin tightening.',  color:'#e11d48' },
  { icon: Leaf,     title: 'IV &amp; Wellness',    desc: 'Custom IV blends, B12 shots, NAD+ therapy. Restore from the inside out.',              color:'#06b6d4' },
  { icon: Wand2,    title: 'Hormone Therapy',     desc: 'Bioidentical hormone optimization for women and men. Labs and follow-up included.',    color:'#7c3aed' },
];

const WHY = [
  { icon: Stethoscope, title: 'Physician-Led',          desc: `${BIZ.doctor} is a board-certified physician personally supervising every treatment plan. Not a med spa run by aestheticians.` },
  { icon: BadgeCheck,  title: 'FDA-Cleared Tech Only',  desc: 'We invest in the best — Allergan products, FDA-cleared devices, medical-grade skincare. No knockoffs, no shortcuts.' },
  { icon: Heart,       title: 'No-Pressure Consults',   desc: 'Free 30-min consultation with the doctor or RN. We&apos;ll tell you what you DON&apos;T need — not just what we can sell you.' },
  { icon: Award,       title: 'Subtle, Natural Results',desc: 'We aim for &ldquo;you look refreshed&rdquo; not &ldquo;you got work done.&rdquo; Conservative dosing, natural-looking outcomes, real artistry.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Open',         suffix: '' },
  { value: BIZ.clients,                 label: 'Clients Treated',    suffix: '' },
  { value: BIZ.responseHr,              label: 'Consult Booking',    suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',      suffix: '★' },
];

const REVIEWS = [
  { name: 'Jessica L.', city: 'Lawton', rating: 5,
    text: '"Dr. Patel actually talked me OUT of fillers and into a Hydrafacial series first. Six months later my skin looks better than it has in a decade — and I didn&apos;t spend $1,500 on injectables I didn&apos;t need. Honest providers are rare."' },
  { name: 'Brooke H.', city: 'Cache', rating: 5,
    text: '"Started Botox here at 32 (preventative). Three years later, no forehead lines and people think I&apos;m 25. Subtle, natural, and the RN actually listens to what you want. Never going anywhere else."' },
  { name: 'Carlos M.', city: 'Elgin', rating: 5,
    text: '"Got testosterone optimization through Aura. Doctor reviewed my labs, explained every level, and adjusted my protocol twice based on follow-up bloodwork. I feel 10 years younger. They actually practice MEDICINE here."' },
];

const FAQS = [
  { q: 'Is the doctor really involved, or just a name on the wall?',  a: `${BIZ.doctor} personally consults on every initial treatment plan, reviews every lab, and supervises every injector. Our RNs are excellent — but the medicine is overseen by a board-certified physician. Not all med spas operate this way.` },
  { q: 'How much does Botox cost?',                                   a: 'Botox is $13/unit and Dysport is $11/unit. Most foreheads take 15-25 units, and most patients spend $200-400 per treatment. Treatments last 3-4 months. We offer membership discounts for regular clients.' },
  { q: 'Are consultations really free?',                              a: 'Yes — 30 minutes with an RN or Dr. Patel, completely free, no obligation. We&apos;ll review your goals, take photos, recommend a realistic plan, and quote everything in writing before you commit to anything.' },
  { q: 'How long does recovery take?',                                a: 'Most treatments are no-downtime: Botox, Hydrafacial, IV therapy, laser hair removal. Microneedling and lasers may cause 24-48 hours of redness. We&apos;ll tell you exactly what to expect before booking.' },
  { q: 'Do you offer financing?',                                     a: 'Yes — CareCredit (0% APR for 6, 12, 18, or 24 months on approved credit). Soft credit pull, approval in 60 seconds. Most clients use it for body sculpting and laser packages.' },
  { q: 'Are results guaranteed?',                                     a: 'For injectables, we offer free touch-ups within 2 weeks if needed. For series treatments (laser, peels), we provide realistic expectations upfront. If a treatment fails to perform as expected medically, we&apos;ll work with you.' },
  { q: 'Is your equipment FDA cleared?',                              a: 'Yes — every device in our spa is FDA-cleared. We use Allergan products (Botox, Juvederm), Galderma (Restylane, Dysport), Sciton lasers, BTL Emsculpt. No off-brand fillers, no overseas product. Ever.' },
];

export default function MedSpasTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeTreatment, setActiveTreatment] = useState(0);
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

      {/* Sticky header */}
      <header className={`sticky top-[36px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.lavender}, ${BIZ.lavenderDeep})`, boxShadow: `0 0 14px ${BIZ.lavenderDeep}33` }}>
              <Sparkles className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-slate-900 text-base sm:text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
              <p className="text-[10px] text-slate-500 hidden sm:block italic">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <a href="#services" className="hover:text-violet-700 transition-colors">Services</a>
            <a href="#treatments" className="hover:text-violet-700 transition-colors">Treatments</a>
            <a href="#why" className="hover:text-violet-700 transition-colors">Why Us</a>
            <a href="#reviews" className="hover:text-violet-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-violet-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-violet-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.lavenderDeep }}/>
              {BIZ.phone}
            </a>
            <a href="#book"
              className="text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)`, boxShadow: `0 4px 14px ${BIZ.lavenderDeep}66` }}>
              <Calendar className="w-4 h-4"/> Free Consult
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.bone} 0%, #faf5ff 50%, #f0fdf4 100%)` }}>
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.lavender}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute -bottom-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.sage}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.lavender}25`, border: `1px solid ${BIZ.lavenderDeep}40`, color: BIZ.lavenderDeep }}>
              <Stethoscope className="w-3 h-3"/>
              Physician-Led · {BIZ.doctor}
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Look Refreshed.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, ${BIZ.sageDeep})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Feel Renewed.
              </span><br/>
              <span className="text-3xl sm:text-4xl lg:text-5xl text-slate-500 italic font-normal">Naturally.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-slate-600 max-w-xl mb-8 leading-relaxed">
              Physician-led aesthetics and wellness in a calm, modern spa. {BIZ.yearsServing} years and {BIZ.clients} happy clients of subtle, natural-looking results.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#book"
                className="text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)`, boxShadow: `0 8px 30px ${BIZ.lavenderDeep}50` }}>
                <Calendar className="w-5 h-5"/> Book Free Consult
              </a>
              <a href="#treatments"
                className="font-bold px-7 py-4 rounded-full border-2 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ borderColor: BIZ.lavenderDeep, color: BIZ.lavenderDeep }}>
                <Sparkles className="w-5 h-5"/> See Treatments
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
              <span className="inline-flex items-center gap-1.5"><BadgeCheck className="w-4 h-4 text-violet-700"/> Board-Certified MD</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-violet-700"/> FDA-Cleared Devices</span>
            </motion.div>
          </div>

          {/* Right: treatment menu glass card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating "Before/After" card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: `0 20px 60px ${BIZ.lavenderDeep}25` }}>
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-5 h-5" style={{ color: BIZ.lavenderDeep }}/>
                  <span className="text-xs font-bold text-slate-600">RESULTS</span>
                </div>
                <div className="flex gap-1.5 mb-1">
                  <div className="flex-1 h-12 rounded-lg" style={{ background: `linear-gradient(135deg, ${BIZ.lavender}, ${BIZ.sage})` }}/>
                  <div className="flex-1 h-12 rounded-lg" style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, ${BIZ.sageDeep})` }}/>
                </div>
                <p className="text-[10px] text-slate-500 text-center">Before · After · 6 sessions</p>
              </motion.div>

              {/* Floating "Membership" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-52"
                style={{ boxShadow: `0 20px 60px ${BIZ.sage}40` }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <Heart className="w-5 h-5" style={{ color: BIZ.sageDeep }}/>
                  <span className="text-xs font-bold text-slate-800">VIP Membership</span>
                </div>
                <p className="text-[10px] text-slate-500">$99/mo · Save 15% on every visit</p>
              </motion.div>

              {/* Main treatment menu card */}
              <div className="rounded-3xl p-6 shadow-2xl backdrop-blur"
                style={{ background: 'rgba(255,255,255,0.85)', boxShadow: `0 30px 80px ${BIZ.lavenderDeep}25`, border: `1px solid ${BIZ.lavender}40` }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Today&apos;s Menu</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: BIZ.sageDeep }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.sage }}/>
                    BOOKING
                  </span>
                </div>

                <p className="text-xl font-bold mb-4" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>Featured Treatments</p>

                {/* Treatment list */}
                <div className="space-y-2 mb-4">
                  {TREATMENTS.slice(0,4).map((t, i) => {
                    const isActive = i === activeTreatment;
                    return (
                      <motion.div key={t.name}
                        whileHover={{ x:4 }}
                        onMouseEnter={() => setActiveTreatment(i)}
                        animate={{ scale: isActive ? 1.02 : 1 }}
                        className="rounded-xl p-3 cursor-pointer"
                        style={{
                          background: isActive ? `${t.color}15` : '#fafaf9',
                          border: `1px solid ${isActive ? t.color + '50' : 'transparent'}`,
                        }}>
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold" style={{ color: BIZ.ink }}>{t.name}</p>
                          <p className="text-sm font-black tabular-nums" style={{ color: t.color }}>{t.price}</p>
                        </div>
                        <p className="text-[10px] text-slate-500">{t.duration} · {t.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <a href="#book" className="w-full py-3 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)` }}>
                  Book Your Consult <ArrowRight className="w-4 h-4"/>
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST METRICS */}
      <section className="py-12 bg-white border-y border-violet-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {METRICS.map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i*0.08 }}
              className="text-center">
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.lavenderDeep, fontFamily: '"Playfair Display", serif' }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lavenderDeep }}>Our Services</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Aesthetic + Wellness.<br/>Under One Doctor.
            </h2>
            <p className="text-slate-600 text-lg italic">From the subtlest preventative Botox to full-body wellness — we treat the whole you, not just your skin.</p>
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
                  style={{ boxShadow: '0 1px 3px rgba(124,58,237,0.05), 0 0 0 1px rgba(124,58,237,0.05)' }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${s.color}20`, color: s.color }}>
                    <Icon className="w-7 h-7"/>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.lavenderDeep }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TREATMENT MENU — unique to med spas */}
      <section id="treatments" className="py-20 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.sageDeep }}>Treatment Menu</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Transparent Pricing.<br/>No Surprises.
            </h2>
            <p className="text-slate-600 text-lg italic">Most med spas hide prices until you&apos;re in the chair. We post them up front — because trust starts with transparency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TREATMENTS.map((t, i) => (
              <motion.div key={t.name}
                initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i*0.06 }}
                whileHover={{ y:-4 }}
                className="rounded-3xl p-6 cursor-pointer"
                style={{ background: `linear-gradient(135deg, ${t.color}10, white)`, border: `1px solid ${t.color}30` }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold mb-1" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>{t.name}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t.duration}</p>
                  </div>
                  <p className="text-2xl font-black tabular-nums" style={{ color: t.color }}>{t.price}</p>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center mt-10 text-slate-500">
            <a href="#book" className="font-bold hover:underline" style={{ color: BIZ.lavenderDeep }}>See full treatment menu →</a> · Free 30-min consult to plan your custom protocol
          </p>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="py-20 sm:py-24" style={{ background: BIZ.bone }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lavenderDeep }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
              Medicine First.<br/>Marketing Second.
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-6 italic">
              Dr. Patel opened Aura in {BIZ.established} after watching too many med spas chase trends with under-trained staff. We do the opposite: physician oversight, conservative dosing, FDA-cleared equipment, and the rare luxury of saying &ldquo;you don&apos;t actually need that.&rdquo;
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              The result? {BIZ.clients} clients who trust us, {BIZ.reviewCount} 5-star reviews, and a steady stream of physician colleagues sending their own families here. That&apos;s the highest compliment we can earn.
            </p>
            <a href="#book"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-full hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)`, boxShadow: `0 8px 30px ${BIZ.lavenderDeep}50` }}>
              Book Your Free Consultation <ArrowRight className="w-5 h-5"/>
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
                  style={{ boxShadow: '0 1px 3px rgba(124,58,237,0.05)' }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: `${BIZ.lavender}25`, color: BIZ.lavenderDeep }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lavenderDeep }}>Real Clients</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
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
                style={{ background: BIZ.bone, border: `1px solid ${BIZ.lavender}30` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-slate-700 leading-relaxed mb-5 text-sm italic">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.lavender}25` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, ${BIZ.sageDeep})` }}>
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
      <section id="book" className="py-20 sm:py-24" style={{ background: BIZ.bone }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep} 0%, #5b21b6 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.sage }}>Free Consultation</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Tell Us Your Goals.<br/>We&apos;ll Build a Plan.
              </h2>
              <p className="text-purple-100 text-lg mb-6 italic">
                30 minutes with an RN or Dr. Patel. Completely free. No commitment, no high-pressure sales pitch — just an honest plan.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Calendar,     text: 'Same-week availability' },
                  { icon: MessageCircle,text: 'Text confirmation within 1 hour' },
                  { icon: ShieldCheck,  text: 'HIPAA-secure intake forms' },
                  { icon: Heart,        text: 'No pressure · No hidden fees' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-purple-100">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.sage }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your booking system!'); }}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">What interests you?</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all">
                  <option>Botox / Dysport (preventative or treatment)</option>
                  <option>Dermal fillers (lips, cheeks, jawline)</option>
                  <option>Hydrafacial / medical facials</option>
                  <option>Laser hair removal</option>
                  <option>Body sculpting (Emsculpt, CoolSculpting)</option>
                  <option>IV hydration / wellness</option>
                  <option>Hormone optimization</option>
                  <option>Not sure — recommend a plan</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Goal</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all">
                  <option>Anti-aging (prevent or reverse)</option>
                  <option>Improve skin texture / tone</option>
                  <option>Lose stubborn fat / tighten skin</option>
                  <option>Feel more energetic / balanced</option>
                  <option>Special event / wedding prep</option>
                  <option>General wellness optimization</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all"/>
                </div>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)`, boxShadow: `0 8px 30px ${BIZ.lavenderDeep}66` }}>
                <Calendar className="w-5 h-5"/> Book Free Consultation
              </button>
              <p className="text-center text-xs text-slate-500">HIPAA-secure · We never share your info</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lavenderDeep }}>Clients From</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
            Southwest Oklahoma&apos;s Wellness Destination
          </h2>
          <p className="text-slate-600 mb-10 italic">Clients drive in from across the region for our doctor-led care.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.bone, color: BIZ.ink, borderColor: `${BIZ.lavenderDeep}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.lavenderDeep }}/>
                {city}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24" style={{ background: BIZ.bone }}>
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.lavenderDeep }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.ink, fontFamily: '"Playfair Display", serif' }}>
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
                    background: isOpen ? '#faf5ff' : 'white',
                    borderColor: isOpen ? `${BIZ.lavenderDeep}40` : '#e2e8f0',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.ink }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.lavenderDeep }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep} 0%, #5b21b6 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.sage}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
            The Best Version<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.lavender}, ${BIZ.sage})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              of You Awaits.
            </span>
          </h2>
          <p className="text-purple-100 text-lg sm:text-xl max-w-2xl mx-auto mb-10 italic">
            Free 30-minute consultation with a physician-led team. Real medicine, subtle results, zero pressure.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: 'white', color: BIZ.lavenderDeep, boxShadow: `0 8px 30px ${BIZ.sage}66` }}>
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
            <span className="inline-flex items-center gap-1.5"><Stethoscope className="w-3.5 h-3.5"/> {BIZ.doctor}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5"/> FDA-Cleared</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-slate-300" style={{ background: BIZ.ink }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.lavender}, ${BIZ.lavenderDeep})` }}>
                <Sparkles className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4 italic">{BIZ.tagline}. {BIZ.yearsServing} years of physician-led care. {BIZ.doctor}.</p>
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
              <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lavender }}/><a href={`tel:${BIZ.phoneRaw}`} className="hover:text-white transition-colors">{BIZ.phone}</a></li>
              <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lavender }}/><a href={`mailto:${BIZ.email}`} className="hover:text-white transition-colors">{BIZ.email}</a></li>
              <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lavender }}/><span>{BIZ.address}</span></li>
              <li className="flex items-start gap-2"><Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BIZ.lavender }}/><span>{BIZ.hours}</span></li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Clients From</p>
            <p className="text-sm text-slate-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-violet-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>{BIZ.doctor} · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.lavenderDeep}, #5b21b6)`, boxShadow: `0 8px 30px ${BIZ.lavenderDeep}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
