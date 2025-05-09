/**
 * Test script for the authentication middleware
 * Tests different ways of providing the authentication token
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Store token for authenticated requests
let token;

// Function to login and get token
async function loginUser() {
  try {
    console.log('Logging in to get authentication token...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.token) {
      console.log('✅ Login successful!');
      token = response.data.token;
      return true;
    } else {
      console.log('❌ Login failed: No token received');
      return false;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test using x-auth-token header (standard method)
async function testXAuthTokenHeader() {
  try {
    console.log('\n--- Testing x-auth-token header ---');
    const response = await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task via x-auth-token' },
      { headers: { 'x-auth-token': token } }
    );
    
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log('✅ Test passed: Successfully authenticated with x-auth-token header');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test using Authorization Bearer header
async function testAuthorizationHeader() {
  try {
    console.log('\n--- Testing Authorization Bearer header ---');
    const response = await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task via Authorization header' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log('✅ Test passed: Successfully authenticated with Authorization header');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test using query parameter
async function testQueryParameter() {
  try {
    console.log('\n--- Testing token as query parameter ---');
    const response = await axios.post(
      `${API_URL}/tasks?token=${token}`, 
      { title: 'Test Task via query parameter' }
    );
    
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log('✅ Test passed: Successfully authenticated with query parameter');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test using request body
async function testRequestBody() {
  try {
    console.log('\n--- Testing token in request body ---');
    const response = await axios.post(
      `${API_URL}/tasks`, 
      { 
        title: 'Test Task via request body',
        token: token 
      }
    );
    
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log('✅ Test passed: Successfully authenticated with token in request body');
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Test with expired token
async function testExpiredToken() {
  try {
    console.log('\n--- Testing with expired token ---');
    // This is a manually expired token (you can replace with a real expired token)
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjgxYmQ3MTkwYjI2ODcxNjYyNjAyMjUyIn0sImlhdCI6MTc0NjY1NjUyNiwiZXhwIjoxNTgwMDAwMDAwfQ.yHSCr-BIQuEfwSx0eQsXf5lNQGyT2myXobPBZ2sHizY';
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with expired token' },
      { headers: { 'x-auth-token': expiredToken } }
    );
    
    console.log('❌ Test failed: Should have rejected expired token');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log('✅ Test passed: Correctly rejected expired token');
      return true;
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
      return false;
    }
  }
}

// Test with malformed token
async function testMalformedToken() {
  try {
    console.log('\n--- Testing with malformed token ---');
    const malformedToken = 'invalid.token.format';
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with malformed token' },
      { headers: { 'x-auth-token': malformedToken } }
    );
    
    console.log('❌ Test failed: Should have rejected malformed token');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected malformed token');
      return true;
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
      return false;
    }
  }
}

// Test with invalid signature token
async function testInvalidSignatureToken() {
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
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected token with invalid signature');
      return true;
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
      return false;
    }
  }
}

// Test with completely invalid token
async function testInvalidTokenFormat() {
  try {
    console.log('\n--- Testing with completely invalid token format ---');
    const invalidToken = 'not-even-close-to-a-jwt-token';
    
    await axios.post(
      `${API_URL}/tasks`, 
      { title: 'Test Task with completely invalid token' },
      { headers: { 'x-auth-token': invalidToken } }
    );
    
    console.log('❌ Test failed: Should have rejected completely invalid token');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Message: ${error.response.data.message}`);
      console.log(`Error code: ${error.response.data.error}`);
      console.log('✅ Test passed: Correctly rejected completely invalid token');
      return true;
    } else {
      console.error('❌ Test failed with unexpected error:', error.message);
      return false;
    }
  }
}

// Run all tests
async function runTests() {
  console.log('=== STARTING AUTH MIDDLEWARE TESTS ===');
  
  // First login to get a valid token
  const loginSuccess = await loginUser();
  
  if (!loginSuccess) {
    console.error('Login failed, cannot proceed with tests');
    return;
  }
  
  // Test different authentication methods
  await testXAuthTokenHeader();
  await testAuthorizationHeader();
  await testQueryParameter();
  await testRequestBody();
  
  // Test error handling
  await testExpiredToken();
  await testMalformedToken();
  await testInvalidSignatureToken();
  await testInvalidTokenFormat();
  
  console.log('\n=== AUTH MIDDLEWARE TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});