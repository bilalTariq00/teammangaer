import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET(request, { params }) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, error: 'No token provided' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
    }

    // Connect to database
    await connectDB();

    const { id } = params;
    
    // Find user by ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Worker not found' }, { status: 404 });
    }

    // Only allow access to users with role 'user' (workers)
    if (user.role !== 'user') {
      return NextResponse.json({ success: false, error: 'User is not a worker' }, { status: 403 });
    }

    // Generate worker data with mock performance data
    const workerData = {
      id: user._id,
      name: user.name,
      email: user.email,
      workerId: user.employeeId || `#${user._id}`,
      type: `${user.workerType?.charAt(0).toUpperCase() + user.workerType?.slice(1)} ${user.taskRole?.charAt(0).toUpperCase() + user.taskRole?.slice(1)}`,
      status: user.status === 'permanent' ? 'Active' : user.status === 'trainee' ? 'Active' : 'Inactive',
      totalClicks: Math.floor(Math.random() * 200) + 50, // Mock data
      success: Math.floor(Math.random() * 150) + 30,
      formFills: user.taskRole === 'clicker' || user.taskRole === 'both' ? Math.floor(Math.random() * 50) + 10 : 0,
      badClicks: Math.floor(Math.random() * 30) + 5,
      failedSubmissions: Math.floor(Math.random() * 20) + 3,
      duplicates: Math.floor(Math.random() * 5),
      networkRTC: Math.floor(Math.random() * 3),
      // Additional user data
      department: user.department,
      position: user.position,
      salary: user.salary,
      joinDate: user.joinDate,
      target: user.target,
      attendance: user.attendance,
      lastReview: user.lastReview,
      vacationDay: user.vacationDay,
      phoneNumber: user.phoneNumber,
      address: user.address,
      emergencyContact: user.emergencyContact,
      emergencyPhone: user.emergencyPhone,
      dateOfBirth: user.dateOfBirth,
      socialSecurityNumber: user.socialSecurityNumber,
      bankAccount: user.bankAccount,
      benefits: user.benefits,
      notes: user.notes,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    return NextResponse.json({ success: true, data: workerData });

  } catch (error) {
    console.error('Error fetching worker data:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch worker data' 
    }, { status: 500 });
  }
}
