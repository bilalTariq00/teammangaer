import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Admin-only routes
  const adminRoutes = ['/dashboard', '/users', '/links', '/settings'];
  
  // User-only routes  
  const userRoutes = ['/user-dashboard', '/user-tasks'];
  
  // Check if the current path is an admin route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  
  // Get user role from cookies or headers (you might need to adjust this based on your auth implementation)
  const userRole = request.cookies.get('user-role')?.value;
  
  // If it's an admin route and user is not admin, redirect to user dashboard
  if (isAdminRoute && userRole === 'user') {
    return NextResponse.redirect(new URL('/user-dashboard', request.url));
  }
  
  // If it's a user route and user is admin, redirect to admin dashboard
  if (isUserRoute && userRole === 'admin') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*', 
    '/links/:path*',
    '/settings/:path*',
    '/user-dashboard/:path*',
    '/user-tasks/:path*'
  ]
};
