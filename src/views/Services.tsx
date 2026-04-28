'use client';
import { motion } from 'motion/react';
import { Layout, Search, BarChart3, Users, CheckCircle2, ArrowRight, X, Rocket } from 'lucide-react';
import Link from 'next/link';

const ServiceCard = ({ icon, title, benefit, features }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="premium-card p-8 card-hover flex flex-col"
  >
    <div className="mb-6 p-3 bg-blue-600/10 rounded-xl inline-block w-fit">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
    <p className="text-blue-400 font-semibold mb-6">{benefit}</p>
    <ul className="space-y-4 mb-8 flex-grow">
      {features.map((feature: string, idx: number) => (
        <li key={idx} className="flex items-center gap-3 text-sm text-gray-300">
          <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    <Link
      href="/free-demo"
      className="text-blue-500 font-bold hover:text-blue-400 transition-colors flex items-center gap-2"
    >
      Get Demo <ArrowRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

export default function Services() {
  const serviceGroups = [
    {
      title: "Website Design & Development",
      services: [
        {
          icon: <Layout className="w-8 h-8 text-blue-500" />,
          title: "High-Converting Website Design",
          benefit: "We build websites designed to turn visitors into calls and customers.",
          features: ["Mobile optimized", "Built for conversions", "Fast load speeds", "Clean, modern design"]
        },
        {
          icon: <Rocket className="w-8 h-8 text-blue-500" />,
          title: "Fast-Launch Landing Pages",
          benefit: "Get your business online and generating leads in days, not weeks.",
          features: ["3–7 day turnaround", "Focused lead capture", "Professional branding", "Ready to launch"]
        }
      ]
    },
    {
      title: "Lead Generation & Visibility",
      services: [
        {
          icon: <Search className="w-8 h-8 text-blue-500" />,
          title: "SEO & Local Visibility",
          benefit: "Rank on Google and get found by customers actively searching for your services.",
          features: ["On-page SEO optimization", "Local search ranking", "Keyword research", "Technical SEO"]
        },
        {
          icon: <BarChart3 className="w-8 h-8 text-blue-500" />,
          title: "Paid Ads Management",
          benefit: "Scale your business fast with highly targeted ad campaigns that convert.",
          features: ["Google Ads management", "Facebook/Instagram ads", "Conversion tracking", "Funnel strategy"]
        }
      ]
    }
  ];

  return (
    <div className="bg-black pt-32 pb-24">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="max-w-3xl">
          <span className="text-blue-500 font-bold tracking-wider uppercase text-sm">Our Services</span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-[1.1]">
            Professional Solutions to <span className="text-blue-500">Scale Your Business</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 leading-relaxed">
            We don't just build websites; we build growth engines. Our focus is on results, not just aesthetics.
          </p>
          <div className="flex gap-4">
            <Link href="/free-demo" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-blue-600/20">
              Get My Free Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Services */}
      {serviceGroups.map((group, idx) => (
        <section key={idx} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {group.services.map((service, sIdx) => (
                <ServiceCard key={sIdx} {...service} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Marquee */}
      <div className="marquee-band my-16">
        <div className="marquee-inner">
          <span className="marquee-item">No Upfront Cost Options</span>
          <span className="marquee-item">Built in 3–7 Days</span>
          <span className="marquee-item">SEO Optimized</span>
          <span className="marquee-item">Mobile Friendly</span>
          <span className="marquee-item">Lead Generation Focused</span>
          <span className="marquee-item">Call & Text Integration</span>
        </div>
      </div>


      {/* What Makes This Different */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Why Our Websites Actually Generate Leads</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="premium-card p-10">
              <h3 className="text-2xl font-bold text-red-500 mb-8 flex items-center gap-3"><X className="w-6 h-6" /> Typical Websites</h3>
              <ul className="space-y-4 text-gray-400">
                <li>Look nice but don’t convert</li>
                <li>No call tracking</li>
                <li>No SEO structure</li>
                <li>Slow or outdated</li>
              </ul>
            </div>
            <div className="premium-card p-10 border-blue-500/30">
              <h3 className="text-2xl font-bold text-green-500 mb-8 flex items-center gap-3"><CheckCircle2 className="w-6 h-6" /> VCV Websites</h3>
              <ul className="space-y-4 text-gray-300">
                <li>Built for calls & leads</li>
                <li>SEO-ready structure</li>
                <li>Fast & mobile optimized</li>
                <li>Designed for local businesses</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-16 text-center">Our Proven Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { title: "Request Demo", desc: "Tell us about your business." },
              { title: "Build Preview", desc: "We design your custom site." },
              { title: "Approve", desc: "Review and request changes." },
              { title: "Launch", desc: "We take your site live." },
              { title: "Get Leads", desc: "Start getting more calls." }
            ].map((step, i) => (
              <div key={i} className="relative premium-card p-6">
                <div className="text-4xl font-black text-blue-600/20 mb-4">0{i + 1}</div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-400/20 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-8">Get Your Free Website Demo</h2>
          <p className="text-blue-100 text-xl mb-10">
            We’ll build a live preview before you pay anything.
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
