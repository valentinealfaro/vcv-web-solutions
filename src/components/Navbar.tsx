'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
      scrolled
        ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.07] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent py-5'
    )}>
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="group">
            <motion.div
              className="flex flex-col items-center px-3 py-1.5 rounded-xl border-2 cursor-pointer select-none"
              animate={{
                borderColor: ['#3b82f6','#8b5cf6','#06b6d4','#22c55e','#ec4899','#eab308','#ef4444','#3b82f6'],
                boxShadow:   [
                  '0 0 14px rgba(59,130,246,0.55)',
                  '0 0 14px rgba(139,92,246,0.55)',
                  '0 0 14px rgba(6,182,212,0.55)',
                  '0 0 14px rgba(34,197,94,0.55)',
                  '0 0 14px rgba(236,72,153,0.55)',
                  '0 0 14px rgba(234,179,8,0.55)',
                  '0 0 14px rgba(239,68,68,0.55)',
                  '0 0 14px rgba(59,130,246,0.55)',
                ],
              }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              whileHover={{ scale: 1.05 }}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
                alt="VCV Web Solutions"
                className="w-9 h-9 object-contain mb-0.5"
                referrerPolicy="no-referrer"
              />
              <motion.span
                className="text-sm font-black leading-none block tracking-widest"
                animate={{ color: ['#f97316','#22c55e','#ec4899','#8b5cf6','#eab308','#ef4444','#06b6d4','#f97316'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}>
                VCV
              </motion.span>
              <motion.span
                className="text-[9px] font-bold leading-none block tracking-widest uppercase mt-0.5"
                animate={{ color: ['#ec4899','#06b6d4','#eab308','#ef4444','#3b82f6','#8b5cf6','#22c55e','#ec4899'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}>
                Web Solutions
              </motion.span>
            </motion.div>
          </Link>

          <div className="hidden md:flex items-center gap-5">
            <a href="tel:+15809191386" className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
              <Phone className="w-3.5 h-3.5 text-blue-500 group-hover:animate-pulse" />
              (580) 919-1386
            </a>
            <div className="h-4 w-px bg-white/10" />
            {links.map(link => (
              <Link key={link.name} href={link.path}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                  pathname === link.path ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                )}>
                {link.name}
                <span className={cn(
                  'absolute -bottom-1 left-0 h-px bg-blue-500 transition-all duration-300',
                  pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
            <Link href="/free-demo" className="btn-glow btn-neon text-white px-5 py-2.5 rounded-full text-sm font-bold ml-1 flex items-center gap-1.5">
              Free Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.07] py-6 px-6 space-y-1">
            {links.map(link => (
              <Link key={link.name} href={link.path} onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-3 text-base font-medium border-b border-white/[0.04] transition-colors',
                  pathname === link.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                )}>
                {link.name}
              </Link>
            ))}
            <Link href="/free-demo" onClick={() => setIsOpen(false)}
              className="block btn-neon text-white px-5 py-3 rounded-xl text-center font-bold mt-3">
              Get Free Demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
