import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskPage from './pages/TaskPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './styles/main.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  
  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  
  return (
    <Router>
      <div className="app">
        <Navbar isAuthenticated={isAuthenticated} logout={logout} />
        <div className="container">
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