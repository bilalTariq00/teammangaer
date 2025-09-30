import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken, requireRole } from '@/lib/authMiddleware';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// GET /api/users/[id] - Get single user by ID (Admin only)
export async function GET(request, { params }) {
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

    // Check if user has admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(id).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Transform user for frontend
    const transformedUser = {
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
      created: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 19).replace('T', ' ') : 'Unknown',
      // Include additional fields for edit form
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
      joinDate: user.joinDate || new Date().toISOString().split('T')[0],
      performance: user.performance || 0,
      attendance: user.attendance || 0,
      lastReview: user.lastReview || '',
      vacationDay: user.vacationDay || '',
      avatar: user.avatar || null
    };

    return NextResponse.json({
      success: true,
      data: transformedUser
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update user by ID (Admin only)
export async function PUT(request, { params }) {
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

    // Check if user has admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
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
      defaultTasker,
      contactNumber,
      emergencyNumber,
      phoneNumber,
      address,
      emergencyContact,
      emergencyPhone,
      dateOfBirth,
      socialSecurityNumber,
      bankAccount,
      benefits,
      notes,
      department,
      position,
      salary,
      joinDate,
      performance,
      attendance,
      lastReview,
      vacationDay
    } = body;

    // Validation
    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and role are required' },
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

    // Role validation
    const validRoles = ['admin', 'manager', 'hr', 'qc', 'worker', 'user'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be one of: admin, manager, hr, qc, worker, user' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if email is already taken by another user
    if (email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email is already taken by another user' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      name,
      email,
      role,
      workerType: workerType || '',
      status: status || 'trainee',
      taskRole: taskRole || 'viewer',
      assignedUsers: assignedUsers || [],
      defaultTasker: defaultTasker || 'none',
      contactNumber: contactNumber || '',
      emergencyNumber: emergencyNumber || '',
      phoneNumber: phoneNumber || '',
      address: address || '',
      emergencyContact: emergencyContact || '',
      emergencyPhone: emergencyPhone || '',
      dateOfBirth: dateOfBirth || '',
      socialSecurityNumber: socialSecurityNumber || '',
      bankAccount: bankAccount || '',
      benefits: benefits || '',
      notes: notes || '',
      department: department || '',
      position: position || '',
      salary: salary || 0,
      joinDate: joinDate || new Date().toISOString().split('T')[0],
      performance: performance || 0,
      attendance: attendance || 0,
      lastReview: lastReview || '',
      vacationDay: vacationDay || ''
    };

    // Update password if provided
    if (password && password.trim() !== '') {
      if (password.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters long' },
          { status: 400 }
        );
      }
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Transform user for frontend
    const transformedUser = {
      id: updatedUser._id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      workerType: updatedUser.workerType,
      status: updatedUser.status,
      taskRole: updatedUser.taskRole,
      locked: updatedUser.locked,
      links: updatedUser.links,
      assignedUsers: updatedUser.assignedUsers,
      defaultTasker: updatedUser.defaultTasker,
      createdAt: updatedUser.createdAt,
      created: new Date(updatedUser.createdAt).toISOString().slice(0, 19).replace('T', ' ')
    };

    return NextResponse.json({
      success: true,
      data: transformedUser,
      message: 'User updated successfully'
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Delete user by ID (Admin only)
export async function DELETE(request, { params }) {
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

    // Check if user has admin permissions
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent admin from deleting themselves
    if (currentUser.id === id) {
      return NextResponse.json(
        { success: false, error: 'You cannot delete your own account' },
        { status: 400 }
      );
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
