import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api', // Use relative URL to work with proxy in package.json
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to add auth token to all requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Clear token and redirect to login if authentication fails
      console.log('Authentication error detected, redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  
  // If there's a response with data, return it
  if (error.response && error.response.data) {
    return error.response.data;
  }
  
  // Otherwise return a generic error
  return { 
    success: false, 
    message: 'An unexpected error occurred. Please try again.' 
  };
};

// Get all tasks
export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data.data || []; // Extract the tasks array from the response
  } catch (error) {
    throw handleApiError(error);
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const response = await api.post('/tasks', taskData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Update a task
export const updateTask = async (taskId, taskData) => {
  try {
    const response = await api.put(`/tasks/${taskId}`, taskData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Delete a task
export const deleteTask = async (taskId) => {
  try {
    const response = await api.delete(`/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};