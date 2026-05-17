'use client';

/* Route-level error UI. Renders whenever a child page throws. Keeps the
   global chrome intact (Navbar + Footer + SiteChrome from layout.tsx)
   while replacing the page content with a recoverable error message.
   Pair with global-error.tsx for catastrophic root failures. */

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Phone } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log to whatever monitoring is configured. In dev this lands in the
    // server terminal; in prod it goes to Vercel's runtime logs.
    console.error('[route-error]', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20 bg-[#030712] text-white">
      <div className="max-w-lg w-full text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.45)' }}>
          <AlertTriangle className="w-7 h-7 text-red-400"/>
        </div>

        <p className="text-red-400 text-xs font-bold uppercase tracking-[0.22em] mb-4">Something broke</p>
        <h1 className="font-display text-3xl md:text-5xl text-white tracking-tight leading-tight mb-4">
          That page hit a snag.
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed mb-2">
          Our end, not yours. We&apos;ve logged it and will fix it.
        </p>
        {error?.digest && (
          <p className="text-gray-600 text-xs font-mono mt-2 mb-6">Error reference: {error.digest}</p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <button onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-600/20">
            <RefreshCw className="w-4 h-4"/> Try again
          </button>
          <Link href="/"
            className="inline-flex items-center justify-center gap-2 text-white border border-white/15 hover:border-white/40 hover:bg-white/[0.04] px-7 py-3.5 rounded-full font-bold text-sm transition-colors">
            <Home className="w-4 h-4"/> Go home
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-10">
          Need help right now?{' '}
          <a href="tel:+15809191386" className="text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1">
            <Phone className="w-3.5 h-3.5"/> (580) 919-1386
          </a>
        </p>
      </div>
    </div>
  );
}
