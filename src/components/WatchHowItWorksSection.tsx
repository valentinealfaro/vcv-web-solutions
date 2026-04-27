export const WatchHowItWorksSection = () => (
  <section className="py-24 bg-gray-950">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">Watch How It Works</h2>
      <div className="aspect-video max-w-4xl mx-auto bg-gray-900 rounded-3xl border border-white/10 overflow-hidden">
        <iframe 
          src="/demo.html" 
          className="w-full h-full" 
          title="VCV Web Solutions Transformation Demo"
          allow="autoplay; fullscreen"
        />
      </div>
    </div>
  </section>
);
