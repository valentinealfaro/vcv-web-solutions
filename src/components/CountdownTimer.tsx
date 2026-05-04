'use client';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Zap } from 'lucide-react';

/* ─── Rolling countdown ──────────────────────────────────────────
   Always shows N hours remaining for the current promo. Resets daily
   at the configured local time so it never expires (urgency without
   the dishonesty of a fake fixed deadline).

   For each visitor, the countdown is anchored to the next 11:59pm
   local time, so it feels real ("ends today, midnight!") and
   resets organically each day.
─────────────────────────────────────────────────────────────────── */
const pad = (n: number) => String(n).padStart(2, '0');

interface Remaining { h: number; m: number; s: number; }

const getRemaining = (): Remaining => {
  const now = new Date();
  // End of today, local time
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  const ms = Math.max(0, end.getTime() - now.getTime());
  return {
    h: Math.floor(ms / 3_600_000),
    m: Math.floor((ms % 3_600_000) / 60_000),
    s: Math.floor((ms % 60_000) / 1000),
  };
};

interface Props {
  message?: string;       // headline above the digits
  variant?: 'inline' | 'banner';
}

export const CountdownTimer = ({
  message = '14-Day Free Trial expires today',
  variant = 'inline',
}: Props) => {
  const [t, setT] = useState<Remaining | null>(null);

  useEffect(() => {
    setT(getRemaining());
    const id = setInterval(() => setT(getRemaining()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!t) return null;

  if (variant === 'banner') {
    return (
      <motion.div
        animate={{ boxShadow: ['0 0 14px rgba(239,68,68,0.3)','0 0 26px rgba(239,68,68,0.55)','0 0 14px rgba(239,68,68,0.3)'] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="inline-flex items-center gap-3 rounded-full px-4 py-2"
        style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.45)' }}>
        <Zap className="w-4 h-4 text-red-400 flex-shrink-0"/>
        <span className="text-red-400 font-bold text-xs tracking-wide whitespace-nowrap">
          {message}
        </span>
        <span className="font-display text-white text-base tracking-wide tabular-nums">
          {pad(t.h)}:{pad(t.m)}:{pad(t.s)}
        </span>
      </motion.div>
    );
  }

  /* Inline (large digits — for hero / pricing sections) */
  return (
    <div className="inline-flex flex-col items-center gap-2">
      <span className="inline-flex items-center gap-2 text-red-400 text-xs font-bold tracking-widest">
        <Clock className="w-3.5 h-3.5"/> {message.toUpperCase()}
      </span>
      <div className="flex gap-2">
        {[
          { v: t.h, l: 'HRS' },
          { v: t.m, l: 'MIN' },
          { v: t.s, l: 'SEC' },
        ].map((u, i) => (
          <div key={i} className="flex flex-col items-center min-w-[60px] py-2 px-3 rounded-lg"
            style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.35)' }}>
            <span className="font-display text-3xl text-white leading-none tabular-nums"
              style={{ textShadow:'0 0 14px rgba(239,68,68,0.5)' }}>
              {pad(u.v)}
            </span>
            <span className="text-[9px] text-red-400 font-bold tracking-widest mt-0.5">{u.l}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
