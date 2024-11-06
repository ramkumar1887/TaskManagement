import React, { useState, useEffect } from 'react';
import TaskForm from './taskForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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
      return '#f74c47';
    case 'Medium':
      return '#f5ee5c';
    case 'Low':
      return '#66cc66';
    default:
      return '#f0f0f0';
  }
};

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const [tasks, setTasks] = useState({
    todo: [],
    ongoing: [],
    completed: [],
  });
  const [editingTask, setEditingTask] = useState(null);
  const [formMode, setFormMode] = useState('add');

  // Initialize tasks from localStorage or defaults
  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks({
          todo: parsedTasks.todo || [],
          ongoing: parsedTasks.ongoing || [],
          completed: parsedTasks.completed || [],
        });
      } catch (e) {
        console.error('Failed to parse tasks from localStorage:', e);
      }
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleFormSubmit = (taskData) => {
    const updatedTasks = { ...tasks, todo: [...tasks.todo, taskData] };
    saveTasksToLocalStorage(updatedTasks);
    setShowForm(false);
  };

  const handleAddTask = () => {
    setFormMode('add');
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (index, section) => {
    setFormMode('edit');
    setEditingTask({ section, index });
    setShowForm(true);
  };

  const handleDelete = (index, section) => {
    const updatedTasks = {
      ...tasks,
      [section]: tasks[section].filter((_, i) => i !== index),
    };
    saveTasksToLocalStorage(updatedTasks);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return; // No valid move
    }

    const sourceList = [...tasks[source.droppableId]];
    const destinationList = [...tasks[destination.droppableId]];
    const [movedTask] = sourceList.splice(source.index, 1);

    destinationList.splice(destination.index, 0, movedTask);

    const updatedTasks = {
      ...tasks,
      [source.droppableId]: sourceList,
      [destination.droppableId]: destinationList,
    };

    saveTasksToLocalStorage(updatedTasks);
  };

  const renderTaskList = (section) => (
    <Droppable droppableId={section}>
      {(provided) => (
        <ul
          className="task-items"
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={{ paddingLeft: '0px' }}
        >
          {(tasks[section] || []).map((task, index) => (
            <Draggable
              key={`${section}-${index}`}
              draggableId={`${section}-${index}`}
              index={index}
            >
              {(provided) => (
                <li
                  className="task-item"
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  style={{
                    backgroundColor: getBackgroundColor(task.priority),
                    ...provided.draggableProps.style,
                  }}
                >
                  <div className="task-details">
                    <div><strong>{task.taskName}</strong></div>
                    <div>Priority: {task.priority}</div>
                    <div>Due: {formatDueDate(task.dueDate)}</div>
                  </div>

                  <div className="task-actions">
                    <Tooltip title="Edit">
                      <IconButton color="black" onClick={() => handleEdit(index, section)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton color="black" onClick={() => handleDelete(index, section)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </li>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Tasks</h1>
      <p className="page-description">
        Organize and track tasks efficiently, prioritizing deadlines and progress for seamless task management.
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-container">
          {['todo', 'ongoing', 'completed'].map((section) => (
            <div key={section} className="task-list">
              <div className="list-header">
                <h1>{section.charAt(0).toUpperCase() + section.slice(1)}</h1>
                {section === 'todo' && (
                  <Tooltip title="Add Task">
                    <IconButton onClick={handleAddTask} style={{ color: 'var(--text-color)' }}>
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </div>
              {renderTaskList(section)}
            </div>
          ))}
        </div>
      </DragDropContext>

      {showForm && (
        <TaskForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
          taskData={editingTask ? tasks[editingTask.section][editingTask.index] : {}}
          mode={formMode}
        />
      )}
    </div>
  );
};

export default Tasks;
