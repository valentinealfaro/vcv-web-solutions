'use client';
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Clock, ChevronDown, Calendar, Check,
  Sparkles, ArrowRight, Star, MessageCircle, ShieldCheck,
  Utensils, Coffee, Wine, ChefHat, Users, Heart, Award, CalendarDays,
} from 'lucide-react';

const BIZ = {
  name:        'Olive & Smoke',
  tagline:     'Wood-Fired Italian · Crafted Daily',
  phone:       '(580) 555-0789',
  phoneRaw:    '5805550789',
  email:       'reserve@oliveandsmoke.com',
  address:     '218 Cache Rd, Lawton, OK 73501',
  hours:       'Tue–Sat · 5pm–10pm · Sun 4pm–9pm · Mon Closed',
  established: 2017,
  yearsServing: new Date().getFullYear() - 2017,
  guests:      '94,000+',
  responseHr:  'Same day',
  rating:      4.8,
  reviewCount: 1247,
  chef:        'Chef Marco Vitale',
  areas: ['Lawton','Cache','Elgin','Fletcher','Apache','Walters','Geronimo','Medicine Park','Duncan'],
  /* Hospitality palette — warm dark + bold red + cream */
  espresso:'#1c1917',
  red:     '#b91c1c',
  redDeep: '#7f1d1d',
  cream:   '#fef3c7',
  paper:   '#fef7ed',
  gold:    '#ca8a04',
};

const MENU_HIGHLIGHTS = [
  { name: 'Wood-Fired Margherita',   price: '$18', desc: 'San Marzano, fresh mozzarella, basil from our garden',          color:'#dc2626' },
  { name: 'Bone Marrow Bruschetta',  price: '$16', desc: 'Roasted bone marrow, sea salt, grilled levain',                 color:'#a16207' },
  { name: 'Lamb Pappardelle',        price: '$28', desc: 'Slow-braised lamb shoulder, hand-cut pasta, pecorino',         color:'#7c3aed' },
  { name: 'Olive Oil Tiramisu',      price: '$12', desc: 'House mascarpone, espresso, citrus olive oil drizzle',         color:'#f59e0b' },
];

const SERVICES = [
  { icon: Utensils,  title: 'Dine-In',          desc: 'Reservations recommended Tue-Sat. Walk-ins welcome at the bar.',         color: '#dc2626' },
  { icon: ChefHat,   title: 'Private Events',   desc: 'Buyouts, birthdays, rehearsal dinners. Up to 80 guests in the loft.',   color: '#7c3aed' },
  { icon: Wine,      title: 'Wine Pairings',    desc: 'Sommelier-curated 5-course tastings every Wednesday at 7pm.',           color: '#a21caf' },
  { icon: Coffee,    title: 'Catering',         desc: 'Weddings, corporate, family-style. Custom menus from 20–250 guests.',    color: '#ea580c' },
  { icon: Heart,     title: 'Date Night Menu',  desc: '3-course prix fixe for two · $79 · Friday and Saturday only.',          color: '#e11d48' },
  { icon: Calendar,  title: 'Cooking Classes',  desc: 'Pasta-making and pizza-stretching classes monthly · $89/person.',       color: '#14b8a6' },
];

const WHY = [
  { icon: ChefHat,    title: 'Italy-Trained Chef',     desc: `${BIZ.chef} trained in Bologna and Florence. Every dish has a story — ask your server.` },
  { icon: Users,      title: 'Family-Owned · 7 Years', desc: 'Same family in the kitchen since day one. We greet you. We cook your food. We mean it.' },
  { icon: Heart,      title: 'Garden to Table',        desc: 'Tomatoes, basil, oregano, and arugula from our backyard garden. Picked the morning of.' },
  { icon: Award,      title: 'Best of Lawton 2023',    desc: 'Voted "Best Italian" by Lawton Constitution readers. 4.8 stars across 1,200+ reviews.' },
];

const METRICS = [
  { value: BIZ.yearsServing.toString(), label: 'Years Serving',      suffix: '' },
  { value: BIZ.guests,                  label: 'Happy Guests',       suffix: '' },
  { value: BIZ.responseHr,              label: 'Reservation Reply',  suffix: '' },
  { value: BIZ.rating.toString(),       label: 'Google Rating',      suffix: '★' },
];

const REVIEWS = [
  { name: 'Jenna M.', city: 'Lawton', rating: 5,
    text: '"Best Italian we&apos;ve had outside Chicago. The bone marrow bruschetta was unreal. Chef came out to ask how we liked it — he genuinely cared. Came back twice this month."' },
  { name: 'Patrick H.', city: 'Cache', rating: 5,
    text: '"Took my parents for their anniversary. Sommelier paired every course, the lamb pappardelle was the best pasta I&apos;ve ever had. Felt like dinner in Italy. Worth every dollar."' },
  { name: 'Sara K.', city: 'Elgin', rating: 5,
    text: '"Did our rehearsal dinner here for 35 people. The team was patient with our changes, the food was incredible, and the loft felt like our private restaurant. Wedding guests are still talking about it."' },
];

const FAQS = [
  { q: 'Do you take reservations?',                                   a: 'Yes, and we strongly recommend them Tue–Sat. We also keep half the bar seats for walk-ins, so you can usually get a seat there within 15 min. Book online or call.' },
  { q: 'Is there a dress code?',                                      a: 'No formal dress code, but most guests dress smart-casual on weekends. Date night and private events tend to skew slightly dressier. Whatever you wear, you&apos;ll fit in.' },
  { q: 'Do you do private events?',                                   a: 'Yes — the loft seats up to 80 guests for buyouts, rehearsal dinners, and corporate events. Custom menus, dedicated bartender, and sound system included. Contact us for pricing.' },
  { q: 'Do you have vegetarian or gluten-free options?',              a: 'Absolutely — about a third of our menu is naturally vegetarian, and we offer GF pasta and pizza crust. Vegan options are available upon request — just ask your server.' },
  { q: 'Do you cater outside the restaurant?',                        a: 'Yes — weddings, corporate lunches, family events, anywhere within 30 miles of Lawton. Custom menus from 20 to 250 guests. Inquire by email or phone.' },
  { q: 'Are kids welcome?',                                            a: 'Yes — kids are welcome any night. We have a kids menu (mac &amp; cheese, mini pizzas, pasta with butter) and high chairs available. Just let us know when booking.' },
  { q: 'Do you offer gift cards?',                                     a: 'Yes — purchase online or at the host stand. Available in any denomination, no expiration date. They make great gifts for birthdays, anniversaries, or "thank yous."' },
];

export default function RestaurantsTemplate() {
  const [openFaq,  setOpenFaq]  = useState<number | null>(0);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState(0);
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

      {/* SCROLLING ANNOUNCEMENT BANNER */}
      <div className="overflow-hidden text-white text-xs font-medium" style={{ background: BIZ.espresso }}>
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="flex items-center gap-10 py-2.5 whitespace-nowrap" style={{ fontFamily: '"Playfair Display", serif' }}>
          {[...Array(2)].flatMap((_, copy) => [
            { icon:'🍷', text:'Date Night Prix Fixe · Fri & Sat · $79 for two' },
            { icon:'🍕', text:'Wood-Fired Pizza Wednesday · Half-Off Bottles' },
            { icon:'🍝', text:'Sommelier Tasting Menu · Wed 7pm · By Reservation' },
            { icon:'🎂', text:'Private Events · Loft Holds 80 · Custom Menus' },
            { icon:'🌿', text:'Garden-to-Table · Picked the Morning Of' },
          ].map((t, i) => (
            <span key={`${copy}-${i}`} className="flex items-center gap-3 italic">
              <span className="text-lg">{t.icon}</span>
              <span style={{ color: BIZ.cream }}>{t.text}</span>
              <span className="text-stone-600">·</span>
            </span>
          )))}
        </motion.div>
      </div>

      {/* Sticky header */}
      <header className={`sticky top-[40px] z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white/95 backdrop-blur py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 0 14px ${BIZ.red}55` }}>
              <Utensils className="w-5 h-5"/>
            </div>
            <div className="leading-tight">
              <p className="font-bold text-stone-900 text-base sm:text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
              <p className="text-[10px] text-stone-500 hidden sm:block italic">{BIZ.tagline}</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-700">
            <a href="#menu" className="hover:text-red-700 transition-colors">Menu</a>
            <a href="#reserve" className="hover:text-red-700 transition-colors">Reserve</a>
            <a href="#events" className="hover:text-red-700 transition-colors">Events</a>
            <a href="#reviews" className="hover:text-red-700 transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-red-700 transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-stone-900 hover:text-red-700 transition-colors">
              <Phone className="w-4 h-4" style={{ color: BIZ.red }}/>
              {BIZ.phone}
            </a>
            <a href="#reserve"
              className="text-white font-bold px-5 py-2.5 rounded-full text-sm flex items-center gap-1.5 hover:scale-105 transition-transform whitespace-nowrap"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 4px 14px ${BIZ.red}66` }}>
              <CalendarDays className="w-4 h-4"/> Reserve
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.espresso} 0%, #292524 50%, ${BIZ.redDeep} 100%)` }}>
        {/* Warm light glows */}
        <motion.div style={{ y: heroY }} className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>
        <motion.div style={{ y: heroY }} className="absolute bottom-0 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none">
          <div className="w-full h-full" style={{ background: `radial-gradient(circle, ${BIZ.red}50, transparent 60%)`, filter: 'blur(80px)' }}/>
        </motion.div>

        {/* Floating utensil/food icons */}
        {['🍷','🌿','🍕','🍝'].map((emoji, i) => {
          const positions = [
            { top:'18%', left:'10%' },
            { top:'68%', left:'18%' },
            { top:'25%', left:'82%' },
            { top:'78%', left:'72%' },
          ];
          return (
            <motion.div key={i}
              animate={{ y:[0,-15,0], rotate:[0,8,0] }}
              transition={{ duration:5+i, repeat:Infinity, ease:'easeInOut', delay:i*0.5 }}
              className="absolute pointer-events-none text-3xl opacity-25"
              style={positions[i]}>
              {emoji}
            </motion.div>
          );
        })}

        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-28 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <div className="lg:col-span-7 text-white">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{ background: `${BIZ.gold}20`, border: `1px solid ${BIZ.gold}60`, color: BIZ.cream }}>
              <Award className="w-3 h-3"/>
              Best of Lawton 2023 · Italian
            </motion.div>

            <motion.h1 initial={{ opacity:0, y:30 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7, delay:0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.95] mb-6 tracking-tight"
              style={{ fontFamily: '"Playfair Display", serif' }}>
              Wood Fire.<br/>
              <span style={{ background: `linear-gradient(135deg, ${BIZ.cream}, ${BIZ.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Garden Herbs.
              </span><br/>
              <span className="italic text-3xl sm:text-4xl lg:text-5xl text-stone-300 font-medium">A Taste of Italy in Lawton.</span>
            </motion.h1>

            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.25 }}
              className="text-lg sm:text-xl text-stone-300 max-w-xl mb-8 leading-relaxed">
              Family-owned, Italy-trained, garden-to-table. {BIZ.yearsServing} years and {BIZ.guests} guests of crafted plates and warm welcomes from {BIZ.chef}.
            </motion.p>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6, delay:0.35 }}
              className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="#reserve"
                className="text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}66` }}>
                <CalendarDays className="w-5 h-5"/> Reserve a Table
              </a>
              <a href="#menu"
                className="bg-white/10 backdrop-blur text-white font-bold px-7 py-4 rounded-full border-2 border-white/30 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors">
                <Utensils className="w-5 h-5"/> See the Menu
              </a>
            </motion.div>

            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.5 }}
              className="flex items-center gap-5 flex-wrap text-xs text-stone-400">
              <span className="inline-flex items-center gap-1.5">
                <div className="flex">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400"/>)}
                </div>
                <strong className="text-white">{BIZ.rating}</strong> · {BIZ.reviewCount} Google reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><ChefHat className="w-4 h-4 text-amber-400"/> {BIZ.chef}</span>
              <span className="inline-flex items-center gap-1.5"><Heart className="w-4 h-4 text-amber-400"/> Garden-to-Table</span>
            </motion.div>
          </div>

          {/* Right: featured menu reservation card */}
          <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ duration:0.8, delay:0.3 }}
            className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Floating reservation card */}
              <motion.div animate={{ y:[0,-10,0] }} transition={{ duration:4, repeat:Infinity, ease:'easeInOut' }}
                className="absolute -top-5 -right-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-48"
                style={{ boxShadow: '0 20px 60px rgba(185,28,28,0.25)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <CalendarDays className="w-5 h-5 text-red-700"/>
                  <span className="text-xs font-bold text-stone-700">CONFIRMED</span>
                </div>
                <p className="text-xs text-stone-700 font-bold">Sat · 7:30 PM · Party of 4</p>
                <p className="text-[10px] text-stone-500 mt-0.5">Window booth · Anniversary noted</p>
              </motion.div>

              {/* Floating "tonight's special" card */}
              <motion.div animate={{ y:[0,8,0] }} transition={{ duration:5, repeat:Infinity, ease:'easeInOut', delay:1 }}
                className="absolute -bottom-3 -left-3 bg-white rounded-2xl shadow-2xl p-4 z-10 w-52"
                style={{ boxShadow: '0 20px 60px rgba(202,138,4,0.3)' }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <ChefHat className="w-5 h-5" style={{ color: BIZ.gold }}/>
                  <span className="text-xs font-bold text-stone-800 italic">Tonight&apos;s Special</span>
                </div>
                <p className="text-xs text-stone-700 font-bold">Black Truffle Risotto</p>
                <p className="text-[10px] text-stone-500">$36 · Limited servings</p>
              </motion.div>

              {/* Main menu card */}
              <div className="bg-white rounded-3xl p-6 shadow-2xl"
                style={{ boxShadow: '0 30px 80px rgba(28,25,23,0.3)' }}>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Tonight&apos;s Menu</span>
                  <span className="text-[10px] font-bold flex items-center gap-1" style={{ color: BIZ.red }}>
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: BIZ.red }}/>
                    OPEN
                  </span>
                </div>

                <p className="text-xl font-bold mb-1" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>Featured Plates</p>
                <p className="text-xs text-stone-500 italic mb-5">Curated by {BIZ.chef}</p>

                {/* Menu list */}
                <div className="space-y-2 mb-5">
                  {MENU_HIGHLIGHTS.map((m, i) => {
                    const isActive = i === activeMenu;
                    return (
                      <motion.div key={m.name}
                        whileHover={{ x:4 }}
                        onMouseEnter={() => setActiveMenu(i)}
                        animate={{ scale: isActive ? 1.02 : 1 }}
                        className="rounded-xl p-3 cursor-pointer"
                        style={{
                          background: isActive ? `${m.color}10` : '#fafaf9',
                          border: `1px solid ${isActive ? m.color + '40' : 'transparent'}`,
                        }}>
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold" style={{ color: BIZ.espresso }}>{m.name}</p>
                          <p className="text-sm font-black tabular-nums" style={{ color: m.color }}>{m.price}</p>
                        </div>
                        <p className="text-[10px] text-stone-500 italic">{m.desc}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <a href="#reserve" className="w-full py-3 rounded-full font-bold text-white text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                  style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})` }}>
                  Reserve Your Table <ArrowRight className="w-4 h-4"/>
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
              <p className="text-4xl sm:text-5xl font-black mb-1" style={{ color: BIZ.red, fontFamily: '"Playfair Display", serif' }}>
                {m.value}{m.suffix}
              </p>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MENU / SERVICES */}
      <section id="menu" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>What We Offer</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>
              More Than a Restaurant.
            </h2>
            <p className="text-stone-600 text-lg italic">Dine in, host your event, learn from our chef, or let us bring Italy to you.</p>
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
                  <h3 className="text-xl font-bold mb-2" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>{s.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">{s.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all" style={{ color: BIZ.red }}>
                    Learn more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform"/>
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="events" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Why {BIZ.name}</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-5 leading-[1.05]" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.yearsServing} Years.<br/>One Family.<br/>One Italy.
            </h2>
            <p className="text-stone-600 text-lg leading-relaxed mb-6 italic">
              {BIZ.chef} grew up in his grandmother&apos;s kitchen in Bologna. After 15 years cooking in Italy and Chicago, he came to Lawton in {BIZ.established} to build the kind of restaurant he&apos;d want to eat at every Sunday.
            </p>
            <p className="text-stone-600 text-lg leading-relaxed mb-8">
              That means: a wood-fired oven hand-built by an Italian mason. Hand-cut pasta every morning. Tomatoes from the garden out back. And the kind of warm welcome that has guests coming back twice a month for {BIZ.yearsServing} years running.
            </p>
            <a href="#reserve"
              className="inline-flex items-center gap-2 text-white font-bold px-7 py-4 rounded-full hover:scale-105 transition-transform"
              style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}50` }}>
              Reserve Your Table <ArrowRight className="w-5 h-5"/>
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY.map((w, i) => {
              const Icon = w.icon;
              return (
                <motion.div key={w.title}
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay: i*0.08 }}
                  className="rounded-3xl p-6"
                  style={{ background: BIZ.paper, border: `1px solid ${BIZ.red}15` }}>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ background: BIZ.espresso, color: BIZ.cream }}>
                    <Icon className="w-6 h-6"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>{w.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DATE NIGHT BANNER */}
      <section className="py-12" style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})` }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-7 h-7"/>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold leading-tight" style={{ fontFamily: '"Playfair Display", serif' }}>Date Night · Friday & Saturday</p>
              <p className="text-white/90 text-sm mt-1 italic">3-course prix fixe for two · $79 · Includes shared dessert</p>
            </div>
          </div>
          <a href="#reserve"
            className="bg-white font-bold px-7 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform whitespace-nowrap text-lg"
            style={{ color: BIZ.redDeep }}>
            <CalendarDays className="w-5 h-5"/> Reserve Now
          </a>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="py-20 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Real Guests</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>
              {BIZ.rating}★ from {BIZ.reviewCount} Diners
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
                style={{ background: BIZ.paper, border: `1px solid ${BIZ.red}15` }}>
                <div className="flex mb-4">
                  {[...Array(r.rating)].map((_,j) => <Star key={j} className="w-5 h-5 fill-yellow-500 text-yellow-500"/>)}
                </div>
                <p className="text-stone-700 leading-relaxed mb-5 text-sm italic">{r.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: `${BIZ.red}15` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})` }}>
                    {r.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: BIZ.espresso }}>{r.name}</p>
                    <p className="text-xs text-stone-500">{r.city}, OK · Verified Google</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RESERVATION FORM */}
      <section id="reserve" className="py-20 sm:py-24" style={{ background: BIZ.paper }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-3xl p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10"
            style={{ background: `linear-gradient(135deg, ${BIZ.espresso} 0%, #292524 100%)` }}>
            <div className="text-white">
              <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.gold }}>Reserve a Table</p>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
                Save Your Spot.<br/>We&apos;ll Save the Wine.
              </h2>
              <p className="text-stone-300 text-lg mb-6 italic">
                Reservations confirmed by text within an hour. Mention any special occasion or dietary need — we love handling them.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: CalendarDays, text: 'Same-day reservations usually available' },
                  { icon: MessageCircle,text: 'Text confirmation within 1 hour' },
                  { icon: Heart,        text: 'Anniversary, birthday? Just tell us — we&apos;ll make it special' },
                  { icon: ShieldCheck,  text: 'Cancel anytime · No deposit required' },
                ].map(item => (
                  <div key={item.text} className="flex items-center gap-2 text-stone-300">
                    <item.icon className="w-4 h-4" style={{ color: BIZ.gold }}/>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <form className="bg-white rounded-3xl p-6 space-y-4 shadow-2xl" onSubmit={e => { e.preventDefault(); alert('Demo only — wire this to your reservation system!'); }}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Date</label>
                  <input type="date"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Time</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all">
                    {['5:00 PM','5:30 PM','6:00 PM','6:30 PM','7:00 PM','7:30 PM','8:00 PM','8:30 PM','9:00 PM'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Party size</label>
                <select className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all">
                  {[1,2,3,4,5,6,7,8,'9+'].map(n => <option key={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Name</label>
                  <input type="text" placeholder="First &amp; last"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all"/>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Phone</label>
                  <input type="tel" placeholder="(555) 123-4567"
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1.5 block">Special occasion or notes (optional)</label>
                <input type="text" placeholder="e.g. anniversary, allergies, window booth"
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-red-700 focus:ring-2 focus:ring-red-100 transition-all"/>
              </div>
              <button type="submit"
                className="w-full text-white font-bold px-7 py-4 rounded-full flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}66` }}>
                <CalendarDays className="w-5 h-5"/> Request Reservation
              </button>
              <p className="text-center text-xs text-stone-500">Confirmed by text · No deposit required</p>
            </form>
          </div>
        </div>
      </section>

      {/* SERVICE AREAS */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>Catering Across</p>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-3" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>
            We&apos;ll Bring Italy to You
          </h2>
          <p className="text-stone-600 mb-10 italic">Catering and private events anywhere in southwest Oklahoma.</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            {BIZ.areas.map(city => (
              <span key={city}
                className="px-5 py-2.5 rounded-full text-sm font-bold border hover:shadow-md transition-all cursor-default"
                style={{ background: BIZ.paper, color: BIZ.espresso, borderColor: `${BIZ.red}30` }}>
                <MapPin className="w-3.5 h-3.5 inline mr-1.5" style={{ color: BIZ.red }}/>
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
            <p className="text-xs font-black uppercase tracking-widest mb-3" style={{ color: BIZ.red }}>FAQ</p>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight" style={{ color: BIZ.espresso, fontFamily: '"Playfair Display", serif' }}>
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
                    background: isOpen ? '#fef3c7' : 'white',
                    borderColor: isOpen ? `${BIZ.red}50` : '#e7e5e4',
                  }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                    <span className="font-bold text-base sm:text-lg pr-2" style={{ color: BIZ.espresso }}>{f.q}</span>
                    <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} style={{ color: BIZ.red }}/>
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
      <section className="py-20 sm:py-24 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${BIZ.espresso} 0%, ${BIZ.redDeep} 100%)` }}>
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${BIZ.gold}40, transparent 60%)`, filter: 'blur(80px)' }}/>

        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-5 leading-[1.05]" style={{ fontFamily: '"Playfair Display", serif' }}>
            Save Your Spot.<br/>
            <span style={{ background: `linear-gradient(135deg, ${BIZ.cream}, ${BIZ.gold})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Bring Your Appetite.
            </span>
          </h2>
          <p className="text-stone-300 text-lg sm:text-xl max-w-2xl mx-auto mb-10 italic">
            Reservations are filling up — most weekends book by Wednesday. Don&apos;t wait.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <a href={`tel:${BIZ.phoneRaw}`}
              className="font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-lg"
              style={{ background: BIZ.cream, color: BIZ.redDeep, boxShadow: `0 8px 30px ${BIZ.gold}66` }}>
              <Phone className="w-5 h-5"/> Call {BIZ.phone}
            </a>
            <a href="#reserve"
              className="bg-white/10 backdrop-blur text-white font-bold px-8 py-4 rounded-full border-2 border-white/30 flex items-center gap-2 hover:bg-white/20 transition-colors text-lg">
              <CalendarDays className="w-5 h-5"/> Reserve Online
            </a>
          </div>
          <div className="flex items-center justify-center gap-5 text-xs text-stone-400 flex-wrap">
            <span className="inline-flex items-center gap-1.5"><Clock className="w-3.5 h-3.5"/> {BIZ.hours}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1.5"><Award className="w-3.5 h-3.5"/> Best of Lawton 2023</span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-14 text-stone-300" style={{ background: '#0c0a09' }}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})` }}>
                <Utensils className="w-5 h-5"/>
              </div>
              <p className="font-bold text-white text-lg" style={{ fontFamily: '"Playfair Display", serif' }}>{BIZ.name}</p>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed mb-4 italic">{BIZ.tagline}. {BIZ.yearsServing} years of warm welcomes from {BIZ.chef}.</p>
          </div>

          <div>
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Visit</p>
            <ul className="space-y-2 text-sm">
              {SERVICES.map(s => <li key={s.title}><a href="#menu" className="hover:text-white transition-colors">{s.title}</a></li>)}
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
            <p className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Catering Areas</p>
            <p className="text-sm text-stone-400 leading-relaxed">{BIZ.areas.join(' · ')}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BIZ.name}. All rights reserved.</p>
          <p>Family-owned · {BIZ.chef} · Since {BIZ.established}</p>
        </div>
      </footer>

      {/* Mobile floating call button */}
      <a href={`tel:${BIZ.phoneRaw}`}
        className="lg:hidden fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl animate-pulse"
        style={{ background: `linear-gradient(135deg, ${BIZ.red}, ${BIZ.redDeep})`, boxShadow: `0 8px 30px ${BIZ.red}99` }}
        aria-label="Call now">
        <Phone className="w-6 h-6 text-white"/>
      </a>
    </div>
  );
}
