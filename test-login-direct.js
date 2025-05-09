const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API directly...');
    
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    
    if (response.data.token) {
      console.log('Token received:', response.data.token);
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
    } else if (error.request) {
      console.error('No response received');
    }
  }
}

testLogin();