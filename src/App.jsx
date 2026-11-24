import React, { useState, useEffect } from "react";
import "./App.css";


function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [filter, setFilter] = useState("All");
  const [editId, setEditId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Display current time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Add or Update Task
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !time) {
      alert("Please enter task title and time");
      return;
    }

    if (editId !== null) {
      setTasks(
        tasks.map((task) =>
          task.id === editId
            ? { ...task, title, time }
            : task
        )
      );

      setEditId(null);
    } else {
      const newTask = {
        id: Date.now(),
        title,
        time,
        completed: false,
      };

      setTasks([...tasks, newTask]);
    }

    setTitle("");
    setTime("");
  };

  // Edit Task
  const handleEdit = (task) => {
    setTitle(task.title);
    setTime(task.time);
    setEditId(task.id);
  };

  // Delete Task
  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));

    if (editId === id) {
      setEditId(null);
      setTitle("");
      setTime("");
    }
  };

  // Complete or Pending Task
  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Filter Tasks
  const filteredTasks = tasks.filter((task) => {
    if (filter === "Completed") return task.completed;
    if (filter === "Pending") return !task.completed;
    return true;
  });

  return (
    <div className="app">

      <div className="planner">

        <h1>Daily Task Planner</h1>

        <div className="clock">
          <h2>Current Time</h2>

          <h1>
            {currentTime.toLocaleTimeString()}
          </h1>

          <p>
            {currentTime.toDateString()}
          </p>
        </div>

        {/* Task Form */}

        <form onSubmit={handleSubmit} className="task-form">

          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <button type="submit">
            {editId !== null ? "Update Task" : "Add Task"}
          </button>

        </form>

        {/* Task Filters */}

        <div className="filters">

          {["All", "Completed", "Pending"].map((item) => (
            <button
              key={item}
              className={filter === item ? "active" : ""}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}

        </div>

        {/* Task List */}

        <div className="task-list">

          <h2>My Tasks</h2>

          {filteredTasks.length === 0 ? (

            <p className="empty">
              {tasks.length === 0
                ? "No tasks for today. Add your first task!"
                : `No ${filter.toLowerCase()} tasks found.`}
            </p>

          ) : (

            filteredTasks.map((task) => (

              <div
                className={`task ${task.completed ? "completed" : ""}`}
                key={task.id}
              >

                <div className="task-info">

                  <h3>{task.title}</h3>

                  <p>Time: {task.time}</p>

                  <span>
                    {task.completed ? "Completed" : "Pending"}
                  </span>

                </div>

                <div className="actions">

                  <button
                    onClick={() => toggleTask(task.id)}
                    className="complete-btn"
                  >
                    {task.completed ? "Undo" : "Complete"}
                  </button>

                  <button
                    onClick={() => handleEdit(task)}
                    className="edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(task.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

        {/* Task Summary */}

        <div className="summary">

          <p>Total Tasks: {tasks.length}</p>

          <p>
            Completed: {tasks.filter((t) => t.completed).length}
          </p>

          <p>
            Pending: {tasks.filter((t) => !t.completed).length}
          </p>

        </div>

      </div>

    </div>
  );
}

export default App;