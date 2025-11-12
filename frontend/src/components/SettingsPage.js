// src/components/SettingsPage.js
import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; // Import auth and db from your existing firebase.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged
import './SettingsPage.css'; // Dedicated CSS for SettingsPage

const SettingsPage = () => {
  const [user, setUser] = useState(null); // Local state to store user
  const [loading, setLoading] = useState(true); // Loading state for settings
  const [error, setError] = useState(null);   // Error state

  const [settings, setSettings] = useState({
    // Timer Settings
    focusDuration: 25,
    breakDuration: 5,
    autoStartBreaks: false,

    // Notifications
    enableNotifications: true,
    soundEffects: true,

    // Study Goals
    dailyStudyGoal: "2 hours",
    weeklyStudyGoal: "15 hours",

    // AI Preferences
    insightFrequency: "Daily",

    // This property needs to be managed globally for full effect, but we keep it for now.
    darkMode: false,
  });
  const [showSaveMessage, setShowSaveMessage] = useState(false); // For the "Settings saved" toast

  // Listen for authentication state changes and load settings
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadSettings(currentUser.uid);
      } else {
        // If no user, reset settings to defaults and stop loading
        setSettings({
          focusDuration: 25, breakDuration: 5, autoStartBreaks: false,
          enableNotifications: true, soundEffects: true,
          dailyStudyGoal: "2 hours", weeklyStudyGoal: "15 hours",
          insightFrequency: "Daily", darkMode: false,
        });
        setLoading(false);
        setError("Please log in to manage your settings.");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []); // Run only once on component mount

  // Function to load settings from Firestore
  const loadSettings = async (uid) => {
    setLoading(true);
    setError(null);
    try {
      const ref = doc(db, "users", uid, "preferences", "settings");
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setSettings(snap.data());
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      setError("Failed to load settings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes and save to Firestore
  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Update local state immediately for responsiveness
    setSettings((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Save to Firestore only if user is logged in
    if (user) {
      try {
        const ref = doc(db, "users", user.uid, "preferences", "settings");
        // Use the updated value for saving to ensure immediate consistency
        await setDoc(ref, { ...settings, [name]: newValue }, { merge: true });
        setShowSaveMessage(true);
        setTimeout(() => setShowSaveMessage(false), 3000); // Hide message after 3 seconds
      } catch (error) {
        console.error("Error saving settings:", error);
        // Optionally, set an error state to show an error message to the user
      }
    } else {
      console.warn("Attempted to save settings without a logged-in user.");
    }
  };

  // --- Conditional Renderings ---
  if (loading) {
    return (
      <div className="settings-page-container">
        <p className="loading-message">Loading your settings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="settings-page-container">
        <p className="error-message">⚠️ {error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="settings-page-container">
        <p className="no-user-message">Please log in to manage your study settings.</p>
      </div>
    );
  }

  return (
    <div className={`settings-page-container ${settings.darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="settings-card">
        <h1 className="settings-header">Settings</h1>
        <p className="settings-subheader">Customize your study experience</p>

        {/* Timer Settings */}
        <section className="settings-section">
          <h2 className="section-title">⏱️ Timer Settings</h2>
          <div className="grid-cols-2-gap">
            <div className="form-group">
              <label htmlFor="focusDuration" className="form-label">Focus Duration (minutes)</label>
              <input
                type="number"
                id="focusDuration"
                name="focusDuration"
                value={settings.focusDuration}
                onChange={handleChange}
                className="form-input"
                min="1"
              />
            </div>
            <div className="form-group">
              <label htmlFor="breakDuration" className="form-label">Break Duration (minutes)</label>
              <input
                type="number"
                id="breakDuration"
                name="breakDuration"
                value={settings.breakDuration}
                onChange={handleChange}
                className="form-input"
                min="1"
              />
            </div>
          </div>
          <div className="toggle-group">
            <label htmlFor="autoStartBreaks" className="toggle-label">Auto-start Breaks</label>
            <div className="toggle-control-wrapper">
              <span className="toggle-description">Automatically start break timer when focus session ends</span>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id="autoStartBreaks"
                  name="autoStartBreaks"
                  checked={settings.autoStartBreaks}
                  onChange={handleChange}
                  className="toggle-input"
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="settings-section">
          <h2 className="section-title">🔔 Notifications</h2>
          <div className="space-y-4">
            <div className="toggle-group">
              <label htmlFor="enableNotifications" className="toggle-label">Enable Notifications</label>
              <div className="toggle-control-wrapper">
                <span className="toggle-description">Receive reminders and study alerts</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="enableNotifications"
                    name="enableNotifications"
                    checked={settings.enableNotifications}
                    onChange={handleChange}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
            <div className="toggle-group">
              <label htmlFor="soundEffects" className="toggle-label">Sound Effects</label>
              <div className="toggle-control-wrapper">
                <span className="toggle-description">Play sounds when timer completes</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    id="soundEffects"
                    name="soundEffects"
                    checked={settings.soundEffects}
                    onChange={handleChange}
                    className="toggle-input"
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Study Goals */}
        <section className="settings-section">
          <h2 className="section-title">🎯 Study Goals</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label htmlFor="dailyStudyGoal" className="form-label">Daily Study Goal (hours)</label>
              <select
                id="dailyStudyGoal"
                name="dailyStudyGoal"
                value={settings.dailyStudyGoal}
                onChange={handleChange}
                className="form-select"
              >
                <option value="1 hour">1 hour</option>
                <option value="2 hours">2 hours</option>
                <option value="3 hours">3 hours</option>
                <option value="4 hours">4 hours</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="weeklyStudyGoal" className="form-label">Weekly Study Goal (hours)</label>
              <select
                id="weeklyStudyGoal"
                name="weeklyStudyGoal"
                value={settings.weeklyStudyGoal}
                onChange={handleChange}
                className="form-select"
              >
                <option value="5 hours">5 hours</option>
                <option value="10 hours">10 hours</option>
                <option value="15 hours">15 hours</option>
                <option value="20 hours">20 hours</option>
                <option value="25 hours">25 hours</option>
              </select>
            </div>
          </div>
        </section>

        {/* AI Preferences */}
        <section className="settings-section">
          <h2 className="section-title">🤖 AI Preferences</h2>
          <div className="form-group">
            <label htmlFor="insightFrequency" className="form-label">Insight Frequency</label>
            <select
              id="insightFrequency"
              name="insightFrequency"
              value={settings.insightFrequency}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Real-time">Real-time</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
            </select>
          </div>
        </section>

        {/* Save message / Toast */}
        {showSaveMessage && (
          <div className="save-message-toast">
            Settings saved <span className="save-message-text">Your preferences have been updated successfully.</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;