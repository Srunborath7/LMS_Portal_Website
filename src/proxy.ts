import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Routes reachable without a session. Everything else requires a token.
 *
 * This is deliberately an allowlist: the previous protected-prefix list had to
 * be extended by hand for every new module, and each omission silently exposed
 * a route. Defaulting to "protected" means a forgotten entry fails closed.
 */
const PUBLIC_PATHS = ['/', 'auth/login', 'auth/register', 'auth/forgot-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + '/')
  );

  if (isPublic) return NextResponse.next();

  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const loginUrl = new URL('auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
