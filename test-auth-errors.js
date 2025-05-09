/**
 * Test script for the authentication middleware error handling
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test with invalid signature token
async function testInvalidSignature() {
  try {
    console.log('\n--- Testing with invalid signature token ---');
    // This is a valid format JWT but with an invalid signature
    const invalidSignatureToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgxYmQ3MTkwYjI2ODcxNjYyNjAyMjUyIn0sImlhdCI6MTc0NjY1NjUyNiwiZXhwIjoxNzQ2NjYwMTI2fQ.INVALID_SIGNATURE_HERE';
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with invalid signature' },
      { headers: { 'x-auth-token': invalidSignatureToken } }
    );
    
    console.log('❌ Test failed: Should have rejected token with invalid signature');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected token with invalid signature');
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
    }
  }
}

// Test with malformed token
async function testMalformedToken() {
  try {
    console.log('\n--- Testing with malformed token ---');
    const malformedToken = 'invalid.token';
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with malformed token' },
      { headers: { 'x-auth-token': malformedToken } }
    );
    
    console.log('❌ Test failed: Should have rejected malformed token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected malformed token');
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
    }
  }
}

// Test with no token
async function testNoToken() {
  try {
    console.log('\n--- Testing with no token ---');
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with no token' }
    );
    
    console.log('❌ Test failed: Should have rejected request with no token');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected request with no token');
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
    }
  }
}

// Run all tests
async function runTests() {
  console.log('=== STARTING AUTH ERROR TESTS ===');
  
  await testInvalidSignature();
  await testMalformedToken();
  await testNoToken();
  
  console.log('\n=== AUTH ERROR TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});