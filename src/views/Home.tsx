'use client';
import { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';
import { motion, useInView, AnimatePresence, LayoutGroup } from 'motion/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import { ArrowRight, CheckCircle2, Globe, Rocket, BarChart3, Users, Layout, ShieldCheck, Search, Zap, TrendingUp, MousePointer, Clock, Award, Hammer, Wrench, Thermometer, Leaf, Sparkles, UtensilsCrossed, Store, Paintbrush, Car, Building2, Scissors, Dumbbell, GraduationCap, Truck, Bug, Sun, Stethoscope, Scale, PawPrint, HardHat, TreePine, Phone, ExternalLink, MessageCircle } from 'lucide-react';
import { Boxes } from '@/components/ui/background-boxes';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { INDUSTRIES } from '@/data/industries';

// Below-fold sections loaded lazily — each becomes its own JS chunk
/* WhatHappensNextSection + LeadMagnetSection imports removed — those components
   are no longer used on Home (replaced by the cleaner ProcessBand). They still
   live in /components if you want to put them on another route. */
const PricingSection      = dynamic(() => import('../components/PricingSection').then(m => ({ default: m.PricingSection })), { ssr: false });

/* ─── Particle Canvas ─────────────────────────────────────── */
const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;
    const mouse = { x: -1000, y: -1000 };

    // Color palette that cycles: blue → cyan → purple → green → pink → blue
    const COLORS: [number, number, number][] = [
      [37,  99,  235], // blue
      [6,   182, 212], // cyan
      [124, 58,  237], // purple
      [34,  197, 94],  // green
      [236, 72,  153], // pink
      [245, 158, 11],  // amber
    ];
    const lerpColor = (t: number): [number, number, number] => {
      const scaled = ((t % 1) + 1) % 1;
      const n = COLORS.length;
      const idx = scaled * n;
      const i = Math.floor(idx) % n;
      const j = (i + 1) % n;
      const f = idx - Math.floor(idx);
      return [
        Math.round(COLORS[i][0] * (1 - f) + COLORS[j][0] * f),
        Math.round(COLORS[i][1] * (1 - f) + COLORS[j][1] * f),
        Math.round(COLORS[i][2] * (1 - f) + COLORS[j][2] * f),
      ];
    };

    interface P { x: number; y: number; vx: number; vy: number; size: number; alpha: number; hue: number }
    let pts: P[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const spawn = () => {
      pts = [];
      const n = Math.min(110, Math.floor((canvas.width * canvas.height) / 11000));
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          size: Math.random() * 2.8 + 1.0,
          alpha: Math.random() * 0.6 + 0.35,
          hue: Math.random(), // each particle has its own colour offset
        });
      }
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Global colour cycle — full rotation every ~600 frames (~10s at 60fps)
      const globalT = frame / 600;

      pts.forEach((p, i) => {
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        p.x += p.vx; p.y += p.vy;

        // Each particle shifts colour at its own speed
        const t = globalT + p.hue;
        const [r, g, b] = lerpColor(t);

        // Dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${p.alpha})`;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 150) {
            const a = 0.55 * (1 - d / 150);
            // Blend colours of the two endpoints for the line
            const t2 = globalT + pts[j].hue;
            const [r2, g2, b2] = lerpColor(t2);
            const mr = Math.round((r + r2) / 2), mg = Math.round((g + g2) / 2), mb = Math.round((b + b2) / 2);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${mr},${mg},${mb},${a})`;
            ctx.lineWidth = 1.8;
            ctx.stroke();
          }
        }

        // Mouse attraction line
        const md = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (md < 180) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.7 * (1 - md / 180)})`;
          ctx.lineWidth = 2.2;
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
    const start = () => {
      if (triggered.current) return;
      triggered.current = true;
      const dur = 1600;
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setCount(Math.floor(ease * target));
        if (t < 1) requestAnimationFrame(tick);
        else setCount(target);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { start(); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    // Fire immediately if already in viewport
    if (el.getBoundingClientRect().top < window.innerHeight) start();
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

/* ─── Robot overlaid on MockUp ───────────────────────────── */

// All spots the robot visits across the mockup
const ROBOT_SPOTS = [
  { id:'bl', style:{ left:'-14%', bottom:'-6%' },               scaleX: 1,  w:230 }, // bottom-left
  { id:'br', style:{ right:'-14%', bottom:'-6%' },              scaleX:-1,  w:230 }, // bottom-right
  { id:'tl', style:{ left:'-10%', top:'-6%' },                  scaleX: 1,  w:165 }, // top-left
  { id:'tr', style:{ right:'-10%', top:'-6%' },                 scaleX:-1,  w:165 }, // top-right
  { id:'tc', style:{ left:'calc(50% - 75px)', top:'-8%' },      scaleX: 1,  w:150 }, // top-center
  { id:'ml', style:{ left:'-12%', top:'calc(50% - 90px)' },     scaleX: 1,  w:195 }, // mid-left
  { id:'mr', style:{ right:'-12%', top:'calc(50% - 90px)' },    scaleX:-1,  w:195 }, // mid-right
  { id:'bc', style:{ left:'calc(50% - 95px)', bottom:'-6%' },   scaleX: 1,  w:190 }, // bottom-center
];

const WORK_LABELS = [
  'Adding nav bar...',
  'Building hero...',
  'Optimizing SEO...',
  'Adding CTA button...',
  'Writing copy...',
  'Setting up forms...',
  'Styling layout...',
  'Launching site...',
];

const RobotMockup = () => {
  const [spotIdx, setSpotIdx] = useState(0);
  const [press,   setPress]   = useState(false);
  const [label,   setLabel]   = useState(WORK_LABELS[0]);

  useEffect(() => {
    const id = setInterval(() => {
      // Double-press before moving
      setPress(true);
      setTimeout(() => setPress(false), 280);
      setTimeout(() => setPress(true),  600);
      setTimeout(() => {
        setPress(false);
        setSpotIdx(i => {
          const next = (i + 1) % ROBOT_SPOTS.length;
          setLabel(WORK_LABELS[next % WORK_LABELS.length]);
          return next;
        });
      }, 900);
    }, 3600);
    return () => clearInterval(id);
  }, []);

  const spot = ROBOT_SPOTS[spotIdx];

  return (
    <div className="relative select-none" style={{ width:'100%' }}>
      <AnimatedMockup />

      {/* Work label badge */}
      <motion.div
        className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white z-20"
        style={{ background:'rgba(6,182,212,0.15)', border:'1px solid rgba(6,182,212,0.5)', backdropFilter:'blur(8px)' }}
        animate={{ boxShadow:['0 0 8px rgba(6,182,212,0.3)','0 0 24px rgba(6,182,212,0.8)','0 0 8px rgba(6,182,212,0.3)'] }}
        transition={{ duration:1.8, repeat:Infinity }}>
        <motion.span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block"
          animate={{ opacity:[1,0.2,1] }} transition={{ duration:0.6, repeat:Infinity }}/>
        <AnimatePresence mode="wait">
          <motion.span key={label}
            initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
            exit={{ opacity:0, y:6 }} transition={{ duration:0.25 }}>
            {label}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Robot — slides to each spot */}
      <AnimatePresence mode="wait">
        <motion.div key={spot.id}
          className="absolute pointer-events-none"
          style={{ ...spot.style, width: spot.w, zIndex:10 }}
          initial={{ opacity:0, scale:0.75 }}
          animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0, scale:0.75 }}
          transition={{ duration:0.5, ease:'backOut' }}>

          {/* Glow */}
          <div className="absolute inset-0 blur-[40px] pointer-events-none"
            style={{ background:'radial-gradient(ellipse at 55% 55%, rgba(6,182,212,0.55), rgba(59,130,246,0.3), transparent 70%)' }}/>

          {/* Robot body with full building motion */}
          <motion.div
            style={{ scaleX: spot.scaleX }}
            animate={{
              y:      [0, -16, -5, -22, -12, -18, -4, 0, 6, 0],
              rotate: [0, -2,   1,  -3,  0.5, -1.5, 0.5, 0, 1, 0],
              x:      press ? 16 : [0, -2, 2, -1, 0],
              scaleY: press ? 0.94 : 1,
            }}
            transition={{
              y:      { duration:3.8, repeat:Infinity, ease:'easeInOut', times:[0,.1,.25,.4,.5,.65,.75,.85,.93,1] },
              rotate: { duration:3.8, repeat:Infinity, ease:'easeInOut', times:[0,.1,.25,.4,.5,.65,.75,.85,.93,1] },
              x:      press ? { duration:0.2, ease:'easeOut' } : { duration:4, repeat:Infinity, ease:'easeInOut', times:[0,.25,.5,.75,1] },
              scaleY: { duration:0.16 },
            }}>

            <motion.img src="/ai-robot.png" alt="AI building" className="w-full"
              animate={{ filter:[
                'drop-shadow(0 0 12px rgba(6,182,212,0.9))  drop-shadow(0 0 24px rgba(59,130,246,0.5))  brightness(1.07)',
                'drop-shadow(0 0 22px rgba(59,130,246,1.0)) drop-shadow(0 0 45px rgba(139,92,246,0.7))  brightness(1.16)',
                'drop-shadow(0 0 18px rgba(6,182,212,1.0))  drop-shadow(0 0 36px rgba(59,130,246,0.6))  brightness(1.10)',
                'drop-shadow(0 0 12px rgba(6,182,212,0.9))  drop-shadow(0 0 24px rgba(59,130,246,0.5))  brightness(1.07)',
              ]}}
              transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}
            />

            {/* Fingertip press burst */}
            <AnimatePresence>
              {press && (
                <motion.div className="absolute rounded-full pointer-events-none"
                  style={{ right:-4, top:'43%', width:18, height:18,
                    background:'white',
                    boxShadow:'0 0 20px #06b6d4, 0 0 40px #3b82f6, 0 0 70px #8b5cf6' }}
                  initial={{ scale:0, opacity:1 }}
                  animate={{ scale:[0,3.5,0], opacity:[1,0.85,0] }}
                  exit={{ opacity:0 }}
                  transition={{ duration:0.5 }}
                />
              )}
            </AnimatePresence>

            {/* Particle stream from fingertip */}
            {[0,1,2,3,4,5].map(i => (
              <motion.div key={i}
                className="absolute rounded-full pointer-events-none"
                style={{ right:0, top:'45%', width:4+i%2, height:4+i%2,
                  background:['#06b6d4','#3b82f6','#8b5cf6','#22c55e','#06b6d4','#ec4899'][i],
                  boxShadow:`0 0 8px ${ ['#06b6d4','#3b82f6','#8b5cf6','#22c55e','#06b6d4','#ec4899'][i] }` }}
                animate={{ x:[0,18,45,75,100], y:[0,-i*2,i,-i,0], opacity:[0,1,0.8,0.4,0], scale:[0.3,1.4,1,0.5,0.1] }}
                transition={{ duration:1.0, repeat:Infinity, ease:'easeOut', delay:i*0.18 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

/* ─── Hero Contact Form (replaces the old animated demo mockup) ── */
const HeroContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', business: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errMsg, setErrMsg] = useState('');

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrMsg('Please fill in Name, Email, and Message.'); setStatus('error'); return;
    }
    setStatus('loading'); setErrMsg('');
    try {
      const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
      const { db } = await import('../firebase');
      const { getAttribution } = await import('@/lib/attribution');
      const attribution = getAttribution();
      await addDoc(collection(db, 'leads'), {
        ...form, ...attribution, createdAt: serverTimestamp(), status: 'new', source: 'Home Hero Form',
      });
      const res = await fetch('/api/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, ...attribution, source: 'Home Hero Form' }),
      });
      if (!res.ok) throw new Error('Failed to send');
      // Fire GA4 generate_lead + Meta Pixel Lead so this conversion shows up
      // in attribution reports and ad-platform Conversions APIs.
      const { trackLead } = await import('@/components/Analytics');
      trackLead('Home Hero Form');
      setStatus('success'); setForm({ name: '', email: '', phone: '', business: '', message: '' });
    } catch { setErrMsg('Something went wrong. Please try again.'); setStatus('error'); }
  };

  const baseInput = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-blue-500/60 focus:bg-white/10 transition-colors';

  return (
    <div className="relative">
      {/* Soft glow behind card */}
      <div className="absolute -inset-3 rounded-3xl pointer-events-none"
        style={{ background:'radial-gradient(ellipse at center, rgba(59,130,246,0.25), rgba(124,58,237,0.15), transparent 70%)', filter:'blur(28px)' }}/>

      <div className="relative rounded-3xl p-7 md:p-8"
        style={{ background:'rgba(6,10,22,0.96)', border:'1px solid rgba(255,255,255,0.10)',
                 boxShadow:'0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.18)' }}>

        {status === 'success' ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ background:'rgba(34,197,94,0.15)', border:'1px solid rgba(34,197,94,0.45)' }}>
              <CheckCircle2 className="w-7 h-7 text-green-400"/>
            </div>
            <h3 className="text-white font-bold text-2xl mb-2">Thanks!</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              We&apos;ll get back to you within 24 hours with your free design preview.
            </p>
            <button onClick={() => setStatus('idle')}
              className="text-blue-400 hover:text-blue-300 text-xs font-semibold uppercase tracking-wider">
              Send another →
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <p className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.22em] mb-2">Free Design Preview</p>
              <h3 className="font-display text-white text-2xl md:text-3xl leading-tight">
                Get your custom demo<br/>built for free.
              </h3>
              <p className="text-gray-400 text-xs mt-2">No credit card · We reply within 24 hrs</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text" required value={form.name} onChange={set('name')}
                placeholder="Your name" aria-label="Your name" autoComplete="name"
                className={baseInput}
              />
              <input
                type="email" required value={form.email} onChange={set('email')}
                placeholder="you@example.com" aria-label="Email address" autoComplete="email"
                className={baseInput}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="tel" value={form.phone} onChange={set('phone')}
                  placeholder="Phone (optional)" aria-label="Phone number" autoComplete="tel"
                  className={baseInput}
                />
                <input
                  type="text" value={form.business} onChange={set('business')}
                  placeholder="Business name" aria-label="Business name" autoComplete="organization"
                  className={baseInput}
                />
              </div>
              <textarea
                required value={form.message} onChange={set('message')}
                placeholder="Tell us about your business and what you need"
                aria-label="Tell us about your business" rows={3}
                className={baseInput + ' resize-none'}
              />

              {errMsg && (
                <p className="text-red-400 text-xs font-semibold">{errMsg}</p>
              )}

              <button type="submit" disabled={status === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 flex items-center justify-center gap-2">
                {status === 'loading' ? 'Sending…' : <>Get My Free Demo <ArrowRight className="w-4 h-4"/></>}
              </button>

              <p className="text-center text-gray-600 text-[10px] tracking-wide">
                Or call <a href="tel:+15809191386" className="text-blue-400 font-semibold hover:underline">(580) 919-1386</a>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

/* ─── Hero ────────────────────────────────────────────────── */
const Hero = () => (
  <section className="relative flex items-center pt-28 pb-6" style={{ overflowX: 'hidden', overflowY: 'hidden', minHeight: 'calc(100vh - 80px)', background:'#030712' }}>

    {/* Background video, ParticleCanvas, and animated orbs removed for performance. */}
    {/* Quiet static gradient backdrop */}
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex:1,
      background:'radial-gradient(ellipse at 20% 30%, rgba(37,99,235,0.10) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(124,58,237,0.08) 0%, transparent 55%), #030712' }} />
    <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none" style={{ zIndex:1,
      background:'linear-gradient(to bottom,transparent,#030712)' }} />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
      <div className="grid lg:grid-cols-2 gap-12 items-center">

        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          {/* Single-color availability badge — replaces the rainbow cycling banner
              that was visually fighting the rest of the page. */}
          <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(34,197,94,0.10)', border: '1px solid rgba(34,197,94,0.35)' }}>
            <motion.span className="w-2 h-2 rounded-full bg-green-400 inline-block"
              animate={{ opacity: [1, 0.35, 1], scale: [1, 1.25, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}/>
            <span className="text-green-300 text-[11px] font-bold uppercase tracking-[0.18em]">
              Now taking new clients · Limited spots
            </span>
          </div>

          {/* Headline — fluid sizing, single h1 for SEO, gradient on the key word
              (no glitch / 3D effects competing with the right-side form). */}
          <h1 className="font-display text-white leading-[1.02] mb-7 tracking-tight"
            style={{ fontSize: 'clamp(3rem, 8.5vw, 6.5rem)' }}>
            We build websites<br/>
            that <span className="gradient-text">generate leads.</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 max-w-[540px]">
            Stop paying for pretty sites that don&apos;t convert. We engineer
            high-performance lead machines for local service businesses —
            launching in 3–7 days.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-9">
            <FreeDemoButton size="md" label="Get My Free Demo" />
            <a href="tel:+15809191386"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full font-semibold text-sm text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] transition-colors">
              <Phone className="w-4 h-4 text-green-400" />
              (580) 919-1386
            </a>
          </div>

          {/* Combined trust strip: 5-star social proof + the three quick facts.
              Renders on one line on desktop, wraps cleanly on mobile. */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 15l-5.6 3.2L5.8 11.9 1 7.5l6.4-.6L10 1z"/>
                  </svg>
                ))}
              </span>
              <span className="text-gray-300 text-sm font-semibold">4.9 · 50+ small businesses</span>
            </div>
            <span className="hidden sm:inline text-gray-700">·</span>
            {['From $97/mo', '3–7 day launch', '30-day guarantee'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Contact form (replaces the demo robot mockup) ── */}
        <motion.div
          initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
          transition={{ duration:0.9, delay:0.2 }}
          className="hidden lg:block">
          <HeroContactForm />
        </motion.div>
      </div>
    </div>

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
const StaticElectricity = ({
  hitRectsRef,
  onHit,
}: {
  hitRectsRef?: MutableRefObject<(DOMRect | null)[]>;
  onHit?: (pos: number) => void;
} = {}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const COLORS = ['#2563eb','#7c3aed','#06b6d4','#a855f7','#93c5fd','#c4b5fd','#e0e7ff'];
    const hitCooldowns: number[] = [];

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

        drawArc(x1, y1, x2, y2, isBolt ? 7 : 3, alpha, color, isBolt ? 1.8 : 0.7);

        // Check if bolt endpoint hits a card
        if (hitRectsRef?.current && onHit) {
          const now = performance.now();
          const canvasBR = canvas.getBoundingClientRect();
          hitRectsRef.current.forEach((rect, idx) => {
            if (!rect) return;
            if (now - (hitCooldowns[idx] || 0) < 12000) return; // 12s cooldown per card
            const lx = rect.left - canvasBR.left;
            const ly = rect.top  - canvasBR.top;
            if (x2 >= lx && x2 <= lx + rect.width && y2 >= ly && y2 <= ly + rect.height) {
              hitCooldowns[idx] = now;
              onHit(idx);
            }
          });
        }

        // Random branch off the midpoint of bolts
        if (isBolt && Math.random() < 0.65) {
          const mx  = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
          const my  = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;
          const bx  = mx + (Math.random() - 0.5) * 100;
          const by  = my + (Math.random() - 0.5) * 100;
          drawArc(mx, my, bx, by, 4, alpha * 0.55, color, 0.7);

          // Occasional second branch
          if (Math.random() < 0.3) {
            const bx2 = mx + (Math.random() - 0.5) * 70;
            const by2 = my + (Math.random() - 0.5) * 70;
            drawArc(mx, my, bx2, by2, 3, alpha * 0.35, color, 0.5);
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

/* Stationary stat card. The previous version had constant 3D rotation, a
   traveling glow dot, and shape morphing — three competing animations
   that made the numbers hard to read. Now it's a clean premium card
   with a single icon + count-up number + label. Hovering lifts and
   subtly glows. That's it. */
const StatCard = ({ icon, val, suf = '', pre = '', label }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -3 }}
    transition={{ type: 'spring', stiffness: 280, damping: 22 }}
    className="relative p-6 md:p-7 rounded-2xl text-center group"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border:     '1px solid rgba(255,255,255,0.08)',
      transition: 'border-color 0.2s, background 0.2s',
    }}>
    {/* Soft glow on hover only */}
    <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
      style={{ boxShadow: '0 0 0 1px rgba(59,130,246,0.25), 0 20px 40px -20px rgba(59,130,246,0.30)' }}/>

    <div className="relative w-11 h-11 mx-auto mb-4 rounded-xl flex items-center justify-center"
      style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.30)' }}>
      <div className="text-blue-400">{icon}</div>
    </div>

    <div className="relative font-display text-4xl md:text-5xl text-white tracking-tight leading-none mb-2">
      <Counter target={val} prefix={pre} suffix={suf} />
    </div>
    <p className="relative text-gray-400 text-xs uppercase tracking-[0.18em] font-semibold">{label}</p>
  </motion.div>
);

/* Static stats grid — no shuffling, no shape morphing, no traveling dots.
   Premium read: clean 4-column grid, animated count-up on scroll-in,
   stationary thereafter so the numbers can actually be read. */
const StatsSection = () => (
  <section className="py-20 md:py-24 relative bg-[#030712]"
    style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute inset-0 bg-dot opacity-[0.10] pointer-events-none" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="text-center mb-10 md:mb-12">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">By the numbers</p>
        <h2 className="font-display text-white tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
          Real results, <span className="gradient-text">no fine print.</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 items-start">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}>
            <StatCard {...card} isSquare={false} />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Aurora background for PerfectFor ───────────────────── */
const AuroraCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    let animId: number; let t = 0;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    const BLOBS = [
      { bx:0.15, by:0.45, r:0.38, hue:220, spd:0.28 },
      { bx:0.80, by:0.25, r:0.32, hue:280, spd:0.35 },
      { bx:0.55, by:0.75, r:0.30, hue:170, spd:0.42 },
      { bx:0.10, by:0.80, r:0.28, hue: 20, spd:0.30 },
      { bx:0.88, by:0.65, r:0.34, hue: 80, spd:0.38 },
      { bx:0.42, by:0.15, r:0.26, hue:330, spd:0.45 },
      { bx:0.65, by:0.50, r:0.22, hue:130, spd:0.32 },
    ];
    const draw = () => {
      animId = requestAnimationFrame(draw);
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      BLOBS.forEach((b, i) => {
        const x = (b.bx + Math.sin(t * 0.25 + i * 1.1) * 0.10) * w;
        const y = (b.by + Math.cos(t * 0.20 + i * 0.8) * 0.09) * h;
        const r = b.r * Math.min(w, h);
        const hue = (b.hue + t * b.spd * 25) % 360;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, r);
        grd.addColorStop(0, `hsla(${hue},85%,58%,0.20)`);
        grd.addColorStop(0.5, `hsla(${hue},80%,50%,0.08)`);
        grd.addColorStop(1, `hsla(${hue},80%,50%,0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      });
      t += 0.008;
    };
    resize(); draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex:0 }} />;
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

/* ─── Physics bubble section ──────────────────────────────── */
interface Ball { id: number; biz: Biz; x: number; y: number; vx: number; vy: number; r: number; alive: boolean }

// Colorful background blobs — defined outside component to stay stable
const BG_BLOBS = [
  { color:'rgba(37,99,235,0.40)',   w:340, h:300, l:'3%',  t:'25%', dur:9  },
  { color:'rgba(124,58,237,0.35)',  w:300, h:320, l:'68%', t:'12%', dur:11 },
  { color:'rgba(6,182,212,0.30)',   w:260, h:260, l:'38%', t:'52%', dur:13 },
  { color:'rgba(34,197,94,0.25)',   w:220, h:240, l:'82%', t:'58%', dur:10 },
  { color:'rgba(236,72,153,0.28)',  w:200, h:210, l:'14%', t:'62%', dur:14 },
  { color:'rgba(245,158,11,0.22)',  w:240, h:190, l:'52%', t:'22%', dur:12 },
  { color:'rgba(99,102,241,0.25)',  w:180, h:200, l:'25%', t:'40%', dur:15 },
  { color:'rgba(20,184,166,0.22)',  w:200, h:180, l:'75%', t:'38%', dur:10 },
];
const TRAVEL_MS  = 2000;
const POPUP_MS   = 5000;

const PerfectFor = () => {
  const containerRef  = useRef<HTMLDivElement>(null);
  const ballsRef      = useRef<Ball[]>([]);
  const nodeRefs      = useRef<Map<number, HTMLDivElement>>(new Map());
  const rafRef        = useRef<number>(0);
  const popupRef      = useRef<{ biz: Biz; cx: number; cy: number } | null>(null);
  const travelTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [popup,      setPopup]      = useState<{ biz: Biz; cx: number; cy: number } | null>(null);
  const [ready,      setReady]      = useState(false);
  const [avatarXY,   setAvatarXY]   = useState({ x: -100, y: -100 });
  const [avatarAngle, setAvatarAngle] = useState(0);
  const [popBurst,   setPopBurst]   = useState<{ x: number; y: number; color: string } | null>(null);
  const [avatarBiz,  setAvatarBiz]  = useState<Biz | null>(null);
  const avatarCurr = useRef({ x: -100, y: -100 }); // tracks actual current pos for angle calc

  // keep popupRef in sync so travel callbacks see latest value
  useEffect(() => { popupRef.current = popup; }, [popup]);

  const triggerTravel = useCallback(() => {
    clearTimeout(travelTimer.current);
    const alive = ballsRef.current.filter(b => b.alive);
    if (!alive.length) { travelTimer.current = setTimeout(triggerTravel, 800); return; }
    const ball = alive[Math.floor(Math.random() * alive.length)];
    // Compute angle from current pos to target
    const dx = ball.x - avatarCurr.current.x;
    const dy = ball.y - avatarCurr.current.y;
    setAvatarAngle(Math.atan2(dy, dx) * 180 / Math.PI);
    avatarCurr.current = { x: ball.x, y: ball.y };
    setAvatarXY({ x: ball.x, y: ball.y });
    setAvatarBiz(ball.biz);
    travelTimer.current = setTimeout(() => {
      // pop burst at arrival position
      setPopBurst({ x: ball.x, y: ball.y, color: ball.biz.color });
      setTimeout(() => setPopBurst(null), 700);
      // only auto-popup when user hasn't opened one
      if (!popupRef.current) {
        const p = { biz: ball.biz, cx: ball.x, cy: ball.y };
        setPopup(p);
        travelTimer.current = setTimeout(() => {
          setPopup(null);
          travelTimer.current = setTimeout(triggerTravel, 700);
        }, POPUP_MS);
      } else {
        travelTimer.current = setTimeout(triggerTravel, 1500);
      }
    }, TRAVEL_MS + 150);
  }, []);

  useEffect(() => {
    const W = containerRef.current?.offsetWidth || 1200;
    const H = containerRef.current?.offsetHeight || 700;
    const CEIL = 0;

    ballsRef.current = BUSINESSES.map((biz, i) => {
      const cols = 5;
      const r = 52 + Math.random() * 22;
      const col = i % cols;
      const row = Math.floor(i / cols);
      return {
        id: i, biz, r,
        x: (col + 0.5) * (W / cols) + (Math.random() - 0.5) * 60,
        y: r + row * 90 + (Math.random() - 0.5) * 30,
        vx: (Math.random() - 0.5) * 2.2,
        vy: (Math.random() - 0.5) * 2.2,
        alive: true,
      };
    });
    setReady(true);
    travelTimer.current = setTimeout(triggerTravel, 1800);

    const tick = () => {
      const W2 = containerRef.current?.offsetWidth || 1200;
      const H2 = containerRef.current?.offsetHeight || 700;
      const balls = ballsRef.current;
      for (const b of balls) {
        if (!b.alive) continue;
        b.x += b.vx; b.y += b.vy;
        if (b.x - b.r < 0)    { b.x = b.r;       b.vx =  Math.abs(b.vx); }
        if (b.x + b.r > W2)   { b.x = W2 - b.r;  b.vx = -Math.abs(b.vx); }
        if (b.y - b.r < 0) { b.y = b.r;      b.vy =  Math.abs(b.vy); }
        if (b.y + b.r > H2) { b.y = H2 - b.r;  b.vy = -Math.abs(b.vy); }
      }
      for (let i = 0; i < balls.length; i++) {
        if (!balls[i].alive) continue;
        for (let j = i + 1; j < balls.length; j++) {
          if (!balls[j].alive) continue;
          const a = balls[i], b = balls[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.hypot(dx, dy);
          const mn = a.r + b.r;
          if (d < mn && d > 0.01) {
            const nx = dx/d, ny = dy/d, ov = (mn - d)/2;
            a.x -= nx*ov; a.y -= ny*ov; b.x += nx*ov; b.y += ny*ov;
            const dot = (a.vx-b.vx)*nx + (a.vy-b.vy)*ny;
            if (dot > 0) { a.vx -= dot*nx; a.vy -= dot*ny; b.vx += dot*nx; b.vy += dot*ny; }
          }
        }
      }
      for (const b of balls) {
        const el = nodeRefs.current.get(b.id);
        if (!el) continue;
        if (!b.alive) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; continue; }
        el.style.opacity = '1'; el.style.pointerEvents = 'auto';
        el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(travelTimer.current); };
  }, [triggerTravel]);

  const handleBubbleClick = (ball: Ball) => {
    clearTimeout(travelTimer.current);
    ball.alive = false;

    // Fly the astronaut to the clicked bubble
    const dx = ball.x - avatarCurr.current.x;
    const dy = ball.y - avatarCurr.current.y;
    setAvatarAngle(Math.atan2(dy, dx) * 180 / Math.PI);
    avatarCurr.current = { x: ball.x, y: ball.y };
    setAvatarXY({ x: ball.x, y: ball.y });
    setAvatarBiz(ball.biz);

    setPopup({ biz: ball.biz, cx: ball.x, cy: ball.y });

    // After the astronaut arrives: pop burst + keep travelling between OTHER bubbles
    // (triggerTravel sees popupRef.current !== null and won't replace the user popup)
    travelTimer.current = setTimeout(() => {
      setPopBurst({ x: ball.x, y: ball.y, color: ball.biz.color });
      setTimeout(() => setPopBurst(null), 700);
      travelTimer.current = setTimeout(triggerTravel, 1400);
    }, TRAVEL_MS + 150);
  };

  const closePopup = () => {
    setPopup(prev => {
      if (!prev) return null;
      const ball = ballsRef.current.find(b => b.biz === prev.biz);
      if (ball) { ball.alive = true; ball.vx = (Math.random()-0.5)*2.2; ball.vy = (Math.random()-0.5)*2.2; }
      travelTimer.current = setTimeout(triggerTravel, 900);
      return null;
    });
  };

  const W = containerRef.current?.offsetWidth || 800;
  const [mobilePopup,     setMobilePopup]     = useState<Biz | null>(null);
  const [mobileAutoIdx,   setMobileAutoIdx]   = useState(0);
  const [mobileUserOpen,  setMobileUserOpen]  = useState(false);
  const [popLabels,       setPopLabels]       = useState<Set<number>>(new Set());

  /* Auto-cycle: show 3.5s → hide 1.5s → next */
  useEffect(() => {
    if (mobileUserOpen) return;
    setMobilePopup(BUSINESSES[mobileAutoIdx]);
    const hideTimer = setTimeout(() => {
      setMobilePopup(null);
      const nextTimer = setTimeout(() => {
        setMobileAutoIdx(i => (i + 1) % BUSINESSES.length);
      }, 1500);
      return () => clearTimeout(nextTimer);
    }, 3500);
    return () => clearTimeout(hideTimer);
  }, [mobileAutoIdx, mobileUserOpen]);

  const closeMobilePopup = () => { setMobileUserOpen(false); setMobilePopup(null); };

  /* Label sparkles */
  useEffect(() => {
    const show = setInterval(() => {
      const biz = BUSINESSES[Math.floor(Math.random() * BUSINESSES.length)];
      setPopLabels(prev => new Set([...prev, biz.id]));
      setTimeout(() => setPopLabels(prev => { const n = new Set(prev); n.delete(biz.id); return n; }), 2200);
    }, 700);
    return () => clearInterval(show);
  }, []);

  return (
    <section style={{ borderTop: '1px solid rgba(37,99,235,0.15)', borderBottom: '1px solid rgba(37,99,235,0.15)', background: '#030712', position:'relative', overflow:'hidden' }}>

      {/* Astronaut background video + Aurora canvas removed for performance */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex:1,
        background:'linear-gradient(160deg,rgba(10,15,40,0.6) 0%,rgba(3,7,18,0.85) 50%,rgba(10,15,40,0.6) 100%)' }}/>

      {/* ── Shared heading ── */}
      <div className="text-center pt-8 pb-4 px-4 relative z-10">
        <p className="neon-badge mx-auto w-fit mb-3">Who We Help</p>
        <h2 className="font-display text-white mb-2"
          style={{ fontSize:'clamp(2.8rem,8vw,7rem)', lineHeight:1,
            textShadow:'0 0 50px rgba(37,99,235,0.6), 0 0 100px rgba(124,58,237,0.3), 0 2px 0 rgba(0,0,0,0.9)' }}>
          PERFECT FOR
        </h2>
        <p className="text-gray-400 text-sm tracking-wide hidden md:block">Watch the astronaut explore your industry — or click any bubble yourself</p>
        <p className="text-gray-400 text-sm tracking-wide md:hidden">Tap any card to see how a website grows that business</p>
      </div>

      {/* ══ MOBILE: 3-col scrollable grid ══ */}
      <div className="md:hidden px-3 pb-6 relative z-10">
        <div className="grid grid-cols-3 gap-2.5" style={{ overflow:'visible' }}>
          {BUSINESSES.map((biz, idx) => (
            <div key={biz.id} style={{ position:'relative' }}>
              {/* Random pop-up label */}
              <AnimatePresence>
                {popLabels.has(biz.id) && (
                  <motion.div
                    initial={{ opacity:0, scale:0.5, y:4 }}
                    animate={{ opacity:1, scale:1, y:-4 }}
                    exit={{ opacity:0, scale:0.5, y:4 }}
                    transition={{ type:'spring', stiffness:400, damping:20 }}
                    style={{
                      position:'absolute', top:-28, left:'50%', transform:'translateX(-50%)',
                      background: biz.color, color:'#fff', padding:'3px 9px',
                      borderRadius:20, fontSize:9, fontWeight:800, whiteSpace:'nowrap',
                      zIndex:50, boxShadow:`0 0 14px ${biz.color}90`,
                      pointerEvents:'none',
                    }}>
                    {biz.name}
                    {/* little arrow */}
                    <div style={{
                      position:'absolute', bottom:-4, left:'50%', transform:'translateX(-50%)',
                      width:0, height:0,
                      borderLeft:'4px solid transparent', borderRight:'4px solid transparent',
                      borderTop:`5px solid ${biz.color}`,
                    }}/>
                  </motion.div>
                )}
              </AnimatePresence>
            <motion.button
              onClick={() => { setMobileUserOpen(true); setMobilePopup(biz); }}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: (idx % 9) * 0.045, type: 'spring', stiffness: 260, damping: 18 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                boxShadow: [
                  `0 0 8px ${biz.color}25`,
                  `0 0 22px ${biz.color}70`,
                  `0 0 8px ${biz.color}25`,
                ],
              }}
              style={{
                background: `${biz.color}18`,
                border: `1.5px solid ${biz.color}55`,
                borderRadius: 14,
                padding: '14px 8px 12px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
                cursor: 'pointer',
              }}>
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 2 + (idx % 5) * 0.4, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.15 }}
                style={{ width: 38, height: 38, borderRadius: '50%',
                  background: `radial-gradient(circle at 35% 30%, ${biz.color}ee, ${biz.color}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 0 14px ${biz.color}70` }}>
                <biz.Icon size={17} style={{ color: 'white' }} />
              </motion.div>
              <span style={{ color: '#f1f5f9', fontSize: 9.5, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center',
                lineHeight: 1.25, textShadow: `0 0 8px ${biz.color}60` }}>
                {biz.name}
              </span>
            </motion.button>
            </div>
          ))}
        </div>

        {/* Mobile popup — fixed, perfectly centered on screen */}
        <AnimatePresence>
          {mobilePopup && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={closeMobilePopup}
              style={{ position:'fixed', inset:0, zIndex:300, display:'flex',
                alignItems:'center', justifyContent:'center',
                padding: '20px 16px', background:'rgba(0,0,0,0.75)',
                backdropFilter:'blur(8px)' }}>
              <motion.div
                initial={{ scale: 0.8, y: -20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.8, y: -20, opacity: 0 }}
                transition={{ type:'spring', stiffness:300, damping:22 }}
                onClick={e => e.stopPropagation()}
                style={{ width:'100%', maxWidth:380, background:'rgba(6,10,22,0.98)',
                  border:`2px solid ${mobilePopup.color}70`, borderRadius:22,
                  padding:26, boxShadow:`0 0 80px ${mobilePopup.color}40, 0 0 0 1px ${mobilePopup.color}20` }}>

                {/* Header */}
                <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:18 }}>
                  <motion.div
                    animate={{ boxShadow: [`0 0 14px ${mobilePopup.color}60`, `0 0 30px ${mobilePopup.color}cc`, `0 0 14px ${mobilePopup.color}60`] }}
                    transition={{ duration:1.8, repeat:Infinity }}
                    style={{ width:56, height:56, borderRadius:16,
                      background:`radial-gradient(circle at 35% 30%, ${mobilePopup.color}ee, ${mobilePopup.color}44)`,
                      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <mobilePopup.Icon size={26} style={{ color:'white' }} />
                  </motion.div>
                  <div>
                    <p style={{ color:'#f8fafc', fontWeight:800, fontSize:20, margin:'0 0 4px' }}>{mobilePopup.name}</p>
                    <p style={{ color:mobilePopup.color, fontSize:11, fontWeight:700,
                      textTransform:'uppercase', letterSpacing:'0.12em', margin:0 }}>Industry Insight</p>
                    {!mobileUserOpen && (
                      <p style={{ color:'#475569', fontSize:9, marginTop:3 }}>Auto-cycling · tap to pause</p>
                    )}
                  </div>
                </div>

                {/* Stat */}
                <div style={{ background:`${mobilePopup.color}18`, border:`1.5px solid ${mobilePopup.color}50`,
                  borderRadius:12, padding:'12px 16px', marginBottom:16,
                  display:'flex', alignItems:'center', gap:10 }}>
                  <TrendingUp size={15} style={{ color:mobilePopup.color, flexShrink:0 }} />
                  <span style={{ color:'#e2e8f0', fontWeight:700, fontSize:14 }}>{mobilePopup.stat}</span>
                </div>

                <p style={{ color:'#94a3b8', fontSize:14, lineHeight:1.75, marginBottom:20 }}>{mobilePopup.detail}</p>

                {/* Auto-progress bar */}
                {!mobileUserOpen && (
                  <div style={{ height:3, borderRadius:99, background:'rgba(255,255,255,0.06)', marginBottom:14, overflow:'hidden' }}>
                    <motion.div
                      key={mobileAutoIdx}
                      initial={{ width:'0%' }} animate={{ width:'100%' }}
                      transition={{ duration:3.5, ease:'linear' }}
                      style={{ height:'100%', borderRadius:99, background: mobilePopup.color }}
                    />
                  </div>
                )}

                <button onClick={closeMobilePopup}
                  style={{ width:'100%', padding:'14px', borderRadius:14, border:`1.5px solid ${mobilePopup.color}50`,
                    cursor:'pointer', background:`${mobilePopup.color}20`, color:'white',
                    fontWeight:800, fontSize:14, letterSpacing:'0.06em' }}>
                  {mobileUserOpen ? 'Close ✕' : 'Tap to pause auto-cycle'}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ DESKTOP: physics bubbles (unchanged) ══ */}
      <div ref={containerRef} className="relative overflow-hidden hidden md:block"
        style={{ height: 700, background: 'transparent' }}>

      {/* Colorful bokeh blobs */}
      {BG_BLOBS.map((b, i) => (
        <div key={i} style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none',
          width: b.w, height: b.h, left: b.l, top: b.t, background: b.color,
          filter: 'blur(72px)', animation: `orb-float ${b.dur}s ease-in-out infinite`,
          animationDelay: `${i * 0.65}s` }} />
      ))}
      <div className="absolute inset-0 bg-grid opacity-[0.18] pointer-events-none" />

      {/* Bubbles */}
      {ready && ballsRef.current.map(ball => (
        <div key={ball.id}
          ref={el => { if (el) nodeRefs.current.set(ball.id, el); }}
          onClick={() => handleBubbleClick(ball)}
          style={{ position:'absolute', top:0, left:0, width:ball.r*2, height:ball.r*2,
            borderRadius:'50%', cursor:'pointer', transition:'opacity 0.3s',
            background:`radial-gradient(circle at 35% 28%, ${ball.biz.color}ee, ${ball.biz.color}44)`,
            border:`2px solid ${ball.biz.color}90`,
            boxShadow:`0 0 28px ${ball.biz.color}60, 0 0 55px ${ball.biz.color}20, inset 0 1px 0 rgba(255,255,255,0.25)`,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:4, zIndex:10 }}>
          <div style={{ position:'absolute', top:'10%', left:'18%', width:'40%', height:'26%',
            background:'rgba(255,255,255,0.22)', borderRadius:'50%', filter:'blur(3px)', pointerEvents:'none' }} />
          <ball.biz.Icon size={ball.r*0.38} style={{ color:'white', filter:`drop-shadow(0 0 5px ${ball.biz.color})`, flexShrink:0, pointerEvents:'none' }} />
          <span style={{ color:'white', fontSize:Math.max(9,ball.r*0.17), fontWeight:800,
            textTransform:'uppercase', letterSpacing:'0.04em', textAlign:'center',
            lineHeight:1.2, textShadow:`0 0 10px ${ball.biz.color}`, maxWidth:'80%',
            wordBreak:'break-word', pointerEvents:'none' }}>
            {ball.biz.name}
          </span>
        </div>
      ))}

      {/* ── Traveling astronaut ── */}
      <motion.div
        style={{ position:'absolute', top:0, left:0, zIndex:25, pointerEvents:'none', transformOrigin:'0 0' }}
        animate={{ x: avatarXY.x, y: avatarXY.y }}
        transition={{ duration: TRAVEL_MS / 1000, ease:'easeInOut' }}>

        {/* Astronaut body */}
        <motion.div
          style={{ transform:'translate(-50%,-50%)', userSelect:'none', lineHeight:1 }}
          animate={{ y:[0,-6,0], rotate:[-4,4,-4] }}
          transition={{ duration:2.2, repeat:Infinity, ease:'easeInOut' }}>
          {/* Glow ring behind astronaut */}
          <motion.div
            style={{ position:'absolute', inset:'-8px', borderRadius:'50%', pointerEvents:'none' }}
            animate={{ boxShadow:[
              '0 0 18px 6px rgba(6,182,212,0.5)',
              '0 0 30px 10px rgba(139,92,246,0.7)',
              '0 0 18px 6px rgba(6,182,212,0.5)',
            ]}}
            transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
          />
          <span style={{ fontSize:46, filter:'drop-shadow(0 0 10px rgba(6,182,212,0.9)) drop-shadow(0 0 22px rgba(59,130,246,0.6))' }}>
            🧑‍🚀
          </span>
        </motion.div>

        {/* Destination label */}
        {avatarBiz && (
          <motion.div
            initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }}
            style={{ position:'absolute', top:-32, left:'50%', transform:'translateX(-50%)',
              background:'rgba(6,10,22,0.92)', border:`1.5px solid ${avatarBiz.color}80`,
              borderRadius:8, padding:'4px 10px', whiteSpace:'nowrap',
              color:'white', fontSize:10, fontWeight:800, letterSpacing:'0.06em',
              boxShadow:`0 0 16px ${avatarBiz.color}50`, backdropFilter:'blur(10px)' }}>
            🧑‍🚀 {avatarBiz.name}
          </motion.div>
        )}
      </motion.div>

      {/* ── Pop burst on arrival ── */}
      <AnimatePresence>
        {popBurst && (
          <div key={`${popBurst.x}-${popBurst.y}`}
            style={{ position:'absolute', left:popBurst.x, top:popBurst.y,
              transform:'translate(-50%,-50%)', zIndex:30, pointerEvents:'none' }}>
            {/* Flash */}
            <motion.div
              initial={{ width:0, height:0, opacity:1 }}
              animate={{ width:90, height:90, opacity:0 }}
              transition={{ duration:0.28, ease:'easeOut' }}
              style={{ position:'absolute', transform:'translate(-50%,-50%)',
                borderRadius:'50%', background:'white' }}
            />
            {/* Expanding rings */}
            {[0,1,2].map(i => (
              <motion.div key={i}
                initial={{ width:10, height:10, opacity:0.9 }}
                animate={{ width:130 + i*45, height:130 + i*45, opacity:0 }}
                transition={{ duration:0.55 + i*0.08, delay:i*0.06, ease:'easeOut' }}
                style={{ position:'absolute', transform:'translate(-50%,-50%)',
                  borderRadius:'50%', border:`2.5px solid ${popBurst.color}`,
                  boxShadow:`0 0 12px ${popBurst.color}80` }}
              />
            ))}
            {/* Sparkle dots */}
            {[0,1,2,3,4,5,6,7].map(i => {
              const a = (i / 8) * Math.PI * 2;
              return (
                <motion.div key={`s${i}`}
                  initial={{ x:0, y:0, opacity:1, scale:1 }}
                  animate={{ x:Math.cos(a)*55, y:Math.sin(a)*55, opacity:0, scale:0.3 }}
                  transition={{ duration:0.5, delay:0.05, ease:'easeOut' }}
                  style={{ position:'absolute', width:7, height:7, borderRadius:'50%',
                    background:popBurst.color, transform:'translate(-50%,-50%)',
                    boxShadow:`0 0 8px ${popBurst.color}` }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Popup — viewport-fixed modal so it's always center-screen */}
      <AnimatePresence>
        {popup && (
          <>
            {/* Dim backdrop */}
            <motion.div
              key="popup-backdrop"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              transition={{ duration:0.2 }}
              onClick={closePopup}
              style={{ position:'fixed', inset:0, zIndex:9998,
                background:'rgba(0,0,0,0.55)', backdropFilter:'blur(4px)' }} />
            <motion.div
              key={`${popup.biz.id}-${Math.round(popup.cx)}`}
              initial={{ opacity:0, scale:0.82, y:8 }}
              animate={{ opacity:1, scale:1, y:0 }}
              exit={{ opacity:0, scale:0.82, y:8 }}
              transition={{ duration:0.22, ease:[0.16,1,0.3,1] }}
              onClick={closePopup}
              style={{ position:'fixed', zIndex:9999, cursor:'pointer', width:'min(420px, calc(100vw - 32px))',
                left:'50%', top:'50%', transform:'translate(-50%, -50%)' }}>
              <div style={{ background:'rgba(6,10,22,0.98)', border:`2px solid ${popup.biz.color}`,
                borderRadius:18, padding:24,
                boxShadow:`0 0 0 1px ${popup.biz.color}40, 0 0 80px ${popup.biz.color}55, 0 24px 64px rgba(0,0,0,0.95)`,
                backdropFilter:'blur(28px)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
                <div style={{ width:44,height:44,borderRadius:12,background:`${popup.biz.color}20`,
                  border:`1px solid ${popup.biz.color}50`, display:'flex',alignItems:'center',
                  justifyContent:'center', color:popup.biz.color, flexShrink:0 }}>
                  <popup.biz.Icon size={20} />
                </div>
                <div>
                  <p style={{ color:'#f1f5f9',fontWeight:800,fontSize:15,margin:'0 0 3px' }}>{popup.biz.name}</p>
                  <p style={{ color:popup.biz.color,fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:'0.1em',margin:0 }}>Industry insight</p>
                </div>
              </div>
              <div style={{ background:`${popup.biz.color}18`, border:`1px solid ${popup.biz.color}35`,
                borderRadius:10, padding:'8px 12px', marginBottom:12, display:'flex', alignItems:'center', gap:8 }}>
                <TrendingUp size={12} style={{ color:popup.biz.color,flexShrink:0 }} />
                <span style={{ color:'#e2e8f0',fontWeight:700,fontSize:12 }}>{popup.biz.stat}</span>
              </div>
              <p style={{ color:'#94a3b8',fontSize:12,lineHeight:1.65,margin:'0 0 10px' }}>{popup.biz.detail}</p>
              <p style={{ color:`${popup.biz.color}70`,fontSize:10,textAlign:'center',margin:0 }}>Click anywhere to close &amp; respawn</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      </div>{/* end desktop physics div */}

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

/* ─── Before / After animated mockup ─────────────────────── */
type ShowPhase = 'before' | 'after';
type FlipPhase = 'idle' | 'flipOut' | 'flipIn';

const OldSite = () => (
  <div className="h-full overflow-hidden relative" style={{ background: '#f5f5f0', fontFamily: 'Georgia, serif' }}>
    <div style={{ background: '#1a365d', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>🏠 Your Business</span>
      <div style={{ display: 'flex', gap: 8 }}>
        {['Home','About','Contact'].map(t => <span key={t} style={{ color: 'rgba(255,255,255,0.7)', fontSize: 9 }}>{t}</span>)}
      </div>
    </div>
    <div style={{ background: 'linear-gradient(#1a365d,#2c5282)', padding: '14px 12px', textAlign: 'center', color: 'white' }}>
      <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Welcome to My Website!!</div>
      <div style={{ fontSize: 8, opacity: 0.7, marginBottom: 8 }}>We offer many services. Call for info about pricing.</div>
      <div style={{ display: 'inline-block', background: '#e2a000', color: 'white', padding: '4px 10px', fontSize: 8, fontWeight: 700, borderRadius: 2 }}>Click Here</div>
    </div>
    <div style={{ padding: '10px 12px' }}>
      <div style={{ fontSize: 8, color: '#555', fontFamily: 'Arial', marginBottom: 8 }}>We have been in business for many years and offer the best services in town at competitive prices.</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {['❌ Slow — 8s load', '❌ Zero SEO', '❌ No Call-to-Action', '❌ Not Mobile Friendly', '❌ Zero Leads'].map(b => (
          <span key={b} style={{ background: 'rgba(239,68,68,0.1)', color: '#dc2626', border: '1px solid rgba(239,68,68,0.3)', padding: '3px 7px', borderRadius: 5, fontSize: 8, fontWeight: 700 }}>{b}</span>
        ))}
      </div>
    </div>
    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(239,68,68,0.92)', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 8, fontWeight: 800 }}>BEFORE</div>
  </div>
);

const NewSite = () => (
  <div className="h-full overflow-hidden relative bg-[#080e1c]">
    <div style={{ background: 'rgba(8,14,28,0.98)', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span style={{ color: 'white', fontSize: 11, fontWeight: 800 }}>Your <span style={{ color: '#60a5fa' }}>Business Pro</span></span>
      <div style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', padding: '3px 9px', borderRadius: 5, fontSize: 8, fontWeight: 700, boxShadow: '0 0 10px rgba(37,99,235,0.5)' }}>📞 Free Quote</div>
    </div>
    <div style={{ padding: '12px', background: 'linear-gradient(135deg,#080e1c,#0d1120)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -20, left: -20, width: 80, height: 80, background: 'radial-gradient(circle,rgba(37,99,235,0.2),transparent 70%)', borderRadius: '50%' }} />
      <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '2px 8px', borderRadius: 999, fontSize: 7, fontWeight: 700, marginBottom: 6 }}>⚡ #1 Ranked · 24/7 Emergency Service</div>
      <div style={{ height: 9, background: 'rgba(255,255,255,0.8)', borderRadius: 3, width: '62%', marginBottom: 5 }} />
      <div style={{ height: 9, background: 'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius: 3, width: '46%', marginBottom: 8, opacity: 0.85 }} />
      <div style={{ display: 'flex', gap: 5, marginBottom: 8 }}>
        <div style={{ background: 'linear-gradient(135deg,#2563eb,#7c3aed)', color: 'white', padding: '5px 10px', borderRadius: 5, fontSize: 8, fontWeight: 700, boxShadow: '0 0 12px rgba(37,99,235,0.5)' }}>📞 Call Now</div>
        <div style={{ border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '5px 8px', borderRadius: 5, fontSize: 8 }}>See Portfolio →</div>
      </div>
    </div>
    <div style={{ padding: '6px 12px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {['✅ SEO Optimized', '✅ Lead Generation', '✅ Mobile First', '✅ High Converting', '✅ Sub-2s Load'].map(b => (
        <span key={b} style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.25)', padding: '3px 7px', borderRadius: 5, fontSize: 8, fontWeight: 700 }}>{b}</span>
      ))}
    </div>
    <div style={{ padding: '0 12px', display: 'flex', gap: 5, marginTop: 6 }}>
      {['📈 +145% Leads', '💰 Pays for Itself', '⚡ Live in 5 Days'].map(s => (
        <div key={s} style={{ flex: 1, background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.18)', borderRadius: 6, padding: '5px 4px', textAlign: 'center', fontSize: 7, color: '#93c5fd', fontWeight: 700 }}>{s}</div>
      ))}
    </div>
    <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(34,197,94,0.92)', color: 'white', padding: '2px 8px', borderRadius: 999, fontSize: 8, fontWeight: 800 }}>AFTER VCV</div>
  </div>
);

const BeforeAfterMockup = () => {
  const [show,  setShow]  = useState<ShowPhase>('before');
  const [flip,  setFlip]  = useState<FlipPhase>('idle');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const ids: ReturnType<typeof setTimeout>[] = [];
    const q = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));
    q(() => setFlip('flipOut'),                                     3400);
    q(() => { setShow(s => s === 'before' ? 'after' : 'before'); setFlip('flipIn'); }, 3700);
    q(() => setFlip('idle'),                                         4000);
    q(() => setCycle(c => c + 1),                                    7800);
    return () => ids.forEach(clearTimeout);
  }, [cycle]);

  const flipVariants = {
    idle:    { scaleX: 1 },
    flipOut: { scaleX: 0, transition: { duration: 0.26, ease: 'easeIn'  as const } },
    flipIn:  { scaleX: 1, transition: { duration: 0.26, ease: 'easeOut' as const } },
  };

  return (
    <div style={{ perspective: '1000px' }}>
      <motion.div variants={flipVariants} animate={flip}
        className="browser-mockup flex flex-col overflow-hidden" style={{ aspectRatio: '4/3' }}>
        <div className="browser-top flex-shrink-0">
          <span /><span /><span />
          <div className="ml-3 flex-1 h-5 bg-white/5 rounded-full text-[10px] text-gray-500 flex items-center px-3">
            {show === 'before' ? 'oldbusiness.com — Not Secure' : '🔒 yournewsite.com'}
          </div>
          {show === 'after' && (
            <div className="mr-2 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-bold">LIVE</span>
            </div>
          )}
        </div>
        <div className="flex-1 relative" style={{ minHeight: 0 }}>
          {show === 'before' ? <OldSite /> : <NewSite />}
        </div>
      </motion.div>

      {/* Phase label below mockup */}
      <div className="text-center mt-3">
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
          color: show === 'before' ? '#f87171' : '#4ade80',
          transition: 'color 0.3s',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
          {show === 'before' ? 'Before — killing your business' : 'After VCV — paying for itself daily'}
        </span>
      </div>
    </div>
  );
};

/* ─── Feature carousel (Why Choose Us cards) ──────────────── */
interface Feature {
  icon: React.ReactNode; title: string; description: string; color: string;
}

const FeatureCarousel = ({ features }: { features: Feature[] }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [progress,  setProgress]  = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const progRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const INTERVAL = 3600; // ms per card

  const activate = (idx: number) => {
    setActiveIdx(idx);
    setProgress(0);
    if (timerRef.current)  clearInterval(timerRef.current);
    if (progRef.current)   clearInterval(progRef.current);

    timerRef.current = setInterval(() => {
      setActiveIdx(p => (p + 1) % features.length);
      setProgress(0);
    }, INTERVAL);

    const TICK = 40;
    progRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (TICK / INTERVAL) * 100, 100));
    }, TICK);
  };

  useEffect(() => { activate(0); return () => { clearInterval(timerRef.current); clearInterval(progRef.current); }; }, []);

  return (
    <div className="space-y-2.5">
      {features.map((f, i) => {
        const isActive = i === activeIdx;
        return (
          <motion.div
            key={i}
            onClick={() => activate(i)}
            animate={{
              scale:   isActive ? 1.02 : 0.97,
              opacity: isActive ? 1 : 0.5,
              x:       isActive ? 0 : -6,
            }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
            style={{
              position: 'relative', overflow: 'hidden', cursor: 'pointer',
              borderRadius: 16,
              border: `1px solid ${isActive ? `${f.color}50` : 'rgba(255,255,255,0.06)'}`,
              background: isActive ? `${f.color}12` : 'rgba(255,255,255,0.02)',
              boxShadow: isActive ? `0 0 28px ${f.color}20, 0 4px 20px rgba(0,0,0,0.3)` : 'none',
              padding: isActive ? '18px 20px 14px' : '13px 20px',
              transition: 'padding 0.3s ease',
            }}>

            {/* Left color accent bar */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3,
              background: isActive ? f.color : 'transparent', borderRadius:'16px 0 0 16px',
              boxShadow: isActive ? `0 0 10px ${f.color}` : 'none', transition:'all 0.3s' }} />

            <div className="flex gap-3 items-start pl-2">
              {/* Icon */}
              <motion.div
                animate={{ scale: isActive ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                style={{ width:38, height:38, borderRadius:10, flexShrink:0,
                  background: isActive ? `${f.color}25` : `${f.color}10`,
                  border: `1px solid ${isActive ? `${f.color}50` : 'transparent'}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color: f.color, boxShadow: isActive ? `0 0 12px ${f.color}40` : 'none',
                }}>
                {f.icon}
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h4 style={{ color: isActive ? '#f1f5f9' : 'rgba(241,245,249,0.55)',
                  fontWeight: 700, fontSize: 14, marginBottom: isActive ? 5 : 2,
                  transition: 'color 0.3s' }}>
                  {f.title}
                </h4>
                <motion.p
                  animate={{ opacity: isActive ? 1 : 0, height: isActive ? 'auto' : 0 }}
                  transition={{ duration: 0.25 }}
                  style={{ color:'rgba(148,163,184,0.85)', fontSize:12.5, lineHeight:1.55,
                    margin:0, overflow:'hidden' }}>
                  {f.description}
                </motion.p>
              </div>

              {/* Active check */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                    style={{ width:20, height:20, borderRadius:'50%', background:f.color,
                      display:'flex', alignItems:'center', justifyContent:'center',
                      flexShrink:0, boxShadow:`0 0 10px ${f.color}70`, marginTop:2 }}>
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress bar (bottom of active card) */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ position:'absolute', bottom:0, left:0, right:0, height:2,
                    background:'rgba(255,255,255,0.05)', borderRadius:'0 0 16px 16px' }}>
                  <div style={{ height:'100%', width:`${progress}%`, background:f.color,
                    borderRadius:'0 0 0 16px', transition:'width 0.04s linear',
                    boxShadow:`0 0 6px ${f.color}` }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

/* ─── Why Choose Us ───────────────────────────────────────── */
const WHY_FEATURES = [
  { icon: <Rocket  className="w-10 h-10" />, color:'#3b82f6', title:'Lead Generation First',  desc:'Every design decision is made to generate calls, form fills, and booked jobs.',   stat:'+312%',    statLabel:'More Leads',         emoji:'📞' },
  { icon: <Clock   className="w-10 h-10" />, color:'#8b5cf6', title:'3–7 Day Launch',          desc:'We move fast without sacrificing quality. See results in days, not months.',      stat:'3–7',      statLabel:'Days to Live',        emoji:'🚀' },
  { icon: <Search  className="w-10 h-10" />, color:'#06b6d4', title:'SEO + Ads Built In',      desc:'Traffic strategies baked in from the start — no expensive upsells ever.',         stat:'#1',       statLabel:'On Google',           emoji:'📈' },
  { icon: <ShieldCheck className="w-10 h-10" />, color:'#22c55e', title:'You Own Everything',  desc:'No vendor lock-in. Your domain, your content, your site — always.',               stat:'100%',     statLabel:'Your Property',       emoji:'🔒' },
  { icon: <TrendingUp className="w-10 h-10" />, color:'#f97316', title:'Proven Track Record',  desc:'Real results for real businesses. 50+ sites launched, all generating leads.',      stat:'50+',      statLabel:'Sites Launched',      emoji:'⭐' },
];

/* Static 5-card grid. Replaces the previous version that loaded an
   external motionsites.ai robot GIF, auto-cycled features every 8.4
   seconds, and had sliding shimmer beams + "Robot is pulling this"
   captions. Now all 5 reasons are visible at once — visitors can
   compare them without waiting for a carousel. */
const WhyChooseUs = () => (
  <section className="relative py-20 md:py-28 bg-[#040a16]"
    style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute inset-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(59,130,246,0.08) 0%, transparent 55%), radial-gradient(ellipse at 70% 100%, rgba(124,58,237,0.06) 0%, transparent 55%)' }}/>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="text-center mb-12 md:mb-16">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Why VCV</p>
        <h2 className="font-display text-white tracking-tight leading-[1.05]"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
          Five reasons businesses<br/>
          <span className="gradient-text">choose us.</span>
        </h2>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto mt-5 leading-relaxed">
          We don&apos;t just build websites — we build growth engines tuned to your market.
          One metric matters: your return on investment.
        </p>
      </motion.div>

      {/* 5-card grid — 1 col on mobile, 2 on tablet, 5 across on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {WHY_FEATURES.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
            className="relative p-6 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border:     '1px solid rgba(255,255,255,0.08)',
              boxShadow:  '0 8px 32px rgba(0,0,0,0.30)',
            }}>
            {/* Soft accent glow at top corner */}
            <div className="absolute top-0 right-0 w-20 h-20 rounded-full pointer-events-none"
              style={{ background: f.color, opacity: 0.12, filter: 'blur(40px)' }}/>

            <div className="relative w-12 h-12 rounded-xl flex items-center justify-center mb-5"
              style={{ background: `${f.color}15`, border: `1px solid ${f.color}40` }}>
              <div style={{ color: f.color }}>{f.icon}</div>
            </div>

            <div className="relative font-display text-4xl md:text-5xl leading-none mb-1 tracking-tight"
              style={{ color: f.color }}>
              {f.stat}
            </div>
            <p className="relative text-gray-500 text-[10px] uppercase tracking-[0.22em] font-bold mb-4">
              {f.statLabel}
            </p>

            <h3 className="relative text-white font-bold text-base mb-2 leading-tight">{f.title}</h3>
            <p className="relative text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── Process Section ─────────────────────────────────────── */
const ProcessSection = () => {
  const steps = [
    { n: '01', title: 'Request Design Preview', desc: 'Tell us about your business and we build a custom website preview tailored to your market.' },
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
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.22em] mb-7 mx-auto"
          style={{ background:'rgba(59,130,246,0.10)', border:'1px solid rgba(59,130,246,0.30)', color:'#93c5fd' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Limited spots this month
        </span>
        <h2 className="font-display text-white leading-[1.02] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)' }}>
          See your new site<br/>
          <span className="gradient-text">before you pay a cent.</span>
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
          We build a real custom preview of your homepage in 48 hours. If you love it, we go live in 3–7 days. If not, you walk away — no charge, no pressure.
        </p>
        <FreeDemoButton size="xl" label="Get My Free Design Preview" />
        <p className="text-gray-500 text-sm mt-6">From $97/mo · 30-day money-back guarantee · No long-term contracts</p>
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

/* ─── Sample Websites — replaces the old bubble physics section ── */
const SampleWebsiteCard = ({ ind, i }: { ind: typeof INDUSTRIES[number]; i: number }) => {
  const tagline =
    ind.name.includes('Roofers')    ? 'Storm Calls' :
    ind.name.includes('Plumbers')   ? '3am Calls' :
    ind.name.includes('Dentists')   ? 'New Patients' :
    ind.name.includes('Lawyers')    ? 'Consults' :
    ind.name.includes('Real')       ? 'Showings' :
    ind.name.includes('Restaurant') ? 'Reservations' :
    ind.name.includes('Med')        ? 'Bookings' :
    ind.name.includes('Salon')      ? 'Appointments' :
    ind.name.includes('Wedding')    ? 'Tour Requests' :
    'Jobs';

  return (
    <motion.div
      initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
      transition={{ delay: (i % 8) * 0.04 }}>
      <Link href={`/templates/${ind.slug}`}
        className="group block rounded-2xl overflow-hidden p-3 transition-transform hover:-translate-y-1"
        style={{
          background: 'rgba(5,12,22,0.97)',
          border: `1px solid ${ind.color}30`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${ind.color}15`,
        }}>
        {/* Browser-frame mockup */}
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${ind.color}28, ${ind.color}08)`,
                   border: `1px solid ${ind.color}50` }}>
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center gap-1.5 px-3"
            style={{ background: 'rgba(0,0,0,0.55)', borderBottom: `1px solid ${ind.color}30` }}>
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            <span className="ml-2 text-[9px] text-gray-400 font-mono truncate">{ind.slug}-template.vcv.com</span>
          </div>
          <div className="absolute inset-x-0 top-7 bottom-0 flex flex-col items-center justify-center text-center px-4">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 text-[9px] font-bold tracking-widest"
              style={{ background:`${ind.color}22`, border:`1px solid ${ind.color}55`, color: ind.color }}>
              {ind.emoji} {ind.name.toUpperCase()}
            </span>
            <div className="font-display text-white text-base md:text-lg leading-tight mb-2"
              style={{ textShadow: `0 0 18px ${ind.color}80` }}>
              Stop Losing<br/>
              <span style={{ color: ind.color }}>{tagline}</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              <span className="text-[8px] font-bold px-2 py-1 rounded text-white" style={{ background: ind.color }}>Try Free</span>
              <span className="text-[8px] font-bold px-2 py-1 rounded text-gray-300"
                style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>Call Demo</span>
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
              {[0,1,2].map(k => (
                <div key={k} className="flex-1 rounded h-2"
                  style={{ background: `${ind.color}${k===1?'40':'20'}` }} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">{ind.emoji}</span>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ind.color }}>
              {ind.name}
            </p>
          </div>
          <h3 className="text-white font-bold text-base leading-snug mb-2 line-clamp-2">
            {ind.heroHeadline.replace(/\n/g, ' ')}
          </h3>
          <span className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2 transition-all"
            style={{ color: ind.color }}>
            View live site <ExternalLink className="w-3.5 h-3.5"/>
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

const SampleWebsites = () => (
  <section className="relative py-20 bg-[#030712] overflow-hidden"
    style={{ borderTop: '1px solid rgba(37,99,235,0.15)', borderBottom: '1px solid rgba(37,99,235,0.15)' }}>
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex:0,
      background:'linear-gradient(160deg,rgba(10,15,40,0.45) 0%,rgba(3,7,18,0.85) 50%,rgba(10,15,40,0.45) 100%)' }}/>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-center mb-12 md:mb-16">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Live sample sites</p>
        <h2 className="font-display text-white tracking-tight leading-[1.02] mb-5"
          style={{ fontSize:'clamp(2.5rem, 7vw, 5.5rem)' }}>
          Built for <span className="gradient-text">your industry.</span>
        </h2>
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          A taste of the {INDUSTRIES.length} fully-built industry templates we have — click any to see it live, or browse all on the templates page.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {/* Curated 8 — diverse mix of home services, professional, food + beauty
            so the grid showcases the breadth of industries we serve. */}
        {(['roofers','hvac','dentists','restaurants','real-estate','lawyers','med-spa','landscapers']
          .map(slug => INDUSTRIES.find(i => i.slug === slug))
          .filter((i): i is typeof INDUSTRIES[number] => Boolean(i))
        ).map((ind, i) => (
          <SampleWebsiteCard key={ind.slug} ind={ind} i={i} />
        ))}
      </div>

      <motion.div
        initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
        className="text-center mt-12">
        <Link href="/templates"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
          Browse all templates <ArrowRight className="w-4 h-4"/>
        </Link>
      </motion.div>
    </div>
  </section>
);

/* ─── Trust band — testimonials + counters + 5-star review row ──── */
const TESTIMONIALS = [
  { quote: 'Booked 3 jobs in the first week. The phone literally has not stopped.',           name: 'Mike R.',     role: 'Owner, Tulsa Roofing Co.',  initial: 'M', accent: '#ef4444' },
  { quote: 'Looks like a $20k website. Cost me a fraction of that. Best money I have spent.', name: 'Sarah H.',    role: 'Owner, Sparkle Cleaning',   initial: 'S', accent: '#22c55e' },
  { quote: 'Our old site got 2 leads a month. New site got 18 in the first 30 days.',          name: 'David L.',    role: 'GM, Cool Air HVAC',          initial: 'D', accent: '#06b6d4' },
  { quote: 'Launched in 5 days. We are #1 on Google for "plumber near me" within a month.',     name: 'James T.',    role: 'Anchor Plumbing',           initial: 'J', accent: '#3b82f6' },
];

const CounterStat = ({ value, suffix='', label }: { value: number; suffix?: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let fired = false;
    const run = () => {
      if (fired) return; fired = true;
      const dur = 1500, t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - t0) / dur, 1);
        const ease = 1 - Math.pow(1 - t, 3);
        setN(Math.floor(ease * value));
        if (t < 1) requestAnimationFrame(tick); else setN(value);
      };
      requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run(); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
        {n.toLocaleString()}{suffix}
      </div>
      <p className="text-gray-400 text-xs md:text-sm uppercase tracking-wider font-semibold">{label}</p>
    </div>
  );
};

const TrustBand = () => (
  <section className="relative py-20 md:py-24 bg-[#030712]"
    style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute inset-0 pointer-events-none"
      style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.07) 0%, transparent 60%)' }}/>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 mb-4">
          {[...Array(5)].map((_,i)=> (
            <svg key={i} className="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 15l-5.6 3.2L5.8 11.9 1 7.5l6.4-.6L10 1z"/>
            </svg>
          ))}
          <span className="ml-2 text-white font-bold text-sm">4.9 · 50+ reviews</span>
        </div>
        <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight mb-3">
          Trusted by local <span className="gradient-text">business owners</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Real results from real businesses we&apos;ve launched.
        </p>
      </motion.div>

      {/* Counter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14 max-w-4xl mx-auto">
        <CounterStat value={50}   suffix="+"        label="Websites Launched" />
        <CounterStat value={5}    suffix=" days"    label="Avg Launch Time" />
        <CounterStat value={98}   suffix="%"        label="Client Satisfaction" />
        <CounterStat value={30}   suffix="-Day"     label="Results Guarantee" />
      </div>

      {/* Testimonials grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
        {TESTIMONIALS.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay: i * 0.06 }}
            className="p-6 md:p-7 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_,k)=> (
                <svg key={k} className="w-3.5 h-3.5 fill-current" style={{ color: t.accent }} viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 1l2.6 5.9 6.4.6-4.8 4.4 1.4 6.3L10 15l-5.6 3.2L5.8 11.9 1 7.5l6.4-.6L10 1z"/>
                </svg>
              ))}
            </div>
            <p className="text-gray-100 text-base md:text-lg leading-relaxed mb-5">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                style={{ background: t.accent }}>
                {t.initial}
              </div>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{t.name}</p>
                <p className="text-gray-400 text-xs">{t.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <Link href="/free-demo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
          Join them — get your free demo <ArrowRight className="w-4 h-4"/>
        </Link>
      </div>
    </div>
  </section>
);

/* ─── Tech-stack band — verifiable integrations ───────────── */
const TECH_STACK = [
  { name: 'Stripe',            label: 'Payments',       sub: 'PCI-compliant checkout' },
  { name: 'Vercel',            label: 'Hosting',        sub: 'Global edge network' },
  { name: 'Google Business',   label: 'Local SEO',      sub: 'Profile + Maps integration' },
  { name: 'Google Ads',        label: 'Paid traffic',   sub: 'Conversion tracking' },
  { name: 'Meta Ads',          label: 'Social ads',     sub: 'Pixel + CAPI' },
  { name: 'Resend',            label: 'Email',          sub: 'Transactional + alerts' },
  { name: 'Firebase',          label: 'CRM / leads',    sub: 'Realtime lead storage' },
  { name: 'GA4',               label: 'Analytics',      sub: 'Full funnel tracking' },
];

const TechStackBand = () => (
  <section className="relative py-16 md:py-20 bg-[#030712]"
    style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-center mb-10">
        <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Built on the same stack the world&apos;s best companies use</p>
        <h2 className="font-display text-2xl md:text-4xl text-white tracking-tight leading-tight">
          Production-grade integrations. <span className="text-white/45">Not duct tape.</span>
        </h2>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {TECH_STACK.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity:0, y:14 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay: (i % 4) * 0.04 }}
            className="text-center px-4 py-5 rounded-xl"
            style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-white font-bold text-base md:text-lg leading-tight mb-1">{t.name}</p>
            <p className="text-blue-400 text-[10px] uppercase tracking-widest font-bold mb-1">{t.label}</p>
            <p className="text-gray-500 text-xs leading-snug">{t.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ─── ROI / Value Stack — "what you'd pay elsewhere" ───────── */
const VALUE_ROWS = [
  { label: 'Custom website design',          ours: 'Included', theirs: '$3,500',  badge: '✓' },
  { label: 'Mobile-optimized + responsive',  ours: 'Included', theirs: '$800',    badge: '✓' },
  { label: 'SEO setup + Google Business',    ours: 'Included', theirs: '$1,200',  badge: '✓' },
  { label: 'Lead-capture forms + analytics', ours: 'Included', theirs: '$600',    badge: '✓' },
  { label: 'Hosting + SSL + maintenance',    ours: 'Included', theirs: '$1,200/yr', badge: '✓' },
  { label: '30-day results guarantee',       ours: 'Included', theirs: '—',       badge: '✓' },
  { label: 'You own the domain + code',      ours: 'Yes',      theirs: '✗',       badge: '✓' },
];

const ValueStackBand = () => (
  <section className="relative py-20 md:py-28 bg-[#040a16]"
    style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
    <div className="absolute inset-0 pointer-events-none"
      style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.06) 0%, transparent 60%)' }}/>

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-center mb-12">
        <span className="inline-block text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">What it costs elsewhere</span>
        <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-tight mb-3">
          A <span className="gradient-text">$7,300+ build</span><br/>for $97/month.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Most agencies price each piece separately. We bundle the entire stack into one monthly fee and ship it in a week.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="relative rounded-3xl overflow-hidden"
        style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.10)',
                 boxShadow:'0 30px 80px rgba(0,0,0,0.5)' }}>
        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 px-6 py-4 text-xs font-bold uppercase tracking-widest"
          style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(255,255,255,0.08)', color:'#94a3b8' }}>
          <div className="col-span-6">What you get</div>
          <div className="col-span-3 text-center text-blue-400">VCV — from $97/mo</div>
          <div className="col-span-3 text-center text-gray-500">Typical agency</div>
        </div>

        {VALUE_ROWS.map((row, i) => (
          <motion.div key={i}
            initial={{ opacity:0, x:-10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-1 md:grid-cols-12 px-6 py-5 items-center gap-3 md:gap-0"
            style={{ borderBottom: i < VALUE_ROWS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
            <div className="md:col-span-6 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center bg-green-500/15 border border-green-500/35 flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400"/>
              </span>
              <span className="text-white text-sm md:text-base font-medium">{row.label}</span>
            </div>
            <div className="md:col-span-3 md:text-center">
              <span className="md:hidden text-gray-500 text-xs uppercase tracking-wider mr-2">VCV:</span>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                style={{ background:'rgba(34,197,94,0.12)', color:'#4ade80', border:'1px solid rgba(34,197,94,0.35)' }}>
                {row.ours}
              </span>
            </div>
            <div className="md:col-span-3 md:text-center">
              <span className="md:hidden text-gray-500 text-xs uppercase tracking-wider mr-2">Typical:</span>
              <span className={`text-sm font-bold ${row.theirs === '—' || row.theirs === '✗' ? 'text-gray-600' : 'text-red-400 line-through decoration-red-400/40'}`}>
                {row.theirs}
              </span>
            </div>
          </motion.div>
        ))}

        {/* Total row */}
        <div className="grid grid-cols-1 md:grid-cols-12 px-6 py-6 items-center"
          style={{ background:'linear-gradient(90deg, rgba(34,197,94,0.06), rgba(59,130,246,0.06))', borderTop:'1px solid rgba(255,255,255,0.10)' }}>
          <div className="md:col-span-6 mb-3 md:mb-0">
            <p className="text-white font-extrabold text-lg">Total value</p>
          </div>
          <div className="md:col-span-3 text-center">
            <p className="text-2xl font-extrabold text-green-400">$97/mo</p>
          </div>
          <div className="md:col-span-3 text-center">
            <p className="text-2xl font-extrabold text-gray-500 line-through decoration-red-400/40">$7,300+</p>
          </div>
        </div>
      </motion.div>

      <div className="text-center mt-10">
        <Link href="/free-demo"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
          Lock in $97/month while it lasts <ArrowRight className="w-5 h-5"/>
        </Link>
        <p className="text-gray-500 text-xs mt-3">No setup fee on annual · Cancel anytime · You own everything</p>
      </div>
    </div>
  </section>
);

/* ─── Process timeline — "How it works" ────────────────────── */
const PROCESS_STEPS = [
  { n: '01', t: 'Tell us about your business', d: 'Fill out a 60-second form or call (580) 919-1386. We learn your niche, services, and goals.', icon: MessageCircle as any },
  { n: '02', t: 'We build a free design preview', d: 'Within 48 hours you get a custom website mockup designed specifically for you — no payment required.',  icon: Sparkles as any },
  { n: '03', t: 'You approve, we launch',         d: 'Tweak anything, then we ship the live site in 3–7 days. SEO, hosting, domain — all handled.',          icon: Rocket as any },
  { n: '04', t: 'Phone starts ringing',           d: '30-day results guarantee. If it isn\'t generating leads in a month, we optimize at no extra charge.',   icon: TrendingUp as any },
];

const ProcessBand = () => (
  <section className="relative py-20 md:py-28 bg-[#030712]"
    style={{ borderTop:'1px solid rgba(255,255,255,0.06)', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
        className="text-center mb-14">
        <span className="inline-block text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">How it works</span>
        <h2 className="font-display text-4xl md:text-6xl text-white tracking-tight leading-tight mb-3">
          Live in under a week.
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Four steps. No upfront cost. No long-term contracts. You only pay if you love what you see.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PROCESS_STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.n}
              initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
              transition={{ delay: i * 0.06 }}
              className="relative p-7 rounded-2xl group hover:border-blue-500/40 transition-colors"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl font-black text-blue-500/30 group-hover:text-blue-500/60 transition-colors">{s.n}</span>
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-blue-400" />
                </div>
              </div>
              <h3 className="text-white font-bold text-lg mb-2 leading-tight">{s.t}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{s.d}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

/* ─── FAQ — conversion-objection answers ──────────────────── */
const FAQ_ITEMS = [
  { q: 'How much does a website cost?',
    a: 'Monthly plans start at $97/mo. Annual is $997/yr (save $173). Lifetime is $1,497 one-time, no recurring fees. Setup is $247, waived on annual and lifetime plans.' },
  { q: 'How long does it take to build my site?',
    a: 'Most sites launch in 3–7 days from approval. We build a free design preview within 48 hours of your request — you only commit if you like what you see.' },
  { q: 'Do I really get a free demo before paying?',
    a: 'Yes. We build a custom mockup of your site first. No credit card needed. No commitment. You see exactly what you\'re getting before any money changes hands.' },
  { q: 'What if I don\'t get any leads?',
    a: 'Every site comes with a 30-day results guarantee. If it isn\'t generating leads after 30 days, we optimize it at no extra cost until it does.' },
  { q: 'Do I own the website?',
    a: '100%. Your domain, your code, your content. No platform lock-in. You can leave any time and take everything with you.' },
  { q: 'Can you handle SEO and ads?',
    a: 'Yes — every site is SEO-optimized from launch, including Google Business Profile setup. We also manage Google Ads + Meta Ads on Annual and Lifetime plans.' },
];

const FAQAccordion = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative py-20 md:py-28 bg-[#040a16]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity:0, y:18 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-12">
          <span className="inline-block text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Frequently asked</span>
          <h2 className="font-display text-white tracking-tight leading-[1.05]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Got questions? <span className="gradient-text">We've got answers.</span>
          </h2>
          <p className="text-gray-400 mt-5 max-w-xl mx-auto leading-relaxed">
            The honest answers we wish someone gave us when we were shopping for a website.
          </p>
        </motion.div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = open === i;
            return (
              <motion.div key={i}
                initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                transition={{ delay: i * 0.04 }}
                className="rounded-2xl overflow-hidden"
                style={{
                  background:'rgba(255,255,255,0.025)',
                  border: isOpen ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                  transition: 'border-color 0.25s',
                }}>
                <button onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4">
                  <span className="text-white font-bold text-base md:text-lg pr-4">{item.q}</span>
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isOpen ? 'rotate-45 bg-blue-500/25' : 'bg-white/[0.06]'}`}>
                    <span className="text-white text-xl leading-none -mt-px">+</span>
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden">
                      <p className="px-6 pb-6 text-gray-300 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <p className="text-gray-400 mb-4 text-sm">Still have questions?</p>
          <Link href="/contact"
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-bold text-sm transition-colors">
            Talk to us → <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>
      </div>
    </section>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
export default function Home() {
  return (
    <div className="bg-[#030712]">
      <Hero />
      <MarqueeBand />
      <StatsSection />
      <SampleWebsites />
      <TrustBand />
      <TechStackBand />
      <ValueStackBand />
      <ProcessBand />
      {/* WhatHappensNextSection + LeadMagnetSection removed from Home — the
          pixel-font speller and rainbow lead-magnet block competed with the
          cleaner sections. ProcessBand already covers "how it works." Both
          views still exist for other routes if needed. */}
      <WhyChooseUs />
      <PricingSection />
      <FAQAccordion />
    </div>
  );
}
