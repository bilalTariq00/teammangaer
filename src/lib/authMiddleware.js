import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export function authMiddleware(handler) {
  return async (request, context) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return NextResponse.json(
          { success: false, error: 'Access token required' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token);
      
      // Add user info to request
      request.user = decoded;
      
      return handler(request, context);
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 401 }
      );
    }
  };
}

export function roleMiddleware(allowedRoles) {
  return function(handler) {
    return authMiddleware(async (request, context) => {
      const userRole = request.user.role;
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { success: false, error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return handler(request, context);
    });
  };
}
