// src/components/StatsPage.js
import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { auth, db } from "../firebase"; // Import auth and db from your firebase.js
import { collection, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import './StatsPages.css'; // Dedicated CSS for StatsPage

const StatsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Local state to store user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setLoading(true);
        setError(null);
        // Fetch sessions and tasks only if user is logged in
        const unsub1 = onSnapshot(collection(db, "users", currentUser.uid, "sessions"), (snapshot) => {
          setSessions(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false); // Data loaded for sessions
        }, (err) => {
          console.error("Error fetching sessions:", err);
          setError("Failed to load study sessions.");
          setLoading(false);
        });

        const unsub2 = onSnapshot(collection(db, "users", currentUser.uid, "tasks"), (snapshot) => {
          setTasks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false); // Data loaded for tasks
        }, (err) => {
          console.error("Error fetching tasks:", err);
          setError("Failed to load tasks.");
          setLoading(false);
        });

        return () => {
          unsub1();
          unsub2();
        }; // Cleanup snapshot listeners
      } else {
        // No user logged in
        setSessions([]);
        setTasks([]);
        setLoading(false);
        setError("Please log in to view your study statistics.");
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []); // Run only once on component mount

  // --- Data Processing for Charts ---
  // Using useMemo to re-calculate chart data only when sessions or tasks change
  const chartData = React.useMemo(() => {
    // Process data for charts
    const weeklyFocus = sessions.reduce((acc, s) => {
      const date = new Date(s.date || s.startTime).toLocaleDateString("en-US", { weekday: "short" });
      const time = parseInt(s.focusedMinutes || s.duration || 0, 10); // Ensure parsing to integer
      acc[date] = (acc[date] || 0) + time;
      return acc;
    }, {});

    const weeklyTasks = tasks.reduce((acc, t) => {
      const date = t.date ? new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }) : "N/A";
      const done = t.status && t.status.toLowerCase() === "completed" ? 1 : 0; // Case-insensitive check
      acc[date] = (acc[date] || 0) + done;
      return acc;
    }, {});

    // Ensure all days are present, even if no data, to avoid sparse charts
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return daysOfWeek.map((day) => ({
      day,
      focusTime: weeklyFocus[day] || 0,
      tasksDone: weeklyTasks[day] || 0,
    }));
  }, [sessions, tasks]); // Recalculate if sessions or tasks change

  const subjectChart = React.useMemo(() => {
    const subjectData = tasks.reduce((acc, t) => {
      // Assuming 'title' for subject. You might have a dedicated 'subject' field.
      const subj = t.subject || (t.title ? t.title.split(" ")[0] : "Other");
      const dur = parseInt(t.duration || 0, 10); // Ensure parsing to integer
      acc[subj] = (acc[subj] || 0) + dur;
      return acc;
    }, {});
    return Object.keys(subjectData).map((key) => ({
      subject: key,
      minutes: subjectData[key],
    }));
  }, [tasks]); // Recalculate if tasks change


  // --- Conditional Rendering ---
  if (loading) return (
    <div className="stats-page-container">
      <p className="loading-message">📊 Loading your study statistics...</p>
    </div>
  );

  if (error) return (
    <div className="stats-page-container">
      <p className="error-message">⚠️ {error}</p>
    </div>
  );

  if (!user) return (
    <div className="stats-page-container">
      <p className="no-stats-message">Please log in to view your study statistics.</p>
    </div>
  );

  if (sessions.length === 0 && tasks.length === 0) return (
    <div className="stats-page-container">
      <p className="no-stats-message">No study sessions or tasks logged yet. Start working to see your progress! 🚀</p>
    </div>
  );


  // --- Main Render ---
 // --- Main Render ---
return (
  <div className="stats-page-container">
    <h1 className="stats-header">📈 Study Analytics</h1>
    <p className="stats-subtext">Track your focus trends, task completion, and subject performance.</p>

    <div className="stats-row">
      {/* Focus Time Chart */}
      <div className="stats-card full">
        <h2 className="stats-card-title">🕓 Focus Time (per day)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="focusTime" fill="#6366F1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tasks Completed */}
      <div className="stats-card full">
        <h2 className="stats-card-title">✅ Tasks Completed (per day)</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="tasksDone"
              stroke="#10B981"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Subject Chart */}
    <div className="stats-card full">
      <h2 className="stats-card-title">📚 Time Spent by Subject</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={subjectChart}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="subject" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="minutes" fill="#F59E0B" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);
};
export default StatsPage;