import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    await connectDB();
    
    const { name, email, password, role, taskRole, workerType } = await request.json();

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const userData = {
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'user',
      taskRole: taskRole || 'viewer',
      workerType: workerType || 'permanent'
    };

    const user = new User(userData);
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id,
      email: user.email,
      role: user.role,
      taskRole: user.taskRole,
      name: user.name
    });

    // Return user data without password
    const userResponse = user.toJSON();

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: userResponse,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
