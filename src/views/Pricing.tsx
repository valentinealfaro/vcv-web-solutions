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
      name: "Starter",
      description: "Perfect for new local businesses getting started.",
      price: "$97",
      setup: "No upfront cost options",
      features: ["Custom website", "Mobile optimized", "Fast load speeds", "SEO-ready structure", "Hosting included"]
    },
    {
      name: "Growth",
      description: "Best for businesses that want consistent leads.",
      price: "$197",
      setup: "No upfront cost",
      isPopular: true,
      features: ["Custom website", "SEO-ready structure", "Mobile optimized", "Lead tracking", "Hosting included", "Ongoing support"]
    },
    {
      name: "Pro",
      description: "For businesses ready to dominate their market.",
      price: "$297",
      setup: "Custom setup",
      features: ["Everything in Growth", "Advanced SEO system", "CRM integration", "Automation systems", "Dedicated manager"]
    }
  ];

  return (
    <div className="bg-black pt-32 pb-24">
      {/* Hero */}
      <div className="max-w-4xl mx-auto px-4 text-center mb-24">
        <span className="text-blue-500 font-bold tracking-wider uppercase text-sm">Pricing</span>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-[1.1]">
          Simple Pricing That Gets You More Calls
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          We build your website before you pay anything. No risk. No surprises.
        </p>
        <div className="flex justify-center gap-4 mb-8">
          <Link href="/free-demo" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/20">
            Get My Free Demo
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> No upfront cost options</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Built in 3–7 days</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500" /> Designed for leads</span>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {packages.map((pkg, idx) => (
          <PricingCard key={idx} {...pkg} />
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
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="premium-card p-12 text-center">
            <ShieldCheck className="w-12 h-12 text-blue-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-6">Try It Risk-Free</h2>
            <ul className="grid md:grid-cols-2 gap-4 text-gray-400 text-left">
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500" /> We build your demo before you pay</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500" /> No long-term contracts</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500" /> No upfront cost options</li>
              <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-blue-500" /> You only move forward if you like it</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          <FAQItem question="Do I have to pay upfront?" answer="No. We build your website demo first, so you can see exactly what you're getting before you pay anything." />
          <FAQItem question="How long does it take?" answer="Most websites are built and launched in 3–7 days." />
          <FAQItem question="Can I cancel?" answer="Yes, we offer flexible options with no long-term contracts." />
          <FAQItem question="Do you handle everything?" answer="Yes, we handle design, development, hosting, and ongoing support." />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">Get Your Free Website Demo</h2>
          <p className="text-blue-100 text-xl mb-10">
            We’ll build your site before you pay anything.
          </p>
          <Link
            href="/free-demo"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl"
          >
            Get My Free Demo <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>
    </div>
  );
}
