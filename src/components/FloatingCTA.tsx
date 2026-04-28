'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Rocket, MessageCircle, X, ChevronUp } from 'lucide-react';

export const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 2500);
    return () => clearTimeout(t);
  }, []);

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

      {/* Chat FAB */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 btn-neon rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
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
