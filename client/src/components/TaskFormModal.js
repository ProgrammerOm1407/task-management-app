import React, { useState, useEffect } from 'react';

const TaskFormModal = ({ show, onClose, onSave, task, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Medium',
    dueDate: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? task.dueDate.substring(0, 10) : ''
      });
    } else {
      // Reset form when adding a new task
      setFormData({
        title: '',
        description: '',
        status: 'To Do',
        priority: 'Medium',
        dueDate: ''
      });
    }
    // Clear any form errors when the modal is opened/closed
    setFormErrors({});
  }, [task, show]);

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal show d-block" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {task ? 'Edit Task' : 'Add New Task'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
                disabled={isSubmitting}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title <span className="text-danger">*</span></label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.title ? 'is-invalid' : ''}`}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter task title"
                    disabled={isSubmitting}
                    required
                  />
                  {formErrors.title && (
                    <div className="invalid-feedback">{formErrors.title}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter task description (optional)"
                    disabled={isSubmitting}
                  ></textarea>
                  {formErrors.description && (
                    <div className="invalid-feedback">{formErrors.description}</div>
                  )}
                </div>
                
                <div className="row mb-3">
                  <div className="col">
                    <label htmlFor="status" className="form-label">Status</label>
                    <select
                      className="form-select"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  
                  <div className="col">
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select
                      className="form-select"
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dueDate"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <small className="form-text text-muted">Optional: Set a deadline for this task</small>
                </div>
                
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {task ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      task ? 'Update Task' : 'Add Task'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;