import type { MetadataRoute } from 'next';
import { INDUSTRIES } from '@/data/industries';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/services`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/pricing`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/ai-receptionist`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE_URL}/contact`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/free-demo`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/terms`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  /* Industry-specific landing pages — each gets its own sitemap entry for SEO */
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map(i => ({
    url: `${SITE_URL}/ai-receptionist/${i.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  return [...staticPages, ...industryPages];
}
