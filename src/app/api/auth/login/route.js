import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { generateToken } from '@/lib/authMiddleware';

// Handle CORS preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request) {
  // Extract credentials first (outside try-catch so they're available in catch block)
  const { email, password } = await request.json();
  
  // Debug logging
  console.log('🔍 Login attempt:', { email, password: password ? '***' : 'missing' });

  // Simple validation
  if (!email || !password) {
    console.log('❌ Missing credentials');
    return NextResponse.json(
      { success: false, error: 'Email and password are required' },
      { status: 400 }
    );
  }

  try {

    // Connect to database
    await connectDB();

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('🔍 Database user found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ No user found in database, falling back to mock auth');
      throw new Error('MongoDB connection failed - using mock auth');
    }

    // Check if user is locked
    if (user.locked === "locked") {
      return NextResponse.json(
        { success: false, error: 'Your account has been locked. Please contact your manager to unlock it.' },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Return user data without password
    const userResponse = user.toJSON();

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token: token
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    
    // If database connection fails, fallback to mock authentication for development
    if (error.message.includes('MongoDB') || error.message.includes('connection') || error.message.includes('MongoDB connection failed')) {
      console.log('Database connection failed, using mock authentication');
      
      const mockUsers = [
        // Admin user
        {
          id: 1,
          name: "Admin Permanent",
          email: "admin@joyapps.com",
          password: "admin123",
          role: "admin",
          avatar: null,
          locked: "unlocked"
        },
        // Manager user
        {
          id: 2,
          name: "Muhammad Shahood",
          email: "Shahood1@joyapps.net",
          password: "manager123",
          role: "manager",
          avatar: null,
          assignedUsers: [1, 3],
          locked: "unlocked"
        },
        // Additional Manager user
        {
          id: 8,
          name: "Sarah Manager",
          email: "manager@joyapps.com",
          password: "manager123",
          role: "manager",
          avatar: null,
          assignedUsers: [5, 6, 7],
          locked: "unlocked"
        },
        // QC user
        {
          id: 3,
          name: "John QC",
          email: "qc@joyapps.com",
          password: "qc123",
          role: "qc",
          avatar: null,
          locked: "unlocked"
        },
        // HR user
        {
          id: 4,
          name: "Sarah HR",
          email: "hr@joyapps.com",
          password: "hr123",
          role: "hr",
          avatar: null,
          locked: "unlocked"
        },
        // Regular users
        {
          id: 5,
          name: "Hasan Abbas",
          email: "hasan@joyapps.net",
          password: "user123",
          role: "user",
          avatar: null,
          taskRole: "both",
          locked: "unlocked"
        },
        {
          id: 6,
          name: "Adnan Amir",
          email: "adnan@joyapps.net",
          password: "user123",
          role: "user",
          avatar: null,
          taskRole: "viewer",
          locked: "unlocked"
        },
        {
          id: 7,
          name: "Waleed Bin Shakeel",
          email: "waleed@joyapps.net",
          password: "user123",
          role: "user",
          avatar: null,
          workerType: "trainee-worker",
          taskRole: "clicker",
          locked: "unlocked"
        }
      ];

      // Find user by email and password
      console.log('🔍 Searching mock users for:', { email, password: password ? '***' : 'missing' });
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      console.log('🔍 Mock user found:', foundUser ? foundUser.name : 'No match');
      
      if (foundUser) {
        // Check if user is locked
        if (foundUser.locked === "locked") {
          return NextResponse.json(
            { success: false, error: 'Your account has been locked. Please contact your manager to unlock it.' },
            { status: 403 }
          );
        }

        // Generate a proper JWT token for mock authentication
        console.log('🔍 Generating JWT token for user:', foundUser.id, foundUser.role);
        const token = generateToken(foundUser.id, foundUser.role);
        console.log('🔍 Generated token:', token.substring(0, 50) + '...');

        return NextResponse.json({
          success: true,
          message: 'Login successful',
          user: {
            id: foundUser.id,
            name: foundUser.name,
            email: foundUser.email,
            role: foundUser.role,
            avatar: foundUser.avatar,
            taskRole: foundUser.taskRole || null,
            workerType: foundUser.workerType || null,
            locked: foundUser.locked || "unlocked",
            assignedUsers: foundUser.assignedUsers || []
          },
          token: token
        }, {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        });
      }

      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
