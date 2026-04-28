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
    {/* ── Animated background ─────────────────────────────── */}

    {/* Slow-moving gradient orbs */}
    <div className="absolute top-[-15%] left-[10%]  w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none animate-orb"
      style={{ background:'rgba(37,99,235,0.09)' }} />
    <div className="absolute top-[20%]  right-[-5%] w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none animate-orb-delay"
      style={{ background:'rgba(124,58,237,0.08)' }} />
    <div className="absolute bottom-[-10%] left-[30%] w-[460px] h-[460px] rounded-full blur-[120px] pointer-events-none animate-orb-slow"
      style={{ background:'rgba(6,182,212,0.07)' }} />
    <div className="absolute top-[40%] left-[-5%]  w-[300px] h-[300px] rounded-full blur-[90px]  pointer-events-none animate-orb-delay"
      style={{ background:'rgba(168,85,247,0.07)', animationDelay:'2s' }} />
    <div className="absolute bottom-[10%] right-[5%] w-[350px] h-[350px] rounded-full blur-[100px] pointer-events-none animate-orb"
      style={{ background:'rgba(34,197,94,0.06)', animationDelay:'4s' }} />

    {/* Central radial glow behind the orbit ring */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none animate-orb-slow"
      style={{ background:'radial-gradient(ellipse, rgba(37,99,235,0.06) 0%, transparent 65%)' }} />

    {/* Grid + dot overlays */}
    <div className="absolute inset-0 bg-grid opacity-[0.35] pointer-events-none" />
    <div className="absolute inset-0 bg-dot  opacity-[0.20] pointer-events-none" />

    {/* Top / bottom edge lines */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px pointer-events-none"
      style={{ background:'linear-gradient(90deg,transparent,rgba(37,99,235,0.4),rgba(124,58,237,0.3),transparent)' }} />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-px pointer-events-none"
      style={{ background:'linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)' }} />

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
