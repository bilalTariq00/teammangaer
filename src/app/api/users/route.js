import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken, requireRole } from '@/lib/authMiddleware';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET /api/users - Get all users (Admin only)
export async function GET(request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const currentUser = authResult.user;

    // Check if user has permissions to create users
    if (!['admin', 'hr'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin or HR role required.' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get all users from database
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // Transform users for frontend
    const transformedUsers = users.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      workerType: user.workerType || '',
      status: user.status || 'trainee',
      taskRole: user.taskRole || 'viewer',
      locked: user.locked || 'unlocked',
      links: user.links || 0,
      assignedUsers: user.assignedUsers || [],
      defaultTasker: user.defaultTasker || 'none',
      createdAt: user.createdAt,
      created: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ') : 'Unknown'
    }));

    return NextResponse.json({
      success: true,
      data: transformedUsers,
      count: transformedUsers.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create new user (Admin only)
export async function POST(request) {
  try {
    // Verify authentication
    const authResult = await verifyToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status || 401 }
      );
    }

    const currentUser = authResult.user;

    // Check if user has permissions to create users
    if (!['admin', 'hr'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin or HR role required.' },
        { status: 403 }
      );
    }

    // Get request body
    const body = await request.json();
    const {
      name,
      email,
      password,
      role,
      workerType,
      status,
      taskRole,
      assignedUsers,
      defaultTasker
    } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, password, and role are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Role validation
    const validRoles = ['admin', 'manager', 'hr', 'qc', 'worker', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be one of: admin, manager, hr, qc, worker, user' },
        { status: 400 }
      );
    }

    // Role-specific creation restrictions
    if (currentUser.role === 'hr') {
      // HR can only create QC and Worker roles
      if (!['qc', 'user'].includes(role)) {
        return NextResponse.json(
          { success: false, error: 'Access denied. HR can only create QC and Worker users.' },
          { status: 403 }
        );
      }
    } else if (currentUser.role === 'admin') {
      // Admin can create all roles
      // No additional restrictions needed
    } else {
      // Other roles cannot create users
      return NextResponse.json(
        { success: false, error: 'Access denied. Only Admin and HR can create users.' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      workerType: workerType || '',
      status: status || 'trainee',
      taskRole: taskRole || 'viewer',
      locked: 'unlocked',
      links: 0,
      assignedUsers: assignedUsers || [],
      defaultTasker: defaultTasker || 'none',
      // Add other fields with defaults
      contactNumber: '',
      emergencyNumber: '',
      phoneNumber: '',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      dateOfBirth: '',
      socialSecurityNumber: '',
      bankAccount: '',
      benefits: '',
      notes: '',
      department: '',
      position: '',
      salary: 0,
      joinDate: new Date().toISOString().split('T')[0],
      performance: 0,
      attendance: 0,
      lastReview: '',
      vacationDay: '',
      avatar: null
    });

    await newUser.save();

    // Return user without password
    const userResponse = {
      id: newUser._id.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      workerType: newUser.workerType,
      status: newUser.status,
      taskRole: newUser.taskRole,
      locked: newUser.locked,
      links: newUser.links,
      assignedUsers: newUser.assignedUsers,
      defaultTasker: newUser.defaultTasker,
      createdAt: newUser.createdAt,
      created: new Date(newUser.createdAt).toISOString().slice(0, 19).replace('T', ' ')
    };

    return NextResponse.json({
      success: true,
      data: userResponse,
      message: 'User created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}