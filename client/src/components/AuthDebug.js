import React, { useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser } from '../services/authService';

const AuthDebug = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    token: null,
    user: null,
    error: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isAuth = isAuthenticated();
        const token = localStorage.getItem('token');
        
        let user = null;
        if (isAuth) {
          user = await getCurrentUser();
        }
        
        setAuthStatus({
          isAuthenticated: isAuth,
          token: token,
          user: user,
          error: null
        });
      } catch (error) {
        setAuthStatus(prev => ({
          ...prev,
          error: error.message
        }));
      }
    };
    
    checkAuth();
  }, []);

  return (
    <div className="card mt-3">
      <div className="card-header bg-info text-white">
        Authentication Debug
      </div>
      <div className="card-body">
        <p><strong>Is Authenticated:</strong> {authStatus.isAuthenticated ? 'Yes' : 'No'}</p>
        <p><strong>Token Present:</strong> {authStatus.token ? 'Yes' : 'No'}</p>
        {authStatus.user && (
          <div>
            <p><strong>User Info:</strong></p>
            <pre>{JSON.stringify(authStatus.user, null, 2)}</pre>
          </div>
        )}
        {authStatus.error && (
          <div className="alert alert-danger mt-3">
            <strong>Error:</strong> {authStatus.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebug;