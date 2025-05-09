import axios from 'axios';
import config from '../config';

// Create an axios instance with default config
const api = axios.create({
  baseURL: config.API_BASE_URL, // Use the Render-hosted API URL
  headers: {
    'Content-Type': 'application/json'
  }
});

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

// Register user
export const register = async (userData) => {
  try {
    console.log('Attempting registration with:', userData);
    console.log('API base URL:', api.defaults.baseURL);
    
    const response = await api.post('/users/register', userData);
    console.log('Registration response:', response.data);
    
    // Store token if registration is successful
    if (response.data && response.data.token) {
      console.log('Storing token in localStorage');
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      request: error.request ? 'Request was made but no response received' : 'No request made'
    });
    throw handleApiError(error);
  }
};

// Login user
export const login = async (userData) => {
  try {
    console.log('Attempting login with:', userData);
    console.log('API base URL:', api.defaults.baseURL);
    
    // Try direct API call if the main request fails
    let response;
    try {
      // First try with the main API
      response = await api.post('/auth/login', userData);
    } catch (apiError) {
      console.warn('Main API login failed, trying fallback:', apiError.message);
      // Fall back to direct API call with explicit URL
      response = await axios.post(`${config.API_BASE_URL}/auth/login`, userData, {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log('Login response status:', response.status);
    console.log('Login response headers:', response.headers);
    console.log('Login response data:', response.data);
    
    // Store token if login is successful
    if (response.data && response.data.token) {
      console.log('Storing token in localStorage');
      localStorage.removeItem('token'); // Clear any existing token first
      localStorage.setItem('token', response.data.token);
      // Verify token was stored
      const storedToken = localStorage.getItem('token');
      console.log('Token stored successfully:', !!storedToken);
    } else {
      console.warn('No token received in login response');
    }
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      request: error.request ? 'Request was made but no response received' : 'No request made'
    });
    throw handleApiError(error);
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Add auth headers for this specific request
    const response = await api.get('/auth/me', {
      headers: {
        'x-auth-token': token,
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Check if response has the expected structure
    if (response.data && response.data.data) {
      return response.data.data; // Extract user data from response
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    // If unauthorized, clear token
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('isAuthenticated check - token in localStorage:', token);
  const isValid = token !== null && token !== 'undefined' && token !== '';
  console.log('isAuthenticated result:', isValid);
  return isValid;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};