import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarPage = () => {
  const [events, setEvents] = useState([
    { id: "1", title: "DSA Practice", date: "2025-10-29" },
    { id: "2", title: "Firebase Integration", date: "2025-10-30" },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Enter event title:");
    if (title) {
      setEvents([...events, { id: Date.now(), title, date: info.dateStr }]);
    }
  };

  const handleEventClick = (info) => {
    if (window.confirm(`Delete event '${info.event.title}'?`)) {
      setEvents(events.filter((e) => e.id !== info.event.id));
    }
  };

  return (
    <div className="p-6 text-gray-800">
      <h1 className="text-2xl font-semibold mb-4">📅 Study Calendar</h1>
      <p className="text-gray-600 mb-4">
        Plan your study sessions and track your productive days.
      </p>

      <div className="bg-white border rounded-2xl shadow-md p-4">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          selectable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          events={events}
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
