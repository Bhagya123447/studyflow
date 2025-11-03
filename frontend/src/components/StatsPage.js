import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

const StatsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [tasks, setTasks] = useState([]);
  const auth = getAuth();
  const user = auth.currentUser;

  // Fetch user sessions and tasks
  useEffect(() => {
    if (!user) return;
    const unsub1 = onSnapshot(collection(db, "users", user.uid, "sessions"), (snapshot) => {
      setSessions(snapshot.docs.map((doc) => doc.data()));
    });
    const unsub2 = onSnapshot(collection(db, "users", user.uid, "tasks"), (snapshot) => {
      setTasks(snapshot.docs.map((doc) => doc.data()));
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  // Process data for charts
  const weeklyFocus = sessions.reduce((acc, s) => {
    const date = new Date(s.date || s.startTime).toLocaleDateString("en-US", { weekday: "short" });
    const time = s.focusedMinutes || s.duration || 0;
    acc[date] = (acc[date] || 0) + time;
    return acc;
  }, {});

  const weeklyTasks = tasks.reduce((acc, t) => {
    const date = t.date ? new Date(t.date).toLocaleDateString("en-US", { weekday: "short" }) : "N/A";
    const done = t.status === "Completed" ? 1 : 0;
    acc[date] = (acc[date] || 0) + done;
    return acc;
  }, {});

  const chartData = Object.keys(weeklyFocus).map((day) => ({
    day,
    focusTime: weeklyFocus[day],
    tasksDone: weeklyTasks[day] || 0,
  }));

  const subjectData = tasks.reduce((acc, t) => {
    const subj = t.title.split(" ")[0] || "Other";
    const dur = parseInt(t.duration || 0);
    acc[subj] = (acc[subj] || 0) + dur;
    return acc;
  }, {});
  const subjectChart = Object.keys(subjectData).map((key) => ({
    subject: key,
    minutes: subjectData[key],
  }));

  return (
    <div className="p-8 text-gray-800">
      <h1 className="text-3xl font-semibold mb-6">📊 Study Statistics</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Weekly Focus Time */}
        <div className="bg-white border rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-3">Focus Time per Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="focusTime" fill="#6366F1" name="Minutes Focused" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tasks Completed per Day */}
        <div className="bg-white border rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-3">Tasks Completed per Day</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tasksDone" stroke="#10B981" name="Completed Tasks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject vs Time */}
        <div className="md:col-span-2 bg-white border rounded-xl shadow-md p-4">
          <h2 className="text-xl font-semibold mb-3">Time Spent by Subject</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjectChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="subject" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="minutes" fill="#F59E0B" name="Minutes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
