const axios = require('axios');

async function testServer() {
  try {
    console.log('Testing server health endpoint...');
    const response = await axios.get('http://localhost:3000/health');
    console.log('Response:', response.data);
    return true;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

testServer();