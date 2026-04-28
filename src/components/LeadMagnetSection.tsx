import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

/* ─── 7-wave rainbow canvas ───────────────────────────────── */
const RainbowWaves = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // 7 waves at different angles — each "moves" in its own direction
    const waves = [
      { freq: 0.013, amp: 75, speed: 0.9,  offset: 0.25, angle: 0,    hue: 0   },
      { freq: 0.010, amp: 85, speed: 0.7,  offset: 0.45, angle: 38,   hue: 52  },
      { freq: 0.016, amp: 65, speed: 1.2,  offset: 0.65, angle: -32,  hue: 104 },
      { freq: 0.009, amp: 95, speed: 0.55, offset: 0.30, angle: 76,   hue: 160 },
      { freq: 0.018, amp: 58, speed: 1.5,  offset: 0.75, angle: -68,  hue: 210 },
      { freq: 0.012, amp: 78, speed: 1.0,  offset: 0.55, angle: 112,  hue: 265 },
      { freq: 0.014, amp: 70, speed: 0.8,  offset: 0.40, angle: 148,  hue: 320 },
    ];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const draw = () => {
      const { width: w, height: h } = canvas;
      ctx.clearRect(0, 0, w, h);
      const diag = Math.sqrt(w * w + h * h);

      waves.forEach((wave) => {
        const hue = (wave.hue + t * 28) % 360;
        const rad = (wave.angle * Math.PI) / 180;
        const hw  = diag / 2 + 120;
        const yC  = (wave.offset - 0.5) * h;

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.rotate(rad);

        // Filled wave band (very transparent fill)
        ctx.beginPath();
        for (let x = -hw; x <= hw; x += 3) {
          const y = yC + wave.amp * Math.sin(x * wave.freq + t * wave.speed);
          x === -hw ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.lineTo(hw, h + 200);
        ctx.lineTo(-hw, h + 200);
        ctx.closePath();
        ctx.fillStyle = `hsla(${hue},100%,62%,0.07)`;
        ctx.fill();

        // Wave edge line (brighter)
        ctx.beginPath();
        for (let x = -hw; x <= hw; x += 3) {
          const y = yC + wave.amp * Math.sin(x * wave.freq + t * wave.speed);
          x === -hw ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `hsla(${hue},100%,72%,0.55)`;
        ctx.lineWidth   = 2.2;
        ctx.shadowColor = `hsl(${hue},100%,70%)`;
        ctx.shadowBlur  = 10;
        ctx.stroke();
        ctx.shadowBlur  = 0;

        ctx.restore();
      });

      t += 0.011;
      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'screen', opacity: 0.9 }}
    />
  );
};

/* ─── Section ─────────────────────────────────────────────── */
export const LeadMagnetSection = () => (
  <section className="py-24 relative overflow-hidden bg-[#030712]">
    {/* Rainbow wave canvas fills the whole section */}
    <RainbowWaves />
    <div className="absolute inset-0 bg-dot opacity-20 pointer-events-none" />

    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* ── Card with spinning rainbow border ─────────── */}
      <div className="relative" style={{ padding: 3, borderRadius: 28 }}>

        {/* Spinning conic-gradient border */}
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', inset: 0, borderRadius: 28,
            background: `conic-gradient(
              hsl(0,100%,65%),   hsl(45,100%,65%),  hsl(90,100%,65%),
              hsl(135,100%,65%), hsl(180,100%,65%), hsl(225,100%,65%),
              hsl(270,100%,65%), hsl(315,100%,65%), hsl(360,100%,65%)
            )`,
          }}
        />

        {/* Glow matching the border */}
        <div style={{
          position: 'absolute', inset: -8, borderRadius: 36,
          background: `conic-gradient(
            hsl(0,100%,50%),   hsl(60,100%,50%),  hsl(120,100%,50%),
            hsl(180,100%,50%), hsl(240,100%,50%),  hsl(300,100%,50%), hsl(360,100%,50%)
          )`,
          filter: 'blur(18px)',
          opacity: 0.45,
          pointerEvents: 'none',
        }} />

        {/* Card body */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(3,7,18,0.92)',
          backdropFilter: 'blur(24px)',
          borderRadius: 25,
          padding: '52px 48px',
        }}>

          {/* ── Pulsing headline ───────────────────────── */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>

            {/* "(Worth $297)" badge — bouncing pulse */}
            <motion.div
              className="inline-flex items-center gap-2 mb-5"
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 0 12px rgba(74,222,128,0.5)',
                  '0 0 28px rgba(74,222,128,0.9)',
                  '0 0 12px rgba(74,222,128,0.5)',
                ],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              style={{
                background: 'rgba(74,222,128,0.12)',
                border: '1px solid rgba(74,222,128,0.5)',
                borderRadius: 999,
                padding: '6px 18px',
                display: 'inline-flex',
              }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#4ade80',
                textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                💰 Worth $297 — Yours Free
              </span>
            </motion.div>

            {/* Main headline — rainbow glow pulse */}
            <motion.h2
              className="font-display text-white leading-none mb-3 select-none"
              style={{ fontSize: 'clamp(2.8rem, 6vw, 4.5rem)' }}
              animate={{
                scale: [1, 1.04, 1],
                filter: [
                  'drop-shadow(0 0 10px rgba(255, 80,  80, 0.75))',
                  'drop-shadow(0 0 22px rgba(255,180,  0, 0.85))',
                  'drop-shadow(0 0 22px rgba( 80,255, 80, 0.85))',
                  'drop-shadow(0 0 22px rgba( 80,160,255, 0.85))',
                  'drop-shadow(0 0 22px rgba(200, 60,255, 0.85))',
                  'drop-shadow(0 0 22px rgba(255, 60,180, 0.85))',
                  'drop-shadow(0 0 10px rgba(255, 80,  80, 0.75))',
                ],
              }}
              transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}>
              FREE WEBSITE AUDIT
            </motion.h2>

            <p className="text-gray-400 text-base leading-relaxed max-w-lg mx-auto">
              Enter your details and we'll send you a custom, in-depth audit of your site —
              what's costing you leads and exactly how to fix it.
            </p>
          </motion.div>

          {/* ── Form ──────────────────────────────────── */}
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={(e) => e.preventDefault()}>
            {[
              { placeholder: 'Business Name', type: 'text' },
              { placeholder: 'Website URL',   type: 'url'  },
              { placeholder: 'Phone Number',  type: 'tel'  },
              { placeholder: 'Email Address', type: 'email'},
            ].map((f, i) => (
              <input
                key={i}
                type={f.type}
                placeholder={f.placeholder}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 14,
                  padding: '14px 18px',
                  color: '#f1f5f9',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.6)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
            ))}

            {/* Submit — rainbow gradient button */}
            <motion.button
              type="submit"
              className="md:col-span-2 w-full text-white font-bold text-base rounded-2xl py-4 flex items-center justify-center gap-2 group"
              style={{
                background: 'linear-gradient(135deg, #ef4444, #f97316, #eab308, #22c55e, #3b82f6, #8b5cf6)',
                backgroundSize: '300% 100%',
                backgroundPosition: '0% 50%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}>
              Get My Free Audit — No Strings Attached
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </form>

          <p className="text-center text-gray-600 text-xs mt-4">
            No credit card · Delivered within 24 hours · 100% free
          </p>
        </div>
      </div>

    </div>
  </section>
);
