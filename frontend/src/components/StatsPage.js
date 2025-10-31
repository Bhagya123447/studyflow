import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function StatsPage() {
  const data = [
    { day: "Mon", time: 2, focus: 80, subject: 1 },
    { day: "Tue", time: 3, focus: 88, subject: 2 },
    { day: "Wed", time: 1.5, focus: 70, subject: 1 },
    { day: "Thu", time: 2.2, focus: 76, subject: 3 },
    { day: "Fri", time: 2.8, focus: 90, subject: 2 },
    { day: "Sat", time: 4, focus: 95, subject: 3 },
    { day: "Sun", time: 0.5, focus: 60, subject: 1 },
  ];

  return (
    <div>
      <h1>Statistics</h1>

      <h3>Study Time (hrs)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="time" fill="#8884d8" name="Hours Studied" />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 30 }}>Focus Score</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="focus" fill="#82ca9d" name="Focus Score" />
        </BarChart>
      </ResponsiveContainer>

      <h3 style={{ marginTop: 30 }}>Subject Study Count</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="subject" fill="#ffc658" name="Subjects studied" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
