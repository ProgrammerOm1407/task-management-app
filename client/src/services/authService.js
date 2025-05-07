import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Register user
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Login user
export const login = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    const response = await axios.get(`${API_URL}/auth/me`, {
      headers: {
        'x-auth-token': token
      }
    });
    return response.data;
  } catch (error) {
    localStorage.removeItem('token');
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
};