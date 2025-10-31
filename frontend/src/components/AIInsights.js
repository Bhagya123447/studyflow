import React from "react";

export default function AIInsights() {
  const insights = [
    {
      title: "Peak Focus Time",
      desc: "Detected between 10 AM - 12 PM. Try scheduling complex topics here.",
      icon: "🕑",
    },
    {
      title: "Energy Pattern",
      desc: "Average focus session: 45 minutes. Recommend 5-min break every session.",
      icon: "⚡",
    },
    {
      title: "Task Optimization",
      desc: "Prioritize hard tasks early when your focus is high.",
      icon: "📈",
    },
    {
      title: "Consistency Score",
      desc: "You studied 7 days straight! Keep the streak going.",
      icon: "🔥",
    },
  ];

  return (
    <div>
      <h1>AI Insights</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 }}>
        {insights.map((ins) => (
          <div key={ins.title} style={{ border: "1px solid #eee", borderRadius: 12, padding: 20 }}>
            <div style={{ fontSize: 24 }}>{ins.icon}</div>
            <h3>{ins.title}</h3>
            <p style={{ color: "#666", fontSize: 14 }}>{ins.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
