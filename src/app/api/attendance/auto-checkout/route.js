import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Attendance from '@/models/Attendance';

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

// POST /api/attendance/auto-checkout - Process automatic checkouts
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();

    const today = new Date().toISOString().split('T')[0];
    const now = new Date();

    // Find all attendance records for today that are marked as online
    const activeAttendances = await Attendance.find({
      date: today,
      isOnline: true
    });

    let processedCount = 0;
    const results = [];

    for (const attendance of activeAttendances) {
      // Check if user has been inactive for more than 30 minutes
      const timeDiff = now - attendance.lastActivity;
      const minutesDiff = timeDiff / (1000 * 60);

      if (minutesDiff > 30) {
        // Mark as offline and add checkout time
        attendance.isOnline = false;
        
        // If there's an active session without checkout, add checkout time
        if (attendance.sessions.length > 0) {
          const lastSession = attendance.sessions[attendance.sessions.length - 1];
          if (lastSession.checkIn && !lastSession.checkOut) {
            const checkOutTime = now.toTimeString().slice(0, 5);
            lastSession.checkOut = checkOutTime;
            lastSession.notes = lastSession.notes || 'Auto checkout after 30 minutes of inactivity';
            
            // Recalculate total hours
            attendance.calculateTotalHours();
          }
        }

        await attendance.save();
        processedCount++;
        
        results.push({
          userId: attendance.userId,
          status: 'auto-checkout',
          checkOutTime: attendance.sessions[attendance.sessions.length - 1]?.checkOut,
          totalHours: attendance.totalHours
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${processedCount} automatic checkouts`,
      data: {
        processedCount,
        results
      }
    });

  } catch (error) {
    console.error('Error processing automatic checkouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process automatic checkouts' },
      { status: 500 }
    );
  }
}

