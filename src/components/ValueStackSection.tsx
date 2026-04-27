export const ValueStackSection = () => (
  <section className="py-24 bg-gray-950">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-gray-900 p-12 rounded-3xl border border-white/10">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">What You Get:</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
        {[
          "Custom website design",
          "Mobile optimization",
          "SEO setup",
          "Lead capture forms",
          "Call & text integration",
          "Fast hosting",
          "Ongoing support options"
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-green-500 font-bold">✔</span> {item}
          </div>
        ))}
      </div>
    </div>
  </section>
);
