import React, { useState, useRef, useEffect } from "react";

export default function FocusSession() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(1500); // Start at 25 minutes (25 * 60 seconds)
  const [sessionCount, setSessionCount] = useState(1);
  const timerRef = useRef(null);
  const initialSessionDuration = 1500; // 25 minutes in seconds

  useEffect(() => {
    if (running && seconds > 0) {
      timerRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (seconds === 0) {
      clearInterval(timerRef.current);
      setRunning(false);
      // Optional: Play a sound or show a notification when session ends
    }
    return () => clearInterval(timerRef.current);
  }, [running, seconds]);

  const format = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleStartStop = () => {
    setRunning((r) => !r);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setSeconds(initialSessionDuration); // Reset to 25 minutes
  };

  // Calculate progress for the circular bar
  const progress = (seconds / initialSessionDuration) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // Remove background, border-radius, box-shadow from here
        padding: "30px 20px", // Keep internal padding
      }}
    >
      <div style={{ display: "flex", alignItems: "center", marginBottom: "30px" }}>
        <button
          style={{
            padding: "8px 16px",
            marginRight: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Focus Session
        </button>
        <span style={{ fontSize: "18px", color: "#555" }}>Session {sessionCount}</span>
      </div>

      <div
        style={{
          position: "relative",
          width: "300px",
          height: "300px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle
            stroke="#eee"
            fill="transparent"
            strokeWidth="8"
            r={radius}
            cx="100"
            cy="100"
          />
          <circle
            stroke="#007bff"
            fill="transparent"
            strokeWidth="8"
            strokeLinecap="round"
            r={radius}
            cx="100"
            cy="100"
            style={{
              transition: "stroke-dashoffset 1s linear",
              transform: "rotate(-90deg)",
              transformOrigin: "50% 50%",
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div style={{ fontSize: "70px", fontWeight: "bold", color: "#333", lineHeight: 1 }}>
          {format(seconds)}
        </div>
        <p style={{ fontSize: "18px", color: "#666", marginTop: "5px" }}>Stay focused!</p>
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <button
          onClick={handleStartStop}
          style={{
            padding: "12px 28px",
            backgroundColor: running ? "#dc3545" : "#28a745",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            transition: "background-color 0.2s ease",
            minWidth: "120px"
          }}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: "12px 28px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "18px",
            fontWeight: "bold",
            transition: "background-color 0.2s ease",
            minWidth: "120px"
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}