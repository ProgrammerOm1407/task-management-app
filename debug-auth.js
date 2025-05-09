const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  name: 'Debug User',
  email: 'debug@example.com',
  password: 'password123'
};

async function debugAuth() {
  try {
    console.log('=== DEBUGGING AUTHENTICATION ===');
    
    // 1. Test server health
    console.log('\n1. Testing server health...');
    try {
      const healthResponse = await axios.get('http://localhost:3000/health');
      console.log('Health check response:', healthResponse.data);
      console.log('✅ Server is healthy');
    } catch (error) {
      console.error('❌ Server health check failed:', error.message);
      if (error.code === 'ECONNREFUSED') {
        console.error('Make sure the server is running on port 3000');
        return;
      }
    }
    
    // 2. Test registration with detailed error handling
    console.log('\n2. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${API_URL}/auth/register`, testUser);
      console.log('Registration response:', registerResponse.data);
      if (registerResponse.data.token) {
        console.log('✅ Registration successful with token');
      } else {
        console.log('⚠️ Registration successful but no token received');
      }
    } catch (error) {
      console.error('❌ Registration failed');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
        
        // If user already exists, this is expected
        if (error.response.status === 400 && 
            error.response.data.message && 
            error.response.data.message.includes('already exists')) {
          console.log('ℹ️ User already exists, this is expected');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
    
    // 3. Test login with detailed error handling
    console.log('\n3. Testing user login...');
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('Login response:', loginResponse.data);
      
      if (loginResponse.data.token) {
        console.log('✅ Login successful with token');
        
        // 4. Test protected route with token
        const token = loginResponse.data.token;
        console.log('\n4. Testing protected route with token...');
        try {
          const profileResponse = await axios.get(
            `${API_URL}/auth/me`,
            { headers: { 'x-auth-token': token } }
          );
          console.log('Profile response:', profileResponse.data);
          console.log('✅ Successfully accessed protected route');
        } catch (error) {
          console.error('❌ Protected route access failed');
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Response data:', error.response.data);
          } else {
            console.error('Error:', error.message);
          }
        }
      } else {
        console.log('⚠️ Login successful but no token received');
      }
    } catch (error) {
      console.error('❌ Login failed');
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Response data:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
    
    console.log('\n=== AUTHENTICATION DEBUGGING COMPLETE ===');
  } catch (error) {
    console.error('Unexpected error during debugging:', error);
  }
}

debugAuth();