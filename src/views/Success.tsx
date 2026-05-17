'use client';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Mail, Phone, Calendar, FileText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { trackPurchase } from '@/components/Analytics';

export default function Success() {
  const [orderRef, setOrderRef] = useState('');

  /* Fire conversion events for GA4 + Meta Pixel on success page load.
     Stripe doesn't send back the amount client-side, so we use a generic
     "purchase complete" signal. For accurate revenue attribution, set up
     a Stripe webhook + server-side conversion API later. */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const amount = Number(params.get('amount')) || 297;
    const product = params.get('product') || 'VCV Web Solutions Plan';
    trackPurchase(amount, product);

    // Lightweight order reference for the receipt UI — Stripe's actual ID
    // would come from a webhook; this is just a session-scoped placeholder.
    const ref = params.get('session_id')?.slice(-8).toUpperCase()
             || Math.random().toString(36).slice(2, 10).toUpperCase();
    setOrderRef(`VCV-${ref}`);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Top confetti / hero band */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.12) 0%, transparent 60%)' }}/>
        <motion.div
          initial={{ opacity:0, scale:0.95 }}
          animate={{ opacity:1, scale:1 }}
          transition={{ duration:0.5, ease:[0.16,1,0.3,1] }}
          className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale:0, rotate:-90 }}
            animate={{ scale:1, rotate:0 }}
            transition={{ duration:0.5, delay:0.1, ease:'backOut' }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background:'rgba(34,197,94,0.15)', border:'2px solid rgba(34,197,94,0.45)' }}>
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </motion.div>

          <p className="text-green-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">Order confirmed</p>
          <h1 className="font-display text-white tracking-tight leading-[1.02] mb-5"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 5rem)' }}>
            Welcome aboard.
          </h1>
          <p className="text-gray-300 text-lg md:text-xl max-w-xl mx-auto mb-3">
            Your payment cleared and your project is officially in our queue. A receipt is on its way.
          </p>
          {orderRef && (
            <p className="text-gray-500 text-sm font-mono">
              Order reference: <span className="text-gray-300">{orderRef}</span>
            </p>
          )}
        </motion.div>
      </section>

      {/* What happens next */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-blue-400 text-xs font-bold uppercase tracking-[0.22em] mb-3">What happens next</p>
            <h2 className="font-display text-3xl md:text-4xl text-white tracking-tight">Your 7-day timeline</h2>
          </div>
          <ol className="space-y-3">
            {[
              { n:'1', t:'Within 5 minutes',  d:'Receipt and welcome email land in your inbox from info@vcvservices.com.', icon: Mail },
              { n:'2', t:'Within 24 hours',   d:'We text or call to schedule a 15-minute kickoff. Bring your logo, photos, and any copy you already have.', icon: Phone },
              { n:'3', t:'Day 2',             d:'Custom design preview goes live for your review. You approve or request changes.',                        icon: Sparkles },
              { n:'4', t:'Days 3–5',          d:'We build out inner pages, wire your domain + hosting, install SEO + analytics + lead tracking.',          icon: FileText },
              { n:'5', t:'Day 5–7',           d:'Site goes live. You get the dashboard credentials and a 30-minute launch call.',                          icon: Calendar },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li key={i}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className="grid grid-cols-[auto,auto,1fr] gap-4 md:gap-5 items-start p-5 md:p-6 rounded-2xl"
                  style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
                  <span className="w-9 h-9 rounded-full bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm flex-shrink-0">{s.n}</span>
                  <Icon className="w-5 h-5 text-blue-400/70 mt-2 flex-shrink-0 hidden sm:block"/>
                  <div>
                    <p className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-1">{s.t}</p>
                    <p className="text-white text-base leading-relaxed">{s.d}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Primary CTA — start onboarding form */}
      <section className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-3xl mx-auto rounded-3xl p-8 md:p-10 text-center"
          style={{ background:'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(124,58,237,0.06))',
                   border:'1px solid rgba(59,130,246,0.30)' }}>
          <h2 className="font-display text-2xl md:text-4xl text-white tracking-tight leading-tight mb-3">
            Save a day. Start onboarding now.
          </h2>
          <p className="text-gray-300 text-base mb-6 max-w-xl mx-auto">
            Fill out the onboarding form right now — even before our call — and we&apos;ll have your design preview ready 24 hours sooner.
          </p>
          <Link href="/website-onboarding"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-base transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40">
            Start onboarding (5 min) <ArrowRight className="w-5 h-5"/>
          </Link>
        </div>
      </section>

      {/* Secondary touchpoints */}
      <section className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <a href="mailto:info@vcvservices.com"
              className="group p-5 rounded-2xl transition-colors"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <Mail className="w-5 h-5 text-blue-400 mb-3"/>
              <p className="text-white font-bold text-sm mb-1">Email us</p>
              <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors">info@vcvservices.com</p>
            </a>
            <a href="tel:+15809191386"
              className="group p-5 rounded-2xl transition-colors"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <Phone className="w-5 h-5 text-blue-400 mb-3"/>
              <p className="text-white font-bold text-sm mb-1">Call or text</p>
              <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors">(580) 919-1386 · Mon–Sat</p>
            </a>
            <Link href="/how-it-works"
              className="group p-5 rounded-2xl transition-colors"
              style={{ background:'rgba(255,255,255,0.025)', border:'1px solid rgba(255,255,255,0.08)' }}>
              <FileText className="w-5 h-5 text-blue-400 mb-3"/>
              <p className="text-white font-bold text-sm mb-1">How it works</p>
              <p className="text-gray-400 text-xs leading-snug group-hover:text-gray-300 transition-colors">See the full 7-step build process →</p>
            </Link>
          </div>

          <p className="text-center text-gray-600 text-xs mt-8 leading-relaxed max-w-md mx-auto">
            Receipt didn&apos;t arrive within 5 minutes? Check spam, or email us — we&apos;ll resend it manually.
            All Stripe transactions are secured with 256-bit TLS.
          </p>
        </div>
      </section>
    </div>
  );
}
