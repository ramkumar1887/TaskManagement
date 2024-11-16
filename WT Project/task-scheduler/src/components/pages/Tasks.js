import React, { useState, useEffect, useRef } from "react";
import TaskForm from "./taskForm";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  IconButton,
  Tooltip,
  List,
  ListItem,
  TextField,
  Button,
  Box,
  TextareaAutosize,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { fetchUserTasks  } from "./taskService";
const Tasks = ({ setCurrentPage }) => {
  const [newTask, setNewTask] = useState(""); // Input for new task in "todo"
  const liRef = useRef(null);
  const liRef1 = useRef(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false); // State for TaskForm visibility
  const [isEditing, setIsEditing] = useState(false);
  const [isEditing1, setIsEditing1] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null); // Track task being edited
  const [tasks, setTasks] = useState({
    todo: [],
    ongoing: [],
    completed: [],
  });
  const [editedDescription, setEditedDescription] = useState(""); // New state for the edited text
  useEffect(() => {
    // Fetch tasks on component mount
    const initializeTasks = async () => {
      const userTasks = await fetchUserTasks();
      if (userTasks) {
        setTasks({
          todo: userTasks.todo || [],
          ongoing: userTasks.ongoing || [],
          completed: userTasks.completed || [],
        });
      }
    };

    initializeTasks();
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (liRef1.current && !liRef1.current.contains(event.target)) {
        setEditingTaskId(null); // Close edit mode if clicked outside
        setEditedDescription(!editedDescription);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Initialize tasks from localStorage or defaults
  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        setTasks({
          todo: parsedTasks.todo || [],
          ongoing: parsedTasks.ongoing || [],
          completed: parsedTasks.completed || [],
        });
      } catch (e) {
        console.error("Failed to parse tasks from localStorage:", e);
      }
    }
  }, []);

  const saveTasksToLocalStorage = (updatedTasks) => {
    setTasks(updatedTasks);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));

    // Get the user from localStorage
    const user = localStorage.getItem("user");
    const allTasks = updatedTasks.todo.map((task) => task.id)
    .concat(updatedTasks.ongoing.map((task) => task.id))
    .concat(updatedTasks.completed.map((task) => task.id));
    // Check if user exists and providerData is available
    if (
      user &&
      JSON.parse(user).providerData &&
      JSON.parse(user).providerData[0]
    ) {
      const uid = JSON.parse(user).providerData[0].uid;

      fetch("http://localhost:5000/taskList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: uid,
          taskIds: allTasks
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // Handle the case when user data or providerData is missing
      console.error("User or provider data is missing from localStorage");
    }

  };
  const handleDelete = (index, section) => {
    mongoDBtask(tasks[section][index].id, null, null);
    const updatedTasks = {
      ...tasks,
      [section]: tasks[section].filter((_, i) => i !== index),
    };
    saveTasksToLocalStorage(updatedTasks);
  };

  // Add new task and update local storage
  const addNewTask = () => {
    const date = Date.now().toString()
    const updatedTasks = {
      ...tasks,
      todo: [
        ...tasks.todo,
        { id: date, description: newTask },
      ],
    };
    setTasks(updatedTasks);
    setNewTask("");
    setIsEditing(false);
    saveTasksToLocalStorage(updatedTasks);
    mongoDBtask(date, newTask, "todo");
  };
  const mongoDBtask = (id, description, status) => {
    fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        description: description,
        status: status
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  // Close input if user clicks outside the input area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (liRef.current && !liRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Task Edit Functionality
  const handleEditTask = (index, section) => {
    setIsEditing1(true);
  };
  const handleSaveEdit = (index, section) => {
    //console.log("Save Called");
    handleUpdateTask(index, section, editedDescription); // Call a function to save changes
    setEditingTaskId(null); // Disable edit mode
  };
  const handleUpdateTask = (index, section, updatedDescription) => {
    const updatedTasks = {
      ...tasks,
      [section]: tasks[section].map((task, i) =>
        i === index ? { ...task, description: updatedDescription } : task
      ),
    };
    saveTasksToLocalStorage(updatedTasks);
    mongoDBtask(tasks[section][index].id, updatedDescription, section);
    setEditingTaskId(null); // Exit edit mode
    setEditedDescription(null);
  };

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, exit
    if (!destination) return;

    // If the task is dropped in the same position, do nothing
    if (destination.droppableId === source.droppableId) {
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
    //console.log(`after tasks: ${JSON.stringify(tasks)}`);
    //console.log(`updatedtasks: ${JSON.stringify(updatedTasks)}`);
    // Save updated tasks to localStorage
    saveTasksToLocalStorage(updatedTasks);
    console.log(draggableId);
    mongoDBtask(draggableId, null, destinationSection);
  };
  const onWrong = () => {
    setEditingTaskId(null);
    setEditedDescription(null);
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
              sx={{
                position: "relative",
                width: "100%",
                marginY: 0.5,
                padding: 0,
              }}
            >
              <Box
                ref={editingTaskId === task.id ? liRef1 : null}
                className="task-card"
                onClick={() => {
                  setIsTaskFormOpen(true);
                  console.log("Task Form Called");
                }}
                sx={{
                  //padding: 1,
                  width: "100%",
                  backgroundColor: "var(--background-color)",
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  "&:hover .edit-icon": {
                    opacity: 1, // Make icon visible on hover
                  },
                  cursor: "pointer",
                }}
              >
                {editingTaskId === task.id ? (
                  <>
                    <TextareaAutosize
                      value={
                        editingTaskId === task.id
                          ? editedDescription
                          : task.description
                      } // Display correct value
                      onChange={(e) => {
                        setEditedDescription(e.target.value);
                        e.stopPropagation();
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      style={{
                        width: "100%",
                        padding: "8px",
                        borderRadius: "4px",
                        borderColor: "var(--secondary)",
                        fontSize: "14px",
                        resize: "none",
                        color: "var(--text-color)",
                        backgroundColor: "var(--background-color)",
                      }}
                    />
                    <IconButton
                      onClick={(e) => {
                        handleSaveEdit(index, section);
                        e.stopPropagation();
                      }}
                      disabled={!editedDescription} // Disable based on conditions
                      sx={{ color: "var(--text-color)", fontSize: "18px" }}
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => {
                        onWrong();
                        e.stopPropagation();
                      }}
                      sx={{ color: "var(--text-color)", fontSize: "18px" }}
                    >
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  <>
                    <List sx={{ flex: 1, padding: 0 }}>
                      <ListItem sx={{ padding: "8px", paddingBottom: "2px" }}>
                        <span style={{ color: "var(--text-color)" }}>
                          {task.description}
                        </span>
                        <span></span>
                        <EditIcon
                          className="edit-icon"
                          sx={{
                            color: "var(--text-color)",
                            opacity: 0, // Icon is hidden initially
                            transition: "opacity 0.2s",
                            cursor: "pointer",
                            fontSize: "18px",
                          }}
                          onClick={(e) => {
                            setEditingTaskId(task.id);
                            setEditedDescription(task.description); // Initialize with task description
                            e.stopPropagation();
                          }}
                        />
                        <DeleteIcon
                          className="delete-icon"
                          sx={{
                            color: "var(--text-color)",
                            marginLeft: "auto",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            handleDelete(index, section);
                            e.stopPropagation();
                          }}
                        />
                      </ListItem>
                      <ListItem sx={{ padding: "8px", paddingTop: "2px" }}>
                        <PersonIcon
                          sx={{
                            color: "var(--text-color)",
                            marginLeft: "auto",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        />
                      </ListItem>
                    </List>
                  </>
                )}
              </Box>
            </ListItem>
          )}
        </Draggable>
      ))}
      {section === "todo" && (
        <ListItem
          ref={liRef}
          sx={{
            position: "relative",
            width: "100%",
            // marginTop: 1,
            padding: isEditing ? 1 : 0,
            border: isEditing ? "2px solid var(--secondary)" : "none", // Border only when editing
            display: "flex",
            flexDirection: "column",
            borderRadius: "4px", // Optional: rounded corners for the border
            overflow: "hidden", // Ensures nothing spills outside the border
          }}
        >
          {isEditing ? (
            <>
              {/* TextField without border and padding */}
              <TextareaAutosize
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                autoFocus
                placeholder="Add a new task..."
                minRows={1} // Minimum height of one row, adjust as needed
                style={{
                  width: "100%", // Full width
                  padding: 0, // Remove padding around the input field
                  border: "none", // No border
                  resize: "none", // Disable resizing
                  fontSize: "16px", // Set font size here
                  color: "var(--text-color)",
                  caretColor: "var(--text-color)",
                  outline: "none", // No outline on focus
                  background: "none", // Optional: make background transparent
                }}
                placeholderStyle={{
                  color: "var(--text-color)", // Set placeholder color
                  opacity: 1, // Ensures the color is fully opaque
                }}
                // // Use a CSS-in-JS approach for placeholder color
                // sx={{
                //   '::placeholder': {
                //     color: 'var(--text-color)', // Dynamically change placeholder color
                //     opacity: 1,
                //   },
                // }}
              />

              {/* Create button aligned to the right at the bottom */}
              <Button
                variant="contained"
                color="primary"
                onClick={addNewTask}
                sx={{
                  alignSelf: "flex-end", // Align the button to the right
                  marginTop: "auto",
                  backgroundColor: "var(--secondary)", // Ensure the button has secondary color
                  color: "var(--text-color)",
                }}
              >
                Create
              </Button>
            </>
          ) : (
            <Button
              variant="text" // No border for the buttonf
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                padding: "6px 0px",
                color: "var(--text-color)",
                "&:hover": {
                  backgroundColor: "var(--background-color)", // No background on hover
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
                style={{ marginRight: "8px" }}
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
        Organize and track tasks efficiently, prioritizing deadlines and
        progress for seamless task management.
      </p>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="task-container">
          {["todo", "ongoing", "completed"].map((section) => (
            <Droppable key={section} droppableId={section}>
              {(provided) => (
                <div
                  className="task-list"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {/* {console.log(`Droppable ID: ${provided.droppableId}`)} */}
                  <div className="list-header">
                    <h1>
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </h1>
                  </div>
                  {renderTaskList(section, provided)}
                  {provided.placeholder} {/* Ensure placeholder is added */}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      {/* TaskForm Dialog */}
      <TaskForm
        open={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        //onSave={handleAddTask}   // Pass function to add task
      />
    </div>
  );
};

export default Tasks;
