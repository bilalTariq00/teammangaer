// Test script to verify API endpoints
const testAPI = async () => {
  const baseURL = 'https://teammangaer.vercel.app';
  
  console.log('Testing API endpoints...');
  
  // Test login endpoint
  try {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@joyapps.com',
        password: 'admin123'
      })
    });
    
    console.log('Login API Status:', response.status);
    console.log('Login API Headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('Login API Response:', data);
    } else {
      const error = await response.text();
      console.log('Login API Error:', error);
    }
  } catch (error) {
    console.error('Login API Error:', error.message);
  }
  
  // Test OPTIONS request
  try {
    const response = await fetch(`${baseURL}/api/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('OPTIONS API Status:', response.status);
    console.log('OPTIONS API Headers:', Object.fromEntries(response.headers.entries()));
  } catch (error) {
    console.error('OPTIONS API Error:', error.message);
  }
};

// Run the test
testAPI();
