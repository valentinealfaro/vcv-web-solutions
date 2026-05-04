import { NextRequest, NextResponse } from 'next/server';
import { isPasswordCorrect, signSessionToken, ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL } from '@/lib/adminAuth';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const FAIL_DELAY_MS = 600; // constant delay so brute-force timing leaks nothing

export async function POST(req: NextRequest) {
  const start = Date.now();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !secret) {
    return NextResponse.json(
      { error: 'Server misconfigured: ADMIN_PASSWORD or ADMIN_SESSION_SECRET not set' },
      { status: 503 },
    );
  }

  let password = '';
  try {
    const body = await req.json();
    if (typeof body?.password === 'string') password = body.password;
  } catch { /* malformed body — falls through to bad-password branch */ }

  const ok = isPasswordCorrect(password, adminPassword);

  if (!ok) {
    const elapsed = Date.now() - start;
    if (elapsed < FAIL_DELAY_MS) {
      await new Promise(r => setTimeout(r, FAIL_DELAY_MS - elapsed));
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  const token = await signSessionToken(secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_SESSION_TTL,
  });
  return res;
}
