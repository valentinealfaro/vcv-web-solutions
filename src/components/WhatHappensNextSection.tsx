import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─── Step data ───────────────────────────────────────────── */
interface Step {
  emoji: string;
  number: number;
  label: string;
  sub: string;
  color: string;
  // Positions in SVG viewBox "0 0 700 480"
  svgX: number;
  svgY: number;
}

const STEPS: Step[] = [
  { number: 1, emoji: '📞', label: 'Request your free demo',  sub: 'Free · No commitment',      color: '#3b82f6', svgX: 70,  svgY: 390 },
  { number: 2, emoji: '⚡', label: 'We build your preview',    sub: 'Done in 48 hours',           color: '#8b5cf6', svgX: 210, svgY: 295 },
  { number: 3, emoji: '✅', label: 'You approve or revise',    sub: 'Unlimited changes',           color: '#06b6d4', svgX: 350, svgY: 200 },
  { number: 4, emoji: '🚀', label: 'We launch your site live', sub: '3–7 days total',              color: '#a855f7', svgX: 490, svgY: 105 },
  { number: 5, emoji: '💰', label: 'Revenue. Every single day.', sub: '$$  Calls · Leads · Cash', color: '#10b981', svgX: 630, svgY: 15  },
];

// Staircase path connecting all 5 ball centers
const STAIR_PATH = 'M 70 390 H 140 V 295 H 280 V 200 H 420 V 105 H 560 V 15 H 630';
const PATH_LENGTH = 950;

/* ─── Component ───────────────────────────────────────────── */
export const WhatHappensNextSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.25 });
  const [dashOffset, setDashOffset] = useState(PATH_LENGTH);

  // Trigger path draw when section enters view
  useEffect(() => {
    if (inView) {
      const t = setTimeout(() => setDashOffset(0), 300);
      return () => clearTimeout(t);
    }
  }, [inView]);

  return (
    <section ref={sectionRef} className="py-20 bg-[#040a16] relative overflow-hidden">
      <div className="absolute inset-0 bg-dot opacity-25 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Heading */}
        <motion.div className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">The Journey</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-3">WHAT HAPPENS NEXT</h2>
          <p className="text-gray-400 text-base">Here's exactly what to expect — from first call to paying customers.</p>
        </motion.div>

        {/* ─── Desktop staircase ──────────────────────────────── */}
        {/*
          Container 480px tall. SVG viewBox "0 0 700 480" fills it.
          Each ball is absolutely positioned using the same proportions:
            CSS left = svgX/700*100%,  CSS top = svgY/480*100%
          This keeps DOM elements and the SVG path in perfect alignment.
        */}
        <div
          className="relative hidden md:block"
          style={{ height: 480 }}
        >
          {/* SVG: staircase path + glow */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 700 480"
            preserveAspectRatio="none"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="stairGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#3b82f6" />
                <stop offset="40%"  stopColor="#8b5cf6" />
                <stop offset="75%"  stopColor="#a855f7" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Wide glow pass */}
            <path
              d={STAIR_PATH} fill="none"
              stroke="url(#stairGrad)" strokeWidth="8"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={PATH_LENGTH} strokeDashoffset={dashOffset}
              opacity={0.25}
              style={{ transition: `stroke-dashoffset 2.8s cubic-bezier(0.4,0,0.2,1) 0.4s` }}
            />
            {/* Main visible line */}
            <path
              d={STAIR_PATH} fill="none"
              stroke="url(#stairGrad)" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray={PATH_LENGTH} strokeDashoffset={dashOffset}
              filter="url(#lineGlow)"
              style={{ transition: `stroke-dashoffset 2.8s cubic-bezier(0.4,0,0.2,1) 0.4s` }}
            />

            {/* Start label: phone */}
            <text x="30" y="430" fill="#3b82f6" fontSize="22" textAnchor="middle">📞</text>
            {/* End label: customer + $$ */}
            <text x="670" y="60" fill="#10b981" fontSize="22" textAnchor="middle">🤑</text>
            <text
              x="670" y="80" fill="#10b981" fontSize="13" fontWeight="900"
              textAnchor="middle" fontFamily="'Bebas Neue', cursive" letterSpacing="2"
              style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }}>
              $$
            </text>
          </svg>

          {/* ─── Balls (DOM, spring-animated) ─────────────────── */}
          {STEPS.map((step, i) => {
            const leftPct = (step.svgX / 700) * 100;
            const topPct  = (step.svgY / 480) * 100;

            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${leftPct}%`,
                  top:  `${topPct}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 20,
                }}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6 + i * 0.38,
                  type: 'spring',
                  stiffness: 280,
                  damping: 13,
                }}
              >
                {/* Ball */}
                <div style={{
                  width: 62, height: 62, borderRadius: '50%',
                  background: `radial-gradient(circle at 38% 32%, ${step.color}ee, ${step.color}55)`,
                  border: `2px solid ${step.color}`,
                  boxShadow: `0 0 22px ${step.color}55, 0 0 50px ${step.color}22, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  cursor: 'default', userSelect: 'none',
                }}>
                  <span style={{ fontSize: 24, lineHeight: 1 }}>{step.emoji}</span>
                </div>

                {/* Step number badge */}
                <div style={{
                  position: 'absolute', top: -8, right: -8,
                  width: 22, height: 22, borderRadius: '50%',
                  background: step.color,
                  border: '2px solid #040a16',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontSize: 10, fontWeight: 900,
                }}>
                  {step.number}
                </div>

                {/* Label card — offset below the ball */}
                <div style={{
                  position: 'absolute',
                  top: 74,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 130,
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}>
                  <p style={{
                    color: '#f1f5f9', fontWeight: 700, fontSize: 12,
                    lineHeight: 1.4, margin: '0 0 4px',
                    textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                  }}>
                    {step.label}
                  </p>
                  <p style={{
                    color: step.color, fontSize: 10, fontWeight: 700,
                    textTransform: 'uppercase', letterSpacing: '0.07em',
                    textShadow: `0 0 8px ${step.color}60`,
                    margin: 0,
                  }}>
                    {step.sub}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Mobile fallback ──────────────────────────────── */}
        <div className="md:hidden space-y-5">
          {STEPS.map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="flex items-center gap-4">
              <div style={{
                width: 56, height: 56, borderRadius: '50%', flexShrink: 0,
                background: `radial-gradient(circle at 35% 35%, ${step.color}dd, ${step.color}55)`,
                border: `2px solid ${step.color}`,
                boxShadow: `0 0 18px ${step.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>
                {step.emoji}
              </div>
              <div>
                <p className="text-white font-bold text-sm mb-0.5">{step.label}</p>
                <p style={{ color: step.color, fontSize: 11, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  {step.sub}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="ml-auto text-gray-600 flex-shrink-0">↓</div>
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA nudge */}
        <motion.div className="text-center mt-12"
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }} viewport={{ once: true }}>
          <Link to="/free-demo"
            className="btn-neon btn-glow text-white px-10 py-4 rounded-full font-bold text-base inline-flex items-center gap-2 group">
            Start Step 1 — It's Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};
