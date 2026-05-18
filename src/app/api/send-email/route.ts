import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/* Map raw form keys to nicer labels in the email. Fields not in this map
   are still rendered, just in their raw key form. */
const LABELS: Record<string, string> = {
  name:         'Name',
  email:        'Email',
  phone:        'Phone',
  business:     'Business',
  businessName: 'Business Name',
  businessType: 'Business Type',
  currentSite:  'Current Website',
  goal:         'Main Goal',
  message:      'Message',
};

const escapeHtml = (s: any) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as Record<string, any>;
    const { source = 'Contact Form', ...fields } = body;

    if (!fields.name || !fields.email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    /* Build the rendered table dynamically — every non-empty field shows up */
    const rows = Object.entries(fields)
      .filter(([k, v]) => v !== '' && v !== null && v !== undefined && k !== 'createdAt' && k !== 'status')
      .map(([k, v]) => {
        const label = LABELS[k] || k.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase());
        const isLink = k === 'email';
        const isPhone = k === 'phone';
        const isUrl = k === 'currentSite' && /^https?:\/\//i.test(String(v));
        const value = isLink
          ? `<a href="mailto:${escapeHtml(v)}" style="color:#60a5fa;">${escapeHtml(v)}</a>`
          : isPhone
          ? `<a href="tel:${escapeHtml(v)}" style="color:#60a5fa;">${escapeHtml(v)}</a>`
          : isUrl
          ? `<a href="${escapeHtml(v)}" style="color:#60a5fa;" target="_blank" rel="noopener noreferrer">${escapeHtml(v)}</a>`
          : escapeHtml(v).replace(/\n/g, '<br>');
        return `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;width:160px;vertical-align:top;">${label}</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e293b;font-weight:600;line-height:1.5;">${value}</td>
        </tr>`;
      })
      .join('');

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;">
        <p style="margin:0 0 4px;color:#60a5fa;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">${escapeHtml(source)}</p>
        <h2 style="color:#f1f5f9;margin:0 0 24px;font-size:22px;">New ${escapeHtml(source)} submission</h2>
        <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows}</table>
        <a href="https://www.vcvwebsolutions.com/admin/leads" style="display:inline-block;margin-top:24px;background:#3b82f6;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:13px;font-weight:700;">View in Admin Dashboard →</a>
        <p style="margin-top:24px;font-size:11px;color:#475569;">Sent from vcvwebsolutions.com — reply directly to this email to respond to ${escapeHtml(fields.name)}.</p>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.log('[send-email] No RESEND_API_KEY — form data:', fields);
      return NextResponse.json({ ok: true, dev: true });
    }

    const subjectName = fields.name || 'unknown';
    const subjectBiz = fields.businessName || fields.business;
    const subject = `${source}: ${subjectName}${subjectBiz ? ` — ${subjectBiz}` : ''}`;

    /* From address: prefer RESEND_FROM (e.g. "VCV <leads@vcvservices.com>")
       once the vcvservices.com domain is verified in Resend. Falls back to
       the resend.dev sandbox address otherwise — works for dev, but real
       traffic should use the verified domain to avoid spam folder issues. */
    const fromAddress = process.env.RESEND_FROM
      || 'VCV Web Solutions <onboarding@resend.dev>';

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromAddress,
        to: ['info@vcvservices.com'],
        reply_to: fields.email,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[send-email] Resend error:', err);
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[send-email]', e);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
}
