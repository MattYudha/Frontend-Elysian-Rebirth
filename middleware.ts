import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Paths that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/editor',
  '/admin',
  '/action-center',
  '/chat',
];

// Paths that are auth-related (login, register, etc.)
const AUTH_PATHS = [
  '/login',
  '/register',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // CSRF Protection for mutating API requests (POST, PUT, PATCH, DELETE)
  if (pathname.startsWith('/api/') && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    
    if (origin) {
      try {
        const originURL = new URL(origin);
        // Enforce same-origin policy checks
        if (originURL.host !== host) {
          return new NextResponse(
            JSON.stringify({ error: 'CSRF Protection: Forbidden origin mismatch' }),
            { status: 403, headers: { 'Content-Type': 'application/json' } }
          );
        }
      } catch (e) {
        return new NextResponse(
          JSON.stringify({ error: 'CSRF Protection: Malformed origin header' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }
  }

  // Bypass auth checks for all API endpoints to let nextResponse proxy them
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if path is protected
  const isProtected = PROTECTED_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  // Check if path is auth-related
  const isAuthPath = AUTH_PATHS.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );

  // Use refresh_token cookie as the session indicator.
  // access_token is short-lived and may not always be present,
  // but refresh_token is set by BFF login and lasts 7 days.
  const refreshToken = request.cookies.get('refresh_token')?.value;
  const isAuthenticated = !!refreshToken;

  // Redirect unauthenticated users from protected pages to login
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle session expiration loop: if arriving at login with session_expired,
  // we MUST clear the cookie in the middleware response so we don't infinitely redirect back.
  if (pathname === '/login' && request.nextUrl.searchParams.get('session_expired') === 'true') {
    const response = NextResponse.next();
    response.cookies.delete('refresh_token');
    response.cookies.delete('tenant_id');
    return response;
  }

  // Redirect authenticated users from auth pages to dashboard
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths including API routes but excluding static assets:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (matching extensions)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|eot)$).*)',
  ],
};
