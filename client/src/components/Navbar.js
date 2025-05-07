import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ isAuthenticated, logout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Task Manager</Link>
      </div>
      <ul className="navbar-nav">
        {isAuthenticated ? (
          <>
            <li className="nav-item">
              <Link to="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <button onClick={logout} className="nav-link">Logout</button>
            </li>
          </>
        ) : (
          <>
            <li className="nav-item">
              <Link to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;