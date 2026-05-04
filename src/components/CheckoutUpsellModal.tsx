'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowRight, Loader2, CheckCircle2, Plus } from 'lucide-react';
import { trackInitiateCheckout } from '@/components/Analytics';

/* ─── Add-on catalogue ──────────────────────────────────────────
   Each add-on flags which contexts it should be offered in.
   nova    = Nova plan checkout (AI Receptionist tiers)
   website = Website plan checkout (Monthly / Annual)
   bundle  = Mega bundle checkout
─────────────────────────────────────────────────────────────────── */
export interface Addon {
  id:          string;
  title:       string;
  priceCents:  number;
  priceLabel:  string;
  desc:        string;
  color:       string;
  contexts:    Array<'nova' | 'website' | 'bundle'>;
}

export const ADDONS: Addon[] = [
  {
    id: 'extra-volume',
    title: 'Extra Call Volume',
    priceCents: 9700,
    priceLabel: '+$97/mo',
    desc: '200 extra calls/month for high-traffic businesses pushing past included minutes.',
    color: '#3b82f6',
    contexts: ['nova', 'bundle'],
  },
  {
    id: 'crm',
    title: 'CRM System',
    priceCents: 14700,
    priceLabel: '+$147/mo',
    desc: 'Pipeline, contact history, and task automation built-in.',
    color: '#8b5cf6',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'google-ads',
    title: 'Google Ads Management',
    priceCents: 49700,
    priceLabel: '+$497/mo',
    desc: 'Pro pay-per-click campaigns — strategy, copy, and optimization run by our team.',
    color: '#10b981',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'seo-pages',
    title: 'SEO Landing Pages',
    priceCents: 99700,
    priceLabel: '+$997 once',
    desc: 'Niche-targeted landing pages that rank for local searches and convert.',
    color: '#f97316',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'reputation',
    title: 'Reputation Management',
    priceCents: 14700,
    priceLabel: '+$147/mo',
    desc: 'Auto-request 5-star Google reviews after every job + monitor & flag negatives.',
    color: '#fbbf24',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'social-mgmt',
    title: 'Social Media Management',
    priceCents: 49700,
    priceLabel: '+$497/mo',
    desc: 'Daily posts, content calendar, and DM monitoring for FB / IG / TikTok.',
    color: '#ec4899',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'logo-brand',
    title: 'Logo + Brand Identity',
    priceCents: 49700,
    priceLabel: '+$497 once',
    desc: 'Custom logo, color palette, fonts, and brand-guide PDF you own forever.',
    color: '#06b6d4',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'seo-audit',
    title: 'Local SEO Audit + Plan',
    priceCents: 29700,
    priceLabel: '+$297 once',
    desc: 'Full local SEO audit + 30/60/90 action plan to outrank competitors on Google.',
    color: '#10b981',
    contexts: ['nova', 'website', 'bundle'],
  },
  {
    id: 'funnel',
    title: 'Done-For-You Sales Funnel',
    priceCents: 149700,
    priceLabel: '+$1,497 once',
    desc: 'Landing page + lead magnet + 7-email follow-up sequence built and deployed.',
    color: '#a855f7',
    contexts: ['nova', 'website', 'bundle'],
  },
];

export interface CheckoutPayload {
  productName:   string;
  amount:        number;
  setupFee?:     number;
  setupFeeName?: string;
  addons?: Array<{ name: string; description?: string; amount: number }>;
}

interface Props {
  open:        boolean;
  onClose:     () => void;
  context:     'nova' | 'website' | 'bundle';
  planName:    string;             // "Growth Plan", "Monthly Plan", etc.
  planAmount:  number;             // in cents — recurring price line item
  planPriceLabel: string;          // "$197/mo", "$147/mo", "$1,497/yr"
  setupFeeCents?:  number;
  setupFeeName?:   string;         // "One-Time Setup Fee ($197)"
  productName: string;             // full product name for Stripe line item
  /* server-side: fetches /api/create-checkout-session and redirects */
  loading: boolean;
  onConfirm: (payload: CheckoutPayload) => void;
}

const fmt = (cents: number) =>
  `$${(cents / 100).toLocaleString(undefined, { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;

export const CheckoutUpsellModal = ({
  open, onClose, context,
  planName, planAmount, planPriceLabel,
  setupFeeCents = 0, setupFeeName,
  productName,
  loading, onConfirm,
}: Props) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Reset selection when modal closes
  useEffect(() => {
    if (!open) setSelected(new Set());
  }, [open]);

  const visibleAddons = ADDONS.filter(a => a.contexts.includes(context));

  const toggle = (id: string) =>
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const addonTotal = visibleAddons
    .filter(a => selected.has(a.id))
    .reduce((sum, a) => sum + a.priceCents, 0);

  const total = planAmount + setupFeeCents + addonTotal;

  const handleConfirm = () => {
    const chosenAddons = visibleAddons
      .filter(a => selected.has(a.id))
      .map(a => ({ name: `${a.title} (Add-on)`, description: a.desc, amount: a.priceCents }));

    /* Fire InitiateCheckout for GA4 + Meta Pixel — value in dollars */
    trackInitiateCheckout(total / 100, productName);

    onConfirm({
      productName,
      amount: planAmount,
      ...(setupFeeCents > 0 && { setupFee: setupFeeCents, setupFeeName }),
      ...(chosenAddons.length > 0 && { addons: chosenAddons }),
    });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center px-4 py-6 overflow-y-auto"
          style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(8px)' }}
          onClick={loading ? undefined : onClose}>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl my-auto"
            style={{
              background: 'rgba(8,12,22,0.98)',
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.7), 0 0 80px rgba(37,99,235,0.15)',
            }}>

            {/* Close button */}
            <button onClick={onClose} disabled={loading}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
              aria-label="Close">
              <X className="w-5 h-5"/>
            </button>

            <div className="p-6 md:p-8">
              {/* Header */}
              <div className="mb-5">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Step 2 of 2 · Customize Order
                </p>
                <h2 className="font-display text-3xl md:text-4xl text-white leading-none mb-2">
                  Add anything else?
                </h2>
                <p className="text-gray-400 text-sm">
                  Optional upgrades — pick any you want, skip the rest.
                </p>
              </div>

              {/* Order summary — base plan */}
              <div className="rounded-xl p-4 mb-4"
                style={{ background:'rgba(34,197,94,0.06)', border:'1px solid rgba(34,197,94,0.3)' }}>
                <div className="flex items-center justify-between gap-3 mb-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0"/>
                    <span className="text-white font-bold text-sm">{planName}</span>
                  </div>
                  <span className="text-white font-display text-lg">{planPriceLabel}</span>
                </div>
                {setupFeeCents > 0 && (
                  <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0"/>
                      <span className="text-gray-300 text-sm">{setupFeeName || 'One-Time Setup Fee'}</span>
                    </div>
                    <span className="text-gray-300 font-display text-base">{fmt(setupFeeCents)}</span>
                  </div>
                )}
              </div>

              {/* Add-ons list */}
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                Available Upgrades
              </p>
              <div className="space-y-2.5 mb-5 max-h-[40vh] overflow-y-auto pr-1">
                {visibleAddons.map(a => {
                  const isOn = selected.has(a.id);
                  return (
                    <button key={a.id} onClick={() => toggle(a.id)} disabled={loading}
                      className="w-full text-left rounded-xl p-4 flex items-start gap-3 transition-all disabled:opacity-50"
                      style={{
                        background: isOn ? `${a.color}14` : 'rgba(255,255,255,0.025)',
                        border:     isOn ? `1.5px solid ${a.color}80` : '1px solid rgba(255,255,255,0.08)',
                        boxShadow:  isOn ? `0 0 22px ${a.color}30` : 'none',
                      }}>
                      {/* Toggle */}
                      <div className="w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center mt-0.5"
                        style={{
                          background: isOn ? a.color : 'rgba(255,255,255,0.04)',
                          border:     isOn ? `1.5px solid ${a.color}` : '1.5px solid rgba(255,255,255,0.18)',
                        }}>
                        {isOn
                          ? <CheckCircle2 className="w-4 h-4 text-white"/>
                          : <Plus className="w-3.5 h-3.5 text-gray-400"/>}
                      </div>
                      {/* Body */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <span className="text-white font-bold text-sm">{a.title}</span>
                          <span className="font-display text-base whitespace-nowrap" style={{ color: a.color }}>
                            {a.priceLabel}
                          </span>
                        </div>
                        <p className="text-gray-400 text-xs leading-relaxed">{a.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Total */}
              <div className="rounded-xl p-4 mb-4"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-gray-400 text-xs uppercase tracking-widest font-bold">Today's charge</span>
                  <span className="font-display text-3xl text-white" style={{ textShadow:'0 0 20px rgba(34,197,94,0.4)' }}>
                    {fmt(total)}
                  </span>
                </div>
                <p className="text-gray-500 text-xs">
                  Recurring charges (if any) start after first month or per the plan terms.
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button onClick={onClose} disabled={loading}
                  className="px-5 py-3 rounded-xl text-gray-300 text-sm font-semibold border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50">
                  Back
                </button>
                <motion.button
                  onClick={handleConfirm}
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                  animate={{
                    backgroundImage:[
                      'linear-gradient(135deg,#22c55e,#06b6d4)',
                      'linear-gradient(135deg,#06b6d4,#3b82f6)',
                      'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                      'linear-gradient(135deg,#8b5cf6,#22c55e)',
                    ],
                    boxShadow:[
                      '0 0 22px rgba(34,197,94,0.55)',
                      '0 0 22px rgba(6,182,212,0.55)',
                      '0 0 22px rgba(59,130,246,0.55)',
                      '0 0 22px rgba(139,92,246,0.55)',
                    ],
                  }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'linear' }}>
                  {loading
                    ? <><Loader2 className="w-4 h-4 animate-spin"/> Redirecting...</>
                    : <>Continue to Checkout — {fmt(total)} <ArrowRight className="w-4 h-4"/></>}
                </motion.button>
              </div>

              <p className="text-center text-gray-500 text-xs mt-3">
                Secure checkout · Powered by Stripe · Cancel anytime
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
