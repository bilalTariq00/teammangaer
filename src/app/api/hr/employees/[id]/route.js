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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/hr/employees/[id] - Get single employee by ID
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

    // Check if user has HR permissions
    if (currentUser.role !== 'hr') {
      return NextResponse.json(
        { success: false, error: 'Access denied. HR role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find employee by ID
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Transform user to employee format
    const employee = {
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
    };

    return NextResponse.json({
      success: true,
      data: employee
    });

  } catch (error) {
    console.error('Get employee error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/hr/employees/[id] - Update employee
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

    // Check if user has HR permissions
    if (currentUser.role !== 'hr') {
      return NextResponse.json(
        { success: false, error: 'Access denied. HR role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const body = await request.json();
    const updateData = { ...body };
    
    // Remove fields that shouldn't be updated directly
    delete updateData.id;
    delete updateData._id;
    delete updateData.createdAt;
    delete updateData.updatedAt;

    // Update employee
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Transform user to employee format
    const employee = {
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      taskRole: updatedUser.taskRole || 'viewer',
      workerType: updatedUser.workerType || 'permanent',
      status: updatedUser.status || 'permanent',
      locked: updatedUser.locked || 'unlocked',
      links: updatedUser.links || 0,
      assignedUsers: updatedUser.assignedUsers || [],
      contactNumber: updatedUser.contactNumber || '',
      emergencyNumber: updatedUser.emergencyNumber || '',
      phoneNumber: updatedUser.phoneNumber || '',
      address: updatedUser.address || '',
      emergencyContact: updatedUser.emergencyContact || '',
      emergencyPhone: updatedUser.emergencyPhone || '',
      dateOfBirth: updatedUser.dateOfBirth || '',
      socialSecurityNumber: updatedUser.socialSecurityNumber || '',
      bankAccount: updatedUser.bankAccount || '',
      benefits: updatedUser.benefits || '',
      notes: updatedUser.notes || '',
      department: updatedUser.department || '',
      position: updatedUser.position || '',
      salary: updatedUser.salary || 0,
      joinDate: updatedUser.joinDate || '',
      performance: updatedUser.performance || 0,
      attendance: updatedUser.attendance || 0,
      lastReview: updatedUser.lastReview || '',
      vacationDay: updatedUser.vacationDay || 'Monday',
      employeeId: updatedUser.employeeId || '',
      target: updatedUser.target || 0,
      avatar: updatedUser.avatar || null,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    };

    return NextResponse.json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });

  } catch (error) {
    console.error('Update employee error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/hr/employees/[id] - Delete employee
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

    // Check if user has HR permissions
    if (currentUser.role !== 'hr') {
      return NextResponse.json(
        { success: false, error: 'Access denied. HR role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find and delete employee
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return NextResponse.json(
        { success: false, error: 'Employee not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Delete employee error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
