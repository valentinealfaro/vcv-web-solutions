'use client';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ExternalLink, Layout, CheckCircle2, Sparkles, Phone } from 'lucide-react';
import { INDUSTRIES } from '@/data/industries';
import {
  ParticleCanvas, MarqueeBand, SectionOrbs, GridOverlay,
} from '@/components/PageEffects';
import { FreeDemoButton } from '@/components/FreeDemoButton';

const fade = (d=0) => ({ initial:{opacity:0,y:24}, whileInView:{opacity:1,y:0}, transition:{delay:d,duration:0.55}, viewport:{once:true} });

/* Stylised browser-frame mockup — CSS-only, takes the industry's accent color */
const SiteMockup = ({ color, emoji, name }: { color: string; emoji: string; name: string }) => {
  const tagline =
    name.includes('Roofers')   ? 'Storm Calls' :
    name.includes('Plumbers')  ? '3am Calls' :
    name.includes('Dentists')  ? 'New Patients' :
    name.includes('Lawyers')   ? 'Consults' :
    name.includes('Real')      ? 'Showings' :
    name.includes('Restaurant')? 'Reservations' :
    name.includes('Med')       ? 'Bookings' :
    name.includes('Salon')     ? 'Appointments' :
    name.includes('Wedding')   ? 'Tour Requests' :
    'Jobs';

  return (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${color}28, ${color}08)`,
        border: `1px solid ${color}50`,
      }}>
      {/* Browser chrome */}
      <div className="absolute top-0 left-0 right-0 h-7 flex items-center gap-1.5 px-3"
        style={{ background:'rgba(0,0,0,0.55)', borderBottom:`1px solid ${color}30` }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-500/70"/>
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70"/>
        <span className="w-2.5 h-2.5 rounded-full bg-green-500/70"/>
        <span className="ml-2 text-[9px] text-gray-400 font-mono truncate">vcvwebsolutions.com/ai-receptionist/...</span>
      </div>

      {/* Page content */}
      <div className="absolute inset-x-0 top-7 bottom-0 flex flex-col items-center justify-center text-center px-4">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2 text-[9px] font-bold tracking-widest"
          style={{ background:`${color}22`, border:`1px solid ${color}55`, color }}>
          {emoji} {name.toUpperCase()}
        </span>
        <div className="font-display text-white text-base md:text-lg leading-tight mb-2"
          style={{ textShadow:`0 0 18px ${color}80` }}>
          Stop Losing<br/>
          <span style={{ color }}>{tagline}</span>
        </div>
        <div className="flex gap-1.5 mt-1">
          <span className="text-[8px] font-bold px-2 py-1 rounded text-white" style={{ background: color }}>
            Try Free
          </span>
          <span className="text-[8px] font-bold px-2 py-1 rounded text-gray-300"
            style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.12)' }}>
            Call Demo
          </span>
        </div>

        {/* Faux content blocks */}
        <div className="absolute bottom-3 left-3 right-3 flex gap-1.5">
          {[0,1,2].map(i => (
            <div key={i} className="flex-1 rounded h-2"
              style={{ background:`${color}${i===1?'40':'20'}` }}/>
          ))}
        </div>
      </div>

      {/* Subtle inner glow */}
      <motion.div
        animate={{ opacity:[0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-xl pointer-events-none"
        style={{ boxShadow:`inset 0 0 40px ${color}30` }}
      />
    </div>
  );
};

/* Featured 9 — chosen for visual diversity (different colors / industries) */
const FEATURED_SLUGS = [
  'roofers', 'dentists', 'restaurants',
  'plumbers', 'real-estate', 'med-spa',
  'salons', 'lawyers', 'wedding-venues',
];

export default function Portfolio() {
  const featured = FEATURED_SLUGS
    .map(slug => INDUSTRIES.find(i => i.slug === slug))
    .filter((x): x is typeof INDUSTRIES[number] => Boolean(x));

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ══════════ HERO ══════════ */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <ParticleCanvas/>
        <SectionOrbs variant="purple"/>
        <GridOverlay gridOp={0.22} dotOp={0.1}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}>
            <p className="neon-badge mb-5 mx-auto w-fit">Our Work</p>
            <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] mb-5"
              style={{ textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              REAL SITES.<br/>
              <span className="gradient-text">REAL CONVERSIONS.</span>
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-3">
              Every site below is a <strong className="text-white">live, working website</strong> we designed and built.
              Click any one to see it in action — fully responsive, mobile-perfect,
              and engineered to convert.
            </p>
            <p className="text-gray-400 text-base">
              <strong className="text-white">35+ live sites.</strong> All conversion-focused.
              All built with the same Stripe checkout, AI receptionist integration, and 24-48 hr launch timeline you&apos;ll get.
            </p>
          </motion.div>

          {/* Spec strip */}
          <div className="flex flex-wrap gap-2 justify-center mt-7 text-xs">
            {[
              { e:'🚀', t:'Built in 24-48 hrs',    c:'59,130,246' },
              { e:'⚡', t:'Sub-2s page load',       c:'34,197,94'  },
              { e:'📱', t:'Mobile-perfect',         c:'168,85,247' },
              { e:'🎯', t:'SEO-optimized',          c:'245,158,11' },
              { e:'💳', t:'Live Stripe checkout',   c:'6,182,212'  },
            ].map((p,i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold"
                style={{ color:`rgb(${p.c})`, background:`rgba(${p.c},0.12)`, border:`1px solid rgba(${p.c},0.4)` }}>
                {p.e} {p.t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <MarqueeBand/>

      {/* ══════════ EXHIBIT A — THIS SITE ══════════ */}
      <section className="py-16 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="mixed"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{ background:'rgba(34,197,94,0.12)', border:'1px solid rgba(34,197,94,0.4)', color:'#4ade80' }}>
              <Sparkles className="w-3 h-3"/> EXHIBIT A — THIS SITE
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-white mb-3 leading-tight">
              You&apos;re looking at one <span className="gradient-text">right now</span>
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto">
              Animated waves, AI receptionist demo, ROI calculator, working Stripe checkout, 9 upsells, exit-intent popup,
              and 34 industry-specific landing pages. <strong className="text-white">All custom-built.</strong>
            </p>
          </motion.div>

          <motion.div {...fade(0.1)} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {[
              { label:'Animated bg canvas',     color:'#3b82f6' },
              { label:'Live AI demo (browser)', color:'#22c55e' },
              { label:'ROI calculator',         color:'#fbbf24' },
              { label:'Stripe upsell modal',    color:'#a855f7' },
              { label:'Mobile-perfect',         color:'#06b6d4' },
              { label:'Theme switcher (9 modes)',color:'#ec4899' },
              { label:'Exit-intent popup',      color:'#f97316' },
              { label:'34 industry pages',      color:'#10b981' },
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm"
                style={{ background:`${f.color}10`, border:`1px solid ${f.color}35` }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: f.color }}/>
                <span className="text-gray-100 font-semibold">{f.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════ FEATURED SHOWCASE ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="blue"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="neon-badge mb-4 mx-auto w-fit">9 Featured · 34 Total</p>
            <h2 className="font-display text-3xl md:text-5xl text-white mb-3 leading-tight">
              Live <span className="gradient-text">industry sites</span> we built
            </h2>
            <p className="text-gray-300 text-base max-w-2xl mx-auto">
              Each one is a fully working site with custom copy, conversion design, and Nova integrated.
              Click any thumbnail to view the live page.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((ind, i) => (
              <motion.div key={ind.slug} {...fade(0.04 * i)}>
                <Link href={`/ai-receptionist/${ind.slug}`}
                  className="group block rounded-2xl overflow-hidden p-3 transition-transform hover:-translate-y-1"
                  style={{
                    background:'rgba(5,12,22,0.97)',
                    border:`1px solid ${ind.color}30`,
                    boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 24px ${ind.color}15`,
                  }}>
                  <SiteMockup color={ind.color} emoji={ind.emoji} name={ind.name}/>

                  <div className="p-4">
                    <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: ind.color }}>
                      Live Site · {ind.name}
                    </p>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2">
                      {ind.heroHeadline.replace(/\n/g, ' ')}
                    </h3>
                    <p className="text-gray-400 text-sm leading-snug mb-3 line-clamp-2">
                      {ind.heroSubhead.split('.').slice(0, 1).join('.') + '.'}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-2 transition-all"
                      style={{ color: ind.color }}>
                      View Live Site <ExternalLink className="w-3.5 h-3.5"/>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* The other 25 industries — pill grid */}
          <motion.div {...fade(0.4)}
            className="mt-10 rounded-2xl p-6 text-center max-w-4xl mx-auto"
            style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
            <p className="text-white font-bold text-lg mb-2">
              👀 We have {INDUSTRIES.length - 9} more live industry sites
            </p>
            <p className="text-gray-300 text-sm mb-4">
              From locksmiths and tutors to commercial cleaners and wedding venues —
              every category below has its own custom-built page.
            </p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {INDUSTRIES.filter(i => !FEATURED_SLUGS.includes(i.slug)).map(ind => (
                <Link key={ind.slug} href={`/ai-receptionist/${ind.slug}`}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:scale-105 transition-transform"
                  style={{
                    background:`${ind.color}10`,
                    border:`1px solid ${ind.color}40`,
                    color:'#e5e7eb',
                  }}>
                  {ind.emoji} {ind.name}
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════ HOW WE BUILD ══════════ */}
      <section className="py-16 bg-[#040a16] relative overflow-hidden">
        <SectionOrbs variant="cyan"/>
        <GridOverlay gridOp={0.18} dotOp={0.08}/>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div {...fade()} className="text-center mb-10">
            <p className="neon-badge mb-3 mx-auto w-fit">The Stack</p>
            <h2 className="font-display text-3xl md:text-5xl text-white leading-tight">
              How we build sites that <span className="gradient-text">actually convert</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon:'⚡', title:'Next.js + React',  desc:'Same tech Vercel, TikTok, and Stripe use. Sub-2s loads, server-side rendering, perfect SEO.' },
              { icon:'🎨', title:'Custom Design',    desc:'Every site is bespoke — not a template. Animations, glass morphism, and conversion-focused layouts.' },
              { icon:'💳', title:'Live Checkout',    desc:'Real Stripe payment processing, not a contact form. Customers can pay you the moment they land.' },
              { icon:'🤖', title:'Nova Integration', desc:'Every site we build connects directly to Nova so calls + form fills become leads instantly.' },
              { icon:'📱', title:'Mobile-First',     desc:'Built for iPhone first. 60% of leads come from mobile — your site has to convert there.' },
              { icon:'🔍', title:'SEO Built-In',     desc:'Sitemaps, meta tags, OpenGraph, structured data — Google indexes you correctly out of the gate.' },
            ].map((c, i) => (
              <motion.div key={i} {...fade(0.05*i)}
                className="rounded-2xl p-5"
                style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                <div className="text-3xl mb-3">{c.icon}</div>
                <h3 className="text-white font-bold text-base mb-2">{c.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section className="py-20 bg-[#030712] relative overflow-hidden">
        <SectionOrbs variant="green"/>
        <GridOverlay gridOp={0.22} dotOp={0.1}/>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div {...fade()}>
            <p className="neon-badge mb-4 mx-auto w-fit">Your Turn</p>
            <h2 className="font-display text-4xl md:text-7xl text-white mb-5 leading-tight"
              style={{ textShadow:'0 0 40px rgba(34,197,94,0.4)' }}>
              Want one like<br/><span className="gradient-text">these for your biz?</span>
            </h2>
            <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
              We&apos;ll build a custom design preview for your business <strong className="text-white">free</strong> — see it before you commit to anything.
              Approved? Live in 24-48 hrs.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <FreeDemoButton size="lg" label="Get My Free Design Preview" rounded="full"/>
              <a href="tel:+15806569429"
                className="glass-card text-white px-8 py-4 rounded-full font-semibold text-base inline-flex items-center justify-center gap-2 w-full sm:w-auto">
                <Phone className="w-5 h-5 text-green-400"/> Call (580) 656-9429
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-5 flex flex-wrap justify-center gap-x-3 gap-y-1">
              <span><Layout className="w-3 h-3 inline-block mr-1"/> Custom design first</span>
              <span>·</span>
              <span>30-day money-back</span>
              <span>·</span>
              <span>Cancel anytime</span>
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
