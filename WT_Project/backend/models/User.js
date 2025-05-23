const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  taskIds: { type: [String], default: [] },
  teams: {type: [String], default: []},
  people: {type: [String], default: []}
});

module.exports = mongoose.model("User", userSchema);