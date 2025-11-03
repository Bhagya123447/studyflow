import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import axios from "axios";

const AIInsightsPage = () => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // get sessions from Firestore
        const sessionsSnap = await getDocs(collection(db, "users", user.uid, "sessions"));
        const sessions = sessionsSnap.docs.map((doc) => doc.data());

        // call backend AI endpoint
        const response = await axios.post("http://localhost:4000/api/ai-insights", { sessions });
        setInsights(response.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchAIInsights();
  }, [user]);

  if (loading) return <p className="p-8 text-gray-600">⏳ Analyzing your study data...</p>;

  if (!insights)
    return (
      <div className="p-8 text-gray-600">
        <p>No AI insights available yet. Start logging study sessions to see patterns 📚</p>
      </div>
    );

  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">🧠 AI Insights</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card 1: Peak Focus Hours */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-2">⏰ Peak Focus Hours</h2>
          <p className="text-gray-600 mb-2">Your most productive hours are:</p>
          <ul className="text-indigo-600 font-medium">
            {insights.peak_hours?.map((h) => (
              <li key={h.hour}>
                {h.hour}:00 — {h.hour + 1}:00 ({h.minutes} min)
              </li>
            ))}
          </ul>
        </div>

        {/* Card 2: Energy Pattern */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-2">⚡ Energy Pattern</h2>
          <p className="text-gray-600 mb-2">Typical focus span:</p>
          <p className="text-lg font-semibold text-green-600">
            {insights.energy?.median} minutes
          </p>
          <p className="text-sm text-gray-500">
            (Short sessions: {insights.energy?.q25} min, Long sessions: {insights.energy?.q75} min)
          </p>
        </div>

        {/* Card 3: Break Suggestion */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-2">☕ Break Suggestion</h2>
          <p className="text-gray-600">
            You should take a short break after{" "}
            <span className="text-indigo-600 font-semibold">
              {insights.recommended_break_after_min || 25} minutes
            </span>{" "}
            of focused work.
          </p>
        </div>

        {/* Card 4: Study Summary */}
        <div className="bg-white shadow-md rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-2">📈 Productivity Summary</h2>
          <p className="text-gray-600">
            Your median focus is{" "}
            <span className="font-semibold text-green-600">
              {insights.median_focus_minutes || 40} minutes
            </span>
            . Keep improving your consistency during{" "}
            <span className="font-semibold text-indigo-600">
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
