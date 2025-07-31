import React, { useState } from "react";
import Sidebar from "../components/Sidebar"; // 👈 import sidebar

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeItem, setActiveItem] = useState("Schedule");

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthNames = [ "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December" ];

  const dummyTasks = {
    2: ["Project 1"], 5: ["Project 2"], 8: ["Project 3"], 10: ["Project 4"],
    12: ["Project 5"], 15: ["Project 6"], 20: ["Project 7"], 25: ["Project 8"], 30: ["Project 9"],
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <div className="min-h-screen flex bg-sky-100">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="text-[#0B1C47] font-bold hover:underline">← Prev</button>
          <h2 className="text-3xl font-semibold text-[#0B1C47]">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className="text-[#0B1C47] font-bold hover:underline">Next →</button>
        </div>

        <div className="grid grid-cols-7 gap-2 text-sm text-white font-medium mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-[#0B1C47] rounded-md shadow text-center py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-transparent"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const tasks = dummyTasks[day] || [];

            return (
              <div
                key={day}
                className="bg-white rounded-xl shadow p-3 min-h-[120px] flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div className="text-right text-sm text-[#0B1C47] font-bold">{day}</div>
                <ul className="mt-2 space-y-1">
                  {tasks.length > 0 ? (
                    tasks.map((task, idx) => (
                      <li key={idx} className="text-xs text-gray-700 bg-green-300 border border-blue-200 rounded px-2 py-1">
                        {task}
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-gray-400 italic">No tasks</li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
