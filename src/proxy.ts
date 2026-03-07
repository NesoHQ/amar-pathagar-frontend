import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ROUTES, AUTH_COOKIE_NAME } from '@/constants/routes';

const isRouteMatch = (pathname: string, routes: readonly string[]): boolean => {
  return routes.some(route => pathname === route || pathname.startsWith(route + '/'));
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check authentication via cookie
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = !!authToken;

  // Route type
  const isPublicRoute = isRouteMatch(pathname, ROUTES.PUBLIC);
  const isAuthRoute = isRouteMatch(pathname, ROUTES.AUTH);
  const isProtectedRoute = isRouteMatch(pathname, ROUTES.PROTECTED);

  // Allow public routes for everyone
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect unauthenticated users to login for protected routes
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};
