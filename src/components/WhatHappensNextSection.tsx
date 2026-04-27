import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const steps = [
  'You request your free demo',
  'We build your custom preview',
  'You approve or revise',
  'We launch your site live',
  'You start getting more calls',
];

export const WhatHappensNextSection = () => (
  <section className="py-20 bg-[#040a16] relative overflow-hidden">
    <div className="absolute inset-0 bg-dot opacity-30" />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="font-display text-5xl md:text-6xl text-white mb-2">WHAT HAPPENS NEXT</h2>
        <p className="text-gray-400">Here's exactly what to expect after you submit.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-2">
        {steps.map((step, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className="flex md:flex-col items-center gap-4 md:gap-3 flex-1">
            <div className="flex-shrink-0 flex flex-col md:flex-row items-center gap-2 md:gap-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold font-display text-xl shadow-lg shadow-blue-600/20">
                {i + 1}
              </div>
            </div>
            <p className="text-white font-semibold text-sm text-center leading-relaxed">{step}</p>
            {i < steps.length - 1 && (
              <ArrowRight className="hidden md:block w-5 h-5 text-blue-600/40 flex-shrink-0 absolute" style={{ right: '-12px', top: '14px', position: 'relative' }} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
