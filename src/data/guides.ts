/* Static evergreen guide content for /guides and /guides/[slug].
   Each entry is server-rendered for SEO. Add new entries here — no DB. */

export interface Guide {
  slug:        string;
  title:       string;
  description: string;          // meta description + index excerpt
  publishedAt: string;          // ISO date — used for Article schema
  updatedAt:   string;
  readingTime: string;          // "6 min read"
  category:    'Local SEO' | 'Lead Generation' | 'Web Design' | 'Measurement';
  /* Body sections — each renders as <h2> + paragraphs. Keeping the
     shape simple so it's easy to add posts later without a CMS. */
  sections: { heading: string; paragraphs: string[] }[];
  /* Two or three "key takeaways" surfaced above the fold + in schema. */
  takeaways: string[];
}

export const GUIDES: Guide[] = [

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'local-seo-for-small-service-businesses',
    title:       'How Local SEO Actually Works for Small Service Businesses',
    description: 'A practical guide to ranking on Google for "[your service] near me" searches. What actually moves the needle in 2026 — and what is just noise.',
    publishedAt: '2026-04-10',
    updatedAt:   '2026-05-17',
    readingTime: '7 min read',
    category:    'Local SEO',
    takeaways: [
      'Your Google Business Profile is more important than your website for local rankings — fix it first.',
      'Reviews are the single biggest lever. Aim for 5+ new ones per month from real customers.',
      'Page-speed on mobile is now a ranking factor. Sites that load in under 2 seconds win.',
    ],
    sections: [
      { heading: 'The short answer',
        paragraphs: [
          'When a homeowner Googles "plumber near me" or "roofer in Tulsa," Google decides who shows up by looking at three signals: relevance (does this business actually do what was searched?), distance (how close is it?), and prominence (how well-known is this business based on reviews, links, and history?).',
          'You cannot change distance. You can change everything else.',
        ] },
      { heading: 'Step 1 — Your Google Business Profile is the foundation',
        paragraphs: [
          'Most local-services owners think "SEO" means their website. For local search, it does not. The Google Business Profile — the box that shows up next to the map — drives roughly 80% of local rankings before your website even matters.',
          'Claim it. Verify it. Pick the right category (the most specific one that matches what you actually do — "roofing contractor" beats "contractor"). Add real photos. Set hours. Add services. Respond to every review within 48 hours, even the good ones.',
        ] },
      { heading: 'Step 2 — Reviews are the prominence signal',
        paragraphs: [
          'Google gives heavier weight to profiles that get fresh reviews consistently than to old profiles with more total reviews. A business with 47 reviews and 5 in the last 30 days will outrank one with 200 reviews and zero in the last year.',
          'Ask every customer for a review the same week the job finishes. Text a direct review link. Most people will not search for your business to leave one — they need a link.',
        ] },
      { heading: 'Step 3 — Your website still matters',
        paragraphs: [
          'After Google Business Profile and reviews, your website is the third pillar. Specifically: page speed, mobile-friendliness, structured data (schema.org), and city-specific landing pages if you serve multiple areas.',
          'A fast, well-structured website tells Google your business is legitimate and that you take it seriously. A slow Wix template tells the opposite story.',
        ] },
      { heading: 'What does not move the needle in 2026',
        paragraphs: [
          'Stuffing your homepage with "best plumber in [city]" repeated 40 times. Google detects this and demotes you.',
          'Buying backlinks. Risk of a manual penalty far outweighs the lift.',
          'Submitting to 200 random directories. The handful that matter (Google, Bing, Yelp, Apple Maps, BBB, your industry association) cover 99% of the value.',
        ] },
      { heading: 'The honest priority order',
        paragraphs: [
          '1. Claim and complete Google Business Profile.',
          '2. Build a real review-gathering habit (text your last 50 customers).',
          '3. Get a website that loads fast on mobile and has structured data.',
          '4. Add service-area pages if you cover multiple cities.',
          '5. Everything else.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'how-to-measure-if-your-website-makes-you-money',
    title:       'How to Tell If Your Website is Actually Making You Money',
    description: 'A no-fluff guide to measuring website ROI as a small business owner. What to track, what to ignore, and how to know your site is paying for itself.',
    publishedAt: '2026-04-22',
    updatedAt:   '2026-05-17',
    readingTime: '5 min read',
    category:    'Measurement',
    takeaways: [
      'Track three numbers: leads per month, cost per lead, and closing rate.',
      'A "lead" is a form submission, a phone call, or a click-to-text — every one of those is countable.',
      'Without UTM tracking on your ads, you cannot tell which channel is producing leads.',
    ],
    sections: [
      { heading: 'The only three numbers that matter',
        paragraphs: [
          'Most small business owners look at website "traffic" and assume more visitors means more money. It does not. A website with 100 visits a month and 12 booked jobs is better than one with 10,000 visits and zero calls.',
          'Track these three numbers and you will know exactly where you stand:',
          '1. Leads per month — every form submission, phone call from the site, or click-to-text.',
          '2. Cost per lead — money spent (hosting, ads, fees) divided by total leads.',
          '3. Closing rate — what percent of leads turn into paying customers.',
        ] },
      { heading: 'How to actually capture each one',
        paragraphs: [
          'Form submissions: install Google Analytics 4 and set up a "form_submit" event. Most modern websites do this automatically; if yours does not, that is the first thing to fix.',
          'Phone calls: use a click-to-call link on your site (`tel:` link), then set up a "phone_click" event in GA4. For phone numbers, you can also use a call-tracking number that forwards to your main line.',
          'Click-to-text: same idea but with an `sms:` link.',
        ] },
      { heading: 'Why UTM parameters matter',
        paragraphs: [
          'If you spend $500 on Google Ads and $500 on Facebook Ads but cannot tell which one drove your 14 leads, you have no way to know where to spend the next $1,000. UTM parameters fix this.',
          'A URL like example.com/?utm_source=google&utm_medium=cpc&utm_campaign=spring2026 tells your analytics system exactly which campaign sent each visitor. When that visitor fills out a form, you can attribute the lead — and eventually the revenue — back to that ad spend.',
        ] },
      { heading: 'What to ignore',
        paragraphs: [
          'Page views, bounce rate, average session duration. These are vanity metrics that do not correlate with revenue for a small service business.',
          'Search rankings as a primary goal. Rankings only matter as a means to leads. If you rank #1 but get no calls, the ranking is worthless.',
          'Anyone selling you SEO with no commitment to a lead-volume target. Real partners attach themselves to outcomes.',
        ] },
      { heading: 'The simplest dashboard',
        paragraphs: [
          'Every month, write down: leads received, cost spent (everything), revenue closed from those leads. Track three months and you will have your real ROI. A 3:1 revenue:spend ratio is healthy for most service businesses; 5:1 or better and you should be spending more.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'what-a-good-service-business-website-actually-needs',
    title:       'What a Service-Business Website Actually Needs in 2026',
    description: 'Forget the design awards. Here is the practical list of things your small-business website needs to have to generate calls — and what is optional.',
    publishedAt: '2026-05-01',
    updatedAt:   '2026-05-17',
    readingTime: '6 min read',
    category:    'Web Design',
    takeaways: [
      'Above the fold: what you do, where you do it, and how to reach you. Everything else is optional.',
      'A fast mobile site beats a beautiful slow site every time.',
      'Real photos beat stock photos by a wide margin — even from a phone camera.',
    ],
    sections: [
      { heading: 'Must-haves',
        paragraphs: [
          'A clear value proposition in the first 5 seconds: "Plumber in Lawton, OK — emergency service available 24/7."',
          'A phone number in the header, on every page, click-to-call on mobile.',
          'Service area listed somewhere obvious. Customers want to know if you cover their address.',
          'A simple contact form. Three fields max: name, phone, what you need. Every extra field cuts conversion by ~5%.',
          'Real photos of your work. Stock photos signal "template site I bought." Phone-camera photos of completed jobs signal "real local business."',
          'A short list of services with brief descriptions. People skim — long pages of marketing copy do not help.',
        ] },
      { heading: 'Should-haves',
        paragraphs: [
          'Reviews or testimonials with first names + city. Not stock-photo headshots.',
          'About page with the owner\'s actual name and a real photo. People hire other people, not faceless brands.',
          'FAQ section answering the 5 questions every customer asks before calling.',
          'Service-area pages if you cover multiple cities — each gets its own page mentioning the city by name.',
        ] },
      { heading: 'Optional',
        paragraphs: [
          'Blog. Useful for long-term SEO, but skip it until the core site is converting.',
          'Online booking. Great for some industries (salons, dentists, vehicle service), unnecessary for others (roofing, plumbing emergencies).',
          'Live chat. Sometimes converts well, sometimes a distraction. Test it.',
          'Multi-language. Only if your actual customer base needs it.',
        ] },
      { heading: 'Avoid',
        paragraphs: [
          'Auto-playing videos with sound. Annoying, hurts speed, drives bounces.',
          'Pop-ups that fire on page load. Google penalizes them on mobile and most users close them without reading.',
          'Generic stock photos of suit-and-tie executives shaking hands. Customers do not believe them.',
          'Long forms. Anything beyond 4 fields cuts submission rate dramatically.',
        ] },
      { heading: 'The honest test',
        paragraphs: [
          'Open your website on your phone. Can you find your phone number in under 3 seconds? Does the page load before the spinner stops? Does it look professional or does it look like it was built in 2016?',
          'If any of those answers are wrong, that is what you fix first. The rest is decoration.',
        ] },
      { heading: 'Bottom line',
        paragraphs: [
          'A great service-business website is fast, clear, and easy to contact. It tells the visitor what you do, where you do it, and exactly how to reach you. Everything else is gravy.',
        ] },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}
