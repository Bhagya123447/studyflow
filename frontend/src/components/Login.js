// src/components/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import './Login.css'; // Dedicated CSS for Login

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // Toggles between login and signup view
  const [message, setMessage] = useState(""); // Feedback message to user
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setMessage(""); // Clear previous messages
    try {
      if (isLogin) {
        // Attempt to log in existing user
        await signInWithEmailAndPassword(auth, email, password);
        setMessage("✅ Logged in successfully!");
        navigate("/"); // Navigate to dashboard or root after successful login
      } else {
        // Attempt to create a new user account
        await createUserWithEmailAndPassword(auth, email, password);
        setMessage("🎉 Account created successfully!");
        navigate("/"); // Navigate to dashboard or root after successful signup
      }
    } catch (error) {
      // Catch and display any Firebase authentication errors
      console.error("Authentication error:", error);
      setMessage("❌ " + error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-header">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button
            type="submit"
            className="login-button"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="login-toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="login-toggle-button"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;