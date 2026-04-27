import { motion } from 'motion/react';

export const WatchHowItWorksSection = () => (
  <section className="py-20 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-600/8 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* ── Heading ─────────────────────────────────── */}
      <motion.div className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="neon-badge mb-5 mx-auto w-fit gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
          Live Demo &nbsp;·&nbsp; 7 Scenes &nbsp;·&nbsp; Auto-Plays
        </div>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">
          WATCH THE{' '}
          <span className="gradient-text">TRANSFORMATION</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          Watch a real business go from a dead, outdated website to a 24/7 lead machine.
          Before. During. After. All in under 60 seconds.
        </p>
      </motion.div>

      {/* ── Monitor frame + iframe ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }} viewport={{ once: true }}
        className="relative max-w-5xl mx-auto">

        {/* Floating stat — left */}
        <motion.div
          initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }} viewport={{ once: true }}
          className="absolute -left-5 top-1/4 z-20 glass-card px-4 py-3 hidden xl:block">
          <p className="text-green-400 font-bold text-xl leading-none mb-1">+145%</p>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">More Leads</p>
        </motion.div>

        {/* Floating stat — right */}
        <motion.div
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }} viewport={{ once: true }}
          className="absolute -right-5 top-1/3 z-20 glass-card px-4 py-3 hidden xl:block">
          <p className="text-blue-400 font-bold text-xl leading-none mb-1">3–7 Days</p>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">To Launch</p>
        </motion.div>

        {/* Monitor bezel */}
        <div style={{
          background: 'linear-gradient(145deg, #141928, #0a0e1a)',
          borderRadius: 22,
          padding: 4,
          boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 60px 120px rgba(0,0,0,0.85), 0 0 100px rgba(37,99,235,0.14)',
        }}>
          {/* Chrome bar */}
          <div style={{
            background: '#0c1019',
            borderRadius: '18px 18px 0 0',
            padding: '13px 20px',
            display: 'flex', alignItems: 'center', gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            {/* Traffic lights */}
            <div style={{ display: 'flex', gap: 7, flexShrink: 0 }}>
              {['#ef4444','#eab308','#22c55e'].map((c, i) => (
                <div key={i} style={{ width: 12, height: 12, borderRadius: '50%', background: c,
                  boxShadow: `0 0 6px ${c}99` }} />
              ))}
            </div>
            {/* URL bar */}
            <div style={{
              flex: 1, background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6, padding: '4px 12px', textAlign: 'center',
              color: 'rgba(255,255,255,0.28)', fontSize: 11,
              fontFamily: 'monospace', letterSpacing: '0.03em',
            }}>
              🔒&nbsp; vcv-transformation-demo.html
            </div>
            {/* Live badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 999, padding: '3px 10px',
              color: '#f87171', fontSize: 10, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444',
                display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
              AUTO-PLAYING
            </div>
          </div>

          {/* iframe */}
          <div style={{ aspectRatio: '16/9', borderRadius: '0 0 18px 18px', overflow: 'hidden', background: '#000' }}>
            <iframe
              src="/demo.html"
              className="w-full h-full"
              title="VCV Web Solutions Transformation Demo"
              allow="autoplay; fullscreen"
              style={{ display: 'block', border: 'none' }}
            />
          </div>
        </div>

        {/* Glow puddle under monitor */}
        <div style={{
          position: 'absolute', bottom: -50, left: '15%', right: '15%',
          height: 50, borderRadius: '50%',
          background: 'rgba(37,99,235,0.35)',
          filter: 'blur(35px)',
          pointerEvents: 'none',
        }} />
      </motion.div>

      {/* ── What you'll see — 3 cards ────────────────── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto mt-14"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }} viewport={{ once: true }}>
        {[
          { emoji: '💀', color: '#ef4444', title: 'The BEFORE',  body: 'A real ugly, outdated website losing customers every day.' },
          { emoji: '⚡', color: '#818cf8', title: 'The BUILD',   body: 'Custom design, SEO, lead forms — done in 3–7 days flat.' },
          { emoji: '🤑', color: '#10b981', title: 'The AFTER',   body: 'A converting lead machine bringing in calls and cash daily.' },
        ].map((c, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }} viewport={{ once: true }}
            className="glass-card p-6 text-center group"
            style={{ borderColor: `${c.color}20` }}>
            <div className="text-3xl mb-3">{c.emoji}</div>
            <p className="font-bold text-sm mb-2" style={{ color: c.color }}>{c.title}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{c.body}</p>
          </motion.div>
        ))}
      </motion.div>

    </div>
  </section>
);
