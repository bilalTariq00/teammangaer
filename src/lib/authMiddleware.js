import jwt from 'jsonwebtoken';
import connectDB from './mongodb';
import User from '@/models/User';

// Use a consistent JWT secret across all environments
const JWT_SECRET = process.env.JWT_SECRET || 'joyapps-super-secret-key-2024-production-ready';

// Debug logging for JWT secret
console.log('🔍 JWT Secret:', JWT_SECRET ? 'Set' : 'Using default');
console.log('🔍 JWT Secret value:', JWT_SECRET.substring(0, 20) + '...');

// Middleware to verify JWT token and get user
export async function verifyToken(request) {
  try {
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No valid authorization header');
      return { success: false, error: 'No token provided' };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log('🔍 Token:', token.substring(0, 20) + '...');
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified:', { userId: decoded.userId, role: decoded.role });
      
      // Get user from database to ensure they still exist and are not locked
      await connectDB();
      
      // Handle both ObjectId and numeric userIds
      let user = null;
      if (typeof decoded.userId === 'number') {
        // For numeric IDs, try to find user by email based on role
        console.log('🔍 Numeric userId detected, looking up real user data');
        
        let userEmail;
        switch (decoded.role) {
          case 'hr':
            userEmail = 'hr@joyapps.com';
            break;
          case 'admin':
            userEmail = 'admin@joyapps.com';
            break;
          case 'manager':
            userEmail = 'Shahood1@joyapps.net';
            break;
          case 'qc':
            userEmail = 'qc@joyapps.com';
            break;
          default:
            userEmail = 'test@joyapps.com';
        }
        
        // Look up user by email instead of ID
        user = await User.findOne({ email: userEmail }).select('-password');
        console.log('🔍 Real user found by email:', user ? 'Yes' : 'No');
        
        if (!user) {
          console.log('❌ Real user not found, falling back to mock data');
          const mockUser = {
            _id: decoded.userId,
            name: decoded.role === 'hr' ? 'Sarah HR' : 
                  decoded.role === 'admin' ? 'Admin Permanent' :
                  decoded.role === 'manager' ? 'Muhammad Shahood' :
                  decoded.role === 'qc' ? 'John QC' : 'Test User',
            email: userEmail,
            role: decoded.role,
            locked: 'unlocked'
          };
          return { success: true, user: mockUser };
        }
      } else {
        // For ObjectId userIds, lookup in database
        user = await User.findById(decoded.userId).select('-password');
        console.log('🔍 Database user found:', user ? 'Yes' : 'No');
      }
      
      if (!user) {
        console.log('❌ User not found in database');
        return { success: false, error: 'User not found' };
      }
      
      if (user.locked === 'locked') {
        console.log('❌ User account is locked');
        return { success: false, error: 'User account is locked' };
      }
      
      console.log('✅ User authenticated successfully');
      return { success: true, user };
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      console.log('❌ JWT Error details:', jwtError);
      console.log('❌ Token being verified:', token.substring(0, 50) + '...');
      console.log('❌ JWT Secret being used:', JWT_SECRET);
      return { success: false, error: 'Invalid token' };
    }
    } catch (error) {
    console.error('Token verification error:', error);
    return { success: false, error: 'Token verification failed' };
  }
}

// Middleware to check if user has required role
export function requireRole(allowedRoles) {
  return async function(request) {
    const tokenResult = await verifyToken(request);
    
    if (!tokenResult.success) {
      return {
        success: false,
        error: tokenResult.error,
        status: 401
      };
    }
    
    const user = tokenResult.user;
    
    if (!allowedRoles.includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions',
        status: 403
      };
    }
    
    return {
      success: true,
      user
    };
  };
}

// Role-based access control for user creation
export function canCreateUserRole(currentUserRole, targetRole) {
  const rolePermissions = {
    admin: ['admin', 'manager', 'qc', 'hr', 'user'], // Admin can create all roles
    hr: ['user', 'qc'], // HR can only create workers and QC
    manager: ['user'], // Manager can only create workers (if needed)
    qc: [], // QC cannot create users
    user: [] // Regular users cannot create users
  };
  
  return rolePermissions[currentUserRole]?.includes(targetRole) || false;
}

// Validate user creation permissions
export function validateUserCreation(currentUser, targetUserData) {
  const { role: currentRole } = currentUser;
  const { role: targetRole } = targetUserData;
  
  // Check if current user can create the target role
  if (!canCreateUserRole(currentRole, targetRole)) {
    return {
      success: false,
      error: `You don't have permission to create users with role: ${targetRole}`
    };
  }
  
  // Additional validations based on role
  if (currentRole === 'hr') {
    // HR can only create workers and QC
    if (!['user', 'qc'].includes(targetRole)) {
      return {
        success: false,
        error: 'HR can only create workers and QC users'
      };
    }
    
    // HR cannot create users with manager or admin roles
    if (['manager', 'admin'].includes(targetRole)) {
      return {
        success: false,
        error: 'HR cannot create manager or admin users'
      };
    }
  }
  
  return { success: true };
}

// Generate JWT token
export function generateToken(userId, role) {
  return jwt.sign(
    { userId, role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

// Generate refresh token
export function generateRefreshToken(userId) {
  return jwt.sign(
    { userId, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}