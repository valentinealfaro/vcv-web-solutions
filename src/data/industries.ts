/* ─── Industry data for /ai-receptionist/[industry] landing pages ───
   Each entry = a fully fleshed-out, SEO-optimised, industry-specific page.
   Add a new entry → new landing page automatically generates.
─────────────────────────────────────────────────────────────────────── */

export interface IndustryData {
  slug:           string;     // URL slug
  name:           string;     // 'Roofers'
  pluralLabel:    string;     // 'roofing companies'
  emoji:          string;
  color:          string;     // accent

  /* SEO */
  metaTitle:       string;     // ≤60 chars
  metaDescription: string;     // ≤155 chars

  /* Hero */
  heroEyebrow:     string;     // "FOR ROOFERS"
  heroHeadline:    string;     // big H1, two lines
  heroSubhead:     string;
  painSnapshot:    string;     // "Storm hits → 50 calls in 2 hours →…"

  /* Stats */
  stats: { value: string; label: string }[];   // exactly 3

  /* Lead types Nova handles */
  leadTypes: string[];          // 5–7 items

  /* Sample script (one short turn between caller + Nova) */
  scriptCaller: string;
  scriptNova:   string;

  /* Pain → Outcome */
  painPoints:   string[];       // 3 industry-specific bullets
  outcomes:     string[];       // 3 mirrored wins

  /* Testimonial */
  quote:    string;
  quoter:   string;        // "Mike R."
  quoteRole:string;        // "Owner · Tulsa Roofing Co"

  /* Industry FAQs */
  faqs: { q: string; a: string }[];   // 3–4 items

  /* Final CTA */
  ctaHeadline:  string;
}

export const INDUSTRIES: IndustryData[] = [
  /* ─── ROOFERS ─────────────────────────────────────── */
  {
    slug: 'roofers',
    name: 'Roofers',
    pluralLabel: 'roofing companies',
    emoji: '🏠',
    color: '#ef4444',
    metaTitle: 'AI Receptionist for Roofers — Never Miss a Storm Call | VCV',
    metaDescription: 'Nova answers every roofing call 24/7, books inspections, and texts you the lead instantly. Storm-season ready. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR ROOFERS',
    heroHeadline: 'Storm Hits.\nNova Answers.',
    heroSubhead: 'When a storm rolls through, every roofing company in town gets calls at the same time. Nova answers every single one — 24/7 — so you book the jobs your competitors miss.',
    painSnapshot: 'Storm hits → 50 calls in 2 hours → you only catch 12 → competitors close the rest.',
    stats: [
      { value: '$8K–$25K', label: 'Average roof job value' },
      { value: '62%',      label: 'After-hours storm calls go to voicemail' },
      { value: '24/7',     label: 'Storm season never sleeps' },
    ],
    leadTypes: [
      'Storm damage inspections',
      'Active leak emergencies',
      'Re-roof / replacement quotes',
      'Insurance claim assistance',
      'Gutter & flashing repair',
      'Annual roof check-ups',
    ],
    scriptCaller: 'Hi, my roof is leaking after that storm last night — can someone come out today?',
    scriptNova:   'Absolutely — I\'m sorry to hear that. I can get a roofer out for an emergency inspection today. Can I grab your name, address, and phone number? I\'ll text the foreman immediately.',
    painPoints: [
      'Storm calls hit all at once — no human can answer them all',
      'After-hours leaks go to voicemail and competitors steal the job',
      'Insurance claim callers need quick scheduling or they ghost',
    ],
    outcomes: [
      'Every storm call answered within 1 ring, even at 2am',
      'Leak emergencies dispatched to your foreman by SMS instantly',
      'Insurance leads booked into the calendar before they call competitors',
    ],
    quote: 'A storm rolled through Tuesday night and Nova caught 14 calls our voicemail would have lost. Booked 3 re-roofs that week — paid for the year.',
    quoter: 'Mike R.',
    quoteRole: 'Owner · Tulsa Roofing Co · OK',
    faqs: [
      { q: 'Can Nova handle insurance claim questions?', a: 'Yes — Nova captures the carrier, claim number, and damage description so your office is ready when they call back. We can train her on your specific carrier list.' },
      { q: 'What about emergency vs estimate calls?', a: 'Nova qualifies the urgency on the call (active leak vs estimate request) and can fire a high-priority text to your foreman for emergencies and a normal lead notification for everything else.' },
      { q: 'Does it work during a storm with high call volume?', a: 'Yes — Nova handles unlimited concurrent calls. 50 calls hitting at once = 50 conversations, not 49 voicemails.' },
    ],
    ctaHeadline: 'Capture every storm call — even the 2 a.m. ones',
  },

  /* ─── HVAC ─────────────────────────────────────── */
  {
    slug: 'hvac',
    name: 'HVAC Companies',
    pluralLabel: 'HVAC companies',
    emoji: '❄️',
    color: '#06b6d4',
    metaTitle: 'AI Receptionist for HVAC — Book Service Calls 24/7 | VCV',
    metaDescription: 'Nova answers every HVAC call 24/7, qualifies emergency vs scheduled work, and books service calls instantly. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR HVAC COMPANIES',
    heroHeadline: 'AC Out at 11pm?\nNova Books It.',
    heroSubhead: 'Heatwaves and freezes don\'t wait for business hours. Nova answers every emergency, books service calls, and qualifies the lead before your tech is even out of bed.',
    painSnapshot: 'Heatwave → phones explode → you book 8 jobs → competitors get the other 22.',
    stats: [
      { value: '$300–$8K', label: 'Service call to full system replacement' },
      { value: '78%',      label: 'Of HVAC emergencies happen after 5pm' },
      { value: '24/7',     label: 'Heat / cold doesn\'t take nights off' },
    ],
    leadTypes: [
      'AC/heat emergencies',
      'Tune-up & maintenance bookings',
      'New system quotes',
      'Duct cleaning requests',
      'Thermostat & smart-home installs',
      'Commercial service contracts',
    ],
    scriptCaller: 'My AC just stopped working and it\'s 95 degrees in here — when can someone come out?',
    scriptNova:   'I can get a technician dispatched. Quick — what\'s the address, your phone number, and is the unit completely off or just blowing warm? I\'ll text the on-call tech right now.',
    painPoints: [
      'Emergency calls come in waves during heatwaves and cold snaps',
      'Voicemail loses the customer to whoever answers next',
      'Tune-up reminders never go out because no one has time',
    ],
    outcomes: [
      'Every emergency answered within 1 ring, dispatched by SMS',
      'Maintenance bookings captured automatically into your calendar',
      'Quote requests texted to your sales tech with full lead details',
    ],
    quote: 'Last summer I missed half the after-hours emergencies. With Nova we book every single one — last week alone she captured 22 service calls overnight.',
    quoter: 'Carlos M.',
    quoteRole: 'Owner · ChillTech HVAC · Phoenix, AZ',
    faqs: [
      { q: 'Can Nova prioritise emergencies over routine maintenance?', a: 'Yes — Nova asks "is this urgent or scheduled?" up front and routes accordingly. Emergencies trigger an instant SMS to your on-call tech; routine bookings drop into the lead inbox.' },
      { q: 'Will customers know it\'s AI?', a: 'Most customers think Nova is a real after-hours dispatcher. The voice is natural and she handles real conversations — not a phone tree.' },
      { q: 'Can she give pricing?', a: 'Nova can quote service-call diagnostic fees and rough ranges if you tell her what to say. For full system quotes she captures the info and books an in-home estimate.' },
    ],
    ctaHeadline: 'Book every emergency — even the midnight ones',
  },

  /* ─── PLUMBERS ─────────────────────────────────────── */
  {
    slug: 'plumbers',
    name: 'Plumbers',
    pluralLabel: 'plumbing companies',
    emoji: '🚰',
    color: '#3b82f6',
    metaTitle: 'AI Receptionist for Plumbers — Catch Every Leak Call | VCV',
    metaDescription: 'Nova answers every plumbing emergency 24/7. Burst pipes, clogged drains, water heaters — every call captured. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR PLUMBERS',
    heroHeadline: 'Pipe Bursts at 3am.\nNova Books the Job.',
    heroSubhead: 'Plumbing emergencies don\'t wait. When a customer is standing in 6 inches of water at midnight, the plumber who answers is the plumber who gets paid.',
    painSnapshot: 'Burst pipe call at 2am → goes to voicemail → competitor 2 miles away gets the $4,500 emergency call.',
    stats: [
      { value: '$200–$15K', label: 'Service call to whole-home repipe' },
      { value: '70%',       label: 'Plumbing emergencies are after-hours' },
      { value: '<10 min',   label: 'Average customer patience before next call' },
    ],
    leadTypes: [
      'Burst pipe & flooding emergencies',
      'Clogged drains & toilets',
      'Water heater repair / install',
      'Sewer line issues',
      'Leak detection',
      'Repipe estimates',
    ],
    scriptCaller: 'My water heater just started leaking everywhere — I need someone tonight!',
    scriptNova:   'Stay calm — first, do you know where the shut-off valve is? Good. I\'m getting a plumber dispatched now. What\'s your address and best phone number? I\'ll text my on-call team this second.',
    painPoints: [
      'Most plumbing emergencies are after 5pm or on weekends',
      'Customers call 2-3 plumbers at once — first to answer wins',
      'Voicemail = lost emergency = lost $2,000+ job',
    ],
    outcomes: [
      'Every emergency answered in 1 ring, 24/7',
      'Burst-pipe calls dispatched to your phone with address before you hang up the call',
      'Routine drain calls booked into next-day slots automatically',
    ],
    quote: 'Three Saturday-night burst pipe calls in one weekend, all booked, all paid. That used to be three lost customers.',
    quoter: 'Dave B.',
    quoteRole: 'Master Plumber · DB Plumbing · Charlotte, NC',
    faqs: [
      { q: 'Can Nova help customers shut off water?', a: 'Yes — for active flooding she walks them through finding the main shut-off while a tech is being dispatched. Saves their floor and earns trust before you even arrive.' },
      { q: 'Does she handle commercial plumbing differently?', a: 'Yes — Nova asks if it\'s residential or commercial up front and routes commercial calls to your designated commercial coordinator with the proper notes.' },
      { q: 'Can I use my existing phone number?', a: 'Yes — we can port your number or set up call forwarding so all your existing customers reach Nova when you don\'t pick up.' },
    ],
    ctaHeadline: 'Be the plumber who answers at 3am — without picking up',
  },

  /* ─── ELECTRICIANS ─────────────────────────────────────── */
  {
    slug: 'electricians',
    name: 'Electricians',
    pluralLabel: 'electrical contractors',
    emoji: '⚡',
    color: '#fbbf24',
    metaTitle: 'AI Receptionist for Electricians — Book Every Call | VCV',
    metaDescription: 'Nova answers every electrical service call 24/7 — outages, panel upgrades, EV chargers, full rewires. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR ELECTRICIANS',
    heroHeadline: 'Power\'s Out.\nPhone Rings. Nova Books It.',
    heroSubhead: 'From dead outlets at 8pm to full panel upgrades, Nova captures every electrical call and books the work without missing a single lead.',
    painSnapshot: 'Outage hits the neighborhood → 30 calls in an hour → you answer 5 → 25 jobs walk to your competitor.',
    stats: [
      { value: '$150–$12K', label: 'Outlet repair to panel upgrade' },
      { value: '55%',       label: 'Electrical emergencies after 5pm' },
      { value: '24/7',      label: 'Power doesn\'t respect business hours' },
    ],
    leadTypes: [
      'Power outages & breaker issues',
      'Panel upgrade quotes',
      'EV charger installs',
      'Generator install / service',
      'Lighting & outlet repairs',
      'Whole-home rewires',
    ],
    scriptCaller: 'Half my house just lost power — what do I do?',
    scriptNova:   'OK — first, check your breaker panel and try resetting the tripped breaker. If that doesn\'t fix it, I\'ll dispatch an electrician. Either way, can I get your name, address, and phone so we have it on file?',
    painPoints: [
      'Outage clusters create call surges no human can handle',
      'EV charger and solar leads expect instant response or they bounce',
      'Panel upgrade quotes get lost in voicemail',
    ],
    outcomes: [
      'Every emergency answered + diagnosed (Nova walks them through breakers)',
      'EV / generator quote requests dispatched to sales the second they call',
      'Panel upgrade leads booked for in-home estimates automatically',
    ],
    quote: 'Nova captured 9 EV charger install leads in one week from the Tesla forum. That\'s $36k in quotes my voicemail would have killed.',
    quoter: 'Trevor K.',
    quoteRole: 'Owner · Volt Master Electric · Denver, CO',
    faqs: [
      { q: 'Can Nova walk customers through basic breaker resets?', a: 'Yes — for power outages she tries the simple fixes first (breaker reset, GFCI test) and only dispatches if those fail. Saves you a service call and earns trust.' },
      { q: 'Does she handle commercial electrical?', a: 'Yes — Nova qualifies residential vs commercial and can route commercial leads to your dedicated commercial estimator.' },
      { q: 'What about safety calls (sparks / smoke)?', a: 'Safety-critical calls trigger an immediate SMS to you with "URGENT" flagging while Nova advises the customer to cut power at the panel.' },
    ],
    ctaHeadline: 'Catch every electrical call — outage or otherwise',
  },

  /* ─── CONTRACTORS ─────────────────────────────────────── */
  {
    slug: 'contractors',
    name: 'Contractors',
    pluralLabel: 'general contractors',
    emoji: '🔨',
    color: '#f97316',
    metaTitle: 'AI Receptionist for Contractors — Capture Every Estimate | VCV',
    metaDescription: 'Nova qualifies, captures, and books estimate requests for general contractors. Stop losing remodel leads to voicemail. Try free 14 days — $297 setup.',
    heroEyebrow: 'FOR GENERAL CONTRACTORS',
    heroHeadline: 'Every Estimate Call.\nCaptured. Booked.',
    heroSubhead: 'Remodels, additions, kitchens, baths — your customers do hours of research before calling. Don\'t lose them to a voicemail prompt.',
    painSnapshot: 'Customer researches for a week, finds you, calls → goes to voicemail → calls the next contractor on Google.',
    stats: [
      { value: '$8K–$80K+', label: 'Average remodel project' },
      { value: '40%',       label: 'Of leads call multiple contractors' },
      { value: '1st',       label: 'To answer wins the estimate' },
    ],
    leadTypes: [
      'Kitchen remodel estimates',
      'Bathroom renovation quotes',
      'Home addition projects',
      'Deck & patio builds',
      'Whole-home renovations',
      'Insurance restoration work',
    ],
    scriptCaller: 'Hi, I\'m thinking about remodeling my kitchen and wanted to see if you could come out for an estimate.',
    scriptNova:   'Absolutely — kitchen remodels are one of our specialties. Can I grab your name, address, and the best time for our estimator to come by? Most jobs we can scope in about 30 minutes.',
    painPoints: [
      'High-value estimate calls go to voicemail and never call back',
      'Customers shop 3+ contractors — speed-to-lead wins',
      'Quoting requires details Nova can capture better than voicemail tags',
    ],
    outcomes: [
      'Every estimate request captured with project type, budget range, and timeline',
      'Hot leads texted to your estimator within 30 seconds',
      'Routine maintenance / repair work booked without your involvement',
    ],
    quote: 'Used to lose 3-4 estimate calls a week to voicemail. Nova caught 11 last week alone — 4 of them booked into in-home consults.',
    quoter: 'James W.',
    quoteRole: 'Owner · Westcraft Builders · Nashville, TN',
    faqs: [
      { q: 'Can Nova qualify by project size?', a: 'Yes — Nova asks budget range, timeline, and project type so you only chase qualified leads. Tire-kickers still get captured but flagged differently.' },
      { q: 'Does she handle subcontractor calls?', a: 'Yes — Nova can route sub callers to your project manager and homeowner leads to your sales team automatically.' },
      { q: 'What about insurance restoration work?', a: 'Nova captures carrier, claim number, and adjuster contact — making your office ready to roll on the first call back.' },
    ],
    ctaHeadline: 'Win the estimate by being first to answer',
  },

  /* ─── LANDSCAPERS ─────────────────────────────────────── */
  {
    slug: 'landscapers',
    name: 'Landscapers',
    pluralLabel: 'landscaping companies',
    emoji: '🌿',
    color: '#10b981',
    metaTitle: 'AI Receptionist for Landscapers — Book Every Lawn & Project | VCV',
    metaDescription: 'Nova captures lawn-care signups, hardscape estimates, and seasonal cleanups 24/7 so you focus on the job. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR LANDSCAPERS',
    heroHeadline: 'You\'re on the Mower.\nNova\'s on the Phone.',
    heroSubhead: 'Spring rush, fall cleanups, and hardscape quotes don\'t care that you\'re three subdivisions away. Nova handles every call so the next job books while you finish this one.',
    painSnapshot: 'Spring hits → 60 calls in a week → you\'re on jobs all day → 40 of them go to voicemail and never call back.',
    stats: [
      { value: '$300–$50K+', label: 'Maintenance to full landscape design' },
      { value: '90%',        label: 'Of new leads come March–May' },
      { value: '24/7',       label: 'Spring sales, fall cleanups, snow plows' },
    ],
    leadTypes: [
      'Weekly lawn maintenance signups',
      'Spring & fall cleanup bookings',
      'Hardscape & patio quotes',
      'Sod & landscape design estimates',
      'Tree & shrub installations',
      'Snow plowing service contracts',
    ],
    scriptCaller: 'Hey, I\'m looking for someone to do weekly lawn care this season — what do you charge?',
    scriptNova:   'Great — weekly mowing typically starts at $45 a visit but it depends on lot size. Can I get your address so we can pull up the property and send you an exact quote within an hour?',
    painPoints: [
      'You\'re on the mower 10 hours a day in spring — can\'t answer the phone',
      'Hardscape estimate calls slip through and become competitor jobs',
      'Snow plow callers in November get voicemail in November',
    ],
    outcomes: [
      'Every lawn-care signup captured with property address',
      'Hardscape callers booked for in-person estimates automatically',
      'Snow plow contracts signed up before the first flake falls',
    ],
    quote: 'In spring I used to come home to 20 voicemails I\'d never get to. Now Nova has them all booked into the calendar before I park the truck.',
    quoter: 'Tony P.',
    quoteRole: 'Owner · GreenScape Pros · Cincinnati, OH',
    faqs: [
      { q: 'Can Nova give weekly mowing quotes?', a: 'Yes — we set her up with your pricing rules per square footage. She quotes routine services live; complex projects (hardscape, design) are scheduled for in-person estimates.' },
      { q: 'Does she handle commercial accounts differently?', a: 'Yes — commercial inquiries route to your account manager with property details captured up front.' },
      { q: 'What about seasonal services like snow plowing?', a: 'You can switch Nova\'s seasonal scripts so she pitches snow plow contracts in October and spring cleanups in February automatically.' },
    ],
    ctaHeadline: 'Stop losing lawns while you\'re on the mower',
  },

  /* ─── PEST CONTROL ─────────────────────────────────────── */
  {
    slug: 'pest-control',
    name: 'Pest Control',
    pluralLabel: 'pest control companies',
    emoji: '🐜',
    color: '#a855f7',
    metaTitle: 'AI Receptionist for Pest Control — Book Every Treatment | VCV',
    metaDescription: 'Nova captures urgent pest calls, recurring contracts, and termite inspections 24/7. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR PEST CONTROL',
    heroHeadline: 'Bug Problem.\nNova Books the Treatment.',
    heroSubhead: 'When a customer sees roaches at 9pm, they\'re calling 3 companies. Nova answers first, qualifies, and books the treatment — every single time.',
    painSnapshot: 'Customer spots bedbugs at midnight → calls 4 companies → you got voicemail → they pick the one that answered.',
    stats: [
      { value: '$150–$3K',  label: 'One-time treatment to termite job' },
      { value: '85%',       label: 'Of pest calls are "as-soon-as-possible"' },
      { value: '24/7',      label: 'Bugs don\'t respect office hours' },
    ],
    leadTypes: [
      'Roach, ant & spider treatments',
      'Bed bug emergencies',
      'Termite inspections',
      'Rodent control',
      'Mosquito & tick yard service',
      'Recurring quarterly contracts',
    ],
    scriptCaller: 'I just saw a couple of bedbugs in my mattress — I need someone out here ASAP.',
    scriptNova:   'I completely understand — bedbugs need fast treatment. I can get a tech out tomorrow morning. Can I confirm your address and phone? I\'ll also flag this as priority for our scheduler.',
    painPoints: [
      'Pest emergencies are urgent — voicemail loses to whoever picks up',
      'Termite leads are high-value but need fast inspection scheduling',
      'Recurring quarterly contracts require follow-ups no one has time for',
    ],
    outcomes: [
      'Every emergency call answered + scheduled within minutes',
      'Termite inspection requests texted to estimator instantly',
      'Quarterly contract signups captured with billing info on first call',
    ],
    quote: 'Sundays were dead — voicemail city. Now Nova\'s booking 6-8 weekend treatments per week. That\'s pure new revenue.',
    quoter: 'Lisa T.',
    quoteRole: 'Owner · BugFree Pest · Tampa, FL',
    faqs: [
      { q: 'Can Nova distinguish bedbug emergency from routine ant call?', a: 'Yes — Nova asks the pest type and infestation severity, then prioritises bedbugs/termites for next-day appointments and routine treatments for standard slots.' },
      { q: 'What about recurring contract upsells?', a: 'When a one-time-treatment customer calls back, Nova can pitch the quarterly contract during the booking — captures incremental MRR automatically.' },
      { q: 'Can she capture insurance / warranty info for termite jobs?', a: 'Yes — she captures any existing termite bond, carrier, or warranty info so your estimator is briefed before they arrive.' },
    ],
    ctaHeadline: 'Be first to answer — book every treatment',
  },

  /* ─── DENTISTS ─────────────────────────────────────── */
  {
    slug: 'dentists',
    name: 'Dentists',
    pluralLabel: 'dental practices',
    emoji: '🦷',
    color: '#3b82f6',
    metaTitle: 'AI Receptionist for Dentists — Book Every New Patient | VCV',
    metaDescription: 'Nova answers every dental call 24/7 — new patient bookings, hygiene appointments, emergency toothaches. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR DENTAL PRACTICES',
    heroHeadline: 'Every New Patient.\nBooked. Confirmed.',
    heroSubhead: 'A new patient is worth $500–$2,000+ in lifetime value. Nova answers, qualifies, and books every single one — even after-hours emergencies.',
    painSnapshot: 'New patient calls at 6:15pm → office is closed → voicemail → they book with the dentist down the street tomorrow morning.',
    stats: [
      { value: '$500–$2K+', label: 'Lifetime value per new patient' },
      { value: '46%',       label: 'Of new-patient calls are after hours' },
      { value: '1st',       label: 'Practice to book wins the patient' },
    ],
    leadTypes: [
      'New patient bookings',
      'Cleaning / hygiene appointments',
      'Emergency toothache & broken tooth',
      'Cosmetic consult requests',
      'Insurance verification questions',
      'Family appointment scheduling',
    ],
    scriptCaller: 'Hi, I\'m a new patient looking to schedule a cleaning — do you take Delta Dental?',
    scriptNova:   'Yes, we accept Delta Dental — I can book your first cleaning. Can I get your name, date of birth, and phone number? We have openings next Tuesday and Thursday — which works better?',
    painPoints: [
      'New patient calls outside 9-5 lose to the next practice on Google',
      'Insurance questions cause callers to hang up if no one can answer',
      'Emergency toothache patients need same-day scheduling or they go to ER',
    ],
    outcomes: [
      'Every new patient booked into your scheduling system overnight',
      'Insurance pre-verification captured on the call',
      'Emergency cases triaged + scheduled before competitors open',
    ],
    quote: 'Cancelled my $425/mo answering service the day Nova went live. Better quality calls, fraction of the cost, and patients say she\'s lovely.',
    quoter: 'Dr. Sarah L.',
    quoteRole: 'Family Dental Care · Austin, TX',
    faqs: [
      { q: 'Can Nova check insurance acceptance?', a: 'Yes — we load your accepted carriers and Nova confirms in real-time. For complex coverage questions she captures the info and your office calls back next morning.' },
      { q: 'How does she handle emergencies?', a: 'Nova triages by severity. True emergencies (knocked-out tooth, severe pain) get a priority text to the on-call dentist. Routine pain gets next-day appointments.' },
      { q: 'Will patients know it\'s AI?', a: 'Most don\'t. Nova has a warm, professional voice and handles insurance, scheduling, and follow-up questions naturally.' },
    ],
    ctaHeadline: 'Book every new patient — even after 5pm',
  },

  /* ─── LAWYERS ─────────────────────────────────────── */
  {
    slug: 'lawyers',
    name: 'Law Firms',
    pluralLabel: 'law firms',
    emoji: '⚖️',
    color: '#a855f7',
    metaTitle: 'AI Receptionist for Lawyers — Capture Every Consult | VCV',
    metaDescription: 'Nova qualifies and books legal consults 24/7 — personal injury, family, criminal, business law. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR LAW FIRMS',
    heroHeadline: 'Every Consult Call.\nQualified. Booked.',
    heroSubhead: 'Legal callers are emotional, time-sensitive, and worth thousands. Nova listens, qualifies, and books the consult before they call the next firm.',
    painSnapshot: 'Accident at 11pm → caller wants representation now → voicemail → next firm on Google takes the case.',
    stats: [
      { value: '$5K–$100K+', label: 'Avg case value (varies by practice)' },
      { value: '74%',        label: 'Of injury callers go with first firm to call back' },
      { value: '24/7',       label: 'Legal emergencies don\'t wait' },
    ],
    leadTypes: [
      'Personal injury consult requests',
      'Family law / divorce inquiries',
      'Criminal defense urgent calls',
      'Business / contract law',
      'Estate planning consultations',
      'Workers\' comp claims',
    ],
    scriptCaller: 'I was in a car accident this morning and I\'m wondering if I have a case.',
    scriptNova:   'I\'m so sorry to hear that. We\'d like to evaluate your case — there\'s no charge for the consult. Can I grab your name, the date of the accident, and a phone number? Our intake attorney will call you within 1 business hour.',
    painPoints: [
      'Injury cases are emotional — first firm to listen wins',
      'Caller drops off if voicemail transfer feels cold',
      'Conflict-of-interest checks delay intake',
    ],
    outcomes: [
      'Every consult call answered with empathy + booked',
      'Conflict info (other party names) captured on the call',
      'Hot personal-injury leads texted to intake within 30 seconds',
    ],
    quote: 'We\'re catching consults at 9pm, midnight, weekends. PI cases I would have lost are now in our pipeline. ROI was instant.',
    quoter: 'Mark D.',
    quoteRole: 'Managing Partner · Davis Injury Law · Houston, TX',
    faqs: [
      { q: 'Can Nova handle conflict checks?', a: 'Yes — she captures all parties involved and flags the call so your office can run a conflict check before the consult is confirmed.' },
      { q: 'What about confidentiality?', a: 'Calls are encrypted, transcripts stored securely, and Nova explicitly tells callers their conversation is confidential and reviewed only by the firm.' },
      { q: 'Does she handle different practice areas?', a: 'Yes — Nova qualifies the practice area (PI, family, criminal, etc.) and routes leads to the right intake attorney with the relevant intake form.' },
    ],
    ctaHeadline: 'Every consult call answered — every case captured',
  },

  /* ─── AUTO REPAIR ─────────────────────────────────────── */
  {
    slug: 'auto-repair',
    name: 'Auto Repair Shops',
    pluralLabel: 'auto repair shops',
    emoji: '🔧',
    color: '#ef4444',
    metaTitle: 'AI Receptionist for Auto Repair — Book Every Service | VCV',
    metaDescription: 'Nova answers every car repair call, books service appointments, and captures estimate requests 24/7. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR AUTO REPAIR',
    heroHeadline: 'Check Engine Light On?\nNova Schedules It.',
    heroSubhead: 'Customers don\'t want to leave a voicemail when their car won\'t start. Nova answers, diagnoses by symptoms, and books the repair before they call the next shop.',
    painSnapshot: 'Car dies in driveway at 7am → customer calls you → voicemail → calls the next shop on Yelp → you lose a $1,800 transmission job.',
    stats: [
      { value: '$200–$5K+', label: 'Oil change to transmission rebuild' },
      { value: '60%',       label: 'Of repair calls are before 9am or after 5pm' },
      { value: '1st',       label: 'Shop to call back wins the customer' },
    ],
    leadTypes: [
      'Check engine light diagnostics',
      'Brake & tire service',
      'Transmission repair quotes',
      'AC & heater service',
      'Routine oil change bookings',
      'State inspection appointments',
    ],
    scriptCaller: 'My check engine light just came on — can someone look at it tomorrow?',
    scriptNova:   'Absolutely — diagnostics take about an hour. We have openings at 8 a.m. or 1 p.m. tomorrow. Which works better? I\'ll grab your name, phone, and the year/make/model.',
    painPoints: [
      'Customers call you before work or after work — when you\'re closed',
      'Voicemail loses to whoever the customer\'s buddy recommends',
      'Estimate requests get lost in the daily phone storm',
    ],
    outcomes: [
      'Every repair call answered with year/make/model captured',
      'Same-day diagnostic appointments booked overnight',
      'Estimate requests texted to your service writer instantly',
    ],
    quote: 'I picked up 11 new bookings the first week — including a transmission job worth $2,400. Pays for Nova for a year and a half.',
    quoter: 'Frank S.',
    quoteRole: 'Owner · Frank\'s Auto · Kansas City, MO',
    faqs: [
      { q: 'Can Nova diagnose by symptoms?', a: 'Nova asks symptom questions (noise, when it happens, smell) and notes them so your tech is briefed before the car arrives. She doesn\'t guess — she captures.' },
      { q: 'Will she give estimates over the phone?', a: 'Routine services (oil change, brake pads, alignment) yes — based on your price book. Anything diagnostic she books for an in-shop look.' },
      { q: 'Can she handle warranty / extended warranty calls?', a: 'Yes — Nova captures the warranty company and contract number so your service writer is ready to authorise work.' },
    ],
    ctaHeadline: 'Schedule every check-engine-light call',
  },

  /* ─── RESTAURANTS ─────────────────────────────────────── */
  {
    slug: 'restaurants',
    name: 'Restaurants',
    pluralLabel: 'restaurants',
    emoji: '🍽️',
    color: '#f97316',
    metaTitle: 'AI Receptionist for Restaurants — Book Reservations & Catering | VCV',
    metaDescription: 'Nova handles reservations, catering quotes, and takeout questions 24/7 so your hostess can focus on guests. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR RESTAURANTS',
    heroHeadline: 'Reservations & Catering.\nWhile You Run Service.',
    heroSubhead: 'Your hostess is seating tables. Your phone is ringing. Nova handles reservations, catering quotes, and questions — even mid-rush.',
    painSnapshot: 'Saturday rush → phone rings 14 times → hostess can\'t answer → 14 reservation requests + 1 catering quote walk away.',
    stats: [
      { value: '$300–$2.5K', label: 'Reservation to large catering order' },
      { value: '32%',        label: 'Of catering inquiries call only one place' },
      { value: 'Live',       label: 'Reservations even during dinner rush' },
    ],
    leadTypes: [
      'Dinner reservations & cancellations',
      'Catering & private event quotes',
      'Hours / menu / location questions',
      'Take-out / delivery questions',
      'Large party bookings',
      'Gift-card sales & balance checks',
    ],
    scriptCaller: 'Hi, I\'d like to make a reservation for 6 people Saturday at 7pm.',
    scriptNova:   'Of course — Saturday at 7 for a party of 6. I\'ve got that available. Can I get the name and a phone number? I\'ll text you a confirmation right after we hang up.',
    painPoints: [
      'Friday/Saturday rush = no one available to answer the phone',
      'Catering inquiries are high-value but get lost during service',
      'Repetitive "what time do you close" calls eat hostess time',
    ],
    outcomes: [
      'Every reservation booked into OpenTable/Resy automatically',
      'Catering inquiries captured + texted to your event coordinator',
      'Hours / menu / parking questions answered without staff time',
    ],
    quote: 'Nova booked 18 reservations during last Saturday\'s rush — that\'s 18 tables we would have lost to "leave a message". She\'s a hidden hostess we don\'t pay overtime to.',
    quoter: 'Maria G.',
    quoteRole: 'GM · Bella Trattoria · San Diego, CA',
    faqs: [
      { q: 'Can Nova integrate with OpenTable / Resy / Tock?', a: 'Yes — we wire her into your reservation platform so bookings drop in directly. Same with Toast/Square for menu/hours info.' },
      { q: 'What about catering quotes?', a: 'Nova captures party size, date, menu preferences, and budget — then your event coordinator gets a complete brief by text within minutes.' },
      { q: 'Does she handle cancellations?', a: 'Yes — Nova confirms and updates the reservation system so you don\'t end up with no-shows or double-bookings.' },
    ],
    ctaHeadline: 'Reservations + catering captured during every rush',
  },

  /* ─── HAIR SALONS ─────────────────────────────────────── */
  {
    slug: 'salons',
    name: 'Hair Salons',
    pluralLabel: 'salons',
    emoji: '💇',
    color: '#ec4899',
    metaTitle: 'AI Receptionist for Salons — Book Every Appointment | VCV',
    metaDescription: 'Nova books cuts, color, and treatments 24/7 — even when your stylists are with clients. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR HAIR & BEAUTY SALONS',
    heroHeadline: 'You\'re Cutting Hair.\nNova\'s Booking the Next One.',
    heroSubhead: 'Stylists can\'t cut and answer the phone. Nova books cuts, color, blowouts, and balayages — even during your busiest Saturday.',
    painSnapshot: 'Stylists in chairs from 9am-7pm → 30+ booking calls → 25 of them go to voicemail → bookings move to the salon next door.',
    stats: [
      { value: '$50–$400+', label: 'Cut to full balayage + color' },
      { value: '70%',       label: 'Of booking calls happen during business hours' },
      { value: 'Live',      label: 'Always available — even mid-blow-dry' },
    ],
    leadTypes: [
      'Cut & style appointments',
      'Color & balayage bookings',
      'Wedding & event hair',
      'Extensions consultations',
      'New client questions',
      'Reschedules & cancellations',
    ],
    scriptCaller: 'I\'m looking for a balayage appointment with someone who does blondes well.',
    scriptNova:   'Great choice — Jess is our blonde balayage specialist. She has openings next Tuesday at 10 or Saturday at 1. Which works? I\'ll grab your name and phone to send a confirmation.',
    painPoints: [
      'Stylists can\'t answer mid-color — phone goes to voicemail',
      'New client calls hit voicemail and find another salon',
      'Reschedule/cancellation chaos eats stylist time',
    ],
    outcomes: [
      'Every booking captured into your scheduling app (Vagaro, Square, etc.)',
      'New client questions answered with stylist specialties',
      'Cancellations rebooked into open slots automatically',
    ],
    quote: 'I went from 8 missed calls a day to zero. Saturday alone we booked 14 appointments through Nova — most of them new clients.',
    quoter: 'Jess M.',
    quoteRole: 'Owner · The Color Studio · Charleston, SC',
    faqs: [
      { q: 'Can Nova match clients with the right stylist?', a: 'Yes — we set her up with each stylist\'s specialty (blondes, curly, men\'s, extensions) so she books with the best fit automatically.' },
      { q: 'Will she integrate with Vagaro / Square / GlossGenius?', a: 'Yes — we connect her to your booking system so appointments drop in directly. No double-entry.' },
      { q: 'How does she handle late cancellations / no-shows?', a: 'Nova enforces your cancellation policy on the call (e.g., "we charge 50% for cancellations under 24 hours") and captures payment info if applicable.' },
    ],
    ctaHeadline: 'Book every cut, color, and balayage — even mid-rush',
  },

  /* ─── VETERINARY ─────────────────────────────────────── */
  {
    slug: 'vets',
    name: 'Vet Clinics',
    pluralLabel: 'veterinary clinics',
    emoji: '🐾',
    color: '#22c55e',
    metaTitle: 'AI Receptionist for Vet Clinics — Book Every Pet Appointment | VCV',
    metaDescription: 'Nova answers every pet call 24/7 — emergency, wellness, surgery follow-ups, prescription refills. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR VETERINARY CLINICS',
    heroHeadline: 'Every Pet Call.\nAnswered. Booked.',
    heroSubhead: 'Sick pets, wellness checks, prescription refills — Nova handles them all so your front desk can focus on the animals in front of them.',
    painSnapshot: 'Dog vomits at 8pm → owner panics, calls clinic → voicemail → drives to emergency vet → you lose the patient relationship.',
    stats: [
      { value: '$80–$3K+',  label: 'Wellness check to surgery' },
      { value: '52%',       label: 'Of pet emergencies happen after-hours' },
      { value: 'Loyal',     label: 'Pet owners stay with their first clinic' },
    ],
    leadTypes: [
      'Sick pet appointments',
      'Wellness & vaccine bookings',
      'Surgery / procedure scheduling',
      'Prescription refill requests',
      'Boarding & grooming inquiries',
      'New patient registrations',
    ],
    scriptCaller: 'My dog has been throwing up all afternoon — should I bring him in?',
    scriptNova:   'I\'m sorry to hear that — let me get you in. Has he had any food or water in the last hour? OK, we have a slot at 5:30 today. What\'s your dog\'s name, your name, and a callback number?',
    painPoints: [
      'Pet owners panic when their pet is sick — voicemail makes it worse',
      'Prescription refill calls eat front-desk time',
      'After-hours emergencies go to ER vet (you lose the relationship)',
    ],
    outcomes: [
      'Every sick-pet call answered with empathy and triage',
      'Wellness/vaccine bookings filled into your schedule',
      'Refill requests captured + faxed to pharmacy automatically',
    ],
    quote: 'After-hours emergency calls used to go to the ER vet. Now Nova schedules them for 7am next day or triages true emergencies. Lost-patient rate dropped 80%.',
    quoter: 'Dr. Amanda K.',
    quoteRole: 'Owner · Cedar Hills Vet · Boise, ID',
    faqs: [
      { q: 'Can Nova triage emergencies?', a: 'Yes — Nova asks symptom questions and severity, then either books a same-day appointment or, for true emergencies, recommends the nearest 24-hour ER vet while flagging your on-call.' },
      { q: 'Does she integrate with our practice software?', a: 'We connect her to ezyVet, AviMark, IDEXX, and similar — so appointments and patient records drop in directly.' },
      { q: 'Can she handle refill requests?', a: 'Yes — Nova captures the patient name, medication, and dose, then routes it to your pharmacy queue for review and approval.' },
    ],
    ctaHeadline: 'Be the clinic that answers when their pet is sick',
  },

  /* ─── CLEANING SERVICES ─────────────────────────────────────── */
  {
    slug: 'cleaning',
    name: 'Cleaning Services',
    pluralLabel: 'cleaning companies',
    emoji: '🧹',
    color: '#06b6d4',
    metaTitle: 'AI Receptionist for Cleaning Services — Book Every Job | VCV',
    metaDescription: 'Nova books recurring cleans, deep cleans, and move-out jobs 24/7 — even while your crews are on the job. Try free 14 days — $297 setup.',
    heroEyebrow: 'FOR CLEANING COMPANIES',
    heroHeadline: 'Crews Are Cleaning.\nNova\'s Booking the Next Job.',
    heroSubhead: 'Recurring weekly clients, one-time deep cleans, move-outs, post-construction — Nova quotes by square footage and books every single one.',
    painSnapshot: 'You\'re cleaning a 4-bed at 2pm → 6 quote calls come in → all go to voicemail → 4 of them book with the next cleaner who answers.',
    stats: [
      { value: '$120–$800+', label: 'Standard clean to deep / move-out' },
      { value: '60%',        label: 'Of one-time cleans become recurring' },
      { value: '24/7',       label: 'Quotes booked while crews work' },
    ],
    leadTypes: [
      'Weekly / bi-weekly recurring cleans',
      'One-time deep cleans',
      'Move-in / move-out cleans',
      'Post-construction cleanup',
      'Airbnb turnovers',
      'Office / commercial cleaning',
    ],
    scriptCaller: 'How much for a deep clean of a 3-bedroom 2-bath?',
    scriptNova:   'For a 3-bed 2-bath deep clean, we typically quote $280–$340 depending on condition. I can have someone out this Friday or Saturday morning. What works better? I\'ll grab your address.',
    painPoints: [
      'You\'re scrubbing — phone is buzzing — leads vanish',
      'Move-out cleans are last-minute and time-sensitive',
      'Recurring contracts need follow-up upsells you don\'t have time for',
    ],
    outcomes: [
      'Every quote call answered with square-footage pricing',
      'Move-out / Airbnb turnovers booked while you\'re mid-clean',
      'One-time clients converted to recurring on the booking call',
    ],
    quote: 'I literally heard my phone ring while scrubbing a tub — and Nova was already booking the call. I never picked up but the booking was waiting when I got to the truck.',
    quoter: 'Karen B.',
    quoteRole: 'Owner · Sparkle Cleaning · Salt Lake City, UT',
    faqs: [
      { q: 'Can Nova quote by square footage?', a: 'Yes — load in your pricing rules per sq ft and per service type. She quotes live and books on the call.' },
      { q: 'Does she handle Airbnb turnovers?', a: 'Yes — Nova handles tight turnaround windows, gets the property address, access info, and same-day scheduling for hosts.' },
      { q: 'What about commercial cleaning RFPs?', a: 'Nova captures the prospect, square footage, frequency, and contact info, then alerts your commercial sales rep within minutes.' },
    ],
    ctaHeadline: 'Book every clean — even the last-minute ones',
  },

  /* ─── REAL ESTATE ─────────────────────────────────────── */
  {
    slug: 'real-estate',
    name: 'Real Estate Agents',
    pluralLabel: 'real estate agents',
    emoji: '🏡',
    color: '#8b5cf6',
    metaTitle: 'AI Receptionist for Realtors — Catch Every Showing Lead | VCV',
    metaDescription: 'Nova answers every showing request, listing inquiry, and seller call 24/7. Speed-to-lead wins listings. Try free 14 days — only $297 setup.',
    heroEyebrow: 'FOR REAL ESTATE AGENTS',
    heroHeadline: 'Listing Calls 24/7.\nYou Call Back at 9am.\nThey\'re Already Touring With Someone Else.',
    heroSubhead: 'Buyers and sellers expect a callback in minutes, not hours. Nova catches every Zillow, Redfin, and yard-sign call — qualifies them — and books the showing while you\'re still in escrow on another deal.',
    painSnapshot: 'Buyer sees your listing on Zillow at 9pm → calls → voicemail → calls the next agent → they\'re touring tomorrow morning.',
    stats: [
      { value: '$8K–$30K+', label: 'Avg commission per closed deal' },
      { value: '5 min',     label: 'Speed-to-lead window before customers move on' },
      { value: '24/7',      label: 'Buyers browse Zillow at midnight' },
    ],
    leadTypes: [
      'Showing requests on listings',
      'Seller / listing appointments',
      'New construction inquiries',
      'Investment property leads',
      'Rental inquiries (referral fees)',
      'CMA / valuation requests',
    ],
    scriptCaller: 'I saw your listing on Maple Street — can I see it tomorrow?',
    scriptNova:   'Absolutely — that one\'s gorgeous. We have showings at 11am, 1pm, and 4pm tomorrow. Which works? Can I grab your name and phone, and are you currently working with another agent?',
    painPoints: [
      'Speed-to-lead defines every closed deal',
      'After-hours Zillow calls go to voicemail and convert at 5%',
      'Seller appointments need urgent scheduling or they list with someone else',
    ],
    outcomes: [
      'Every showing request answered + booked in your calendar',
      'Buyer agent qualification (working with anyone? pre-approved?) captured',
      'Hot listing-appointment leads texted to you in 30 seconds',
    ],
    quote: 'Won 4 listings last month I would have lost. Sellers said "you called back fastest." That was Nova while I was at dinner.',
    quoter: 'Rachel W.',
    quoteRole: 'Realtor® · Keller Williams · Atlanta, GA',
    faqs: [
      { q: 'Can Nova qualify buyers (pre-approval, working with agent)?', a: 'Yes — Nova asks pre-approval status and current agent representation up front so you only chase qualified, available buyers.' },
      { q: 'Does she integrate with my CRM?', a: 'Yes — Follow Up Boss, kvCORE, Sierra Interactive, BoomTown, and most major real-estate CRMs. Leads drop in with full call notes.' },
      { q: 'What about seller leads?', a: 'Seller calls trigger immediate SMS to you with the address, motivation, and timeline so you can call back within 5 minutes — the speed-to-lead sweet spot.' },
    ],
    ctaHeadline: 'Be the agent who calls back first — every time',
  },
];

export const findIndustry = (slug: string): IndustryData | undefined =>
  INDUSTRIES.find(i => i.slug === slug);
