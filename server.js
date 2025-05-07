const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.get('/', (req, res) => {
  res.send('Task Management API is running');
});

// Use Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});