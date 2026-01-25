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
    return NextResponse.next();
  }

  // Check for auth cookie
  const token = request.cookies.get('access_token');

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
