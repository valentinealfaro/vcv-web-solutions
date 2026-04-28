'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ArrowRight, Flame, Clock, CheckCircle2 } from 'lucide-react';
import { FreeDemoButton } from '@/components/FreeDemoButton';

export const UrgencySection = () => (
  <section className="py-20 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-40" />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="relative p-10 md:p-14 rounded-[24px] overflow-hidden text-center"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.15) 0%, rgba(124,58,237,0.1) 50%, rgba(6,182,212,0.05) 100%)',
          border: '1px solid rgba(37,99,235,0.2)',
          boxShadow: '0 0 80px rgba(37,99,235,0.1)',
        }}>
        <div className="absolute inset-0 bg-dot opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-5">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="neon-badge border-orange-500/30 text-orange-300 bg-orange-500/10">
              Limited Monthly Spots
            </span>
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl text-white mb-4 leading-none">
            ONLY A FEW SPOTS <br />
            <span className="gradient-text">LEFT THIS MONTH</span>
          </h2>

          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            We limit new clients each month to maintain quality. Once spots fill up, you go on the waitlist.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              { icon: <CheckCircle2 className="w-4 h-4" />, text: 'Custom design preview' },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: 'SEO setup included' },
              { icon: <CheckCircle2 className="w-4 h-4" />, text: '30-day results guarantee' },
            ].map((item, i) => (
              <div key={i} className="glass-card px-4 py-3 flex items-center gap-2 text-sm text-gray-300 justify-center">
                <span className="text-blue-400">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>

          <FreeDemoButton size="lg" label="Claim Your Spot" />

          <div className="flex items-center justify-center gap-2 mt-5 text-gray-500 text-sm">
            <Clock className="w-4 h-4" />
            <span>Design previews are first come, first served — limited spots</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);
