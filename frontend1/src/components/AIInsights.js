// src/components/AIInsightsPage.js
import React, { useEffect, useState } from "react";
import { auth } from "../firebase"; // Import auth from your existing firebase.js
import { db } from "../firebase";    // Import db from your existing firebase.js
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import './AIInsightsPage.css'; // Dedicated CSS for AIInsightsPage

const AIInsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true); // Set initial loading to true
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Local state to store user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If user is logged in, fetch insights
        fetchAIInsights(currentUser.uid);
      } else {
        // If no user, stop loading and clear insights
        setInsights(null);
        setLoading(false);
        setError("Please log in to view AI insights.");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []); // Run only once on component mount

  const fetchAIInsights = async (uid) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Get sessions from Firestore
      const sessionsSnap = await getDocs(collection(db, "users", uid, "sessions"));
      const sessions = sessionsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })); // Include ID if needed, and spread data

      // If no sessions, provide a message and stop
      if (sessions.length === 0) {
        setInsights({ message: "No study sessions logged yet. Start a session to generate insights!" });
        setLoading(false);
        return;
      }

      // 2. Call backend AI endpoint
      const response = await axios.post("http://localhost:4000/api/ai-insights", { sessions });
      setInsights(response.data);
    } catch (err) {
      console.error("Error fetching AI insights:", err);
      setError("Failed to fetch AI insights. Please try again later.");
      setInsights(null); // Clear insights on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="ai-insights-container">
      <p className="loading-message">⏳ Analyzing your study data...</p>
    </div>
  );

  if (error) return (
    <div className="ai-insights-container">
      <p className="error-message">⚠️ {error}</p>
    </div>
  );

  // If there's a message from the backend (e.g., no sessions)
  if (insights && insights.message) return (
    <div className="ai-insights-container">
      <p className="no-insights-message">{insights.message}</p>
      <p className="no-insights-subtext">Start logging study sessions to see patterns 📚</p>
    </div>
  );

  if (!insights)
    return (
      <div className="ai-insights-container">
        <p className="no-insights-message">No AI insights available yet. Something went wrong.</p>
        <p className="no-insights-subtext">Please try refreshing or logging new sessions. 🤷‍♀️</p>
      </div>
    );

  return (
    <div className="ai-insights-container">
      <h1 className="insights-header">🧠 AI Insights</h1>

      <div className="insights-grid">
        {/* Card 1: Peak Focus Hours */}
        <div className="insights-card">
          <h2 className="insights-card-title">⏰ Peak Focus Hours</h2>
          <p className="insights-card-description">Your most productive hours are:</p>
          <ul className="insights-list">
            {insights.peak_hours?.length > 0 ? (
              insights.peak_hours.map((h) => (
                <li key={h.hour}>
                  {h.hour}:00 — {h.hour + 1}:00 ({h.minutes} min)
                </li>
              ))
            ) : (
              <li>No distinct peak hours detected yet.</li>
            )}
          </ul>
        </div>

        {/* Card 2: Energy Pattern */}
        <div className="insights-card">
          <h2 className="insights-card-title">⚡ Energy Pattern</h2>
          <p className="insights-card-description">Typical focus span:</p>
          <p className="insights-value">
            {insights.energy?.median || 'N/A'} minutes
          </p>
          <p className="insights-sub-value">
            (Short sessions: {insights.energy?.q25 || 'N/A'} min, Long sessions: {insights.energy?.q75 || 'N/A'} min)
          </p>
          {insights.energy?.suggestion && (
            <p className="insights-suggestion">{insights.energy.suggestion}</p>
          )}
        </div>

        {/* Card 3: Break Suggestion */}
        <div className="insights-card">
          <h2 className="insights-card-title">☕ Break Suggestion</h2>
          <p className="insights-card-description">
            You should take a short break after{" "}
            <span className="insights-value-highlight">
              {insights.recommended_break_after_min || 25} minutes
            </span>{" "}
            of focused work.
          </p>
        </div>

        {/* Card 4: Study Summary */}
        <div className="insights-card">
          <h2 className="insights-card-title">📈 Productivity Summary</h2>
          <p className="insights-card-description">
            Your median focus is{" "}
            <span className="insights-value-highlight">
              {insights.median_focus_minutes || 40} minutes
            </span>
            . Keep improving your consistency during{" "}
            <span className="insights-value-highlight">
              peak hours
            </span>{" "}
            for maximum results!
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIInsightsPage;