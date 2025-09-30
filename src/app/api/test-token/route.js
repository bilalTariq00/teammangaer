import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request) {
  try {
    console.log('🔍 Test token endpoint called');
    
    const authHeader = request.headers.get('authorization');
    console.log('🔍 Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        error: 'No authorization header'
      });
    }

    const token = authHeader.substring(7);
    console.log('🔍 Token:', token.substring(0, 50) + '...');
    console.log('🔍 JWT Secret:', JWT_SECRET);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('✅ Token verified successfully:', decoded);
      
      return NextResponse.json({
        success: true,
        message: 'Token is valid',
        decoded: decoded,
        timestamp: new Date().toISOString()
      });
      
    } catch (jwtError) {
      console.log('❌ JWT verification failed:', jwtError.message);
      console.log('❌ JWT Error details:', jwtError);
      
      return NextResponse.json({
        success: false,
        error: 'Token verification failed',
        details: {
          message: jwtError.message,
          name: jwtError.name,
          expiredAt: jwtError.expiredAt ? new Date(jwtError.expiredAt).toISOString() : null
        }
      });
    }
    
  } catch (error) {
    console.error('Test token error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    });
  }
}
