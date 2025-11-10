// Inside Sidebar.jsx
import React from 'react';
// ... other imports if any
import './Dashboard.css'; // Or a dedicated Sidebar.css

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-header">StudyFlow</div>
            <nav className="sidebar-nav">
                <ul>
                    <li><a href="#" className="active"><span className="icon">🏠</span>Dashboard</a></li>
                    <li><a href="/calendar"><span className="icon">🗓️</span>Calendar</a></li>
                    <li><a href="/tasks"><span className="icon">✅</span>Tasks</a></li>
                    <li><a href="/stats"><span className="icon">📊</span>Statistics</a></li>
                    <li><a href="/insights"><span className="icon">🧠</span>AI Insights</a></li>
                    <li><a href="/settings"><span className="icon">⚙️</span>Settings</a></li>
                </ul>
            </nav>
            <div className="sidebar-footer">AI-Powered Study Assistant</div>
        </div>
    );
}