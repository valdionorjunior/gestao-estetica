import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = ['/login', '/'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths and Next.js internals
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Auth is stored in sessionStorage (client-side only).
  // We use a cookie set by the client to indicate authentication on the server.
  // If cookie not present, redirect to login.
  const authCookie = request.cookies.get('ns-auth-active');
  if (!authCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
