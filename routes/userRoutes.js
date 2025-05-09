const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware-new');

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get user profile (protected route)
router.get('/profile', authMiddleware, getUserProfile);

module.exports = router;