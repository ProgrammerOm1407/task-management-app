const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Test user data
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Store token for authenticated requests
let token;

// Function to register a new user
async function registerUser() {
  try {
    console.log('Testing user registration...');
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log('Registration response:', response.data);
    
    if (response.data.success && response.data.token) {
      console.log('✅ Registration successful!');
      token = response.data.token;
      return true;
    } else {
      console.log('❌ Registration failed: Invalid response format or no token received');
      return false;
    }
  } catch (error) {
    console.error('❌ Registration failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to login a user
async function loginUser() {
  try {
    console.log('Testing user login...');
    const response = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log('Login response:', response.data);
    
    if (response.data.success && response.data.token) {
      console.log('✅ Login successful!');
      token = response.data.token;
      return true;
    } else {
      console.log('❌ Login failed: Invalid response format or no token received');
      return false;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to test accessing a protected route without a token
async function testProtectedRouteWithoutToken() {
  try {
    console.log('Testing protected route without token...');
    await axios.post(`${API_URL}/tasks`, {
      title: 'Test Task'
    });
    
    console.log('❌ Test failed: Accessed protected route without token');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log('✅ Test passed: Protected route correctly denied access');
      return true;
    } else {
      console.error('❌ Test failed with unexpected error:', error.response ? error.response.data : error.message);
      return false;
    }
  }
}

// Function to test accessing a protected route with a token
async function testProtectedRouteWithToken() {
  try {
    console.log('Testing protected route with token...');
    const response = await axios.post(
      `${API_URL}/tasks`, 
      { 
        title: 'Test Task',
        description: 'This is a test task',
        status: 'To Do',
        priority: 'Medium'
      },
      { headers: { 'x-auth-token': token } }
    );
    
    console.log('Protected route response:', response.data);
    
    if (response.data.success) {
      console.log('✅ Test passed: Successfully created task with token');
      return true;
    } else {
      console.log('❌ Test failed: Could not create task with token');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Function to get user profile
async function getUserProfile() {
  try {
    console.log('Testing get user profile...');
    const response = await axios.get(
      `${API_URL}/auth/me`,
      { headers: { 'x-auth-token': token } }
    );
    
    console.log('User profile response:', response.data);
    
    if (response.data && response.data.success) {
      console.log('✅ Test passed: Successfully retrieved user profile');
      console.log('User:', response.data.data);
      return true;
    } else {
      console.log('❌ Test failed: Could not retrieve user profile');
      return false;
    }
  } catch (error) {
    console.error('❌ Test failed:', error.response ? error.response.data : error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== STARTING JWT AUTHENTICATION TESTS ===');
  
  // Test registration
  let registered = await registerUser();
  
  // If registration fails, try login (user might already exist)
  if (!registered) {
    await loginUser();
  }
  
  // Test protected routes
  await testProtectedRouteWithoutToken();
  await testProtectedRouteWithToken();
  
  // Test user profile
  await getUserProfile();
  
  console.log('=== JWT AUTHENTICATION TESTS COMPLETED ===');
}

// Run the tests
runTests();