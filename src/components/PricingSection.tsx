'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Zap, Loader2, Tag } from 'lucide-react';
import { PricingBgCanvas } from '@/components/PageEffects';
import { CheckoutUpsellModal, CheckoutPayload } from '@/components/CheckoutUpsellModal';

const SETUP_FEE_CENTS = 49700; // $497 — waived on annual

const plans = [
  {
    name: 'Monthly',
    price: 197,
    origPrice: 397,
    period: '/mo',
    amountCents: 19700,
    setupFeeCents: SETUP_FEE_CENTS,        // monthly pays the setup fee
    setup: 'No long-term commitment',
    description: 'Get a professional lead-generating website with no annual contract.',
    features: [
      'Custom website design',
      'Mobile-responsive layout',
      'Basic SEO setup',
      'Contact & lead forms',
      'Hosting & maintenance',
      'Monthly updates',
      'Email support',
    ],
    cta: 'Buy Now',
    popular: false,
  },
  {
    name: 'Annual',
    price: 1997,
    origPrice: 3970,
    period: '/yr',
    amountCents: 199700,
    setupFeeCents: 0,                       // annual: setup fee waived
    setup: 'Best value — save $1,973',
    badge: 'Best Value — Save $1,973',
    description: 'The full lead machine. Everything you need to dominate your local market.',
    features: [
      'Everything in Monthly',
      'Advanced SEO optimization',
      'Google Ads landing page ready',
      'Blog & content system',
      'Analytics dashboard',
      'Priority 24hr support',
      'Quarterly strategy calls',
      'Google My Business setup',
      'Setup fee waived ($497 value)',
    ],
    cta: 'Buy Now',
    popular: true,
  },
];

const PlanCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
  const [loading, setLoading] = useState<'idle' | 'buy' | 'trial'>('idle');
  const [error, setError]     = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Click "Buy Now" → open upsell modal (Stripe redirect happens after)
  const handleCheckout = () => { setError(''); setModalOpen(true); };

  // Modal "Continue to Checkout" → submit payload to Stripe
  const submitToStripe = async (payload: CheckoutPayload) => {
    setLoading('buy'); setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading('idle');
    }
  };

  // 30-day FREE trial — Monthly only — customer pays only the $297 setup fee
  const handleTrial = async () => {
    setLoading('trial'); setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `${plan.name} Plan — 30 Day FREE Trial (first month free, $${plan.price}/mo after)`,
          amount:       SETUP_FEE_CENTS,    // $297 setup only — no monthly charge today
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading('idle');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      viewport={{ once: true }}
      className="relative p-8 rounded-[20px]"
      style={{
        background: plan.popular
          ? 'linear-gradient(145deg, rgba(10,20,60,0.97), rgba(22,10,48,0.97))'
          : 'rgba(6,10,22,0.96)',
        border: plan.popular
          ? '1.5px solid rgba(37,99,235,0.65)'
          : '1px solid rgba(255,255,255,0.14)',
        boxShadow: plan.popular
          ? '0 0 80px rgba(37,99,235,0.25), 0 0 0 1px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 0 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(32px)',
      }}>

      {/* Best Value badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg">
            <Zap className="w-3 h-3" /> {plan.badge}
          </span>
        </div>
      )}

      {/* 50% OFF badge */}
      <div className="absolute top-4 right-4">
        <motion.span
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black px-2.5 py-1 rounded-full">
          <Tag className="w-3 h-3" /> 50% OFF
        </motion.span>
      </div>

      {/* Plan name */}
      <p className="text-gray-300 text-sm font-semibold uppercase tracking-wider mb-3">{plan.name}</p>

      {/* Strikethrough original */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-gray-600 text-xl font-bold line-through decoration-red-500/70">${plan.origPrice}</span>
        <span className="text-gray-600 text-sm line-through decoration-red-500/70">{plan.period}</span>
        <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">was full price</span>
      </div>

      {/* Sale price */}
      <div className="flex items-end gap-1 mb-2">
        <span className="font-display text-6xl text-white">${plan.price}</span>
        <span className="text-gray-500 text-lg mb-2">{plan.period}</span>
      </div>

      {/* Savings pill */}
      <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1 mb-3">
        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
        <span className="text-green-400 text-xs font-bold">You save ${plan.origPrice - plan.price}{plan.period}</span>
      </div>

      {/* Setup-fee note */}
      {plan.setupFeeCents > 0 ? (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 ml-2"
          style={{ background:'rgba(255,193,7,0.10)', border:'1px solid rgba(255,193,7,0.35)' }}>
          <span className="text-yellow-300 text-xs font-bold">+ $497 setup · auto-added at checkout</span>
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 mb-4 ml-2"
          style={{ background:'rgba(34,197,94,0.10)', border:'1px solid rgba(34,197,94,0.35)' }}>
          <span className="text-green-400 text-xs font-bold">✓ Setup fee waived</span>
        </div>
      )}

      <p className="text-gray-300 text-sm leading-relaxed mb-6">{plan.description}</p>

      {/* Features */}
      <div className="space-y-3 mb-8">
        {plan.features.map((f, j) => (
          <div key={j} className="flex items-center gap-3 text-sm">
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-blue-400' : 'text-blue-500/70'}`} />
            <span className={plan.popular ? 'text-gray-100' : 'text-gray-300'}>{f}</span>
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

      <motion.button
        onClick={handleCheckout}
        disabled={loading !== 'idle'}
        className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed"
        animate={{
          backgroundImage:[
            'linear-gradient(135deg,#ef4444,#f97316)',
            'linear-gradient(135deg,#f97316,#eab308)',
            'linear-gradient(135deg,#eab308,#22c55e)',
            'linear-gradient(135deg,#22c55e,#06b6d4)',
            'linear-gradient(135deg,#06b6d4,#3b82f6)',
            'linear-gradient(135deg,#3b82f6,#8b5cf6)',
            'linear-gradient(135deg,#8b5cf6,#ec4899)',
            'linear-gradient(135deg,#ec4899,#ef4444)',
          ],
          boxShadow:[
            '0 0 18px rgba(239,68,68,0.55)',
            '0 0 18px rgba(249,115,22,0.55)',
            '0 0 18px rgba(234,179,8,0.55)',
            '0 0 18px rgba(34,197,94,0.55)',
            '0 0 18px rgba(6,182,212,0.55)',
            '0 0 18px rgba(59,130,246,0.55)',
            '0 0 18px rgba(139,92,246,0.55)',
            '0 0 18px rgba(236,72,153,0.55)',
          ],
        }}
        transition={{ duration: plan.popular ? 3.5 : 4.5, repeat: Infinity, ease:'linear' }}
        whileHover={{ scale: loading !== 'idle' ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}>
        {loading === 'buy'
          ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
          : <>{plan.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
        }
      </motion.button>

      {/* ── 30-day FREE trial — Monthly plan only ──────────────── */}
      {plan.setupFeeCents > 0 && (
        <>
          <div className="flex items-center gap-2 my-3">
            <div className="flex-1 h-px bg-white/10"/>
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10"/>
          </div>
          <motion.button
            onClick={handleTrial}
            disabled={loading !== 'idle'}
            whileHover={{ scale: loading !== 'idle' ? 1 : 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{
              background: 'rgba(255,193,7,0.12)',
              border: '1.5px solid rgba(255,193,7,0.5)',
              color: '#fde68a',
              boxShadow: '0 0 14px rgba(255,193,7,0.18)',
            }}>
            {loading === 'trial'
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
              : <>🎁 Try Free 30 Days — Only $497 Setup</>}
          </motion.button>
          <p className="text-center text-gray-500 text-[11px] mt-2 leading-relaxed">
            First month FREE · No charge for 30 days · Cancel before day 30 = pay nothing further
          </p>
        </>
      )}

      <p className="text-center text-gray-600 text-xs mt-3">Secure checkout · Powered by Stripe</p>

      {/* Upsell modal — appears between Buy Now click and Stripe redirect */}
      <CheckoutUpsellModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        context="website"
        planName={`${plan.name} Plan`}
        planAmount={plan.amountCents}
        planPriceLabel={`$${plan.price.toLocaleString()}${plan.period}`}
        setupFeeCents={plan.setupFeeCents}
        setupFeeName="One-Time Website Setup Fee ($497)"
        productName={`VCV Web Solutions — ${plan.name} Plan`}
        loading={loading === 'buy'}
        onConfirm={submitToStripe}
      />
    </motion.div>
  );
};

const PRICING_VIDEO = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260416_101255_3099d3e4-d0cf-4e59-9666-97fbf521ac71.mp4';

export const PricingSection = () => (
  <section className="py-24 bg-[#030712] relative overflow-hidden">
    {/* MP4 video — lowest layer, mix-blend-screen so dark areas vanish */}
    <video
      src={PRICING_VIDEO}
      autoPlay muted loop playsInline
      className="absolute inset-0 w-full h-full pointer-events-none select-none"
      style={{ objectFit: 'cover', mixBlendMode: 'screen', opacity: 0.45 }}
    />
    {/* extra scrim so waves + cards stay fully readable */}
    <div className="absolute inset-0 bg-[#030712]/55 pointer-events-none" />
    <PricingBgCanvas />
    {/* dark overlay keeps cards readable */}
    <div className="absolute inset-0 bg-[#030712]/40 pointer-events-none" />
    <div className="absolute inset-0 bg-grid opacity-18 pointer-events-none" />

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-4"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Simple Pricing</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">PRICING</h2>

        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-4">
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
          <span className="text-red-400 font-bold text-sm tracking-wide">LIMITED TIME — 50% OFF ALL PLANS</span>
          <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
        </motion.div>

        <p className="text-gray-400 text-lg max-w-lg mx-auto">No hidden fees. No long-term contracts. Cancel anytime.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mt-8">
        {plans.map((plan, i) => <PlanCard key={i} plan={plan} index={i} />)}
      </div>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}
        className="text-center text-gray-500 text-sm mt-8">
        Not sure which plan?{' '}
        <Link href="/free-demo" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Start with the free demo →
        </Link>
      </motion.p>
    </div>
  </section>
);
