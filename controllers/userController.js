const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create new user
    user = new User({
      name,
      email,
      password
    });

    // Save user to database (password will be hashed by the pre-save hook)
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error',
        error: 'server_config_error'
      });
    }
    
    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.status(201).json({ 
      success: true, 
      token,
      message: 'User registered successfully'
    });
  } catch (err) {
    console.error('Error during user registration:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: 'registration_failed'
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  // Only log non-sensitive information
  console.log('Login attempt received');
  const { email, password } = req.body;

  try {
    // Check if user exists
    console.log('Attempting to find user');
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Authentication failed: User not found');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    console.log('User found, verifying credentials');

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log('Authentication failed: Password mismatch');
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }
    
    console.log('Authentication successful');

    // Create JWT payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        success: false, 
        message: 'Server configuration error',
        error: 'server_config_error'
      });
    }
    
    // Sign token
    console.log('Generating authentication token');
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    console.log('Login successful, sending response');
    res.json({ 
      success: true, 
      token,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Error during login process:', err.message);
    // Don't expose detailed error messages to client
    res.status(500).json({ 
      success: false, 
      message: 'Server Error',
      error: 'login_failed'
    });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: 'User profile retrieved successfully'
    });
  } catch (err) {
    console.error('Error retrieving user profile:', err.message);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: 'profile_retrieval_failed'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};