const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    console.log('Request URL: http://localhost:5000/api/auth/login');
    console.log('Request data:', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Set a longer timeout for the request
    const response = await axios.post(
      'http://localhost:5000/api/auth/login', 
      {
        email: 'test@example.com',
        password: 'password123'
      },
      {
        timeout: 10000 // 10 seconds timeout
      }
    );
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      console.log('Token received:', response.data.token);
      
      // Test token by making an authenticated request
      console.log('\nTesting authentication with token...');
      const authResponse = await axios.get('http://localhost:5000/api/auth/me', {
        headers: {
          'x-auth-token': response.data.token,
          'Authorization': `Bearer ${response.data.token}`
        },
        timeout: 5000
      });
      
      console.log('Authentication successful!');
      console.log('User data:', authResponse.data);
    } else {
      console.log('No token in response!');
    }
  } catch (error) {
    console.error('Login failed!');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received. Request details:', error.request._currentUrl);
      console.error('Server might be down or the endpoint might be incorrect.');
    } else {
      console.error('Error details:', error);
    }
  }
}

testLogin();