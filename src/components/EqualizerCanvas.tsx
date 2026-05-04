'use client';
import { useEffect, useRef } from 'react';

/**
 * Vapi-style colorful equalizer-bar background.
 * Pills at fixed positions slowly oscillate height with sine waves +
 * randomized phases so the field feels alive without being chaotic.
 */
export const EqualizerCanvas = ({ opacity = 0.45 }: { opacity?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;

    const COLORS = [
      '#ffffff', '#fde047', '#22c55e', '#06b6d4',
      '#a855f7', '#ec4899', '#f97316', '#3b82f6',
      '#10b981', '#fbbf24', '#ef4444', '#8b5cf6',
    ];
    const BAR_W   = 6;
    const BAR_GAP = 7;
    const ROWS    = 7;

    interface Bar { x:number; y:number; baseH:number; phase:number; speed:number; color:string }
    let bars: Bar[] = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const cols = Math.floor(canvas.width / (BAR_W + BAR_GAP));
      const rowH = canvas.height / ROWS;
      bars = [];
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.18) continue;       // random gaps for organic feel
          bars.push({
            x:     c * (BAR_W + BAR_GAP),
            y:     r * rowH + rowH / 2,
            baseH: 6 + Math.random() * 22,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 1.4,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
          });
        }
      }
    };

    let animId = 0;
    let t = 0;
    const draw = () => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      /* ─── Voice activity envelope ──────────────────────────
         Two cross-faded sine waves create natural "talking" rhythm:
         loud bursts (words) interspersed with quieter pauses (breaths).
         Range ≈ 0.25 (quiet) → 1.15 (loud peak)                 */
      const env =
        0.55 +
        0.45 * Math.abs(Math.sin(t * 0.018) * Math.cos(t * 0.011 + 0.7)) +
        0.15 * Math.sin(t * 0.07);

      bars.forEach(b => {
        // Fast voice-like oscillation (the rapid waveform jitter)
        const fast   = Math.sin(t * 0.22 * b.speed + b.phase) * 16;
        // Slower sub-rhythm
        const slow   = Math.sin(t * 0.06 * b.speed + b.phase * 1.7) * 7;
        // Random jitter — natural voice irregularity
        const jitter = (Math.random() - 0.5) * 5;

        const h = Math.max(3, b.baseH + (fast + slow + jitter) * env);
        const y = b.y - h / 2;

        ctx.globalAlpha = opacity;
        ctx.fillStyle   = b.color;

        const rad = BAR_W / 2;
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(b.x, y, BAR_W, h, rad);
        } else {
          ctx.moveTo(b.x + rad, y);
          ctx.arcTo(b.x + BAR_W, y,         b.x + BAR_W, y + rad,   rad);
          ctx.arcTo(b.x + BAR_W, y + h,     b.x + BAR_W - rad, y+h, rad);
          ctx.arcTo(b.x,         y + h,     b.x, y + h - rad,       rad);
          ctx.arcTo(b.x,         y,         b.x + rad, y,           rad);
        }
        ctx.fill();
      });

      t++;
      animId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, [opacity]);

  return (
    <canvas ref={ref}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 1 }} />
  );
};
