import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';
import User from '@/models/User';
import { verifyToken } from '@/lib/authMiddleware';
import mongoose from 'mongoose';

// Handle CORS preflight requests
export async function OPTIONS(request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/attendance - Get attendance records
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
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const userId = searchParams.get('userId');

    // Connect to database
    await connectDB();

    let query = { date };
    
    // Role-based access control
    if (currentUser.role === 'admin') {
      // Admin can see all attendance
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      }
    } else if (currentUser.role === 'hr') {
      // HR can see all attendance
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      }
    } else if (currentUser.role === 'manager') {
      // Manager can see their team's attendance
      const manager = await User.findById(currentUser._id).populate('assignedUsers');
      if (manager && manager.assignedUsers) {
        const teamUserIds = manager.assignedUsers.map(user => user._id);
        query.userId = { $in: teamUserIds };
      } else {
        // If no assigned users, return empty
        return NextResponse.json({
          success: true,
          data: [],
          count: 0
        });
      }
    } else {
      // Regular users can only see their own attendance
      query.userId = currentUser._id;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate('userId', 'name email role workerType')
      .populate('verifiedBy', 'name email role')
      .sort({ createdAt: -1 });

    // Filter out records with null userId (orphaned records)
    const validRecords = attendanceRecords.filter(record => record.userId !== null);

    return NextResponse.json({
      success: true,
      data: validRecords,
      count: validRecords.length
    });

  } catch (error) {
    console.error('Error fetching attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance records' },
      { status: 500 }
    );
  }
}

// POST /api/attendance - Mark attendance
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
    const body = await request.json();
    const { 
      checkIn, 
      checkOut, 
      notes = '', 
      date = new Date().toISOString().split('T')[0] 
    } = body;

    // Validate required fields
    if (!checkIn) {
      return NextResponse.json(
        { success: false, error: 'Check-in time is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if attendance already exists for this user and date
    const existingAttendance = await Attendance.findOne({
      userId: new mongoose.Types.ObjectId(currentUser._id),
      date
    });

    if (existingAttendance) {
      // Update existing attendance
      if (checkOut) {
        // Add a new session
        existingAttendance.addSession(checkIn, checkOut, notes);
        existingAttendance.status = 'marked';
        existingAttendance.notes = notes;
        existingAttendance.updateActivity();
      } else {
        // Just update check-in for new session
        existingAttendance.addSession(checkIn, null, notes);
        existingAttendance.status = 'marked';
        existingAttendance.notes = notes;
        existingAttendance.updateActivity();
      }
      
      await existingAttendance.save();
      
      return NextResponse.json({
        success: true,
        message: 'Attendance updated successfully',
        data: existingAttendance
      });
    } else {
      // Create new attendance record
      const attendance = new Attendance({
        userId: new mongoose.Types.ObjectId(currentUser._id),
        date,
        status: 'marked',
        checkIn,
        checkOut,
        notes,
        markedBy: 'self',
        markedAt: new Date(),
        isOnline: true,
        lastActivity: new Date()
      });

      // Add initial session
      attendance.addSession(checkIn, checkOut, notes);
      
      await attendance.save();
      
      return NextResponse.json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendance
      });
    }

  } catch (error) {
    console.error('Error marking attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to mark attendance' },
      { status: 500 }
    );
  }
}

// PUT /api/attendance - Update attendance (for managers to verify)
export async function PUT(request) {
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
    const body = await request.json();
    const { 
      attendanceId, 
      action, // 'approve' or 'reject'
      notes = '' 
    } = body;

    // Only managers and admins can verify attendance
    if (!['manager', 'admin', 'hr'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Manager, HR, or Admin role required.' },
        { status: 403 }
      );
    }

    // Validate required fields
    if (!attendanceId || !action) {
      return NextResponse.json(
        { success: false, error: 'Attendance ID and action are required' },
        { status: 400 }
      );
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Action must be either "approve" or "reject"' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find the attendance record
    const attendance = await Attendance.findById(attendanceId);
    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'Attendance record not found' },
        { status: 404 }
      );
    }

    // Check if manager can verify this attendance
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
          { success: false, error: 'You can only verify attendance for your team members' },
          { status: 403 }
        );
      }
    }

    // Update attendance status
    attendance.status = action === 'approve' ? 'approved' : 'rejected';
    attendance.isVerified = action === 'approve';
    attendance.verifiedBy = currentUser._id;
    attendance.verifiedAt = new Date();
    attendance.verificationNotes = notes;

    await attendance.save();

    return NextResponse.json({
      success: true,
      message: `Attendance ${action}d successfully`,
      data: attendance
    });

  } catch (error) {
    console.error('Error updating attendance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}
