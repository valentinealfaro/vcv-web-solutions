import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Rocket, BarChart3, Users, Layout, ShieldCheck, Search, Zap, TrendingUp, MousePointer, Clock, Award } from 'lucide-react';
import { Boxes } from '@/components/ui/background-boxes';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { DemoSection } from '../components/DemoSection';
import { LeadMagnetSection } from '../components/LeadMagnetSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { UrgencySection } from '../components/UrgencySection';
import { FAQSection } from '../components/FAQSection';
import { PricingSection } from '../components/PricingSection';
import { WhatHappensNextSection } from '../components/WhatHappensNextSection';
import { ValueStackSection } from '../components/ValueStackSection';
import { WhyNotDIYSection } from '../components/WhyNotDIYSection';
import { WatchHowItWorksSection } from '../components/WatchHowItWorksSection';

/* ─── Particle Canvas ─────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const mouse = { x: -1000, y: -1000 };

    interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number }
    let pts: P[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      pts = [];
      const n = Math.min(90, Math.floor((canvas.width * canvas.height) / 14000));
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.8 + 0.5,
          alpha: Math.random() * 0.5 + 0.25,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p, i) => {
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x += p.vx; p.y += p.vy;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(37,99,235,${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(37,99,235,${0.22 * (1 - d / 130)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        const md = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (md < 160) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(168,85,247,${0.55 * (1 - md / 160)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      });
      animId = requestAnimationFrame(draw);
    };

    const onMouse = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onResize = () => { resize(); spawn(); };

    resize(); spawn(); draw();
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: 'transform' }} />;
};

/* ─── Animated Counter ────────────────────────────────────── */
const Counter = ({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !triggered.current) {
        triggered.current = true;
        const dur = 1800;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setCount(Math.floor(ease * target));
          if (t < 1) requestAnimationFrame(tick);
          else setCount(target);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.6 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

/* ─── 3D Tilt Card ────────────────────────────────────────── */
const TiltCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent) => {
    const card = ref.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const rx = -((e.clientY - r.top) / r.height - 0.5) * 16;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 16;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.03,1.03,1.03)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale3d(1,1,1)';
  };
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={reset}
      className={className}
      style={{ transition: 'transform 0.12s ease', transformStyle: 'preserve-3d' }}>
      {children}
    </div>
  );
};

/* ─── Mockup Content Phases ──────────────────────────────── */
const UglyContent = () => (
  <div className="h-full overflow-hidden" style={{
    background: '#fffde7',
    fontFamily: 'Georgia, "Times New Roman", serif',
    padding: '8px',
  }}>
    <div style={{ background: '#000080', padding: '2px 6px', display: 'flex', gap: '6px', marginBottom: '6px' }}>
      {['HOME', 'ABOUT US', 'SERVICES', 'CONTACT'].map(n => (
        <span key={n} style={{ color: '#ffff00', fontSize: '7px', fontWeight: 'bold', textDecoration: 'underline' }}>{n}</span>
      ))}
    </div>
    <div style={{ textAlign: 'center', color: '#ff0000', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>
      ★ WELCOME TO MY WEBSITE!! ★
    </div>
    <hr style={{ border: '2px solid #ff0000', marginBottom: '4px' }} />
    <div style={{ background: '#ffcc00', border: '2px dashed #ff0000', padding: '3px', textAlign: 'center', marginBottom: '5px' }}>
      <span style={{ fontSize: '7px', color: '#990000', fontWeight: 'bold' }}>🚧 UNDER CONSTRUCTION 🚧</span>
    </div>
    <p style={{ fontSize: '7px', color: '#0000cc', lineHeight: 1.4, marginBottom: '6px' }}>
      WE ARE THE #1 BEST COMPANY!! CALL US NOW FOR ALL YOUR NEEDS. BEST PRICES GUARANTEED!!!
    </p>
    <div style={{ textAlign: 'center', marginBottom: '5px' }}>
      <button style={{
        background: '#00ff00', color: '#ff00ff',
        border: '3px solid #ff0000', padding: '3px 10px',
        fontSize: '8px', fontWeight: 'bold',
        fontFamily: '"Comic Sans MS", cursive', cursor: 'pointer',
      }}>CLICK HERE NOW!!! →</button>
    </div>
    <p style={{ textAlign: 'center', fontSize: '6px', color: '#999' }}>
      Best viewed in Internet Explorer · © 2003 All Rites Reservd
    </p>
  </div>
);

const LoadingContent = () => (
  <div className="h-full flex flex-col items-center justify-center bg-[#080e1c] gap-3">
    <div className="relative w-10 h-10">
      <div className="absolute inset-0 rounded-full border-2 border-blue-900/50" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 border-r-purple-500 animate-spin" />
      <div className="absolute inset-[6px] rounded-full border border-transparent border-t-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.5s' }} />
    </div>
    <p className="text-blue-400 text-[9px] font-bold tracking-[0.18em] uppercase">Building your site...</p>
    <div className="flex gap-1.5">
      {[0, 1, 2].map(i => (
        <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  </div>
);

const BeautifulContent = () => (
  <div className="h-full bg-[#080e1c] p-4 flex flex-col gap-2.5">
    <div className="h-6 bg-gradient-to-r from-blue-600/50 to-purple-600/50 rounded-lg w-3/4" />
    <div className="h-2 bg-white/5 rounded w-full" />
    <div className="h-2 bg-white/5 rounded w-5/6" />
    <div className="h-2 bg-white/5 rounded w-4/6" />
    <div className="mt-1 h-9 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg w-1/2 animate-pulse-glow" />
    <div className="mt-auto grid grid-cols-3 gap-1.5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-14 bg-white/[0.03] rounded-xl border border-white/5 flex items-end p-1.5">
          <div className="h-1.5 bg-blue-500/40 rounded w-full" />
        </div>
      ))}
    </div>
  </div>
);

type MockupPhase = 'ugly' | 'loading' | 'beautiful';
type FlipState  = 'idle' | 'flipOut' | 'flipIn';

const AnimatedMockup = () => {
  const [phase, setPhase]           = useState<MockupPhase>('ugly');
  const [flip, setFlip]             = useState<FlipState>('idle');
  const [showBadges, setShowBadges] = useState(false);
  const [cycle, setCycle]           = useState(0);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    setPhase('ugly'); setFlip('idle'); setShowBadges(false);

    t(() => setFlip('flipOut'),                         2200);  // squish out
    t(() => { setPhase('loading'); setFlip('flipIn'); }, 2520); // swap + squish in
    t(() => setFlip('idle'),                            2820);  // settle
    t(() => setPhase('beautiful'),                      3750);  // loading → beautiful
    t(() => setShowBadges(true),                        3950);  // badges pop in
    t(() => setCycle(c => c + 1),                       8800);  // loop

    return () => ids.forEach(clearTimeout);
  }, [cycle]);

  const flipVariants = {
    idle:    { scaleX: 1, rotateY: 0 },
    flipOut: { scaleX: 0, rotateY: 90,  transition: { duration: 0.28, ease: 'easeIn'  as const } },
    flipIn:  { scaleX: 1, rotateY: 0,   transition: { duration: 0.28, ease: 'easeOut' as const } },
  };

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <motion.div variants={flipVariants} animate={flip}
        className="browser-mockup flex flex-col overflow-hidden"
        style={{ aspectRatio: '4/3' }}>
        {/* Chrome bar */}
        <div className="browser-top flex-shrink-0">
          <span /><span /><span />
          <div className="ml-3 flex-1 h-5 bg-white/5 rounded-full text-[10px] text-gray-500 flex items-center px-3">
            {phase === 'ugly' ? 'oldsite.net' : 'yoursite.com'}
          </div>
          {phase === 'beautiful' && (
            <div className="mr-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">LIVE</span>
            </div>
          )}
        </div>
        {/* Content area */}
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          {phase === 'ugly'      && <UglyContent />}
          {phase === 'loading'   && <LoadingContent />}
          {phase === 'beautiful' && <BeautifulContent />}
        </div>
      </motion.div>

      {/* Floating badges — appear only after beautiful loads */}
      <AnimatePresence>
        {showBadges && (
          <>
            <motion.div key="badge1"
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="absolute -right-4 top-12 glass-card px-4 py-2.5 text-sm font-bold text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> +312% More Leads
            </motion.div>
            <motion.div key="badge2"
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
              transition={{ delay: 0.15 }}
              className="absolute -left-4 bottom-16 glass-card px-4 py-2.5 text-sm font-bold text-blue-400 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Launched in 5 Days
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── 3-D Pop-Out Word ────────────────────────────────────── */
const PopOut3DWord = ({ word, delay = 0.8 }: { word: string; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });

  return (
    /*
      perspective: 350px — close enough that z movement creates
      extreme foreshortening. The word explodes through the screen.
    */
    <span
      ref={ref}
      style={{ display: 'inline-block', perspective: '350px', perspectiveOrigin: '50% 50%' }}
    >
      <motion.span
        className="gradient-text"
        style={{
          display: 'inline-block',
          transformStyle: 'preserve-3d',
          willChange: 'transform, filter',
        }}
        initial={{ scale: 0.3, rotateY: -28, rotateX: 18, z: -80, opacity: 0 }}
        animate={inView ? {
          // ── 5-stop journey ──────────────────────────────
          // 0 %   far away, tilted, invisible
          // 20%   twisting as it rushes forward
          // 48%   BLOWS THROUGH the screen (scale ×6 + perspective amplification)
          // 72%   snaps back toward readable size
          // 100%  settles — still notably large & glowing
          scale:   [0.3,  0.8,   6,     2.2,  1],
          rotateY: [-28,  16,   -6,     2,    0],
          rotateX: [ 18,  -9,    3,    -1,    0],
          z:       [-80,  20,   310,   100,   0],
          opacity: [  0,   1,    1,     1,    1],
          filter: [
            'drop-shadow(0   0px   0px rgba(37,99,235,0))',
            'drop-shadow(0   8px  24px rgba(37,99,235,0.55))',
            'drop-shadow(0   0px  80px rgba(99,102,241,1)) drop-shadow(0 0px 160px rgba(139,92,246,0.9))',
            'drop-shadow(0  20px  70px rgba(99,102,241,0.75))',
            'drop-shadow(0   0px   0px rgba(99,102,241,0))',
          ],
        } : {}}
        transition={{
          duration: 2.8,
          times:   [0, 0.20, 0.46, 0.70, 1],
          // fast attack to peak, slow controlled settle
          ease: ['easeIn', 'easeOut', 'easeInOut', 'easeOut'],
          delay,
        }}
      >
        {word}
      </motion.span>
    </span>
  );
};

/* ─── Hero ────────────────────────────────────────────────── */
const Hero = () => (
  <section className="relative min-h-screen flex items-center pt-28 pb-16 bg-hero-radial" style={{ overflowX: 'hidden', overflowY: 'visible' }}>
    <ParticleCanvas />

    {/* Glowing orbs */}
    <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-orb" />
    <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-600/8 rounded-full blur-[140px] pointer-events-none animate-orb-delay" />
    <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none animate-orb-slow" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div className="neon-badge mb-6">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
            Now taking new clients — Limited spots
          </div>

          <h1 className="font-display text-[5.5rem] md:text-[7.5rem] leading-none text-white mb-2 select-none">
            WE BUILD
          </h1>
          <h1 className="font-display text-[5.5rem] md:text-[7.5rem] leading-none mb-2 select-none">
            <span className="glitch gradient-text" data-text="WEBSITES">WEBSITES</span>
          </h1>
          <h1 className="font-display text-[4rem] md:text-[5.5rem] leading-none text-white mb-8 select-none overflow-visible">
            THAT GENERATE{' '}
            <PopOut3DWord word="LEADS" delay={0.85} />
          </h1>

          <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-[520px]">
            Stop paying for pretty websites that don't convert. We engineer high-performance lead machines for local service businesses — launching in 3–7 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link to="/free-demo"
              className="btn-glow btn-neon text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 group">
              Get My Free Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/portfolio"
              className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
              See Live Examples
              <Globe className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-400">
            {['No upfront cost options', '3–7 day launch', '100% money-back guarantee'].map((t, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}>
          <AnimatedMockup />
        </motion.div>
      </div>
    </div>

    {/* Bottom fade */}
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030712] to-transparent pointer-events-none" />
  </section>
);

/* ─── Marquee ─────────────────────────────────────────────── */
const MarqueeBand = () => (
  <div className="marquee-band">
    <div className="marquee-inner">
      {[
        'No Upfront Cost Options', 'Built in 3–7 Days', 'SEO Optimized', 'Mobile Friendly',
        'Lead Generation Focused', 'Call & Text Integration', 'Google Ads Ready', 'You Own Your Site',
        'No Upfront Cost Options', 'Built in 3–7 Days', 'SEO Optimized', 'Mobile Friendly',
        'Lead Generation Focused', 'Call & Text Integration', 'Google Ads Ready', 'You Own Your Site',
      ].map((t, i) => <span key={i} className="marquee-item">{t}</span>)}
    </div>
  </div>
);

/* ─── Stats Section ───────────────────────────────────────── */
const StatsSection = () => (
  <section className="py-20 relative overflow-hidden bg-[#030712]">
    <div className="absolute inset-0 bg-dot opacity-40" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <Award className="w-6 h-6" />, val: 50, suf: '+', label: 'Websites Launched' },
          { icon: <Users className="w-6 h-6" />, val: 98, suf: '%', label: 'Client Satisfaction' },
          { icon: <Clock className="w-6 h-6" />, val: 5, suf: ' Days Avg', label: 'Launch Time' },
          { icon: <ShieldCheck className="w-6 h-6" />, val: 0, pre: '$', suf: ' Upfront', label: 'Risk-Free Start' },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className="glass-card p-7 text-center group hover:border-blue-500/30 transition-all duration-300">
            <div className="text-blue-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
              {s.icon}
            </div>
            <div className="font-display text-5xl gradient-text mb-1">
              <Counter target={s.val} prefix={s.pre} suffix={s.suf} />
            </div>
            <p className="text-gray-500 text-xs uppercase tracking-widest font-semibold">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Perfect For ─────────────────────────────────────────── */
const PerfectFor = () => (
  <section className="py-12 bg-[#030712]">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <p className="text-gray-500 font-semibold text-center mb-6 text-sm uppercase tracking-widest">Perfect for</p>
      <div className="flex flex-wrap justify-center gap-3">
        {['Contractors', 'Roofers', 'Plumbers', 'HVAC Companies', 'Landscapers', 'Home Services', 'Restaurants', 'Local Businesses'].map((item, idx) => (
          <span key={idx} className="neon-badge">{item}</span>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Services ────────────────────────────────────────────── */
const ServicesOverview = () => {
  const services = [
    { icon: <Layout className="w-7 h-7" />, title: 'Website Design', color: 'from-blue-600 to-cyan-500',
      description: 'Conversion-focused websites built to turn visitors into calls, leads, and booked jobs.' },
    { icon: <Search className="w-7 h-7" />, title: 'SEO Optimization', color: 'from-purple-600 to-pink-500',
      description: 'Rank on Google and get found by customers actively searching for your services.' },
    { icon: <BarChart3 className="w-7 h-7" />, title: 'Paid Ads', color: 'from-orange-500 to-red-500',
      description: 'Instant leads using proven ad systems on Google & Facebook — ROI-focused from day one.' },
    { icon: <Users className="w-7 h-7" />, title: 'Social Media', color: 'from-green-500 to-teal-500',
      description: 'Stay visible, build trust, and turn followers into paying customers consistently.' },
  ];

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">What We Do</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-4">CORE SERVICES</h2>
          <p className="text-gray-400 max-w-xl mx-auto text-lg">Everything you need to dominate your market online — built and managed for you.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }} viewport={{ once: true }}>
              <TiltCard className="h-full">
                <div className="neon-card p-8 h-full group">
                  <div className={`mb-5 p-3 rounded-xl inline-flex bg-gradient-to-br ${service.color} bg-opacity-10 text-white group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`bg-gradient-to-br ${service.color} bg-clip-text`}>{service.icon}</div>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── Why Choose Us ───────────────────────────────────────── */
const WhyChooseUs = () => {
  const features = [
    { icon: <Rocket className="w-5 h-5" />, title: 'Lead Generation First', description: 'Every design decision is made to generate calls, form fills, and booked jobs.' },
    { icon: <Clock className="w-5 h-5" />, title: '3–7 Day Launch', description: 'We move fast without sacrificing quality. See results in days, not months.' },
    { icon: <Search className="w-5 h-5" />, title: 'SEO + Ads Built In', description: 'Traffic strategies baked in from the start — no expensive upsells.' },
    { icon: <ShieldCheck className="w-5 h-5" />, title: 'You Own Everything', description: 'No vendor lock-in. Your domain, your content, your site — always.' },
    { icon: <TrendingUp className="w-5 h-5" />, title: 'Proven Track Record', description: 'Real results for real businesses. Check our portfolio to see the proof.' },
  ];

  return (
    <section className="py-24 bg-[#040a16] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/6 blur-[100px] rounded-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="neon-badge mb-5">Why VCV?</p>
            <h2 className="font-display text-5xl md:text-6xl text-white mb-6 leading-tight">
              WHY BUSINESSES <br />
              <span className="gradient-text">CHOOSE US</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 leading-relaxed">
              We don't just build websites — we build{' '}
              <MarkerHighlight
                highlight="growth engines"
                markerColor="rgba(124, 58, 237, 0.82)"
                delay={0.15}
              />{' '}
              tuned to your market. Our focus is always on one metric: your return on investment.
            </p>
            <div className="space-y-5">
              {features.map((f, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                  className="flex gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 flex items-center justify-center text-blue-400 flex-shrink-0 group-hover:bg-blue-600/25 transition-colors">
                    {f.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-0.5">{f.title}</h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }} viewport={{ once: true }} className="relative mockup-box">
            <div className="browser-mockup aspect-video flex flex-col">
              <div className="browser-top"><span /><span /><span /></div>
              <div className="flex-1 p-6 bg-[#080e1c] flex flex-col gap-3">
                <div className="h-4 bg-white/5 rounded w-1/3 mb-3" />
                <div className="grid grid-cols-3 gap-3 flex-1">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white/[0.03] rounded-xl border border-white/5 p-3 flex flex-col justify-end">
                      <div className="flex-1 flex items-end gap-1">
                        {[40, 65, 50, 80, 70, 90].map((h, j) => (
                          <div key={j} className="flex-1 rounded-sm" style={{
                            height: `${h}%`,
                            background: `rgba(37,99,235,${0.3 + j * 0.08})`
                          }} />
                        ))}
                      </div>
                      <div className="h-2 bg-white/10 rounded mt-2 w-3/4" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ─── Process Section ─────────────────────────────────────── */
const ProcessSection = () => {
  const steps = [
    { n: '01', title: 'Request Free Demo', desc: 'Tell us about your business and we build you a free custom preview.' },
    { n: '02', title: 'We Design It', desc: 'Our team creates a conversion-focused layout for your niche in 48 hours.' },
    { n: '03', title: 'You Review & Approve', desc: 'Give feedback, request changes — we iterate until it\'s perfect.' },
    { n: '04', title: 'We Launch', desc: 'Full technical setup, domain, hosting, and go-live in 3–7 days.' },
    { n: '05', title: 'Leads Come In', desc: 'Your site works 24/7 generating calls, texts, and booked jobs.' },
  ];

  return (
    <section className="py-24 bg-[#030712] relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">How It Works</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-4">THE PROCESS</h2>
          <p className="text-gray-400 text-lg">Simple, fast, and built for results.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, idx) => (
            <motion.div key={idx}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.12 }} viewport={{ once: true }}
              className="relative neon-card p-6 group">
              <div className="font-display text-[3.5rem] leading-none gradient-text opacity-30 group-hover:opacity-60 transition-opacity mb-3">
                {step.n}
              </div>
              <h3 className="text-white font-bold mb-2 text-sm">{step.title}</h3>
              <p className="text-gray-400 text-xs leading-relaxed">{step.desc}</p>
              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-3 z-10">
                  <ArrowRight className="w-5 h-5 text-blue-600/50" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── CTA Section ─────────────────────────────────────────── */
const CTASection = () => (
  <section className="relative overflow-hidden bg-[#030712] flex flex-col items-center justify-center min-h-[600px] py-28">
    {/* Interactive boxes background */}
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Boxes />
    </div>

    {/* Radial mask: transparent center fades to site bg color at edges */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{
        background: 'radial-gradient(ellipse at center, transparent 20%, #030712 75%)',
      }}
    />

    {/* Subtle blue/purple tint layer to keep the color scheme */}
    <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-blue-950/20 via-transparent to-purple-950/20" />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-6 mx-auto w-fit">Limited Time — Act Now</p>
        <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
          GET YOUR <br />
          <span className="gradient-text glitch" data-text="FREE DEMO">FREE DEMO</span>
          <br />TODAY
        </h2>
        <p className="text-gray-400 text-xl mb-10 max-w-xl mx-auto">
          No risk. No commitment. Just a professional preview of your business's future — built for free.
        </p>
        <Link to="/free-demo"
          className="btn-glow btn-neon text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 group">
          Build My Free Demo
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </Link>
        <p className="text-gray-500 text-sm mt-6">No credit card required · Ready in 48 hours · 100% free</p>
      </motion.div>
    </div>
  </section>
);

/* ─── SEO Text ────────────────────────────────────────────── */
const SEOContent = () => (
  <section className="relative overflow-hidden bg-[#030712] py-20">
    {/* Interactive boxes background */}
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Boxes />
    </div>

    {/* Radial mask fades boxes into site background */}
    <div
      className="absolute inset-0 z-10 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, transparent 10%, #030712 70%)' }}
    />

    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-gray-500">
      <h2 className="text-2xl font-bold text-gray-300 mb-4">Website Design & Lead Generation for Local Businesses</h2>
      <p className="mb-3 text-sm leading-relaxed">VCV Web Solutions helps local businesses generate more leads, calls, and customers through high-converting websites, SEO optimization, and paid advertising systems. Whether you're a contractor, restaurant, or service-based business, our websites are built to rank on Google and turn visitors into paying customers.</p>
      <p className="text-sm leading-relaxed">Our team of experts is dedicated to your success. We take the time to understand your business goals and create a custom strategy that works for you. Let us help you take your business to the next level with a website that works as hard as you do.</p>
    </div>
  </section>
);

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="bg-[#030712]">
      <Hero />
      <MarqueeBand />
      <StatsSection />
      <PerfectFor />
      <DemoSection />
      <WhatHappensNextSection />
      <ServicesOverview />
      <WatchHowItWorksSection />
      <LeadMagnetSection />
      <WhyChooseUs />
      <TestimonialsSection />
      <ProcessSection />
      <ValueStackSection />
      <PricingSection />
      <UrgencySection />
      <FAQSection />
      <SEOContent />
      <CTASection />
    </div>
  );
}
