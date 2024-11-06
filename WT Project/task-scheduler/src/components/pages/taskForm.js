import React, { useState, useEffect } from 'react';
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

const TaskForm = ({ open, onClose, onSubmit, taskData, mode }) => {
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('');
  const [dueDate, setDueDate] = useState('');

  // Populate the form fields when taskData changes
  useEffect(() => {
    if (taskData) {
      setTaskName(taskData.taskName || '');
      setPriority(taskData.priority || '');
      setDueDate(taskData.dueDate || '');
    }
  }, [taskData]);

  const handleSubmit = () => {
    onSubmit({ taskName, priority, dueDate });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === 'edit' ? 'Edit Task' : 'Add Task'}</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
        {mode === 'edit' ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskForm;
