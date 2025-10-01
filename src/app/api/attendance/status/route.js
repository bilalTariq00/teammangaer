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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/attendance/status - Get user's current attendance status
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

    // Connect to database
    await connectDB();

    // Get today's attendance record
    const attendance = await Attendance.findOne({
      userId: new mongoose.Types.ObjectId(currentUser._id),
      date
    });

    if (!attendance) {
      return NextResponse.json({
        success: true,
        data: {
          hasAttendance: false,
          isOnline: false,
          status: 'not_marked',
          totalHours: 0,
          sessions: []
        }
      });
    }

    // Check if user should be marked as offline
    const isOnline = attendance.checkOfflineStatus();
    if (!isOnline) {
      await attendance.save();
    }

    return NextResponse.json({
      success: true,
      data: {
        hasAttendance: true,
        isOnline,
        status: attendance.status,
        totalHours: attendance.totalHours,
        sessions: attendance.sessions,
        checkIn: attendance.checkIn,
        checkOut: attendance.checkOut,
        isVerified: attendance.isVerified,
        verifiedAt: attendance.verifiedAt,
        lastActivity: attendance.lastActivity
      }
    });

  } catch (error) {
    console.error('Error fetching attendance status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance status' },
      { status: 500 }
    );
  }
}

// POST /api/attendance/status - Update user's online status
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
    const { action, date = new Date().toISOString().split('T')[0] } = body;

    // Connect to database
    await connectDB();

    // Get today's attendance record
    let attendance = await Attendance.findOne({
      userId: new mongoose.Types.ObjectId(currentUser._id),
      date
    });

    if (!attendance) {
      return NextResponse.json(
        { success: false, error: 'No attendance record found for today' },
        { status: 404 }
      );
    }

    if (action === 'heartbeat') {
      // Update last activity
      attendance.updateActivity();
      await attendance.save();

      return NextResponse.json({
        success: true,
        message: 'Activity updated',
        data: {
          isOnline: attendance.isOnline,
          lastActivity: attendance.lastActivity
        }
      });

    } else if (action === 'checkout') {
      // Manual checkout
      if (attendance.sessions.length > 0) {
        const lastSession = attendance.sessions[attendance.sessions.length - 1];
        if (lastSession.checkIn && !lastSession.checkOut) {
          const now = new Date();
          const checkOutTime = now.toTimeString().slice(0, 5);
          lastSession.checkOut = checkOutTime;
          attendance.calculateTotalHours();
          attendance.isOnline = false;
          attendance.lastActivity = now;
          await attendance.save();

          return NextResponse.json({
            success: true,
            message: 'Checkout recorded successfully',
            data: {
              checkOut: checkOutTime,
              totalHours: attendance.totalHours,
              isOnline: false
            }
          });
        }
      }

      return NextResponse.json(
        { success: false, error: 'No active session to checkout' },
        { status: 400 }
      );

    } else if (action === 'checkin') {
      // Manual checkin for new session
      const now = new Date();
      const checkInTime = now.toTimeString().slice(0, 5);
      
      attendance.addSession(checkInTime, null, '');
      attendance.isOnline = true;
      attendance.lastActivity = now;
      await attendance.save();

      return NextResponse.json({
        success: true,
        message: 'Check-in recorded successfully',
        data: {
          checkIn: checkInTime,
          totalHours: attendance.totalHours,
          isOnline: true
        }
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating attendance status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update attendance status' },
      { status: 500 }
    );
  }
}
