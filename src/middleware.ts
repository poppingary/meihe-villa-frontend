import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Let all requests pass through
  // Authentication is handled client-side by AuthProvider
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
