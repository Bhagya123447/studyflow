// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar'; // Import your Sidebar component
import './Layout.css'; // Create this CSS for basic layout structure

const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-content">
        {children} {/* This will render the content of the current route (Dashboard, TasksPage, etc.) */}
      </main>
    </div>
  );
};

export default Layout;