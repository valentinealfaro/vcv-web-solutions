'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { TrendingUp } from 'lucide-react';

/* ─── Testimonial data (16 reviews) ──────────────────────── */
interface VCVTestimonial {
  id: string; quote: string; stars: number; stat: string;
  author: { name: string; title: string; avatar?: string; initials?: string };
  company: { name: string; initials: string; color: string; industry: string };
}

const TESTIMONIALS: VCVTestimonial[] = [
  { id:'1',  quote:'We went from 2–3 calls a week to daily inbound leads within a month. The ROI paid for the entire site in week one.', stars:5, stat:'3× More Leads', author:{name:'Jake T.',title:'Owner, Elite Roofing Co.',initials:'JT',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Jake'}, company:{name:'Elite Roofing Co.',initials:'ER',color:'#f97316',industry:'Roofing'} },
  { id:'2',  quote:'The SEO work is what sold me. We\'re ranking on page one for all our target keywords. New customers find us every day without spending on ads.', stars:5, stat:'#1 on Google', author:{name:'Maria S.',title:'Owner, Green Lawn Landscaping',initials:'MS',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Maria'}, company:{name:'Green Lawn Landscaping',initials:'GL',color:'#22c55e',industry:'Landscaping'} },
  { id:'3',  quote:'I was skeptical about the free demo but it completely blew me away. Within 2 weeks the site was live and calls were already coming in.', stars:5, stat:'Live in 5 Days', author:{name:'Dave R.',title:"Owner, Dave's Plumbing",initials:'DR',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Dave'}, company:{name:"Dave's Plumbing",initials:'DP',color:'#3b82f6',industry:'Plumbing'} },
  { id:'4',  quote:'Professional, fast, and they actually care about results — not just making something that looks pretty. My competitors don\'t know what hit them.', stars:5, stat:'4.9★ Review Rate', author:{name:'Lisa M.',title:'Owner, Sparkle Clean Services',initials:'LM',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Lisa'}, company:{name:'Sparkle Clean Services',initials:'SC',color:'#a855f7',industry:'Cleaning'} },
  { id:'5',  quote:'We were burning cash on Facebook ads. VCV built a site that generates organic leads every day. Our cost-per-lead dropped 80% in 60 days.', stars:5, stat:'−80% Cost Per Lead', author:{name:'Chris B.',title:'Owner, AutoFix Repair Shop',initials:'CB',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Chris'}, company:{name:'AutoFix Repair Shop',initials:'AR',color:'#ef4444',industry:'Auto Repair'} },
  { id:'6',  quote:'We picked up 30+ new patients in the first month. The online booking form alone is worth every penny — it books while I sleep.', stars:5, stat:'30+ New Patients/mo', author:{name:'Dr. Sandra K.',title:'Owner, Family Dental Care',initials:'SK',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Sandra'}, company:{name:'Family Dental Care',initials:'FD',color:'#06b6d4',industry:'Dental'} },
  { id:'7',  quote:'After storms, our site handles the surge automatically. We ranked #1 for "emergency tree removal" in our county. Job tickets tripled.', stars:5, stat:'3× Job Tickets', author:{name:'Mike T.',title:'Owner, Texas Tree Service',initials:'MT',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Mike'}, company:{name:'Texas Tree Service',initials:'TT',color:'#84cc16',industry:'Tree Service'} },
  { id:'8',  quote:'My salon went from half-empty to fully booked within 6 weeks of the site going live. My old website was an embarrassment.', stars:5, stat:'Fully Booked', author:{name:'Rachel P.',title:"Owner, Bella's Hair Studio",initials:'RP',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Rachel'}, company:{name:"Bella's Hair Studio",initials:'BH',color:'#ec4899',industry:'Salon'} },
  { id:'9',  quote:'My phone literally doesn\'t stop. I had to hire two more drivers just to keep up. The website is the best employee I\'ve ever had.', stars:5, stat:'Hired 2 More Drivers', author:{name:'Tom W.',title:'Owner, Fast Movers LLC',initials:'TW',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Tom'}, company:{name:'Fast Movers LLC',initials:'FM',color:'#fbbf24',industry:'Moving'} },
  { id:'10', quote:'Within 90 days we stopped taking low-value jobs. The website attracts premium clients who are ready to pay. Best investment ever.', stars:5, stat:'Premium Clients Only', author:{name:'Amy C.',title:'Owner, CoolBreeze HVAC',initials:'AC',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Amy'}, company:{name:'CoolBreeze HVAC',initials:'CB',color:'#38bdf8',industry:'HVAC'} },
  { id:'11', quote:'We had virtually no online presence before VCV. Now we show up for every pest emergency search in our city. Call volume went from zero to booked solid.', stars:5, stat:'Booked Solid', author:{name:'Kevin B.',title:'Owner, Kingdom Pest Control',initials:'KB',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Kevin'}, company:{name:'Kingdom Pest Control',initials:'KP',color:'#65a30d',industry:'Pest Control'} },
  { id:'12', quote:'74% of my bookings now come through the website form. VCV turned my invisible cleaning company into the most visible one in the city.', stars:5, stat:'74% Online Bookings', author:{name:'Sarah J.',title:'Owner, Sunrise Window Cleaning',initials:'SJ',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Sarah'}, company:{name:'Sunrise Window Cleaning',initials:'SW',color:'#22d3ee',industry:'Window Cleaning'} },
  { id:'13', quote:'As a painter, your portfolio IS your sales pitch. VCV built a gallery site that turns visitors into clients before I pick up the phone. Calendar sold out 3 months out.', stars:5, stat:'3 Months Booked Out', author:{name:'Mark R.',title:'Owner, ProPaint Interior',initials:'MR',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Mark'}, company:{name:'ProPaint Interior',initials:'PP',color:'#f472b6',industry:'Painting'} },
  { id:'14', quote:'HVAC is about trust. VCV built a site that shows certifications, reviews, and services so clearly that customers call us already sold. Close rate jumped to 90%.', stars:5, stat:'90% Close Rate', author:{name:'Jennifer L.',title:'Owner, Elite HVAC Solutions',initials:'JL',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Jennifer'}, company:{name:'Elite HVAC Solutions',initials:'EH',color:'#60a5fa',industry:'HVAC'} },
  { id:'15', quote:'We rank #1 for "emergency electrician" in three nearby cities now. We literally can\'t keep up with the calls. Best investment my business ever made.', stars:5, stat:'#1 Emergency Electrician', author:{name:'Tony S.',title:"Owner, Tony's Electric Pro",initials:'TS',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Tony'}, company:{name:"Tony's Electric Pro",initials:'TE',color:'#fbbf24',industry:'Electrical'} },
  { id:'16', quote:'Pet boarding parents need to TRUST you. VCV nailed it. We went from half empty to a 6-month waitlist in 60 days. Absolutely incredible.', stars:5, stat:'6-Month Waitlist', author:{name:'Nina P.',title:'Owner, Paws & Play Pet Care',initials:'NP',avatar:'https://api.dicebear.com/8.x/lorelei/svg?seed=Nina'}, company:{name:'Paws & Play Pet Care',initials:'PP',color:'#a78bfa',industry:'Pet Care'} },
];

/* ─── Emoji / money background canvas ────────────────────── */
const SYMBOLS = ['💰','💵','💸','🤑','📈','⭐','🏆','💎','🔥','✅','📞','🌟','💥','🚀','💲','🎯','💼','🏅','🤝','📊','💯','🎉','💪','🏠','🔑','📱','🎯','💫','✨','🌈'];

const EmojiBackground = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number;

    interface S { x:number; y:number; vx:number; vy:number; size:number; emoji:string; opacity:number; rot:number; rs:number; glow:string }
    let syms: S[] = [];

    const GLOWS = ['rgba(255,215,0,0.6)','rgba(0,212,255,0.6)','rgba(255,100,100,0.5)','rgba(100,255,100,0.5)','rgba(200,100,255,0.6)','rgba(255,165,0,0.6)'];

    const resize = () => {
      canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight;
      // Two tiers: 35 slow+medium, 25 fast+small = 60 total
      syms = [
        ...Array.from({length: 35}, () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random()-.5)*0.55, vy: (Math.random()-.5)*0.55,
          size: 18 + Math.random()*28,
          emoji: SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)],
          opacity: 0.14 + Math.random()*0.26,
          rot: Math.random()*Math.PI*2, rs: (Math.random()-.5)*0.018,
          glow: GLOWS[Math.floor(Math.random()*GLOWS.length)],
        })),
        // Fast small tier
        ...Array.from({length: 25}, () => ({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          vx: (Math.random()-.5)*1.4, vy: (Math.random()-.5)*1.4,
          size: 10 + Math.random()*14,
          emoji: SYMBOLS[Math.floor(Math.random()*SYMBOLS.length)],
          opacity: 0.08 + Math.random()*0.14,
          rot: Math.random()*Math.PI*2, rs: (Math.random()-.5)*0.04,
          glow: GLOWS[Math.floor(Math.random()*GLOWS.length)],
        })),
      ];
    };

    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for (const s of syms) {
        s.x += s.vx; s.y += s.vy; s.rot += s.rs;
        if (s.x < -50) s.x = canvas.width+50;
        if (s.x > canvas.width+50) s.x = -50;
        if (s.y < -50) s.y = canvas.height+50;
        if (s.y > canvas.height+50) s.y = -50;
        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.translate(s.x, s.y); ctx.rotate(s.rot);
        // Neon glow behind each symbol
        ctx.shadowColor = s.glow;
        ctx.shadowBlur = 12;
        ctx.font = `${s.size}px serif`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(s.emoji, 0, 0);
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.95 }} />;
};

/* ─── Perimeter path helper ───────────────────────────────── */
const perimeterPoint = (t: number, w: number, h: number) => {
  const p = ((t % 1) + 1) % 1;
  const total = 2*(w+h);
  const d = p * total;
  if (d < w)         return { x: d,           y: 0       };
  if (d < w+h)       return { x: w,            y: d-w     };
  if (d < 2*w+h)     return { x: w-(d-w-h),    y: h       };
  return               { x: 0,            y: h-(d-2*w-h) };
};

/* ─── Orbiting avatar ─────────────────────────────────────── */
interface OAProps {
  t: VCVTestimonial; index: number; total: number;
  progress: MotionValue<number>; dims: {w:number;h:number};
  isActive: boolean; onClick: ()=>void;
}
const OrbitingAvatar: React.FC<OAProps> = ({ t, index, total, progress, dims, isActive, onClick }) => {
  const offset = index / total;
  const x = useTransform(progress, p => perimeterPoint((p+offset)%1, dims.w, dims.h).x - 20);
  const y = useTransform(progress, p => perimeterPoint((p+offset)%1, dims.w, dims.h).y - 20);

  return (
    <motion.div
      className="absolute z-20 cursor-pointer group/oa"
      style={{ top:0, left:0, x, y, width:40, height:40 }}
      onClick={onClick}
      whileHover={{ scale: 1.35 }}>
      <Avatar className="h-10 w-10 rounded-xl border-2 transition-all duration-300"
        style={{ borderColor: isActive ? t.company.color : 'rgba(255,255,255,0.15)',
          boxShadow: isActive ? `0 0 18px ${t.company.color}80, 0 0 6px ${t.company.color}` : 'none',
          filter: isActive ? `drop-shadow(0 0 6px ${t.company.color})` : 'none',
        }}>
        <AvatarImage src={t.author.avatar} alt={t.author.name} />
        <AvatarFallback style={{ background:`${t.company.color}22`, color:t.company.color, fontWeight:800, fontSize:11, borderRadius:10 }}>
          {t.author.initials || t.author.name.split(' ').map(n=>n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      {/* Tooltip */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#0a0f1e] text-white text-[10px] px-2 py-0.5 rounded border border-white/10 opacity-0 group-hover/oa:opacity-100 transition-opacity pointer-events-none z-30">
        {t.author.name}
      </div>
    </motion.div>
  );
};

/* ─── Inline review display ───────────────────────────────── */
const ReviewDisplay: React.FC<{ t: VCVTestimonial; animating: boolean }> = ({ t, animating }) => (
  <div className={`transition-all duration-300 ${animating ? 'opacity-0 blur-sm translate-y-2' : 'opacity-100 blur-0 translate-y-0'}`}>
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-0.5">
        {[...Array(5)].map((_,i) => (
          <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        ))}
      </div>
      <span style={{ display:'inline-flex', alignItems:'center', gap:5, background:'rgba(37,99,235,0.14)', border:'1px solid rgba(37,99,235,0.35)', borderRadius:999, padding:'4px 12px', color:'#93c5fd', fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em' }}>
        <TrendingUp size={11} /> {t.stat}
      </span>
    </div>

    <blockquote className="text-xl md:text-2xl font-semibold text-gray-100 leading-relaxed mb-6"
      style={{ fontFamily:'Space Grotesk, sans-serif' }}>
      "{t.quote}"
    </blockquote>

    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12 rounded-xl border-2" style={{ borderColor:`${t.company.color}50` }}>
          <AvatarImage src={t.author.avatar} alt={t.author.name} />
          <AvatarFallback style={{ background:`${t.company.color}22`, color:t.company.color, fontWeight:800, fontSize:14, borderRadius:10 }}>
            {t.author.initials || t.author.name.split(' ').map(n=>n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-white font-bold text-sm">{t.author.name}</p>
          <p className="text-gray-500 text-xs">{t.author.title}</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 opacity-90">
        <div style={{ width:42, height:42, borderRadius:10, flexShrink:0, background:`${t.company.color}22`, border:`1.5px solid ${t.company.color}55`, display:'flex', alignItems:'center', justifyContent:'center', color:t.company.color, fontWeight:800, fontSize:13 }}>
          {t.company.initials}
        </div>
        <div>
          <p style={{ color:'#f1f5f9', fontWeight:700, fontSize:13, lineHeight:1.2, margin:0 }}>{t.company.name}</p>
          <p style={{ color:t.company.color, fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>{t.company.industry}</p>
        </div>
      </div>
    </div>
  </div>
);

/* ─── Section ─────────────────────────────────────────────── */
export const TestimonialsSection = () => {
  const [activeIdx,  setActiveIdx]  = useState(0);
  const [animating,  setAnimating]  = useState(false);
  const [cardDims,   setCardDims]   = useState({ w: 900, h: 600 });
  const cardRef   = useRef<HTMLDivElement>(null);
  const progress  = useMotionValue(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  // Measure card for orbit path
  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const obs = new ResizeObserver(() => setCardDims({ w: el.offsetWidth, h: el.offsetHeight }));
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Continuous orbit (1 revolution per 40s)
  useEffect(() => {
    let last = performance.now();
    let id: number;
    const tick = (now: number) => {
      const dt = now - last; last = now;
      progress.set((progress.get() + dt / 40000) % 1);
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  // Auto-advance every 3s
  const switchTo = useCallback((idx: number) => {
    if (idx === activeIdx) return;
    setAnimating(true);
    setTimeout(() => { setActiveIdx(idx); setTimeout(() => setAnimating(false), 120); }, 200);
  }, [activeIdx]);

  useEffect(() => {
    timerRef.current = setInterval(() => switchTo((activeIdx + 1) % TESTIMONIALS.length), 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [activeIdx, switchTo]);

  const active = TESTIMONIALS[activeIdx];

  return (
    <section className="py-28 relative overflow-visible bg-[#040a16]">
      {/* Full-section emoji/money background */}
      <div className="absolute inset-0 overflow-hidden">
        <EmojiBackground />
        <div className="absolute inset-0 bg-[#040a16]/42 pointer-events-none" />
        <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />
      </div>

      <div className="max-w-4xl mx-auto px-16 relative z-10">

        {/* ── Outer card wrapper with orbit ─────────────────── */}
        <div className="relative">

          {/* Orbit container — extends 44px beyond card on all sides */}
          <div className="absolute hidden lg:block" style={{ inset: -44, pointerEvents: 'none', zIndex: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <OrbitingAvatar key={t.id} t={t} index={i} total={TESTIMONIALS.length}
                progress={progress} dims={{ w: cardDims.w + 88, h: cardDims.h + 88 }}
                isActive={i === activeIdx} onClick={() => { if (timerRef.current) clearInterval(timerRef.current); switchTo(i); }}
              />
            ))}
          </div>

          {/* THE BIG CARD */}
          <div ref={cardRef}
            style={{
              background: 'rgba(6,10,22,0.92)',
              backdropFilter: 'blur(24px)',
              borderRadius: 28,
              border: '1px solid rgba(37,99,235,0.22)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(37,99,235,0.08)',
              overflow: 'hidden',
            }}>

            {/* Top gradient accent */}
            <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.6), rgba(124,58,237,0.4), transparent)' }} />

            <div className="p-8 md:p-12">

              {/* ── Heading section ─────────────────────────── */}
              <div className="text-center mb-10">
                <motion.div initial={{ opacity:0, x:-50 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} className="mb-4">
                  <p className="neon-badge mx-auto w-fit">Social Proof</p>
                </motion.div>

                {/* Pulsing headline with glare sweep */}
                <div className="relative inline-block mb-4" style={{ overflow: 'hidden', borderRadius: 8 }}>
                  {/* Glare sweep — diagonal white streak every 5s */}
                  <motion.div
                    aria-hidden
                    style={{
                      position: 'absolute', top: '-20%', width: '40%', height: '140%',
                      background: 'linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.18) 50%, transparent 80%)',
                      zIndex: 10, pointerEvents: 'none', skewX: '-15deg',
                    }}
                    animate={{ left: ['-50%', '160%'] }}
                    transition={{ duration: 1.0, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
                  />
                  <motion.h2
                    className="font-display text-6xl md:text-7xl leading-none relative z-0"
                    animate={{
                      scale: [1, 1.04, 1],
                      filter: [
                        'drop-shadow(0 0 10px rgba(6,182,212,0.5))',
                        'drop-shadow(0 0 28px rgba(6,182,212,0.9)) drop-shadow(0 0 50px rgba(124,58,237,0.6))',
                        'drop-shadow(0 0 18px rgba(255,255,255,0.4)) drop-shadow(0 0 40px rgba(6,182,212,0.7))',
                        'drop-shadow(0 0 28px rgba(6,182,212,0.9)) drop-shadow(0 0 50px rgba(124,58,237,0.6))',
                        'drop-shadow(0 0 10px rgba(6,182,212,0.5))',
                      ],
                    }}
                    transition={{ duration: 3.0, repeat: Infinity, ease: 'easeInOut' }}>
                    <motion.span initial={{ opacity:0, x:-70 }} whileInView={{ opacity:1, x:0 }}
                      transition={{ delay:0.1 }} viewport={{ once:true }}
                      style={{ display:'inline-block', color: 'white' }}>
                      CLIENT
                    </motion.span>{' '}
                    <motion.span initial={{ opacity:0, x:70 }} whileInView={{ opacity:1, x:0 }}
                      transition={{ delay:0.2 }} viewport={{ once:true }} style={{ display:'inline-block' }}>
                      <MarkerHighlight highlight="WINS" markerColor="rgba(6,182,212,0.85)" textColor="white" delay={0.45} />
                    </motion.span>
                  </motion.h2>
                </div>

                <motion.p initial={{ opacity:0, x:50 }} whileInView={{ opacity:1, x:0 }}
                  transition={{ delay:0.28 }} viewport={{ once:true }}
                  className="text-gray-400 text-base max-w-lg mx-auto mb-6">
                  16 real businesses. 16 real results — local contractors and service companies that now dominate their markets.
                </motion.p>

                {/* Proof pills */}
                <div className="flex flex-wrap justify-center gap-3">
                  {[
                    {i:'⭐',l:'4.9 / 5 Average Rating'}, {i:'🏆',l:'50+ Businesses Served'},
                    {i:'📍',l:'Serving Nationwide'},     {i:'🔒',l:'100% Money-Back'},
                  ].map((item, idx) => (
                    <motion.div key={idx}
                      initial={{ opacity:0, x: idx%2===0 ? -40 : 40 }}
                      whileInView={{ opacity:1, x:0 }}
                      transition={{ delay: 0.35 + idx*0.07 }}
                      viewport={{ once:true }}
                      style={{ display:'inline-flex', alignItems:'center', gap:7, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:999, padding:'7px 16px', fontSize:13, fontWeight:600, color:'#94a3b8' }}>
                      <span>{item.i}</span><span>{item.l}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ height:1, background:'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)', marginBottom:36 }} />

              {/* ── Active review ───────────────────────────── */}
              <div style={{ minHeight: 220 }}>
                <ReviewDisplay t={active} animating={animating} />
              </div>

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mt-8">
                {TESTIMONIALS.map((_, i) => (
                  <button key={i} onClick={() => switchTo(i)}
                    style={{ width: i===activeIdx ? 20 : 6, height:6, borderRadius:999, background: i===activeIdx ? TESTIMONIALS[i].company.color : 'rgba(255,255,255,0.15)', transition:'all 0.3s' }} />
                ))}
              </div>

              {/* Hint — inside the card */}
              <p className="text-center text-gray-600 text-xs mt-4">
                Click any orbiting avatar to read their story · Auto-advances every 3 seconds
              </p>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
