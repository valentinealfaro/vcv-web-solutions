import type { MetadataRoute } from 'next';
import { INDUSTRIES } from '@/data/industries';
import { STATES } from '@/data/states';
import { GUIDES } from '@/data/guides';

const SITE_URL = 'https://vcv-web-solutions.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL,                            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${SITE_URL}/services`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/pricing`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/ai-receptionist`,       lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${SITE_URL}/our-work`,              lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${SITE_URL}/contact`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/free-demo`,             lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/reviews`,               lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${SITE_URL}/templates`,             lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${SITE_URL}/how-it-works`,          lastModified: now, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${SITE_URL}/about`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/serving`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guides`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${SITE_URL}/terms`,                 lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];

  /* Industry-specific AI receptionist landing pages */
  const industryPages: MetadataRoute.Sitemap = INDUSTRIES.map(i => ({
    url: `${SITE_URL}/ai-receptionist/${i.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  /* Industry template demo pages — every slug has a live template at /templates/{slug} */
  const templatePages: MetadataRoute.Sitemap = INDUSTRIES.map(i => ({
    url: `${SITE_URL}/templates/${i.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  /* US state-level local-SEO landing pages */
  const statePages: MetadataRoute.Sitemap = STATES.map(s => ({
    url: `${SITE_URL}/serving/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  /* Evergreen guides — Article schema, individually indexable */
  const guidePages: MetadataRoute.Sitemap = GUIDES.map(g => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.65,
  }));

  return [...staticPages, ...industryPages, ...templatePages, ...statePages, ...guidePages];
}
