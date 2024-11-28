import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("");
  const [todayTasks, setTodayTasks] = useState([]); // Fixed the useState syntax here

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour >= 12 && currentHour < 17) {
      // Fixed comparison logic
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }

    try {
      const tasks = JSON.parse(localStorage.getItem("tasks")) || {
        todo: [],
        ongoing: [],
        completed: [],
      };
      const todayDate = new Date().toISOString().split("T")[0]; // Format today’s date as YYYY-MM-DD

      // Ensure tasks.todo is defined before filtering
      const tasksForToday = (tasks.todo || []).filter(
        (task) => task.dueDate === todayDate
      );
      setTodayTasks(tasksForToday);
    } catch (error) {
      console.error("Failed to parse tasks from localStorage:", error);
      setTodayTasks([]);
    }
  }, []);

  return (
    <div className="page-container">
      <h1 className="page-title">Dashboard</h1>
      <p className="greeting-text">
        {greeting}, {JSON.parse(localStorage.getItem('user')).displayName.split(" ")[0]}
      </p>
      <p className="page-description" style={{ marginTop: "0px" }}>
        Here is an Overview of your Schedule
      </p>
      <div className="today-tasks-container">
        <h2 style={{ color: " var(--text-color)" }}>
          Tasks Scheduled for Today
        </h2>
        {Array.isArray(todayTasks) && todayTasks.length > 0 ? ( // Ensure todayTasks is an array
          <ul>
            {todayTasks.map((task, index) => (
              <li key={index} className="task-item">
                <strong>{task.taskName}</strong> - Priority: {task.priority}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: " var(--text-color)" }}>
            No tasks scheduled for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
