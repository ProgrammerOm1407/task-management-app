import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

// Get auth token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Set auth token in headers
const setAuthHeader = () => {
  const token = getToken();
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-auth-token': token
    }
  };
};

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await axios.get(API_URL, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await axios.post(API_URL, taskData, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await axios.put(`${API_URL}/${taskId}`, taskData, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await axios.delete(`${API_URL}/${taskId}`, setAuthHeader());
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};