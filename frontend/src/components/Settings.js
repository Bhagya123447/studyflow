import React, { useState } from "react";

export default function Settings() {
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(true);
  const [goalDaily, setGoalDaily] = useState(2);
  const [goalWeekly, setGoalWeekly] = useState(10);
  const [insightPref, setInsightPref] = useState("daily");

  const saveChanges = () => {
    const settings = {
      focusDuration,
      breakDuration,
      autoStartBreak,
      notifications,
      sound,
      goalDaily,
      goalWeekly,
      insightPref,
    };
    console.log("Saved settings:", settings);
    alert("Settings saved successfully (connect to Firestore later)");
  };

  return (
    <div>
      <h1>Settings</h1>
      <div style={{ display: "grid", gap: 12, maxWidth: 400 }}>
        <label>
          Focus Duration (min)
          <input
            type="number"
            value={focusDuration}
            onChange={(e) => setFocusDuration(+e.target.value)}
          />
        </label>

        <label>
          Break Duration (min)
          <input
            type="number"
            value={breakDuration}
            onChange={(e) => setBreakDuration(+e.target.value)}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={autoStartBreak}
            onChange={(e) => setAutoStartBreak(e.target.checked)}
          />
          Auto-start Break
        </label>

        <label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          Enable Notifications
        </label>

        <label>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.target.checked)}
          />
          Sound Effects
        </label>

        <label>
          Daily Study Goal (hrs)
          <input
            type="number"
            value={goalDaily}
            onChange={(e) => setGoalDaily(+e.target.value)}
          />
        </label>

        <label>
          Weekly Study Goal (hrs)
          <input
            type="number"
            value={goalWeekly}
            onChange={(e) => setGoalWeekly(+e.target.value)}
          />
        </label>

        <label>
          AI Insight Preference
          <select
            value={insightPref}
            onChange={(e) => setInsightPref(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>

        <button
          onClick={saveChanges}
          style={{
            marginTop: 16,
            padding: "8px 12px",
            background: "#4f46e5",
            color: "white",
            border: "none",
            borderRadius: 8,
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
