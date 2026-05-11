'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { MobileStickyBar } from '@/components/MobileStickyBar';
import { ThemeSwitcher } from '@/components/ThemeSwitcher';
import { ExitIntentPopup } from '@/components/ExitIntentPopup';

/* Strips VCV-branded global chrome on /templates/* routes so industry
   template previews look like real client websites, not VCV pages. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname() || '';
  const isStandalone = path.startsWith('/templates/');

  if (isStandalone) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="pb-20 md:pb-0">{children}</main>
      <Footer />
      <FloatingCTA />
      <MobileStickyBar />
      <ThemeSwitcher />
      <ExitIntentPopup />
    </>
  );
}
