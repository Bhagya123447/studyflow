import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const TasksPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [tasks, setTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    date: "",
    duration: "",
    status: "Pending",
  });

  // Fetch tasks from Firestore
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users", user.uid, "tasks"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(data);
    });
    return () => unsub();
  }, [user]);

  // Add a new task
  const addTask = async (e) => {
    e.preventDefault();
    if (!user) return alert("Login first!");
    await addDoc(collection(db, "users", user.uid, "tasks"), newTask);
    setShowForm(false);
    setNewTask({ title: "", description: "", priority: "Medium", date: "", duration: "", status: "Pending" });
  };

  // Filter logic
  const filteredTasks = tasks.filter((t) => {
    const priorityOk = priorityFilter === "All" || t.priority === priorityFilter;
    const statusOk = statusFilter === "All" || t.status === statusFilter;
    return priorityOk && statusOk;
  });

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-blue-100 text-blue-700",
    Low: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-8 text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold">Tasks</h1>
          <p className="text-gray-500">Manage your study tasks and goals</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          + Add Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option>All</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option>All</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="grid gap-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
          >
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600 text-sm">{task.description}</p>
              <div className="text-gray-500 text-sm mt-1">
                📅 {task.date || "No date"} • ⏱ {task.duration || "N/A"} min
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              <input
                type="checkbox"
                checked={task.status === "Completed"}
                onChange={() => {
                  const newStatus = task.status === "Completed" ? "Pending" : "Completed";
                  const docRef = collection(db, "users", user.uid, "tasks");
                  fetch(`https://firestore.googleapis.com/v1/projects/${db.app.options.projectId}/databases/(default)/documents/users/${user.uid}/tasks/${task.id}?updateMask.fieldPaths=status`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ fields: { status: { stringValue: newStatus } } }),
                  });
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Add Task</h2>
            <form onSubmit={addTask} className="space-y-3">
              <input
                type="text"
                placeholder="Task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex gap-2">
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="border px-2 py-1 rounded-md w-1/2"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <input
                  type="date"
                  value={newTask.date}
                  onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                  className="border px-2 py-1 rounded-md w-1/2"
                />
              </div>
              <input
                type="number"
                placeholder="Duration (min)"
                value={newTask.duration}
                onChange={(e) => setNewTask({ ...newTask, duration: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md border border-gray-300"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white">
                  Save
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
