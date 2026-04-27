import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "We went from 2–3 calls a week to daily leads within a month. The ROI on this website has been insane.",
    author: "Jake T.",
    role: "Owner, Elite Roofing Co.",
    stars: 5,
    tag: "3x More Leads",
  },
  {
    quote: "The website design and SEO work were exactly what we needed. We're now ranking on page one for all our top keywords.",
    author: "Maria S.",
    role: "Owner, Green Lawn Landscaping",
    stars: 5,
    tag: "#1 on Google",
  },
  {
    quote: "I was skeptical about the free demo offer but it blew me away. Within 2 weeks we had the site live and calls were coming in.",
    author: "Dave R.",
    role: "Owner, Dave's Plumbing",
    stars: 5,
    tag: "Launched in 5 Days",
  },
  {
    quote: "Professional, fast, and they actually care about results — not just making something that looks pretty.",
    author: "Lisa M.",
    role: "Owner, Sparkle Clean Services",
    stars: 5,
    tag: "4.9★ Review Rate",
  },
];

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5 text-yellow-400 mb-3">
    {[...Array(count)].map((_, i) => <Star key={i} className="w-4 h-4 fill-yellow-400" />)}
  </div>
);

export const TestimonialsSection = () => (
  <section className="py-24 bg-[#040a16] relative overflow-hidden">
    <div className="absolute inset-0 bg-dot opacity-30" />
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Social Proof</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">CLIENT WINS</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">Real results from real businesses — not agencies, not big corporations. Local businesses just like yours.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            className="neon-card p-8 group relative overflow-hidden">
            {/* Background glow on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <StarRating count={t.stars} />
                <span className="neon-badge text-xs">{t.tag}</span>
              </div>

              <Quote className="w-8 h-8 text-blue-600/30 mb-3" />
              <p className="text-gray-300 text-base leading-relaxed mb-6 italic">"{t.quote}"</p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {t.author[0]}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{t.author}</p>
                  <p className="text-gray-500 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust badges row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }} viewport={{ once: true }}
        className="mt-12 flex flex-wrap items-center justify-center gap-8 text-gray-500 text-sm">
        {[
          '⭐ 4.9/5 Average Rating',
          '🏆 50+ Businesses Served',
          '📍 Serving Clients Nationwide',
          '🔒 100% Money-Back Guarantee',
        ].map((badge, i) => (
          <span key={i} className="font-semibold">{badge}</span>
        ))}
      </motion.div>
    </div>
  </section>
);
