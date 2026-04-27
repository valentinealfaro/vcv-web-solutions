import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─── Step data (positions in viewBox 0 0 700 500) ─────────── */
interface Step {
  n: number; emoji: string; label: string; sub: string; color: string;
  svgX: number; svgY: number;
}

const STEPS: Step[] = [
  { n: 1, emoji: '📞', label: 'Request your free demo',   sub: 'Free · Zero commitment',    color: '#3b82f6', svgX: 70,  svgY: 30  },
  { n: 2, emoji: '⚡', label: 'We build your preview',     sub: 'Done within 48 hours',      color: '#818cf8', svgX: 210, svgY: 130 },
  { n: 3, emoji: '✅', label: 'You approve or revise',     sub: 'Unlimited revisions',        color: '#06b6d4', svgX: 350, svgY: 230 },
  { n: 4, emoji: '🚀', label: 'We launch your site',       sub: '3–7 days total',             color: '#a855f7', svgX: 490, svgY: 330 },
  { n: 5, emoji: '🤑', label: 'Revenue every single day',  sub: '$$ · Calls · Leads · Cash', color: '#10b981', svgX: 630, svgY: 430 },
];

// Forward path: top-left → bottom-right
const PATH_FWD = 'M 70 30 H 140 V 130 H 280 V 230 H 420 V 330 H 560 V 430 H 630';
// Reverse path: bottom-right → top-left  (same staircase, opposite direction)
const PATH_REV = 'M 630 430 H 560 V 330 H 420 V 230 H 280 V 130 H 140 V 30 H 70';
const PATH_LEN = 960;

// Timing (ms)
const T_PATH  = 2400;  // path draws over this
const T_BSTART = 500;  // first ball delay after phase starts
const T_BGAP   = 420;  // stagger between balls
const T_HOLD   = 1800; // pause after last ball visible
const T_FADE   = 650;  // fade-out
const T_CYCLE  = T_BSTART + (STEPS.length - 1) * T_BGAP + T_HOLD; // ≈4180ms
const T_TOTAL  = T_CYCLE + T_FADE + 350;                            // ≈5180ms

export const WhatHappensNextSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.2 });

  const [started,    setStarted]    = useState(false);
  const [cycle,      setCycle]      = useState(0);         // increments each loop
  const [forward,    setForward]    = useState(true);      // true = fwd, false = rev
  const [dashOffset, setDashOffset] = useState(PATH_LEN);
  const [ballsShown, setBallsShown] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const [fading,     setFading]     = useState(false);
  const [sparkOn,    setSparkOn]    = useState(false);

  useEffect(() => { if (inView) setStarted(true); }, [inView]);

  useEffect(() => {
    if (!started) return;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const q = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // Reset
    setDashOffset(PATH_LEN);
    setBallsShown(Array(STEPS.length).fill(false));
    setFading(false);
    setSparkOn(false);

    // Draw the path
    q(() => setDashOffset(0), 80);

    // Pop balls — forward: 0,1,2,3,4 | reverse: 4,3,2,1,0
    const popOrder = forward ? [0, 1, 2, 3, 4] : [4, 3, 2, 1, 0];
    popOrder.forEach((stepIdx, i) =>
      q(() => setBallsShown(prev => {
        const n = [...prev]; n[stepIdx] = true; return n;
      }), T_BSTART + i * T_BGAP),
    );

    // Spark starts after last ball
    q(() => setSparkOn(true), T_BSTART + (STEPS.length - 1) * T_BGAP + 250);

    // Fade out
    q(() => setFading(true), T_CYCLE);

    // Flip direction and restart
    q(() => {
      setForward(f => !f);      // ← THE FLIP
      setCycle(c => c + 1);
    }, T_TOTAL);

    return () => ids.forEach(clearTimeout);
  }, [cycle, started]); // `forward` intentionally excluded — read via closure

  const activePath = forward ? PATH_FWD : PATH_REV;
  // Gradient direction matches travel direction
  const gradId = `sg-${cycle}`;

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden bg-[#040a16]">
      <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />
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
        <motion.div
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: T_FADE / 1000, ease: 'easeInOut' }}
          className="relative hidden md:block"
          style={{ height: 560 }}
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 700 500"
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/* Forward gradient: blue → green */}
              <linearGradient id={`${gradId}-fwd`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="40%"  stopColor="#818cf8" />
                <stop offset="70%"  stopColor="#a855f7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              {/* Reverse gradient: green → blue */}
              <linearGradient id={`${gradId}-rev`} x1="100%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="40%"  stopColor="#818cf8" />
                <stop offset="70%"  stopColor="#a855f7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="lineGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="sparkGlow" x="-200%" y="-200%" width="500%" height="500%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Direction indicator label */}
            <text
              x="350" y="490" textAnchor="middle" fontSize="11"
              fill="rgba(148,163,184,0.5)"
              fontFamily="'Space Grotesk', sans-serif" fontWeight="600"
              letterSpacing="2">
              {forward ? '▶ FORWARD' : '◀ REVERSE'}
            </text>

            {/* Wide glow */}
            <path d={activePath} fill="none"
              stroke={`url(#${gradId}-${forward ? 'fwd' : 'rev'})`}
              strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"
              opacity={0.18}
              strokeDasharray={PATH_LEN} strokeDashoffset={dashOffset}
              style={{ transition: `stroke-dashoffset ${T_PATH}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
            />
            {/* Main line */}
            <path d={activePath} fill="none"
              stroke={`url(#${gradId}-${forward ? 'fwd' : 'rev'})`}
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={PATH_LEN} strokeDashoffset={dashOffset}
              filter="url(#lineGlow)"
              style={{ transition: `stroke-dashoffset ${T_PATH}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
            />

            {/* Moving spark — direction matches current cycle */}
            {sparkOn && (
              <>
                <circle r="7" fill="rgba(255,255,255,0.22)" filter="url(#sparkGlow)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path={activePath} />
                </circle>
                <circle r="3.5" fill="white" filter="url(#sparkGlow)">
                  <animateMotion dur="2.8s" repeatCount="indefinite" path={activePath} />
                </circle>
              </>
            )}
          </svg>

          {/* ─── Balls ────────────────────────────────────────── */}
          {STEPS.map((step, i) => {
            const lx = `${(step.svgX / 700) * 100}%`;
            const ty = `${(step.svgY / 500) * 560}px`;

            return (
              <div key={i} style={{ position: 'absolute', left: lx, top: ty,
                transform: 'translate(-50%, -50%)', zIndex: 20 }}>

                {/* Pulse ring */}
                {ballsShown[i] && (
                  <div style={{
                    position: 'absolute', inset: -14, borderRadius: '50%',
                    border: `1px solid ${step.color}45`,
                    animation: 'pulse 2.2s ease-in-out infinite',
                  }} />
                )}

                {/* Ball */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={ballsShown[i] ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 14 }}
                  style={{
                    width: 68, height: 68, borderRadius: '50%',
                    background: `radial-gradient(circle at 36% 30%, ${step.color}ff, ${step.color}66)`,
                    border: `2.5px solid ${step.color}cc`,
                    boxShadow: `0 0 28px ${step.color}55, 0 0 60px ${step.color}22, inset 0 1px 0 rgba(255,255,255,0.25)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, userSelect: 'none', position: 'relative',
                  }}
                >
                  {step.emoji}
                  {/* Step number badge */}
                  <div style={{
                    position: 'absolute', top: -8, right: -8,
                    width: 24, height: 24, borderRadius: '50%',
                    background: step.color, border: '2.5px solid #040a16',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: 11, fontWeight: 900,
                    boxShadow: `0 0 8px ${step.color}80`,
                  }}>
                    {step.n}
                  </div>
                </motion.div>

                {/* Label card */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={ballsShown[i] ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                  style={{
                    position: 'absolute', top: 78, left: '50%',
                    transform: 'translateX(-50%)', width: 136, textAlign: 'center',
                    background: 'rgba(6,10,24,0.8)', backdropFilter: 'blur(10px)',
                    border: `1px solid ${step.color}28`, borderRadius: 10,
                    padding: '8px 10px', pointerEvents: 'none',
                  }}
                >
                  <p style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 11.5,
                    lineHeight: 1.4, margin: '0 0 5px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                    {step.label}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    background: `${step.color}22`, border: `1px solid ${step.color}45`,
                    borderRadius: 20, padding: '2px 8px',
                    color: step.color, fontSize: 9.5, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                  }}>
                    {step.sub}
                  </span>
                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* ─── Mobile ───────────────────────────────────────── */}
        <div className="md:hidden space-y-5">
          {STEPS.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
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
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} viewport={{ once: true }}>
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
