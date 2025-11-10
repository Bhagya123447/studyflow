import React from "react";
import FocusSession from "./FocusSession";
import TodayTasks from "./TodayTasks";
import AIBlocks from "./AIBlocks";
import Sidebar from "./Sidebar";
import './Dashboard.css'; // Import the CSS file

export default function Dashboard(){
  return (
    <div className="dashboard-container"> {/* Main container for flex layout */}
      <Sidebar />
      <div className="dashboard-content"> {/* Main content area */}
        <div className="top-right-controls">
          {/* Theme/Profile Icon - Placeholder for top right */}
          <span className="theme-toggle-icon" role="img" aria-label="moon">🌙</span> {/* Example icon */}
        </div>

        <h1 className="welcome-header">Welcome back!</h1>
        <p className="welcome-subheader">Here's your study progress for today</p>

        <div className="metrics-grid">
          {/* Study Time Today */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Time Today</h3>
              <span className="metric-icon">🕒</span> {/* Placeholder icon */}
            </div>
            <div className="metric-value">2.5h</div>
            <p className="metric-change positive">↑ 12%</p>
          </div>

          {/* Focus Score */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Focus Score</h3>
              <span className="metric-icon">🎯</span> {/* Placeholder icon */}
            </div>
            <div className="metric-value">85</div>
            <p className="metric-change positive">↑ 5%</p>
          </div>

          {/* Tasks Completed */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Tasks Completed</h3>
              <span className="metric-icon">📈</span> {/* Placeholder icon */}
            </div>
            <div className="metric-value">5</div>
            <p className="metric-change positive">↑ 20%</p>
          </div>

          {/* Study Streak */}
          <div className="metric-card">
            <div className="metric-header">
              <h3 className="metric-title">Study Streak</h3>
              <span className="metric-icon">🔥</span> {/* Placeholder icon */}
            </div>
            <div className="metric-value">7 days</div>
            <p className="metric-change">&nbsp;</p> {/* Empty space to align with others */}
          </div>
        </div>

        <div className="focus-session-section">
            <FocusSession />
        </div>

        <TodayTasks />

        <h2 className="section-title">AI Insights</h2>
        <AIBlocks />
      </div>
    </div>
  );
}