/**
 * Simple script to test the Task API endpoints
 * Run with: node test-api.js
 */

const axios = require('axios');

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Test data
const newTask = {
  title: 'Test Task',
  description: 'This is a test task created by the API test script',
  status: 'pending',
  priority: 'Medium',
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
};

// Store the created task ID
let createdTaskId;

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
    const response = await axios.post(`${API_URL}/tasks`, newTask);
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
      status: 'in-progress',
      description: 'This task has been updated by the test script'
    };
    const response = await axios.put(`${API_URL}/tasks/${createdTaskId}`, updateData);
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
    const response = await axios.delete(`${API_URL}/tasks/${createdTaskId}`);
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
      await axios.post(`${API_URL}/tasks`, { description: 'No title task' });
      console.error('Test failed ❌ - Should have thrown an error');
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
      console.log('Test passed ✅');
    }
    
    // Test updating non-existent task (should fail)
    console.log('\n2. Updating non-existent task:');
    try {
      await axios.put(`${API_URL}/tasks/60d21b4667d0d8992e610c99`, { status: 'completed' });
      console.error('Test failed ❌ - Should have thrown an error');
    } catch (error) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Error: ${error.response.data.message}`);
      console.log('Test passed ✅');
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
  
  // First get all tasks
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