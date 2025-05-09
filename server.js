const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Initialize express
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
  // Check if we're in production and should use a specific origin list
  // or if we should allow all origins (useful for development/testing)
  origin: process.env.NODE_ENV === 'production' && process.env.CORS_RESTRICTED === 'true'
    ? [
        'https://taskmanagementapp-seven.vercel.app',
        'https://taskmanagementapp-seven-git-main.vercel.app',
        'https://taskmanagementapp-seven-*.vercel.app' // For preview deployments
      ]
    : [
        'https://taskmanagementapp-seven.vercel.app'  
}));
// app.use(cors({
//   origin: 'https://taskmanagementapp-seven.vercel.app',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true // if you're using cookies or auth headers
// }));
app.use(cookieParser());

// Log all requests for debugging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  
  // Log authentication headers for debugging
  if (req.url.includes('/auth')) {
    logger.info('Auth headers:', {
      authorization: req.headers.authorization ? 'Present' : 'Not present',
      'x-auth-token': req.headers['x-auth-token'] ? 'Present' : 'Not present'
    });
  }
  
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Task Management API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is healthy' });
});

// Use Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Define port
const PORT = process.env.PORT || 5000; // This should match the proxy in client/package.json

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });
    
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

const express = require('express');
const cors = require('cors');



startServer();