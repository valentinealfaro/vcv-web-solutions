/* Static evergreen guide content for /guides and /guides/[slug].
   Each entry is server-rendered for SEO. Add new entries here — no DB. */

export interface Guide {
  slug:        string;
  title:       string;
  description: string;          // meta description + index excerpt
  publishedAt: string;          // ISO date — used for Article schema
  updatedAt:   string;
  readingTime: string;          // "6 min read"
  category:    'Local SEO' | 'Lead Generation' | 'Web Design' | 'Measurement' | 'Pricing' | 'Conversion';
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

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'how-much-does-a-small-business-website-cost-2026',
    title:       'How Much Does a Small Business Website Actually Cost in 2026?',
    description: 'Real numbers across DIY, freelancer, agency, and template-based builds. What you get at each price point — and what you really pay over 5 years.',
    publishedAt: '2026-05-12',
    updatedAt:   '2026-05-17',
    readingTime: '8 min read',
    category:    'Pricing',
    takeaways: [
      'A real lead-generating website costs $1,500–$15,000 to build, plus $20–$200/month ongoing.',
      'The cheapest option ($0 DIY) usually costs the most in lost leads — every month a bad site is up is revenue out the door.',
      'Lifetime / one-time pricing exists and can save $5,000+ over 5 years for businesses that plan to stick around.',
    ],
    sections: [
      { heading: 'The short answer',
        paragraphs: [
          'For a real lead-generating website, expect to pay somewhere between $1,500 and $15,000 to build, plus $20–$200/month for hosting and updates. The huge spread is because "website" can mean very different things — from a free Wix template to a full custom build by an agency.',
          'The honest framing: ask not "how much does a website cost" but "how much is each lead worth to me, and which option will produce the most leads per dollar over 12 months?"',
        ] },
      { heading: 'Tier 1 — DIY ($0–$50/mo)',
        paragraphs: [
          'Wix, Squarespace, GoDaddy templates. Free to start, $15–$50/month after the trial. You do all the work — picking a theme, writing copy, taking photos, configuring SEO.',
          'What you get: a website that exists. What you don\'t get: lead generation. These platforms are built for vanity sites (portfolios, restaurants showing menus) — not high-intent local search where you compete with dozens of similar businesses.',
          'Real cost: 20–40 hours of your time (worth $50/hr = $1,000–$2,000) plus the lost revenue from a site that doesn\'t convert. Most owners abandon them within a year.',
        ] },
      { heading: 'Tier 2 — Freelancer ($500–$3,000 one-time)',
        paragraphs: [
          'A solo designer or developer on Upwork, Fiverr, or local recommendation. Quality varies wildly. Some are exceptional and run their own businesses. Others are college kids with one Squarespace tutorial under their belt.',
          'What you get: usually a better looking site than DIY. What you don\'t always get: conversion design, SEO setup, ongoing support. Most freelancers ship and ghost.',
          'Real cost: $500–$3,000 plus the risk of getting a site you can\'t edit and a developer who won\'t answer calls 6 months later.',
        ] },
      { heading: 'Tier 3 — Local agency ($5,000–$25,000)',
        paragraphs: [
          'A traditional agency with a team. Often 3–6 month timelines, monthly retainers for updates ($500–$2,500/mo), and beautiful sites.',
          'What you get: polish, project management, real SEO setup, professional photography sometimes included.',
          'What you pay for: their overhead. The actual work is usually a similar designer + developer combo doing what a freelancer does, just billed at 3–5x the rate.',
        ] },
      { heading: 'Tier 4 — Template-driven specialist ($1,000–$5,000)',
        paragraphs: [
          'A new category: specialists who pre-built conversion-tested templates for specific industries (roofers, dentists, etc.) and customize them for each client. Launch in 3–7 days at a fraction of agency cost.',
          'What you get: a real lead-generating site that\'s been tested across dozens of similar businesses. SEO baked in. Mobile-first. Pricing transparent.',
          'What you give up: total custom uniqueness. If you want a one-of-a-kind brand experience, this isn\'t it. If you want phones ringing, this is the best ROI on the market right now.',
        ] },
      { heading: 'Ongoing costs nobody warns you about',
        paragraphs: [
          'Domain registration: $12–$30/year. Some agencies bill $200+ for "managing" this. Don\'t pay it.',
          'Hosting: $0 (Vercel/Netlify free tier) to $30/month (managed WordPress).',
          'SSL certificate: free with any modern host. Anyone charging you for this is taking advantage.',
          'Updates and content changes: typically $50–$200/month with an agency. With templates, often included.',
          'SEO maintenance: $300–$2,000/month if you hire it out. Most small businesses don\'t need monthly SEO — they need someone to set it up correctly once.',
        ] },
      { heading: 'The lifetime vs. recurring tradeoff',
        paragraphs: [
          'Recurring ($50–$200/month forever): low upfront, but $1,200–$2,400/year, every year. Over 5 years: $6,000–$12,000.',
          'Lifetime / one-time payment ($1,500–$5,000 once): higher upfront, but no recurring monthly fee. Over 5 years: only the original payment plus maybe $300/year hosting.',
          'For businesses that plan to be around 5+ years, the lifetime option saves significant money. The catch: it\'s rare. Most agencies prefer the recurring model because predictable revenue beats lump sums for them.',
        ] },
      { heading: 'What you should actually pay',
        paragraphs: [
          'If you can do everything yourself and your industry isn\'t competitive: DIY ($0–$50/mo).',
          'If you have $500–$2,000 and need something better than DIY: hire a freelancer with strong reviews in your industry.',
          'If you have $1,500–$5,000 and want results in under a week: a template-driven specialist who has built for your industry before.',
          'If you have $10,000+ and want a fully custom brand experience: a traditional agency, ideally one that will commit to lead-volume outcomes.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'why-your-wix-website-isnt-bringing-leads',
    title:       'Why Your Wix or Squarespace Website Isn\'t Bringing You Leads',
    description: 'The structural reasons template-builder sites underperform in local search. What you can fix on the same platform — and when it\'s time to leave.',
    publishedAt: '2026-05-08',
    updatedAt:   '2026-05-17',
    readingTime: '7 min read',
    category:    'Lead Generation',
    takeaways: [
      'Wix and Squarespace sites rank, but not as competitively as custom builds on the same content.',
      'The biggest miss on template-builder sites is page speed — they\'re 2–3x slower than the lightest competing builds.',
      'You can fix 60% of the problem on the platform. The remaining 40% is structural.',
    ],
    sections: [
      { heading: 'The short version',
        paragraphs: [
          'Wix and Squarespace are good products. They get small businesses online. But on the specific job of "rank my local service business for high-intent buyer searches and convert them into phone calls," they have structural weaknesses that custom-built or template-driven sites don\'t have.',
          'Below: the real reasons, what you can fix today, and what you can\'t fix without leaving the platform.',
        ] },
      { heading: 'Reason 1 — Page speed',
        paragraphs: [
          'Google has made it clear: mobile page speed is a ranking factor. Wix and Squarespace sites typically score 50–70 on Google\'s PageSpeed Insights mobile test. Custom sites built with modern frameworks routinely score 95+.',
          'A 3-second-slower site gets 20% fewer leads, all else equal. Compounded over a year, that\'s significant revenue.',
          'Why it\'s hard to fix: these platforms ship a lot of JavaScript and CSS to make their drag-and-drop builder work in your browser. You can\'t remove it.',
        ] },
      { heading: 'Reason 2 — Generic template signals',
        paragraphs: [
          'Wix and Squarespace ship templates used by millions of sites. Google can recognize the underlying template patterns. They don\'t penalize for this directly, but a unique site structure with custom schema markup signals "real business that takes itself seriously" more strongly than "default Squarespace skin."',
          'You can mitigate this by writing genuinely unique copy and adding real photos. But the underlying HTML still looks like every other template-builder site.',
        ] },
      { heading: 'Reason 3 — Forms that don\'t track',
        paragraphs: [
          'Most template-builder forms don\'t fire conversion events to GA4 by default. So even if your site is producing leads, you can\'t prove it to yourself — let alone attribute leads to ad spend or specific landing pages.',
          'You can fix this by manually editing form-submission code, but most owners never do, which means they can\'t optimize what they can\'t measure.',
        ] },
      { heading: 'Reason 4 — Local SEO setup is shallow',
        paragraphs: [
          'A well-built local-services website includes schema markup (LocalBusiness, AggregateRating, Service), city-specific landing pages if you cover multiple areas, and structured FAQ data. Template builders include some of this, but rarely complete.',
          'The result: in head-to-head comparisons of the same business with the same content, sites with full schema outrank template-builder sites for "[service] near me" queries.',
        ] },
      { heading: 'What you can fix on the platform',
        paragraphs: [
          'Speed: enable image lazy-loading and compression. Delete plugins you don\'t use. Don\'t auto-play videos.',
          'Conversion: make your phone number a tappable `tel:` link in the header. Shorten your contact form to 3 fields. Add a clear call-to-action above the fold.',
          'Tracking: install Google Analytics 4 properly and set up conversion events for form submissions and phone clicks.',
          'Content: rewrite your homepage in the first person as the owner, with specific city mentions and the exact services you do.',
        ] },
      { heading: 'When it\'s time to leave the platform',
        paragraphs: [
          'You\'ve done the above and still get fewer than 5 qualified leads/month while spending money on ads.',
          'Your mobile PageSpeed score is below 70 and you can\'t move it.',
          'You compete in a saturated local market where the top-ranking results are all custom builds.',
          'You want lifetime pricing instead of paying $30/month forever for a site that doesn\'t bring in leads.',
        ] },
      { heading: 'The honest tradeoff',
        paragraphs: [
          'Template builders are great for getting started, businesses that don\'t depend on web traffic for leads, or owners who genuinely enjoy fiddling with site design as a hobby. For owners whose phone needs to ring, a purpose-built site usually pays for itself within 3–6 months.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'google-business-profile-setup-for-contractors',
    title:       'Google Business Profile Setup Guide for Contractors and Local Service Pros',
    description: 'A step-by-step setup walkthrough of the single highest-leverage thing you can do for local SEO. Every category, every field, every photo — explained.',
    publishedAt: '2026-05-04',
    updatedAt:   '2026-05-17',
    readingTime: '9 min read',
    category:    'Local SEO',
    takeaways: [
      'Google Business Profile drives ~80% of local search visibility before your website is even crawled.',
      'Choosing the right primary category is the single biggest decision you make on the profile.',
      'Profiles with 10+ recent photos get 35% more click-throughs than profiles with stock photos or fewer than 5.',
    ],
    sections: [
      { heading: 'Why this matters more than your website',
        paragraphs: [
          'When someone searches "plumber near me" on Google, the first thing they see is the Map Pack: three Google Business Profiles in a box with a small map. Your website is below that. If you\'re not in the Map Pack, you\'re competing for scraps.',
          'Getting into the Map Pack is 80% the Business Profile and 20% other factors. The Business Profile is the highest-leverage thing you can do for local search, and most owners do it badly.',
        ] },
      { heading: 'Step 1 — Claim and verify the profile',
        paragraphs: [
          'Go to google.com/business and sign in with the Google account you want to manage from. Search for your business name. If it exists, click "Manage now" — you may need to verify ownership via postcard, phone call, or video.',
          'Verification takes 5–14 days. Until verified, your profile may show up but won\'t rank competitively. Do this before anything else.',
          'If your business has multiple locations, verify each one separately. There is no shortcut.',
        ] },
      { heading: 'Step 2 — Pick the right primary category',
        paragraphs: [
          'This is the single most important decision on the profile. Google uses your primary category to decide which searches you can match.',
          'Be specific: "Roofing Contractor" beats "Contractor." "Pediatric Dentist" beats "Dentist." Search for [your service] in Google Maps and look at which categories the top-ranking competitors have — match the most successful ones.',
          'Add secondary categories that genuinely apply. Up to 9 are allowed. Don\'t add categories that aren\'t real services you offer — Google has gotten very good at catching this and demoting profiles for it.',
        ] },
      { heading: 'Step 3 — Service area vs. address',
        paragraphs: [
          'If customers come to your physical location (a retail store, a salon, a clinic): list the full address, hours, and don\'t set service areas.',
          'If you go to customers (plumber, roofer, electrician, contractor): hide your address and set service areas instead. List the specific cities you serve, not generic regions.',
          'Mixed (a roofing company with a small showroom): use the address but also list service areas. Be honest — Google checks.',
        ] },
      { heading: 'Step 4 — Hours, attributes, services',
        paragraphs: [
          'Hours: match what you actually do. 24/7 emergency? Mark it. Closed Sundays? Mark it. Wrong hours kill calls — there\'s nothing worse than a customer driving over to find you closed.',
          'Attributes: every applicable one. Female-owned, veteran-owned, family-run, online appointments, free estimates. These show as badges and influence whether searchers click your listing vs. a competitor\'s.',
          'Services: add every individual service with a short description. "Roof Repair", "Asphalt Shingle Installation", "Storm Damage Assessment" — each gets its own entry. This adds keyword density without spam.',
        ] },
      { heading: 'Step 5 — Photos',
        paragraphs: [
          'Profiles with 10+ recent photos get 35% more click-throughs. Add photos of: completed jobs, your team, your trucks/equipment, the office or showroom, and yourself (the owner).',
          'Real phone-camera photos beat professional stock every time. Authenticity is the signal.',
          'Add new photos every 1–2 weeks. Google rewards active profiles. A profile that hasn\'t been updated in 6 months looks abandoned.',
        ] },
      { heading: 'Step 6 — Reviews and replies',
        paragraphs: [
          'Reviews are the prominence signal. Ask every customer for one — the same week the job finishes. Text them a direct review link, not "search for us on Google."',
          'Reply to every review within 48 hours. Yes, even the good ones. Especially the bad ones. Replies tell Google you\'re engaged and tell future customers how you handle criticism.',
          'Never buy fake reviews. Google catches these and the penalty is severe — sometimes a permanent profile suspension.',
        ] },
      { heading: 'Step 7 — Posts and updates',
        paragraphs: [
          'The "Posts" section of your profile is underused. Post 1–2 short updates per week: a recent job photo, a seasonal promo, a customer thank-you. Posts expire after 7 days unless you mark them as evergreen.',
          'Frequent posting is a freshness signal that helps your overall ranking.',
        ] },
      { heading: 'What to track',
        paragraphs: [
          'Google Business Profile gives you Insights: how many searches found your profile, how many drove calls, how many drove direction requests. These are the metrics that matter for local search ROI.',
          'Track them month over month. Calls should trend up. If they don\'t, something on your profile or in your local competitive set has changed and needs investigation.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'how-to-get-more-phone-calls-from-your-website',
    title:       'How to Get More Phone Calls From Your Website (Without More Traffic)',
    description: 'The conversion playbook for service businesses. Same visitors, more calls — by fixing what stops people from picking up the phone.',
    publishedAt: '2026-04-28',
    updatedAt:   '2026-05-17',
    readingTime: '6 min read',
    category:    'Conversion',
    takeaways: [
      'Most service-business websites have a 1–2% call rate. A well-tuned one hits 5–8%.',
      'The single biggest improvement is moving your phone number into the top-right of the header on every page.',
      'Click-to-call links convert 3x better than displayed phone numbers on mobile — they\'re different things.',
    ],
    sections: [
      { heading: 'Why call-rate matters more than traffic',
        paragraphs: [
          'Traffic is hard and expensive to increase. Conversion rate is fast and cheap. Doubling your call rate from 2% to 4% has the same effect as doubling your traffic, but you can do it in an afternoon.',
          'Below are the 8 things that move call rate the most, in order of impact.',
        ] },
      { heading: '1. Phone number top-right of the header',
        paragraphs: [
          'On every page. Big enough to read on a phone. Tappable as a `tel:` link.',
          'This sounds obvious. Most service-business sites bury the phone number in the footer or hide it behind a "Contact" page. Every step between intent and dialing kills conversion.',
        ] },
      { heading: '2. Phone number on the contact button',
        paragraphs: [
          'Instead of a generic "Contact Us" button in the navigation, make it a phone link: "Call (555) 123-4567" with a phone icon. Even better: two buttons — "Get a Quote" (form) and "Call Now" (phone).',
          'Different visitors want different actions. Give them both.',
        ] },
      { heading: '3. Click-to-call on mobile',
        paragraphs: [
          'A `tel:` HTML link triggers the dialer on mobile when tapped. Without it, the visitor has to remember (or copy) the number and switch apps. Half don\'t bother.',
          'Bonus: track click events on phone links in GA4. You\'ll see exactly how many mobile visitors tried to call vs. how many filled out a form.',
        ] },
      { heading: '4. Show, don\'t bury, hours and service area',
        paragraphs: [
          'A visitor who can\'t tell if you serve their city or if you\'re open right now will hesitate. Hesitation kills calls.',
          'Show service area on the homepage. Show hours, ideally with "Open now" status. If you offer 24/7 emergency, scream it.',
        ] },
      { heading: '5. The first 5 seconds of the homepage',
        paragraphs: [
          'Above the fold needs to answer three questions instantly: what do you do, where do you do it, how do I reach you.',
          'If a visitor has to scroll to find any of these, conversion drops.',
        ] },
      { heading: '6. Trust signals near the CTA',
        paragraphs: [
          '★★★★★ rating, number of reviews, years in business, license number, BBB rating, insurance — whichever applies to your industry. Place these near the phone number and contact form, not buried at the bottom.',
          'A visitor who is about to call wants one last bit of reassurance that you\'re real and good. Give it to them in their line of sight.',
        ] },
      { heading: '7. Reduce form friction',
        paragraphs: [
          'Most service-business forms are too long. Name, phone, what you need. That\'s it. Address, email, preferred contact time, how-did-you-hear — all of these reduce submission rate.',
          'You can ask for everything else after they\'ve already raised their hand.',
        ] },
      { heading: '8. A "what happens next" line under the form',
        paragraphs: [
          'Below the submit button: "We\'ll text you within 1 hour with a quote." Sets the expectation, reduces anxiety about whether you\'ll actually respond.',
          'If you\'re going to take 24 hours, say 24 hours. Don\'t over-promise — but do promise something specific.',
        ] },
      { heading: 'The honest math',
        paragraphs: [
          'If your site gets 500 visitors a month and converts at 2%, that\'s 10 calls. Doubling to 4% means 20 calls. Doubling again to 8% means 40 calls. Same traffic, 4x revenue.',
          'Most of these changes take an afternoon. The lift is measurable within 30 days.',
        ] },
    ],
  },

  /* ────────────────────────────────────────────────────────────── */
  {
    slug:        'mobile-first-design-for-local-service-businesses',
    title:       'Mobile-First Design: Why It Matters Most for Local Service Businesses',
    description: 'Over 70% of "near me" searches happen on phones. Here is what mobile-first design actually means — and why it disproportionately affects service-business leads.',
    publishedAt: '2026-04-15',
    updatedAt:   '2026-05-17',
    readingTime: '6 min read',
    category:    'Web Design',
    takeaways: [
      '70%+ of local-service searches happen on mobile. Your mobile site is your real site.',
      'Mobile-first means designing for the phone first, then adapting up — not designing for desktop and shrinking down.',
      'Three things matter most on mobile: speed, tap targets, and a phone number in the header.',
    ],
    sections: [
      { heading: 'The numbers behind the term',
        paragraphs: [
          'Google now indexes the mobile version of your website by default — that\'s what "mobile-first indexing" means. The mobile site is what Google ranks. Your desktop site is the afterthought.',
          'For local service businesses, the mobile bias is even stronger: 70%+ of "near me" searches happen on phones. A homeowner whose pipe just burst is not pulling out a laptop.',
        ] },
      { heading: 'What "mobile-first" actually means',
        paragraphs: [
          'Mobile-first is not "we made sure the desktop site works on a phone." That\'s mobile-responsive — different thing.',
          'Mobile-first means: start with a 375-pixel-wide phone screen as the primary canvas. Design the most important version of every element for that size. Then expand for tablet and desktop. The phone version isn\'t a downgrade; it\'s the original.',
          'Sites built mobile-first feel right on a phone and look fine on desktop. Sites built desktop-first feel cramped and broken on a phone, no matter how good they look on a laptop.',
        ] },
      { heading: 'Speed: the biggest mobile factor',
        paragraphs: [
          'A 1-second delay in mobile page load drops conversions by 20%. Two seconds drops them by 35%. A 5-second load on a 4G connection is the difference between a customer and a lost lead.',
          'How to measure: Google PageSpeed Insights, choose "Mobile" tab. You want a score of 85+. Anything below 70 is hurting conversions every day.',
          'How to fix: compress images, lazy-load below-the-fold content, minimize third-party scripts (chat widgets, analytics, ad pixels), and use a modern hosting setup (Vercel, Netlify, Cloudflare).',
        ] },
      { heading: 'Tap targets and thumb zones',
        paragraphs: [
          'Buttons should be at least 44 × 44 pixels (Apple\'s human interface guideline). Smaller and people miss them, get frustrated, and bounce.',
          'Phone numbers and CTAs should sit in the "thumb zone" — the lower half of the screen where most users\' thumbs naturally rest while holding a phone one-handed. A "Call Now" button at the very top of a tall hero section is harder to tap than one near the bottom or sticky to the screen.',
        ] },
      { heading: 'Sticky bottom navigation for service sites',
        paragraphs: [
          'On a service business mobile site, consider a sticky bottom bar with two buttons: "Call" and "Get Quote." It stays visible while the visitor scrolls. They\'re never more than one tap from the conversion action.',
          'This single change typically lifts mobile conversion by 15–25%.',
        ] },
      { heading: 'Forms: shorter, smarter',
        paragraphs: [
          'Mobile keyboards make typing slow. Every field is a cost. Three-field forms (name, phone, message) outperform five-field forms (add email + preferred time) by 30–60% on mobile.',
          'Use the right input types: `type="tel"` brings up the number pad, `type="email"` shows the @ symbol. Saves taps. Adds up.',
        ] },
      { heading: 'What kills mobile conversions',
        paragraphs: [
          'Pop-ups that fire on page load. Google penalizes these on mobile and most users tap-close without reading.',
          'Hover-only menus or interactions. Mobile doesn\'t have hover. If important content is hidden behind hover, it\'s effectively invisible to most visitors.',
          'Tiny text. The default mobile font size should be 16px+. Smaller and people zoom — and zooming breaks layouts.',
          'Horizontal scrolling. Almost always a sign that the site wasn\'t built mobile-first. Fix this before anything else.',
        ] },
      { heading: 'The honest test',
        paragraphs: [
          'Open your website on your phone, on cellular (not Wi-Fi). Time how long it takes to load. Try to find your phone number without scrolling. Try to submit the contact form one-handed.',
          'If any of those are awkward, you have an opportunity to fix something that\'s probably costing you leads every day.',
        ] },
    ],
  },
];

export function findGuide(slug: string): Guide | undefined {
  return GUIDES.find(g => g.slug === slug);
}
