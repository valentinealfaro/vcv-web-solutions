import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, ADMIN_COOKIE_NAME } from '@/lib/adminAuth';

export const config = {
  // Gate the admin UI plus the lead-pulling APIs. Login + logout endpoints
  // must stay public so an unauthed user can sign in.
  matcher: [
    '/admin/:path*',
    '/api/outscraper/:path*',
    '/api/highlevel/:path*',
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page is the one /admin route that must be reachable without auth.
  if (pathname === '/admin/login') return NextResponse.next();

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    // Fail closed if the secret is missing in production rather than silently
    // letting traffic through.
    return new NextResponse('Server misconfigured: ADMIN_SESSION_SECRET not set', { status: 503 });
  }

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  const ok = await verifySessionToken(secret, token);

  if (!ok) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
