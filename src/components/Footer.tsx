'use client';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { Mail, Phone, MapPin, Star, Zap, CheckCircle2 } from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';
import { useEffect, useRef, useState } from 'react';

/* ─── HLS video background ─────────────────────────────────── */
const HLS_SRC = 'https://stream.mux.com/Kec29dVyJgiPdtWaQtPuEiiGHkJIYQAVUJcNiIHUYeo.m3u8';

const FooterVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let hlsInstance: import('hls.js').default | null = null;

    import('hls.js').then(({ default: Hls }) => {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({ lowLatencyMode: true, startLevel: -1 });
        hlsInstance.loadSource(HLS_SRC);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = HLS_SRC;
        video.play().catch(() => {});
      }
    }).catch(() => {});

    return () => { hlsInstance?.destroy(); };
  }, []);

  return (
    <>
      {/* video layer — mix-blend-screen so black areas disappear */}
      <video
        ref={videoRef}
        muted autoPlay loop playsInline
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        style={{ objectFit: 'cover', mixBlendMode: 'screen', opacity: 0.28, zIndex: 0 }}
      />
      {/* dark scrim so text stays readable over the video */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(3,7,18,0.72)', zIndex: 1 }} />
    </>
  );
};

const SERVICES = [
  { label:'Website Design',       path:'/services' },
  { label:'SEO Optimization',     path:'/services' },
  { label:'Google Ads Ready',     path:'/services' },
  { label:'Lead Generation',      path:'/services' },
  { label:'Hosting & Maintenance',path:'/services' },
];

const COMPANY = [
  { label:'Home',          path:'/' },
  { label:'Services',      path:'/services' },
  { label:'Pricing',       path:'/pricing' },
  { label:'Contact',       path:'/contact' },
  { label:'Design Preview',path:'/free-demo' },
  { label:'Terms & Privacy',path:'/terms' },
];

const STATS = [
  { val:'50+',    label:'Businesses Launched' },
  { val:'3-7',    label:'Days to Launch' },
  { val:'$97',    label:'Starting Per Month' },
  { val:'30-Day', label:'Results Guarantee' },
];

/* ─── Stat card with traveling dot + mouse-tilt ─────────────── */
const StatTiltCard = ({ s, i }: { s: typeof STATS[0]; i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [dims,   setDims]   = useState({ w: 200, h: 80 });

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const sRotX = useSpring(rotX, { stiffness: 200, damping: 22 });
  const sRotY = useSpring(rotY, { stiffness: 200, damping: 22 });

  useEffect(() => {
    const el = cardRef.current; if (!el) return;
    const measure = () => setDims({ w: el.offsetWidth, h: el.offsetHeight });
    measure();
    const obs = new ResizeObserver(measure);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    rotY.set(x * 16);
    rotX.set(-y * 16);
  };
  const onLeave = () => { rotX.set(0); rotY.set(0); };

  const { w, h } = dims;
  const r = 12;
  const path = `M ${r} 0 L ${w-r} 0 Q ${w} 0 ${w} ${r} L ${w} ${h-r} Q ${w} ${h} ${w-r} ${h} L ${r} ${h} Q 0 ${h} 0 ${h-r} L 0 ${r} Q 0 0 ${r} 0 Z`;
  const dur = `${2.6 + i * 0.5}s`;
  const uid = `fdot-${i}`;

  return (
    <motion.div
      initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true }} transition={{ delay: i * 0.08 }}
      style={{ perspective: '600px' }}>
      <motion.div
        ref={cardRef}
        className="text-center px-4 py-4 rounded-xl relative cursor-default select-none"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          rotateX: sRotX, rotateY: sRotY,
          transformStyle: 'preserve-3d',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        whileHover={{ scale: 1.04 }}>

        {/* Traveling dot around the border */}
        <svg className="absolute inset-0 pointer-events-none" width="100%" height="100%"
          viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible', zIndex:5 }}>
          <defs>
            <filter id={uid} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Glow halo */}
          <circle r="12" fill="rgba(37,99,235,0.14)" filter={`url(#${uid})`}>
            <animateMotion dur={dur} repeatCount="indefinite" path={path}/>
          </circle>
          {/* Coloured dot */}
          <circle r="4.5" fill="rgba(139,92,246,0.95)" filter={`url(#${uid})`}>
            <animateMotion dur={dur} repeatCount="indefinite" path={path}/>
          </circle>
          {/* Bright core */}
          <circle r="2" fill="white">
            <animateMotion dur={dur} repeatCount="indefinite" path={path}/>
          </circle>
        </svg>

        <div className="relative z-10 font-display text-2xl text-white mb-0.5"
          style={{ textShadow:'0 0 20px rgba(59,130,246,0.5)' }}>
          {s.val}
        </div>
        <div className="relative z-10 text-gray-500 text-xs uppercase tracking-wider font-semibold">
          {s.label}
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Footer = () => (
  <footer className="relative bg-[#030712] overflow-hidden">

    {/* HLS video background */}
    <FooterVideo />

    {/* Top gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" style={{ zIndex: 2 }} />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" style={{ zIndex: 2 }} />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" style={{ zIndex: 2 }} />

    {/* ── CTA strip ── */}
    <div className="relative z-10 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-widest mb-2">Ready to get more leads?</p>
            <h3 className="font-display text-4xl md:text-5xl text-white leading-none"
              style={{ textShadow:'0 0 40px rgba(37,99,235,0.4)' }}>
              GET YOUR DESIGN
              <span className="gradient-text"> PREVIEW</span>
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <FreeDemoButton size="sm" label="Request Preview" />
            <a href="tel:+15809191386"
              className="glass-card text-white px-8 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:border-blue-500/40 transition-all">
              <Phone className="w-4 h-4 text-blue-400"/> (580) 919-1386
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* ── Stats bar ── */}
    <div className="relative z-10 border-b border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => <StatTiltCard key={i} s={s} i={i} />)}
        </div>
      </div>
    </div>

    {/* ── Main grid ── */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* Brand — 2 cols */}
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-3 mb-5 group">
            <motion.div
              className="relative rounded-xl p-1.5 flex-shrink-0"
              style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)' }}
              animate={{
                borderColor:['rgba(59,130,246,0.4)','rgba(139,92,246,0.4)','rgba(6,182,212,0.4)','rgba(59,130,246,0.4)'],
                boxShadow:['0 0 12px rgba(59,130,246,0.3)','0 0 12px rgba(139,92,246,0.3)','0 0 12px rgba(6,182,212,0.3)','0 0 12px rgba(59,130,246,0.3)'],
              }}
              transition={{ duration:4, repeat:Infinity, ease:'linear' }}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
                alt="VCV Web Solutions" className="w-9 h-9 object-contain" referrerPolicy="no-referrer"
              />
            </motion.div>
            <div>
              <p className="font-bold text-white text-base leading-none">VCV Web Solutions</p>
              <p className="text-gray-500 text-xs mt-0.5">Local Business Growth Experts</p>
            </div>
          </Link>

          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            We build high-converting websites for local service businesses — engineered to rank on Google, generate leads, and grow your revenue. From design preview to live site in 3-7 days.
          </p>

          {/* Trust badges */}
          <div className="space-y-2 mb-6">
            {[
              'Design preview before you commit',
              '30-day results guarantee',
              'You own your site — no lock-in',
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0"/>
                {t}
              </div>
            ))}
          </div>

          {/* Available badge */}
          <motion.div
            animate={{ boxShadow:['0 0 8px rgba(74,222,128,0.3)','0 0 18px rgba(74,222,128,0.6)','0 0 8px rgba(74,222,128,0.3)'] }}
            transition={{ duration:2, repeat:Infinity, ease:'easeInOut' }}
            className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"/>
            <span className="text-green-300 text-xs font-bold tracking-wide">ACCEPTING NEW CLIENTS NOW</span>
          </motion.div>

          {/* Social proof stars */}
          <div className="flex items-center gap-2 mt-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_,i)=><Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/>)}
            </div>
            <span className="text-gray-500 text-xs">50+ businesses launched</span>
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-blue-400"/> Services
          </h4>
          <ul className="space-y-3">
            {SERVICES.map(s => (
              <li key={s.label}>
                <Link href={s.path}
                  className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors flex-shrink-0"/>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-sm bg-purple-500/40 border border-purple-500/50 flex-shrink-0 inline-block"/>
            Company
          </h4>
          <ul className="space-y-3">
            {COMPANY.map(c => (
              <li key={c.label}>
                <Link href={c.path}
                  className="text-gray-400 text-sm hover:text-white transition-colors flex items-center gap-1.5 group">
                  <span className="w-1 h-1 rounded-full bg-purple-500/50 group-hover:bg-purple-400 transition-colors flex-shrink-0"/>
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-5 flex items-center gap-2">
            <Mail className="w-3.5 h-3.5 text-cyan-400"/> Contact
          </h4>
          <ul className="space-y-4">
            <li>
              <a href="mailto:info@vcvservices.com"
                className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background:'rgba(59,130,246,0.15)', border:'1px solid rgba(59,130,246,0.3)' }}>
                  <Mail className="w-3.5 h-3.5 text-blue-400"/>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Email</p>
                  <p className="text-gray-300 text-sm font-medium group-hover:text-blue-400 transition-colors">info@vcvservices.com</p>
                </div>
              </a>
            </li>
            <li>
              <a href="tel:+15809191386" className="flex items-start gap-3 group">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background:'rgba(139,92,246,0.15)', border:'1px solid rgba(139,92,246,0.3)' }}>
                  <Phone className="w-3.5 h-3.5 text-purple-400"/>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Phone / Text</p>
                  <p className="text-gray-300 text-sm font-medium group-hover:text-purple-400 transition-colors">(580) 919-1386</p>
                </div>
              </a>
            </li>
            <li>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background:'rgba(6,182,212,0.15)', border:'1px solid rgba(6,182,212,0.3)' }}>
                  <MapPin className="w-3.5 h-3.5 text-cyan-400"/>
                </div>
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">Service Area</p>
                  <p className="text-gray-300 text-sm font-medium">Nationwide — Remote</p>
                  <p className="text-gray-600 text-xs">Mon–Sat · Replies within 24 hrs</p>
                </div>
              </div>
            </li>
          </ul>
        </div>

      </div>
    </div>

    {/* ── Bottom bar ── */}
    <div className="relative z-10 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} VCV Web Solutions · A service of VCV Services · All rights reserved.
          </p>
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <a href="/terms#privacy" className="text-gray-600 text-xs hover:text-gray-400 transition-colors px-3 py-1 rounded-full hover:bg-white/[0.04]">Privacy Policy</a>
            <span className="text-gray-700">·</span>
            <a href="/terms" className="text-gray-600 text-xs hover:text-gray-400 transition-colors px-3 py-1 rounded-full hover:bg-white/[0.04]">Terms of Service</a>
            <span className="text-gray-700">·</span>
            <a href="/contact" className="text-gray-600 text-xs hover:text-gray-400 transition-colors px-3 py-1 rounded-full hover:bg-white/[0.04]">Contact</a>
          </div>
        </div>
      </div>
    </div>

  </footer>
);
