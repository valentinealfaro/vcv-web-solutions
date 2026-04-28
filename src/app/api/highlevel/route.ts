import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const HL_BASE = 'https://rest.gohighlevel.com/v1';

export async function POST(req: NextRequest) {
  const { leads } = await req.json() as { leads: any[] };

  const key        = process.env.HIGHLEVEL_API_KEY;
  const locationId = process.env.HIGHLEVEL_LOCATION_ID;

  if (!key || !locationId) {
    return NextResponse.json({ error: 'HIGHLEVEL_API_KEY or HIGHLEVEL_LOCATION_ID not set' }, { status: 500 });
  }

  const results: { id: string; status: 'ok' | 'error'; hlId?: string; error?: string }[] = [];

  for (const lead of leads) {
    try {
      // Build tag list based on heat score
      const tags = [
        'vcv-cold-prospect',
        lead.heat === 'hot'  ? 'no-website'       :
        lead.heat === 'warm' ? 'bad-website'       : 'has-website',
        lead.category?.toLowerCase().replace(/\s+/g, '-').slice(0, 30) || 'local-business',
      ].filter(Boolean);

      const nameParts = (lead.ownerName || lead.name || 'Business Owner').trim().split(' ');
      const firstName = nameParts[0] || 'Business';
      const lastName  = nameParts.slice(1).join(' ') || 'Owner';

      const body: Record<string, any> = {
        firstName,
        lastName,
        companyName: lead.name,
        phone:       lead.phone,
        email:       lead.email || undefined,
        website:     lead.website || undefined,
        address1:    lead.address || undefined,
        city:        lead.city   || undefined,
        state:       lead.state  || undefined,
        source:      'Outscraper — VCV Lead Finder',
        tags,
        locationId,
        // Custom note with full context
        notes: [
          `Business: ${lead.name}`,
          `Category: ${lead.category}`,
          `Website status: ${lead.siteReason}`,
          `Rating: ${lead.rating} (${lead.reviews} reviews)`,
          `Heat: ${lead.heat.toUpperCase()}`,
          `Address: ${lead.address}`,
        ].join('\n'),
      };

      // Remove undefined keys
      Object.keys(body).forEach(k => body[k] === undefined && delete body[k]);

      const res = await fetch(`${HL_BASE}/contacts/`, {
        method:  'POST',
        headers: {
          Authorization:  `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        const d = await res.json();
        results.push({ id: lead.id, status: 'ok', hlId: d.contact?.id });
      } else {
        const txt = await res.text();
        // 422 usually means duplicate contact — treat as ok
        if (res.status === 422) {
          results.push({ id: lead.id, status: 'ok', error: 'duplicate — already in HL' });
        } else {
          results.push({ id: lead.id, status: 'error', error: txt });
        }
      }

      // HL rate limit: ~10 req/s — small delay between contacts
      await new Promise(r => setTimeout(r, 120));

    } catch (e: any) {
      results.push({ id: lead.id, status: 'error', error: e.message });
    }
  }

  const ok  = results.filter(r => r.status === 'ok').length;
  const err = results.filter(r => r.status === 'error').length;

  return NextResponse.json({ ok, err, results });
}
