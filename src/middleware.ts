import { NextRequest, NextResponse } from 'next/server';

/**
 * Strict 3-Role RBAC Edge Middleware
 * Roles: 'admin' | 'customer' | 'rider'
 * Zero eval, pure cookie parsing, zero runtime errors.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const rawRole = request.cookies.get('nukkad_role')?.value;

  // Normalize role
  let role = 'guest';
  if (rawRole) {
    const r = rawRole.toLowerCase().trim();
    if (r === 'admin') role = 'admin';
    else if (r === 'rider' || r === 'delivery_staff') role = 'rider';
    else if (r === 'customer') role = 'customer';
  }

  // 1. Redirect legacy /delivery routes to /rider
  if (pathname.startsWith('/delivery')) {
    const url = request.nextUrl.clone();
    url.pathname = '/rider';
    return NextResponse.redirect(url);
  }

  // 2. Protect /admin routes (ADMIN ONLY)
  if (pathname.startsWith('/admin')) {
    if (role === 'guest') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'rider' ? '/rider' : '/customer';
      url.searchParams.set('error', 'access_denied_admin_only');
      return NextResponse.redirect(url);
    }
  }

  // 3. Protect /rider routes (RIDER & ADMIN)
  if (pathname.startsWith('/rider')) {
    if (role === 'guest') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (role === 'customer') {
      const url = request.nextUrl.clone();
      url.pathname = '/customer';
      url.searchParams.set('error', 'access_denied_rider_only');
      return NextResponse.redirect(url);
    }
  }

  // 4. Protect /customer routes (CUSTOMER & ADMIN)
  if (pathname.startsWith('/customer')) {
    if (role === 'guest') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    if (role === 'rider') {
      const url = request.nextUrl.clone();
      url.pathname = '/rider';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/rider/:path*',
    '/customer/:path*',
    '/delivery/:path*',
  ],
};
