import React from 'react';

const TaskFilter = ({ filters, onFilterChange }) => {
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">
          <i className="bi bi-funnel me-2"></i>
          Filter Tasks
        </h5>
        <div className="row g-3">
          <div className="col-md-4">
            <label htmlFor="statusFilter" className="form-label">Status</label>
            <select
              className="form-select"
              id="statusFilter"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="To Do">To Do</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="col-md-4">
            <label htmlFor="priorityFilter" className="form-label">Priority</label>
            <select
              className="form-select"
              id="priorityFilter"
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
            >
              <option value="all">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          
          <div className="col-md-4">
            <label htmlFor="sortBy" className="form-label">Sort By</label>
            <select
              className="form-select"
              id="sortBy"
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="input-group">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search tasks..."
              name="searchTerm"
              value={filters.searchTerm}
              onChange={handleFilterChange}
            />
            {filters.searchTerm && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => onFilterChange({ ...filters, searchTerm: '' })}
              >
                <i className="bi bi-x"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilter;