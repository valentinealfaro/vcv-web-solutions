import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowRight, Phone, Mail, Globe, Rocket, MessageCircle, ChevronUp } from 'lucide-react';
import { cn } from './lib/utils';

// Pages — lazy loaded so each route is a separate chunk
const Home             = lazy(() => import('./pages/Home'));
const Services         = lazy(() => import('./pages/Services'));
const Pricing          = lazy(() => import('./pages/Pricing'));
const Landing          = lazy(() => import('./pages/Landing'));
const Portfolio        = lazy(() => import('./pages/Portfolio'));
const Contact          = lazy(() => import('./pages/Contact'));
const Blog             = lazy(() => import('./pages/Blog'));
const BlogPost         = lazy(() => import('./pages/BlogPost'));
const Success          = lazy(() => import('./pages/Success'));
const WebsiteOnboarding = lazy(() => import('./pages/WebsiteOnboarding'));
const NotFound         = lazy(() => import('./pages/NotFound'));

// Suspense fallback — dark screen with no flash while lazy chunk loads
const PageLoader = () => (
  <div style={{ minHeight: '100vh', background: '#030712' }} />
);

/* ─── Custom Cursor ───────────────────────────────────────── */
const CustomCursor = () => {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: -100, y: -100 });
  const outerPos = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (inner.current) {
        inner.current.style.left = e.clientX + 'px';
        inner.current.style.top = e.clientY + 'px';
      }
    };

    let animId: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      outerPos.current.x = lerp(outerPos.current.x, pos.current.x, 0.15);
      outerPos.current.y = lerp(outerPos.current.y, pos.current.y, 0.15);
      if (outer.current) {
        outer.current.style.left = outerPos.current.x + 'px';
        outer.current.style.top = outerPos.current.y + 'px';
      }
      animId = requestAnimationFrame(tick);
    };
    tick();

    const onEnter = () => {
      isHovering.current = true;
      outer.current?.classList.add('hovering');
      inner.current?.classList.add('hovering');
    };
    const onLeave = () => {
      isHovering.current = false;
      outer.current?.classList.remove('hovering');
      inner.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', move);
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    // Re-attach on route change
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a,button,[data-hover]').forEach(el => {
        el.addEventListener('mouseenter', onEnter);
        el.addEventListener('mouseleave', onLeave);
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', move);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={outer} className="cursor-outer hidden md:block" />
      <div ref={inner} className="cursor-inner hidden md:block" />
    </>
  );
};

/* ─── Navbar ──────────────────────────────────────────────── */
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [location]);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-400',
      scrolled
        ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.07] py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
        : 'bg-transparent py-5'
    )}>
      {/* Gradient accent line on bottom when scrolled */}
      {scrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-600/40 to-transparent" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
                alt="VCV Web Solutions"
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <span className="text-lg font-bold text-white leading-none block">VCV</span>
              <span className="text-xs font-semibold text-blue-400 leading-none block tracking-wider uppercase">Web Solutions</span>
            </div>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-5">
            <a href="tel:+15809191386"
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors flex items-center gap-1.5 group">
              <Phone className="w-3.5 h-3.5 text-blue-500 group-hover:animate-pulse" />
              (580) 919-1386
            </a>
            <div className="h-4 w-px bg-white/10" />
            {links.map(link => (
              <Link key={link.name} to={link.path}
                className={cn(
                  'text-sm font-medium transition-colors relative group',
                  location.pathname === link.path ? 'text-blue-400' : 'text-gray-400 hover:text-white'
                )}>
                {link.name}
                <span className={cn(
                  'absolute -bottom-1 left-0 h-px bg-blue-500 transition-all duration-300',
                  location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
            <Link to="/free-demo"
              className="btn-glow btn-neon text-white px-5 py-2.5 rounded-full text-sm font-bold ml-1 flex items-center gap-1.5">
              Free Demo <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile button */}
          <button onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#030712]/95 backdrop-blur-xl border-b border-white/[0.07] py-6 px-6 space-y-1">
            {links.map(link => (
              <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-3 text-base font-medium border-b border-white/[0.04] transition-colors',
                  location.pathname === link.path ? 'text-blue-400' : 'text-gray-300 hover:text-white'
                )}>
                {link.name}
              </Link>
            ))}
            <Link to="/free-demo" onClick={() => setIsOpen(false)}
              className="block btn-neon text-white px-5 py-3 rounded-xl text-center font-bold mt-3">
              Get Free Demo
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* ─── Footer ──────────────────────────────────────────────── */
const Footer = () => (
  <footer className="relative bg-[#030712] border-t border-white/[0.06] pt-20 pb-10 overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />
    <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-blue-900/5 blur-[80px] rounded-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link to="/" className="flex items-center gap-2 mb-5">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
              alt="VCV Web Solutions"
              className="w-8 h-8 object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="font-bold text-white">VCV Web Solutions</span>
          </Link>
          <p className="text-gray-500 text-sm leading-relaxed mb-6">
            High-converting websites, SEO, and ad systems designed to grow your business — fast.
          </p>
          <div className="neon-badge w-fit">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
            Available Now
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Services</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            {['Website Design', 'SEO Optimization', 'Paid Ads Setup', 'Social Media Growth'].map(s => (
              <li key={s}><Link to="/services" className="hover:text-blue-400 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            {[['Portfolio', '/portfolio'], ['Pricing', '/pricing'], ['Blog', '/blog'], ['Contact', '/contact']].map(([n, p]) => (
              <li key={n}><Link to={p} className="hover:text-blue-400 transition-colors">{n}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>info@vcvservices.com</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <a href="tel:+15809191386" className="hover:text-blue-400 transition-colors">+1 (580) 919-1386</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span>Global Services</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-600">
        <p>© {new Date().getFullYear()} VCV Web Solutions. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Floating CTAs ───────────────────────────────────────── */
const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);
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
            <Link to="/free-demo"
              className="btn-neon btn-glow text-white px-5 py-3.5 rounded-full font-bold text-sm shadow-2xl flex items-center gap-2 group">
              Get Free Demo
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat FAB */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 left-6 z-40 hidden sm:flex w-12 h-12 btn-neon rounded-full items-center justify-center shadow-2xl">
        {chatOpen ? <X className="w-5 h-5 text-white" /> : <MessageCircle className="w-5 h-5 text-white" />}
      </button>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            className="fixed bottom-20 left-6 z-40 w-72 glass-card p-5 hidden sm:block">
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
            <Link to="/free-demo" onClick={() => setChatOpen(false)}
              className="block btn-neon text-white px-4 py-2.5 rounded-xl text-center text-sm font-bold">
              Get My Free Demo →
            </Link>
            <a href="tel:+15809191386"
              className="block mt-2 text-center text-gray-500 hover:text-gray-300 text-xs transition-colors">
              Or call (580) 919-1386
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ─── Exit Intent ─────────────────────────────────────────── */
const ExitIntentPopup = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem('exit-shown')) {
        setShow(true);
        sessionStorage.setItem('exit-shown', '1');
      }
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, []);

  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full relative">
        <button onClick={() => setShow(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <div className="text-center">
          <div className="w-14 h-14 btn-neon rounded-full flex items-center justify-center mx-auto mb-5">
            <Rocket className="text-white w-7 h-7" />
          </div>
          <h3 className="font-display text-4xl text-white mb-3">WAIT!</h3>
          <p className="text-gray-400 mb-6 text-sm leading-relaxed">
            Before you go — see what your business could look like with a <span className="text-blue-400 font-bold">professional high-converting website</span>. It's completely free.
          </p>
          <Link to="/free-demo" onClick={() => setShow(false)}
            className="block w-full btn-neon text-white py-3.5 rounded-xl font-bold mb-3">
            Build My Free Demo
          </Link>
          <button onClick={() => setShow(false)} className="text-gray-500 hover:text-gray-300 text-xs transition-colors">
            No thanks, I don't want more leads
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ─── App ─────────────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 selection:text-blue-200">
        <CustomCursor />
        <Navbar />
        <main>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/success" element={<Success />} />
              <Route path="/website-onboarding" element={<WebsiteOnboarding />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/free-demo" element={<Landing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
        <FloatingCTA />
        <ExitIntentPopup />

        {/* Mobile sticky call/text bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden">
          <a href="tel:+15809191386" className="flex-1 btn-neon py-4 text-center font-bold text-sm flex items-center justify-center gap-2">
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <a href="sms:+15809191386"
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors">
            <MessageCircle className="w-4 h-4" /> Text Us
          </a>
        </div>
      </div>
    </Router>
  );
}
