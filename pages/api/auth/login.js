export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Mock login for testing
    if (email === 'admin@joyapps.com' && password === 'admin123') {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: 'test-123',
          name: 'Test Admin',
          email: 'admin@joyapps.com',
          role: 'admin'
        },
        token: 'test-token-123'
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}
