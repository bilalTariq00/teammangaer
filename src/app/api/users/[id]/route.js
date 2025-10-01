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

// PUT /api/users/[id] - Update user by ID (Admin or Manager only)
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

    // Check if user has admin or manager permissions
    if (!['admin', 'manager'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin or Manager role required.' },
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
      vacationDay,
      locked
    } = body;

    // Validation - only validate fields that are provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (role && !['admin', 'manager', 'hr', 'qc', 'worker', 'user'].includes(role)) {
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

    // If current user is a manager, check if they can update this user
    if (currentUser.role === 'manager') {
      // Managers can only update their assigned team members
      if (!currentUser.assignedUsers || !currentUser.assignedUsers.includes(id)) {
        return NextResponse.json(
          { success: false, error: 'Access denied. You can only update your assigned team members.' },
          { status: 403 }
        );
      }
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

    // Prepare update data - only include fields that are provided
    const updateData = {};
    
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    if (workerType !== undefined) updateData.workerType = workerType;
    if (status !== undefined) updateData.status = status;
    if (taskRole !== undefined) updateData.taskRole = taskRole;
    if (assignedUsers !== undefined) updateData.assignedUsers = assignedUsers;
    if (defaultTasker !== undefined) updateData.defaultTasker = defaultTasker;
    if (contactNumber !== undefined) updateData.contactNumber = contactNumber;
    if (emergencyNumber !== undefined) updateData.emergencyNumber = emergencyNumber;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (address !== undefined) updateData.address = address;
    if (emergencyContact !== undefined) updateData.emergencyContact = emergencyContact;
    if (emergencyPhone !== undefined) updateData.emergencyPhone = emergencyPhone;
    if (dateOfBirth !== undefined) updateData.dateOfBirth = dateOfBirth;
    if (socialSecurityNumber !== undefined) updateData.socialSecurityNumber = socialSecurityNumber;
    if (bankAccount !== undefined) updateData.bankAccount = bankAccount;
    if (benefits !== undefined) updateData.benefits = benefits;
    if (notes !== undefined) updateData.notes = notes;
    if (department !== undefined) updateData.department = department;
    if (position !== undefined) updateData.position = position;
    if (salary !== undefined) updateData.salary = salary;
    if (joinDate !== undefined) updateData.joinDate = joinDate;
    if (performance !== undefined) updateData.performance = performance;
    if (attendance !== undefined) updateData.attendance = attendance;
    if (lastReview !== undefined) updateData.lastReview = lastReview;
    if (vacationDay !== undefined) updateData.vacationDay = vacationDay;
    if (locked !== undefined) updateData.locked = locked;

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
