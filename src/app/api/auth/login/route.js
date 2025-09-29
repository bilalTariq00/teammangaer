import { NextResponse } from 'next/server';

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
  try {
    const { email, password } = await request.json();

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Mock users for testing - matching AuthContext users
    const users = [
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
    const foundUser = users.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      // Check if user is locked
      if (foundUser.locked === "locked") {
        return NextResponse.json(
          { success: false, error: 'Your account has been locked. Please contact your manager to unlock it.' },
          { status: 403 }
        );
      }

      // Generate a simple token (in production, use proper JWT)
      const token = `token-${foundUser.id}-${Date.now()}`;

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

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
