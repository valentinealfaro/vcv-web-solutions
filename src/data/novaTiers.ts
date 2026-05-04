/* ─── Single source of truth for Nova pricing tiers ─────────────
   Used by: /ai-receptionist, /pricing (Nova section), and all 34
   /ai-receptionist/[industry] landing pages.

   Annual = pay 10 months, get 2 free (~17% off vs monthly).
   Setup fee ($297) is the same for both billing periods.
─────────────────────────────────────────────────────────────────── */

export interface NovaTier {
  id:               string;
  name:             string;
  positioning:      string;

  /* Monthly billing */
  price:            number;     // dollars
  priceCents:       number;     // cents (Stripe)

  /* Annual billing */
  priceAnnual:      number;     // dollars/yr
  priceCentsAnnual: number;     // cents/yr (Stripe)
  annualSavings:    number;     // $ saved vs paying monthly × 12

  callsLabel:       string;
  features:         string[];
  ctaLabel:         string;
  color:            string;
  popular:          boolean;
}

export const NOVA_TIERS: NovaTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    positioning: 'Best for small businesses that need basic call coverage',
    price: 147, priceCents: 14700,
    priceAnnual: 1470, priceCentsAnnual: 147000, annualSavings: 294,
    callsLabel: '50–100 calls / month',
    features: [
      'Never miss a call again',
      'AI answers and captures lead details',
      'Missed-call auto-text reply',
      'Instant text + email alerts',
      'Local number in your area code',
      '24/7 coverage while you work',
    ],
    ctaLabel: 'Start Capturing Leads',
    color: '#3b82f6',
    popular: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    positioning: 'Best for businesses that want booked appointments',
    price: 297, priceCents: 29700,
    priceAnnual: 2970, priceCentsAnnual: 297000, annualSavings: 594,
    callsLabel: '200–300 calls / month',
    features: [
      'Everything in Starter',
      'Books appointments automatically',
      'Texts leads after the call',
      "Live transfer hot leads when you're free",
      'Custom call script for your business',
      'Helps turn callers into scheduled jobs',
    ],
    ctaLabel: 'Activate Nova',
    color: '#10b981',
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    positioning: 'Best for serious businesses that want automation',
    price: 497, priceCents: 49700,
    priceAnnual: 4970, priceCentsAnnual: 497000, annualSavings: 994,
    callsLabel: 'Up to 500 calls / mo',
    features: [
      'Everything in Growth',
      'Built-in CRM to track every lead',
      'Day 1 / Day 3 / Day 7 follow-up automation',
      'Estimate follow-up reminders',
      'Priority support',
      'Custom integrations and automations',
    ],
    ctaLabel: 'Scale My Calls',
    color: '#a855f7',
    popular: false,
  },
];

export const NOVA_SETUP_FEE_CENTS = 29700;   // $297, same on monthly + annual
export const NOVA_SETUP_FEE_LABEL = 'One-Time Setup Fee ($297)';
