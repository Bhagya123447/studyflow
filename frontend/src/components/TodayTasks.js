// src/components/TodayTasks.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Import db from your firebase.js
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import './TodayTasks.css'; // Dedicated CSS for TodayTasks

export default function TodayTasks({ uid }) {
  const [todayTasks, setTodayTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      setError("User not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    // Get today's date for filtering
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    // Create a query to get tasks for the current user
    // Assuming task 'date' field in Firestore is a timestamp or date string comparable
    // For more robust filtering, you might store tasks with a 'dueDate' field as Firestore Timestamp
    // For now, we'll fetch all and filter client-side based on a 'date' string if that's how it's saved.
    // If 'date' is a Firebase Timestamp, a query like below is better:
    // const tasksQuery = query(
    //   collection(db, "users", uid, "tasks"),
    //   where("dueDate", ">=", today),
    //   where("dueDate", "<", tomorrow)
    // );
    // If 'date' is a string like "Oct 29", we fetch all and filter in JS. Let's assume date is a string for now.

    const tasksCollectionRef = collection(db, "users", uid, "tasks");

    const unsubscribe = onSnapshot(tasksCollectionRef, (snapshot) => {
      const allTasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      // Filter tasks to show only those for today
      const filteredTasks = allTasks.filter(task => {
        // Assuming task.date is a string like "Oct 29"
        // This part needs adjustment based on your actual date format in Firestore
        const taskDate = new Date(task.date); // Attempt to parse
        const currentDay = new Date().toDateString(); // e.g., "Mon Oct 28 2024"
        const taskDay = taskDate.toDateString();

        return taskDay === currentDay;
      });

      setTodayTasks(filteredTasks);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching today's tasks:", err);
      setError("Failed to load tasks for today.");
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, [uid]); // Re-run effect if uid changes

  const handleToggleComplete = async (taskId, currentStatus) => {
    if (!uid) return;
    try {
      const taskRef = doc(db, "users", uid, "tasks", taskId);
      await updateDoc(taskRef, {
        status: currentStatus === "completed" ? "pending" : "completed" // Toggle status
      });
    } catch (err) {
      console.error("Error updating task status:", err);
      setError("Failed to update task status.");
    }
  };

  // Placeholder for Add Task functionality (e.g., open a modal or navigate)
  const handleAddTask = () => {
    console.log("Add Task button clicked!");
    // In a real app, you would navigate to a /tasks page or open a modal
    // For now, let's just log or alert
    alert("This would open a form to add a new task!");
  };

  if (loading) return (
    <div className="today-tasks-container">
      <p className="loading-message">Loading today's tasks...</p>
    </div>
  );

  if (error) return (
    <div className="today-tasks-container">
      <p className="error-message">⚠️ {error}</p>
    </div>
  );

  return (
    <div className="today-tasks-container">
      <div className="tasks-header">
        <h2 className="tasks-title">Today's Tasks</h2>
        <button className="add-task-button" onClick={handleAddTask}>
          <span className="add-task-icon">+</span> Add Task
        </button>
      </div>

      <div className="tasks-list">
        {todayTasks.length === 0 ? (
          <p className="no-tasks-message">No tasks for today! Enjoy your free time or add a new one. 🎉</p>
        ) : (
          todayTasks.map(t => (
            <div
              key={t.id}
              className={`task-card ${t.status === 'completed' ? 'task-completed' : ''}`}
              style={{
                borderLeftColor: t.difficulty === 'High' ? 'var(--difficulty-high, #dc3545)' :
                                 (t.difficulty === 'Medium' ? 'var(--difficulty-medium, #ffc107)' :
                                  'var(--difficulty-low, #28a745)')
              }}
            >
              <input
                type="checkbox"
                className="task-checkbox"
                checked={t.status === 'completed'}
                onChange={() => handleToggleComplete(t.id, t.status)}
              />
              <div className="task-details">
                <div className="task-row">
                  <strong className="task-title">{t.title}</strong>
                  <span className={`task-difficulty ${t.difficulty ? t.difficulty.toLowerCase() : 'unknown'}`}>
                    {t.difficulty || 'N/A'}
                  </span>
                </div>
                {t.description && <div className="task-description">{t.description}</div>}
                <div className="task-meta">
                  {t.date && <span className="task-date">🗓️ {new Date(t.date).toLocaleDateString()}</span>}
                  {t.time && <span className="task-time">⏰ {t.time}</span>}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}