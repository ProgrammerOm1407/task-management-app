const axios = require('axios');

async function testServerConnection() {
  try {
    console.log('Testing server connection...');
    const response = await axios.get('http://localhost:5000/health');
    console.log('Server is responding:', response.data);
    return true;
  } catch (error) {
    console.error('Server connection failed!');
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received. Server might be down or unreachable.');
    } else {
      console.error('Error:', error.message);
    }
    return false;
  }
}

testServerConnection();