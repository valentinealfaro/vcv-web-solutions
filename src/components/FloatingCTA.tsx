'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useAnimation } from 'motion/react';
import { ArrowRight, Rocket, MessageCircle, X, ChevronUp, Phone } from 'lucide-react';

export const FloatingCTA = () => {
  const [visible, setVisible]     = useState(false);
  const [chatOpen, setChatOpen]   = useState(false);
  const [showExit, setShowExit]   = useState(false);
  const [tabOpen, setTabOpen]     = useState(false);   // mobile tab expanded
  const edgeControls              = useAnimation();
  const lastScrollY               = useRef(0);
  const attentionTimer            = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Attention pulse: peek in from edge every 5s while user is scrolling
  useEffect(() => {
    const peek = () => {
      if (tabOpen) return;
      // Slide in → bounce → slide back
      edgeControls.start({
        x: [28, -8, 4, -2, 0, 28],
        transition: { duration: 1.1, times: [0, 0.35, 0.55, 0.7, 0.85, 1], ease: 'easeInOut' },
      });
    };
    // Fire on scroll (debounced)
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastScrollY.current) > 80) { lastScrollY.current = y; peek(); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    // Also fire on interval for idle users
    attentionTimer.current = setInterval(peek, 5000);
    return () => {
      window.removeEventListener('scroll', onScroll);
      clearInterval(attentionTimer.current);
    };
  }, [tabOpen, edgeControls]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit-shown')) {
        setShowExit(true);
        sessionStorage.setItem('exit-shown', '1');
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      {/* Scroll to top */}
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-24 right-6 z-40 hidden sm:flex w-10 h-10 glass-card items-center justify-center text-gray-400 hover:text-white hover:border-blue-500/30 transition-all">
            <ChevronUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Demo CTA */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-6 right-6 z-40 hidden sm:block">
            <Link href="/free-demo" className="btn-neon btn-glow text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 group">
              Get Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop chat FAB (hidden on mobile) ── */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 btn-neon rounded-full items-center justify-center shadow-2xl hover:scale-110 transition-transform hidden sm:flex">
        {chatOpen ? <X className="text-white w-5 h-5" /> : <MessageCircle className="text-white w-6 h-6" />}
      </button>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="fixed bottom-24 left-6 z-40 w-72 glass-card p-5 hidden sm:block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 btn-neon rounded-full flex items-center justify-center">
                <Rocket className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">VCV Web Solutions</p>
                <p className="text-green-400 text-xs flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                  Online now
                </p>
              </div>
            </div>
            <p className="text-gray-400 text-sm mb-4">👋 Hey! Ready to get more leads from your website?</p>
            <Link href="/free-demo" onClick={() => setChatOpen(false)}
              className="block btn-neon text-white px-4 py-2.5 rounded-xl text-center text-sm font-bold">
              Get My Free Demo →
            </Link>
            <a href="tel:+15809191386" className="block mt-2 text-center text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Or call (580) 919-1386
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile edge-peek tab (visible only on mobile, sm:hidden) ── */}
      <motion.div
        animate={edgeControls}
        initial={{ x: 28 }}
        className="fixed sm:hidden z-50"
        style={{ top: '42%', right: 0 }}>

        {/* Collapsed peek tab — sticks out from right edge */}
        {!tabOpen && (
          <button
            onClick={() => { setTabOpen(true); edgeControls.stop(); }}
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)',
              borderRadius: '14px 0 0 14px',
              boxShadow: '-4px 0 24px rgba(37,99,235,0.55), 0 0 40px rgba(124,58,237,0.35)',
              padding: '14px 10px 14px 14px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
              border: '1px solid rgba(255,255,255,0.15)', borderRight: 'none',
            }}>
            {/* Dot indicator */}
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80',
              boxShadow: '0 0 8px #4ade80', animation: 'pulse 1.4s ease-in-out infinite' }} />
            <MessageCircle style={{ width: 22, height: 22, color: 'white' }} />
            {/* Rotated label */}
            <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: 9, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
              Chat
            </span>
          </button>
        )}

        {/* Expanded panel — slides in when tapped */}
        <AnimatePresence>
          {tabOpen && (
            <motion.div
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              style={{
                width: 280, background: 'rgba(6,10,22,0.97)',
                borderRadius: '16px 0 0 16px', border: '1px solid rgba(99,102,241,0.4)',
                borderRight: 'none', padding: 20,
                boxShadow: '-8px 0 40px rgba(37,99,235,0.3)',
              }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Rocket style={{ width: 16, height: 16, color: 'white' }} />
                  </div>
                  <div>
                    <p style={{ color: '#f1f5f9', fontWeight: 800, fontSize: 13, margin: 0 }}>VCV Web Solutions</p>
                    <p style={{ color: '#4ade80', fontSize: 10, margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block' }} />
                      Online now
                    </p>
                  </div>
                </div>
                <button onClick={() => setTabOpen(false)}
                  style={{ color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                  <X style={{ width: 18, height: 18 }} />
                </button>
              </div>

              <p style={{ color: '#94a3b8', fontSize: 13, marginBottom: 16, lineHeight: 1.5 }}>
                👋 Ready to get more leads from your website?
              </p>

              <Link href="/free-demo" onClick={() => setTabOpen(false)}
                style={{ display: 'block', background: 'linear-gradient(135deg,#1d4ed8,#7c3aed)',
                  color: 'white', padding: '12px 16px', borderRadius: 12,
                  textAlign: 'center', fontWeight: 800, fontSize: 13,
                  textDecoration: 'none', marginBottom: 10,
                  boxShadow: '0 0 20px rgba(37,99,235,0.4)' }}>
                Get My Free Demo →
              </Link>

              <a href="tel:+15809191386"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  color: '#60a5fa', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                  padding: '10px', borderRadius: 10, background: 'rgba(37,99,235,0.1)',
                  border: '1px solid rgba(37,99,235,0.25)' }}>
                <Phone style={{ width: 14, height: 14 }} /> (580) 919-1386
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Exit intent popup */}
      <AnimatePresence>
        {showExit && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card p-8 max-w-md w-full relative">
              <button onClick={() => setShowExit(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <div className="text-center">
                <div className="w-14 h-14 btn-neon rounded-full flex items-center justify-center mx-auto mb-5">
                  <Rocket className="text-white w-7 h-7" />
                </div>
                <h3 className="font-display text-4xl text-white mb-3">WAIT!</h3>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                  Before you go — see what your business could look like with a{' '}
                  <span className="text-blue-400 font-bold">professional high-converting website</span>. It's completely free.
                </p>
                <Link href="/free-demo" onClick={() => setShowExit(false)}
                  className="block w-full btn-neon text-white py-3.5 rounded-xl font-bold mb-3">
                  Build My Free Demo
                </Link>
                <button onClick={() => setShowExit(false)} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
                  No thanks, I don't want more leads
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
