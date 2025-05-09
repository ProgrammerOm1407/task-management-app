/**
 * Test script to check the response format
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

async function testResponseFormat() {
  try {
    console.log('=== TESTING RESPONSE FORMAT ===');
    
    // Test accessing a protected route without a token
    console.log('\nTesting protected route with no token...');
    try {
      await axios.get(`${API_URL}/auth/me`);
    } catch (error) {
      if (error.response) {
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
        console.log('Response data:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.error('No response received:', error.message);
      }
    }
    
    console.log('\n=== RESPONSE FORMAT TEST COMPLETED ===');
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

testResponseFormat();