// src/components/TasksPage.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore"; // Import deleteDoc
import { getAuth } from "firebase/auth";
import { PlusCircle, Edit, Trash2, CheckCircle, Circle } from 'lucide-react'; // Example icons
import './TasksPage.css';

const TasksPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // State to hold task being edited
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    date: "",
    duration: "",
    status: "Pending",
  });
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!user) {
      setLoadingTasks(false);
      return;
    }
    const q = query(collection(db, "users", user.uid, "tasks"));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setTasks(data);
        setLoadingTasks(false);
      },
      (err) => {
        console.error("Error fetching tasks:", err);
        setError("Failed to load tasks. Please try again.");
        setLoadingTasks(false);
      }
    );
    return () => unsub();
  }, [user]);

  // Handle form input changes
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // Add or Update a task
  const handleSubmitTask = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Login first to add tasks!");
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const taskDocRef = doc(db, "users", user.uid, "tasks", editingTask.id);
        await updateDoc(taskDocRef, newTask);
        setEditingTask(null); // Clear editing state
      } else {
        // Add new task
        await addDoc(collection(db, "users", user.uid, "tasks"), { ...newTask, userId: user.uid });
      }
      setShowForm(false);
      setNewTask({ title: "", description: "", priority: "Medium", date: "", duration: "", status: "Pending" });
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task. Please try again.");
    }
  };

  // Update task status
  const updateTaskStatus = async (taskId, currentStatus) => {
    if (!user) {
      alert("Login first!");
      return;
    }
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";
    const taskDocRef = doc(db, "users", user.uid, "tasks", taskId);
    try {
      await updateDoc(taskDocRef, { status: newStatus });
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status.");
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    if (!user) {
      alert("Login first!");
      return;
    }
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const taskDocRef = doc(db, "users", user.uid, "tasks", taskId);
        await deleteDoc(taskDocRef);
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task. Please try again.");
      }
    }
  };

  // Start editing a task
  const startEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      date: task.date,
      duration: task.duration,
      status: task.status,
    });
    setShowForm(true);
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    const priorityOk = priorityFilter === "All" || t.priority === priorityFilter;
    const statusOk = statusFilter === "All" || t.status === statusFilter;
    return priorityOk && statusOk;
  });

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      case "Low": return "priority-low";
      default: return "";
    }
  };

  if (!user) {
    return <div className="no-user-message">Please log in to manage your tasks.</div>;
  }

  if (loadingTasks) {
    return <div className="loading-message">Loading tasks...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="tasks-page-container">
      <div className="tasks-header-section">
        <div>
          <h1 className="tasks-header-title">Tasks</h1>
          <p className="tasks-header-subtitle">Manage your study tasks and goals</p>
        </div>
        <button
          onClick={() => {
            setEditingTask(null); // Clear editing state when opening for new task
            setNewTask({ title: "", description: "", priority: "Medium", date: "", duration: "", status: "Pending" });
            setShowForm(true);
          }}
          className="add-task-button"
        >
          <PlusCircle size={18} style={{ marginRight: '8px' }} /> Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="tasks-filters">
        <div className="filter-dropdown">
          <label htmlFor="priority-filter" className="sr-only">Priority Filter</label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option>All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        <div className="filter-dropdown">
          <label htmlFor="status-filter" className="sr-only">Status Filter</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="no-tasks-message">No tasks found. Add a new task to get started!</div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="task-card"
            >
              <div className="task-main-content">
                <input
                  type="checkbox"
                  checked={task.status === "Completed"}
                  onChange={() => updateTaskStatus(task.id, task.status)}
                  className="task-checkbox"
                />
                <div>
                  <h3 className={`task-title ${task.status === "Completed" ? "completed-task-title" : ""}`}>
                    {task.title}
                  </h3>
                  <p className="task-description">{task.description}</p>
                  <div className="task-meta">
                    {task.date && `📅 ${task.date}`}
                    {task.date && task.duration && " • "}
                    {task.duration && `⏱ ${task.duration} min`}
                  </div>
                </div>
              </div>
              <div className="task-actions">
                <span className={`task-priority-tag ${getPriorityClass(task.priority)}`}>
                  {task.priority}
                </span>
                <button onClick={() => startEditTask(task)} className="task-action-button" title="Edit Task">
                  <Edit size={18} />
                </button>
                <button onClick={() => deleteTask(task.id)} className="task-action-button delete-button" title="Delete Task">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      {showForm && (
        <div className="task-form-modal-overlay">
          <div className="task-form-modal-content">
            <h2 className="task-form-modal-title">{editingTask ? "Edit Task" : "Add New Task"}</h2>
            <form onSubmit={handleSubmitTask} className="task-form">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={newTask.title}
                onChange={handleNewTaskChange}
                className="task-form-input"
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newTask.description}
                onChange={handleNewTaskChange}
                className="task-form-textarea"
              />
              <div className="task-form-row">
                <select
                  name="priority"
                  value={newTask.priority}
                  onChange={handleNewTaskChange}
                  className="task-form-select"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input
                  type="date"
                  name="date"
                  value={newTask.date}
                  onChange={handleNewTaskChange}
                  className="task-form-input"
                />
              </div>
              <input
                type="number"
                name="duration"
                placeholder="Duration (min)"
                value={newTask.duration}
                onChange={handleNewTaskChange}
                className="task-form-input"
              />
              {editingTask && (
                 <div className="task-form-row">
                    <label className="task-form-label">Status:</label>
                    <select
                        name="status"
                        value={newTask.status}
                        onChange={handleNewTaskChange}
                        className="task-form-select"
                    >
                        <option>Pending</option>
                        <option>Completed</option>
                    </select>
                 </div>
              )}
              <div className="task-form-actions">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="task-form-button cancel-button"
                >
                  Cancel
                </button>
                <button type="submit" className="task-form-button save-button">
                  {editingTask ? "Update Task" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksPage;