'use client';
import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

/* Premium minimal sticky bar — mobile only. One primary CTA + a quiet call button. */
export function MobileStickyBar() {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: 'rgba(10,10,12,0.92)',
        backdropFilter: 'blur(18px)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
      <div className="flex items-stretch gap-2 px-3 py-2.5">
        <Link
          href="/free-demo"
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white font-bold text-sm py-3 shadow-lg shadow-blue-600/25 active:scale-[0.98] transition-transform">
          Free Design Preview
          <ArrowRight className="w-4 h-4" />
        </Link>
        <a
          href="tel:+15809191386"
          aria-label="Call (580) 919-1386"
          className="inline-flex items-center justify-center w-12 rounded-full border border-white/15 text-white active:scale-[0.97] transition-transform">
          <Phone className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
