'use client';
import { motion } from 'motion/react';
import Link from 'next/link';
import { ExternalLink, ArrowRight } from 'lucide-react';

const demos = [
  {
    title: 'Roofing Company Website',
    img: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FRoofing%20Website%20Demo.png?alt=media&token=270d5d1f-0950-456d-bca0-94de3c29e3dc',
    url: 'https://roofmaster-pro-template-204626754103.us-west1.run.app',
    tag: 'Contractor',
    stat: '+280% More Calls',
  },
  {
    title: 'Junk Removal Website',
    img: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FJunk%20Removal%20Demo%20Website.png?alt=media&token=09098f4e-1cc0-487a-a471-1cade9459223',
    url: 'https://junkaway-fast-affordable-junk-removal-204626754103.us-west1.run.app',
    tag: 'Home Services',
    stat: '#1 in Local SEO',
  },
  {
    title: 'Food Truck Website',
    img: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FFood%20Truck%20Demo%20Website.png?alt=media&token=e05f2706-9a26-4073-8c8a-7c6513b11dd2',
    url: 'https://street-eats-food-truck-template-204626754103.us-west1.run.app',
    tag: 'Restaurant',
    stat: '3x More Orders',
  },
];

export const DemoSection = () => (
  <section className="py-24 bg-[#030712] relative overflow-hidden">
    <div className="absolute inset-0 bg-grid opacity-40" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-purple-600/6 blur-[80px] rounded-full" />

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <p className="neon-badge mb-4 mx-auto w-fit">Live Demos</p>
        <h2 className="font-display text-6xl md:text-7xl text-white mb-4">SEE IT IN ACTION</h2>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          Real websites we've built. Click to see the full live preview — your website could look just like this.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {demos.map((demo, i) => (
          <motion.a
            key={i}
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="neon-card p-4 block group cursor-pointer">

            <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/5">
              <img
                src={demo.img}
                alt={demo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white text-sm font-bold flex items-center gap-1.5 bg-blue-600/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  <ExternalLink className="w-3.5 h-3.5" /> View Live Site
                </span>
              </div>
              <div className="absolute top-2 left-2">
                <span className="neon-badge text-[10px] py-1 px-2">{demo.tag}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-white font-bold text-sm">{demo.title}</h3>
              <span className="text-green-400 text-xs font-bold">{demo.stat}</span>
            </div>
          </motion.a>
        ))}
      </div>

      <div className="text-center">
        <Link href="/portfolio"
          className="glass-card inline-flex items-center gap-2 text-white px-8 py-4 rounded-full font-bold hover:border-blue-500/40 transition-all group">
          View All Demo Sites
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  </section>
);
