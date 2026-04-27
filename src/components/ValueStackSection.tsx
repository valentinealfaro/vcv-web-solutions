import { motion } from 'motion/react';
import {
  Layout, Search, BarChart3, Phone, Zap, ShieldCheck, Users, Rocket,
} from 'lucide-react';
import RadialOrbitalTimeline from '@/components/ui/radial-orbital-timeline';

const whatYouGet = [
  {
    id: 1,
    title: 'Custom Design',
    date: 'Day 1–3',
    content: 'A hand-crafted website layout built specifically for your business and your target customers — not a template.',
    category: 'Design',
    icon: Layout,
    relatedIds: [2, 5],
    status: 'completed' as const,
    energy: 100,
  },
  {
    id: 2,
    title: 'SEO Setup',
    date: 'Day 3–5',
    content: 'On-page SEO from day one: meta tags, schema markup, keyword targeting, and local Google optimization so you rank.',
    category: 'SEO',
    icon: Search,
    relatedIds: [1, 3],
    status: 'completed' as const,
    energy: 95,
  },
  {
    id: 3,
    title: 'Lead Forms',
    date: 'Day 4',
    content: 'High-converting contact forms, quote request flows, and call-to-action placements engineered to turn visitors into leads.',
    category: 'Leads',
    icon: BarChart3,
    relatedIds: [2, 4],
    status: 'completed' as const,
    energy: 90,
  },
  {
    id: 4,
    title: 'Call & Text',
    date: 'Day 5',
    content: 'One-tap call buttons, SMS links, and click-to-text integration so mobile visitors can reach you in seconds.',
    category: 'Communication',
    icon: Phone,
    relatedIds: [3, 7],
    status: 'completed' as const,
    energy: 88,
  },
  {
    id: 5,
    title: 'Fast Hosting',
    date: 'Day 6',
    content: 'Blazing-fast hosting with 99.9% uptime, SSL certificate, and CDN delivery so your site loads in under 2 seconds.',
    category: 'Hosting',
    icon: Zap,
    relatedIds: [1, 6],
    status: 'completed' as const,
    energy: 92,
  },
  {
    id: 6,
    title: 'You Own It',
    date: 'Always',
    content: 'Your domain, your code, your content — forever. Zero vendor lock-in. Walk away any time with everything intact.',
    category: 'Ownership',
    icon: ShieldCheck,
    relatedIds: [5, 7],
    status: 'completed' as const,
    energy: 100,
  },
  {
    id: 7,
    title: 'Mobile Ready',
    date: 'Day 1',
    content: 'Fully responsive on every device. Over 60% of local searches happen on mobile — your site will look perfect on all of them.',
    category: 'Mobile',
    icon: Users,
    relatedIds: [4, 8],
    status: 'completed' as const,
    energy: 97,
  },
  {
    id: 8,
    title: 'Ongoing Support',
    date: 'Ongoing',
    content: 'Monthly updates, content changes, and technical support included. We keep your site fresh, secure, and performing.',
    category: 'Support',
    icon: Rocket,
    relatedIds: [6, 1],
    status: 'in-progress' as const,
    energy: 85,
  },
];

export const ValueStackSection = () => (
  <section className="py-16 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-dot opacity-30" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-blue-600/30 to-transparent" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Everything Included</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-3">WHAT YOU GET</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Click any node to explore what's included. Every item is built into every plan — no upsells.
        </p>
      </motion.div>
    </div>

    {/* Orbital timeline — full width, no container constraint */}
    <RadialOrbitalTimeline timelineData={whatYouGet} />

    <div className="text-center mt-2">
      <p className="text-gray-600 text-xs">Click a node to explore · Click background to reset</p>
    </div>
  </section>
);
