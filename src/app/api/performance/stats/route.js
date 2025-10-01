import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/authMiddleware';
import Performance from '@/models/Performance';
import mongoose from 'mongoose';

// GET /api/performance/stats - Get performance statistics
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

    // Build query based on role
    let query = { date };

    if (currentUser.role === 'admin' || currentUser.role === 'hr') {
      // Admin and HR can see all stats
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      }
    } else if (currentUser.role === 'manager') {
      // Managers can see their team's stats
      const assignedUserIds = (currentUser.assignedUsers || []).map(id => 
        new mongoose.Types.ObjectId(id)
      );
      
      if (userId) {
        // Check if user is assigned to this manager
        if (!currentUser.assignedUsers || !currentUser.assignedUsers.includes(userId)) {
          return NextResponse.json(
            { success: false, error: 'Access denied' },
            { status: 403 }
          );
        }
        query.userId = new mongoose.Types.ObjectId(userId);
      } else {
        query.userId = { $in: assignedUserIds };
      }
    } else {
      // Regular users can only see their own stats
      query.userId = new mongoose.Types.ObjectId(currentUser._id);
    }

    // Get performance records
    const performanceRecords = await Performance.find(query).populate('userId', 'name email role workerType');

    // Filter out orphaned records
    const validRecords = performanceRecords.filter(record => record.userId !== null);

    // Calculate statistics
    const stats = {
      total: validRecords.length,
      pending: validRecords.filter(r => r.status === 'pending').length,
      submitted: validRecords.filter(r => r.status === 'submitted').length,
      verified: validRecords.filter(r => r.status === 'verified').length,
      rejected: validRecords.filter(r => r.status === 'rejected').length,
      totalClicks: validRecords.reduce((sum, r) => sum + r.totalClicks, 0),
      totalGoodClicks: validRecords.reduce((sum, r) => sum + r.goodClicks, 0),
      totalBadClicks: validRecords.reduce((sum, r) => sum + r.badClicks, 0),
      averagePerformance: validRecords.length > 0
        ? Math.round(validRecords.reduce((sum, r) => sum + r.performance, 0) / validRecords.length)
        : 0,
      targetsMet: validRecords.filter(r => r.targetMet).length,
      targetsTotal: validRecords.length,
      date
    };

    return NextResponse.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching performance stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance stats', details: error.message },
      { status: 500 }
    );
  }
}

