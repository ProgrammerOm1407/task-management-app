import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../services/authService';
import AuthDebug from '../components/AuthDebug';

const LoginPage = ({ setIsAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showTestCredentials, setShowTestCredentials] = useState(false);

  // Clear error when form data changes
  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      console.log('Submitting login form:', formData);
      const response = await login(formData);
      console.log('Login response received in component:', response);
      
      if (!response.success) {
        console.error('Login response indicates failure:', response);
        throw new Error(response.message || 'Login failed');
      }
      
      if (!response.token) {
        console.error('No token in response:', response);
        throw new Error('No authentication token received');
      }
      
      console.log('Login successful, token received');
      // Token is already stored in localStorage by the login function
      // Double-check that token is in localStorage
      const storedToken = localStorage.getItem('token');
      console.log('Token in localStorage after login:', !!storedToken);
      
      setIsAuthenticated(true);
      console.log('isAuthenticated state set to true');
    } catch (err) {
      console.error('Login error in component:', err);
      setError(err?.message || 'Login failed. Please check your credentials and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const useTestCredentials = () => {
    setFormData({
      email: 'test@example.com',
      password: 'password123'
    });
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <i className="bi bi-person-circle display-4 text-primary"></i>
                <h2 className="mt-2">Login</h2>
                <p className="text-muted">Sign in to access your tasks</p>
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="d-grid mb-3">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Login
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center mb-3">
                  <button 
                    type="button" 
                    className="btn btn-link" 
                    onClick={() => setShowTestCredentials(!showTestCredentials)}
                  >
                    {showTestCredentials ? 'Hide test credentials' : 'Show test credentials'}
                  </button>
                </div>

                {showTestCredentials && (
                  <div className="alert alert-info" role="alert">
                    <p className="mb-1"><strong>Test Email:</strong> test@example.com</p>
                    <p className="mb-1"><strong>Test Password:</strong> password123</p>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-info mt-2" 
                      onClick={useTestCredentials}
                    >
                      Use Test Credentials
                    </button>
                  </div>
                )}
              </form>
            </div>
            <div className="card-footer text-center py-3 bg-light">
              <p className="mb-0">
                Don't have an account? <Link to="/register" className="text-primary">Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <AuthDebug />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;