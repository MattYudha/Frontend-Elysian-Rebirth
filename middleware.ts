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
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
