import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  // Add a new task
  const addTask = () => {
    if (task.trim() === "") return;

    setTasks([
      ...tasks,
      {
        text: task,
        completed: false,
      },
    ]);

    setTask("");
  };

  // Complete / Undo task
  const toggleComplete = (indexToToggle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === indexToToggle
        ? { ...task, completed: !task.completed }
        : task
    );

    setTasks(updatedTasks);
  };

  // Delete task
  const deleteTask = (indexToDelete) => {
    const updatedTasks = tasks.filter(
      (_, index) => index !== indexToDelete
    );

    setTasks(updatedTasks);
  };

  // Clear all completed tasks
  const clearCompleted = () => {
    const activeTasks = tasks.filter((task) => !task.completed);
    setTasks(activeTasks);
  };

  // Count completed tasks
  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  return (
    <div>
      <h1>Task Manager</h1>

      <input
        type="text"
        placeholder="Enter a new task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addTask();
          }
        }}
      />

      <button onClick={addTask}>
        Add Task
      </button>

      <p>Total Tasks: {tasks.length}</p>

      <p>Completed Tasks: {completedTasks}</p>

      <button
        onClick={clearCompleted}
        disabled={completedTasks === 0}
      >
        Clear Completed
      </button>

      <ul>
        {tasks.map((item, index) => (
          <li key={index}>
            <span
              style={{
                textDecoration: item.completed
                  ? "line-through"
                  : "none",
              }}
            >
              {item.text}
            </span>

            <button
              onClick={() => toggleComplete(index)}
            >
              {item.completed ? "Undo" : "Complete"}
            </button>

            <button
              onClick={() => deleteTask(index)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;