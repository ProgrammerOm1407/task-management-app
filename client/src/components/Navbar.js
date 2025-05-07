import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout, user }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-check2-square me-2"></i>
          Task Manager
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/tasks">
                    <i className="bi bi-list-task me-1"></i>
                    Tasks
                  </Link>
                </li>
                {user && (
                  <li className="nav-item">
                    <span className="nav-link user-greeting">
                      <i className="bi bi-person-circle me-1"></i>
                      Welcome, {user.name}
                    </span>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={logout} className="nav-link btn btn-link">
                    <i className="bi bi-box-arrow-right me-1"></i>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    <i className="bi bi-box-arrow-in-right me-1"></i>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    <i className="bi bi-person-plus me-1"></i>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;