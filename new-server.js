const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const logger = require('./utils/logger');

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Server error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Routes
app.get('/', (req, res) => {
  res.send('Task Management API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is healthy',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Define port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    if (!process.env.MONGO_URI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    logger.info('MongoDB Connected Successfully');
    
    // Load routes after DB connection
    app.use('/api/tasks', require('./routes/taskRoutes'));
    app.use('/api/users', require('./routes/userRoutes'));
    
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

startServer();