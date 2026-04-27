export const LeadMagnetSection = () => (
  <section className="py-24 bg-gray-950">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center bg-gray-900 p-12 rounded-3xl border border-white/10">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Free Website Audit (Worth $297)</h2>
      <p className="text-gray-400 mb-8">Enter your details and we'll send you a custom audit of your site.</p>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input placeholder="Business Name" className="w-full p-3 bg-black rounded-xl border border-white/10" />
        <input placeholder="Website URL" className="w-full p-3 bg-black rounded-xl border border-white/10" />
        <input placeholder="Phone" className="w-full p-3 bg-black rounded-xl border border-white/10" />
        <input placeholder="Email" className="w-full p-3 bg-black rounded-xl border border-white/10" />
        <button className="md:col-span-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold">Get My Audit</button>
      </form>
    </div>
  </section>
);
