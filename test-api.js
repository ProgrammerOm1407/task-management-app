/**
 * Simple script to test the Task API endpoints
 * Run with: node test-api.js
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
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
};

// Store the created task ID and auth token
let createdTaskId;
let authToken;

// Authentication functions
async function registerOrLoginUser() {
  try {
    console.log('\n--- Setting up authentication ---');
    // Try to register first
    try {
      const response = await axios.post(`${API_URL}/auth/register`, testUser);
      authToken = response.data.token;
      console.log('User registered successfully');
    } catch (error) {
      // If registration fails (likely because user already exists), try login
      console.log('Registration failed, trying login...');
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginResponse.data.token;
      console.log('User logged in successfully');
    }
    
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }
    
    console.log('Authentication setup complete ✅');
    return true;
  } catch (error) {
    console.error('Authentication setup failed ❌');
    console.error(`Error: ${error.response?.data?.message || error.message}`);
    return false;
  }
}

// Test functions
async function testGetAllTasks() {
  try {
    console.log('\n--- Testing GET /api/tasks ---');
    const response = await axios.get(`${API_URL}/tasks`);
    console.log(`Status: ${response.status}`);
    console.log(`Total tasks: ${response.data.count}`);
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
    const response = await axios.get(`${API_URL}/tasks/${createdTaskId}`);
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