import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { FloatingCTA } from '@/components/FloatingCTA';
import { CustomCursor } from '@/components/CustomCursor';
import { Phone, MessageCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'VCV Web Solutions — High-Converting Websites for Local Businesses',
  description: 'High-converting websites, SEO, and ad systems designed to grow your business fast. Built in 3–7 days, mobile-ready, SEO-optimized.',
  icons: {
    icon: 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#030712" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://firebasestorage.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap"
        />
      </head>
      <body>
        <CustomCursor />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <FloatingCTA />

        {/* Mobile sticky call/text bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden">
          <a
            href="tel:+15809191386"
            className="flex-1 btn-neon py-4 text-center font-bold text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <a
            href="sms:+15809191386"
            className="flex-1 bg-green-600 hover:bg-green-500 text-white py-4 text-center font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Text Us
          </a>
        </div>
      </body>
    </html>
  );
}
