'use client';
import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Layout, Search, BarChart3, CheckCircle2, ArrowRight, X, Rocket, Zap, Shield, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { ParticleCanvas, StaticElectricity, MarqueeBand, SectionOrbs, GridOverlay } from '@/components/PageEffects';

/* ── Rainbow checkerboard canvas ── */
const RainbowChecker = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let id: number; let t = 0;
    const CELL = 54;
    const resize = () => { c.width = c.offsetWidth; c.height = c.offsetHeight; };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      t += 0.008;
      const cols = Math.ceil(c.width / CELL), rows = Math.ceil(c.height / CELL);
      ctx.clearRect(0, 0, c.width, c.height);
      for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
          if ((col + row) % 2 === 0) continue; // checkerboard — only odd squares
          const phase = (col * 0.18 + row * 0.22) % 1;
          const hue = ((t + phase) * 180) % 360;
          const alpha = 0.13 + 0.07 * Math.sin(t * 2 + phase * 6);
          ctx.fillStyle = `hsla(${hue},100%,58%,${alpha})`;
          ctx.fillRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
          // bright border on each lit cell
          ctx.strokeStyle = `hsla(${hue},100%,70%,${alpha * 2.2})`;
          ctx.lineWidth = 0.8;
          ctx.strokeRect(col * CELL + 1, row * CELL + 1, CELL - 2, CELL - 2);
        }
      }
      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" />;
};

// All buttons share the same base period so they appear to "trade" —
// cards 0+3 slide right while 1+2 slide left at the same time, then swap
const BTN_PERIOD = 1.8; // seconds for one full back-and-forth
const BTN_ANIMS = [
  { phase: 0,          range: 55 }, // card 0: starts left, big range
  { phase: Math.PI,    range: 55 }, // card 1: opposite phase → chases card 0
  { phase: Math.PI,    range: 42 }, // card 2: same phase as 1, different speed
  { phase: 0,          range: 42 }, // card 3: opposite of 2 → chases card 2
];
// Labels that cycle inside the buttons to look like they "switch"
const BTN_LABELS = ['Website Design','Landing Pages','SEO Visibility','Paid Ads'];

const fade   = (d=0) => ({ initial:{opacity:0,y:30}, whileInView:{opacity:1,y:0}, transition:{delay:d}, viewport:{once:true} });
const slideL = (d=0) => ({ initial:{opacity:0,x:-30}, whileInView:{opacity:1,x:0}, transition:{delay:d}, viewport:{once:true} });
const slideR = (d=0) => ({ initial:{opacity:0,x:30},  whileInView:{opacity:1,x:0}, transition:{delay:d}, viewport:{once:true} });

const SERVICES = [
  { icon:<Layout className="w-6 h-6"/>,   title:'High-Converting Website Design', benefit:'Turn visitors into calls and paying customers.',     color:'#3b82f6', features:['Mobile optimized','Built for conversions','Fast load speeds','Clean modern design'] },
  { icon:<Rocket className="w-6 h-6"/>,   title:'Fast-Launch Landing Pages',       benefit:'Go live and generate leads in days, not months.',   color:'#8b5cf6', features:['3-7 day turnaround','Focused lead capture','Professional branding','Ready to launch'] },
  { icon:<Search className="w-6 h-6"/>,   title:'SEO and Local Visibility',         benefit:'Rank on Google and get found by local customers.',   color:'#06b6d4', features:['On-page SEO','Local search ranking','Keyword research','Technical SEO'] },
  { icon:<BarChart3 className="w-6 h-6"/>,title:'Paid Ads Management',             benefit:'Scale fast with targeted campaigns that convert.',   color:'#10b981', features:['Google Ads','Facebook / Instagram','Conversion tracking','Funnel strategy'] },
];

const STATS = [
  { icon:<Zap className="w-5 h-5"/>,   val:'3-7', unit:'Days', label:'Average Launch',    color:'#3b82f6' },
  { icon:<Star className="w-5 h-5"/>,  val:'98',  unit:'%',    label:'Client Satisfaction',color:'#8b5cf6' },
  { icon:<Shield className="w-5 h-5"/>,val:'$0',  unit:'',     label:'Upfront to Start',  color:'#06b6d4' },
  { icon:<Users className="w-5 h-5"/>, val:'50',  unit:'+',    label:'Businesses Launched',color:'#10b981' },
];

export default function Services() {
  return (
    <div className="bg-[#030712]">

      {/* ── Hero with particle canvas ── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
        <ParticleCanvas />
        <SectionOrbs variant="mixed" />
        <GridOverlay gridOp={0.35} dotOp={0.15} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...slideL()} className="max-w-3xl">
            <p className="neon-badge mb-6 w-fit">Our Services</p>
            <h1 className="font-display leading-none text-white mb-6" style={{fontSize:'clamp(3.5rem,8vw,7rem)',textShadow:'0 0 50px rgba(37,99,235,0.5)'}}>
              WE BUILD<br/><span className="gradient-text">GROWTH ENGINES</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-xl">
              Not just websites. High-performance lead machines built for local businesses that want more calls, more leads, and more revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/free-demo" className="btn-glow btn-neon text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 group">
                Get My Free Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform"/>
              </Link>
              <Link href="/pricing" className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
                View Pricing <ArrowRight className="w-4 h-4"/>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ── */}
      <MarqueeBand />

      {/* ── Stats with static electricity ── */}
      <section className="py-20 relative overflow-hidden bg-[#030712]">
        <StaticElectricity />
        <GridOverlay gridOp={0.2} dotOp={0.12} />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {STATS.map((s,i) => (
              <motion.div key={i} {...fade(i*.1)} className="glass-card p-6 text-center noise-texture" style={{borderColor:`${s.color}25`}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{background:`${s.color}15`,color:s.color}}>{s.icon}</div>
                <div className="font-display text-4xl text-white mb-1" style={{textShadow:`0 0 20px ${s.color}60`}}>{s.val}<span className="text-2xl">{s.unit}</span></div>
                <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services grid with rainbow checkerboard ── */}
      <section className="py-24 relative overflow-hidden bg-[#030712]">
        <RainbowChecker />
        <SectionOrbs variant="purple" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-16">
            <p className="neon-badge mb-4 mx-auto w-fit">What We Build</p>
            <h2 className="font-display text-6xl md:text-7xl text-white mb-4">CORE SERVICES</h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to dominate your local market — built and managed for you.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((s,i) => {
              const btn = BTN_ANIMS[i];
              return (
                <motion.div key={i} {...fade(i*.1)} whileHover={{y:-4}} className="neon-card noise-texture p-8 flex flex-col h-full group" style={{borderColor:`${s.color}30`}}>
                  <div className="mb-5 w-14 h-14 rounded-2xl flex items-center justify-center" style={{background:`${s.color}15`,border:`1px solid ${s.color}35`,boxShadow:`0 0 20px ${s.color}20`,color:s.color}}>{s.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="font-semibold text-sm mb-5" style={{color:s.color}}>{s.benefit}</p>
                  <ul className="space-y-3 mb-7 flex-grow">
                    {s.features.map((f,j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{color:s.color}}/> {f}
                      </li>
                    ))}
                  </ul>
                  {/* Button with big sliding + cycling label */}
                  <Link href="/free-demo"
                    className="overflow-hidden relative w-full flex items-center justify-center py-3 rounded-xl font-bold text-sm border"
                    style={{color:'white', background:`${s.color}22`, borderColor:`${s.color}55`,
                      boxShadow:`0 0 20px ${s.color}35, inset 0 1px 0 ${s.color}25`}}>
                    {/* Sliding content — x driven by sin wave via keyframes */}
                    <motion.span
                      className="flex items-center gap-2 whitespace-nowrap"
                      animate={{
                        x: [
                          btn.range * Math.sin(btn.phase),
                          btn.range * Math.sin(btn.phase + Math.PI / 2),
                          btn.range * Math.sin(btn.phase + Math.PI),
                          btn.range * Math.sin(btn.phase + 3 * Math.PI / 2),
                          btn.range * Math.sin(btn.phase + 2 * Math.PI),
                        ],
                        color: [s.color, 'white', s.color, 'white', s.color],
                      }}
                      transition={{ duration: BTN_PERIOD, repeat: Infinity, ease: 'easeInOut', times:[0,.25,.5,.75,1] }}>
                      Get Demo — {BTN_LABELS[i]}
                      <motion.span
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: BTN_PERIOD * 2, repeat: Infinity, ease:'linear' }}>
                        <ArrowRight className="w-4 h-4"/>
                      </motion.span>
                    </motion.span>
                    {/* Racing colour glow that sweeps left→right */}
                    <motion.div
                      className="absolute inset-0 rounded-xl pointer-events-none"
                      animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
                      transition={{ duration: BTN_PERIOD, repeat: Infinity, ease:'linear' }}
                      style={{
                        background:`linear-gradient(90deg, transparent 30%, ${s.color}55 50%, transparent 70%)`,
                        backgroundSize:'200% 100%',
                      }}
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Comparison with static electricity ── */}
      <section className="py-24 relative overflow-hidden" style={{background:'linear-gradient(180deg,#030712 0%,#040a16 50%,#030712 100%)'}}>
        <StaticElectricity />
        <GridOverlay gridOp={0.2} dotOp={0.08} />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-14">
            <p className="neon-badge mb-4 mx-auto w-fit">The Difference</p>
            <h2 className="font-display text-6xl md:text-7xl text-white">WHY VCV?</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div {...slideL()} className="glass-card p-8" style={{borderColor:'rgba(239,68,68,0.2)'}}>
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/15 flex items-center justify-center"><X className="w-4 h-4 text-red-400"/></div>
                Typical Agency
              </h3>
              <ul className="space-y-4">
                {['Looks nice, but does not convert','No call tracking or analytics','No SEO structure from day one','Takes months to deliver','Expensive retainers with no results'].map((t,i)=>(
                  <li key={i} className="flex items-start gap-3 text-gray-500 text-sm"><X className="w-4 h-4 text-red-500/60 flex-shrink-0 mt-0.5"/>{t}</li>
                ))}
              </ul>
            </motion.div>
            <motion.div {...slideR()} className="neon-card p-8" style={{borderColor:'rgba(37,99,235,0.4)',boxShadow:'0 0 40px rgba(37,99,235,0.1)'}}>
              <h3 className="text-xl font-bold text-blue-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500/15 flex items-center justify-center"><CheckCircle2 className="w-4 h-4 text-blue-400"/></div>
                VCV Web Solutions
              </h3>
              <ul className="space-y-4">
                {['Built to generate calls and leads','Full SEO structure from day one','3-7 day launch, not months','Custom design preview before you commit','No lock-in — you own everything'].map((t,i)=>(
                  <li key={i} className="flex items-start gap-3 text-gray-200 text-sm"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"/>{t}</li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Process — staircase + bubbles ── */}
      <section className="py-24 bg-[#030712] relative overflow-hidden" style={{minHeight:560}}>
        {/* Animated floating bubbles */}
        {[
          {c:'rgba(59,130,246,0.45)',  w:210,h:210,l:'4%',  t:'15%', dur:9,  dy:[0,-38,12,-28,0],  dx:[0,20,-14,10,0]  },
          {c:'rgba(139,92,246,0.45)',  w:170,h:170,l:'72%', t:'8%',  dur:12, dy:[0,-22,32,-18,0],  dx:[0,-18,12,-22,0] },
          {c:'rgba(6,182,212,0.42)',   w:145,h:145,l:'38%', t:'55%', dur:10, dy:[0,28,-22,32,0],   dx:[0,14,-20,10,0]  },
          {c:'rgba(168,85,247,0.45)',  w:190,h:190,l:'82%', t:'52%', dur:13, dy:[0,-32,22,-12,0],  dx:[0,-12,22,-18,0] },
          {c:'rgba(16,185,129,0.42)',  w:160,h:160,l:'18%', t:'60%', dur:11, dy:[0,22,-32,18,0],   dx:[0,-20,14,22,0]  },
          {c:'rgba(236,72,153,0.38)',  w:125,h:125,l:'55%', t:'20%', dur:14, dy:[0,-28,18,-22,0],  dx:[0,22,-12,18,0]  },
          {c:'rgba(245,158,11,0.38)',  w:135,h:135,l:'90%', t:'30%', dur:8,  dy:[0,32,-22,28,0],   dx:[0,-14,20,-10,0] },
          {c:'rgba(239,68,68,0.35)',   w:115,h:115,l:'62%', t:'70%', dur:15, dy:[0,-18,26,-14,0],  dx:[0,16,-22,12,0]  },
        ].map((b,i)=>(
          <motion.div key={i}
            style={{position:'absolute',borderRadius:'50%',pointerEvents:'none',
              width:b.w,height:b.h,left:b.l,top:b.t,background:b.c,filter:'blur(48px)'}}
            animate={{
              y:     b.dy,
              x:     b.dx,
              scale: [1, 1.2, 0.9, 1.15, 1],
              opacity:[0.75, 1, 0.7, 0.95, 0.75],
            }}
            transition={{duration:b.dur, repeat:Infinity, ease:'easeInOut', delay:i*0.55, times:[0,.25,.5,.75,1]}}
          />
        ))}
        <GridOverlay gridOp={0.22} dotOp={0.1} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-16">
            <p className="neon-badge mb-4 mx-auto w-fit">How It Works</p>
            <h2 className="font-display text-6xl md:text-7xl text-white">THE PROCESS</h2>
          </motion.div>

          {/* Desktop staircase */}
          <div className="hidden md:flex items-start gap-3 relative" style={{minHeight:420}}>
            {/* Connecting line */}
            <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{top:80}}>
              <svg width="100%" height="4" style={{overflow:'visible'}}>
                <defs>
                  <linearGradient id="stepLine" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#3b82f6"/>
                    <stop offset="25%"  stopColor="#8b5cf6"/>
                    <stop offset="50%"  stopColor="#06b6d4"/>
                    <stop offset="75%"  stopColor="#a855f7"/>
                    <stop offset="100%" stopColor="#10b981"/>
                  </linearGradient>
                </defs>
                <line x1="10%" y1="2" x2="90%" y2="2" stroke="url(#stepLine)" strokeWidth="2" strokeDasharray="6 4" opacity="0.4"/>
              </svg>
            </div>

            {[
              {n:'01',t:'Request Demo',  d:'Tell us about your business and goals.',      color:'#3b82f6', mt:0   },
              {n:'02',t:'We Build It',   d:'Custom site designed for your niche in 48h.', color:'#8b5cf6', mt:70  },
              {n:'03',t:'You Approve',   d:'Review and revise — unlimited changes.',       color:'#06b6d4', mt:140 },
              {n:'04',t:'We Launch',     d:'Go live in 3-7 days, fully set up.',           color:'#a855f7', mt:210 },
              {n:'05',t:'Leads Come In', d:'Your site works 24/7 generating calls.',       color:'#10b981', mt:280 },
            ].map((s,i)=>(
              <motion.div key={i} {...fade(i*.12)}
                className="flex-1 relative rounded-2xl p-5"
                style={{
                  marginTop: s.mt,
                  background:`linear-gradient(145deg, ${s.color}18, ${s.color}08)`,
                  border:`1.5px solid ${s.color}60`,
                  boxShadow:`0 0 28px ${s.color}35, 0 0 60px ${s.color}15, inset 0 1px 0 ${s.color}25`,
                }}>
                {/* Number */}
                <div className="font-display text-5xl mb-3 leading-none" style={{
                  color:s.color,
                  textShadow:`0 0 20px ${s.color}80, 0 0 40px ${s.color}40`
                }}>{s.n}</div>
                {/* Step dot */}
                <div className="absolute top-4 right-4 w-3 h-3 rounded-full" style={{
                  background:s.color,
                  boxShadow:`0 0 10px ${s.color}, 0 0 20px ${s.color}80`,
                  animation:'pulse 1.8s ease-in-out infinite',
                }}/>
                <h3 className="font-bold text-white text-base mb-2">{s.t}</h3>
                <p className="text-sm leading-relaxed" style={{color:`${s.color}cc`}}>{s.d}</p>
                {/* Connector arrow */}
                {i < 4 && (
                  <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-xl font-bold" style={{color:s.color,textShadow:`0 0 10px ${s.color}`}}>›</div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile: vertical stacked */}
          <div className="md:hidden space-y-4">
            {[
              {n:'01',t:'Request Demo',  d:'Tell us about your business.',           color:'#3b82f6'},
              {n:'02',t:'We Build It',   d:'Custom site designed for your niche.',    color:'#8b5cf6'},
              {n:'03',t:'You Approve',   d:'Review, revise — unlimited changes.',     color:'#06b6d4'},
              {n:'04',t:'We Launch',     d:'Go live in 3-7 days, fully set up.',      color:'#a855f7'},
              {n:'05',t:'Leads Come In', d:'Your site works 24/7 generating calls.',  color:'#10b981'},
            ].map((s,i)=>(
              <motion.div key={i} {...fade(i*.08)}
                className="rounded-2xl p-5 flex items-start gap-4"
                style={{background:`${s.color}15`,border:`1.5px solid ${s.color}55`,boxShadow:`0 0 20px ${s.color}25`}}>
                <div className="font-display text-4xl leading-none flex-shrink-0" style={{color:s.color,textShadow:`0 0 15px ${s.color}`}}>{s.n}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{s.t}</h3>
                  <p className="text-sm" style={{color:`${s.color}cc`}}>{s.d}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <ParticleCanvas />
        <SectionOrbs variant="mixed" />
        <GridOverlay gridOp={0.3} dotOp={0.12} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fade()}>
            <p className="neon-badge mb-6 mx-auto w-fit">Limited Spots Available</p>
            <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
              GET YOUR<br/><span className="gradient-text">FREE DEMO</span><br/>TODAY
            </h2>
            <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">Professional websites starting at $97/mo — see your custom design first, then we launch it.</p>
            <Link href="/free-demo" className="btn-glow btn-neon text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 group">
              Build My Free Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform"/>
            </Link>
            <p className="text-gray-600 text-sm mt-6">Starts at $97/mo · 30-day results guarantee · Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
