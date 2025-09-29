"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPage() {
  const [authStatus, setAuthStatus] = useState('Checking...');
  const [userData, setUserData] = useState(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      setAuthStatus('Loading...');
      return;
    }

    if (user) {
      setAuthStatus('Authenticated');
      setUserData(user);
    } else {
      setAuthStatus('Not authenticated');
    }
  }, [user, loading]);

  const testApiCall = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found');
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      console.log('API Response:', result);
      alert(`API Response: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('API Error:', error);
      alert(`API Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test Page</h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
          <p className="mb-2"><strong>Status:</strong> {authStatus}</p>
          <p className="mb-2"><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
          
          {userData && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">User Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          <button
            onClick={testApiCall}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test API Call
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Cookies</h2>
          <p className="text-sm text-gray-600">
            User Role Cookie: {typeof window !== 'undefined' && document.cookie.includes('user-role') ? 'Present' : 'Not found'}
          </p>
          <p className="text-sm text-gray-600 mt-2">
            All Cookies: {typeof window !== 'undefined' ? document.cookie : 'No cookies (SSR)'}
          </p>
        </div>
      </div>
    </div>
  );
}
