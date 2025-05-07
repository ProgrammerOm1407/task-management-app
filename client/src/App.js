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
  
  useEffect(() => {
    // Check if user is authenticated
    const checkAuthentication = async () => {
      if (checkAuth()) {
        setIsAuthenticated(true);
        try {
          const userData = await getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
      setLoading(false);
    };
    
    checkAuthentication();
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