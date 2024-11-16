// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String },
  status: {type: String},
});

module.exports = mongoose.model('Task', taskSchema);
