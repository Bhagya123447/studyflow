// src/components/CalendarPage.js
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // For dateClick and eventClick
import { auth } from '../firebase'; // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth'; // To listen for auth state
import './CalendarPage.css'; // Dedicated CSS for CalendarPage

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // State to hold the current user

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchSessions(currentUser.uid);
      } else {
        setEvents([]); // Clear events if no user
        setLoading(false);
        setError("Please log in to view and manage your calendar.");
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Function to fetch sessions from the backend
  const fetchSessions = async (uid) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/user/${uid}/sessions`); // Use proxy for Node.js backend
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // Transform fetched sessions into FullCalendar event format
      // Assuming a session has: id, title (or subject), startTime, endTime, focusedMinutes
      const calendarEvents = data.map(session => ({
        id: session.id, // Firestore document ID is crucial for updating/deleting
        title: session.title || "Study Session", // Use a title if available, otherwise default
        start: session.startTime, // FullCalendar uses 'start' for event start time
        end: session.endTime,     // FullCalendar uses 'end' for event end time
        // You can add more properties like color, extendedProps etc.
        extendedProps: {
          focusedMinutes: session.focusedMinutes,
          // Add other session data if useful
        }
      }));
      setEvents(calendarEvents);
    } catch (err) {
      console.error("Error fetching sessions:", err);
      setError("Failed to load study sessions.");
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = async (info) => {
    if (!user) {
      alert("Please log in to add study sessions.");
      return;
    }

    const title = prompt("Enter title for new study session:");
    if (title) {
      const startTime = info.dateStr; // Use the clicked date/time as start
      // For simplicity, let's assume a default duration or prompt for it
      const focusedMinutes = parseInt(prompt("Enter duration in minutes (e.g., 60):") || "60", 10);
      const endTime = new Date(new Date(startTime).getTime() + focusedMinutes * 60 * 1000).toISOString(); // Calculate end time

      const newSessionData = {
        title,
        startTime,
        endTime,
        focusedMinutes,
        status: "scheduled", // Default status
        createdAt: new Date().toISOString(),
      };

      try {
        const response = await fetch(`/api/user/${user.uid}/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newSessionData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const addedSession = await response.json();
        // Update local state with the new event, including the ID from the backend
        setEvents([...events, {
          id: addedSession.id,
          title: addedSession.title,
          start: addedSession.startTime,
          end: addedSession.endTime,
          extendedProps: {
            focusedMinutes: addedSession.focusedMinutes,
          }
        }]);
      } catch (err) {
        console.error("Error adding session:", err);
        alert("Failed to add study session.");
      }
    }
  };

  const handleEventClick = async (info) => {
    if (!user) {
      alert("Please log in to delete study sessions.");
      return;
    }

    if (window.confirm(`Delete event '${info.event.title}'?`)) {
      try {
        const sessionId = info.event.id;
        const response = await fetch(`/api/user/${user.uid}/sessions/${sessionId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Update local state by filtering out the deleted event
        setEvents(events.filter((e) => e.id !== sessionId));
      } catch (err) {
        console.error("Error deleting session:", err);
        alert("Failed to delete study session.");
      }
    }
  };

  // --- Conditional Rendering ---
  if (loading) {
    return (
      <div className="calendar-page-container">
        <p className="calendar-loading-message">📅 Loading your calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calendar-page-container">
        <p className="calendar-error-message">⚠️ {error}</p>
        {!user && <p className="calendar-error-subtext">Please log in to manage your study calendar.</p>}
      </div>
    );
  }

  return (
    <div className="calendar-page-container">
      <h1 className="calendar-header">📅 Study Calendar</h1>
      <p className="calendar-subheader">
        Plan your study sessions and track your productive days.
      </p>

      <div className="calendar-wrapper">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events} // Dynamically loaded events
          height="80vh"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
        />
      </div>
    </div>
  );
};

export default CalendarPage;