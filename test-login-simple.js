const axios = require('axios');

async function testLogin() {
  try {
    console.log('Testing login API...');
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login successful!');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Login failed!');
    console.error('Error:', error.message);
  }
}

testLogin();