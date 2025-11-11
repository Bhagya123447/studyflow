// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase'; // Import your Firebase auth instance
import { useAuthState } from 'react-firebase-hooks/auth'; // A useful hook for Firebase auth state

// Install react-firebase-hooks: npm install react-firebase-hooks

const PrivateRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth); // Use the hook to get auth state

  if (loading) {
    // Optionally render a loading spinner or skeleton
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading user...
      </div>
    );
  }

  // If there's no user, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If there's a user, render the children (the protected component)
  return children;
};

export default PrivateRoute;