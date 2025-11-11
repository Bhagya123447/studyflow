// seed.js

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (same as in server.js)
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const USER_ID = "JNNuoPldpGYDdccLe31qsy2K0sq1"; // Use a distinct UID for demo purposes

async function seedData() {
  console.log("🚀 Starting data seeding for user:", USER_ID);

  // --- 1. Seed Tasks ---
  const tasks = [
    {
      title: "Complete Project Report",
      description: "Write introduction, methodology, results, and conclusion.",
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      completed: false,
      priority: "High",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Prepare Project Presentation",
      description: "Create slides and practice delivery.",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      completed: false,
      priority: "High",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Review Backend Code",
      description: "Check for bugs and optimize performance in Node.js server.",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      completed: false,
      priority: "Medium",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Study for Database Exam",
      description: "Go through SQL queries and normalization concepts.",
      dueDate: new Date("2023-11-15T10:00:00Z").toISOString(),
      completed: false,
      priority: "High",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Read 'Clean Code' Chapter 5",
      description: "Focus on formatting and meaningful names.",
      dueDate: new Date("2023-10-28T23:59:59Z").toISOString(),
      completed: false,
      priority: "Low",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Meeting with Project Group",
      description: "Discuss progress and next steps.",
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      completed: false,
      priority: "Medium",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    {
      title: "Research Frontend UI Libraries",
      description: "Look into React components for charts and calendars.",
      dueDate: new Date("2023-11-01T17:00:00Z").toISOString(),
      completed: false,
      priority: "Low",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    // Completed tasks
    {
      title: "Setup Firebase Project",
      description: "Create project, enable Firestore, get service account key.",
      dueDate: new Date("2023-10-10T00:00:00Z").toISOString(),
      completed: true,
      priority: "High",
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      completedAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000), // 18 days ago
    },
    {
      title: "Integrate Flask AI Service",
      description: "Connect Node.js backend to Python AI service.",
      dueDate: new Date("2023-10-20T00:00:00Z").toISOString(),
      completed: true,
      priority: "High",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    },
  ];

  for (const task of tasks) {
    await db.collection("users").doc(USER_ID).collection("tasks").add(task);
    console.log(`Added task: "${task.title}"`);
  }

  // --- 2. Seed Sessions ---
  // Generate a mix of sessions over the last few weeks/days
  const sessions = [];
  const now = new Date();

  // Helper to create a session object
  const createSession = (daysAgo, hour, minutes, duration, subject, notes = "") => {
    const startTime = new Date(now);
    startTime.setDate(now.getDate() - daysAgo);
    startTime.setHours(hour, minutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(startTime.getMinutes() + duration);

    sessions.push({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      focusedMinutes: duration,
      subject: subject,
      notes: notes,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  };

  // Past 7 days - more recent, varied times
  createSession(0, 9, 0, 30, "Algorithms", "Practiced sorting algorithms."); // Today morning
  createSession(0, 14, 30, 45, "React Hooks", "Learned about useEffect dependencies."); // Today afternoon
  createSession(1, 10, 0, 60, "Calculus", "Reviewed differentiation techniques."); // Yesterday morning
  createSession(1, 19, 0, 90, "Project Planning", "Outlined features for next sprint."); // Yesterday evening (longer session)
  createSession(2, 8, 45, 25, "Data Structures", "Studied linked lists."); // 2 days ago morning
  createSession(2, 13, 0, 50, "Operating Systems", "Read about process scheduling."); // 2 days ago afternoon
  createSession(3, 11, 15, 35, "Physics", "Solved kinematics problems."); // 3 days ago late morning
  createSession(3, 17, 0, 75, "Machine Learning", "Understood linear regression concepts."); // 3 days ago late afternoon
  createSession(4, 9, 30, 40, "Web Security", "Explored XSS prevention."); // 4 days ago morning
  createSession(4, 15, 0, 60, "Networking", "Reviewed TCP/IP model."); // 4 days ago afternoon
  createSession(5, 10, 0, 20, "Logic", "Worked on propositional logic."); // 5 days ago morning
  createSession(5, 18, 0, 100, "Node.js Backend", "Implemented user authentication flow."); // 5 days ago evening (long)
  createSession(6, 11, 0, 45, "Frontend UI", "Designed new components."); // 6 days ago morning
  createSession(6, 16, 0, 55, "Database Design", "Normalized schema for project."); // 6 days ago afternoon

  // Older sessions (past 2-3 weeks) - to ensure some historical data for AI
  createSession(8, 9, 30, 30, "Java Programming", "Practiced OOP concepts.");
  createSession(8, 14, 0, 60, "Cloud Computing", "Read about AWS services.");
  createSession(10, 10, 0, 40, "Linear Algebra", "Matrix operations.");
  createSession(10, 20, 0, 80, "Game Development", "Learned about Unity physics.");
  createSession(12, 11, 0, 25, "Photography", "Studied aperture settings.");
  createSession(14, 13, 0, 50, "Cybersecurity", "Learned about encryption.");
  createSession(15, 9, 0, 30, "Economics", "Supply and demand analysis.");
  createSession(16, 18, 0, 70, "English Literature", "Analyzed a poem.");
  createSession(18, 10, 0, 45, "Mobile App Dev", "Kotlin basics.");
  createSession(20, 15, 0, 60, "Marketing", "Digital marketing strategies.");

  for (const session of sessions) {
    await db.collection("users").doc(USER_ID).collection("sessions").add(session);
    console.log(`Added session: ${session.focusedMinutes} mins on ${session.subject}`);
  }

  console.log("✅ Data seeding complete!");
}

async function clearData() {
  console.log("🧹 Clearing existing data for user:", USER_ID);

  // Clear Tasks
  const tasksRef = db.collection("users").doc(USER_ID).collection("tasks");
  const taskSnapshot = await tasksRef.get();
  const taskBatch = db.batch();
  taskSnapshot.docs.forEach((doc) => {
    taskBatch.delete(doc.ref);
  });
  await taskBatch.commit();
  console.log(`Deleted ${taskSnapshot.size} tasks.`);

  // Clear Sessions
  const sessionsRef = db.collection("users").doc(USER_ID).collection("sessions");
  const sessionSnapshot = await sessionsRef.get();
  const sessionBatch = db.batch();
  sessionSnapshot.docs.forEach((doc) => {
    sessionBatch.delete(doc.ref);
  });
  await sessionBatch.commit();
  console.log(`Deleted ${sessionSnapshot.size} sessions.`);

  console.log("✅ Data clearing complete!");
}

// Command-line arguments to choose action
const action = process.argv[2]; // node seed.js <action>

if (action === "seed") {
  seedData().catch(console.error);
} else if (action === "clear") {
  clearData().catch(console.error);
} else {
  console.log("Usage: node seed.js [seed|clear]");
  console.log("  seed: Populates Firestore with sample data.");
  console.log("  clear: Deletes all sample data for the specified user.");
  process.exit(1);
}