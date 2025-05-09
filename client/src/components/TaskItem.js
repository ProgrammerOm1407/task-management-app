import React from 'react';

const TaskItem = ({ task, onDelete, onUpdate, disabled }) => {
  // Function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'to do':
        return 'bg-info';
      case 'in progress':
        return 'bg-warning text-dark';
      case 'completed':
        return 'bg-success';
      default:
        return 'bg-secondary';
    }
  };

  // Function to get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch(priority.toLowerCase()) {
      case 'low':
        return 'bg-light text-dark';
      case 'medium':
        return 'bg-warning text-dark';
      case 'high':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  };

  // Function to check if task is overdue
  const isOverdue = () => {
    if (!task.dueDate) return false;
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    return dueDate < today && task.status.toLowerCase() !== 'completed';
  };

  // Function to handle delete with confirmation
  const handleDelete = () => {
    // Create a custom confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${task.title}"? This action cannot be undone.`)) {
      onDelete(task._id);
    }
  };

  return (
    <div className={`card mb-3 shadow-sm ${task.status === 'Completed' ? 'border-success' : ''}`}>
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title text-primary mb-0">{task.title}</h5>
          <div>
            <span className={`badge ${getStatusBadgeClass(task.status)} me-1`}>
              {task.status === 'To Do' ? 
                <i className="bi bi-circle me-1"></i> : 
                task.status === 'In Progress' ? 
                <i className="bi bi-hourglass-split me-1"></i> : 
                <i className="bi bi-check-circle me-1"></i>
              }
              {task.status}
            </span>
            <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
              {task.priority === 'High' ? 
                <i className="bi bi-exclamation-triangle-fill me-1"></i> : 
                <i className="bi bi-flag me-1"></i>
              }
              {task.priority}
            </span>
          </div>
        </div>
        
        <p className="card-text text-muted mb-3">
          {!task.description ? (
            <em className="text-muted">No description provided</em>
          ) : (
            task.description.length > 150 ? 
              `${task.description.substring(0, 150)}...` : 
              task.description
          )}
        </p>
        
        {task.dueDate && (
          <div className="mb-3">
            <span className={`badge ${isOverdue() ? 'bg-danger' : 'bg-light text-dark'}`}>
              <i className="bi bi-calendar-event me-1"></i>
              Due: {new Date(task.dueDate).toLocaleDateString()}
              {isOverdue() && <span className="ms-1">(Overdue)</span>}
            </span>
          </div>
        )}
        
        <div className="d-flex justify-content-end mt-2">
          <button 
            className="btn btn-sm btn-outline-primary me-2" 
            onClick={() => onUpdate(task)}
            disabled={disabled}
          >
            <i className="bi bi-pencil-square me-1"></i>
            Edit
          </button>
          <button 
            className="btn btn-sm btn-outline-danger" 
            onClick={handleDelete}
            disabled={disabled}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;