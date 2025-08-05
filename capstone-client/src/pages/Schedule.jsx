import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';


// --- Data Jadwal (diletakkan di luar komponen) ---
const allEvents = {
    '2025-08-01': [{ id: 1, title: 'API Key Issue', color: 'bg-rose-500' }],
    '2025-08-03': [{ id: 2, title: 'Develop Homepage', color: 'bg-amber-500' }],
    '2025-08-05': [{ id: 3, title: 'Design Mockups', color: 'bg-sky-500' }],
    '2025-08-08': [{ id: 4, title: 'User Auth Setup', color: 'bg-sky-500' }],
    '2025-09-10': [{ id: 5, title: 'Meeting with Client', color: 'bg-green-500' }],
};

const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// --- KOMPONEN ---

const CalendarEvent = ({ event }) => (
    <div className={`p-1 text-xs font-semibold rounded-md text-white ${event.color} mb-1 truncate`}>
        {event.title}
    </div>
);

const CalendarDay = ({ day, onClick }) => {
    const dayClass = day.isCurrentMonth ? 'text-slate-700' : 'text-slate-400';
    const todayClass = day.isToday ? 'bg-sky-500 text-white' : 'hover:bg-slate-100';

    return (
        <div
            className={`border border-slate-200 h-28 p-2 flex flex-col transition-colors ${day.isCurrentMonth ? 'cursor-pointer' : ''}`}
            onClick={() => day.isCurrentMonth && onClick(day)}
        >
            <span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold ${dayClass} ${todayClass}`}>
                {day.date}
            </span>
            <div className="mt-1 flex-1 overflow-y-auto pr-1">
                {day.events.map(event => <CalendarEvent key={event.id} event={event} />)}
            </div>
        </div>
    );
};

const ScheduleModal = ({ day, onClose }) => {
    if (!day) return null;

    const fullDateStr = day.fullDate.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-slate-200">
                    <h3 className="text-lg font-bold text-slate-800">Jadwal untuk {fullDateStr}</h3>
                </div>
                <div className="p-6 min-h-[100px]">
                    {day.events.length > 0 ? (
                        <ul className="space-y-3">
                            {day.events.map(event => (
                                <li key={event.id} className="flex items-center gap-3">
                                    <span className={`w-3 h-3 rounded-full ${event.color}`}></span>
                                    <span className="text-slate-700">{event.title}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center">Tidak ada jadwal pada hari ini. ✨</p>
                    )}
                </div>
                 <div className="p-4 bg-slate-50 rounded-b-xl text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};


const Schedule = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
    const closeModal = () => setSelectedDay(null);
    const handleDayClick = (day) => setSelectedDay(day);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const handleGoToToday = () => {
        setCurrentDate(new Date());
    };

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
            const date = prevMonthLastDay - i + 1;
            const fullDate = new Date(year, month - 1, date);
            fullDate.setHours(0,0,0,0);
            days.push({ date, fullDate, isCurrentMonth: false, isToday: false, events: [] });
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            const fullDate = new Date(year, month, i);
            fullDate.setHours(0,0,0,0);
            const dateKey = formatDateKey(fullDate);
            
            const isToday = fullDate.getTime() === today.getTime();
            
            days.push({ date: i, fullDate, isCurrentMonth: true, isToday, events: allEvents[dateKey] || [] });
        }
        
        const totalSlots = days.length > 35 ? 42 : 35;
        const remainingSlots = totalSlots - days.length;
        for (let i = 1; i <= remainingSlots; i++) {
            const fullDate = new Date(year, month + 1, i);
            fullDate.setHours(0,0,0,0);
            days.push({ date: i, fullDate, isCurrentMonth: false, isToday: false, events: [] });
        }

        return days;
    }, [currentDate]);

    const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-20 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                            <Icon name="menu" className="w-6 h-6" />
                        </button>
                        <h1 className="text-2xl font-bold text-slate-800">Schedule</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleGoToToday} 
                            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
                        >
                            Today
                        </button>
                        <button onClick={handlePrevMonth} className="p-2 rounded-full hover:bg-slate-100">
                           <Icon name="chevron-left" className="w-6 h-6 text-slate-600" />
                        </button>
                        <button onClick={handleNextMonth} className="p-2 rounded-full hover:bg-slate-100">
                           <Icon name="chevron-right" className="w-6 h-6 text-slate-600" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-center items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 w-48 text-center capitalize">
                                {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </h2>
                        </div>
                        <div className="grid grid-cols-7 text-center font-semibold text-slate-500">
                            {daysOfWeek.map(day => <div key={day} className="py-2">{day}</div>)}
                        </div>
                        <div className="grid grid-cols-7">
                            {calendarDays.map((day, i) => <CalendarDay key={i} day={day} onClick={handleDayClick} />)}
                        </div>
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
            
            <ScheduleModal day={selectedDay} onClose={closeModal} />
        </div>
    );
};

export default Schedule;
