import React from 'react';

const TaskItem = ({ task, onDelete, onUpdate }) => {
  return (
    <div className="task-item">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <div className="task-details">
        <span className={`status status-${task.status.toLowerCase().replace(' ', '-')}`}>
          {task.status}
        </span>
        <span className={`priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="due-date">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div className="task-actions">
        <button onClick={() => onUpdate(task)}>Edit</button>
        <button onClick={() => onDelete(task._id)}>Delete</button>
      </div>
    </div>
  );
};

export default TaskItem;