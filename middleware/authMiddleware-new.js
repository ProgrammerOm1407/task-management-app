const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and adds user data to request
 */
module.exports = function(req, res, next) {
  // Get token from various places
  // 1. From x-auth-token header (primary)
  // 2. From Authorization header (Bearer token)
  // 3. From query parameter
  // 4. From request body
  let token = req.header('x-auth-token');
  let tokenSource = token ? 'x-auth-token header' : null;
  
  // Check Authorization header if token not found
  if (!token && req.headers.authorization) {
    try {
      // Format: "Bearer [token]"
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7, authHeader.length);
        tokenSource = 'Authorization header';
      }
    } catch (error) {
      logger.error('Auth middleware: Error parsing Authorization header', error);
    }
  }
  
  // Check query parameter if token not found
  if (!token && req.query && req.query.token) {
    token = req.query.token;
    tokenSource = 'query parameter';
  }
  
  // Check request body if token not found
  if (!token && req.body && req.body.token) {
    token = req.body.token;
    tokenSource = 'request body';
  }

  // Check for cookie if token not found
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    tokenSource = 'cookie';
  }

  // Log token source if found
  if (token && token !== 'null' && token !== 'undefined' && token !== '') {
    logger.info(`Auth middleware: Token found in ${tokenSource}`);
  }

  // Check if no token found in any location
  if (!token || token === 'null' || token === 'undefined' || token === '') {
    logger.warn('Auth middleware: No token provided in request', {
      url: req.originalUrl,
      method: req.method
    });
    
    return res.status(401).json({ 
      success: false,
      message: 'Authentication token is required. Please provide a valid token.',
      error: 'missing_token',
      help: 'Include a token using one of these methods: x-auth-token header, Authorization Bearer header, token query parameter, or token in request body'
    });
  }

  // Verify token
  try {
    // Check for JWT_SECRET
    if (!process.env.JWT_SECRET) {
      logger.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({ 
        success: false,
        message: 'Server configuration error',
        error: 'server_config_error'
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if decoded token has user property
    if (!decoded.user || !decoded.user.id) {
      logger.error('Auth middleware: Invalid token structure');
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token structure',
        error: 'invalid_token_structure'
      });
    }
    
    // Set user info in request object
    req.user = decoded.user;
    
    // Continue to the next middleware/route handler
    next();
  } catch (err) {
    // Handle different JWT errors
    if (err.name === 'TokenExpiredError') {
      logger.warn('Auth middleware: Token expired', { tokenExpiry: err.expiredAt });
      return res.status(401).json({ 
        success: false,
        message: 'Token has expired. Please login again.',
        error: 'token_expired'
      });
    } else if (err.name === 'JsonWebTokenError') {
      // Handle specific JWT error messages
      let errorMessage = 'Invalid authentication token';
      let errorCode = 'invalid_token';
      
      switch (err.message) {
        case 'invalid signature':
          errorMessage = 'Token signature verification failed. The token may have been tampered with.';
          errorCode = 'invalid_signature';
          logger.error('Auth middleware: Invalid token signature detected');
          break;
          
        case 'jwt malformed':
          errorMessage = 'Malformed token. Please provide a valid JWT token.';
          errorCode = 'malformed_token';
          logger.error('Auth middleware: Malformed token detected');
          break;
          
        case 'jwt must be provided':
          errorMessage = 'No token was provided.';
          errorCode = 'missing_token';
          logger.error('Auth middleware: No token provided');
          break;
          
        default:
          logger.error(`Auth middleware: JWT error - ${err.message}`);
          break;
      }
      
      return res.status(401).json({ 
        success: false,
        message: errorMessage,
        error: errorCode
      });
    } else {
      logger.error('Auth middleware: Token verification failed', err);
      return res.status(401).json({ 
        success: false,
        message: 'Authentication failed. Please try again.',
        error: 'authentication_failed'
      });
    }
  }
};