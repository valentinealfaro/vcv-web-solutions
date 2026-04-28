import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/portfolio', destination: '/', permanent: false },
      { source: '/blog',      destination: '/', permanent: false },
      { source: '/blog/:slug',destination: '/', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
