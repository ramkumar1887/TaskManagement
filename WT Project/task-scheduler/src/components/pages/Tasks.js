import React, { useState, useEffect } from 'react';
import TaskForm from './taskForm';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

// Helper function to format the due date
const formatDueDate = (dueDate) => {
  const today = new Date();
  const targetDate = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  return `In ${diffDays} days`;
};

const getBackgroundColor = (priority) => {
  switch (priority) {
    case 'High':
      return '#f74c47'; // Red
    case 'Medium':
      return '#f5ee5c'; // Yellow
    case 'Low':
      return '#66cc66'; // Green
    default:
      return '#f0f0f0'; // Default gray
  }
};

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks)); // Parse tasks safely
      } catch (e) {
        console.error('Failed to parse tasks from localStorage:', e);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  const saveTasksToLocalStorage = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleFormSubmit = (taskData) => {
    if (editingTask !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editingTask ? taskData : task
      );
      saveTasksToLocalStorage(updatedTasks); // Update tasks
      setEditingTask(null); // Exit editing mode
    } else {
      const updatedTasks = [...tasks, taskData];
      saveTasksToLocalStorage(updatedTasks); // Add new task
    }
    setShowForm(false); // Close the form
  };

  const handleEdit = (index) => {
    setEditingTask(index); // Set task for editing
    setShowForm(true); // Open form with existing data
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    saveTasksToLocalStorage(updatedTasks); // Update tasks
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Tasks</h1>
      <p className="page-description">
        Organize and track tasks efficiently, prioritizing deadlines and progress for seamless task management.
      </p>

      <div className="task-container">
        <div className="task-list">
          <div className="list-header">
            <h1>To-Do</h1>
            <Tooltip title="Add Task">
              <IconButton color="primary" onClick={() => setShowForm(true)}>
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>

          {tasks.length === 0 ? (
            <p>No tasks added yet.</p>
          ) : (
            <ul className="task-items"
            style={{paddingLeft:'10px'}}
            >
              {tasks.map((task, index) => (
                <li 
                key={index} 
                className="task-item"
                style={{ backgroundColor: getBackgroundColor(task.priority), padding: '10px' }}
              
                >
                  <div className='task-details'>
                    <div>
                      <strong>{task.taskName}</strong>
                    </div>
                    <div>Priority: {task.priority}</div>
                    <div>Due: {formatDueDate(task.dueDate)}</div>
                  </div>

                  <div className="task-actions">
                    <Tooltip title="Edit">
                      <IconButton
                        color="black"
                        onClick={() => handleEdit(index)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        color="black"
                        onClick={() => handleDelete(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
          
        
        <div className='task-list'>
          <div className='list-header'>
            <h1>Ongoing</h1>
          </div>
        </div>

        <div className='task-list'>
          <div className='list-header'>
            <h1>Completed</h1>
          </div>
        </div>

        {showForm && (
  <TaskForm
    open={showForm}
    onClose={() => {
      setShowForm(false);
      setEditingTask(null); // Reset editing mode when form is closed
    }}
    onSubmit={handleFormSubmit}
    taskData={editingTask !== null ? tasks[editingTask] : {}} // Pre-fill form with data
  />
)}
      </div>
    </div>
  );
};

export default Tasks;
