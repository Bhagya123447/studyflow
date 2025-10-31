import React from "react";
import { Link } from "react-router-dom";
export default function Sidebar(){
  return (
    <div style={{width:160, borderRight:"1px solid #eee", padding:10}}>
      <h2>StudyFlow</h2>
      <nav>
        <ul style={{listStyle:"none", padding:0}}>
          <li><Link to="/">Dashboard</Link></li>
          <li><Link to="/calendar">Calendar</Link></li>
          <li><Link to="/tasks">Tasks</Link></li>
          <li><Link to="/stats">Statistics</Link></li>
          <li><Link to="/insights">AI Insights</Link></li>
          <li><Link to="/settings">Settings</Link></li>
        </ul>
      </nav>
    </div>
  );
}
