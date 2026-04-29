'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInView } from 'motion/react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';

/* ─── Pixel-font word speller ──────────────────────────────── */
const WG = 3; // gap between cells (px) — constant

const FONT: Record<string, number[][]> = {
  G: [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
  E: [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
  T: [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
  F: [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
  R: [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
  D: [[1,1,1,0,0],[1,0,0,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,1,0],[1,1,1,0,0]],
  M: [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
  O: [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
};

const WORD_COLORS: Record<string, string[]> = {
  GET:  ['#3b82f6','#8b5cf6','#06b6d4'],
  FREE: ['#ef4444','#f97316','#eab308','#22c55e'],
  DEMO: ['#06b6d4','#3b82f6','#8b5cf6','#ec4899'],
};

// ws = cell_size + WG (the "step" per column)
// Widest word: FREE / DEMO = 4 chars → totalW = 4*(5*ws-WG) + 3*(2*ws) = 26*ws - 12
const calcWS    = (cW: number, pct = 0.88) => Math.min(33, Math.max(18, Math.floor((cW * pct + 12) / 26)));
const wordWidth = (nChars: number, ws: number) => nChars * (5*ws - WG) + (nChars - 1) * 2 * ws;
const wordHeight = (ws: number) => 7 * ws - WG;

// Build cell list for a word, horizontally centred at cW/2, top edge at yPx
const getWordCellsAt = (
  word: string, cW: number, yPx: number, ws: number,
): { x: number; y: number; color: string; k: string; wc: number }[] => {
  const chars   = word.split('');
  const wc      = ws - WG; // visual cell size
  const charPx  = 5 * ws - WG;
  const totalW  = wordWidth(chars.length, ws);
  const ox      = (cW - totalW) / 2;
  const palette = WORD_COLORS[word] || ['#3b82f6'];
  const cells: { x:number; y:number; color:string; k:string; wc:number }[] = [];
  chars.forEach((ch, ci) => {
    const pattern = FONT[ch] || [];
    const cx = ox + ci * (charPx + 2 * ws);
    const color = palette[ci % palette.length];
    pattern.forEach((row, ri) =>
      row.forEach((on, col) => {
        if (on) cells.push({ x: cx + col*ws, y: yPx + ri*ws, color, wc,
          k: `${word}${ci}r${ri}c${col}` });
      })
    );
  });
  return cells;
};

interface WordEntry { word: string; tiltDeg: number; opacity: number; yPx: number; ws: number }

const WordSpeller = ({
  cW, cH, fading, cycle,
}: { cW: number; cH: number; fading: boolean; cycle: number }) => {
  const [entries,  setEntries]  = useState<WordEntry[]>([]);
  const prevFading = useRef(false);
  const timers     = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  const q = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };

  // Unmount cleanup
  useEffect(() => () => clearAll(), []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Safety: hide words the instant the staircase starts rebuilding ──────
  useEffect(() => {
    if (!fading) { clearAll(); setEntries([]); }
  }, [fading]);

  useEffect(() => {
    // Rising-edge only
    if (!fading || prevFading.current) { prevFading.current = fading; return; }
    prevFading.current = fading;

    // ── Sizes ────────────────────────────────────────────────────────────
    const ws       = calcWS(cW, 0.88);
    const wh       = wordHeight(ws);
    const bandTop  = cH * 0.30;
    const bandBot  = cH * 0.90;
    const cy       = bandTop + (bandBot - bandTop - wh) / 2;

    // Stacked sizes (used on cycle % 4 === 3)
    const sws      = calcWS(cW, 0.78);
    const swh      = wordHeight(sws);
    const gap      = Math.round(sws * 0.55);
    const stackH   = 3 * swh + 2 * gap;
    const sy       = Math.max(cH * 0.28, (cH - stackH) / 2);

    // ── One word per fade window — rotate through GET → FREE → DEMO → ALL ─
    const phase = cycle % 4;

    if (phase === 3) {
      // Every 4th fade: show all three stacked simultaneously
      q(() => setEntries([
        { word:'GET',  tiltDeg:0, opacity:0.94, yPx:sy,               ws:sws },
        { word:'FREE', tiltDeg:0, opacity:0.94, yPx:sy + swh + gap,   ws:sws },
        { word:'DEMO', tiltDeg:0, opacity:0.94, yPx:sy + 2*(swh+gap), ws:sws },
      ]), 0);
    } else {
      const WORDS  = ['GET', 'FREE', 'DEMO'] as const;
      const TILTS  = [0, -5, 5];
      q(() => setEntries([{
        word: WORDS[phase], tiltDeg: TILTS[phase],
        opacity: 0.92, yPx: cy, ws,
      }]), 0);
    }

    // Auto-clear ~200 ms before the staircase starts rebuilding (~1100 ms window)
    q(() => setEntries([]), 880);

    // `cycle` is safe in deps now — the safety effect above handles clearing
    // when fading→false, so no in-flight timers survive past the staircase fade
  }, [fading, cycle]);

  if (!cW || entries.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none hidden md:block"
      style={{ zIndex: 30, overflow: 'hidden' }}>
      <AnimatePresence>
        {entries.map((entry, ei) => {
          const cells = getWordCellsAt(entry.word, cW, entry.yPx, entry.ws);
          return (
            <motion.div
              key={`${entry.word}-${cycle}-${ei}`}
              className="absolute inset-0"
              style={{ transformOrigin: 'center center' }}
              initial={{ rotate: entry.tiltDeg * 0.6, opacity: 0 }}
              animate={{ rotate: entry.tiltDeg, opacity: 1 }}
              exit={{ rotate: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}>
              {cells.map((c, i) => (
                <motion.div key={c.k}
                  style={{ position: 'absolute', width: c.wc, height: c.wc, borderRadius: 4,
                    background: c.color, border: `1.5px solid ${c.color}`,
                    boxShadow: `0 0 10px ${c.color}90, 0 0 24px ${c.color}45` }}
                  initial={{ x: (Math.random()-0.5)*cW, y: (Math.random()-0.5)*cH,
                             scale: 0, opacity: 0, rotate: (Math.random()-0.5)*180 }}
                  animate={{ x: c.x, y: c.y, scale: 1, opacity: entry.opacity, rotate: 0 }}
                  exit={{ x: (Math.random()-0.5)*cW, y: (Math.random()-0.5)*cH,
                          scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 80, damping: 13, delay: i * 0.005 }}
                />
              ))}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

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
      const isMobile = W < 768;

      if (isMobile) {
        // On mobile: only block a narrow center strip for the heading text
        const hL = Math.floor(W * 0.1 / CELL), hR = Math.ceil(W * 0.9 / CELL), hB = Math.ceil(120 / CELL);
        for (let c = hL; c <= hR; c++) for (let r = 0; r <= hB; r++) set.add(`${c},${r}`);
        // No ball blocking on mobile — squares can go everywhere else
      } else {
        // Desktop: block heading zone + staircase ball zones
        const hL = Math.floor(W * 0.12 / CELL), hR = Math.ceil(W * 0.88 / CELL), hB = Math.ceil(265 / CELL);
        for (let c = hL; c <= hR; c++) for (let r = 0; r <= hB; r++) set.add(`${c},${r}`);
        const svgW = W * 0.88, svgL = (W - svgW) / 2, svgTop = 270;
        ballPositions.forEach(({ svgX, svgY }) => {
          const bc = Math.round((svgL + (svgX / 700) * svgW) / CELL);
          const br = Math.round((svgTop + (svgY / 460) * 500) / CELL);
          for (let dc = -3; dc <= 3; dc++) for (let dr = -3; dr <= 3; dr++) set.add(`${bc+dc},${br+dr}`);
        });
      }
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

      // ── Spawn multiple blocks per tick — faster, denser ──
      if (!isClearing && ts - spawnTick > 40 && lit.length < 90) {
        spawnTick = ts;
        const blocked = getBlocked();
        // Spawn 2-3 at once for density
        const spawnCount = Math.random() < 0.4 ? 3 : 2;
        for (let s = 0; s < spawnCount; s++) {
          for (let attempt = 0; attempt < 50; attempt++) {
            const c = Math.floor(Math.random() * cols), r = Math.floor(Math.random() * rows);
            if (!blocked.has(`${c},${r}`) && !lit.find(l => l.c === c && l.r === r)) {
              lit.push({
                c, r, alpha: 0,
                col: CHECKER_COLORS[Math.floor(Math.random() * CHECKER_COLORS.length)],
                decay: 0.0015 + Math.random() * 0.003, // longer-lived
                rising: true,
              });
              break;
            }
          }
        }
      }

      // ── Random mid-life color shift — each block can change color ──
      lit.forEach(l => {
        if (!l.rising && l.alpha > 0.15 && Math.random() < 0.002) {
          l.col = CHECKER_COLORS[Math.floor(Math.random() * CHECKER_COLORS.length)];
        }
      });

      // ── Update & draw ──
      lit = lit.filter(l => l.alpha >= 0);
      lit.forEach(l => {
        if (isClearing) { l.rising = false; l.decay = 0.04; }
        if (l.rising) {
          l.alpha += 0.028; // faster rise
          if (l.alpha >= 0.72) { l.alpha = 0.72; l.rising = false; } // brighter max
        } else {
          l.alpha -= l.decay;
        }
        const x = l.c * CELL, y = l.r * CELL;
        const [rv, gv, bv] = l.col;
        // Fill — more opaque
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${l.alpha})`;
        ctx.fillRect(x + 1, y + 1, CELL - 2, CELL - 2);
        // Bright border
        ctx.strokeStyle = `rgba(${rv},${gv},${bv},${Math.min(1, l.alpha * 2.2)})`;
        ctx.lineWidth = 1.8;
        ctx.strokeRect(x + 0.5, y + 0.5, CELL - 1, CELL - 1);
        // Inner glow highlight
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${l.alpha * 0.25})`;
        ctx.fillRect(x + 4, y + 4, CELL - 8, CELL - 8);
        // Corner accent dots
        const d = 3;
        ctx.fillStyle = `rgba(${rv},${gv},${bv},${Math.min(1, l.alpha * 2.5)})`;
        [[x+d,y+d],[x+CELL-d,y+d],[x+d,y+CELL-d],[x+CELL-d,y+CELL-d]].forEach(([cx,cy]) => {
          ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI*2); ctx.fill();
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
  { n: 1, emoji: '📞', label: 'Request a design preview', sub: 'Custom-built for your business', color: '#3b82f6' },
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
  const [dims, setDims] = useState({ w:0, h:0 });

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setDims({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

      {/* Animated checkerboard blocks */}
      <CheckerBG cycle={cycle} ballPositions={layout.positions} clearing={fading} />

      {/* Word speller — synced to staircase fade cycle */}
      <WordSpeller cW={dims.w} cH={dims.h} fading={fading} cycle={cycle} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div className="text-center mb-10"
          initial={{ opacity:0, y:24, filter:'blur(6px)' }}
          whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
          transition={{ duration:0.7, ease:[0.16,1,0.3,1] }}
          viewport={{ once:true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">The Journey</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-3"
            style={{ textShadow:'0 0 40px rgba(37,99,235,0.5), 0 0 80px rgba(139,92,246,0.25)' }}>
            WHAT HAPPENS <span className="gradient-text">NEXT</span>
          </h2>
          <motion.p className="text-gray-400 text-base max-w-lg mx-auto"
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.6, delay:0.2, ease:[0.16,1,0.3,1] }}
            viewport={{ once:true }}>
            From first call to paying customers — the exact path every time.
          </motion.p>
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
          <FreeDemoButton size="lg" label="Start Step 1 — Request Preview" />
          <p className="text-gray-600 text-xs mt-3">Starts at $97/mo · 30-day results guarantee · Cancel anytime</p>
        </motion.div>

      </div>
    </section>
  );
};
