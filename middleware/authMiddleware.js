const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    logger.warn('Auth middleware: No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'No token, authorization denied' 
    });
  }

  // Verify token
  try {
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    logger.error('Auth middleware: Token verification failed', err);
    res.status(401).json({ 
      success: false,
      message: 'Token is not valid' 
    });
  }
};