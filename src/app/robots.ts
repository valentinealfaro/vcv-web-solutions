import type { MetadataRoute } from 'next';

const SITE_URL = 'https://www.vcvwebsolutions.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      /* Default: full crawl access except admin + API + Vercel internals. */
      {
        userAgent: '*',
        allow: ['/', '/templates/', '/ai-receptionist/', '/our-work', '/services', '/pricing', '/contact'],
        disallow: ['/admin/', '/api/', '/_next/', '/success'],
      },
      /* AI / LLM crawlers — explicit allow so AI Overviews / training can index content.
         Comment any out if you want to opt out of a specific bot. */
      { userAgent: 'GPTBot',                 allow: '/' },
      { userAgent: 'OAI-SearchBot',          allow: '/' },
      { userAgent: 'ChatGPT-User',           allow: '/' },
      { userAgent: 'PerplexityBot',          allow: '/' },
      { userAgent: 'ClaudeBot',              allow: '/' },
      { userAgent: 'Anthropic-AI',           allow: '/' },
      { userAgent: 'Google-Extended',        allow: '/' },
      { userAgent: 'CCBot',                  allow: '/' },
      { userAgent: 'Bytespider',             allow: '/' },
      { userAgent: 'Applebot-Extended',      allow: '/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
