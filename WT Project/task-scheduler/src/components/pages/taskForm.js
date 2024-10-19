import React, { useState } from 'react';
import {
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

const TaskForm = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({ taskName: '', priority: '', dueDate: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass data to parent component
    onClose(); // Close the dialog
  };

const TaskForm = () => {
  return (
    <div className='form-overlay'>
        <div className='task-form'>
            <div className='task-form-header'>
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{fontFamily:'Oxanium', fontWeight:'bold'}}
      >Add New Task</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Task Name"
            name="taskName"
            value={formData.taskName}
            onChange={handleChange}
            required
            sx={{fontFamily:'Oxanium'}}
          />

                <h1>Add Task</h1>
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend" sx={{fontFamily:'Oxanium'}}
            >Priority</FormLabel>
            <RadioGroup
              row
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <FormControlLabel value="high" control={<Radio />} sx={{fontFamily:'Oxanium'}} label="High" />
              <FormControlLabel value="medium" control={<Radio />} sx={{fontFamily:'Oxanium'}} label="Medium" />
              <FormControlLabel value="low" control={<Radio />} sx={{fontFamily:'Oxanium'}} label="Low" />
            </RadioGroup>
          </FormControl>

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="cross-icon">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
          <TextField
            margin="normal"
            fullWidth
            label="Due Date"
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            required
          />


          <DialogActions>
            <Button onClick={onClose} className='task-form-button'
            sx={{backgroundColor:'#a6c2fe', color:'black', fontFamily:'Oxanium'}}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" className='task-form-button'
             sx={{backgroundColor:'#a6c2fe', color:'black', fontFamily:'Oxanium'}}>
              Add Task
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>

    
        </div>
        </div>
    </div>
  )
}
};

export default TaskForm;
