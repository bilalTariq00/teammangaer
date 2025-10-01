import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { verifyToken } from '@/lib/authMiddleware';
import Performance from '@/models/Performance';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET /api/performance - Get performance records with filtering
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

    // Build query based on role and parameters
    let query = { date };

    // Role-based access control
    if (currentUser.role === 'admin' || currentUser.role === 'hr') {
      // Admin and HR can see all performance records
      if (userId) {
        query.userId = new mongoose.Types.ObjectId(userId);
      }
    } else if (currentUser.role === 'manager') {
      // Managers can see their assigned users' performance
      if (userId) {
        // Check if the user is assigned to this manager
        if (!currentUser.assignedUsers || !currentUser.assignedUsers.includes(userId)) {
          return NextResponse.json(
            { success: false, error: 'Access denied. User not assigned to this manager.' },
            { status: 403 }
          );
        }
        query.userId = new mongoose.Types.ObjectId(userId);
      } else {
        // Get all assigned users' performance
        const assignedUserIds = (currentUser.assignedUsers || []).map(id => 
          new mongoose.Types.ObjectId(id)
        );
        query.userId = { $in: assignedUserIds };
      }
    } else {
      // Regular users can only see their own performance
      query.userId = new mongoose.Types.ObjectId(currentUser._id);
    }

    // Fetch performance records with user population
    const performanceRecords = await Performance.find(query)
      .populate('userId', 'name email role workerType taskRole status')
      .populate('verifiedBy', 'name email role')
      .sort({ markedAt: -1 });

    // Filter out records with null userId (orphaned records)
    const validRecords = performanceRecords.filter(record => record.userId !== null);

    return NextResponse.json({
      success: true,
      data: validRecords,
      count: validRecords.length
    });

  } catch (error) {
    console.error('Error fetching performance records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch performance records', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/performance - Create or update performance record
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
      userId,
      date,
      totalClicks,
      goodClicks,
      badClicks,
      dailyTarget,
      performanceStatus,
      notes
    } = body;

    // Validation
    if (!userId || !date) {
      return NextResponse.json(
        { success: false, error: 'User ID and date are required' },
        { status: 400 }
      );
    }

    // Permission check
    if (currentUser.role !== 'admin' && currentUser.role !== 'manager' && currentUser._id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Access denied. You can only record your own performance.' },
        { status: 403 }
      );
    }

    // If manager, check if user is assigned to them
    if (currentUser.role === 'manager') {
      if (!currentUser.assignedUsers || !currentUser.assignedUsers.includes(userId)) {
        return NextResponse.json(
          { success: false, error: 'Access denied. User not assigned to this manager.' },
          { status: 403 }
        );
      }
    }

    // Connect to database
    await connectDB();

    // Check if performance record already exists for this user and date
    let performanceRecord = await Performance.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      date
    });

    console.log('Performance API Debug:', {
      userId,
      date,
      performanceStatus,
      existingRecord: !!performanceRecord,
      existingPerformanceStatus: performanceRecord?.performanceStatus
    });

    if (performanceRecord) {
      // Update existing record
      performanceRecord.totalClicks = totalClicks || performanceRecord.totalClicks;
      performanceRecord.goodClicks = goodClicks || performanceRecord.goodClicks;
      performanceRecord.badClicks = badClicks || performanceRecord.badClicks;
      performanceRecord.dailyTarget = dailyTarget || performanceRecord.dailyTarget;
      // Always update performanceStatus if provided
      if (performanceStatus !== undefined) {
        performanceRecord.performanceStatus = performanceStatus;
        console.log('Setting performanceStatus to:', performanceStatus);
      } else {
        console.log('performanceStatus not provided, keeping existing:', performanceRecord.performanceStatus);
      }
      performanceRecord.notes = notes || performanceRecord.notes;
      performanceRecord.status = 'submitted';
      performanceRecord.markedBy = currentUser.role === 'manager' ? 'manager' : 'self';
      performanceRecord.markedAt = new Date();

      await performanceRecord.save();
      console.log('Updated performance record:', {
        id: performanceRecord._id,
        performanceStatus: performanceRecord.performanceStatus,
        status: performanceRecord.status
      });
    } else {
      // Create new record
      performanceRecord = await Performance.create({
        userId: new mongoose.Types.ObjectId(userId),
        date,
        totalClicks: totalClicks || 0,
        goodClicks: goodClicks || 0,
        badClicks: badClicks || 0,
        dailyTarget: dailyTarget || 80,
        performanceStatus: performanceStatus || 'average',
        notes: notes || '',
        status: 'submitted',
        markedBy: currentUser.role === 'manager' ? 'manager' : 'self',
        markedAt: new Date()
      });
      console.log('Created new performance record:', {
        id: performanceRecord._id,
        performanceStatus: performanceRecord.performanceStatus,
        status: performanceRecord.status
      });
    }

    // Populate user data
    await performanceRecord.populate('userId', 'name email role workerType taskRole status');

    return NextResponse.json({
      success: true,
      data: performanceRecord,
      message: 'Performance recorded successfully'
    });

  } catch (error) {
    console.error('Error recording performance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record performance', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/performance - Verify performance record
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
      performanceId,
      action, // 'approve' or 'reject'
      verificationNotes
    } = body;

    // Only managers, HR, and admins can verify performance
    if (!['admin', 'hr', 'manager'].includes(currentUser.role)) {
      return NextResponse.json(
        { success: false, error: 'Access denied. Only managers, HR, and admins can verify performance.' },
        { status: 403 }
      );
    }

    if (!performanceId || !action) {
      return NextResponse.json(
        { success: false, error: 'Performance ID and action are required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Find performance record
    const performanceRecord = await Performance.findById(performanceId).populate('userId', 'name email');

    if (!performanceRecord) {
      return NextResponse.json(
        { success: false, error: 'Performance record not found' },
        { status: 404 }
      );
    }

    // If manager, check if user is assigned to them
    if (currentUser.role === 'manager') {
      if (!currentUser.assignedUsers || !currentUser.assignedUsers.includes(performanceRecord.userId._id.toString())) {
        return NextResponse.json(
          { success: false, error: 'Access denied. User not assigned to this manager.' },
          { status: 403 }
        );
      }
    }

    // Update performance record
    performanceRecord.isVerified = action === 'approve';
    performanceRecord.status = action === 'approve' ? 'verified' : 'rejected';
    performanceRecord.verifiedBy = new mongoose.Types.ObjectId(currentUser._id);
    performanceRecord.verifiedAt = new Date();
    performanceRecord.verificationNotes = verificationNotes || '';

    await performanceRecord.save();

    // Populate user data
    await performanceRecord.populate('verifiedBy', 'name email role');

    return NextResponse.json({
      success: true,
      data: performanceRecord,
      message: `Performance ${action}d successfully`
    });

  } catch (error) {
    console.error('Error verifying performance:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify performance', details: error.message },
      { status: 500 }
    );
  }
}

