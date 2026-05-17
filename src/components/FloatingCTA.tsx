'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket, MessageCircle, X, ChevronUp } from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';

export const FloatingCTA = () => {
  const [visible,  setVisible]  = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
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
            <FreeDemoButton size="sm" label="Get Free Demo" />
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
            <FreeDemoButton size="xs" label="Get My Free Demo" fullWidth rounded="xl" onClick={() => setChatOpen(false)} />
            <a href="tel:+15809191386" className="block mt-2 text-center text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Or call (580) 919-1386
            </a>
          </motion.div>
        )}
      </AnimatePresence>


    </>
  );
};
