import React, { useState } from 'react';
import TaskForm from './taskForm';
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const Tasks = () => {
  const [showForm, setShowForm] = useState(false); // Manage form visibility
  const [taskData, setTaskData] = useState({ name: '', priority: '', dueDate: '' }); // Store form input
  // const [showForm, setShowForm] = useState(false); // Manage dialog visibility

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Task Data:', taskData); // Handle task submission logic
  const handleFormSubmit = (taskData) => {
    console.log('New Task:', taskData); // Handle submitted task data
    setShowForm(false); // Close the form after submission
  };
  return (
    <div className='page-container'>
      <h1 className='page-title'>Tasks</h1>
      <p className='page-description'>
        Organize and track tasks efficiently, prioritizing deadlines and progress for seamless task management.
      </p>

      <div className='task-container'>
        <div className='task-list'>
          <div className='list-header'>
            <h1>To-Do</h1>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='plus-icon'
              onClick={() => setShowForm(true)}
              style={{ cursor: 'pointer' }}
            >
              <path
                fillRule='evenodd'
                d='M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z'
                clipRule='evenodd'
              />
            </svg>
            <Tooltip title="Add Task">
              <IconButton
                color="primary"
                onClick={() => setShowForm(true)}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
          </div>
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
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          taskData={taskData}
          handleInputChange={handleInputChange}
        />
      )}
      <TaskForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
};
}

export default Tasks;
