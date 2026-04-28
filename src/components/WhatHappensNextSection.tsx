'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/* ─── Checkerboard background ─────────────────────────────── */
const CELL = 50;
// More vibrant, varied palette
const CHECKER_COLORS: [number,number,number][] = [
  [59,  130, 246],   // blue
  [99,  102, 241],   // indigo
  [168, 85,  247],   // purple
  [6,   182, 212],   // cyan
  [16,  185, 129],   // emerald
  [245, 158, 11],    // amber
  [236, 72,  153],   // pink
  [239, 68,  68],    // red
  [20,  184, 166],   // teal
  [234, 179, 8],     // yellow
];

const CheckerBG = ({ cycle, ballPositions, clearing }: {
  cycle: number;
  ballPositions: { svgX: number; svgY: number }[];
  clearing: boolean;
}) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const clearingRef = useRef(clearing);
  useEffect(() => { clearingRef.current = clearing; }, [clearing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let spawnTick = 0;

    interface LitCell { c: number; r: number; alpha: number; col: [number,number,number]; decay: number; rising: boolean }
    let lit: LitCell[] = [];

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const getBlocked = () => {
      const set = new Set<string>();
      const W = canvas.width;
      // Heading zone: top ~265px, center 12–88% width
      const hL = Math.floor(W * 0.12 / CELL), hR = Math.ceil(W * 0.88 / CELL), hB = Math.ceil(265 / CELL);
      for (let c = hL; c <= hR; c++) for (let r = 0; r <= hB; r++) set.add(`${c},${r}`);
      // Ball zones: 3-cell radius
      const svgW = W * 0.88, svgL = (W - svgW) / 2, svgTop = 270;
      ballPositions.forEach(({ svgX, svgY }) => {
        const bc = Math.round((svgL + (svgX / 700) * svgW) / CELL);
        const br = Math.round((svgTop + (svgY / 460) * 500) / CELL);
        for (let dc = -3; dc <= 3; dc++) for (let dr = -3; dr <= 3; dr++) set.add(`${bc+dc},${br+dr}`);
      });
      return set;
    };

    const draw = (ts: number) => {
      const W = canvas.width, H = canvas.height;
      const cols = Math.ceil(W / CELL), rows = Math.ceil(H / CELL);
      ctx.clearRect(0, 0, W, H);

      // ── Grid lines ──
      ctx.strokeStyle = 'rgba(99,102,241,0.09)';
      ctx.lineWidth = 0.7;
      for (let c = 0; c <= cols; c++) { ctx.beginPath(); ctx.moveTo(c*CELL, 0); ctx.lineTo(c*CELL, H); ctx.stroke(); }
      for (let r = 0; r <= rows; r++) { ctx.beginPath(); ctx.moveTo(0, r*CELL); ctx.lineTo(W, r*CELL); ctx.stroke(); }

      const isClearing = clearingRef.current;

      // ── Spawn (only when not clearing) ──
      if (!isClearing && ts - spawnTick > 75 && lit.length < 55) {
        spawnTick = ts;
        const blocked = getBlocked();
        for (let attempt = 0; attempt < 40; attempt++) {
          const c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows);
          if (!blocked.has(`${c},${r}`) && !lit.find(l => l.c === c && l.r === r)) {
            lit.push({
              c, r, alpha: 0,
              col: CHECKER_COLORS[Math.floor(Math.random() * CHECKER_COLORS.length)],
              decay: 0.002 + Math.random() * 0.004,
              rising: true,
            });
            break;
          }
        }
      }

      // ── Update & draw ──
      lit = lit.filter(l => l.alpha >= 0);
      lit.forEach(l => {
        if (isClearing) {
          // Fast drain when layout is switching
          l.rising = false;
          l.decay = 0.04;
        }
        if (l.rising) {
          l.alpha += 0.022;
          if (l.alpha >= 0.42) { l.alpha = 0.42; l.rising = false; }
        } else {
          l.alpha -= l.decay;
        }
        const x = l.c * CELL, y = l.r * CELL;
        const [rv, gv, bv] = l.col;
        // Fill
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${l.alpha})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
        // Bright border
        ctx.strokeStyle = `rgba(${rv},${gv},${bv},${Math.min(1, l.alpha * 2.8)})`;
        ctx.lineWidth = 1.4;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        // Corner accent dots
        const d = 3;
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${Math.min(1, l.alpha * 3)})`;
        [[x+d,y+d],[x+CELL-d,y+d],[x+d,y+CELL-d],[x+CELL-d,y+CELL-d]].forEach(([cx,cy]) => {
          ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI*2); ctx.fill();
        });
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
const T_HOLD       = 8000;  // 8 s hold — gives users time to read each layout
const T_FADE       = 700;   // fade-out duration
const T_GAP        = 400;   // black gap before next cycle

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
      {/* Animated checkerboard — lights up, then clears when layout switches */}
      <CheckerBG cycle={cycle} ballPositions={layout.positions} clearing={fading} />

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
                      ? { bottom: 82, top: 'auto' }
                      : { top: 82 }),
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 150, textAlign: 'center',
                    background: 'rgba(4,8,20,0.94)',
                    backdropFilter: 'blur(16px)',
                    border: `1.5px solid ${step.color}50`,
                    borderRadius: 12, padding: '10px 12px',
                    pointerEvents: 'none',
                    boxShadow: `0 0 20px ${step.color}20, 0 8px 32px rgba(0,0,0,0.7)`,
                  }}
                >
                  <p style={{ color: '#f8fafc', fontWeight: 800, fontSize: 13,
                    lineHeight: 1.35, margin: '0 0 6px',
                    textShadow: `0 0 12px ${step.color}60, 0 1px 4px rgba(0,0,0,0.9)` }}>
                    {step.label}
                  </p>
                  <span style={{
                    display: 'inline-block',
                    background: `${step.color}28`, border: `1px solid ${step.color}60`,
                    borderRadius: 20, padding: '3px 10px',
                    color: step.color, fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    textShadow: `0 0 8px ${step.color}80`,
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
