import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence, LayoutGroup } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Rocket, BarChart3, Users, Layout, ShieldCheck, Search, Zap, TrendingUp, MousePointer, Clock, Award, Hammer, Wrench, Thermometer, Leaf, Sparkles, UtensilsCrossed, Store, Paintbrush, Car, Building2, Scissors, Dumbbell, GraduationCap, Truck, Bug, Sun, Stethoscope, Scale, PawPrint, HardHat, TreePine } from 'lucide-react';
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

/* ─── Static Electricity Canvas ───────────────────────────── */
const StaticElectricity = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const COLORS = ['#2563eb','#7c3aed','#06b6d4','#a855f7','#93c5fd','#c4b5fd','#e0e7ff'];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    // Zigzag arc: random midpoints between two endpoints
    const drawArc = (
      x1: number, y1: number, x2: number, y2: number,
      segs: number, alpha: number, color: string, lw: number,
    ) => {
      const dx = x2 - x1, dy = y2 - y1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      for (let i = 1; i < segs; i++) {
        const t = i / segs;
        const spread = 30 + Math.hypot(dx, dy) * 0.25;
        ctx.lineTo(
          x1 + dx * t + (Math.random() - 0.5) * spread,
          y1 + dy * t + (Math.random() - 0.5) * spread,
        );
      }
      ctx.lineTo(x2, y2);
      ctx.globalAlpha  = alpha;
      ctx.strokeStyle  = color;
      ctx.lineWidth    = lw;
      ctx.shadowBlur   = 18;
      ctx.shadowColor  = color;
      ctx.stroke();
      ctx.shadowBlur   = 0;
    };

    const animate = () => {
      // Soft trail — don't fully clear, leave ghost of previous bolts
      ctx.globalAlpha = 0.22;
      ctx.fillStyle   = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;

      const W = canvas.width, H = canvas.height;

      // 4-9 attempts per frame; each has a ~55% chance to actually fire
      const attempts = 4 + Math.floor(Math.random() * 6);
      for (let i = 0; i < attempts; i++) {
        if (Math.random() > 0.55) continue;

        const color   = COLORS[Math.floor(Math.random() * COLORS.length)];
        const alpha   = 0.25 + Math.random() * 0.75;
        const x1      = Math.random() * W;
        const y1      = Math.random() * H;
        const isBolt  = Math.random() < 0.25;        // longer bolt vs short arc
        const reach   = isBolt ? 120 + Math.random() * 220 : 18 + Math.random() * 75;
        const angle   = Math.random() * Math.PI * 2;
        const x2      = x1 + Math.cos(angle) * reach;
        const y2      = y1 + Math.sin(angle) * reach;

        drawArc(x1, y1, x2, y2, isBolt ? 7 : 3, alpha, color, isBolt ? 1.4 : 0.6);

        // Random branch off the midpoint of bolts
        if (isBolt && Math.random() < 0.65) {
          const mx  = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
          const my  = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
          const bx  = mx + (Math.random() - 0.5) * 100;
          const by  = my + (Math.random() - 0.5) * 100;
          drawArc(mx, my, bx, by, 4, alpha * 0.55, color, 0.55);

          // Occasional second branch
          if (Math.random() < 0.3) {
            const bx2 = mx + (Math.random() - 0.5) * 70;
            const by2 = my + (Math.random() - 0.5) * 70;
            drawArc(mx, my, bx2, by2, 3, alpha * 0.35, color, 0.4);
          }
        }
      }

      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener('resize', resize);
    animate();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.9 }}
    />
  );
};

/* ─── Stats Section — shuffle + shape morph + electricity ─── */
interface StatCardDef {
  id: number;
  icon: React.ReactNode;
  val: number;
  suf?: string;
  pre?: string;
  label: string;
  rotDelay: number;
}

const STAT_CARDS: StatCardDef[] = [
  { id: 0, icon: <Award       className="w-6 h-6" />, val: 50, suf: '+',         label: 'Websites Launched',   rotDelay: 0   },
  { id: 1, icon: <Users       className="w-6 h-6" />, val: 98, suf: '%',         label: 'Client Satisfaction', rotDelay: 1.2 },
  { id: 2, icon: <Clock       className="w-6 h-6" />, val: 5,  suf: ' Days Avg', label: 'Launch Time',         rotDelay: 2.4 },
  { id: 3, icon: <ShieldCheck className="w-6 h-6" />, val: 0,  pre: '$', suf: ' Upfront', label: 'Risk-Free Start', rotDelay: 3.6 },
];

interface StatCardProps extends StatCardDef { isSquare: boolean }

const StatCard = ({ id, icon, val, suf = '', pre = '', label, rotDelay, isSquare }: StatCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 220, h: 148 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const { w, h } = dims;
  const r = 20;
  const borderPath = `M ${r} 0 L ${w-r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h-r} Q ${w} ${h} ${w-r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h-r} L 0 ${r} Q 0 0 ${r} 0 Z`;
  const dotDur = 2.6 + rotDelay * 0.42;
  const uid = `sc-${id}`;

  return (
    <div style={{ perspective: '700px' }}>
      <motion.div
        ref={cardRef}
        className="glass-card noise-texture text-center relative"
        animate={{
          rotateY:       [-5, 5, -5],
          rotateX:       [2, -2, 2],
          paddingTop:    isSquare ? '44px' : '28px',
          paddingBottom: isSquare ? '44px' : '28px',
          paddingLeft:   '28px',
          paddingRight:  '28px',
        }}
        transition={{
          rotateY:       { duration: 4.5 + rotDelay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: rotDelay * 0.85 },
          rotateX:       { duration: 4.5 + rotDelay, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: rotDelay * 0.85 },
          paddingTop:    { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
          paddingBottom: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
        }}>

        {/* Traveling glow dot */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%"
          viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', zIndex: 5 }}>
          <defs>
            <filter id={`glow-${uid}`} x="-70%" y="-70%" width="240%" height="240%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          <circle r="13" fill="rgba(37,99,235,0.16)"  filter={`url(#glow-${uid})`}><animateMotion dur={`${dotDur}s`} repeatCount="indefinite" path={borderPath}/></circle>
          <circle r="5.5" fill="rgba(139,92,246,0.8)"  filter={`url(#glow-${uid})`}><animateMotion dur={`${dotDur}s`} repeatCount="indefinite" path={borderPath}/></circle>
          <circle r="2.5" fill="white"                  filter={`url(#glow-${uid})`}><animateMotion dur={`${dotDur}s`} repeatCount="indefinite" path={borderPath}/></circle>
        </svg>

        <div className="relative z-10 text-blue-400 mb-3 flex justify-center">{icon}</div>
        <div className="relative z-10 font-display text-5xl gradient-text mb-1">
          <Counter target={val} prefix={pre} suffix={suf} />
        </div>
        <p className="relative z-10 text-gray-500 text-xs uppercase tracking-widest font-semibold">{label}</p>
      </motion.div>
    </div>
  );
};

const StatsSection = () => {
  const [order,  setOrder]  = useState([0, 1, 2, 3]);
  const [shapes, setShapes] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    // Swap two random cards every 2.5 s
    const shuffleId = setInterval(() => {
      setOrder(prev => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        let j = Math.floor(Math.random() * next.length);
        while (j === i) j = Math.floor(Math.random() * next.length);
        [next[i], next[j]] = [next[j], next[i]];
        return next;
      });
    }, 2500);

    // Randomly toggle some cards to square every 3 s
    const shapeId = setInterval(() => {
      setShapes(STAT_CARDS.map(() => Math.random() < 0.45));
    }, 3000);

    return () => { clearInterval(shuffleId); clearInterval(shapeId); };
  }, []);

  return (
    <section className="py-20 relative overflow-hidden bg-[#030712]">
      {/* Static electricity fills the entire section behind cards */}
      <StaticElectricity />
      <div className="absolute inset-0 bg-dot opacity-25 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <LayoutGroup id="stats-cards">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {order.map((cardIdx, pos) => {
              const card = STAT_CARDS[cardIdx];
              return (
                <motion.div
                  key={card.id}
                  layout
                  layoutId={`stat-${card.id}`}
                  transition={{ layout: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } }}>
                  <StatCard {...card} isSquare={shapes[pos]} />
                </motion.div>
              );
            })}
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
};

/* ─── Perfect For ─────────────────────────────────────────── */
interface Biz {
  id: number;
  name: string;
  Icon: React.ElementType;
  color: string;
  stat: string;
  detail: string;
}

const BUSINESSES: Biz[] = [
  { id: 0,  name: 'Contractors',      Icon: Hammer,          color: '#ff3d71', stat: '3× more project bids',            detail: '82% of homeowners research contractors online before calling. A portfolio site with photos and reviews closes more bids than any cold call ever could.' },
  { id: 1,  name: 'Roofers',          Icon: HardHat,         color: '#ff6b35', stat: '400% lead spike after storms',     detail: 'After hail hits, homeowners Google "roof repair near me" within hours. Ranking #1 in those moments is worth thousands of dollars per storm season.' },
  { id: 2,  name: 'Plumbers',         Icon: Wrench,          color: '#00e5ff', stat: '6 in 10 searches = same-day call',  detail: 'Plumbing emergencies don\'t wait. When a pipe bursts at midnight, customers hire whoever shows up first in search results. That should be you.' },
  { id: 3,  name: 'HVAC Companies',   Icon: Thermometer,     color: '#39ff14', stat: 'Capture seasonal demand peaks',    detail: 'AC failures in July and furnace outages in January create massive call surges. Online booking captures customers while your competitors\' phones are busy.' },
  { id: 4,  name: 'Landscapers',      Icon: Leaf,            color: '#76ff03', stat: 'Spring = your biggest window',     detail: 'Homeowners plan their yards in late winter. A site with before/after photos and seasonal packages locks in customers 2 months before the phone rings.' },
  { id: 5,  name: 'Cleaning Services',Icon: Sparkles,        color: '#00ffcc', stat: '74% book recurring via web form',  detail: 'Recurring clients are the lifeblood of cleaning businesses. An online booking form converts one-time visitors into monthly contracts automatically.' },
  { id: 6,  name: 'Restaurants',      Icon: UtensilsCrossed, color: '#ff00ff', stat: '90% look up menu before visiting', detail: 'If your menu, hours, and location aren\'t easy to find on Google, customers choose someone else. A fast mobile site with online ordering keeps tables full.' },
  { id: 7,  name: 'Auto Repair',      Icon: Car,             color: '#ffcc00', stat: '+55% more first-time appointments', detail: 'Trust is everything in auto repair. A professional site with reviews, services, and transparent pricing turns strangers into loyal customers.' },
  { id: 8,  name: 'Electricians',     Icon: Zap,             color: '#ffe600', stat: 'Urgent calls = highest margins',   detail: 'Electrical emergencies command premium pricing. Ranking for "emergency electrician near me" fills your calendar with the highest-value jobs in your area.' },
  { id: 9,  name: 'Painters',         Icon: Paintbrush,      color: '#ff69b4', stat: 'Portfolio = your #1 closer',       detail: 'A gallery of finished projects sells your work before you ever show up. Homeowners comparing painters hire the one with the most impressive visual proof.' },
  { id: 10, name: 'Real Estate',      Icon: Building2,       color: '#00bfff', stat: 'Listings viewed 4× more online',   detail: 'Property buyers search online first, always. A site with neighborhood guides positions you as the local expert before first contact.' },
  { id: 11, name: 'Hair Salons',      Icon: Scissors,        color: '#ff0099', stat: '68% book appointments online',     detail: 'Clients hate calling to book. An online booking system with stylist profiles fills your chair while you sleep — no receptionist required.' },
  { id: 12, name: 'Gyms & Fitness',   Icon: Dumbbell,        color: '#40e0d0', stat: 'January surge = $50k opportunity', detail: 'New Year\'s resolution season brings thousands of local searches. A site with class schedules, trainer bios, and trial offers converts that traffic into memberships.' },
  { id: 13, name: 'Tutors & Coaches', Icon: GraduationCap,   color: '#bf00ff', stat: 'Parents pay premium for credibility', detail: 'Parents hiring tutors want proof of results. A clean site with credentials, testimonials, and a contact form converts skeptical parents into paying clients.' },
  { id: 14, name: 'Moving Companies', Icon: Truck,           color: '#ff8800', stat: 'Quotes 24/7 = 40% more leads',     detail: 'People plan moves at all hours. An online quote form that works at 2am captures leads your competitors miss because their office is closed.' },
  { id: 15, name: 'Pest Control',     Icon: Bug,             color: '#7dff4f', stat: 'Emergency searches = instant jobs', detail: 'Nobody waits when they find pests. Showing up in "pest control near me" searches with clear pricing and same-day availability books jobs on the spot.' },
  { id: 16, name: 'Solar Installers', Icon: Sun,             color: '#ffee00', stat: '$8k avg job from one web lead',     detail: 'Solar is a considered purchase — customers research for weeks. A site with savings calculators and project galleries shortens the sales cycle dramatically.' },
  { id: 17, name: 'Dental Offices',   Icon: Stethoscope,     color: '#00ffaa', stat: 'New patient forms = faster intake',  detail: 'Most patients pick a dentist the way they pick a restaurant — online reviews and a professional site. New patient web forms reduce front-desk workload by 60%.' },
  { id: 18, name: 'Law Firms',        Icon: Scale,           color: '#aa00ff', stat: 'Trust = $5k+ case value online',   detail: 'Clients hiring attorneys research extensively. A site with practice areas, attorney bios, and client testimonials converts high-value cases that would otherwise go to competitors.' },
  { id: 19, name: 'Vet Clinics',      Icon: PawPrint,        color: '#ff6699', stat: 'Pet owners research before first visit', detail: 'Pet owners are fiercely loyal once they trust a vet. A warm, professional site with staff bios, services, and online scheduling builds that trust before they walk in.' },
  { id: 20, name: 'Tree Services',    Icon: TreePine,        color: '#00ff88', stat: 'Storm season = surge demand',      detail: 'After major storms, tree removal demand spikes overnight. A site optimized for local search captures emergency calls worth $500–$5,000 per job.' },
  { id: 21, name: 'Home Services',    Icon: Store,           color: '#1e90ff', stat: 'Repeat customers = 5× value',      detail: 'Any home service business with a professional website earns 47% more per customer because trust is already established before the first conversation.' },
];

/* Sub-components defined outside to prevent recreation on render */
const BizCard = ({ biz, onEnter, onLeave }: {
  biz: Biz;
  onEnter: (biz: Biz, e: React.MouseEvent<HTMLButtonElement>) => void;
  onLeave: () => void;
}) => (
  <button
    onMouseEnter={(e) => onEnter(biz, e)}
    onMouseLeave={onLeave}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 16px', marginBottom: 8, width: '100%',
      background: 'rgba(8,12,28,0.72)',
      border: `1px solid ${biz.color}30`,
      borderRadius: 12,
      cursor: 'pointer',
      backdropFilter: 'blur(8px)',
      transition: 'border-color 0.2s, background 0.2s, box-shadow 0.2s',
      textAlign: 'left',
    }}
    onFocus={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${biz.color}70`; }}
    onBlur={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = `${biz.color}30`; }}
  >
    <biz.Icon size={15} style={{ color: biz.color, flexShrink: 0 }} />
    <span style={{
      color: biz.color,
      fontWeight: 700, fontSize: '12px',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      textShadow: `0 0 14px ${biz.color}70`,
      whiteSpace: 'nowrap',
    }}>
      {biz.name}
    </span>
  </button>
);

interface ColumnProps {
  items: Biz[];
  direction: 'up' | 'down';
  duration: number;
  paused: boolean;
  onEnter: (biz: Biz, e: React.MouseEvent<HTMLButtonElement>) => void;
  onLeave: () => void;
}
const BizColumn = ({ items, direction, duration, paused, onEnter, onLeave }: ColumnProps) => {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', height: '100%' }}>
      <div style={{
        animation: `${direction === 'up' ? 'scrollUp' : 'scrollDown'} ${duration}s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
      }}>
        {doubled.map((biz, i) => (
          <BizCard key={`${biz.id}-${i}`} biz={biz} onEnter={onEnter} onLeave={onLeave} />
        ))}
      </div>
    </div>
  );
};

const PerfectFor = () => {
  const [popup, setPopup] = useState<{ biz: Biz; rect: DOMRect } | null>(null);
  const [paused, setPaused] = useState(false);

  const handleEnter = (biz: Biz, e: React.MouseEvent<HTMLButtonElement>) => {
    setPopup({ biz, rect: e.currentTarget.getBoundingClientRect() });
    setPaused(true);
  };
  const handleLeave = () => { setPopup(null); setPaused(false); };

  const col1 = BUSINESSES.slice(0, 8);
  const col2 = BUSINESSES.slice(8, 15);
  const col3 = BUSINESSES.slice(15, 22);

  const popupWidth = 320;
  const popupLeft = popup
    ? Math.max(12, Math.min(
        (typeof window !== 'undefined' ? window.innerWidth : 1280) - popupWidth - 12,
        popup.rect.left + popup.rect.width / 2 - popupWidth / 2,
      ))
    : 0;
  const popupAbove = popup ? popup.rect.top > 260 : true;

  return (
    <section className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #030712 0%, #050c1a 60%, #030712 100%)', borderTop: '1px solid rgba(37,99,235,0.12)', borderBottom: '1px solid rgba(37,99,235,0.12)' }}>

      {/* Heading */}
      <div className="text-center mb-10">
        <p className="neon-badge mx-auto w-fit mb-3">Who We Help</p>
        <h2 className="font-display text-5xl md:text-6xl text-white mb-2">PERFECT FOR</h2>
        <p className="text-gray-400 text-base">Hover any industry to see how a website grows that business</p>
      </div>

      {/* 3-column vertical scroll */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6" style={{ height: 440 }}>
        {/* Top + bottom fade masks */}
        <div className="absolute top-0 left-0 right-0 h-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, #050c1a 0%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to top, #050c1a 0%, transparent 100%)' }} />

        <div className="grid grid-cols-3 gap-4 h-full">
          <BizColumn items={col1} direction="up"   duration={20} paused={paused} onEnter={handleEnter} onLeave={handleLeave} />
          <BizColumn items={col2} direction="down" duration={26} paused={paused} onEnter={handleEnter} onLeave={handleLeave} />
          <BizColumn items={col3} direction="up"   duration={17} paused={paused} onEnter={handleEnter} onLeave={handleLeave} />
        </div>
      </div>

      {/* Popup — position:fixed escapes overflow:hidden */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup.biz.id}
            initial={{ opacity: 0, scale: 0.92, y: popupAbove ? 10 : -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'fixed',
              left: popupLeft,
              top: popupAbove ? popup.rect.top - 16 : popup.rect.bottom + 16,
              transform: popupAbove ? 'translateY(-100%)' : 'translateY(0)',
              width: popupWidth,
              zIndex: 9000,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background: 'rgba(6,10,22,0.98)',
              border: `1px solid ${popup.biz.color}45`,
              borderRadius: 16, padding: 20,
              boxShadow: `0 0 0 1px ${popup.biz.color}12, 0 24px 64px rgba(0,0,0,0.8), 0 0 50px ${popup.biz.color}18`,
              backdropFilter: 'blur(28px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{
                  width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                  background: `${popup.biz.color}1a`, border: `1px solid ${popup.biz.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: popup.biz.color,
                }}>
                  <popup.biz.Icon size={21} />
                </div>
                <div>
                  <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 17, lineHeight: 1.2, margin: '0 0 4px' }}>
                    {popup.biz.name}
                  </p>
                  <p style={{ color: popup.biz.color, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                    Why you need a website
                  </p>
                </div>
              </div>
              <div style={{
                background: `${popup.biz.color}18`, border: `1px solid ${popup.biz.color}35`,
                borderRadius: 10, padding: '9px 14px', marginBottom: 13,
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <TrendingUp size={13} style={{ color: popup.biz.color, flexShrink: 0 }} />
                <span style={{ color: '#e2e8f0', fontWeight: 700, fontSize: 13 }}>{popup.biz.stat}</span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{popup.biz.detail}</p>
            </div>
            {popupAbove ? (
              <div style={{
                position: 'absolute', bottom: -7,
                left: Math.max(18, Math.min(popupWidth - 26, popup.rect.left + popup.rect.width / 2 - popupLeft)),
                width: 14, height: 14, background: 'rgba(6,10,22,0.98)',
                border: `1px solid ${popup.biz.color}45`, borderTop: 'none', borderLeft: 'none',
                transform: 'rotate(45deg)',
              }} />
            ) : (
              <div style={{
                position: 'absolute', top: -7,
                left: Math.max(18, Math.min(popupWidth - 26, popup.rect.left + popup.rect.width / 2 - popupLeft)),
                width: 14, height: 14, background: 'rgba(6,10,22,0.98)',
                border: `1px solid ${popup.biz.color}45`, borderBottom: 'none', borderRight: 'none',
                transform: 'rotate(45deg)',
              }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

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
