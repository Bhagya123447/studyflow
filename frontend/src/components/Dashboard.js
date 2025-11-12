// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import FocusSession from "./FocusSession";
import TodayTasks from "./TodayTasks";
import AIBlocks from "./AIBlocks";
import './Dashboard.css';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard metrics
  const [studyTimeToday, setStudyTimeToday] = useState('0h');
  const [focusScore, setFocusScore] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [studyStreak, setStudyStreak] = useState('0 days');

  // AI insights
  const [aiPeakHours, setAiPeakHours] = useState([]);
  const [aiEnergyPattern, setAiEnergyPattern] = useState({});
  const [recommendedBreak, setRecommendedBreak] = useState(25);

  // User settings (fetched from Firestore)
  const [userSettings, setUserSettings] = useState({
    focusDuration: 25,
    breakDuration: 5,
    autoStartBreaks: false,
  });

  // Listen for authentication changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchDashboardData(currentUser.uid);
        loadUserSettings(currentUser.uid); // 👈 Fetch settings here
      } else {
        resetDashboard();
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Reset dashboard states when user logs out
  const resetDashboard = () => {
    setStudyTimeToday('0h');
    setFocusScore(0);
    setTasksCompleted(0);
    setStudyStreak('0 days');
    setAiPeakHours([]);
    setAiEnergyPattern({});
    setRecommendedBreak(25);
  };

  // Load user settings from Firestore
  const loadUserSettings = async (uid) => {
    try {
      const ref = doc(db, "users", uid, "preferences", "settings");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setUserSettings((prev) => ({
          ...prev,
          ...snap.data(),
        }));
      }
    } catch (err) {
      console.error("Error loading user settings:", err);
    }
  };

  // Fetch dashboard data
  const fetchDashboardData = async (uid) => {
    try {
      setLoading(true);
      setError(null);

      const sessionsResponse = await fetch(`/api/user/${uid}/sessions`);
      if (!sessionsResponse.ok)
        throw new Error(`Failed to fetch sessions (${sessionsResponse.status})`);
      const sessions = await sessionsResponse.json();

      const tasksResponse = await fetch(`/api/user/${uid}/tasks`);
      if (!tasksResponse.ok)
        throw new Error(`Failed to fetch tasks (${tasksResponse.status})`);
      const tasks = await tasksResponse.json();

      // Study time today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let totalMinutesToday = 0;
      sessions.forEach((session) => {
        const sessionStartTime = new Date(session.startTime);
        if (sessionStartTime >= today) {
          totalMinutesToday += session.focusedMinutes || 0;
        }
      });
      setStudyTimeToday(`${(totalMinutesToday / 60).toFixed(1)}h`);

      // Tasks completed
      const completedTasksCount = tasks.filter(
        (task) => task.status === "completed"
      ).length;
      setTasksCompleted(completedTasksCount);

      // Study streak
      const uniqueDaysWithSessions = new Set(
        sessions.map((s) => new Date(s.startTime).toDateString())
      ).size;
      setStudyStreak(`${uniqueDaysWithSessions || 0} days`);

      // AI insights
      const aiInsightsResponse = await fetch(`/api/ai-insights`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessions }),
      });

      if (!aiInsightsResponse.ok)
        throw new Error(`Failed to fetch AI insights (${aiInsightsResponse.status})`);
      const aiData = await aiInsightsResponse.json();

      setAiPeakHours(aiData.peak_hours || []);
      setAiEnergyPattern(aiData.energy || {});
      setRecommendedBreak(aiData.recommended_break_after_min || 25);

      const derivedFocusScore = aiData.median_focus_minutes
        ? Math.min(100, Math.max(0, Math.round(aiData.median_focus_minutes * 1.5)))
        : 0;
      setFocusScore(derivedFocusScore);

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="welcome-header">Loading your study progress...</h1>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="welcome-header">Error loading dashboard</h1>
          <p>{error}</p>
          <p>Ensure your backend (Node & Flask) services are running.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-content">
          <h1 className="welcome-header">
            Please log in to see your personalized dashboard.
          </h1>
        </div>
      </div>
    );
  }

  // --- Main Dashboard Render ---
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="top-right-controls">
          <span className="theme-toggle-icon" role="img" aria-label="moon">
            🌙
          </span>
        </div>

        <h1 className="welcome-header">
          Welcome back, Bhagya!
        </h1>
        <p className="welcome-subheader">Here's your study progress for today</p>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Time Today</h3>
              <span className="metric-icon">🕒</span>
            </div>
            <div className="metric-value">{studyTimeToday}</div>
            <p className="metric-change positive">↑ 12%</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Focus Score</h3>
              <span className="metric-icon">🎯</span>
            </div>
            <div className="metric-value">{focusScore}</div>
            <p className="metric-change positive">↑ 5%</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Tasks Completed</h3>
              <span className="metric-icon">📈</span>
            </div>
            <div className="metric-value">{tasksCompleted}</div>
            <p className="metric-change positive">↑ 20%</p>
          </div>

          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Streak</h3>
              <span className="metric-icon">🔥</span>
            </div>
            <div className="metric-value">{studyStreak}</div>
            <p className="metric-change">&nbsp;</p>
          </div>
        </div>

        {/* Focus Session — uses Firestore settings */}
        <div className="focus-session-section">
          <FocusSession
            uid={user.uid}
            recommendedBreak={recommendedBreak}
            focusDuration={userSettings.focusDuration}
            breakDuration={userSettings.breakDuration}
            autoStartBreaks={userSettings.autoStartBreaks}
          />
        </div>

        <TodayTasks uid={user.uid} />

        <h2 className="section-title">AI Insights</h2>
        <AIBlocks
          peakHours={aiPeakHours}
          energyPattern={aiEnergyPattern}
          recommendedBreak={recommendedBreak}
        />
      </div>
    </div>
  );
}
