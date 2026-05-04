'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, Loader2, Clock, Gift, ArrowRight, CheckCircle2 } from 'lucide-react';

const STORAGE_KEY = 'vcv-exit-popup-shown-v1';
const TRIAL_DAYS  = 14;
const SETUP_FEE   = 297;
const SETUP_CENTS = 29700;

export const ExitIntentPopup = () => {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');
  const triggered  = useRef(false);
  const startTime  = useRef(Date.now());

  /* ── Detection ────────────────────────────────────────────── */
  useEffect(() => {
    // Already shown this session → skip
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY)) return;
    } catch { /* sessionStorage may be unavailable */ }

    const fire = () => {
      if (triggered.current) return;
      triggered.current = true;
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
      setOpen(true);
    };

    const minDwellMs = 5000;
    const isMobile   = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent);

    /* Desktop: mouse leaving through top of viewport (going for tab/back) */
    const onMouseLeave = (e: MouseEvent) => {
      if (Date.now() - startTime.current < minDwellMs) return;
      if (e.clientY <= 0) fire();
    };

    /* Mobile: scrolled down >35%, then back up to top + min dwell */
    let scrolledDown = false;
    const onScroll = () => {
      if (Date.now() - startTime.current < minDwellMs) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? window.scrollY / docH : 0;
      if (pct > 0.35) scrolledDown = true;
      if (scrolledDown && window.scrollY < 80) fire();
    };

    /* Mobile fallback: long idle time on page */
    const idleTimer = window.setTimeout(() => {
      if (isMobile) fire();
    }, 75000);

    /* History/back-button intent (works on mobile too) */
    const onPageHide = (e: PageTransitionEvent) => {
      if (!e.persisted && Date.now() - startTime.current > minDwellMs) fire();
    };

    if (!isMobile) document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      window.clearTimeout(idleTimer);
    };
  }, []);

  /* ── Actions ──────────────────────────────────────────────── */
  const handleClaim = async () => {
    setLoading(true); setErr('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `Nova Growth Plan — ${TRIAL_DAYS}-Day FREE Trial · Exclusive Exit Offer (first ${TRIAL_DAYS} days free, $297/mo after)`,
          amount:       SETUP_CENTS,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[10001] flex items-center justify-center px-4 py-6 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
          onClick={loading ? undefined : () => setOpen(false)}>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }}
            animate={{ opacity: 1, y: 0,   scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl my-auto"
            style={{
              background: 'rgba(5,12,22,0.99)',
              border: '1.5px solid rgba(34,197,94,0.4)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 80px rgba(34,197,94,0.25)',
            }}>

            {/* Close X */}
            <button onClick={() => setOpen(false)} disabled={loading}
              className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40 z-10"
              aria-label="Close">
              <X className="w-5 h-5"/>
            </button>

            {/* Animated gradient ribbon at the top */}
            <motion.div
              animate={{
                backgroundImage: [
                  'linear-gradient(90deg,#22c55e,#06b6d4,#3b82f6)',
                  'linear-gradient(90deg,#06b6d4,#3b82f6,#8b5cf6)',
                  'linear-gradient(90deg,#3b82f6,#8b5cf6,#ec4899)',
                  'linear-gradient(90deg,#8b5cf6,#ec4899,#22c55e)',
                  'linear-gradient(90deg,#ec4899,#22c55e,#06b6d4)',
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
              className="h-1.5 rounded-t-3xl"
            />

            <div className="p-6 md:p-8">
              {/* WAIT badge */}
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-4"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.5)' }}>
                <Clock className="w-3.5 h-3.5 text-red-400"/>
                <span className="text-red-400 font-bold text-xs tracking-widest">WAIT — DON'T GO YET</span>
              </motion.div>

              <h2 className="font-display text-3xl md:text-5xl text-white leading-[1.05] mb-3"
                style={{ textShadow: '0 0 30px rgba(34,197,94,0.5)' }}>
                Try Nova FREE for<br/>
                <span className="gradient-text">{TRIAL_DAYS} Full Days</span>
              </h2>

              <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-5">
                Pay <strong className="text-white">only the ${SETUP_FEE} setup fee today</strong> — no monthly charge for {TRIAL_DAYS} days.
                If Nova doesn&apos;t pay for itself, cancel before day {TRIAL_DAYS} and you&apos;re out nothing else.
              </p>

              {/* Value bullets */}
              <div className="grid sm:grid-cols-2 gap-2 mb-5">
                {[
                  { icon: <Gift className="w-4 h-4"/>,         label: `${TRIAL_DAYS} days FREE` },
                  { icon: <CheckCircle2 className="w-4 h-4"/>, label: 'No monthly charge today' },
                  { icon: <CheckCircle2 className="w-4 h-4"/>, label: 'Cancel anytime in trial' },
                  { icon: <CheckCircle2 className="w-4 h-4"/>, label: 'Live in 24-48 hrs' },
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)' }}>
                    <span className="text-green-400 flex-shrink-0">{b.icon}</span>
                    <span className="text-gray-100 font-semibold">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Today's charge box */}
              <div className="rounded-xl p-4 mb-5 text-center"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1.5px solid rgba(34,197,94,0.4)' }}>
                <p className="text-gray-300 text-xs uppercase tracking-widest font-bold mb-1">Today's charge</p>
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  <span className="font-display text-5xl md:text-6xl text-white"
                    style={{ textShadow: '0 0 24px rgba(34,197,94,0.55)' }}>
                    $297
                  </span>
                  <span className="text-gray-400 text-sm">one-time setup</span>
                </div>
                <p className="text-green-400 text-sm font-bold">
                  Then $0 for {TRIAL_DAYS} days · $297/mo after if you stay
                </p>
              </div>

              {err && <p className="text-red-400 text-xs text-center mb-3">{err}</p>}

              {/* CTAs */}
              <motion.button
                onClick={handleClaim}
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 disabled:opacity-60 mb-2"
                animate={{
                  backgroundImage: [
                    'linear-gradient(135deg,#22c55e,#06b6d4)',
                    'linear-gradient(135deg,#06b6d4,#3b82f6)',
                    'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    'linear-gradient(135deg,#8b5cf6,#22c55e)',
                  ],
                  boxShadow: [
                    '0 0 26px rgba(34,197,94,0.6)',
                    '0 0 26px rgba(6,182,212,0.6)',
                    '0 0 26px rgba(59,130,246,0.6)',
                    '0 0 26px rgba(139,92,246,0.6)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}>
                {loading
                  ? <><Loader2 className="w-5 h-5 animate-spin"/> Redirecting...</>
                  : <>🎁 Claim My {TRIAL_DAYS}-Day Free Trial <ArrowRight className="w-5 h-5"/></>}
              </motion.button>

              <button onClick={() => setOpen(false)} disabled={loading}
                className="w-full py-2.5 rounded-xl text-gray-500 text-xs hover:text-gray-300 transition-colors disabled:opacity-40">
                No thanks, I&apos;ll keep losing calls
              </button>

              <p className="text-center text-gray-500 text-[11px] mt-3">
                Or call Nova first to test it · <a href="tel:+15806569429" className="text-green-400 font-semibold hover:underline">
                  <Phone className="w-3 h-3 inline-block mr-0.5"/>(580) 656-9429
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
