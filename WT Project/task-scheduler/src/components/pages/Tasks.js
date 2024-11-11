import React, { useState, useEffect, useRef } from 'react';
import TaskForm from './taskForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { IconButton, Tooltip, List, ListItem, TextField, Button, Box, TextareaAutosize } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
const Tasks = ({ setCurrentPage }) => {
  const [newTask, setNewTask] = useState('');  // Input for new task in "todo"
  const liRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing1, setIsEditing1] = useState(false);
  const [tasks, setTasks] = useState({
    todo: [],
    ongoing: [],
    completed: [],
  });
  const [editingTask, setEditingTask] = useState(null);
  const [formMode, setFormMode] = useState('add');
  const [editedDescription, setEditedDescription] = useState(''); // New state for the edited text

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
  const handleDelete = (index, section) => {
    const updatedTasks = {
      ...tasks,
      [section]: tasks[section].filter((_, i) => i !== index),
    };
    saveTasksToLocalStorage(updatedTasks);
  };
  // Close the input if clicked outside the `li` element
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (liRef.current && !liRef.current.contains(event.target)) {
        setIsEditing(false); // Collapse back to "Add Task" button
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Add new task and update local storage
  const addNewTask = () => {
    const updatedTasks = {
      ...tasks,
      todo: [...tasks.todo, { id: Date.now().toString(), description: newTask }],
    };
    setTasks(updatedTasks);
    setNewTask('');
    setIsEditing(false);
    updateLocalStorage(updatedTasks);
  };


  const updateLocalStorage = (updatedTasks) => {
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  // Close input if user clicks outside the input area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (liRef.current && !liRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // Task Edit Functionality
  const handleEditTask = (index, section) => {
    setIsEditing1(true);
  };
  const handleSaveEdit = (index, section) => {
    handleUpdateTask(index, section, editedDescription); // Call a function to save changes
    setIsEditing(false);  // Disable edit mode
  };
  const handleUpdateTask = (index, section, updatedDescription) => {
    // console.error(`${index}, ${section}`)
    // if (!tasks[section] || !Array.isArray(tasks[section])) {
    //   console.error(`Section "${section}" is undefined or not an array.`);
    //   return;
    // }

    const updatedTasks = {
      ...tasks,
      [section]: tasks[section].map((task, i) =>
        i === index ? { ...task, description: updatedDescription } : task
      ),
    };
    saveTasksToLocalStorage(updatedTasks);
    setIsEditing1(false);  // Exit edit mode
    setEditedDescription(!editedDescription);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
  
    // If there's no destination, exit
    if (!destination) return;
  
    // If the task is dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId
    ) {
      return;
    }
  
    const sourceSection = source.droppableId;
    const destinationSection = destination.droppableId;
  
    // Clone tasks array to avoid mutating state directly
    const sourceTasks = Array.from(tasks[sourceSection]);
    const destinationTasks = Array.from(tasks[destinationSection]);
    // Remove the task from the source and add it to the destination
    const [removedTask] = sourceTasks.splice(source.index, 1);
    destinationTasks.splice(destination.index, 0, removedTask);
    // Update state immutably
    const updatedTasks = {
      ...tasks,
      [sourceSection]: sourceTasks,
      [destinationSection]: destinationTasks,
    };
    console.log(`after tasks: ${JSON.stringify(tasks)}`);
    console.log(`updatedtasks: ${JSON.stringify(updatedTasks)}`);
    // Save updated tasks to localStorage
    saveTasksToLocalStorage(updatedTasks);
  };
  

  // Render Task List
  const renderTaskList = (section, provided) => (
    <List
      sx={{ padding: 0.5 }}
      ref={provided.innerRef}
      {...provided.droppableProps}
    >
      {tasks[section].map((task, index) => (
        <Draggable key={task.id} draggableId={task.id} index={index}>
          {(provided) => (
            <ListItem
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              key={task.id}
              sx={{ position: 'relative', width: '100%', marginY: 0.5, padding: 0 }}
            >
              <Box
                className="task-card"
                sx={{
                  //padding: 1, 
                  width: '100%',
                  backgroundColor: 'var(--background-color)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  '&:hover .edit-icon': {
                    opacity: 1, // Make icon visible on hover
                  },
                  cursor: 'pointer',
                }}
              >
                {isEditing1 ? (
                  <>
                    <TextareaAutosize
                      value={editedDescription ? editedDescription : task.description}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '4px',
                        borderColor: 'var(--secondary)',
                        fontSize: '14px',
                        resize: 'none',
                        color: 'var(--text-color)',
                        backgroundColor: 'var(--background-color)',
                      }}
                    />
                    <IconButton
                      onClick={() => handleSaveEdit(index, section)}
                      disabled={!editedDescription} // Disable based on conditions
                      sx={{ color: 'var(--text-color)', fontSize: '18px', }}>
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={() => setIsEditing1(false)} sx={{ color: 'var(--text-color)', fontSize: '18px' }}>
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <List sx={{ flex: 1, padding: 0 }}>
                      <ListItem sx={{ padding: '8px', paddingBottom: '2px' }}>
                        <span style={{ color: 'var(--text-color)' }}>{task.description}</span>
                        <EditIcon
                          className="edit-icon"
                          sx={{
                            color: 'var(--text-color)',
                            opacity: 0, // Icon is hidden initially
                            transition: 'opacity 0.2s',
                            cursor: 'pointer',
                            //marginLeft: 1, 
                            fontSize: '18px',
                          }}
                          onClick={() => handleEditTask(index, section)}
                        />
                        <DeleteIcon
                          className='delete-icon'
                          sx={{
                            color: 'var(--text-color)',
                            marginLeft: 'auto',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleDelete(index, section)}
                        />
                      </ListItem>
                      <ListItem sx={{ padding: '8px', paddingTop: '2px' }}>
                        <PersonIcon sx={{ color: 'var(--text-color)', marginLeft: 'auto' }} />
                      </ListItem>
                    </List>
                  </>
                )}
              </Box>
            </ListItem>
          )}
        </Draggable>
      ))}
      {section === 'todo' && (
        <ListItem
          ref={liRef}
          sx={{
            position: 'relative',
            width: '100%',
            // marginTop: 1, 
            padding: isEditing ? 1 : 0,
            border: isEditing ? '2px solid var(--secondary)' : 'none', // Border only when editing
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '4px', // Optional: rounded corners for the border
            overflow: 'hidden' // Ensures nothing spills outside the border
          }}
        >
          {isEditing ? (
            <>
              {/* TextField without border and padding */}
              <TextField
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                autoFocus
                placeholder="Add a new task..."
                variant="standard" // Use "standard" to avoid underlining
                size="small"
                fullWidth
                sx={{
                  padding: 0, // Remove padding around the input field
                  '& .MuiInputBase-root': {
                    padding: 0, // Remove padding inside the input field
                    border: 'none', // No border around input
                  },
                  '& .MuiInput-underline:before': {
                    borderBottom: 'none', // Remove the underline before focus
                  },
                  '& .MuiInput-underline:after': {
                    borderBottom: 'none', // Remove the underline after focus
                  },
                  '&:hover .MuiInput-underline:before': {
                    borderBottom: 'none', // Prevent underline on hover
                  },
                  '&:hover .MuiInput-underline:after': {
                    borderBottom: 'none', // Prevent underline on hover
                  },
                }}
                inputProps={{
                  sx: {
                    color: 'var(--text-color)',
                    '::placeholder': {
                      color: 'var(--text-color)', // Set placeholder color to white
                      opacity: 1, // Ensures the color is fully opaque
                    },
                    caretColor: 'var(--text-color)',
                  },
                }}
              />
              {/* Create button aligned to the right at the bottom */}
              <Button
                variant="contained"
                color="primary"
                onClick={addNewTask}
                sx={{
                  alignSelf: 'flex-end', // Align the button to the right
                  marginTop: 'auto',
                  backgroundColor: 'var(--secondary)', // Ensure the button has secondary color
                  color: 'var(--text-color)'
                }}
              >
                Create
              </Button>
            </>
          ) : (
            <Button
              variant="text" // No border for the button
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: '6px 0px',
                color: 'var(--text-color)',
                '&:hover': {
                  backgroundColor: 'var(--background-color)', // No background on hover
                },
              }}
            >
              {/* Plus icon SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-plus"
                viewBox="0 0 16 16"
                style={{ marginRight: '8px' }}
              >
                <path d="M8 7V1h1v6h6v1H9v6H8V8H2V7h6z" />
              </svg>
              Create Task
            </Button>
          )}
        </ListItem>

      )}
    </List>
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
            <Droppable key={section} droppableId={section}>
              {(provided) => (
                <div
                  className="task-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* {console.log(`Droppable ID: ${provided.droppableId}`)} */}
                  <div className="list-header">
                    <h1>{section.charAt(0).toUpperCase() + section.slice(1)}</h1>
                  </div>
                  {renderTaskList(section, provided)}
                  {provided.placeholder}  {/* Ensure placeholder is added */}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Tasks;
