import React, { useState, useMemo } from 'react';

// Make sure you have these components in your project
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- Initial Schedule Data ---
const initialEvents = {
    '2025-08-01': [{ id: 1, title: 'API Key Issue', color: 'bg-rose-500', time: '10:00' }],
    '2025-08-03': [{ id: 2, title: 'Develop Homepage', color: 'bg-amber-500', time: '14:00' }],
    '2025-08-05': [
        { id: 3, title: 'Design Mockups', color: 'bg-sky-500', time: '09:00' },
        { id: 9, title: 'Review PR', color: 'bg-indigo-500', time: '15:00' }
    ],
    '2025-08-08': [{ id: 4, title: 'User Auth Setup', color: 'bg-sky-500', time: '11:00' }],
    '2025-09-10': [{ id: 5, title: 'Meeting with Client', color: 'bg-green-500', time: '13:00' }],
    '2025-01-20': [{ id: 6, title: 'Q1 Planning', color: 'bg-teal-500', time: '09:30' }],
    '2025-08-06': [{ id: 7, title: 'Analytics Deployment', color: 'bg-purple-500', time: '16:00' }],
    '2025-07-22': [{ id: 8, title: 'Candidate Interview', color: 'bg-pink-500', time: '10:00' }],
};

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
            days.push({ date: prevMonthLastDay - i + 1, fullDate: new Date(year, month - 1, prevMonthLastDay - i + 1), isCurrentMonth: false, isToday: false, events: [] });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const fullDate = new Date(year, month, i);
            const dateKey = formatDateKey(fullDate);
            const isToday = fullDate.setHours(0,0,0,0) === today.getTime();
            days.push({ date: i, fullDate, isCurrentMonth: true, isToday, events: events[dateKey] || [] });
        }
        
        const totalSlots = days.length > 35 ? 42 : 35;
        for (let i = 1; i <= totalSlots - days.length; i++) {
            days.push({ date: i, fullDate: new Date(year, month + 1, i), isCurrentMonth: false, isToday: false, events: [] });
        }
        return days;
    }, [currentDate, events]);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-7 text-center font-semibold text-slate-500">
                {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
            </div>
            <div className="grid grid-cols-7">
                {calendarDays.map((day, i) => 
                    <CalendarDay key={i} day={day} onClick={onDayClick} onEventDrop={onEventDrop} />
                )}
            </div>
        </div>
    );
};

const CalendarDay = ({ day, onClick, onEventDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const dayClass = day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400';
    const todayClass = day.isToday ? 'bg-sky-500 text-white' : 'hover:bg-slate-100';

    const handleDragStart = (e, eventId, originalDate) => {
        e.dataTransfer.setData("text/plain", JSON.stringify({ eventId, originalDate }));
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (day.isCurrentMonth) setIsDragOver(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        if (!day.isCurrentMonth) return;
        setIsDragOver(false);
        const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
        onEventDrop(eventData, formatDateKey(day.fullDate));
    };

    return (
        <div
            className={`border border-slate-200 h-28 p-2 flex flex-col transition-colors ${day.isCurrentMonth ? 'cursor-pointer' : ''} ${isDragOver ? 'bg-sky-100' : ''}`}
            onClick={() => day.isCurrentMonth && onClick(day)}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${dayClass} ${todayClass}`}>
                {day.date}
            </span>
            <div className="mt-1 flex-1 overflow-y-auto pr-1">
                {day.events.map(event => 
                    <div key={event.id} draggable onDragStart={(e) => handleDragStart(e, event.id, formatDateKey(day.fullDate))}>
                        <CalendarEvent event={event} />
                    </div>
                )}
            </div>
        </div>
    );
};

const CalendarEvent = ({ event }) => (
    <div className={`p-1 text-xs font-semibold rounded-md text-white ${event.color} mb-1 truncate cursor-grab`}>
        {event.title}
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
                dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
                events: events[dateKey] || []
            });
        }
        return days;
    }, [currentDate, events]);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 grid grid-cols-7">
            {weekDays.map(day => <WeekDayColumn key={day.date} day={day} onEventDrop={onEventDrop} />)}
        </div>
    );
};

const WeekDayColumn = ({ day, onEventDrop }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const handleDragStart = (e, eventId, originalDate) => e.dataTransfer.setData("text/plain", JSON.stringify({ eventId, originalDate }));
    const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const eventData = JSON.parse(e.dataTransfer.getData("text/plain"));
        onEventDrop(eventData, formatDateKey(day.fullDate));
    };

    return (
        <div 
            className={`border-l border-slate-200 p-2 ${isDragOver ? 'bg-sky-100' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
        >
            <div className="text-center mb-2">
                <p className="text-sm text-slate-500">{day.dayName}</p>
                <p className="text-2xl font-bold">{day.date}</p>
            </div>
            <div className="space-y-2 h-96 overflow-y-auto">
                {day.events.map(event => 
                     <div key={event.id} draggable onDragStart={(e) => handleDragStart(e, event.id, formatDateKey(day.fullDate))}>
                        <CalendarEvent event={event} />
                    </div>
                )}
            </div>
        </div>
    );
};

// --- DAY VIEW SUB-COMPONENTS ---
const DayView = ({ currentDate, events }) => {
    const timeSlots = Array.from({ length: 12 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);
    const dayEvents = events[formatDateKey(currentDate)] || [];

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            {timeSlots.map(time => (
                <div key={time} className="flex border-t border-slate-200 py-4">
                    <div className="w-20 text-sm text-slate-500">{time}</div>
                    <div className="flex-1 pl-4">
                        {dayEvents.filter(e => e.time && e.time.startsWith(time.slice(0,2))).map(event => (
                            <CalendarEvent key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- YEAR VIEW SUB-COMPONENTS ---
const YearView = ({ currentDate, events, onMonthClick }) => {
    const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {months.map(month => <MiniCalendar key={month.getMonth()} monthDate={month} events={events} onClick={() => onMonthClick(month)} />)}
        </div>
    );
};

const MiniCalendar = ({ monthDate, events, onClick }) => {
    const monthName = monthDate.toLocaleDateString('en-US', { month: 'long' });
    const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptySlots = Array.from({ length: firstDay });

    return (
        <div className="border border-slate-200 rounded-lg p-3 cursor-pointer hover:border-sky-500" onClick={onClick}>
            <h4 className="font-bold text-center mb-2">{monthName}</h4>
            <div className="grid grid-cols-7 text-center text-xs text-slate-500">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 text-center text-sm mt-1">
                {emptySlots.map((_, i) => <div key={`empty-${i}`}></div>)}
                {days.map(day => {
                    const dateKey = formatDateKey(new Date(monthDate.getFullYear(), monthDate.getMonth(), day));
                    const hasEvents = events[dateKey] && events[dateKey].length > 0;
                    return <div key={day} className={`rounded-full w-6 h-6 flex items-center justify-center ${hasEvents ? 'bg-sky-200' : ''}`}>{day}</div>
                })}
            </div>
        </div>
    );
};


// --- MODAL ---
const ScheduleModal = ({ day, onClose }) => {
    if (!day) return null;
    const fullDateStr = day.fullDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b"><h3 className="text-lg font-bold">Schedule for {fullDateStr}</h3></div>
                <div className="p-6 min-h-[100px]">
                    {day.events.length > 0 ? (
                        <ul className="space-y-3">
                            {day.events.map(event => <li key={event.id} className="flex items-center gap-3"><span className={`w-3 h-3 rounded-full ${event.color}`}></span><span>{event.title}</span></li>)}
                        </ul>
                    ) : <p className="text-center">No events scheduled. ✨</p>}
                </div>
                <div className="p-4 bg-slate-50 text-right"><button onClick={onClose} className="px-4 py-2 bg-slate-200 font-semibold rounded-lg">Close</button></div>
            </div>
        </div>
    );
};


// --- MAIN COMPONENT ---
const Schedule = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [view, setView] = useState('month');
    const [events, setEvents] = useState(initialEvents);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeModal = () => setSelectedDay(null);
    const handleDayClick = (day) => setSelectedDay(day);

    const handleEventDrop = ({ eventId, originalDate }, newDate) => {
        if (originalDate === newDate) return;

        setEvents(prevEvents => {
            const newEvents = { ...prevEvents };
            const eventToMove = newEvents[originalDate].find(e => e.id === eventId);
            
            newEvents[originalDate] = newEvents[originalDate].filter(e => e.id !== eventId);
            if (newEvents[originalDate].length === 0) delete newEvents[originalDate];

            if (!newEvents[newDate]) newEvents[newDate] = [];
            newEvents[newDate].push(eventToMove);
            
            return newEvents;
        });
    };
    
    const handleMonthClickFromYear = (date) => {
        setCurrentDate(date);
        setView('month');
    };

    const handlePrev = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            switch(view) {
                case 'day': newDate.setDate(newDate.getDate() - 1); break;
                case 'week': newDate.setDate(newDate.getDate() - 7); break;
                case 'year': newDate.setFullYear(newDate.getFullYear() - 1); break;
                case 'month': default: newDate.setMonth(newDate.getMonth() - 1); break;
            }
            return newDate;
        });
    };

    const handleNext = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            switch(view) {
                case 'day': newDate.setDate(newDate.getDate() + 1); break;
                case 'week': newDate.setDate(newDate.getDate() + 7); break;
                case 'year': newDate.setFullYear(newDate.getFullYear() + 1); break;
                case 'month': default: newDate.setMonth(newDate.getMonth() + 1); break;
            }
            return newDate;
        });
    };
    
    const handleGoToToday = () => setCurrentDate(new Date());
    
    const renderView = () => {
        switch(view) {
            case 'day': return <DayView currentDate={currentDate} events={events} />;
            case 'week': return <WeekView currentDate={currentDate} events={events} onEventDrop={handleEventDrop} />;
            case 'year': return <YearView currentDate={currentDate} events={events} onMonthClick={handleMonthClickFromYear} />;
            case 'month':
            default:
                return <MonthView currentDate={currentDate} events={events} onDayClick={handleDayClick} onEventDrop={handleEventDrop} />;
        }
    };
    
    const currentDisplayDate = useMemo(() => {
        switch(view) {
            case 'day': return currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
            case 'week': 
                const startOfWeek = new Date(currentDate);
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                return `${startOfWeek.toLocaleDateString('en-US', {day: 'numeric', month: 'short'})} - ${endOfWeek.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'})}`;
            case 'year': return currentDate.getFullYear();
            case 'month':
            default:
                return currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
    }, [currentDate, view]);

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200"><Icon name="menu" className="w-6 h-6" /></button>
                        <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                            {['day', 'week', 'month', 'year'].map(v => (
                                <button key={v} onClick={() => setView(v)} className={`px-3 py-1 text-sm font-semibold rounded-md capitalize transition-all ${view === v ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500 hover:bg-white/60'}`}>
                                    {v}
                                </button>
                            ))}
                        </div>
                        <div className="flex items-center gap-2">
                             <button onClick={handleGoToToday} className="px-4 py-2 text-sm font-semibold border border-slate-300 rounded-lg">Today</button>
                             <button onClick={handlePrev} className="p-2 rounded-full hover:bg-slate-100"><Icon name="chevron-left" className="w-6 h-6" /></button>
                             <h2 className="text-lg font-bold text-slate-800 w-48 text-center capitalize">{currentDisplayDate}</h2>
                             <button onClick={handleNext} className="p-2 rounded-full hover:bg-slate-100"><Icon name="chevron-right" className="w-6 h-6" /></button>
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {renderView()}
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
            <ScheduleModal day={selectedDay} onClose={closeModal} />
        </div>
    );
};

export default Schedule;