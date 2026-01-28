import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip login page
  if (pathname === '/admin/login') {
    const response = NextResponse.next();
    response.headers.set('X-Middleware-Debug', 'login-page-skipped');
    return response;
  }

  // Check for auth cookie
  const token = request.cookies.get('access_token');
  const allCookies = request.cookies.getAll().map(c => c.name).join(',');

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    loginUrl.searchParams.set('debug', `no-token-cookies:${allCookies || 'none'}`);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next();
  response.headers.set('X-Middleware-Debug', 'token-found');
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
