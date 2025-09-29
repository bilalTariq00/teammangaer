import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    await connectDB();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    
    return NextResponse.json({
      success: false,
      message: 'MongoDB connection failed',
      error: error.message
    }, { status: 500 });
  }
}
