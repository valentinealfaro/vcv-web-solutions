'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Star, Zap, CheckCircle2 } from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';

/* Decorative HLS background video removed — every footer dynamically pulled
   hls.js (~30 kB gz) just to play a 0.28-opacity mux stream behind the dark
   scrim. Same visual weight comes from a static gradient blob layer for
   ~free. Real Lighthouse / TBT win on every page. */
const FooterBackdrop = () => (
  <>
    <div className="absolute inset-0 pointer-events-none" style={{
      background:
        'radial-gradient(ellipse at 20% 0%, rgba(59,130,246,0.10) 0%, transparent 55%),' +
        'radial-gradient(ellipse at 80% 100%, rgba(124,58,237,0.08) 0%, transparent 60%),' +
        '#030712',
      zIndex: 0,
    }}/>
  </>
);

const SERVICES = [
  { label:'Website Templates',     path:'/templates' },
  { label:'AI Receptionist',       path:'/ai-receptionist' },
  { label:'SEO Optimization',      path:'/services' },
  { label:'Google Ads Ready',      path:'/services' },
  { label:'Lead Generation',       path:'/services' },
  { label:'Hosting & Maintenance', path:'/services' },
];

const COMPANY = [
  { label:'About',           path:'/about' },
  { label:'How It Works',    path:'/how-it-works' },
  { label:'Client Reviews',  path:'/reviews' },
  { label:'Pricing',         path:'/pricing' },
  { label:'Contact',         path:'/contact' },
  { label:'Design Preview',  path:'/free-demo' },
  { label:'Terms & Privacy', path:'/terms' },
];

const STATS = [
  { val:'197+',   label:'Businesses Launched' },
  { val:'3-7',    label:'Days to Launch' },
  { val:'$97',    label:'Starting Per Month' },
  { val:'30-Day', label:'Results Guarantee' },
];

/* Quiet stat card — no traveling dot, no tilt, no glow. Stat reads at a
   glance instead of competing with neighbour cards for attention. */
const StatTiltCard = ({ s, i }: { s: typeof STATS[0]; i: number }) => (
  <motion.div
    initial={{ opacity:0, y:10 }} whileInView={{ opacity:1, y:0 }}
    viewport={{ once:true }} transition={{ delay: i * 0.06 }}
    whileHover={{ y: -2 }}
    className="text-center px-4 py-5 rounded-xl"
    style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.08)',
    }}>
    <div className="font-display text-2xl md:text-3xl text-white mb-0.5 tracking-tight">
      {s.val}
    </div>
    <div className="text-gray-500 text-[10px] uppercase tracking-[0.15em] font-semibold">
      {s.label}
    </div>
  </motion.div>
);

export const Footer = () => (
  <footer className="relative bg-[#030712] overflow-hidden">

    {/* HLS video background */}
    <FooterBackdrop />

    {/* Top gradient line */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" style={{ zIndex: 2 }} />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" style={{ zIndex: 2 }} />
    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full pointer-events-none" style={{ zIndex: 2 }} />

    {/* ── CTA strip ── */}
    <div className="relative z-10 border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Ready to get more leads?</p>
            <h3 className="font-display text-white tracking-tight leading-[1.02]"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.25rem)' }}>
              See your site <span className="gradient-text">before you pay.</span>
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <FreeDemoButton size="sm" label="Request Preview" />
            <a href="tel:+15809191386"
              className="glass-card text-white px-8 py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 hover:border-blue-500/40 transition-[border-color,transform] duration-200 ease-out active:scale-[0.97]">
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
            <div className="relative rounded-xl p-1.5 flex-shrink-0 transition-transform duration-200 ease-out group-hover:scale-105"
              style={{
                background:'rgba(255,255,255,0.05)',
                border:'1px solid rgba(59,130,246,0.40)',
                boxShadow:'0 0 14px rgba(59,130,246,0.20)',
              }}>
              <img
                src="https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf"
                alt="VCV Web Solutions" width={36} height={36}
                className="w-9 h-9 object-contain" loading="lazy" decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
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

          {/* Available badge — quiet pulse on the dot, no glowing shadow loop */}
          <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse inline-block"/>
            <span className="text-green-300 text-xs font-bold tracking-wide">ACCEPTING NEW CLIENTS NOW</span>
          </div>

          {/* Social proof stars */}
          <div className="flex items-center gap-2 mt-5">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_,i)=><Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400"/>)}
            </div>
            <span className="text-gray-500 text-xs">197+ businesses launched</span>
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
