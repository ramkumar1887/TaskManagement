// server.js
require("dotenv").config(); // Ensure dotenv is imported at the top
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // To parse JSON bodies
const cors = require("cors");
app.use(cors());
// Use the URI from the .env file
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Atlas connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Import models and define API endpoints here
const User = require("./models/User");
const Task = require("./models/Task");
const Teams = require("./models/Teams");
// Define routes to interact with MongoDB
app.get("/users", async (req, res) => {
  const users = await User.find({});
  res.json(users);
});
app.get("/uTeams", async (req, res) => {
  try {
    const { username } = req.query;
    let user = await User.findOne({ username });
    if (user) {
      let TeamsList = user.teams;
      // Fetch all team details using Mongoose
      const teamsDetails = await Teams.find({ id: { $in: TeamsList } });
      // Send the team details as a response
      res.status(200).json(teamsDetails);
    }
  } catch (err) {
    //console.error("Error fetching team details:", err);
    res.status(500).json({ error: err });
  }
});
// Example API route (adjust according to your backend setup)
app.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    
    // Replace this with your actual database query
    const users = await db.collection('users')
      .where('email', '>=', email)
      .where('email', '<=', email + '\uf8ff')
      .limit(5)
      .get();
    
    const results = users.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
});
app.get("/utasks", async (req, res) => {
  try {
    const { username } = req.query;
    //console.log(req.body);
    //console.log(`Requesed uid: ${username}`)
    let user = await User.findOne({ username });
    //console.log(`User: ${user}`);
    if (user) {
      let Tasklist = user.taskIds;
      // Initialize the Tasks object
      const Tasks = {
        todo: [],
        ongoing: [],
        completed: [],
      };
      for (const id of Tasklist) {
        let task = await Task.findOne({ id });
        console.log(task);
        console.log(`id: ${id}, status: ${task.status}`);
        // Categorize task based on its status
        if (task.status === "todo") {
          console.log(`${id} pushed to todo`);
          Tasks.todo.push({ id: task.id, description: task.description });
        } else if (task.status === "ongoing") {
          console.log(`${id} pushed to ongoing`);
          Tasks.ongoing.push({ id: task.id, description: task.description });
        } else if (task.status === "completed") {
          console.log(`${id} pushed to completed`);
          Tasks.completed.push({ id: task.id, description: task.description });
        }
      }
      return res.status(200).json(Tasks);
    } else {
      return res.status(400).json({ message: "User does not exist" });
    }
    res.status(200).json(userTasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/taskList", async (req, res) => {
  try {
    const { username, taskIds } = req.body;
    console.log("Received payload:", req.body);

    // Find the user by username
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Ensure taskIds is an object with properties todo, ongoing, and completed
    if (!taskIds) {
      return res.status(400).json({ message: "Missing task lists" });
    }

    // Ensure each task list (todo, ongoing, completed) is an array (even if empty)
    user.taskIds = taskIds;
    // Save the updated user document
    await user.save();

    // Return the updated user information
    res.status(200).json({ message: "Task list updated successfully", user });
  } catch (error) {
    console.error("Error updating task list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.post("/users", async (req, res) => {
  try {
    const { username } = req.body;
    console.log(req.body);
    // Check if a user with the same uid already exists
    let user = await User.findOne({ username });
    if (user) {
      return res
        .status(400)
        .json({ message: "User with this UID already exists." });
    }
    // Create a new user
    user = new User({ username });
    await user.save();

    res.status(201).json(user); // Respond with the created user
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/tasks", async (req, res) => {
  try {
    const { id, description, status } = req.body;
    console.log(req.body);
    console.log(id, description, status);

    // Check if the task exists
    let task = await Task.findOne({ id });

    if (task) {
      // Handle deletion if status is explicitly null
      if (status === null) {
        await Task.deleteOne({ id });
        console.log(`Task with id ${id} deleted.`);
        return res.status(204).send(); // Respond with no content
      }

      // Update the task fields if provided
      if (description !== null) {
        task.description = description;
      }
      if (status !== null) {
        task.status = status;
      }
    } else {
      // Create a new task if it doesn't exist
      if (status === null) {
        return res
          .status(400)
          .json({ message: "Cannot create a task with null status." });
      }
      task = new Task({ id, description, status });
    }

    await task.save();
    res.status(201).json(task); // Respond with the updated or created task
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));
