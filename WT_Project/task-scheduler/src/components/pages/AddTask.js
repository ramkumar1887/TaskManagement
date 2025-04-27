import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Modal,
  Backdrop,
  Fade,
} from "@mui/material";

const AddTask = () => {
  const [open, setOpen] = useState(true);
  const [taskType, setTaskType] = useState(null);

  // Handler for selecting the task type
  const handleTaskTypeSelect = (type) => {
    setTaskType(type);
    setOpen(false); // Close modal only after a selection is made
  };

  // Component for the modal to select task type
  const TaskTypeModal = (
    <Modal
      open={open}
      closeAfterTransition
      BackdropComponent={Backdrop}
      // Prevent modal from closing on backdrop click
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          setOpen(false);
        }
      }}
      BackdropProps={{
        timeout: 500,
        style: { backdropFilter: "blur(5px)" }, // Blurred background effect
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography variant="h6">Select Task Type</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleTaskTypeSelect("Personal")}
          >
            Personal
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleTaskTypeSelect("Professional")}
          >
            Professional
          </Button>
        </Box>
      </Fade>
    </Modal>
  );

  return (
    <div className="page-container">
      <h1 className="page-title">Add Task</h1>
      {TaskTypeModal}
      {taskType && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">
            {taskType === "Personal" ? "Personal Task" : "Professional Task"}
          </Typography>
          {/* Your task form can go here */}
        </Box>
      )}
    </div>
  );
};

export default AddTask;
