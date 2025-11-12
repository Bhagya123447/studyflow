import React, { useState, useRef, useEffect } from "react";
import './FocusSession.css';

// ✅ Accept all props from Dashboard now
export default function FocusSession({
  uid,
  recommendedBreak,
  focusDuration = 25,
  breakDuration = 5,
  autoStartBreaks = false
}) {
  const [running, setRunning] = useState(false);
  const [sessionType, setSessionType] = useState("focus");
  const [seconds, setSeconds] = useState(0);
  const [sessionCount, setSessionCount] = useState(1);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  // ✅ Use durations from props (convert to seconds)
  const initialFocusDuration = focusDuration * 60;
  const initialBreakDuration = breakDuration * 60;

  useEffect(() => {
    if (!running) {
      setSeconds(sessionType === "focus" ? initialFocusDuration : initialBreakDuration);
    }
  }, [focusDuration, breakDuration, sessionType, running]);

  // Timer logic
  useEffect(() => {
    if (running && seconds > 0) {
      timerRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      clearInterval(timerRef.current);
      setRunning(false);
      handleSessionEnd();
    }
    return () => clearInterval(timerRef.current);
  }, [running, seconds]);

  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleStartStop = () => {
    if (!uid) {
      alert("Please log in to start a focus session.");
      return;
    }

    if (!running) {
      if (seconds === 0 || seconds === initialFocusDuration || seconds === initialBreakDuration) {
        startTimeRef.current = new Date().toISOString();
      }
    } else {
      clearInterval(timerRef.current);
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setSessionType("focus");
    setSeconds(initialFocusDuration);
    startTimeRef.current = null;
  };

  const toggleSessionType = (type) => {
    if (running) return;
    clearInterval(timerRef.current);
    setRunning(false);
    setSessionType(type);
    setSeconds(type === "focus" ? initialFocusDuration : initialBreakDuration);
    startTimeRef.current = null;
  };

  const handleSessionEnd = async () => {
    if (sessionType === "focus") {
      const endTime = new Date().toISOString();
      const durationInMinutes = Math.floor(initialFocusDuration / 60);

      if (uid && startTimeRef.current) {
        try {
          const response = await fetch(`/api/user/${uid}/sessions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: `Focus Session ${sessionCount}`,
              startTime: startTimeRef.current,
              endTime: endTime,
              focusedMinutes: durationInMinutes,
              status: "completed",
              type: "focus",
              createdAt: new Date().toISOString(),
            }),
          });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const savedSession = await response.json();
          console.log("Session saved:", savedSession);
        } catch (err) {
          console.error("Error saving session:", err);
          alert(`Error saving focus session: ${err.message}`);
        }
      }

      alert(`Focus Session ${sessionCount} completed! Time for a ${breakDuration}-minute break.`);
      setSessionType("break");
      setSeconds(initialBreakDuration);
      setRunning(autoStartBreaks); // ✅ Use user’s setting for auto-start
      startTimeRef.current = new Date().toISOString();
    } else {
      alert("Break over! Ready for another focus session?");
      setSessionType("focus");
      setSeconds(initialFocusDuration);
      setSessionCount((prev) => prev + 1);
      setRunning(false);
      startTimeRef.current = null;
    }
  };

  // Circular progress bar setup
  const totalDuration = sessionType === "focus" ? initialFocusDuration : initialBreakDuration;
  const progress = (seconds / totalDuration) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = totalDuration > 0
    ? circumference - (progress / 100) * circumference
    : circumference;

  return (
    <div className="focus-session-container">
      <div className="session-type-selector">
        <button
          className={`session-type-button ${sessionType === "focus" ? "active" : ""}`}
          onClick={() => toggleSessionType("focus")}
          disabled={running}
        >
          Focus
        </button>
        <button
          className={`session-type-button ${sessionType === "break" ? "active" : ""}`}
          onClick={() => toggleSessionType("break")}
          disabled={running}
        >
          Break
        </button>
      </div>

      <div className="session-info">
        <span className="session-label">
          Current: {sessionType === "focus" ? `Focus Session ${sessionCount}` : "Break"}
        </span>
      </div>

      <div className="timer-display-wrapper">
        <svg width="300" height="300" viewBox="0 0 200 200" className="timer-svg">
          <circle className="timer-circle-background" r={radius} cx="100" cy="100" />
          <circle
            className={`timer-circle-progress ${sessionType === "focus" ? "focus-color" : "break-color"}`}
            r={radius}
            cx="100"
            cy="100"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>
        <div className="timer-text">{formatTime(seconds)}</div>
        <p className="timer-slogan">
          {sessionType === "focus" ? "Stay focused!" : "Time to recharge!"}
        </p>
      </div>

      <div className="timer-controls">
        <button
          onClick={handleStartStop}
          className={`timer-button ${running ? "stop-button" : "start-button"}`}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button onClick={handleReset} className="timer-button reset-button">
          Reset
        </button>
      </div>
    </div>
  );
}
