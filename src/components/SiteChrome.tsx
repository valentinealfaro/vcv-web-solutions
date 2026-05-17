'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';
import { captureFirstTouch } from '@/lib/attribution';

/* Strips VCV-branded global chrome on /templates/* routes so industry
   template previews look like real client websites, not VCV pages. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  const isStandalone = path.startsWith('/templates/');

  /* Capture UTM / click-id parameters once per session so lead forms can attribute
     every conversion back to its marketing channel. Safe no-op without UTMs. */
  useEffect(() => { captureFirstTouch(); }, []);

  if (isStandalone) {
    return <main id="main-content">{children}</main>;
  }

  return (
    <>
      {/* Skip to main content — visible only when focused via keyboard.
          Accessibility win: keyboard / screen-reader users can bypass the nav. */}
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[10001] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-full focus:font-bold focus:text-sm focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
      <MobileStickyBar />
      <ThemeSwitcher />
      <ExitIntentPopup />
    </>
  );
}
