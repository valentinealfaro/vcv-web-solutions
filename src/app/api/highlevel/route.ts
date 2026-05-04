import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

// Private Integration tokens use v2 API
const HL_BASE = 'https://rest.gohighlevel.com/v2';

export async function POST(req: NextRequest) {
  // Defense in depth: middleware already gates this route, but verify the
  // cookie here too in case middleware config drifts.
  const secret = process.env.ADMIN_SESSION_SECRET;
  const token  = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (!secret || !(await verifySessionToken(secret, token))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { leads } = await req.json() as { leads: any[] };

  const key        = process.env.HIGHLEVEL_API_KEY;
  const locationId = process.env.HIGHLEVEL_LOCATION_ID;

  if (!key || !locationId) {
    return NextResponse.json({ error: 'HIGHLEVEL_API_KEY or HIGHLEVEL_LOCATION_ID not set' }, { status: 500 });
  }

  const results: { id: string; status: 'ok' | 'error'; hlId?: string; error?: string }[] = [];

  for (const lead of leads) {
    try {
      const tags = [
        'vcv-cold-prospect',
        lead.heat === 'hot'  ? 'no-website'  :
        lead.heat === 'warm' ? 'bad-website' : 'has-website',
        (lead.category || 'local-business').toLowerCase().replace(/\s+/g,'-').slice(0,30),
      ].filter(Boolean);

      const nameParts = (lead.ownerName || lead.name || 'Business Owner').trim().split(' ');
      const firstName = nameParts[0] || 'Business';
      const lastName  = nameParts.slice(1).join(' ') || 'Owner';

      const body: Record<string, any> = {
        firstName,
        lastName,
        companyName: lead.name,
        phone:       lead.phone      || undefined,
        email:       lead.email      || undefined,
        website:     lead.website    || undefined,
        address1:    lead.address    || undefined,
        city:        lead.city       || undefined,
        state:       lead.state      || undefined,
        source:      'Outscraper — VCV Lead Finder',
        tags,
        locationId,
      };

      // Remove undefined keys
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);

      const res = await fetch(`${HL_BASE}/contacts/`, {
        method:  'POST',
        headers: {
          'Authorization':  `Bearer ${key}`,
          'Content-Type':   'application/json',
          'Version':        '2021-07-28',
        },
        body: JSON.stringify(body),
      });

      const responseText = await res.text();
      let responseData: any = {};
      try { responseData = JSON.parse(responseText); } catch {}

      if (res.ok) {
        results.push({ id: lead.id, status: 'ok', hlId: responseData.contact?.id });
      } else if (res.status === 422 || res.status === 400) {
        // Duplicate or validation — treat as ok so it doesn't block the batch
        results.push({ id: lead.id, status: 'ok', error: 'duplicate or already exists' });
      } else {
        results.push({ id: lead.id, status: 'error', error: `${res.status}: ${responseText.slice(0,200)}` });
      }

      // Respect HL rate limit (~10 req/s)
      await new Promise(r => setTimeout(r, 120));

    } catch (e: any) {
      results.push({ id: lead.id, status: 'error', error: e.message });
    }
  }

  const ok  = results.filter(r => r.status === 'ok').length;
  const err = results.filter(r => r.status === 'error').length;

  // Log first error for debugging
  const firstErr = results.find(r => r.status === 'error');
  console.log(`HL push: ${ok} ok, ${err} errors`, firstErr?.error || '');

  return NextResponse.json({ ok, err, results, firstError: firstErr?.error });
}
