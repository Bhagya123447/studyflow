// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Layout from './components/Layout'; // Import the new Layout component
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import CalendarPage from './components/CalendarPage';
import TasksPage from './components/TasksPage';
import StatsPage from './components/StatsPage';
import AllInsights from './components/AIInsights';
import SettingsPage from './components/SettingsPage';
import PrivateRoute from './components/PrivateRoute';

import './App.css'; // Your main app CSS

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2em', color: '#666' }}>
        Loading application...
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/" replace /> : <Login />}
          />

          {/* Protected Routes wrapped within the Layout */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout> {/* Use Layout here */}
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <PrivateRoute>
                <Layout>
                  <CalendarPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <Layout>
                  <TasksPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <PrivateRoute>
                <Layout>
                  <StatsPage />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <PrivateRoute>
                <Layout>
                  <AllInsights />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Layout>
                  <SettingsPage />
                </Layout>
              </PrivateRoute>
            }
          />

          <Route path="*" element={user ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;