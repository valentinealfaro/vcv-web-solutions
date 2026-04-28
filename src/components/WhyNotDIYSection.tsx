'use client';
export const WhyNotDIYSection = () => (
  <section className="py-24 bg-black">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-900 p-12 rounded-3xl border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Why Not Just Build It Yourself?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4 text-red-400">
          <p>❌ Takes weeks or months</p>
          <p>❌ Doesn’t convert</p>
          <p>❌ Doesn’t rank</p>
          <p>❌ Wastes your time</p>
        </div>
        <div className="space-y-4 text-green-400 font-bold">
          <p>✔ We do it for you — fast and built to get results</p>
        </div>
      </div>
    </div>
  </section>
);
