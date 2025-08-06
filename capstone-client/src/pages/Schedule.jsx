import React, { useState, useMemo, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Icon from "../components/Icon";

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// API functions
const fetchScheduleEvents = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      console.warn('No authentication token found');
      return [];
    }

    const response = await fetch('http://localhost:5000/schedule', {
      method: 'GET', // It's good practice to be explicit
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include' // <-- ADD THIS LINE
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.error('Authentication failed - token may be expired');
        return [];
      }
      throw new Error(`Failed to fetch events: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching schedule events:', error);
    return [];
  }
};

const updateScheduleEvent = async (eventId, newDate) => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`http://localhost:5000/schedule/${eventId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ date: newDate })
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Authentication failed - please log in again');
      }
      throw new Error(`Failed to update event: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating schedule event:', error);
    throw error;
  }
};

// Transform API events to calendar format
const transformEventsForCalendar = (apiEvents) => {
  const eventsByDate = {};

  apiEvents.forEach(event => {
    // If an event is missing the populated task for any reason, skip it.
    if (!event.task) return;

    const dateKey = formatDateKey(new Date(event.date));
    if (!eventsByDate[dateKey]) {
      eventsByDate[dateKey] = [];
    }

    // Create a richer event object for the UI
    eventsByDate[dateKey].push({
      id: event._id, // The ID of the schedule event itself
      taskTitle: event.task.title, // Use the title from the task
      projectName: event.task.project?.name, // Get project name if it exists
      taskTags: event.task.tags || [], // Get task tags
      color: event.color || 'bg-green-500',
      time: new Date(event.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      // Keep the original event for debugging or future use
      originalEvent: event
    });
  });

  return eventsByDate;
};

// --- MONTH VIEW SUB-COMPONENTS ---
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
  const todayClass = day.isToday
    ? "bg-sky-500 text-white"
    : "hover:bg-slate-100";

  const handleDragStart = (e, eventId, originalDate) => {
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ eventId, originalDate })
    );
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (day.isCurrentMonth) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only remove drag over state if we're actually leaving the day container
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
      className={`border border-slate-200 h-28 p-2 flex flex-col transition-colors ${day.isCurrentMonth ? "cursor-pointer" : ""
        } ${isDragOver ? "bg-sky-100 border-sky-300" : ""}`}
      onClick={() => day.isCurrentMonth && onClick(day)}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <span
        className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${dayClass} ${todayClass}`}
      >
        {day.date}
      </span>
      <div className="mt-1 flex-1 overflow-y-auto pr-1">
        {day.events.map((event) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, event.id, formatDateKey(day.fullDate))
            }
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
    // Updated title to show task and project name on hover
    title={`Task: ${event.taskTitle}${event.projectName ? `\nProject: ${event.projectName}` : ''}`}
  >
    {/* We still display just the task title here because space is limited */}
    {event.taskTitle}
  </div>
);

// --- WEEK VIEW SUB-COMPONENTS ---
const WeekView = ({ currentDate, events, onEventDrop }) => {
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      const dateKey = formatDateKey(day);
      days.push({
        date: day.getDate(),
        fullDate: day,
        dayName: day.toLocaleDateString("en-US", { weekday: "short" }),
        events: events[dateKey] || [],
      });
    }
    return days;
  }, [currentDate, events]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 grid grid-cols-7">
      {weekDays.map((day, index) => (
        <WeekDayColumn key={`${day.fullDate.getTime()}-${index}`} day={day} onEventDrop={onEventDrop} />
      ))}
    </div>
  );
};

const WeekDayColumn = ({ day, onEventDrop }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragStart = (e, eventId, originalDate) =>
    e.dataTransfer.setData(
      "text/plain",
      JSON.stringify({ eventId, originalDate })
    );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
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
      className={`border-l border-slate-200 p-2 first:border-l-0 ${isDragOver ? "bg-sky-100" : ""
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="text-center mb-2">
        <p className="text-sm text-slate-500">{day.dayName}</p>
        <p className="text-2xl font-bold">{day.date}</p>
      </div>
      <div className="space-y-2 h-96 overflow-y-auto">
        {day.events.map((event) => (
          <div
            key={event.id}
            draggable
            onDragStart={(e) =>
              handleDragStart(e, event.id, formatDateKey(day.fullDate))
            }
          >
            <CalendarEvent event={event} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- DAY VIEW SUB-COMPONENTS ---
const DayView = ({ currentDate, events }) => {
  const timeSlots = Array.from(
    { length: 12 },
    (_, i) => `${(i + 8).toString().padStart(2, "0")}:00`
  );
  const dayEvents = events[formatDateKey(currentDate)] || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-700">
          {currentDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </h3>
      </div>
      {timeSlots.map((time) => (
        <div key={time} className="flex border-t border-slate-200 py-4 first:border-t-0">
          <div className="w-20 text-sm text-slate-500 flex-shrink-0">{time}</div>
          <div className="flex-1 pl-4">
            {dayEvents
              .filter((e) => e.time && e.time.startsWith(time.slice(0, 2)))
              .map((event) => (
                <div key={event.id} className="mb-2">
                  <CalendarEvent event={event} />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// --- YEAR VIEW SUB-COMPONENTS ---
const YearView = ({ currentDate, events, onMonthClick }) => {
  const months = Array.from(
    { length: 12 },
    (_, i) => new Date(currentDate.getFullYear(), i, 1)
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {months.map((month) => (
        <MiniCalendar
          key={month.getMonth()}
          monthDate={month}
          events={events}
          onClick={() => onMonthClick(month)}
        />
      ))}
    </div>
  );
};

const MiniCalendar = ({ monthDate, events, onClick }) => {
  const monthName = monthDate.toLocaleDateString("en-US", { month: "long" });
  const daysInMonth = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth() + 1,
    0
  ).getDate();
  const firstDay = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1
  ).getDay();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDay });

  return (
    <div
      className="border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-sky-500 hover:shadow-md transition-all"
      onClick={onClick}
    >
      <h4 className="font-bold text-center mb-2">{monthName}</h4>
      <div className="grid grid-cols-7 text-center text-xs text-slate-500">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm mt-1">
        {emptySlots.map((_, i) => (
          <div key={`empty-${i}`}></div>
        ))}
        {days.map((day) => {
          const dateKey = formatDateKey(
            new Date(monthDate.getFullYear(), monthDate.getMonth(), day)
          );
          const hasEvents = events[dateKey] && events[dateKey].length > 0;
          return (
            <div
              key={day}
              className={`rounded-full w-6 h-6 flex items-center justify-center text-xs ${hasEvents ? "bg-sky-200 font-semibold" : ""
                }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// --- MODAL ---
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
                  {/* Event color dot */}
                  <span
                    className={`mt-1.5 w-3 h-3 rounded-full flex-shrink-0 ${event.color}`}
                  ></span>
                  <div className="flex-1">
                    {/* Task Title */}
                    <span className="font-semibold text-slate-800">{event.taskTitle}</span>

                    {/* Project Name Badge */}
                    {event.projectName && (
                      <div className="mt-1 text-xs font-medium text-slate-500">
                        Project: {event.projectName}
                      </div>
                    )}

                    {/* Tags */}
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
                  {/* Completion Time */}
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

// --- LOADING COMPONENT ---
const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
  </div>
);

// --- ERROR COMPONENT ---
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

// --- MAIN COMPONENT ---
const Schedule = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const [view, setView] = useState("month");
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Loading schedule events...');
        const apiEvents = await fetchScheduleEvents();
        console.log('Fetched events:', apiEvents);
        const transformedEvents = transformEventsForCalendar(apiEvents);
        console.log('Transformed events:', transformedEvents);
        setEvents(transformedEvents);
      } catch (err) {
        setError('Failed to load schedule events. Please try again.');
        console.error('Error loading events:', err);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeModal = () => setSelectedDay(null);
  const handleDayClick = (day) => setSelectedDay(day);

  const handleEventDrop = async ({ eventId, originalDate }, newDate) => {
    if (originalDate === newDate) return;

    // Optimistically update the UI
    setEvents((prevEvents) => {
      const newEvents = { ...prevEvents };
      const eventToMove = newEvents[originalDate]?.find((e) => e.id === eventId);

      if (!eventToMove) return prevEvents;

      // Remove from original date
      newEvents[originalDate] = newEvents[originalDate].filter(
        (e) => e.id !== eventId
      );
      if (newEvents[originalDate].length === 0) {
        delete newEvents[originalDate];
      }

      // Add to new date
      if (!newEvents[newDate]) newEvents[newDate] = [];
      newEvents[newDate].push(eventToMove);

      return newEvents;
    });

    // Update the backend
    try {
      await updateScheduleEvent(eventId, newDate);
    } catch (error) {
      // Revert the optimistic update on error
      setEvents((prevEvents) => {
        const newEvents = { ...prevEvents };
        const eventToRevert = newEvents[newDate]?.find((e) => e.id === eventId);

        if (!eventToRevert) return prevEvents;

        // Remove from new date
        newEvents[newDate] = newEvents[newDate].filter((e) => e.id !== eventId);
        if (newEvents[newDate].length === 0) {
          delete newEvents[newDate];
        }

        // Add back to original date
        if (!newEvents[originalDate]) newEvents[originalDate] = [];
        newEvents[originalDate].push(eventToRevert);

        return newEvents;
      });

      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', error);
    }
  };

  const handleMonthClickFromYear = (date) => {
    setCurrentDate(date);
    setView("month");
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      switch (view) {
        case "day":
          newDate.setDate(newDate.getDate() - 1);
          break;
        case "week":
          newDate.setDate(newDate.getDate() - 7);
          break;
        case "year":
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
        case "month":
        default:
          newDate.setMonth(newDate.getMonth() - 1);
          break;
      }
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      switch (view) {
        case "day":
          newDate.setDate(newDate.getDate() + 1);
          break;
        case "week":
          newDate.setDate(newDate.getDate() + 7);
          break;
        case "year":
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
        case "month":
        default:
          newDate.setMonth(newDate.getMonth() + 1);
          break;
      }
      return newDate;
    });
  };

  const handleGoToToday = () => setCurrentDate(new Date());

  const retryLoadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Retrying to load schedule events...');
      const apiEvents = await fetchScheduleEvents();
      const transformedEvents = transformEventsForCalendar(apiEvents);
      setEvents(transformedEvents);
    } catch (err) {
      setError('Failed to load schedule events. Please try again.');
      console.error('Retry failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderView = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} onRetry={retryLoadEvents} />;

    switch (view) {
      case "day":
        return <DayView currentDate={currentDate} events={events} />;
      case "week":
        return (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventDrop={handleEventDrop}
          />
        );
      case "year":
        return (
          <YearView
            currentDate={currentDate}
            events={events}
            onMonthClick={handleMonthClickFromYear}
          />
        );
      case "month":
      default:
        return (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventDrop={handleEventDrop}
          />
        );
    }
  };

  const currentDisplayDate = useMemo(() => {
    switch (view) {
      case "day":
        return currentDate.toLocaleDateString("en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })} - ${endOfWeek.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`;
      case "year":
        return currentDate.getFullYear();
      case "month":
      default:
        return currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });
    }
  }, [currentDate, view]);

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
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              {["day", "week", "month", "year"].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-3 py-1 text-sm font-semibold rounded-md capitalize transition-all ${view === v
                    ? "bg-white text-sky-600 shadow-sm"
                    : "text-slate-500 hover:bg-white/60"
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGoToToday}
                className="px-4 py-2 text-sm font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Today
              </button>
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