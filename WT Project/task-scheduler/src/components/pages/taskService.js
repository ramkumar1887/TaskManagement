// taskService.js

export const fetchUserTasks = async () => {
    try {
      const user = localStorage.getItem("user");
  
      if (
        user &&
        JSON.parse(user).providerData &&
        JSON.parse(user).providerData[0]
      ) {
        const uid = JSON.parse(user).providerData[0].uid;
  
        const response = await fetch(`http://localhost:5000/utasks?username=${uid}`);
        if (!response.ok) {
          console.log("Failed to fetch tasks");
        }
        const tasks = await response.json();
        console.log(JSON.stringify(tasks));
        // Save tasks to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));
        return tasks;
      } else {
        console.error("User or provider data is missing from localStorage");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user tasks:", error);
      return null;
    }
  };
  