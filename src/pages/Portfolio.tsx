'use client';
import { motion } from 'motion/react';
import { ExternalLink, Globe, Layout, Search, ArrowRight, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { cn } from '../lib/utils';

const PortfolioItem = ({ title, category, image, description, tags, demoUrl }: any) => {
  const handleBuyNow = async () => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productName: title }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error:", errorData);
        alert(`Failed to initiate payment: ${errorData.details || errorData.error || "Unknown error"}`);
        return;
      }

      const { url } = await response.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (error) {
      console.error("Error in handleBuyNow:", error);
      alert(`An unexpected error occurred: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group bg-gray-900 border border-white/5 rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all flex flex-col"
    >
      <a 
        href={demoUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        className="aspect-video relative overflow-hidden block"
      >
        <img
          src={image}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/40">
              <ExternalLink className="w-6 h-6" />
            </div>
            <span className="text-white text-xs font-bold uppercase tracking-widest">View Live Demo</span>
          </div>
        </div>
      </a>
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-black uppercase tracking-widest text-blue-500">{category}</span>
          <div className="flex space-x-2">
            {tags.map((tag: string, idx: number) => (
              <span key={idx} className="text-[10px] font-bold bg-white/5 text-gray-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">{description}</p>
        
        <div className="mt-auto flex flex-col space-y-4 pt-6 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <Layout className="w-4 h-4" />
                <span>UX/UI</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-bold text-gray-500">
                <Search className="w-4 h-4" />
                <span>SEO</span>
              </div>
            </div>
            <a 
              href={demoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 font-bold text-sm flex items-center space-x-2 group/link"
            >
              <span>Live Demo</span>
              <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
            </a>
          </div>
          <button
            onClick={handleBuyNow}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition-all shadow-lg shadow-blue-600/20"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Buy Now ($497)</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'home', name: 'Home Services' },
    { id: 'professional', name: 'Professional Services' },
    { id: 'food', name: 'Food & Dining' }
  ];

  const projects = [
    { title: "Plumbers", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FPlumbing%20Website%20Demo.png?alt=media&token=92ab3636-87bb-429d-b362-907386e1bc2a", description: "High-converting website for plumbing services.", tags: ["Lead Gen", "SEO"], demoUrl: "https://plumbflow-high-converting-plumber-template-204626754103.us-west1.run.app" },
    { title: "Electricians", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FElectrican%20Website%20Demo.png?alt=media&token=73cc1d73-3dfa-424f-93c8-7d1653985f17", description: "Professional site for electrical contractors.", tags: ["Lead Gen", "SEO"], demoUrl: "https://voltmaster-electrician-template-204626754103.us-west1.run.app" },
    { title: "HVAC", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FHVAC%20Screenshot%20for%20Demo%20Website.png?alt=media&token=51900686-0453-473c-85a2-bcfd627fc236", description: "Heating and air conditioning service website.", tags: ["Lead Gen", "SEO"], demoUrl: "https://arcticfire-hvac-204626754103.us-west1.run.app" },
    { title: "Roofing", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FRoofing%20Website%20Demo.png?alt=media&token=270d5d1f-0950-456d-bca0-94de3c29e3dc", description: "Roofing company lead generation site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://roofmaster-pro-template-204626754103.us-west1.run.app" },
    { title: "Concrete", category: "home", image: "https://picsum.photos/seed/concrete/800/600", description: "Concrete contractor website.", tags: ["Lead Gen", "SEO"], demoUrl: "https://solidbuild-concrete-204626754103.us-west1.run.app" },
    { title: "Fencing", category: "home", image: "https://picsum.photos/seed/fence/800/600", description: "Fence installation service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://ironwood-fencing-gates-204626754103.us-west1.run.app" },
    { title: "Handyman", category: "home", image: "https://picsum.photos/seed/handyman/800/600", description: "Handyman services website.", tags: ["Lead Gen", "SEO"], demoUrl: "https://premium-handyman-lawton-204626754103.us-west1.run.app" },
    { title: "Pressure Washing", category: "home", image: "https://picsum.photos/seed/pressure/800/600", description: "Pressure washing service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://aquaflow-pressure-washing-204626754103.us-west1.run.app" },
    { title: "Gutter Cleaning", category: "home", image: "https://picsum.photos/seed/gutter/800/600", description: "Gutter cleaning service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://leafyclean-premium-gutter-cleaning-204626754103.us-west1.run.app" },
    { title: "Tree Services", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FTree%20Removal%20Website%20Demo.png?alt=media&token=6a8beddd-81f9-49e8-a397-09e74c17dfe1", description: "Tree trimming and removal site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://timberguard-tree-services-204626754103.us-west1.run.app" },
    { title: "Junk Removal", category: "home", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FJunk%20Removal%20Demo%20Website.png?alt=media&token=09098f4e-1cc0-487a-a471-1cade9459223", description: "Junk removal service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://junkaway-fast-affordable-junk-removal-204626754103.us-west1.run.app" },
    { title: "Mortgage", category: "professional", image: "https://picsum.photos/seed/mortgage/800/600", description: "Mortgage broker professional site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://mortgage-broker-pro-template-204626754103.us-west1.run.app" },
    { title: "Mobile Detailing", category: "home", image: "https://picsum.photos/seed/detailing/800/600", description: "Mobile car detailing service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://luxury-mobile-detailing-template-204626754103.us-west1.run.app" },
    { title: "House Cleaning", category: "home", image: "https://picsum.photos/seed/cleaning/800/600", description: "House cleaning service site.", tags: ["Lead Gen", "SEO"], demoUrl: "https://clean-calm-cleaning-template-204626754103.us-west1.run.app" },
    { title: "Food Trucks", category: "food", image: "https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FDemo%20Screenshots%2FFood%20Truck%20Demo%20Website.png?alt=media&token=e05f2706-9a26-4073-8c8a-7c6513b11dd2", description: "Food truck business website.", tags: ["Lead Gen", "SEO"], demoUrl: "https://street-eats-food-truck-template-204626754103.us-west1.run.app" }
  ];

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter(p => p.category === activeCategory);

  return (
    <div className="bg-black pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
          >
            Our <span className="text-blue-500">Portfolio</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Real results for real businesses. Browse our latest high-converting projects.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-6 py-2 rounded-full text-sm font-bold transition-all",
                activeCategory === cat.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                  : "bg-gray-900 text-gray-400 hover:text-white border border-white/5"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, idx) => (
            <PortfolioItem key={idx} {...project} />
          ))}
        </div>

        <div className="mt-24 p-12 bg-gray-950 border border-white/5 rounded-3xl text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Want to see your business here?</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            We're ready to build your next growth engine. Get a free demo of what we can do for you.
          </p>
          <Link
            href="/free-demo"
            className="inline-flex items-center space-x-3 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-all shadow-2xl"
          >
            <span>Request Your Free Demo</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
