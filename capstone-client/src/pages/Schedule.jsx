import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeItem, setActiveItem] = useState("Schedule");

  const handlePrevMonth = () => {
    const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(prev);
  };

  const handleNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(next);
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const dummyTasks = {
    2: ["Project 1"],
    5: ["Project 2"],
    8: ["Project 3"],
    10: ["Project 4"],
    12: ["Project 5"],
    15: ["Project 6"],
    20: ["Project 7"],
    25: ["Project 8"],
    30: ["Project 9"],
  };

  const SidebarItem = ({ label, to, isActive, onClick }) => (
    <Link
      to={to}
      onClick={() => onClick(label)}
      className={`block px-3 py-2 rounded-md cursor-pointer transition-colors ${
        isActive
          ? "bg-[#122b63] border-l-4 border-white text-white font-semibold"
          : "hover:text-gray-300 text-white"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-sky-100 relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1C47] text-white flex flex-col justify-between py-8 px-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-8 px-3">CodeName</h1>

          {/* Navigation */}
          <nav className="space-y-2 mb-12">
            <SidebarItem
              label="Home"
              to="/"
              isActive={activeItem === "Home"}
              onClick={setActiveItem}
            />
            <SidebarItem
              label="Schedule"
              to="/schedule"
              isActive={activeItem === "Schedule"}
              onClick={setActiveItem}
            />
            <SidebarItem
              label="Bounty Board"
              to="/bountyboard"
              isActive={activeItem === "Bounty Board"}
              onClick={setActiveItem}
            />
            <SidebarItem
              label="How To Use"
              to="/howtouse"
              isActive={activeItem === "How To Use"}
              onClick={setActiveItem}
            />
          </nav>
        </div>

        {/* Profile Section */}
        <div className="mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-[2px] bg-white rounded-full">
              <img
                src={profileImg}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
            <p className="text-sm">Hi, Elmira</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <button onClick={handlePrevMonth} className="text-[#0B1C47] font-bold hover:underline">← Prev</button>
          <h2 className="text-3xl font-semibold text-[#0B1C47] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={handleNextMonth} className="text-[#0B1C47] font-bold hover:underline">Next →</button>
        </div>

        {/* Day's Label */}
        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600 font-medium mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="bg-[#0B1C47] rounded-md shadow text-center py-2 text-white">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
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
