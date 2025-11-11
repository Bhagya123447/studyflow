// src/components/Sidebar.js (Placeholder - replace with your actual Sidebar)
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Home, Calendar, List, BarChart2, Lightbulb, Settings, LogOut } from 'lucide-react'; // Example icons

const Sidebar = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-header">
        <h2 className="sidebar-logo">StudyMate</h2>
      </div>
      <nav className="sidebar-nav">
        <NavLink to="/" className="sidebar-nav-item" activeclassname="active">
          <Home className="sidebar-icon" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/calendar" className="sidebar-nav-item" activeclassname="active">
          <Calendar className="sidebar-icon" />
          <span>Calendar</span>
        </NavLink>
        <NavLink to="/tasks" className="sidebar-nav-item" activeclassname="active">
          <List className="sidebar-icon" />
          <span>Tasks</span>
        </NavLink>
        <NavLink to="/stats" className="sidebar-nav-item" activeclassname="active">
          <BarChart2 className="sidebar-icon" />
          <span>Statistics</span>
        </NavLink>
        <NavLink to="/insights" className="sidebar-nav-item" activeclassname="active">
          <Lightbulb className="sidebar-icon" />
          <span>AI Insights</span>
        </NavLink>
        <NavLink to="/settings" className="sidebar-nav-item" activeclassname="active">
          <Settings className="sidebar-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-logout-button">
          <LogOut className="sidebar-icon" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;