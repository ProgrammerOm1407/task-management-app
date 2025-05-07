import React, { useState, useEffect } from 'react';
import TaskItem from '../components/TaskItem';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateTask(currentTaskId, formData);
        setIsEditing(false);
        setCurrentTaskId(null);
      } else {
        await createTask(formData);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: ''
      });
      
      // Refresh tasks
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleUpdate = (task) => {
    setIsEditing(true);
    setCurrentTaskId(task._id);
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
    });
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="task-page">
      <h1>{isEditing ? 'Edit Task' : 'Add New Task'}</h1>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleInputChange}
          />
        </div>
        
        <button type="submit" className="btn-submit">
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
        
        {isEditing && (
          <button 
            type="button" 
            className="btn-cancel" 
            onClick={() => {
              setIsEditing(false);
              setCurrentTaskId(null);
              setFormData({
                title: '',
                description: '',
                status: 'To Do',
                priority: 'Medium',
                dueDate: ''
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>
      
      <h2>Your Tasks</h2>
      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks found. Add a new task to get started!</p>
        ) : (
          tasks.map(task => (
            <TaskItem 
              key={task._id} 
              task={task} 
              onDelete={handleDelete} 
              onUpdate={handleUpdate} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskPage;