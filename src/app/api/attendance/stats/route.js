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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/attendance/stats - Get attendance statistics
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
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');

    // Connect to database
    await connectDB();

    let query = {};
    let userQuery = {};

    // Role-based access control
    if (currentUser.role === 'admin' || currentUser.role === 'hr') {
      // Admin and HR can see all statistics
      if (userId) {
        query.userId = userId;
      }
    } else if (currentUser.role === 'manager') {
      // Manager can see their team's statistics
      const manager = await User.findById(currentUser.userId).populate('assignedUsers');
      if (manager && manager.assignedUsers) {
        const teamUserIds = manager.assignedUsers.map(user => user._id);
        query.userId = { $in: teamUserIds };
      } else {
        return NextResponse.json({
          success: true,
          data: {
            total: 0,
            present: 0,
            absent: 0,
            verified: 0,
            totalHours: 0,
            averageHours: 0,
            byRole: {},
            byStatus: {}
          }
        });
      }
    } else {
      // Regular users can only see their own statistics
      query.userId = currentUser.userId;
    }

    // Date range filtering
    if (startDate && endDate) {
      query.date = { $gte: startDate, $lte: endDate };
    } else {
      query.date = date;
    }

    // Get basic statistics
    const stats = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { 
            $sum: { 
              $cond: [{ $in: ['$status', ['present', 'marked', 'approved']] }, 1, 0] 
            } 
          },
          absent: { 
            $sum: { 
              $cond: [{ $in: ['$status', ['absent', 'rejected']] }, 1, 0] 
            } 
          },
          verified: { $sum: { $cond: ['$isVerified', 1, 0] } },
          totalHours: { $sum: '$totalHours' },
          averageHours: { $avg: '$totalHours' }
        }
      }
    ]);

    // Get statistics by role
    const byRole = await Attendance.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$user.role',
          count: { $sum: 1 },
          present: { 
            $sum: { 
              $cond: [{ $in: ['$status', ['present', 'marked', 'approved']] }, 1, 0] 
            } 
          },
          totalHours: { $sum: '$totalHours' }
        }
      }
    ]);

    // Get statistics by status
    const byStatus = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get daily statistics for the last 7 days
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().split('T')[0];
      
      const dayStats = await Attendance.aggregate([
        { $match: { ...query, date: dayStr } },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            present: { 
              $sum: { 
                $cond: [{ $in: ['$status', ['present', 'marked', 'approved']] }, 1, 0] 
              } 
            },
            totalHours: { $sum: '$totalHours' }
          }
        }
      ]);

      last7Days.push({
        date: dayStr,
        dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
        ...(dayStats[0] || { total: 0, present: 0, totalHours: 0 })
      });
    }

    // Get top performers (by hours)
    const topPerformers = await Attendance.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $group: {
          _id: '$userId',
          name: { $first: '$user.name' },
          role: { $first: '$user.role' },
          totalHours: { $sum: '$totalHours' },
          attendanceCount: { $sum: 1 }
        }
      },
      { $sort: { totalHours: -1 } },
      { $limit: 10 }
    ]);

    const result = {
      ...(stats[0] || { total: 0, present: 0, absent: 0, verified: 0, totalHours: 0, averageHours: 0 }),
      byRole: byRole.reduce((acc, item) => {
        acc[item._id] = item;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      last7Days,
      topPerformers
    };

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Error fetching attendance statistics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch attendance statistics' },
      { status: 500 }
    );
  }
}

