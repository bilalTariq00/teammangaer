import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Admin-only routes
  const adminRoutes = ['/dashboard', '/links', '/settings', '/campaigns', '/create-campaign'];
  
  // Admin and HR shared routes (user management)
  const userManagementRoutes = ['/users'];
  
  // Manager-only routes
  const managerRoutes = ['/manager-dashboard', '/manager-team', '/manager-performance', '/manager-settings'];
  
  // QC-only routes
  const qcRoutes = ['/qc-dashboard', '/qc-tasks', '/qc-reports', '/qc-settings'];
  
  // HR-only routes
  const hrRoutes = ['/hr-dashboard', '/hr-employees', '/hr-reports', '/hr-settings'];
  
  // User-only routes  
  const userRoutes = ['/user-dashboard', '/user-tasks'];
  
  // Check if the current path matches any role-specific route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isUserManagementRoute = userManagementRoutes.some(route => pathname.startsWith(route));
  const isManagerRoute = managerRoutes.some(route => pathname.startsWith(route));
  const isQCRoute = qcRoutes.some(route => pathname.startsWith(route));
  const isHRRoute = hrRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  
  // Get user role from cookies or headers
  const userRole = request.cookies.get('user-role')?.value;
  
  // Redirect based on role and route access
  if (isAdminRoute && userRole !== 'admin') {
    if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
    } else if (userRole === 'qc') {
      return NextResponse.redirect(new URL('/qc-dashboard', request.url));
    } else if (userRole === 'hr') {
      return NextResponse.redirect(new URL('/hr-dashboard', request.url));
    } else if (userRole === 'user') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }
  
  // User management routes (accessible by admin and HR)
  if (isUserManagementRoute && userRole !== 'admin' && userRole !== 'hr') {
    if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
    } else if (userRole === 'qc') {
      return NextResponse.redirect(new URL('/qc-dashboard', request.url));
    } else if (userRole === 'user') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }
  
  if (isManagerRoute && userRole !== 'manager') {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userRole === 'qc') {
      return NextResponse.redirect(new URL('/qc-dashboard', request.url));
    } else if (userRole === 'user') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }
  
  if (isQCRoute && userRole !== 'qc') {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
    } else if (userRole === 'hr') {
      return NextResponse.redirect(new URL('/hr-dashboard', request.url));
    } else if (userRole === 'user') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }
  
  if (isHRRoute && userRole !== 'hr') {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
    } else if (userRole === 'qc') {
      return NextResponse.redirect(new URL('/qc-dashboard', request.url));
    } else if (userRole === 'user') {
      return NextResponse.redirect(new URL('/user-dashboard', request.url));
    }
  }
  
  if (isUserRoute && userRole !== 'user') {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
    } else if (userRole === 'qc') {
      return NextResponse.redirect(new URL('/qc-dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/users/:path*', 
    '/links/:path*',
    '/settings/:path*',
    '/campaigns/:path*',
    '/create-campaign/:path*',
    '/manager-dashboard/:path*',
    '/manager-team/:path*',
    '/manager-performance/:path*',
    '/manager-settings/:path*',
    '/qc-dashboard/:path*',
    '/qc-tasks/:path*',
    '/qc-reports/:path*',
    '/qc-settings/:path*',
    '/user-dashboard/:path*',
    '/user-tasks/:path*'
  ]
};
