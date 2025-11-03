import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SettingsPage = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [settings, setSettings] = useState({
    focusDuration: 50,
    breakDuration: 10,
    enableAIInsights: true,
    darkMode: false,
  });
  const [message, setMessage] = useState("");

  // Load settings from Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      try {
        const ref = doc(db, "users", user.uid, "preferences", "settings");
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSettings(snap.data());
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();
  }, [user]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : Number(value),
    }));
  };

  // Save settings to Firestore
  const handleSave = async () => {
    if (!user) return;
    try {
      const ref = doc(db, "users", user.uid, "preferences", "settings");
      await setDoc(ref, settings);
      setMessage("✅ Settings saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("❌ Failed to save settings");
    }
  };

  return (
    <div className={`min-h-screen p-8 transition ${settings.darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"}`}>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-semibold mb-4">⚙️ Settings</h1>
        <p className="text-gray-500 mb-8">Customize your study preferences and AI insights.</p>

        <div className="space-y-6">
          {/* Focus Duration */}
          <div>
            <label className="block mb-2 font-medium">⏱️ Focus Duration (minutes)</label>
            <input
              type="number"
              name="focusDuration"
              value={settings.focusDuration}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400"
              min="10"
              max="120"
            />
          </div>

          {/* Break Duration */}
          <div>
            <label className="block mb-2 font-medium">☕ Break Duration (minutes)</label>
            <input
              type="number"
              name="breakDuration"
              value={settings.breakDuration}
              onChange={handleChange}
              className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-indigo-400"
              min="5"
              max="60"
            />
          </div>

          {/* Enable AI Insights */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="enableAIInsights"
              checked={settings.enableAIInsights}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-500"
            />
            <label className="font-medium">Enable AI Insights</label>
          </div>

          {/* Dark Mode */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="darkMode"
              checked={settings.darkMode}
              onChange={handleChange}
              className="w-5 h-5 accent-indigo-500"
            />
            <label className="font-medium">Dark Mode</label>
          </div>

          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg mt-6"
          >
            Save Settings
          </button>

          {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
