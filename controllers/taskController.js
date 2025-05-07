const Task = require('../models/Task');
const logger = require('../utils/logger');

/**
 * Get all tasks
 * @route GET /api/tasks
 * @access Public
 */
const getTasks = async (req, res) => {
  try {
    // Add query parameters for filtering
    const filter = {};
    
    // Filter by status if provided
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    // Filter by priority if provided
    if (req.query.priority) {
      filter.priority = req.query.priority;
    }
    
    // Filter by user if authenticated
    if (req.user && req.user.id) {
      filter.user = req.user.id;
    }
    
    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    
    if (tasks.length === 0) {
      return res.status(200).json({ 
        success: true, 
        count: 0, 
        data: [],
        message: 'No tasks found'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      count: tasks.length, 
      data: tasks 
    });
  } catch (err) {
    logger.error('Error fetching tasks:', err.message);
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: 'Failed to retrieve tasks'
    });
  }
};

/**
 * Add new task
 * @route POST /api/tasks
 * @access Private
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation Error',
        message: 'Title is required'
      });
    }
    
    // Create new task with user reference
    const newTask = new Task({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      user: req.user.id // Add the authenticated user's ID
    });
    
    const task = await newTask.save();
    
    res.status(201).json({ 
      success: true, 
      data: task,
      message: 'Task created successfully'
    });
  } catch (err) {
    logger.error('Error creating task:', err.message);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: 'Failed to create task'
    });
  }
};

/**
 * Update task
 * @route PUT /api/tasks/:id
 * @access Private
 */
const updateTask = async (req, res) => {
  try {
    // Check if ID is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    // Find task first to check if it exists
    const taskExists = await Task.findById(req.params.id);
    
    if (!taskExists) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found',
        message: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (taskExists.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You are not authorized to update this task'
      });
    }
    
    // Update the task
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({ 
      success: true, 
      data: task,
      message: 'Task updated successfully'
    });
  } catch (err) {
    logger.error('Error updating task:', err.message);
    
    // Handle validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    
    // Handle cast errors (invalid ID format)
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: 'Failed to update task'
    });
  }
};

/**
 * Delete task
 * @route DELETE /api/tasks/:id
 * @access Private
 */
const deleteTask = async (req, res) => {
  try {
    // Check if ID is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    // Find task first to check if it exists
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found',
        message: 'Task not found'
      });
    }
    
    // Check if task belongs to user
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You are not authorized to delete this task'
      });
    }
    
    // Delete the task
    await Task.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ 
      success: true, 
      data: {},
      message: 'Task deleted successfully'
    });
  } catch (err) {
    logger.error('Error deleting task:', err.message);
    
    // Handle cast errors (invalid ID format)
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: 'Failed to delete task'
    });
  }
};

/**
 * Get single task by ID
 * @route GET /api/tasks/:id
 * @access Public
 */
const getTaskById = async (req, res) => {
  try {
    // Check if ID is valid
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ 
        success: false, 
        error: 'Not Found',
        message: 'Task not found'
      });
    }
    
    // If user is authenticated, check if task belongs to user
    if (req.user && req.user.id && task.user && task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'You are not authorized to view this task'
      });
    }
    
    res.status(200).json({ 
      success: true, 
      data: task 
    });
  } catch (err) {
    logger.error('Error fetching task by ID:', err.message);
    
    // Handle cast errors (invalid ID format)
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid ID',
        message: 'Please provide a valid task ID'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: 'Server Error',
      message: 'Failed to retrieve task'
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};