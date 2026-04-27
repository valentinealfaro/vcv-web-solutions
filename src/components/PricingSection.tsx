import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Zap } from 'lucide-react';

const plans = [
  {
    name: 'Monthly',
    price: 97,
    period: '/mo',
    description: 'Perfect for getting started with no long-term commitment.',
    features: [
      'Custom website design',
      'Mobile-responsive layout',
      'Basic SEO setup',
      'Contact & lead forms',
      'Hosting & maintenance',
      'Monthly updates',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Annual',
    price: 497,
    period: '/yr',
    badge: 'Best Value — Save $667',
    description: 'The complete package. Everything you need to dominate your market.',
    features: [
      'Everything in Monthly',
      'Advanced SEO optimization',
      'Google Ads integration ready',
      'Blog & content system',
      'Analytics dashboard',
      'Priority support',
      'Quarterly strategy calls',
      'Free demo included',
    ],
    cta: 'Start Winning',
    featured: true,
  },
];

export const PricingSection = () => (
  <section className="py-24 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-40" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/6 blur-[100px] rounded-full" />

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Simple Pricing</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">PRICING</h2>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">No hidden fees. No long-term contracts. Cancel anytime.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }} viewport={{ once: true }}
            className={`relative p-8 rounded-[20px] ${plan.featured
              ? 'bg-gradient-to-br from-blue-900/40 to-purple-900/30 border border-blue-500/30 shadow-[0_0_60px_rgba(37,99,235,0.15)]'
              : 'neon-card'
            }`}>

            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap shadow-lg">
                  <Zap className="w-3 h-3" /> {plan.badge}
                </span>
              </div>
            )}

            <div className="mb-6">
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">{plan.name}</p>
              <div className="flex items-end gap-1 mb-2">
                <span className="font-display text-6xl text-white">${plan.price}</span>
                <span className="text-gray-500 text-lg mb-2">{plan.period}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-8">
              {plan.features.map((f, j) => (
                <div key={j} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.featured ? 'text-blue-400' : 'text-gray-500'}`} />
                  <span className={plan.featured ? 'text-gray-200' : 'text-gray-400'}>{f}</span>
                </div>
              ))}
            </div>

            <Link to="/free-demo"
              className={`block w-full py-3.5 rounded-xl font-bold text-center text-sm transition-all group flex items-center justify-center gap-2 ${plan.featured
                ? 'btn-neon btn-glow text-white'
                : 'glass-card text-gray-300 hover:text-white hover:border-blue-500/30'
              }`}>
              {plan.cta}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}
        className="text-center text-gray-500 text-sm mt-8">
        Not sure which plan? <Link to="/free-demo" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Start with the free demo →</Link>
      </motion.p>
    </div>
  </section>
);
