import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  // Defense in depth: middleware already gates this route, but verify the
  // cookie here too in case middleware config drifts.
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token  = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!secret || !(await verifySessionToken(secret, token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { query, limit = 40 } = await req.json();

  const key = process.env.OUTSCRAPER_API_KEY;
  if (!key) return NextResponse.json({ error: 'OUTSCRAPER_API_KEY not set' }, { status: 500 });

  try {
    const res = await fetch(
      `https://api.app.outscraper.com/maps/search-v3?query=${encodeURIComponent(query)}&limit=${limit}&language=en&async=false`,
      { headers: { 'X-API-KEY': key } },
    );

    if (!res.ok) {
      const txt = await res.text();
      return NextResponse.json({ error: `Outscraper error: ${txt}` }, { status: res.status });
    }

    const raw = await res.json();

    // Flatten nested arrays Outscraper sometimes returns
    const results: any[] = Array.isArray(raw.data)
      ? raw.data.flat()
      : [];

    // Normalize and score each lead
    const leads = results.map((r: any) => {
      const site   = (r.site || '').toLowerCase();
      const noSite = !site || site === 'null';
      const isSocial  = ['facebook.', 'instagram.', 'yelp.', 'nextdoor.'].some(s => site.includes(s));
      const isBuilder = ['.wix.', 'squarespace.', 'weebly.', '.godaddy', 'wixsite'].some(s => site.includes(s));

      const heat: 'hot' | 'warm' | 'review' =
        noSite || isSocial  ? 'hot'  :
        isBuilder           ? 'warm' : 'review';

      const phone = r.phone_number || r.phone || '';
      const emails: string[] = r.emails_and_contacts?.emails || [];

      return {
        id:          r.place_id || `${r.name}-${phone}`,
        name:        r.name || '',
        phone,
        email:       emails[0] || '',
        website:     r.site || '',
        address:     r.full_address || r.address || '',
        city:        r.city || '',
        state:       r.state || '',
        rating:      r.rating || 0,
        reviews:     r.reviews || 0,
        category:    r.category || '',
        ownerName:   r.owner_name || '',
        heat,
        siteReason:  noSite ? 'No website' : isSocial ? 'Social media only' : isBuilder ? 'DIY website builder' : 'Has website',
      };
    });

    // Sort: hot first, then warm, then review
    leads.sort((a, b) => {
      const order = { hot:0, warm:1, review:2 };
      return order[a.heat] - order[b.heat];
    });

    return NextResponse.json({ leads, total: leads.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
