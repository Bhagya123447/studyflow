import React from "react";

export default function AIBlocks() {
  const blocks = [
    {
      title: "Peak Focus Time Detected",
      desc: "Your focus score is highest between 9 AM - 11 AM. Consider scheduling important tasks during this window.",
      button: "Adjust Schedule",
    },
    {
      title: "Study Session Recommendation",
      desc: "Based on your progress, consider taking a 15-minute break every 90 minutes to maintain optimal focus.",
      button: "Learn More",
    },
    {
      title: "Topic Review Suggestion",
      desc: "You haven't reviewed React in a while. It's recommended to revisit this topic soon to reinforce your understanding.",
      button: "Review Now", // Assuming a button here for consistency
    },
    {
      title: "Weekly Goal Progress",
      desc: "You're 80% towards your weekly study goal! Keep up the great work!",
      button: "View Details", // Assuming a button here for consistency
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, padding: 8, backgroundColor: "#f8f8f8" }}>
      {blocks.map((b) => (
        <div key={b.title} style={{ padding: 16, border: "1px solid #e0e0e0", borderRadius: 12, backgroundColor: "white", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            {/* Placeholder for icon, you can replace with actual icons */}
            <div style={{ width: 24, height: 24, borderRadius: "50%", backgroundColor: "#e6f7ff", display: "flex", justifyContent: "center", alignItems: "center", marginRight: 8, fontSize: 14 }}>💡</div>
            <h4 style={{ margin: 0, fontSize: 18, color: "#333" }}>{b.title}</h4>
          </div>
          <p style={{ fontSize: 15, color: "#666", lineHeight: 1.5, marginBottom: 16 }}>{b.desc}</p>
          {b.button && (
            <button style={{
              background: "none",
              border: "none",
              color: "#1890ff",
              fontSize: 15,
              cursor: "pointer",
              padding: 0,
              textDecoration: "underline"
            }}>
              {b.button}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}