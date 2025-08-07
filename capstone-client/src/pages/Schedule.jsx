import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";

// Helper function to format date into YYYY-MM-DD key
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// --- API Functions (MODIFIED) ---

// Fetches all schedule events from the server
const fetchScheduleEvents = async () => {
  try {
    // REMOVED: No need to get token from localStorage. The browser will send the cookie.
    const response = await fetch('http://localhost:5000/schedule', {
      method: 'GET',
      headers: {
        // REMOVED: The 'Authorization' header is no longer needed.
        'Content-Type': 'application/json'
      },
      // ADDED: This tells the browser to send cookies with the request.
      credentials: 'include'
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication failed - you may need to log in again.');
        // Potentially redirect to login page here
        // window.location.href = '/login';
      }
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule events:', error);
    // Return empty array or throw error to be caught by the component
    return [];
  }
};

// Updates a schedule event's date on the server
const updateScheduleEvent = async (eventId, newDate) => {
  try {
    // REMOVED: No need to get token from localStorage.
    const response = await fetch(`http://localhost:5000/schedule/${eventId}`, {
      method: 'PUT',
      headers: {
        // REMOVED: The 'Authorization' header is no longer needed.
        'Content-Type': 'application/json'
      },
      // ADDED: This tells the browser to send cookies with the request.
      credentials: 'include',
      body: JSON.stringify({ date: newDate })
    });

    if (!response.ok) {
       if (response.status === 401) {
        console.error('Authentication failed - you may need to log in again.');
      }
      throw new Error(`Failed to update event: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating schedule event:', error);
    throw error;
  }
};

// Transforms raw API events into a format usable by the calendar (grouped by date)
const transformEventsForCalendar = (apiEvents) => {
  const eventsByDate = {};
  apiEvents.forEach(event => {
    if (!event.task) return; // Skip if task data is missing

    const dateKey = formatDateKey(new Date(event.date));
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }

    eventsByDate[dateKey].push({
      id: event._id,
      taskTitle: event.task.title,
      projectName: event.task.project?.name,
      taskTags: event.task.tags || [],
      color: event.color || 'bg-green-500',
      time: new Date(event.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      originalEvent: event
    });
  });
  return eventsByDate;
};


// --- MONTH VIEW SUB-COMPONENTS (Unchanged) ---

const MonthView = ({ currentDate, events, onDayClick, onEventDrop }) => {
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const days = [];

    const startDayOfWeek = firstDayOfMonth.getDay();
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek; i > 0; i--) {
      days.push({
        date: prevMonthLastDay - i + 1,
        fullDate: new Date(year, month - 1, prevMonthLastDay - i + 1),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const fullDate = new Date(year, month, i);
      const dateKey = formatDateKey(fullDate);
      const isToday = fullDate.setHours(0, 0, 0, 0) === today.getTime();
      days.push({
        date: i,
        fullDate,
        isCurrentMonth: true,
        isToday,
        events: events[dateKey] || [],
      });
    }

    const totalSlots = days.length > 35 ? 42 : 35;
    const remainingSlots = totalSlots - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({
        date: i,
        fullDate: new Date(year, month + 1, i),
        isCurrentMonth: false,
        isToday: false,
        events: [],
      });
    }
    return days;
  }, [currentDate, events]);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="grid grid-cols-7 text-center font-semibold text-slate-500">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => (
          <CalendarDay
            key={i}
            day={day}
            onClick={onDayClick}
            onEventDrop={onEventDrop}
          />
        ))}
      </div>
    </div>
  );
};

const CalendarDay = ({ day, onClick, onEventDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const dayClass = day.isCurrentMonth ? "text-slate-700" : "text-slate-400";
  const todayClass = day.isToday ? "bg-sky-500 text-white" : "hover:bg-slate-100";

  const handleDragStart = (e, eventId, originalDate) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ eventId, originalDate }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (day.isCurrentMonth) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (!day.isCurrentMonth) return;
    setIsDragOver(false);
    try {
      const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
      onEventDrop(eventData, formatDateKey(day.fullDate));
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  return (
    <div
      className={`border border-slate-200 h-28 p-2 flex flex-col transition-colors ${day.isCurrentMonth ? "cursor-pointer" : ""} ${isDragOver ? "bg-sky-100 border-sky-300" : ""}`}
      onClick={() => day.isCurrentMonth && onClick(day)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${dayClass} ${todayClass}`}>
        {day.date}
      </span>
      <div className="mt-1 flex-1 overflow-y-auto pr-1">
        {day.events.map((event) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) => handleDragStart(e, event.id, formatDateKey(day.fullDate))}
          >
            <CalendarEvent event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

const CalendarEvent = ({ event }) => (
  <div
    className={`p-1 text-xs font-semibold rounded-md text-white ${event.color} mb-1 truncate cursor-grab hover:opacity-90 transition-opacity`}
    title={`Task: ${event.taskTitle}${event.projectName ? `\nProject: ${event.projectName}` : ''}`}
  >
    {event.taskTitle}
  </div>
);


// --- MODAL (Unchanged) ---

const ScheduleModal = ({ day, onClose }) => {
  if (!day) return null;

  const fullDateStr = day.fullDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b">
          <h3 className="text-lg font-bold">Completed on {fullDateStr}</h3>
        </div>
        <div className="p-6 min-h-[100px] max-h-[400px] overflow-y-auto">
          {day.events.length > 0 ? (
            <ul className="space-y-3">
              {day.events.map((event) => (
                <li key={event.id} className="flex items-start gap-3">
                  <span className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${event.color}`}></span>
                  <div className="flex-1">
                    <span className="font-semibold text-slate-800">{event.taskTitle}</span>
                    {event.projectName && (
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        Project: {event.projectName}
                      </div>
                    )}
                    {event.taskTags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {event.taskTags.map(tag => (
                          <span key={tag.name} className="px-2 py-0.5 text-xs font-bold text-white rounded-full" style={{ backgroundColor: tag.color }}>
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {event.time && (
                    <div className="text-sm text-slate-500 flex-shrink-0">{event.time}</div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-slate-500">No events scheduled. ✨</p>
          )}
        </div>
        <div className="p-4 bg-slate-50 text-right border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


// --- LOADING & ERROR COMPONENTS (Unchanged) ---

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <p className="text-red-700 mb-4">{message}</p>
    <button
      onClick={onRetry}
      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
    >
      Retry
    </button>
  </div>
);


// --- MAIN COMPONENT (Unchanged) ---

const Schedule = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiEvents = await fetchScheduleEvents();
      const transformedEvents = transformEventsForCalendar(apiEvents);
      setEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load schedule events. Please try again.');
      console.error('Error loading events:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load events from API on component mount
  useEffect(() => {
    loadEvents();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeModal = () => setSelectedDay(null);
  const handleDayClick = (day) => setSelectedDay(day);

  // Handles drag-and-drop event updates
  const handleEventDrop = async ({ eventId, originalDate }, newDate) => {
    if (originalDate === newDate) return;

    // Optimistically update UI
    const previousEvents = events;
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      const eventToMove = newEvents[originalDate]?.find((e) => e.id === eventId);
      if (!eventToMove) return prevEvents;
      newEvents[originalDate] = newEvents[originalDate].filter((e) => e.id !== eventId);
      if (newEvents[originalDate].length === 0) delete newEvents[originalDate];
      if (!newEvents[newDate]) newEvents[newDate] = [];
      newEvents[newDate].push(eventToMove);
      return newEvents;
    });

    // Send update to the backend
    try {
      await updateScheduleEvent(eventId, newDate);
    } catch (error) {
      // Revert UI on error
      setEvents(previousEvents);
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', error);
    }
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const renderView = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={loadEvents} />;
    return (
      <MonthView
        currentDate={currentDate}
        events={events}
        onDayClick={handleDayClick}
        onEventDrop={handleEventDrop}
      />
    );
  };
  
  const currentDisplayDate = useMemo(() => {
    return currentDate.toLocaleDateString("en-US", {
      month: "long",
    });
  }, [currentDate]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header
          className="sticky top-0 z-20 min-h-[65px] flex items-center justify-between px-4 border-b border-slate-200"
          style={{ backgroundColor: "#0B1C47" }}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md hover:bg-slate-100/10"
            >
              <Icon name="menu" className="w-6 h-6 text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">Schedule</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white hover:bg-slate-100 transition-colors"
                disabled={loading}
              >
                <Icon name="chevron-left" className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-white w-48 text-center capitalize">
                {currentDisplayDate}
              </h2>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white hover:bg-slate-100 transition-colors"
                disabled={loading}
              >
                <Icon name="chevron-right" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
        ></div>
      )}
      <ScheduleModal day={selectedDay} onClose={closeModal} />
    </div>
  );
};

export default Schedule;
