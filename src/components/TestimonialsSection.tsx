import { motion } from 'motion/react';
import { MarkerHighlight } from '@/components/ui/marker-highlight';
import { TestimonialShowcase, type VCVTestimonial } from '@/components/ui/hover-testimonial-card';

const TESTIMONIALS: VCVTestimonial[] = [
  {
    id: '1',
    quote: 'We went from 2–3 calls a week to daily inbound leads within a month. The ROI paid for the entire site in week one. I wish I had done this years ago.',
    stars: 5, stat: '3× More Leads',
    author: { name: 'Jake T.', title: 'Owner, Elite Roofing Co.', initials: 'JT', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Jake' },
    company: { name: 'Elite Roofing Co.', initials: 'ER', color: '#f97316', industry: 'Roofing' },
  },
  {
    id: '2',
    quote: 'The SEO work is what sold me. We\'re now ranking on page one for all our target keywords. New customers find us every single day without spending a dime on ads.',
    stars: 5, stat: '#1 on Google',
    author: { name: 'Maria S.', title: 'Owner, Green Lawn Landscaping', initials: 'MS', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Maria' },
    company: { name: 'Green Lawn Landscaping', initials: 'GL', color: '#22c55e', industry: 'Landscaping' },
  },
  {
    id: '3',
    quote: 'I was skeptical about the free demo but it completely blew me away. Within 2 weeks we had the site live and calls were already coming in. Easiest decision I ever made.',
    stars: 5, stat: 'Live in 5 Days',
    author: { name: 'Dave R.', title: 'Owner, Dave\'s Plumbing', initials: 'DR', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Dave' },
    company: { name: 'Dave\'s Plumbing', initials: 'DP', color: '#3b82f6', industry: 'Plumbing' },
  },
  {
    id: '4',
    quote: 'Professional, fast, and they actually care about results — not just making something that looks pretty. My competitors don\'t know what hit them.',
    stars: 5, stat: '4.9★ Review Rate',
    author: { name: 'Lisa M.', title: 'Owner, Sparkle Clean Services', initials: 'LM', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Lisa' },
    company: { name: 'Sparkle Clean Services', initials: 'SC', color: '#a855f7', industry: 'Cleaning' },
  },
  {
    id: '5',
    quote: 'We were running Facebook ads and burning cash. VCV built us a site that generates organic leads every day. Our cost-per-lead dropped by 80% in 60 days.',
    stars: 5, stat: '−80% Cost Per Lead',
    author: { name: 'Chris B.', title: 'Owner, AutoFix Repair Shop', initials: 'CB', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Chris' },
    company: { name: 'AutoFix Repair Shop', initials: 'AR', color: '#ef4444', industry: 'Auto Repair' },
  },
  {
    id: '6',
    quote: 'We picked up 30+ new patients in the first month after launch. The online booking form alone is worth every penny — it books while I\'m asleep.',
    stars: 5, stat: '30+ New Patients/mo',
    author: { name: 'Dr. Sandra K.', title: 'Owner, Family Dental Care', initials: 'SK', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Sandra' },
    company: { name: 'Family Dental Care', initials: 'FD', color: '#06b6d4', industry: 'Dental' },
  },
  {
    id: '7',
    quote: 'Storm season used to be chaos — now our site handles the surge automatically. We ranked #1 for "emergency tree removal" in our county. Job tickets tripled.',
    stars: 5, stat: '3× Job Tickets',
    author: { name: 'Mike T.', title: 'Owner, Texas Tree Service', initials: 'MT', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Mike' },
    company: { name: 'Texas Tree Service', initials: 'TT', color: '#84cc16', industry: 'Tree Service' },
  },
  {
    id: '8',
    quote: 'My salon went from half-empty to fully booked within 6 weeks of the site going live. The online booking system changed everything. My old website was an embarrassment.',
    stars: 5, stat: 'Fully Booked',
    author: { name: 'Rachel P.', title: 'Owner, Bella\'s Hair Studio', initials: 'RP', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Rachel' },
    company: { name: 'Bella\'s Hair Studio', initials: 'BH', color: '#ec4899', industry: 'Salon' },
  },
  {
    id: '9',
    quote: 'My phone literally doesn\'t stop. I had to hire two more drivers just to keep up. The website is the best employee I\'ve ever had — it works 24/7 and never calls in sick.',
    stars: 5, stat: 'Hired 2 More Drivers',
    author: { name: 'Tom W.', title: 'Owner, Fast Movers LLC', initials: 'TW', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Tom' },
    company: { name: 'Fast Movers LLC', initials: 'FM', color: '#fbbf24', industry: 'Moving' },
  },
  {
    id: '10',
    quote: 'Within 90 days we stopped taking low-value jobs entirely. The website attracts premium clients who are ready to pay. Best investment our HVAC business has ever made.',
    stars: 5, stat: 'Premium Clients Only',
    author: { name: 'Amy C.', title: 'Owner, CoolBreeze HVAC', initials: 'AC', avatar: 'https://api.dicebear.com/8.x/lorelei/svg?seed=Amy' },
    company: { name: 'CoolBreeze HVAC', initials: 'CB', color: '#38bdf8', industry: 'HVAC' },
  },
];

export const TestimonialsSection = () => (
  <section className="py-24 bg-[#040a16] relative overflow-hidden">
    <div className="absolute inset-0 bg-dot opacity-25 pointer-events-none" />
    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

      {/* ── Heading box ─────────────────────────────────── */}
      <div className="relative mb-14 overflow-hidden text-center"
        style={{
          background: 'rgba(8,12,26,0.65)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(37,99,235,0.22)',
          borderRadius: 24,
          padding: '48px 40px 40px',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}>

        {/* Subtle grid inside the box */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" style={{ borderRadius: 24 }} />
        {/* Top glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.5), transparent)' }} />

        {/* Badge — slides in from LEFT */}
        <motion.div
          initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }} viewport={{ once: true }}
          className="mb-5 relative z-10">
          <p className="neon-badge mx-auto w-fit">Social Proof</p>
        </motion.div>

        {/* Headline — CLIENT from LEFT, WINS from RIGHT */}
        <h2 className="font-display text-6xl md:text-7xl text-white mb-5 relative z-10 leading-none">
          <motion.span
            initial={{ opacity: 0, x: -70 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }} viewport={{ once: true }}
            style={{ display: 'inline-block' }}>
            CLIENT
          </motion.span>
          {' '}
          <motion.span
            initial={{ opacity: 0, x: 70 }} whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }} viewport={{ once: true }}
            style={{ display: 'inline-block' }}>
            <MarkerHighlight
              highlight="WINS"
              markerColor="rgba(6, 182, 212, 0.82)"
              textColor="white"
              delay={0.45}
            />
          </motion.span>
        </h2>

        {/* Subtitle — slides in from RIGHT */}
        <motion.p
          initial={{ opacity: 0, x: 55 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }} viewport={{ once: true }}
          className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed mb-8 relative z-10">
          10 real businesses. 10 real results. Local contractors and service companies
          that now dominate their markets.
        </motion.p>

        {/* Proof pills — alternating left / right */}
        <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
          {[
            { icon: '⭐', label: '4.9 / 5 Average Rating' },
            { icon: '🏆', label: '50+ Businesses Served' },
            { icon: '📍', label: 'Serving Nationwide' },
            { icon: '🔒', label: '100% Money-Back' },
          ].map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.35 + i * 0.07 }}
              viewport={{ once: true }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999, padding: '7px 16px',
                fontSize: 13, fontWeight: 600, color: '#94a3b8',
              }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive showcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }} viewport={{ once: true }}>
        <TestimonialShowcase
          testimonials={TESTIMONIALS}
          defaultTestimonialId="1"
          autoPlayInterval={5000}
        />
      </motion.div>

      {/* Hint */}
      <p className="text-center text-gray-600 text-xs mt-6">
        Click any avatar to read their story · Auto-advances every 5 seconds
      </p>
    </div>
  </section>
);
