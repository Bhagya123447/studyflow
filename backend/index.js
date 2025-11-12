const express = require("express");
const admin = require("firebase-admin");
const axios = require("axios");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json());

// ✅ Initialize Firebase
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// ✅ Root test route
app.get("/", (req, res) => {
  res.send("Backend running successfully 🚀");
});


// =====================================
// 🔹 1. USER SESSIONS (Firebase CRUD)
// =====================================

// Get all sessions for a user
app.get("/api/user/:uid/sessions", async (req, res) => {
  try {
    const uid = req.params.uid;
    const snapshot = await db.collection("users").doc(uid).collection("sessions").get();
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new study session
app.post("/api/user/:uid/sessions", async (req, res) => {
  try {
    const uid = req.params.uid;
    const newSession = req.body;
    const docRef = await db.collection("users").doc(uid).collection("sessions").add(newSession);
    res.json({ id: docRef.id, ...newSession });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/api/user/:uid/sessions/:sessionId", async (req, res) => {
  try {
    const { uid, sessionId } = req.params;
    await db.collection("users").doc(uid).collection("sessions").doc(sessionId).delete();
    res.json({ success: true, id: sessionId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =====================================
// 🔹 2. TASKS (Firebase CRUD)
// =====================================

// Get all tasks
app.get("/api/user/:uid/tasks", async (req, res) => {
  try {
    const uid = req.params.uid;
    const snapshot = await db.collection("users").doc(uid).collection("tasks").get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add a task
app.post("/api/user/:uid/tasks", async (req, res) => {
  try {
    const uid = req.params.uid;
    const newTask = req.body;
    const docRef = await db.collection("users").doc(uid).collection("tasks").add(newTask);
    res.json({ id: docRef.id, ...newTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
app.put("/api/user/:uid/tasks/:taskId", async (req, res) => {
  try {
    const { uid, taskId } = req.params;
    const updatedData = req.body;
    await db.collection("users").doc(uid).collection("tasks").doc(taskId).update(updatedData);
    res.json({ id: taskId, ...updatedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a task
app.delete("/api/user/:uid/tasks/:taskId", async (req, res) => {
  try {
    const { uid, taskId } = req.params;
    await db.collection("users").doc(uid).collection("tasks").doc(taskId).delete();
    res.json({ success: true, id: taskId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// =====================================
// 🔹 3. AI SERVICE INTEGRATION (Flask)
// =====================================

// Base URL of your Flask AI service
const AI_BASE_URL = "http://localhost:5000";

// Predict peak hours
app.post("/api/ai/peak-hours", async (req, res) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/predict_peak_hours`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("AI peak-hours error:", err.message);
    res.status(500).json({ error: "AI service error (peak hours)" });
  }
});

// Analyze energy pattern
app.post("/api/ai/energy-pattern", async (req, res) => {
  try {
    const response = await axios.post(`${AI_BASE_URL}/energy_pattern`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error("AI energy-pattern error:", err.message);
    res.status(500).json({ error: "AI service error (energy pattern)" });
  }
});

// ✅ Test AI connection route
app.get('/api/test-ai', async (req, res) => {
  try {
    // Call Flask server (AI service)
    const response = await axios.get('http://localhost:5000/');
    res.json({
      message: 'Connected to Flask AI service successfully 🚀',
      ai_service_response: response.data
    });
  } catch (error) {
    console.error('AI service connection error:', error.message);
    res.status(500).json({
      message: 'Failed to connect to Flask AI service ❌',
      error: error.message
    });
  }
});

// ------------------------------
// 🔹 Analyze user sessions with Flask AI
// ------------------------------
app.get('/api/user/:uid/analyze-sessions', async (req, res) => {
  try {
    const uid = req.params.uid;

    // Fetch sessions from Firestore
    const snapshot = await db.collection('users').doc(uid).collection('sessions').get();
    const sessions = snapshot.docs.map(doc => doc.data());

    if (!sessions.length) {
      return res.json({ message: 'No session data found for this user' });
    }

    // Send sessions to Flask AI service for analysis
    const peakRes = await axios.post('http://localhost:5000/predict_peak_hours', { sessions });
    const energyRes = await axios.post('http://localhost:5000/energy_pattern', { sessions });

    res.json({
      message: 'AI insights generated successfully 🚀',
      peak_hours: peakRes.data,
      energy_pattern: energyRes.data
    });

  } catch (error) {
    console.error('AI Analysis Error:', error.message);
    res.status(500).json({
      message: 'Failed to generate AI insights ❌',
      error: error.message
    });
  }
});

app.post('/api/ai-insights', async (req, res) => {
  try {
    const { sessions } = req.body;
    if (!sessions || sessions.length === 0) {
      return res.json({ message: "No session data" });
    }

    // Call Flask AI Service
    const aiResponse = await axios.post('http://localhost:5000/predict_peak_hours', { sessions });
    const energyResponse = await axios.post('http://localhost:5000/energy_pattern', { sessions });

    res.json({
      peak_hours: aiResponse.data.peak_hours,
      median_focus_minutes: aiResponse.data.median_focus_minutes,
      recommended_break_after_min: aiResponse.data.recommended_break_after_min,
      energy: energyResponse.data,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "AI service failed" });
  }
});


// =====================================
// 🔹 4. SERVER START
// =====================================

app.listen(PORT, () => console.log(`🚀 Backend running on http://localhost:${PORT}`));
