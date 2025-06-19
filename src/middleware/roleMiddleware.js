
import { NextResponse } from 'next/server';
import { rolePermissions } from '@/lib/rolePermissions';

export function roleMiddleware(request) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get('role')?.value;

  const matchedRoute = Object.keys(rolePermissions).find(route =>
    pathname.startsWith(route)
  );

  const allowedRoles = rolePermissions[matchedRoute];

  if (matchedRoute && (!role || !allowedRoles.includes(role))) {
    return NextResponse.redirect(new URL('/unauthorized', request.url));
  }

  return null;
}
