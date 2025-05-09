import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskPage from './pages/TaskPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { isAuthenticated as checkAuth, logout as authLogout, getCurrentUser } from './services/authService';
import './styles/main.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Function to check authentication status
  const checkAuthentication = async () => {
    console.log('Checking authentication status...');
    const isAuth = checkAuth();
    console.log('Is authenticated according to checkAuth():', isAuth);
    
    if (isAuth) {
      console.log('User is authenticated, setting state...');
      setIsAuthenticated(true);
      try {
        console.log('Fetching current user data...');
        const userData = await getCurrentUser();
        console.log('User data received:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    } else {
      console.log('User is not authenticated');
      setIsAuthenticated(false);
      setUser(null);
    }
    setLoading(false);
  };
  
  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);
  
  // Add event listener for storage changes (for multi-tab support)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('Token changed in localStorage, updating authentication state');
        checkAuthentication();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  
  const logout = () => {
    authLogout();
    setIsAuthenticated(false);
    setUser(null);
  };
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app min-vh-100 d-flex flex-column">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} user={user} />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={isAuthenticated ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
            <Route path="/tasks" element={isAuthenticated ? <TaskPage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!isAuthenticated ? <LoginPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/tasks" />} />
            <Route path="/register" element={!isAuthenticated ? <RegisterPage setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/tasks" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;