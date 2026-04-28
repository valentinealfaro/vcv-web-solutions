'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'How long does it take to build my website?',
    a: 'We typically launch websites in 3–7 business days from the time you approve the initial design. Most clients see their site live within 5 days.',
  },
  {
    q: 'Do I own my website?',
    a: 'Yes — 100%. You own the domain, the code, and all the content. We never hold your site hostage. Walk away anytime with everything intact.',
  },
  {
    q: 'Will my site rank on Google?',
    a: 'We build every site with SEO-first architecture — proper header tags, schema markup, fast load speeds, and local optimization. Most clients start seeing ranking improvements within 30–60 days.',
  },
  {
    q: 'What if I don\'t like the design?',
    a: 'We offer unlimited revisions until you are happy. Our design preview process means you see and approve the site direction before we go live — so there are no surprises.',
  },
  {
    q: 'Do you offer monthly plans?',
    a: 'Yes — $147/month with no long-term commitment. Or save big with our annual plan at $1,497/year (that saves you $1,473 off the regular $2,970 rate, and the setup fee is waived).',
  },
  {
    q: 'What industries do you work with?',
    a: 'We specialize in contractors, home service businesses, roofers, plumbers, landscapers, HVAC, restaurants, and professional services. We\'ve built sites across dozens of niches.',
  },
  {
    q: 'How does the design preview work?',
    a: 'We build a custom mockup of your website before you subscribe — so you see exactly what you are getting before committing. Once you approve the design, you choose your plan and we launch it, usually within 3-7 days.',
  },
];

const FAQItem = ({ faq, isOpen, toggle }: { faq: { q: string; a: string }; isOpen: boolean; toggle: () => void }) => (
  <div className={`neon-card overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-500/30' : ''}`}>
    <button
      onClick={toggle}
      className="w-full px-6 py-5 flex items-center justify-between text-left group">
      <span className={`font-semibold text-sm md:text-base transition-colors ${isOpen ? 'text-blue-400' : 'text-white group-hover:text-blue-300'}`}>
        {faq.q}
      </span>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ml-4 transition-all ${isOpen ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-gray-400 group-hover:bg-white/10'}`}>
        {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
      </div>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}>
          <div className="px-6 pb-5">
            <div className="h-px bg-white/[0.05] mb-4" />
            <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const FAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 bg-[#040a16] relative overflow-hidden">
      <div className="absolute inset-0 bg-dot opacity-25" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="neon-badge mb-4 mx-auto w-fit">Got Questions?</p>
          <h2 className="font-display text-6xl md:text-7xl text-white mb-4">FAQ</h2>
          <p className="text-gray-400 text-lg">Everything you need to know before getting started.</p>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }} viewport={{ once: true }}>
              <FAQItem faq={faq} isOpen={open === i} toggle={() => setOpen(open === i ? null : i)} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
