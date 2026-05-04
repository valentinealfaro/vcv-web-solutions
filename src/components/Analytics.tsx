'use client';
import Script from 'next/script';

/* ─── Tracking IDs ───────────────────────────────────────────────
   Defaults are hardcoded here so the site tracks out of the box.
   Override in Vercel → Project → Settings → Environment Variables
   if you ever rotate or split traffic to a new property:
     NEXT_PUBLIC_GA_ID         = G-XXXXXXXXXX
     NEXT_PUBLIC_META_PIXEL_ID = 123456789012345
     NEXT_PUBLIC_CLARITY_ID    = abc123xyz
─────────────────────────────────────────────────────────────────── */
const GA_ID       = process.env.NEXT_PUBLIC_GA_ID         || 'G-WBPG8KFMP6';
const META_ID     = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1669902044129893';
const CLARITY_ID  = process.env.NEXT_PUBLIC_CLARITY_ID    || 'wlu49ethr7';

export const Analytics = () => (
  <>
    {/* ─── Google Analytics 4 ─── */}
    {GA_ID && (
      <>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            window.gtag = gtag;
          `}
        </Script>
      </>
    )}

    {/* ─── Meta / Facebook Pixel ─── */}
    {META_ID && (
      <>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_ID}');
            fbq('track', 'PageView');
          `}
        </Script>
        {/* No-JS fallback pixel */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1" width="1" style={{ display: 'none' }} alt=""
            src={`https://www.facebook.com/tr?id=${META_ID}&ev=PageView&noscript=1`}
          />
        </noscript>
      </>
    )}

    {/* ─── Microsoft Clarity (free heatmaps + session recordings) ─── */}
    {CLARITY_ID && (
      <Script id="clarity-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}
      </Script>
    )}
  </>
);

/* ─── Helper to fire conversion events from anywhere on the site ── */
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gtag?: (...args: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fbq?: (...args: any[]) => void;
  }
}

export const trackPurchase = (value: number, productName: string) => {
  if (typeof window === 'undefined') return;
  // GA4 purchase event
  window.gtag?.('event', 'purchase', {
    value,
    currency: 'USD',
    items: [{ item_name: productName, price: value, quantity: 1 }],
  });
  // Meta Pixel purchase event
  window.fbq?.('track', 'Purchase', {
    value,
    currency: 'USD',
    content_name: productName,
  });
};

export const trackLead = (source: string) => {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'generate_lead', { source });
  window.fbq?.('track', 'Lead', { source });
};

export const trackInitiateCheckout = (value: number, productName: string) => {
  if (typeof window === 'undefined') return;
  window.gtag?.('event', 'begin_checkout', {
    value,
    currency: 'USD',
    items: [{ item_name: productName, price: value, quantity: 1 }],
  });
  window.fbq?.('track', 'InitiateCheckout', {
    value,
    currency: 'USD',
    content_name: productName,
  });
};
