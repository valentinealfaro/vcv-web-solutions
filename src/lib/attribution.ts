'use client';

/* ─────────────────────────────────────────────────────────────────
   Attribution capture — UTM + referrer + landing URL.

   Why: every lead needs to be tied back to the marketing channel that
   produced it so we can compute cost-per-lead and ROAS per channel.
   Without this, the funnel is a black box.

   How it works:
   - On first page load, captureFirstTouch() reads UTM params from the
     URL + referrer and persists them to sessionStorage. It only writes
     once per session ("first-touch attribution").
   - getAttribution() reads them back into a flat object you splat into
     any form payload before submitting.
   - SAFE on the server — every function no-ops when window is undefined.
   ────────────────────────────────────────────────────────────────── */

const KEY = 'vcv-attribution-v1';

export interface Attribution {
  utm_source?:   string;
  utm_medium?:   string;
  utm_campaign?: string;
  utm_term?:     string;
  utm_content?:  string;
  gclid?:        string;  // Google Ads click id
  fbclid?:       string;  // Meta / Facebook click id
  msclkid?:      string;  // Microsoft Ads click id
  referrer?:     string;  // document.referrer at first touch
  landingPath?:  string;  // first path on this site
  capturedAt?:   string;  // ISO timestamp
}

const UTM_KEYS: (keyof Attribution)[] = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'gclid', 'fbclid', 'msclkid',
];

/** Read attribution from the current URL. Returns an empty object if nothing tracked. */
function readFromUrl(): Attribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const out: Attribution = {};
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) out[k] = v;
  }
  return out;
}

/** Capture once per session. No-op if already captured. */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const fromUrl = readFromUrl();
    // Only persist if we actually have something — otherwise leave it for
    // a later visit that arrives with UTMs.
    const hasAnyUtm = Object.keys(fromUrl).length > 0;
    if (!hasAnyUtm) return;
    const payload: Attribution = {
      ...fromUrl,
      referrer:    document.referrer || undefined,
      landingPath: window.location.pathname || undefined,
      capturedAt:  new Date().toISOString(),
    };
    sessionStorage.setItem(KEY, JSON.stringify(payload));
  } catch { /* sessionStorage may be unavailable (Safari private mode etc) */ }
}

/** Read stored first-touch attribution for splatting into a form payload. */
export function getAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Attribution;
  } catch { return {}; }
}
