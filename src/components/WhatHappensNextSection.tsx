import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─── Data ────────────────────────────────────────────────── */
interface Step {
  n: number; emoji: string; label: string; sub: string; color: string;
  svgX: number; svgY: number;
}

// Descending staircase: top-left → bottom-right  (viewBox 0 0 700 500)
const STEPS: Step[] = [
  { n: 1, emoji: '📞', label: 'Request your free demo',    sub: 'Free · Zero commitment',      color: '#3b82f6', svgX: 70,  svgY: 30  },
  { n: 2, emoji: '⚡', label: 'We build your preview',      sub: 'Done within 48 hours',        color: '#818cf8', svgX: 210, svgY: 130 },
  { n: 3, emoji: '✅', label: 'You approve or revise',      sub: 'Unlimited revisions',          color: '#06b6d4', svgX: 350, svgY: 230 },
  { n: 4, emoji: '🚀', label: 'We launch your site',        sub: '3–7 days total',               color: '#a855f7', svgX: 490, svgY: 330 },
  { n: 5, emoji: '🤑', label: 'Revenue every single day',   sub: '$$ · Calls · Leads · Cash',   color: '#10b981', svgX: 630, svgY: 430 },
];

// Descending staircase path connecting all ball centers
const STAIR_PATH = 'M 70 30 H 140 V 130 H 280 V 230 H 420 V 330 H 560 V 430 H 630';
const PATH_LEN   = 960;

// Timing (ms)
const T_PATH_DRAW  = 2400; // path draws over this duration
const T_BALL_START = 500;  // when first ball pops after path starts
const T_BALL_GAP   = 420;  // stagger between balls
const T_HOLD       = 1800; // pause after last ball before fade
const T_FADE       = 700;  // fade-out duration
const T_CYCLE = T_BALL_START + (STEPS.length - 1) * T_BALL_GAP + T_HOLD;
const T_TOTAL = T_CYCLE + T_FADE + 300; // 300ms gap before restart

/* ─── Component ───────────────────────────────────────────── */
export const WhatHappensNextSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView      = useInView(sectionRef, { once: true, amount: 0.2 });

  const [started,    setStarted]    = useState(false);
  const [cycle,      setCycle]      = useState(0);
  const [dashOffset, setDashOffset] = useState(PATH_LEN);
  const [ballsShown, setBallsShown] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const [fading,     setFading]     = useState(false);
  const [sparkOn,    setSparkOn]    = useState(false);

  // Start looping once section enters view
  useEffect(() => { if (inView) setStarted(true); }, [inView]);

  useEffect(() => {
    if (!started) return;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const q = (fn: () => void, ms: number) => { ids.push(setTimeout(fn, ms)); };

    // Reset
    setDashOffset(PATH_LEN);
    setBallsShown(Array(STEPS.length).fill(false));
    setFading(false);
    setSparkOn(false);

    // Draw path
    q(() => setDashOffset(0), 80);

    // Pop balls one by one
    STEPS.forEach((_, i) =>
      q(() => setBallsShown(prev => { const n = [...prev]; n[i] = true; return n; }),
        T_BALL_START + i * T_BALL_GAP),
    );

    // Spark travels after all balls visible
    q(() => setSparkOn(true), T_BALL_START + (STEPS.length - 1) * T_BALL_GAP + 200);

    // Fade out
    q(() => setFading(true), T_CYCLE);

    // Next cycle
    q(() => setCycle(c => c + 1), T_TOTAL);

    return () => ids.forEach(clearTimeout);
  }, [cycle, started]);

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden bg-[#040a16]">
      <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />
      {/* Subtle radial glow centered on staircase */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 80% at 55% 55%, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">The Journey</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-3">WHAT HAPPENS NEXT</h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            From your first call to customers paying you — here's the exact path.
          </p>
        </motion.div>

        {/* ─── Desktop staircase ──────────────────────────────── */}
        <AnimatePresence>
          <motion.div
            key={cycle}
            animate={{ opacity: fading ? 0 : 1 }}
            transition={{ duration: T_FADE / 1000, ease: 'easeInOut' }}
            className="relative hidden md:block"
            style={{ height: 560 }}
          >
            {/* SVG layer: path + spark + start/end markers */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 700 500"
              preserveAspectRatio="none"
              style={{ overflow: 'visible' }}
            >
              <defs>
                <linearGradient id={`sg-${cycle}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#3b82f6" />
                  <stop offset="35%"  stopColor="#818cf8" />
                  <stop offset="65%"  stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
                <filter id="pathGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
                <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>

              {/* Wide glow pass */}
              <path d={STAIR_PATH} fill="none"
                stroke={`url(#sg-${cycle})`} strokeWidth="10"
                strokeLinecap="round" strokeLinejoin="round" opacity={0.18}
                strokeDasharray={PATH_LEN} strokeDashoffset={dashOffset}
                style={{ transition: `stroke-dashoffset ${T_PATH_DRAW}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
              />
              {/* Main line */}
              <path d={STAIR_PATH} fill="none"
                stroke={`url(#sg-${cycle})`} strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round"
                strokeDasharray={PATH_LEN} strokeDashoffset={dashOffset}
                filter="url(#pathGlow)"
                style={{ transition: `stroke-dashoffset ${T_PATH_DRAW}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
              />

              {/* Moving spark that loops after path is drawn */}
              {sparkOn && (
                <>
                  <circle r="7" fill="rgba(255,255,255,0.25)" filter="url(#sparkGlow)">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path={STAIR_PATH} />
                  </circle>
                  <circle r="3.5" fill="white" filter="url(#sparkGlow)">
                    <animateMotion dur="2.8s" repeatCount="indefinite" path={STAIR_PATH} />
                  </circle>
                </>
              )}
            </svg>

            {/* ─── Ball nodes ───────────────────────────────── */}
            {STEPS.map((step, i) => {
              const lx = `${(step.svgX / 700) * 100}%`;
              const ty = `${(step.svgY / 500) * 560}px`; // map SVG y to container px

              return (
                <div key={i} style={{ position: 'absolute', left: lx, top: ty,
                  transform: 'translate(-50%, -50%)', zIndex: 20 }}>

                  {/* Pulse ring — appears when ball is visible */}
                  {ballsShown[i] && (
                    <div style={{
                      position: 'absolute', inset: -14,
                      borderRadius: '50%',
                      border: `1px solid ${step.color}40`,
                      animation: 'pulse 2.4s ease-in-out infinite',
                    }} />
                  )}

                  {/* Ball */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={ballsShown[i]
                      ? { scale: 1, opacity: 1 }
                      : { scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                    style={{
                      width: 68, height: 68, borderRadius: '50%',
                      background: `radial-gradient(circle at 36% 30%, ${step.color}ff, ${step.color}66)`,
                      border: `2.5px solid ${step.color}cc`,
                      boxShadow: `0 0 28px ${step.color}55, 0 0 60px ${step.color}22, inset 0 1px 0 rgba(255,255,255,0.25)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 26, cursor: 'default', userSelect: 'none',
                      position: 'relative',
                    }}
                  >
                    {step.emoji}

                    {/* Step number badge */}
                    <div style={{
                      position: 'absolute', top: -8, right: -8,
                      width: 24, height: 24, borderRadius: '50%',
                      background: step.color,
                      border: '2.5px solid #040a16',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 11, fontWeight: 900,
                      boxShadow: `0 0 8px ${step.color}80`,
                    }}>
                      {step.n}
                    </div>
                  </motion.div>

                  {/* Label card below the ball */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={ballsShown[i] ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    transition={{ delay: 0.18, duration: 0.35 }}
                    style={{
                      position: 'absolute',
                      top: 78, left: '50%',
                      transform: 'translateX(-50%)',
                      width: 136,
                      textAlign: 'center',
                      background: 'rgba(6,10,24,0.75)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid ${step.color}25`,
                      borderRadius: 10,
                      padding: '8px 10px',
                      pointerEvents: 'none',
                    }}
                  >
                    <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 11.5,
                      lineHeight: 1.4, margin: '0 0 5px',
                      textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                      {step.label}
                    </p>
                    <span style={{
                      display: 'inline-block',
                      background: `${step.color}22`,
                      border: `1px solid ${step.color}45`,
                      borderRadius: 20, padding: '2px 8px',
                      color: step.color, fontSize: 9.5, fontWeight: 700,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      textShadow: `0 0 8px ${step.color}60`,
                    }}>
                      {step.sub}
                    </span>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ─── Mobile fallback ──────────────────────────────── */}
        <div className="md:hidden space-y-5">
          {STEPS.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4">
              <div style={{
                width: 58, height: 58, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 36% 30%, ${step.color}ee, ${step.color}55)`,
                border: `2px solid ${step.color}`, fontSize: 22,
                boxShadow: `0 0 20px ${step.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{step.emoji}</div>
              <div>
                <p className="text-white font-bold text-sm mb-0.5">{step.label}</p>
                <span style={{ color: step.color, fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em' }}>{step.sub}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div className="text-center mt-14"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}>
          <Link to="/free-demo"
            className="btn-neon btn-glow text-white px-10 py-4 rounded-full font-bold text-base inline-flex items-center gap-2 group">
            Start Step 1 — It's Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-gray-600 text-xs mt-3">No credit card · Ready in 48 hours · 100% free</p>
        </motion.div>

      </div>
    </section>
  );
};
