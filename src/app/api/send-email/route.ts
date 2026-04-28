import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, business, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0f172a;color:#f1f5f9;padding:32px;border-radius:12px;">
        <h2 style="color:#60a5fa;margin:0 0 24px;">New Contact Form Submission</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;width:140px;">Name</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;font-weight:700;">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;">Business</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;">${business || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;">Email</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;"><a href="mailto:${email}" style="color:#60a5fa;">${email}</a></td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #1e293b;color:#94a3b8;">Phone</td><td style="padding:10px 0;border-bottom:1px solid #1e293b;">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#94a3b8;vertical-align:top;">Message</td><td style="padding:10px 0;line-height:1.6;">${message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <p style="margin-top:32px;font-size:12px;color:#475569;">Sent from vcv-web-solutions.vercel.app</p>
      </div>
    `;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      // Dev fallback — log and return success so local dev works without key
      console.log('[send-email] No RESEND_API_KEY — form data:', { name, business, email, phone, message });
      return NextResponse.json({ ok: true });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'VCV Web Solutions <onboarding@resend.dev>',
        to: ['info@vcvservices.com'],
        reply_to: email,
        subject: `New contact from ${name}${business ? ` — ${business}` : ''}`,
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
