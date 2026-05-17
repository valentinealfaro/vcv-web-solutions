import type { MetadataRoute } from 'next';

/* Web App Manifest — makes the site installable on iOS / Android home
   screens and turns it into a PWA. Mobile users see an "Install" prompt
   the second time they visit, which is a meaningful premium signal. */
export default function manifest(): MetadataRoute.Manifest {
  const ICON = 'https://firebasestorage.googleapis.com/v0/b/gen-lang-client-0881087059.firebasestorage.app/o/VCV%20Web%20Solutions%2FVCV%20Websolutions%20Logo.png?alt=media&token=aed21397-69ca-4846-a45d-267482b81acf';

  return {
    name:             'VCV Web Solutions',
    short_name:       'VCV',
    description:      'Websites that generate leads. Built in 3–7 days for local service businesses. From $97/mo.',
    start_url:        '/',
    scope:            '/',
    display:          'standalone',
    orientation:      'portrait',
    background_color: '#030712',
    theme_color:      '#030712',
    categories:       ['business', 'productivity', 'design'],
    icons: [
      { src: ICON, sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: ICON, sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: ICON, sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'Free Design Preview', short_name: 'Free Demo', url: '/free-demo' },
      { name: 'Browse Templates',    short_name: 'Templates', url: '/templates' },
      { name: 'See Pricing',         short_name: 'Pricing',   url: '/pricing' },
      { name: 'Contact Us',          short_name: 'Contact',   url: '/contact' },
    ],
  };
}
