'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ─── Checkerboard background ─────────────────────────────── */
const CELL = 50;
const CHECKER_COLORS = [
  [59,  130, 246],  // blue
  [129, 140, 248],  // indigo
  [168, 85,  247],  // purple
  [6,   182, 212],  // cyan
  [16,  185, 129],  // green
  [245, 158, 11],   // amber
  [236, 72,  153],  // pink
];

const CheckerBG = ({ cycle, ballPositions }: {
  cycle: number;
  ballPositions: { svgX: number; svgY: number }[];
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let spawnTick = 0;

    interface LitCell { c: number; r: number; alpha: number; col: number[]; decay: number; rising: boolean }
    let lit: LitCell[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const getBlocked = () => {
      const set = new Set<string>();
      const W = canvas.width, H = canvas.height;

      // Block the heading area (top ~260px, center 70% width)
      const hL = Math.floor(W * 0.12 / CELL);
      const hR = Math.ceil (W * 0.88 / CELL);
      const hB = Math.ceil (260 / CELL);
      for (let c = hL; c <= hR; c++)
        for (let r = 0; r <= hB; r++)
          set.add(`${c},${r}`);

      // Block cells near each ball
      // SVG viewBox 0 0 700 460 → container: ~90% width, 540px tall, offset by ~270px top
      const svgW   = W * 0.88;
      const svgL   = (W - svgW) / 2;
      const svgTop = 270;

      ballPositions.forEach(({ svgX, svgY }) => {
        const px = svgL + (svgX / 700) * svgW;
        const py = svgTop + (svgY / 460) * 500;
        const bc = Math.round(px / CELL);
        const br = Math.round(py / CELL);
        for (let dc = -3; dc <= 3; dc++)
          for (let dr = -3; dr <= 3; dr++)
            set.add(`${bc + dc},${br + dr}`);
      });
      return set;
    };

    const draw = (ts: number) => {
      const W = canvas.width, H = canvas.height;
      const cols = Math.ceil(W / CELL);
      const rows = Math.ceil(H / CELL);
      ctx.clearRect(0, 0, W, H);

      // ── Base grid ──
      ctx.strokeStyle = 'rgba(37,99,235,0.07)';
      ctx.lineWidth = 0.6;
      for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c * CELL, 0); ctx.lineTo(c * CELL, H); ctx.stroke(); }
      for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0, r * CELL); ctx.lineTo(W, r * CELL); ctx.stroke(); }

      // ── Spawn new lit cells ──
      const blocked = getBlocked();
      if (ts - spawnTick > 110 && lit.length < 32) {
        spawnTick = ts;
        for (let attempt = 0; attempt < 30; attempt++) {
          const c = Math.floor(Math.random() * cols);
          const r = Math.floor(Math.random() * rows);
          if (!blocked.has(`${c},${r}`) && !lit.find(l => l.c === c && l.r === r)) {
            lit.push({
              c, r, alpha: 0,
              col: CHECKER_COLORS[Math.floor(Math.random() * CHECKER_COLORS.length)],
              decay: 0.003 + Math.random() * 0.005,
              rising: true,
            });
            break;
          }
        }
      }

      // ── Update & draw lit cells ──
      lit = lit.filter(l => l.alpha >= 0);
      lit.forEach(l => {
        if (l.rising) {
          l.alpha += 0.018;
          if (l.alpha >= 0.32) { l.alpha = 0.32; l.rising = false; }
        } else {
          l.alpha -= l.decay;
        }
        const x = l.c * CELL, y = l.r * CELL;
        const [r, g, b] = l.col;
        ctx.fillStyle   = `rgba(${r},${g},${b},${l.alpha})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
        ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(0.9, l.alpha * 3.5)})`;
        ctx.lineWidth   = 1.2;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        // Inner glow dot
        ctx.fillStyle = `rgba(${r},${g},${b},${l.alpha * 1.8})`;
        ctx.fillRect(x + CELL/2 - 3, y + CELL/2 - 3, 6, 6);
      });

      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [cycle, ballPositions]);

  return (
    <canvas ref={canvasRef}
      style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', zIndex:1 }} />
  );
};

/* ─── Steps (constant data) ───────────────────────────────── */
interface Step {
  n: number; emoji: string; label: string; sub: string; color: string;
}
const STEPS: Step[] = [
  { n: 1, emoji: '📞', label: 'Request your free demo',  sub: 'Free · Zero commitment',    color: '#3b82f6' },
  { n: 2, emoji: '⚡', label: 'We build your preview',    sub: 'Done within 48 hours',      color: '#818cf8' },
  { n: 3, emoji: '✅', label: 'You approve or revise',    sub: 'Unlimited revisions',        color: '#06b6d4' },
  { n: 4, emoji: '🚀', label: 'We launch your site',      sub: '3–7 days total',             color: '#a855f7' },
  { n: 5, emoji: '🤑', label: 'Revenue every single day', sub: '$$ · Calls · Leads · Cash', color: '#10b981' },
];

/* ─── Layouts (shape of each cycle) ──────────────────────── */
interface Layout {
  tag: string;                               // display label
  positions: { svgX: number; svgY: number }[]; // ball centres in viewBox 0 0 700 460
  path: string;                              // SVG path connecting them
  pathLen: number;                           // approximate total path length
  drawMs: number;                            // how long path-draw animation takes
}

const LAYOUTS: Layout[] = [
  {
    // ↘ Descending staircase: top-left → bottom-right
    tag: '↘  DESCENDING',
    positions: [
      { svgX: 70,  svgY: 20  },
      { svgX: 210, svgY: 110 },
      { svgX: 350, svgY: 200 },
      { svgX: 490, svgY: 290 },
      { svgX: 630, svgY: 380 },
    ],
    path: 'M 70 20 H 140 V 110 H 280 V 200 H 420 V 290 H 560 V 380 H 630',
    pathLen: 920, drawMs: 2400,
  },
  {
    // ↗ Ascending staircase: bottom-left → top-right  (the "flip")
    tag: '↗  ASCENDING',
    positions: [
      { svgX: 70,  svgY: 380 },
      { svgX: 210, svgY: 290 },
      { svgX: 350, svgY: 200 },
      { svgX: 490, svgY: 110 },
      { svgX: 630, svgY: 20  },
    ],
    path: 'M 70 380 H 140 V 290 H 280 V 200 H 420 V 110 H 560 V 20 H 630',
    pathLen: 920, drawMs: 2400,
  },
  {
    // → Straight line: all balls at the same height
    tag: '→  STRAIGHT',
    positions: [
      { svgX: 70,  svgY: 200 },
      { svgX: 210, svgY: 200 },
      { svgX: 350, svgY: 200 },
      { svgX: 490, svgY: 200 },
      { svgX: 630, svgY: 200 },
    ],
    path: 'M 70 200 H 630',
    pathLen: 560, drawMs: 900,
  },
];

// Timing shared across layouts (ms)
const T_BALL_START = 500;   // first ball delay after phase starts
const T_BALL_GAP   = 400;   // stagger between balls
const T_HOLD       = 1600;  // pause after last ball visible
const T_FADE       = 600;   // fade-out duration
const T_GAP        = 300;   // black gap before next cycle

export const WhatHappensNextSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView     = useInView(sectionRef, { once: true, amount: 0.2 });

  const [started,    setStarted]    = useState(false);
  const [cycle,      setCycle]      = useState(0);
  const [dashOffset, setDashOffset] = useState(0);
  const [ballsShown, setBallsShown] = useState<boolean[]>(Array(STEPS.length).fill(false));
  const [fading,     setFading]     = useState(false);
  const [sparkOn,    setSparkOn]    = useState(false);

  const layout     = LAYOUTS[cycle % LAYOUTS.length];
  const nextLayout = LAYOUTS[(cycle + 1) % LAYOUTS.length];

  useEffect(() => { if (inView) setStarted(true); }, [inView]);

  useEffect(() => {
    if (!started) return;
    const ids: ReturnType<typeof setTimeout>[] = [];
    const q = (fn: () => void, ms: number) => ids.push(setTimeout(fn, ms));

    // Reset everything
    setDashOffset(layout.pathLen);
    setBallsShown(Array(STEPS.length).fill(false));
    setFading(false);
    setSparkOn(false);

    // 1. Draw path
    q(() => setDashOffset(0), 80);

    // 2. Pop balls one by one
    STEPS.forEach((_, i) =>
      q(() => setBallsShown(prev => { const n = [...prev]; n[i] = true; return n; }),
        T_BALL_START + i * T_BALL_GAP),
    );

    // 3. Spark travels path after all balls visible
    q(() => setSparkOn(true), T_BALL_START + (STEPS.length - 1) * T_BALL_GAP + 300);

    // 4. Fade out
    const totalVisible = T_BALL_START + (STEPS.length - 1) * T_BALL_GAP + T_HOLD;
    q(() => setFading(true), totalVisible);

    // 5. Advance to next cycle (next layout shape)
    q(() => setCycle(c => c + 1), totalVisible + T_FADE + T_GAP);

    return () => ids.forEach(clearTimeout);
  }, [cycle, started]);

  // ─── render ─────────────────────────────────────────────────
  const gradId = `sg-${cycle}`;
  // Gradient always follows the path direction (left→right, based on start x)

  return (
    <section ref={sectionRef} className="py-16 relative overflow-hidden bg-[#040a16]">
      {/* Animated checkerboard — squares light up everywhere except over content */}
      <CheckerBG cycle={cycle} ballPositions={layout.positions} />

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(37,99,235,0.06) 0%, transparent 70%)' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">The Journey</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-3">WHAT HAPPENS NEXT</h2>
          <p className="text-gray-400 text-base max-w-lg mx-auto">
            From first call to paying customers — the exact path every time.
          </p>
        </motion.div>

        {/* ─── Desktop animated staircase ─────────────────────── */}
        <motion.div
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: T_FADE / 1000, ease: 'easeInOut' }}
          className="relative hidden md:block"
          style={{ height: 540 }}
        >
          {/* Layout name tag */}
          <div style={{
            position: 'absolute', bottom: 0, left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(148,163,184,0.45)',
            fontSize: 11, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.18em', textTransform: 'uppercase',
          }}>
            {layout.tag}
          </div>

          {/* Next layout hint */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            color: 'rgba(148,163,184,0.28)',
            fontSize: 10, fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif",
            letterSpacing: '0.12em',
          }}>
            next: {nextLayout.tag}
          </div>

          {/* SVG: path + spark */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 700 460"
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              {/*
                gradientUnits="userSpaceOnUse" with absolute coords avoids the
                degenerate-gradient bug on the straight horizontal path, where
                the default objectBoundingBox unit makes y1%==y2% (zero height)
                and Chrome renders the stroke invisible.
              */}
              <linearGradient id={gradId} gradientUnits="userSpaceOnUse"
                x1="70" y1="0" x2="630" y2="460">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="35%"  stopColor="#818cf8" />
                <stop offset="65%"  stopColor="#a855f7" />
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

            {/* Wide glow pass */}
            <path d={layout.path} fill="none"
              stroke={`url(#${gradId})`} strokeWidth="10"
              strokeLinecap="round" strokeLinejoin="round" opacity={0.18}
              strokeDasharray={layout.pathLen} strokeDashoffset={dashOffset}
              style={{ transition: `stroke-dashoffset ${layout.drawMs}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
            />
            {/* Main line */}
            <path d={layout.path} fill="none"
              stroke={`url(#${gradId})`} strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={layout.pathLen} strokeDashoffset={dashOffset}
              filter="url(#lineGlow)"
              style={{ transition: `stroke-dashoffset ${layout.drawMs}ms cubic-bezier(0.4,0,0.2,1) 80ms` }}
            />

            {/* Traveling spark */}
            {sparkOn && (
              <>
                <circle r="7" fill="rgba(255,255,255,0.22)" filter="url(#sparkGlow)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path={layout.path} />
                </circle>
                <circle r="3.5" fill="white" filter="url(#sparkGlow)">
                  <animateMotion dur="2.6s" repeatCount="indefinite" path={layout.path} />
                </circle>
              </>
            )}
          </svg>

          {/* ─── Balls ──────────────────────────────────────── */}
          {STEPS.map((step, i) => {
            const pos = layout.positions[i];
            const lx = `${(pos.svgX / 700) * 100}%`;
            const ty = `${(pos.svgY / 460) * 540}px`;

            // For straight layout, alternate labels above/below to avoid crowding
            const labelAbove = layout.tag.includes('STRAIGHT') && i % 2 === 0;

            return (
              <div key={`${cycle}-${i}`}
                style={{ position: 'absolute', left: lx, top: ty,
                  transform: 'translate(-50%, -50%)', zIndex: 20 }}>

                {/* Pulse ring */}
                {ballsShown[i] && (
                  <div style={{
                    position: 'absolute', inset: -14, borderRadius: '50%',
                    border: `1px solid ${step.color}45`,
                    animation: 'pulse 2.2s ease-in-out infinite',
                  }} />
                )}

                {/* Ball with spring pop */}
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

                {/* Label card — above or below depending on layout */}
                <motion.div
                  initial={{ opacity: 0, y: labelAbove ? -8 : 8 }}
                  animate={ballsShown[i]
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: labelAbove ? -8 : 8 }}
                  transition={{ delay: 0.18, duration: 0.35 }}
                  style={{
                    position: 'absolute',
                    ...(labelAbove
                      ? { bottom: 78, top: 'auto' }
                      : { top: 78 }),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 132, textAlign: 'center',
                    background: 'rgba(6,10,24,0.82)',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${step.color}28`,
                    borderRadius: 10, padding: '8px 10px',
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
                border: `2px solid ${step.color}`,
                boxShadow: `0 0 20px ${step.color}45`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>{step.emoji}</div>
              <div>
                <p className="text-white font-bold text-sm mb-0.5">{step.label}</p>
                <span style={{ color: step.color, fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {step.sub}
                </span>
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
          <Link href="/free-demo"
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
