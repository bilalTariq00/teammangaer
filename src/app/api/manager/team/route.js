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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// GET /api/manager/team - Get manager's assigned team members
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

    // Check if user is a manager
    if (currentUser.role !== 'manager') {
      return NextResponse.json(
        { success: false, error: 'Access denied. Manager role required.' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Get manager's assigned users
    const manager = await User.findById(currentUser._id).populate('assignedUsers');
    
    if (!manager || !manager.assignedUsers || manager.assignedUsers.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        count: 0
      });
    }

    // Transform team members for frontend
    const teamMembers = manager.assignedUsers.map(user => ({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      workerType: user.workerType || 'permanent',
      status: user.status || 'permanent',
      taskRole: user.taskRole || 'viewer',
      locked: user.locked || 'unlocked',
      links: user.links || 0,
      contactNumber: user.contactNumber || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      department: user.department || '',
      position: user.position || '',
      salary: user.salary || 0,
      joinDate: user.joinDate || '',
      performance: user.performance || 0,
      attendance: user.attendance || 0,
      createdAt: user.createdAt
    }));

    return NextResponse.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });

  } catch (error) {
    console.error('Error fetching manager team:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
