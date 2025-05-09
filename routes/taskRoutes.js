const express = require('express');
const router = express.Router();
const { 
  getTasks,
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask 
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware-new');

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with optional filtering
 * @access  Public
 */
router.get('/', getTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get a single task by ID
 * @access  Public
 */
router.get('/:id', getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Private
 */
router.post('/', authMiddleware, createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update an existing task
 * @access  Private
 */
router.put('/:id', authMiddleware, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Delete a task
 * @access  Private
 */
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;