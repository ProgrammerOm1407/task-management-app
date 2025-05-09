/**
 * Test script to verify the "no token provided" error handling
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

async function testNoToken() {
  try {
    console.log('=== TESTING NO TOKEN HANDLING ===');
    
    // Test accessing a protected route without a token
    console.log('\n1. Testing protected route with no token...');
    try {
      await axios.get(`${API_URL}/auth/me`);
      console.log('❌ Test failed: Should have rejected request with no token');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test passed: Correctly rejected request with no token');
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data.message);
        console.log('Error code:', error.response.data.error);
        console.log('Help message:', error.response.data.help);
      } else {
        console.error('❌ Test failed with unexpected error:', error.message);
      }
    }
    
    // Test accessing a protected route with an empty token
    console.log('\n2. Testing protected route with empty token...');
    try {
      await axios.get(
        `${API_URL}/auth/me`,
        { headers: { 'x-auth-token': '' } }
      );
      console.log('❌ Test failed: Should have rejected request with empty token');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test passed: Correctly rejected request with empty token');
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data.message);
        console.log('Error code:', error.response.data.error);
        console.log('Help message:', error.response.data.help);
      } else {
        console.error('❌ Test failed with unexpected error:', error.message);
      }
    }
    
    // Test accessing a protected route with a null token
    console.log('\n3. Testing protected route with null token...');
    try {
      await axios.get(
        `${API_URL}/auth/me`,
        { headers: { 'x-auth-token': null } }
      );
      console.log('❌ Test failed: Should have rejected request with null token');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log('✅ Test passed: Correctly rejected request with null token');
        console.log('Status:', error.response.status);
        console.log('Message:', error.response.data.message);
        console.log('Error code:', error.response.data.error);
        console.log('Help message:', error.response.data.help);
      } else {
        console.error('❌ Test failed with unexpected error:', error.message);
      }
    }
    
    console.log('\n=== NO TOKEN HANDLING TESTS COMPLETED ===');
  } catch (error) {
    console.error('Unexpected error during testing:', error);
  }
}

testNoToken();