import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* ─── Permanent redirects ────────────────────────────────────────
     /portfolio → home (legacy URL), /blog → /guides (we moved content
     to the static /guides routes for better SEO). */
  async redirects() {
    return [
      { source: '/portfolio',  destination: '/',       permanent: false },
      { source: '/blog',       destination: '/guides', permanent: true  },
      { source: '/blog/:slug', destination: '/guides', permanent: true  },
    ];
  },

  /* ─── Security response headers ─────────────────────────────────
     Sent on every route. These are production-grade signals — the
     same headers SaaS companies + banks ship. They protect against
     clickjacking (X-Frame-Options), MIME sniffing (X-Content-Type-
     Options), and force HTTPS forever (Strict-Transport-Security).
     We don't ship a full CSP because the existing site uses inline
     event handlers + analytics scripts that would all need nonces;
     can be added later when those are refactored. */
  async headers() {
    const securityHeaders = [
      // Force HTTPS for 2 years on this domain + every subdomain
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      // Block this site from being iframed by anyone else (clickjacking)
      { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
      // Don't let browsers MIME-sniff and override our Content-Type
      { key: 'X-Content-Type-Options',    value: 'nosniff' },
      // Modern referrer policy — keeps full URL on same-origin, only
      // origin on cross-origin so partner sites don't see UTM params.
      { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
      // Lock down browser feature access — we don't use camera, mic,
      // payment, geolocation, etc. Reduces attack surface.
      { key: 'Permissions-Policy',        value: 'camera=(), microphone=(), geolocation=(), payment=(self), interest-cohort=()' },
      // X-DNS-Prefetch-Control — let the browser preemptively resolve
      // DNS for third-party assets we link to.
      { key: 'X-DNS-Prefetch-Control',    value: 'on' },
    ];

    return [
      { source: '/:path*', headers: securityHeaders },
    ];
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
    ],
  },

  /* Bundle hygiene — strip console.* in production builds but keep
     error/warn so real issues still log in monitoring. */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
      ? { exclude: ['error', 'warn'] }
      : false,
  },

  /* Send 404/500 responses without revealing the Next.js + version
     in the X-Powered-By header — small attack-surface trim. */
  poweredByHeader: false,
};

export default nextConfig;
