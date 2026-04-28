'use client';
import { useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Zap, Loader2 } from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for new local businesses getting started.',
    price: 97,
    origPrice: 194,
    amountCents: 9700,
    setup: 'No upfront cost options',
    features: [
      'Custom website',
      'Mobile optimized',
      'Fast load speeds',
      'SEO-ready structure',
      'Hosting included',
    ],
    popular: false,
    cta: 'Get My Free Demo',
  },
  {
    name: 'Growth',
    description: 'Best for businesses that want consistent leads.',
    price: 197,
    origPrice: 394,
    amountCents: 19700,
    setup: 'No upfront cost',
    badge: 'Most Popular',
    features: [
      'Custom website',
      'SEO-ready structure',
      'Mobile optimized',
      'Lead tracking',
      'Hosting included',
      'Ongoing support',
    ],
    popular: true,
    cta: 'Get My Free Demo',
  },
  {
    name: 'Pro',
    description: 'For businesses ready to dominate their market.',
    price: 297,
    origPrice: 594,
    amountCents: 29700,
    setup: 'Custom setup',
    features: [
      'Everything in Growth',
      'Advanced SEO system',
      'CRM integration',
      'Automation systems',
      'Dedicated manager',
    ],
    popular: false,
    cta: 'Get My Free Demo',
  },
];

const PlanCard = ({ plan, index }: { plan: typeof plans[0]; index: number }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError]    = useState('');

  const handleCheckout = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: `VCV Web Solutions — ${plan.name} Plan`,
          amount: plan.amountCents,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || 'Checkout failed');
      window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      viewport={{ once: true }}
      className="relative flex flex-col"
      style={{
        background: plan.popular ? 'rgba(17,24,60,0.85)' : 'rgba(10,15,30,0.7)',
        border: plan.popular ? '2px solid rgba(37,99,235,0.6)' : '1px solid rgba(255,255,255,0.08)',
        borderRadius: 20,
        padding: '32px 28px',
        boxShadow: plan.popular ? '0 0 60px rgba(37,99,235,0.18), 0 0 0 1px rgba(37,99,235,0.1)' : 'none',
        transform: plan.popular ? 'scale(1.04)' : 'scale(1)',
      }}>

      {/* Popular badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg whitespace-nowrap">
            <Zap className="w-3 h-3" /> {plan.badge}
          </span>
        </div>
      )}

      {/* Plan name + description */}
      <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 text-sm mb-5 leading-relaxed">{plan.description}</p>

      {/* Price block */}
      <div className="mb-1 flex items-center gap-2">
        <span className="text-gray-600 text-lg font-bold line-through decoration-red-500/70">${plan.origPrice}</span>
        <span className="text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded-full">50% off</span>
      </div>
      <div className="flex items-end gap-1 mb-1">
        <span className="font-display text-5xl text-white">${plan.price}</span>
        <span className="text-gray-500 text-base mb-1.5">/month</span>
      </div>
      <p className="text-blue-400 font-semibold text-sm mb-7">{plan.setup}</p>

      {/* Features */}
      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((f, j) => (
          <li key={j} className="flex items-center gap-3 text-sm text-gray-300">
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-blue-400' : 'text-gray-500'}`} />
            {f}
          </li>
        ))}
      </ul>

      {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

      {/* CTA */}
      <motion.button
        onClick={handleCheckout}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 group transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
          plan.popular
            ? 'btn-neon btn-glow text-white'
            : 'bg-[#1a2035] hover:bg-[#222c45] text-white border border-white/10'
        }`}>
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting...</>
        ) : (
          <>{plan.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
        )}
      </motion.button>
    </motion.div>
  );
};

export const PricingSection = () => (
  <section className="py-24 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-40" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-6"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Simple Pricing</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">PRICING</h2>

        {/* Limited-time banner */}
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

      {/* Cards — 3 column, centre one pops */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mt-10">
        {plans.map((plan, i) => <PlanCard key={i} plan={plan} index={i} />)}
      </div>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}
        className="text-center text-gray-500 text-sm mt-10">
        Not sure which plan?{' '}
        <Link href="/free-demo" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
          Start with the free demo →
        </Link>
      </motion.p>
    </div>
  </section>
);
