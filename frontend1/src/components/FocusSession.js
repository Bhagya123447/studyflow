// src/components/FocusSession.js
import React, { useState, useRef, useEffect } from "react";
import './FocusSession.css'; // Dedicated CSS for FocusSession

// Ensure that `uid` and `recommendedBreak` are destructured from props
export default function FocusSession({ recommendedBreak, uid }) {
  const [running, setRunning] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'
  const [seconds, setSeconds] = useState(0); // Initialize with 0, will be set by useEffect
  const [sessionCount, setSessionCount] = useState(1); // Keeps track of focus sessions
  const timerRef = useRef(null);
  const startTimeRef = useRef(null); // To store the start time of the current session

  // Dynamic initial session duration based on AI recommendation (median_focus_minutes)
  // Use recommendedBreak (which comes from median_focus_minutes) or a default 25 mins
  // The recommendedBreak prop here is already in minutes, so convert to seconds
  const initialFocusDuration = recommendedBreak ? recommendedBreak * 60 : 25 * 60;
  const initialBreakDuration = 5 * 60; // Default 5-minute break (can also be dynamic from AI later)

  // Effect to set initial timer value when component mounts or recommendedBreak changes
  useEffect(() => {
    // Only set if not already running to avoid resetting an active timer
    if (!running) {
      if (sessionType === 'focus') {
        setSeconds(initialFocusDuration);
      } else {
        setSeconds(initialBreakDuration);
      }
    }
  }, [recommendedBreak, initialFocusDuration, initialBreakDuration, sessionType, running]);

  // Main timer logic
  useEffect(() => {
    if (running && seconds > 0) {
      timerRef.current = setInterval(() => setSeconds((s) => s - 1), 1000);
    } else if (running && seconds === 0) {
      // Session ended!
      clearInterval(timerRef.current);
      setRunning(false);
      handleSessionEnd(); // Call handler for session completion
    }
    return () => clearInterval(timerRef.current); // Cleanup on unmount or before next effect run
  }, [running, seconds]); // Removed handleSessionEnd from dependencies to avoid re-triggering issues

  // Helper function to format time
  const formatTime = (s) => {
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleStartStop = () => {
    // Corrected: Check for `uid` prop instead of undeclared `user`
    if (!uid) {
      alert("Please log in to start a focus session.");
      return;
    }

    if (!running) {
      // If timer is not running, and we're starting
      if (seconds === initialFocusDuration || seconds === initialBreakDuration || seconds === 0) {
        startTimeRef.current = new Date().toISOString(); // Record start time for new session
      }
    } else {
      // If stopping a session prematurely, you might want to save progress
      clearInterval(timerRef.current); // Stop the timer immediately
    }
    setRunning((r) => !r);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setRunning(false);
    setSessionType('focus'); // Always reset to focus
    setSeconds(initialFocusDuration); // Reset to initial focus duration
    startTimeRef.current = null; // Clear start time
  };

  // Function to switch between focus and break
  const toggleSessionType = (type) => {
    if (running) return; // Prevent switching if timer is running

    clearInterval(timerRef.current);
    setRunning(false); // Stop timer when switching (though it should already be stopped)

    setSessionType(type);
    if (type === 'focus') {
      setSeconds(initialFocusDuration);
      // Only increment session count when explicitly starting a NEW focus session from the button
      // and not when it auto-switches from break
      if (sessionType !== 'focus') { // Only increment if previous was not focus
          // setSessionCount(prev => prev + 1); // We increment this in handleSessionEnd for auto-switch
      }
    } else { // type === 'break'
      setSeconds(initialBreakDuration);
    }
    startTimeRef.current = null; // Clear start time on type switch
  };

  const handleSessionEnd = async () => {
    // Logic for what happens when a timer reaches 0
    if (sessionType === 'focus') {
      // It was a focus session that ended, so save it to the backend
      const endTime = new Date().toISOString();
      const durationInMinutes = Math.floor(initialFocusDuration / 60); // Assuming full duration for saving

      if (uid && startTimeRef.current) { // Ensure uid and startTime are available
        try {
          const response = await fetch(`/api/user/${uid}/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              title: `Focus Session ${sessionCount}`, // Use current session count for title
              startTime: startTimeRef.current,
              endTime: endTime,
              focusedMinutes: durationInMinutes,
              status: "completed",
              type: "focus",
              createdAt: new Date().toISOString(), // Timestamp for creation
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
          }
          const savedSession = await response.json();
          console.log("Session saved:", savedSession);
          // Optional: Show a success message to the user (e.g., using a toast notification)
        } catch (err) {
          console.error("Error saving session:", err);
          alert(`Error saving focus session: ${err.message}. Please check your backend.`); // Inform user
        }
      }

      // After a focus session, automatically start a break
      alert(`Focus Session ${sessionCount} completed! Time for a ${initialBreakDuration / 60}-minute break.`);
      setSessionType('break');
      setSeconds(initialBreakDuration);
      setRunning(true); // Auto-start break
      startTimeRef.current = new Date().toISOString(); // Record break start time
    } else { // It was a break session that ended
      alert("Break over! Ready for another focus session?");
      setSessionType('focus');
      setSeconds(initialFocusDuration);
      setSessionCount(prev => prev + 1); // Increment for the next focus session
      setRunning(false); // Don't auto-start focus, let the user decide
      startTimeRef.current = null;
    }
  };

  // Calculate progress for the circular bar
  const totalDuration = sessionType === 'focus' ? initialFocusDuration : initialBreakDuration;
  const progress = (seconds / totalDuration) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  // Make sure to handle division by zero if totalDuration is 0 (though it shouldn't be)
  const strokeDashoffset = totalDuration > 0 ? circumference - (progress / 100) * circumference : circumference;

  return (
    <div className="focus-session-container">
      <div className="session-type-selector">
        <button
          className={`session-type-button ${sessionType === 'focus' ? 'active' : ''}`}
          // Use toggleSessionType with explicit type
          onClick={() => toggleSessionType('focus')}
          disabled={running} // Disable changing type while timer is running
        >
          Focus
        </button>
        <button
          className={`session-type-button ${sessionType === 'break' ? 'active' : ''}`}
          // Use toggleSessionType with explicit type
          onClick={() => toggleSessionType('break')}
          disabled={running} // Disable changing type while timer is running
        >
          Break
        </button>
      </div>

      <div className="session-info">
        <span className="session-label">Current: {sessionType === 'focus' ? `Focus Session ${sessionCount}` : 'Break'}</span>
      </div>

      <div className="timer-display-wrapper">
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          className="timer-svg"
        >
          <circle
            className="timer-circle-background"
            r={radius}
            cx="100"
            cy="100"
          />
          <circle
            className={`timer-circle-progress ${sessionType === 'focus' ? 'focus-color' : 'break-color'}`}
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
        <p className="timer-slogan">{sessionType === 'focus' ? 'Stay focused!' : 'Time to recharge!'}</p>
      </div>

      <div className="timer-controls">
        <button
          onClick={handleStartStop}
          className={`timer-button ${running ? 'stop-button' : 'start-button'}`}
        >
          {running ? "Stop" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="timer-button reset-button"
        >
          Reset
        </button>
      </div>
    </div>
  );
}