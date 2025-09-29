import { NextResponse } from 'next/server';

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

export async function POST(request) {
  try {
    // In a real application, you might want to:
    // 1. Invalidate the JWT token (e.g., add to a blacklist in a database)
    // 2. Clear any server-side session data
    // 3. Log the logout event
    
    // For now, we just return a success response.
    // The client-side will handle clearing cookies and local storage.
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
