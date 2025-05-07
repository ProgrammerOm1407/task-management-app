import React, { useState, useEffect } from 'react';
import TaskItem from '../components/TaskItem';
import TaskFormModal from '../components/TaskFormModal';
import TaskFilter from '../components/TaskFilter';
import { getTasks, createTask, updateTask, deleteTask } from '../services/taskService';

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    searchTerm: ''
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, filters]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
      setFilteredTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to load tasks. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterTasks = () => {
    let result = [...tasks];
    
    // Filter by status
    if (filters.status !== 'all') {
      result = result.filter(task => task.status === filters.status);
    }
    
    // Filter by priority
    if (filters.priority !== 'all') {
      result = result.filter(task => task.priority === filters.priority);
    }
    
    // Filter by search term
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) || 
        task.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort tasks
    result.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          // Sort by due date (tasks without due date go to the end)
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          // Sort by priority (High > Medium > Low)
          const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          // Sort by status (To Do > In Progress > Completed)
          const statusOrder = { 'To Do': 0, 'In Progress': 1, 'Completed': 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        case 'title':
          // Sort alphabetically by title
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
    
    setFilteredTasks(result);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveTask = async (formData) => {
    try {
      if (currentTask) {
        await updateTask(currentTask._id, formData);
      } else {
        await createTask(formData);
      }
      
      setShowModal(false);
      setCurrentTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task. Please try again.');
    }
  };

  const handleUpdateClick = (task) => {
    setCurrentTask(task);
    setShowModal(true);
  };

  const handleDeleteClick = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  const handleAddNewClick = () => {
    setCurrentTask(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTask(null);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">
          <i className="bi bi-list-check me-2"></i>
          Task Manager
        </h1>
        <button 
          className="btn btn-primary" 
          onClick={handleAddNewClick}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Task
        </button>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}
      
      <TaskFilter 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />
      
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading tasks...</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-muted">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>
          
          {filteredTasks.length === 0 ? (
            <div className="card shadow-sm">
              <div className="card-body text-center py-5">
                <i className="bi bi-inbox display-1 text-muted"></i>
                <h3 className="mt-3">No tasks found</h3>
                <p className="text-muted">
                  {tasks.length === 0 
                    ? "You don't have any tasks yet. Add your first task to get started!" 
                    : "No tasks match your current filters. Try adjusting your filter criteria."}
                </p>
                {tasks.length === 0 && (
                  <button 
                    className="btn btn-primary mt-3" 
                    onClick={handleAddNewClick}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Your First Task
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              {filteredTasks.map(task => (
                <div className="col" key={task._id}>
                  <TaskItem 
                    task={task} 
                    onDelete={handleDeleteClick} 
                    onUpdate={handleUpdateClick} 
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      <TaskFormModal 
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        task={currentTask}
      />
    </div>
  );
};

export default TaskPage;