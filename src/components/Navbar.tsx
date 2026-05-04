'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Phone, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { name: 'Home',           path: '/' },
  { name: 'Services',       path: '/services' },
  { name: 'AI Receptionist',path: '/ai-receptionist' },
  { name: 'Pricing',        path: '/pricing' },
  { name: 'Contact',        path: '/contact' },
];

const LOGO_SRC = 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf';

/* Cycling color sequences — border / VCV text / subtitle text — always different */
const BORDER_CYCLE = ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#eab308','#ef4444','#3b82f6'];
const VCV_CYCLE    = ['#f97316','#22c55e','#ec4899','#8b5cf6','#eab308','#ef4444','#06b6d4','#f97316'];
const SUB_CYCLE    = ['#ec4899','#06b6d4','#eab308','#ef4444','#3b82f6','#8b5cf6','#22c55e','#ec4899'];
const LOGO_DUR     = 3.5;

export const Navbar = () => {
  const [isOpen,   setIsOpen]   = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setIsOpen(false); }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled
        ? 'py-2 bg-[#030712]/92 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
        : 'py-4 bg-transparent',
    )}>

      {/* Animated bottom border line */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        animate={{
          background: [
            'linear-gradient(90deg,transparent,rgba(59,130,246,0.6),transparent)',
            'linear-gradient(90deg,transparent,rgba(139,92,246,0.6),transparent)',
            'linear-gradient(90deg,transparent,rgba(6,182,212,0.6),transparent)',
            'linear-gradient(90deg,transparent,rgba(236,72,153,0.6),transparent)',
            'linear-gradient(90deg,transparent,rgba(59,130,246,0.6),transparent)',
          ],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        style={{ opacity: scrolled ? 1 : 0.35 }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* ── Logo (smaller on mobile per design) ── */}
          <Link href="/" className="group flex-shrink-0">
            <motion.div
              className="flex flex-col items-center px-2 md:px-3 py-1 md:py-1.5 rounded-xl border-2 cursor-pointer select-none"
              animate={{ borderColor: BORDER_CYCLE, boxShadow: BORDER_CYCLE.map(c => `0 0 16px ${c}60`) }}
              transition={{ duration: LOGO_DUR, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.06 }}>
              <img src={LOGO_SRC} alt="VCV Web Solutions"
                className="w-7 h-7 md:w-9 md:h-9 object-contain mb-0.5" referrerPolicy="no-referrer" />
              <motion.span
                className="text-xs md:text-sm font-black leading-none tracking-widest"
                animate={{ color: VCV_CYCLE }}
                transition={{ duration: LOGO_DUR, repeat: Infinity, ease: 'linear' }}>
                VCV
              </motion.span>
              <motion.span
                className="text-[8px] md:text-[9px] font-bold leading-none tracking-widest uppercase mt-0.5"
                animate={{ color: SUB_CYCLE }}
                transition={{ duration: LOGO_DUR, repeat: Infinity, ease: 'linear' }}>
                Web Solutions
              </motion.span>
            </motion.div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-1 flex-1 justify-center">

            {/* Phone */}
            <a href="tel:+15809191386"
              className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05] group mr-2">
              <motion.div
                animate={{ color:['#3b82f6','#8b5cf6','#06b6d4','#3b82f6'] }}
                transition={{ duration:3, repeat:Infinity, ease:'linear' }}>
                <Phone className="w-3.5 h-3.5" />
              </motion.div>
              <span className="hidden lg:inline">(580) 919-1386</span>
            </a>

            <div className="w-px h-5 bg-white/10 mx-1" />

            {/* Nav links */}
            {LINKS.map(link => {
              const active = pathname === link.path;
              return (
                <Link key={link.name} href={link.path}
                  className="relative px-4 py-2 rounded-lg text-sm font-semibold transition-all group">

                  {/* Active / hover background */}
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{ background:'rgba(37,99,235,0.15)', border:'1px solid rgba(37,99,235,0.3)' }}
                      transition={{ type:'spring', stiffness:380, damping:30 }}
                    />
                  )}

                  <span className={cn(
                    'relative z-10 transition-colors',
                    active ? 'text-white' : 'text-gray-300 group-hover:text-white',
                  )}>
                    {link.name}
                  </span>

                  {/* Hover underline sweep */}
                  {!active && (
                    <span className="absolute bottom-1 left-3 right-3 h-[2px] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                      style={{ background:'linear-gradient(90deg,#3b82f6,#8b5cf6)' }} />
                  )}

                  {/* Active dot */}
                  {active && (
                    <motion.span
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400"
                      animate={{ opacity:[1,0.4,1], scale:[1,1.4,1] }}
                      transition={{ duration:1.8, repeat:Infinity }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* ── CTA button ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/free-demo"
                className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm text-white">
                {/* Rainbow bg */}
                <motion.span
                  className="absolute inset-0 rounded-full"
                  animate={{
                    backgroundImage:[
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                      'linear-gradient(135deg,#06b6d4,#22c55e)',
                      'linear-gradient(135deg,#22c55e,#ec4899)',
                      'linear-gradient(135deg,#ec4899,#3b82f6)',
                    ],
                    boxShadow:[
                      '0 0 18px rgba(59,130,246,0.65)',
                      '0 0 18px rgba(139,92,246,0.65)',
                      '0 0 18px rgba(6,182,212,0.65)',
                      '0 0 18px rgba(34,197,94,0.65)',
                      '0 0 18px rgba(236,72,153,0.65)',
                    ],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />
                <Zap className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">Free Demo</span>
                <ArrowRight className="w-3.5 h-3.5 relative z-10 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-lg transition-all"
            style={{ background: isOpen ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <AnimatePresence mode="wait">
              {isOpen
                ? <motion.div key="x" initial={{rotate:-90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:90,opacity:0}} transition={{duration:.2}}><X className="w-4 h-4 text-white"/></motion.div>
                : <motion.div key="m" initial={{rotate:90,opacity:0}} animate={{rotate:0,opacity:1}} exit={{rotate:-90,opacity:0}} transition={{duration:.2}}><Menu className="w-4 h-4 text-gray-300"/></motion.div>
              }
            </AnimatePresence>
          </button>

        </div>
      </div>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            transition={{ duration:.3, ease:'easeInOut' }}
            className="md:hidden overflow-hidden"
            style={{ background:'rgba(3,7,18,0.97)', borderTop:'1px solid rgba(255,255,255,0.07)', backdropFilter:'blur(20px)' }}>
            <div className="px-5 py-5 space-y-1">

              {/* Phone */}
              <a href="tel:+15809191386"
                className="flex items-center gap-3 py-3 px-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/[0.05] transition-all border border-transparent hover:border-white/[0.06]">
                <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-600/30 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5 text-blue-400"/>
                </div>
                (580) 919-1386
              </a>

              <div className="h-px bg-white/[0.05] my-2" />

              {/* Nav links */}
              {LINKS.map((link, i) => {
                const active = pathname === link.path;
                return (
                  <motion.div key={link.name}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link href={link.path} onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 py-3 px-3 rounded-xl text-base font-semibold transition-all',
                        active
                          ? 'text-white bg-blue-600/15 border border-blue-600/25'
                          : 'text-gray-300 hover:text-white hover:bg-white/[0.05] border border-transparent',
                      )}>
                      {active && <motion.span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" animate={{ opacity:[1,.3,1] }} transition={{ duration:1.5, repeat:Infinity }}/>}
                      {link.name}
                    </Link>
                  </motion.div>
                );
              })}

              <div className="h-px bg-white/[0.05] my-2" />

              {/* CTA */}
              <motion.div
                whileTap={{ scale: 0.97 }}>
                <Link href="/free-demo" onClick={() => setIsOpen(false)}
                  className="relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white text-base mt-1">
                  <motion.span
                    className="absolute inset-0"
                    animate={{
                      backgroundImage:[
                        'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                        'linear-gradient(135deg,#8b5cf6,#06b6d4)',
                        'linear-gradient(135deg,#06b6d4,#ec4899)',
                        'linear-gradient(135deg,#ec4899,#3b82f6)',
                      ],
                    }}
                    transition={{ duration:3, repeat:Infinity, ease:'linear' }}
                  />
                  <Zap className="w-4 h-4 relative z-10"/>
                  <span className="relative z-10">Get My Design Preview</span>
                  <ArrowRight className="w-4 h-4 relative z-10"/>
                </Link>
              </motion.div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
