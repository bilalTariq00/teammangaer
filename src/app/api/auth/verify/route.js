import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);
    
    // Find user by ID from token
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user is locked
    if (user.locked === 'locked') {
      return NextResponse.json(
        { success: false, error: 'Account is locked' },
        { status: 403 }
      );
    }

    // Return user data without password
    const userData = user.toJSON();

    return NextResponse.json({
      success: true,
      user: userData
    });

  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
