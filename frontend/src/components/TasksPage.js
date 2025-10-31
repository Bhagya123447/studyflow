import React, { useState } from "react";

export default function TasksPage() {
  const [difficulty, setDifficulty] = useState("all");
  const [status, setStatus] = useState("all");
  const [tasks, setTasks] = useState([
    { id: 1, title: "Math - Integrals", difficulty: "hard", status: "todo" },
    { id: 2, title: "DBMS Notes", difficulty: "medium", status: "in-progress" },
    { id: 3, title: "React mini project", difficulty: "easy", status: "done" },
    { id: 4, title: "AI report", difficulty: "hard", status: "todo" },
  ]);

  const filtered = tasks.filter(
    (t) =>
      (difficulty === "all" || t.difficulty === difficulty) &&
      (status === "all" || t.status === status)
  );

  return (
    <div>
      <h1>Tasks</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="all">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All status</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {filtered.map((t) => (
        <div
          key={t.id}
          style={{
            border: "1px solid #eee",
            padding: 10,
            borderRadius: 8,
            marginBottom: 8,
            background: t.status === "done" ? "#e8ffe8" : "white",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{t.title}</strong>
            <span>{t.difficulty}</span>
          </div>
          <div style={{ fontSize: 12, color: "#777" }}>Status: {t.status}</div>
        </div>
      ))}
    </div>
  );
}
