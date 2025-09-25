import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Admin-only routes
  const adminRoutes = ['/dashboard', '/links', '/settings', '/campaigns', '/create-campaign'];
  
  // Admin, HR, and QC shared routes (attendance management)
  const attendanceManagementRoutes = ['/admin-attendance'];
  
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
  
  // Role-specific attendance routes
  const attendanceRoutes = ['/user-attendance', '/qc-attendance', '/hr-attendance', '/manager-attendance'];
  
  // Shared routes (accessible by all roles)
  const sharedRoutes = ['/user-personal-info'];
  
  // Check if the current path matches any role-specific route
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAttendanceManagementRoute = attendanceManagementRoutes.some(route => pathname.startsWith(route));
  const isUserManagementRoute = userManagementRoutes.some(route => pathname.startsWith(route));
  const isManagerRoute = managerRoutes.some(route => pathname.startsWith(route));
  const isQCRoute = qcRoutes.some(route => pathname.startsWith(route));
  const isHRRoute = hrRoutes.some(route => pathname.startsWith(route));
  const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
  const isAttendanceRoute = attendanceRoutes.some(route => pathname.startsWith(route));
  const isSharedRoute = sharedRoutes.some(route => pathname.startsWith(route));
  
  // Get user role from cookies or headers
  const userRole = request.cookies.get('user-role')?.value;
  
  // Debug logging
  console.log('Middleware Debug:', {
    pathname,
    userRole,
    isSharedRoute,
    isAdminRoute,
    isAttendanceManagementRoute,
    isManagerRoute,
    isQCRoute,
    isHRRoute,
    isUserRoute
  });
  
  // Allow access to attendance routes for all authenticated users
  if (isAttendanceRoute && userRole) {
    console.log('Allowing access to attendance route:', pathname);
    return NextResponse.next();
  }
  
  // Allow access to attendance management routes for admin, HR, and QC
  if (isAttendanceManagementRoute && (userRole === 'admin' || userRole === 'hr' || userRole === 'qc')) {
    console.log('Allowing access to attendance management route:', pathname);
    return NextResponse.next();
  }
  
  // Allow access to shared routes for all users (even if not logged in)
  if (isSharedRoute) {
    console.log('Allowing access to shared route:', pathname);
    return NextResponse.next();
  }
  
  // If no user role and trying to access protected routes, redirect to login
  if (!userRole && (isAdminRoute || isAttendanceManagementRoute || isManagerRoute || isQCRoute || isHRRoute || isUserRoute)) {
    console.log('No user role, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
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
  
  // Redirect for attendance management routes (admin, HR, QC only)
  if (isAttendanceManagementRoute && !['admin', 'hr', 'qc'].includes(userRole)) {
    if (userRole === 'manager') {
      return NextResponse.redirect(new URL('/manager-dashboard', request.url));
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
    '/hr-dashboard/:path*',
    '/hr-employees/:path*',
    '/hr-reports/:path*',
    '/hr-settings/:path*',
    '/user-dashboard/:path*',
    '/user-tasks/:path*',
    '/user-attendance/:path*',
    '/qc-attendance/:path*',
    '/hr-attendance/:path*',
    '/manager-attendance/:path*',
    '/admin-attendance/:path*',
    '/user-personal-info/:path*'
  ]
};
