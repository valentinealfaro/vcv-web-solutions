/* Skeleton state shown while the /templates index is compiling /
   the gallery view is hydrating. Keeps perceived performance high
   when a user clicks "Templates" from the nav on a cold tab. */
export default function Loading() {
  return (
    <div className="bg-[#030712] min-h-screen">
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mx-auto h-3 w-32 rounded-full bg-white/[0.06] animate-pulse mb-6" />
          <div className="mx-auto h-12 md:h-20 w-3/4 rounded-2xl bg-white/[0.06] animate-pulse mb-5" />
          <div className="mx-auto h-4 w-2/3 rounded-full bg-white/[0.04] animate-pulse" />
        </div>
      </section>
      <section className="px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="p-3 rounded-2xl"
              style={{ background:'rgba(5,12,22,0.97)', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div className="aspect-[16/10] rounded-xl bg-white/[0.04] animate-pulse" />
              <div className="p-4">
                <div className="h-4 w-1/2 rounded-full bg-white/[0.06] animate-pulse mb-3" />
                <div className="h-3 w-3/4 rounded-full bg-white/[0.04] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
