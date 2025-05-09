const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

async function testLogin() {
  try {
    console.log('Testing login...');
    const response = await axios.post(`${API_URL}/auth/login`, testUser);
    console.log('Login response:', response.data);
    
    if (response.data.token) {
      console.log('Login successful!');
      return response.data.token;
    } else {
      console.log('Login failed: No token received');
      return null;
    }
  } catch (error) {
    console.error('Login error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

testLogin()
  .then(token => {
    if (token) {
      console.log('Token:', token);
    }
  })
  .catch(err => console.error('Unexpected error:', err));