import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TextareaAutosize,
  RadioGroup,
  FormControlLabel,
  Radio,
  Badge,
  TableHead,
} from "@mui/material";
import { Card, CardContent, CardMedia } from "@mui/material";
import { Check, Close } from "@mui/icons-material"; // Material-UI icons
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import AttachmentIcon from "@mui/icons-material/Attachment";
import TaskIcon from "@mui/icons-material/Task";
import LinkIcon from "@mui/icons-material/Link";
const TaskForm = ({ open, onClose, onSave, taskData, taskID }) => {
  const tasks = JSON.parse(localStorage.getItem("tasks"));
  const [taskDescription, setTaskDescription] = useState(taskData);
  const [editingDescription, setEditingDescription] = useState(false);
  const [dropdownAnchor, setDropdownAnchor] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [childTasks, setChildTasks] = useState([]);
  const [isChildTask, setIsChildTask] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [taskStatus, setTaskStatus] = useState("Tasks");
  const [isFocused, setIsFocused] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  // Reset task description when dialog is closed
  useEffect(() => {
    if (open) {
      setTaskDescription(taskData); // Clear task description
      if(childTasks.length === 0){
        setIsChildTask(false);
      }
      //setAttachments([]); // Optional: Clear attachments
    }
  }, [open]);
  // Add new items to lists
  const handleAddAttachment = (file) => {
    setAttachments((prev) => [...prev, file]);
  };

  const handleAddChildTask = (task) => {
    setChildTasks((prev) => [...prev, task]);
  };

  // Dropdown menu actions
  const handleAddAction = (action) => {
    setDropdownAnchor(null);
    if (action === "Attachment") {
      document.getElementById("fileInput").click();
    }
    if (action === "Child Task") {
      setIsChildTask(true);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{
        "& .MuiPaper-root": {
          border: "2px solid var(--text-color)", // Add border
          borderRadius: "16px", // Add border radius
        },
      }}
    >
      <DialogTitle
        style={{
          paddingBottom: "8px",
          paddingLeft: "0px",
          paddingRight: "0px",
          paddingTop: "0px",
          borderLeft: "16px solid transparent",
          borderRight: "16px solid transparent",
          borderTop: "8px solid transparent",
          backgroundColor: "var(--background-color)",
          color: "var(--text-color)",
          borderBottom: "2px solid var(--text-color)",
        }}
      >
        Task Details
      </DialogTitle>
      <DialogContent
        style={{
          display: "flex",
          padding: "8px",
          backgroundColor: "var(--background-color)",
        }}
      >
        {/* Left Column */}
        <div className="leftContainer">
          {/* Task Description */}
          {editingDescription ? (
            <TextareaAutosize
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              onBlur={() => setEditingDescription(false)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid gray",
                borderColor: "var(--secondary)",
                fontSize: "14px",
                resize: "none",
                color: "var(--text-color)",
                backgroundColor: "var(--background-color)",
                fontSize: "20px",
              }}
            />
          ) : (
            <div
              onClick={() => setEditingDescription(true)}
              onMouseOver={(e) =>
                (e.target.style.backgroundColor = "var(--primary)")
              }
              onMouseOut={(e) =>
                (e.target.style.backgroundColor = "transparent")
              }
              style={{
                padding: "8px",
                borderRadius: "4px",
                cursor: "pointer",
                color: "var(--text-color)",
                fontSize: "20px",
              }}
            >
              {taskDescription}
            </div>
          )}

          {/* Add Button */}
          <Button
            onClick={(e) => setDropdownAnchor(e.currentTarget)}
            style={{
              paddingRight: "6px",
              paddingLeft: "0px",
              paddingTop: "0px",
              paddingBottom: "0px",
              backgroundColor: "var(--primary)",
              fontSize: "18px",
              color: "var(--text-color)",
              marginLeft: "8px",
              marginTop: "8px",
            }}
          >
            <AddIcon />
            Add
          </Button>
          <Menu
            anchorEl={dropdownAnchor}
            open={Boolean(dropdownAnchor)}
            onClose={() => setDropdownAnchor(null)}
          >
            <MenuItem onClick={() => handleAddAction("Attachment")}>
              <AttachmentIcon /> Attachment
            </MenuItem>
            <MenuItem onClick={() => handleAddAction("Child Task")}>
              <TaskIcon /> Child Task
            </MenuItem>
            <MenuItem onClick={() => handleAddAction("Linked Task")}>
              <LinkIcon /> Linked Task
            </MenuItem>
          </Menu>
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => handleAddAttachment(e.target.files[0])}
          />

          {/* Sections */}
          {attachments.length > 0 && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ color: "var(--text-color)", fontSize: "20px" }}>
                Attachments{" "}
                <Badge
                  badgeContent={attachments.length}
                  style={{ marginLeft: "8px" }}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "var(--primary)", // Custom background color
                      color: "var(--text-color)", // Custom text color
                      fontSize: "12px", // Adjust the font size
                      height: "15px", // Adjust height
                      minWidth: "15px", // Adjust width
                      borderRadius: "10px", // Make it circular
                    },
                  }}
                />
              </h4>
              {attachments.map((file, index) => (
                <Card
                  sx={{
                    width: 200, // Adjust the width as needed
                    margin: 1, // Margin for spacing between cards
                    position: "relative", // Positioning for the delete icon
                    "&:hover .delete-icon": {
                      opacity: 1, // Show delete icon on hover
                    },
                  }}
                >
                  {/* File Preview (Image, Icon, or any media type) */}
                  <CardMedia
                    component="img"
                    height="100" // You can adjust the height based on your needs
                    image={file.previewUrl} // Replace with your image or file URL
                    alt={file.name}
                    sx={{ objectFit: "cover" }} // Adjust this based on how you want the image to appear
                  />

                  <CardContent sx={{ paddingBottom: 2 }}>
                    {/* File Name */}
                    <span>{file.name}</span>
                  </CardContent>

                  {/* Delete Icon */}
                  <IconButton
                    className="delete-icon"
                    //onClick={() => onDelete(index)} // Call the onDelete function on click
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.6)",
                      borderRadius: "50%",
                      padding: 1,
                      opacity: 0, // Initially hidden
                      transition: "opacity 0.3s",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              ))}
            </div>
          )}

          {isChildTask && (
            <div style={{ marginTop: "16px" }}>
              <h4 style={{ color: "var(--text-color)", fontSize: "20px" }}>
                Child Tasks
              </h4>
              {/* Search Box */}
              <TextareaAutosize
                type="text"
                placeholder="Search tasks..."
                value={searchInput}
                //onChange={handleSearchChange}
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "8px",
                  boxSizing: "border-box",
                }}
              />
              {childTasks.map((task, index) => (
                <div key={index}>
                  <span>{task.description}</span>
                  <IconButton
                    onClick={() =>
                      setChildTasks((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    Delete
                  </IconButton>
                </div>
              ))}
            </div>
          )}

          {/* Activity Section */}
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ fontSize: "20px", color: "var(--text-color)" }}>
              Activity
            </h4>
            <div
              style={{
                position: "relative", // Ensure the icons are positioned relative to this container
              }}
              onMouseEnter={() => setIsFocused(true)} // Keep icons visible when hovered
              onMouseLeave={() => setIsFocused(false)} // Hide icons when mouse leaves
            >
              <TextareaAutosize
                minRows={1}
                placeholder="Add Comment"
                style={{
                  width: "100%",
                  marginTop: "8px",
                  padding: "10px",
                  fontSize: "16px",
                  borderColor: "var(--text-color)",
                  color: "var(--text-color)",
                  borderRadius: "4px",
                  borderStyle: "solid",
                  borderWidth: "1px",
                  outline: "none",
                  resize: "vertical",
                  backgroundColor: "transparent", // Optional for a transparent background
                }}
                onFocus={(e) => {
                  setIsFocused(true);
                  e.target.style.borderColor = "var(--secondary)";
                }} // Set focus state
                onBlur={(e) => {
                  setIsFocused(false);
                  e.target.style.borderColor = "var(--text-color)";
                }} // Remove focus state
              />
              {isFocused && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginTop: "4px",
                    position: "absolute",
                    right: "10px", // Adjust as necessary
                    top: "50px", // Adjust based on TextareaAutosize's height
                  }}
                >
                  <Check
                    style={{
                      color: "var(--text-color)", // Adjust as per your palette
                      cursor: "pointer",
                      backgroundColor: "var(--primary)",
                    }}
                    onClick={() => console.log("Check clicked")} // Replace with your logic
                  />
                  {/* <Close
                    style={{
                      color: "var(--text-color)", // Adjust as per your palette
                      cursor: "pointer",
                      backgroundColor: "var(--primary)"
                    }}
                    onClick={() => console.log("Cross clicked")} // Replace with your logic
                  /> */}
                </div>
              )}
            </div>
            {activityLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="rightContainer">
          <div className="custom-select-wrapper">
            <select
              id="taskStatus"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value)}
              style={{
                //width: "100%",
                padding: "8px",
                fontSize: "16px",
                color: "var(--text-color)",
                border: `1px solid var(--text-color)`,
                borderRadius: "4px",
                backgroundColor: "var(--primary)",
                transition: "border-color 0.3s ease",
              }}
              onFocus={(e) => (e.target.style.borderColor = "var(--secondary)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--text-color)")}
            >
              <option value="Tasks">Tasks</option>
              <option value="Completed">Completed</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>
          <div
            style={{
              marginTop: "8px",
              border: "1px solid var(--text-color)",
              borderRadius: "8px",
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    colSpan={2}
                    style={{
                      fontWeight: "bold",
                      fontSize: "16px",
                      backgroundColor: "var(--primary)", // Optional: header background color
                      color: "var(--text-color)", // Optional: header text color
                      //border: "1px solid var(--text-color)", // Border for the header
                      borderTopRightRadius: "8px",
                      borderTopLeftRadius: "8px",
                      borderBottom: "1px solid var(--text-color)",
                    }}
                  >
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* <TableRow>
                  <TableCell style={{color: "var(--text-color)"}}>Assignee</TableCell>
                  <TableCell style={{color: "var(--text-color)"}}>{taskData?.assignee || "Unassigned"}</TableCell>
                </TableRow> */}
                <TableRow>
                  <TableCell
                    style={{
                      color: "var(--text-color)",
                      borderBottom: "1px solid var(--text-color)",
                    }}
                  >
                    Parent Task
                  </TableCell>
                  <TableCell
                    style={{
                      color: "var(--text-color)",
                      borderBottom: "1px solid var(--text-color)",
                    }}
                  >
                    {taskData?.parent || "None"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell style={{ color: "var(--text-color)" }}>
                    Due Date
                  </TableCell>
                  <TableCell style={{ color: "var(--text-color)" }}>
                    {taskData?.dueDate || "None"}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ borderBottom: "None", color: "var(--text-color)" }}
                  >
                    Team
                  </TableCell>
                  <TableCell
                    style={{ borderBottom: "None", color: "var(--text-color)" }}
                  >
                    {taskData?.reporter || "Unknown"}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>

      {/* Footer */}
      <DialogActions
        style={{
          backgroundColor: "var(--background-color)",
          border: "None",
          paddingBottom: "8px",
          paddingTop: "6px",
          paddingRight: "0px",
          paddingLeft: "0px",
          borderTop: "2px solid var(--text-color)",
          borderRight: "16px solid transparent",
          borderLeft: "16px solid transparent",
        }}
      >
        <Button onClick={onClose} style={{ color: "var(--text-color)" }}>
          Cancel
        </Button>
        <Button
          style={{
            backgroundColor: "var(--secondary)",
            color: "var(--opText)",
          }}
          onClick={() => onSave({ taskDescription, attachments })}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default TaskForm;