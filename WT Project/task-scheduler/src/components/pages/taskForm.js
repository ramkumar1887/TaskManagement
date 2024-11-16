import React, { useState } from 'react';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const TaskForm = ({ open, onClose, onSave }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Reset form fields when the dialog closes
  const handleClose = () => {
    setTaskName('');
    setPriority('');
    setDueDate('');
    onClose();
  };

  // Handle form submission
  const handleSave = () => {
    const newTask = {
      taskName,
      priority,
      dueDate,
    };
    onSave?.(newTask); // Call onSave if provided
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{'Add Task'}</DialogTitle>
      <DialogContent>
        <TextField
          label="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          fullWidth
          margin="normal"
        />

        <div style={{ margin: '16px 0' }}>
          <p>Priority:</p>
          <RadioGroup
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            row
          >
            <FormControlLabel value="High" control={<Radio />} label="High" />
            <FormControlLabel value="Medium" control={<Radio />} label="Medium" />
            <FormControlLabel value="Low" control={<Radio />} label="Low" />
          </RadioGroup>
        </div>

        <TextField
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="primary" onClick={handleSave}>
          {'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
