import React, { useState, useEffect } from "react"; // Import useState and useEffect
import FocusSession from "./FocusSession";
import TodayTasks from "./TodayTasks";
import AIBlocks from "./AIBlocks";
import Sidebar from "./Sidebar";
import './Dashboard.css';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null); // Stores the authenticated Firebase user object
  const [loading, setLoading] = useState(true); // Manages loading state for data fetching
  const [error, setError] = useState(null);   // Stores any error messages

  // State for core dashboard metrics
  const [studyTimeToday, setStudyTimeToday] = useState('0h');
  const [focusScore, setFocusScore] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [studyStreak, setStudyStreak] = useState('0 days');

  // State for AI Insights specific data
  const [aiPeakHours, setAiPeakHours] = useState([]);
  const [aiEnergyPattern, setAiEnergyPattern] = useState({});
  const [recommendedBreak, setRecommendedBreak] = useState(25); // Default break duration

  // useEffect hook to handle authentication state changes and initial data fetching
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Set the current user
      if (currentUser) {
        // If a user is logged in, fetch their dashboard data
        fetchDashboardData(currentUser.uid);
      } else {
        // If no user is logged in, reset states and stop loading
        setStudyTimeToday('0h');
        setFocusScore(0);
        setTasksCompleted(0);
        setStudyStreak('0 days');
        setAiPeakHours([]);
        setAiEnergyPattern({});
        setRecommendedBreak(25);
        setLoading(false); // No user, so no data to load, stop loading indicator
      }
    });

    // Cleanup function: unsubscribe from the auth listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs only once on mount and cleanup on unmount

  // Function to fetch all necessary dashboard data from the backend
  const fetchDashboardData = async (uid) => {
    try {
      setLoading(true); // Start loading
      setError(null);     // Clear any previous errors

      // --- 1. Fetch all user sessions ---
      // We need sessions to calculate study time and feed into AI
      const sessionsResponse = await fetch(`/api/user/${uid}/sessions`);
      if (!sessionsResponse.ok) {
        throw new Error(`HTTP error! status: ${sessionsResponse.status} - Failed to fetch sessions.`);
      }
      const sessions = await sessionsResponse.json();

      // --- 2. Fetch all user tasks ---
      const tasksResponse = await fetch(`/api/user/${uid}/tasks`);
      if (!tasksResponse.ok) {
        throw new Error(`HTTP error! status: ${tasksResponse.status} - Failed to fetch tasks.`);
      }
      const tasks = await tasksResponse.json();

      // --- 3. Calculate "Study Time Today" ---
      const today = new Date();
      // Set to start of day for comparison
      today.setHours(0, 0, 0, 0);
      let totalMinutesToday = 0;
      sessions.forEach(session => {
        const sessionStartTime = new Date(session.startTime); // Assuming session.startTime is a valid date string
        if (sessionStartTime >= today) {
          totalMinutesToday += session.focusedMinutes || 0;
        }
      });
      setStudyTimeToday(`${(totalMinutesToday / 60).toFixed(1)}h`);

      // --- 4. Calculate "Tasks Completed" ---
      const completedTasksCount = tasks.filter(task => task.status === 'completed').length;
      setTasksCompleted(completedTasksCount);

      // --- 5. Derive "Study Streak" (simplified for now, complex logic might be needed) ---
      // This would typically involve more complex logic checking consecutive days with sessions.
      // For now, let's just set a placeholder or derive from session count
      const uniqueDaysWithSessions = new Set(sessions.map(s => new Date(s.startTime).toDateString())).size;
      setStudyStreak(`${uniqueDaysWithSessions > 0 ? uniqueDaysWithSessions : 0} days`);


      // --- 6. Call AI Insights endpoint (Node.js backend forwards to Flask) ---
      const aiInsightsResponse = await fetch(`/api/ai-insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessions: sessions }), // Send all fetched sessions for AI analysis
      });

      if (!aiInsightsResponse.ok) {
        throw new Error(`HTTP error! status: ${aiInsightsResponse.status} - Failed to fetch AI insights.`);
      }
      const aiData = await aiInsightsResponse.json();
      console.log("AI Insights Data:", aiData); // Log AI data to see its structure

      setAiPeakHours(aiData.peak_hours || []);
      setAiEnergyPattern(aiData.energy || {});
      setRecommendedBreak(aiData.recommended_break_after_min || 25); // Update recommended break from AI

      // You can derive Focus Score from AI data (e.g., median focus minutes)
      // This is a rough example; you might have a more sophisticated algorithm
      const derivedFocusScore = aiData.median_focus_minutes ? Math.min(100, Math.max(0, Math.round(aiData.median_focus_minutes * 1.5))) : 0;
      setFocusScore(derivedFocusScore);


    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data. Please ensure backend services are running.");
    } finally {
      setLoading(false); // Stop loading regardless of success or failure
    }
  };

  // --- Conditional Rendering for Loading, Error, and Unauthenticated States ---
  if (loading) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="welcome-header">Loading your study progress...</h1>
          {/* You might add a spinning loader or skeleton UI here */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="welcome-header">Error loading dashboard:</h1>
          <p>{error}</p>
          <p>Please ensure your Node.js backend (on port 4000) and Flask AI service (on port 5000) are running correctly.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // If no user is authenticated, prompt them to log in or redirect
    return (
      <div className="dashboard-container">
        <Sidebar />
        <div className="dashboard-content">
          <h1 className="welcome-header">Please log in to see your personalized dashboard.</h1>
          {/* Optionally add a link/button to the login page */}
        </div>
      </div>
    );
  }

  // --- Main Dashboard Render (when data is loaded and user is authenticated) ---
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="dashboard-content">
        <div className="top-right-controls">
          {/* You might want to display user's profile picture or name here */}
          <span className="theme-toggle-icon" role="img" aria-label="moon">🌙</span>
        </div>

        <h1 className="welcome-header">Welcome back, {user.displayName || user.email}!</h1>
        <p className="welcome-subheader">Here's your study progress for today</p>

        <div className="metrics-grid">
          {/* Study Time Today */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Time Today</h3>
              <span className="metric-icon">🕒</span>
            </div>
            <div className="metric-value">{studyTimeToday}</div>
            <p className="metric-change positive">↑ 12%</p> {/* This 'change' would also be dynamic */}
          </div>

          {/* Focus Score */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Focus Score</h3>
              <span className="metric-icon">🎯</span>
            </div>
            <div className="metric-value">{focusScore}</div>
            <p className="metric-change positive">↑ 5%</p> {/* This 'change' would also be dynamic */}
          </div>

          {/* Tasks Completed */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Tasks Completed</h3>
              <span className="metric-icon">📈</span>
            </div>
            <div className="metric-value">{tasksCompleted}</div>
            <p className="metric-change positive">↑ 20%</p> {/* This 'change' would also be dynamic */}
          </div>

          {/* Study Streak */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Streak</h3>
              <span className="metric-icon">🔥</span>
            </div>
            <div className="metric-value">{studyStreak}</div>
            <p className="metric-change">&nbsp;</p>
          </div>
        </div>

        <div className="focus-session-section">
            {/* Pass the recommended break duration to FocusSession */}
            <FocusSession recommendedBreak={recommendedBreak} uid={user.uid} />
        </div>

        {/* Pass uid to TodayTasks so it can fetch tasks for the current user */}
        <TodayTasks uid={user.uid} />

        <h2 className="section-title">AI Insights</h2>
        {/* Pass AI insights data to the AIBlocks component */}
        <AIBlocks
          peakHours={aiPeakHours}
          energyPattern={aiEnergyPattern}
          recommendedBreak={recommendedBreak}
        />
      </div>
    </div>
  );
}