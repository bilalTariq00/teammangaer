import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/authMiddleware';

// Handle CORS preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/hr/employees - Get all employees (HR specific)
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

    // Check if user has HR permissions
    if (currentUser.role !== 'hr') {
      return NextResponse.json(
        { success: false, error: 'Access denied. HR role required.' },
        { status: 403 }
      );
    }

    await connectDB();

    // Get all users from database
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // Transform users to employee format
    const employees = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      taskRole: user.taskRole || 'viewer',
      workerType: user.workerType || 'permanent',
      status: user.status || 'permanent',
      locked: user.locked || 'unlocked',
      links: user.links || 0,
      assignedUsers: user.assignedUsers || [],
      contactNumber: user.contactNumber || '',
      emergencyNumber: user.emergencyNumber || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      emergencyContact: user.emergencyContact || '',
      emergencyPhone: user.emergencyPhone || '',
      dateOfBirth: user.dateOfBirth || '',
      socialSecurityNumber: user.socialSecurityNumber || '',
      bankAccount: user.bankAccount || '',
      benefits: user.benefits || '',
      notes: user.notes || '',
      department: user.department || '',
      position: user.position || '',
      salary: user.salary || 0,
      joinDate: user.joinDate || '',
      performance: user.performance || 0,
      attendance: user.attendance || 0,
      lastReview: user.lastReview || '',
      vacationDay: user.vacationDay || 'Monday',
      employeeId: user.employeeId || '',
      target: user.target || 0,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: employees,
      count: employees.length
    });

  } catch (error) {
    console.error('HR Employees fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/hr/employees - Create new employee (HR specific)
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

    // Validate user creation permissions based on current user's role
    // HR can only create 'user' (worker) or 'qc' roles
    const permissionResult = validateUserCreation(currentUser, { role: 'user' }); // Assume default role is 'user' for HR creation
    if (!permissionResult.success) {
      return NextResponse.json(
        { success: false, error: permissionResult.error },
        { status: 403 }
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      email,
      password,
      role, // This will be 'user' or 'qc' for HR
      workerType, // 'permanent' or 'trainee'
      workCategory, // Not directly in User model, but can be derived or added
      status, // 'permanent', 'trainee', 'terminated'
      taskRole, // 'viewer', 'clicker', 'both'
      department,
      position,
      salary,
      joinDate,
      phoneNumber,
      address,
      emergencyContact,
      emergencyPhone,
      contactNumber,
      emergencyNumber,
      dateOfBirth,
      socialSecurityNumber,
      bankAccount,
      benefits,
      notes,
      assignedUsers,
      defaultTasker, // Not directly in User model, but can be added
      vacationDay,
      employeeId,
      target,
      attendance,
      lastReview,
      performance
    } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // HR specific role validation
    const allowedRolesForHR = ['user', 'qc'];
    if (!allowedRolesForHR.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'HR can only create worker (user) or QC roles' },
        { status: 403 }
      );
    }

    // Worker type validation for 'user' role
    const allowedWorkerTypes = ['permanent', 'trainee'];
    if (role === 'user' && (!workerType || !allowedWorkerTypes.includes(workerType))) {
      return NextResponse.json(
        { success: false, error: 'Worker type (permanent or trainee) is required for user role' },
        { status: 400 }
      );
    }

    // Salary validation
    if (typeof salary !== 'number' || salary <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid salary (number greater than 0) is required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password (pre-save hook in User model handles this)
    const newEmployee = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      workerType: role === 'user' ? `${workerType}-worker` : role, // e.g., 'permanent-worker', 'qc'
      status: workerType || 'permanent', // Default status based on workerType
      taskRole: taskRole || 'viewer', // Default taskRole
      department: department || '',
      position: position || '',
      salary: salary || 0,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      phoneNumber: phoneNumber || '',
      address: address || '',
      emergencyContact: emergencyContact || '',
      emergencyPhone: emergencyPhone || '',
      contactNumber: contactNumber || '',
      emergencyNumber: emergencyNumber || '',
      dateOfBirth: dateOfBirth || '',
      socialSecurityNumber: socialSecurityNumber || '',
      bankAccount: bankAccount || '',
      benefits: benefits || '',
      notes: notes || '',
      assignedUsers: assignedUsers || [],
      vacationDay: vacationDay || 'Monday',
      employeeId: employeeId || `EMP${Date.now().toString().slice(-6)}`, // Auto-generate if not provided
      target: target || 0,
      attendance: attendance || 0,
      lastReview: lastReview || '',
      performance: performance || 0,
      locked: 'unlocked', // Default to unlocked
    });

    await newEmployee.save();

    // Return user data without password
    const employeeResponse = newEmployee.toJSON();

    return NextResponse.json(
      { success: true, message: 'Employee created successfully', data: employeeResponse },
      { status: 201 }
    );

  } catch (error) {
    console.error('HR Employee creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Role-based validation for user creation
function validateUserCreation(currentUser, newUser) {
  const currentRole = currentUser.role;
  const targetRole = newUser.role;

  // Admin can create any user
  if (currentRole === 'admin') {
    return { success: true };
  }

  // HR can only create workers and QC
  if (currentRole === 'hr') {
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

  // Managers can only create workers
  if (currentRole === 'manager') {
    if (targetRole !== 'user') {
      return {
        success: false,
        error: 'Managers can only create worker users'
      };
    }
  }

  // QC and regular users cannot create any users
  if (['qc', 'user'].includes(currentRole)) {
    return {
      success: false,
      error: 'You do not have permission to create users'
    };
  }
  
  return { success: true };
}