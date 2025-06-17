import { NextResponse } from 'next/server';
import { authMiddleware } from '@/middleware/authMiddleware';
import { roleMiddleware } from '@/middleware/roleMiddleware';

export function middleware(request) {
  const protectedPaths = [
    '/dashboard',
    '/contact',
    '/meeting',
    '/quotation',
    '/client',
    '/project',
    '/team',
    '/task',
    '/bug',
    '/report',
  ];

  const { pathname } = request.nextUrl;

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const auth = authMiddleware(request);
    if (auth) return auth;

    const role = roleMiddleware(request);
    if (role) return role;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/contact/:path*',
    '/meeting/:path*',
    '/quotation/:path*',
    '/client/:path*',
    '/project/:path*',
    '/team/:path*',
    '/task/:path*',
    '/bug/:path*',
    '/report/:path*',
  ],
};
