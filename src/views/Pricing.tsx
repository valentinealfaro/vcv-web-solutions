'use client';
import { motion } from 'motion/react';
import { CheckCircle2, ArrowRight, X, HelpCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { cn } from '../lib/utils';
import { useState } from 'react';

const PricingCard = ({ name, description, price, setup, features, isPopular }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={cn(
      "premium-card p-8 flex flex-col transition-all duration-300",
      isPopular ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/10 scale-105 z-10" : "border border-white/10"
    )}
  >
    {isPopular && (
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
        Most Popular
      </div>
    )}
    <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
    <p className="text-gray-400 text-sm mb-6 h-10">{description}</p>
    <div className="mb-2">
      <span className="text-5xl font-black text-white">{price}</span>
      <span className="text-gray-400 ml-2">/month</span>
    </div>
    <p className="text-blue-500 font-semibold text-sm mb-8">{setup}</p>
    <ul className="space-y-4 mb-10 flex-grow">
      {features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      href="/free-demo"
      className={cn(
        "block w-full py-4 rounded-full font-bold text-center transition-all",
        isPopular ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-800 hover:bg-gray-700 text-white"
      )}
    >
      Get My Free Demo
    </Link>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full py-6 flex justify-between items-center text-left">
        <span className="text-white font-bold">{question}</span>
        <HelpCircle className={cn("w-6 h-6 text-blue-500 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && <p className="pb-6 text-gray-400">{answer}</p>}
    </div>
  );
};

export default function Pricing() {
  const packages = [
    {
      name: "Monthly",
      description: "Perfect for getting started with no long-term commitment.",
      price: "$97",
      origPrice: "$194",
      period: "/mo",
      setup: "No upfront cost options",
      features: [
        "Custom website design",
        "Mobile-responsive layout",
        "Basic SEO setup",
        "Contact & lead forms",
        "Hosting & maintenance",
        "Monthly updates",
      ],
    },
    {
      name: "Annual",
      description: "The complete package. Everything you need to dominate your market.",
      price: "$497",
      origPrice: "$994",
      period: "/yr",
      setup: "Best value — save $667",
      isPopular: true,
      features: [
        "Everything in Monthly",
        "Advanced SEO optimization",
        "Google Ads integration ready",
        "Blog & content system",
        "Analytics dashboard",
        "Priority support",
        "Quarterly strategy calls",
        "Free demo included",
      ],
    },
  ];

  return (
    <div className="bg-[#030712] min-h-screen">

      {/* ── Animated hero ── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        {/* Orbs */}
        <div className="absolute top-[-5%] left-[5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[130px] pointer-events-none animate-orb" />
        <div className="absolute bottom-[-10%] right-[5%] w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[130px] pointer-events-none animate-orb-delay" />
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none animate-orb-slow" />
        <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
        <div className="absolute inset-0 bg-dot  opacity-[0.15] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} animate={{ opacity:1,y:0 }} transition={{ duration:.7 }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Simple Pricing</p>
            <h1 className="font-display leading-none text-white mb-5"
              style={{ fontSize:'clamp(3.5rem,9vw,7rem)',
                textShadow:'0 0 60px rgba(37,99,235,0.5), 0 0 120px rgba(124,58,237,0.25)' }}>
              PRICING THAT<br /><span className="gradient-text">PAYS FOR ITSELF</span>
            </h1>
            <p className="text-gray-400 text-xl mb-6 max-w-2xl mx-auto">
              We build your website before you pay anything. No risk. No surprises.
            </p>

            {/* Limited-time banner */}
            <motion.div
              animate={{ scale:[1,1.03,1] }} transition={{ duration:2.2,repeat:Infinity,ease:'easeInOut' }}
              className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2 mb-8">
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
              <span className="text-red-400 font-bold text-sm tracking-wide">LIMITED TIME — 50% OFF ALL PLANS</span>
              <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse inline-block" />
            </motion.div>
          </motion.div>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <Link href="/free-demo" className="btn-neon btn-glow text-white px-8 py-4 rounded-full font-bold text-base flex items-center justify-center gap-2 group">
                Get My Free Demo <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> No upfront cost</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Built in 3–7 days</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500" /> Designed for leads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards — 2 columns */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {packages.map((pkg, idx) => (
          <div key={idx} className={cn(
            "premium-card p-8 flex flex-col relative transition-all duration-300",
            pkg.isPopular ? "border-2 border-blue-500 shadow-2xl shadow-blue-500/10" : "border border-white/10"
          )}>
            {pkg.isPopular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap shadow-lg">
                ⚡ Best Value — Save $667
              </div>
            )}
            {/* 50% off badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-black px-2.5 py-1 rounded-full">
              50% OFF
            </div>

            <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-3">{pkg.name}</p>

            {/* Strikethrough original */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-gray-600 text-lg font-bold line-through">{pkg.origPrice}</span>
              <span className="text-gray-600 text-sm line-through">{pkg.period}</span>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">was full price</span>
            </div>

            {/* Sale price */}
            <div className="flex items-end gap-1 mb-2">
              <span className="text-6xl font-black text-white">{pkg.price}</span>
              <span className="text-gray-400 text-lg mb-2">{pkg.period}</span>
            </div>
            <p className="text-blue-400 font-semibold text-sm mb-2">{pkg.setup}</p>

            {/* Savings pill */}
            <div className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1 mb-5 w-fit">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
              <span className="text-green-400 text-xs font-bold">
                You save {pkg.isPopular ? '$497/yr' : '$97/mo'}
              </span>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">{pkg.description}</p>

            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                  <CheckCircle2 className={cn("w-4 h-4 flex-shrink-0", pkg.isPopular ? "text-blue-400" : "text-gray-500")} />
                  {f}
                </li>
              ))}
            </ul>

            <Link href="/free-demo"
              className={cn(
                "block w-full py-4 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2 group",
                pkg.isPopular
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/20"
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              )}>
              {pkg.isPopular ? 'Start Winning' : 'Get Started'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-center text-gray-600 text-xs mt-3">Secure checkout · Powered by Stripe</p>
          </div>
        ))}
      </div>

      {/* ROI Section */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-6">This Isn’t a Cost — It’s an Investment</h2>
          <p className="text-gray-400 text-lg">
            If your website brings even 2–3 extra jobs per month, it pays for itself.
          </p>
        </div>
      </section>

      {/* No Risk */}
      <section className="py-20 relative overflow-hidden bg-[#030712]">
        <div className="absolute inset-0 bg-grid opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-600/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="neon-card p-10 md:p-12 text-center" style={{ borderColor:’rgba(37,99,235,0.3)’, boxShadow:’0 0 60px rgba(37,99,235,0.08)’ }}>
            <div className="w-14 h-14 btn-neon rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-7 h-7 text-white" />
            </div>
            <h2 className="font-display text-5xl text-white mb-8">TRY IT RISK-FREE</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
              {[‘We build your demo before you pay’,’No long-term contracts’,’No upfront cost options’,’You only move forward if you love it’].map((t,i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-[#040a16] relative overflow-hidden">
        <div className="absolute inset-0 bg-dot opacity-15 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <h2 className="font-display text-5xl text-white mb-10 text-center">FAQ</h2>
          <FAQItem question="Do I have to pay upfront?" answer="No. We build your website demo first, so you can see exactly what you’re getting before you pay anything." />
          <FAQItem question="How long does it take?" answer="Most websites are built and launched in 3–7 days." />
          <FAQItem question="Can I cancel?" answer="Yes, we offer flexible options with no long-term contracts." />
          <FAQItem question="Do you handle everything?" answer="Yes, we handle design, development, hosting, and ongoing support." />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#030712] relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-[-10%] left-[10%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none animate-orb" style={{ background:’rgba(37,99,235,0.12)’ }} />
        <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none animate-orb-delay" style={{ background:’rgba(124,58,237,0.10)’ }} />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <motion.div initial={{ opacity:0,y:30 }} whileInView={{ opacity:1,y:0 }} viewport={{ once:true }}>
            <p className="neon-badge mb-5 mx-auto w-fit">Ready to Start?</p>
            <h2 className="font-display text-6xl md:text-8xl text-white mb-6 leading-none">
              GET YOUR<br /><span className="gradient-text">FREE DEMO</span>
            </h2>
            <p className="text-gray-400 text-xl mb-10">We’ll build your site before you pay anything.</p>
            <Link href="/free-demo"
              className="btn-glow btn-neon text-white px-12 py-5 rounded-full font-bold text-xl inline-flex items-center gap-3 group">
              Build My Free Demo <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-gray-600 text-sm mt-6">No credit card · Ready in 48 hours · 100% free</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
