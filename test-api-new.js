/**
 * Simple script to test the Task API endpoints
 * Run with: node test-api-new.js
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test data
const newTask = {
  title: 'Test Task',
  description: 'This is a test task created by the API test script',
  status: 'To Do',
  priority: 'Medium',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 days from now
};

// Test user data
const testUser = {
  name: 'API Test User',
  email: 'apitest@example.com',
  password: 'password123'
};

// Store the created task ID and auth token
let createdTaskId;
let authToken;

// Authentication functions
async function registerOrLoginUser() {
  try {
    console.log('\n--- Setting up authentication ---');
    
    // First check if the server is running
    try {
      await axios.get('http://localhost:3000/health');
      console.log('Server is running on port 3000');
    } catch (error) {
      console.error('Server is not running on port 3000');
      throw new Error('Server connection failed. Make sure the server is running on port 3000.');
    }
    
    // Try to register first
    try {
      console.log('Attempting to register user:', testUser.email);
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      
      if (response.data && response.data.success && response.data.token) {
        console.log('Registration response:', response.data);
        authToken = response.data.token;
        console.log('User registered successfully');
      } else {
        console.error('Registration response did not contain a token:', response.data);
        throw new Error('Invalid registration response format');
      }
    } catch (error) {
      // If registration fails (likely because user already exists), try login
      console.log('Registration failed, trying login...');
      
      if (error.response && error.response.data && 
          error.response.status === 400 && 
          error.response.data.message.includes('already exists')) {
        console.log('User already exists, proceeding to login');
      } else {
        console.error('Registration error:', error.response?.data || error.message);
      }
      
      try {
        console.log('Attempting to login with:', testUser.email);
        const loginResponse = await axios.post(`${API_URL}/auth/login`, {
          email: testUser.email,
          password: testUser.password
        });
        
        if (loginResponse.data && loginResponse.data.success && loginResponse.data.token) {
          console.log('Login response:', loginResponse.data);
          authToken = loginResponse.data.token;
          console.log('User logged in successfully');
        } else {
          console.error('Login response did not contain a token:', loginResponse.data);
          throw new Error('Invalid login response format');
        }
      } catch (loginError) {
        console.error('Login failed:', loginError.response?.data || loginError.message);
        throw new Error('Both registration and login failed');
      }
    }
    
    // Verify the token by making a test request
    try {
      console.log('Verifying token by accessing protected route...');
      const verifyResponse = await axios.get(
        `${API_URL}/auth/me`,
        { headers: { 'x-auth-token': authToken } }
      );
      console.log('Token verification successful:', verifyResponse.data.success);
    } catch (error) {
      console.error('Token verification failed:', error.response?.data || error.message);
      throw new Error('Token verification failed');
    }
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }
    
    console.log('Authentication setup complete ✅');
    return true;
  } catch (error) {
    console.error('Authentication setup failed ❌');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Test functions
async function testGetAllTasks() {
  try {
    console.log('\n--- Testing GET /api/tasks ---');
    const response = await axios.get(`${API_URL}/tasks`, {
      headers: { 'x-auth-token': authToken }
    });
    console.log(`Status: ${response.status}`);
    console.log(`Total tasks: ${response.data.count || 0}`);
    console.log('Test passed ✅');
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testCreateTask() {
  try {
    console.log('\n--- Testing POST /api/tasks ---');
    const response = await axios.post(
      `${API_URL}/tasks`, 
      newTask,
      { headers: { 'x-auth-token': authToken } }
    );
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`Created task ID: ${response.data.data._id}`);
    createdTaskId = response.data.data._id;
    console.log('Test passed ✅');
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testGetTaskById() {
  try {
    console.log('\n--- Testing GET /api/tasks/:id ---');
    const response = await axios.get(
      `${API_URL}/tasks/${createdTaskId}`,
      { headers: { 'x-auth-token': authToken } }
    );
    console.log(`Status: ${response.status}`);
    console.log(`Task title: ${response.data.data.title}`);
    console.log('Test passed ✅');
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testUpdateTask() {
  try {
    console.log('\n--- Testing PUT /api/tasks/:id ---');
    const updateData = {
      status: 'In Progress',
      description: 'This task has been updated by the test script'
    };
    const response = await axios.put(
      `${API_URL}/tasks/${createdTaskId}`, 
      updateData,
      { headers: { 'x-auth-token': authToken } }
    );
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log(`New status: ${response.data.data.status}`);
    console.log('Test passed ✅');
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testDeleteTask() {
  try {
    console.log('\n--- Testing DELETE /api/tasks/:id ---');
    const response = await axios.delete(
      `${API_URL}/tasks/${createdTaskId}`,
      { headers: { 'x-auth-token': authToken } }
    );
    console.log(`Status: ${response.status}`);
    console.log(`Message: ${response.data.message}`);
    console.log('Test passed ✅');
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

async function testErrorHandling() {
  try {
    console.log('\n--- Testing Error Handling ---');
    
    // Test creating task without title (should fail)
    console.log('\n1. Creating task without title:');
    try {
      await axios.post(
        `${API_URL}/tasks`, 
        { description: 'No title task' },
        { headers: { 'x-auth-token': authToken } }
      );
      console.error('Test failed ❌ - Should have thrown an error');
    } catch (error) {
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Error: ${error.response.data.message}`);
        console.log('Test passed ✅');
      } else {
        throw error;
      }
    }
    
    // Test updating non-existent task (should fail)
    console.log('\n2. Updating non-existent task:');
    try {
      await axios.put(
        `${API_URL}/tasks/60d21b4667d0d8992e610c99`, 
        { status: 'Completed' },
        { headers: { 'x-auth-token': authToken } }
      );
      console.error('Test failed ❌ - Should have thrown an error');
    } catch (error) {
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Error: ${error.response.data.message}`);
        console.log('Test passed ✅');
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Test failed ❌');
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API Tests...');
  
  // First authenticate
  const authSuccess = await registerOrLoginUser();
  
  if (!authSuccess) {
    console.error('Authentication failed, cannot proceed with tests');
    return;
  }
  
  // Get all tasks
  await testGetAllTasks();
  
  // Create a new task
  const createSuccess = await testCreateTask();
  
  if (createSuccess && createdTaskId) {
    // If task was created successfully, test other operations
    await testGetTaskById();
    await testUpdateTask();
    await testDeleteTask();
  }
  
  // Test error handling
  await testErrorHandling();
  
  console.log('\n🏁 All tests completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
});