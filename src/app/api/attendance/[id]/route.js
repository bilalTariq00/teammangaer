import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
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

// GET /api/attendance/[id] - Get specific attendance record
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
    const { id } = await params;

    // Connect to database
    await connectDB();

    const attendance = await Attendance.findById(id)
      .populate('userId', 'name email role workerType')
      .populate('verifiedBy', 'name email role');

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (currentUser.role === 'user' && attendance.userId._id.toString() !== currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'Access denied. You can only view your own attendance.' },
        { status: 403 }
      );
    }

    if (currentUser.role === 'manager') {
      const manager = await User.findById(currentUser._id).populate('assignedUsers');
      if (!manager || !manager.assignedUsers) {
        return NextResponse.json(
          { success: false, error: 'No assigned team members found' },
          { status: 403 }
        );
      }
      
      const teamUserIds = manager.assignedUsers.map(user => user._id.toString());
      if (!teamUserIds.includes(attendance.userId._id.toString())) {
        return NextResponse.json(
          { success: false, error: 'You can only view attendance for your team members' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: attendance
    });

  } catch (error) {
    console.error('Error fetching attendance record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance record' },
      { status: 500 }
    );
  }
}

// PUT /api/attendance/[id] - Update specific attendance record
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
    const { id } = await params;
    const body = await request.json();
    const { 
      checkIn, 
      checkOut, 
      notes, 
      action, // 'approve', 'reject', 'update'
      verificationNotes 
    } = body;

    // Connect to database
    await connectDB();

    const attendance = await Attendance.findById(id);
    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Check access permissions
    if (currentUser.role === 'user' && attendance.userId.toString() !== currentUser._id) {
      return NextResponse.json(
        { success: false, error: 'Access denied. You can only update your own attendance.' },
        { status: 403 }
      );
    }

    if (currentUser.role === 'manager') {
      const manager = await User.findById(currentUser._id).populate('assignedUsers');
      if (!manager || !manager.assignedUsers) {
        return NextResponse.json(
          { success: false, error: 'No assigned team members found' },
          { status: 403 }
        );
      }
      
      const teamUserIds = manager.assignedUsers.map(user => user._id.toString());
      if (!teamUserIds.includes(attendance.userId.toString())) {
        return NextResponse.json(
          { success: false, error: 'You can only update attendance for your team members' },
          { status: 403 }
        );
      }
    }

    // Handle different actions
    if (action === 'approve' || action === 'reject') {
      // Manager verification
      if (!['manager', 'admin', 'hr'].includes(currentUser.role)) {
        return NextResponse.json(
          { success: false, error: 'Access denied. Manager, HR, or Admin role required for verification.' },
          { status: 403 }
        );
      }

      attendance.status = action === 'approve' ? 'approved' : 'rejected';
      attendance.isVerified = action === 'approve';
      attendance.verifiedBy = currentUser._id;
      attendance.verifiedAt = new Date();
      attendance.verificationNotes = verificationNotes || '';

    } else if (action === 'update') {
      // Update attendance details
      if (checkIn || checkOut) {
        // Add new session
        attendance.addSession(checkIn, checkOut, notes);
        attendance.updateActivity();
      }
      
      if (notes !== undefined) {
        attendance.notes = notes;
      }
    }

    await attendance.save();

    return NextResponse.json({
      success: true,
      message: 'Attendance updated successfully',
      data: attendance
    });

  } catch (error) {
    console.error('Error updating attendance record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance record' },
      { status: 500 }
    );
  }
}

// DELETE /api/attendance/[id] - Delete attendance record (Admin only)
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

    // Only admin can delete attendance records
    if (currentUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Admin role required.' },
        { status: 403 }
      );
    }

    const { id } = await params;

    // Connect to database
    await connectDB();

    const attendance = await Attendance.findByIdAndDelete(id);
    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Attendance record deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting attendance record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete attendance record' },
      { status: 500 }
    );
  }
}

