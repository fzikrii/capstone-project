import React from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const Schedule = () => {
  const scheduleData = [
    { time: "09:00", task: "Team Standup" },
    { time: "11:00", task: "Design Review" },
    { time: "13:00", task: "Development Sprint" },
    { time: "15:00", task: "1-on-1 Meeting" },
    { time: "17:00", task: "Code Review" },
  ];
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-[#0B1C47] text-white px-6 py-4 shadow-md relative z-10">
        <div className="w-full flex justify-between items-center px-6">
          <div className="flex items-center space-x-9">
            <h1 className="text-2xl font-bold">CodeName</h1>
            <p className="hover:text-gray-300 cursor-pointer ml-6">Home</p>
            <p className="hover:text-gray-300 cursor-pointer">Schedule</p>
            <p className="hover:text-gray-300 cursor-pointer">Bounty Board</p>
            <Link to="/howtouse" className="hover:text-gray-300">
              How To Use
            </Link>
          </div>

          {/* Profile */}
          <ul className="flex items-center space-x-4">
            <li>
              <p className="hover:text-gray-300">Hi, Elmira</p>
            </li>
            <li>
              <div className="p-[2px] bg-white rounded-full">
                <img
                  src={profileImg}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              </div>
            </li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow px-6 py-8 bg-sky-100">
        <h2 className="text-3xl font-semibold text-[#0B1C47] mb-6 text-center">
          Project Schedule – July 2025
        </h2>

        {/* Day's Label */}
        <div className="grid grid-cols-7 gap-2 text-sm text-gray-600 font-medium mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-[#0B1C47] rounded-md shadow text-center py-2 text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calender */}
        <div className="grid grid-cols-7 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-transparent"></div>
          ))}
          {Array.from({ length: 31 }).map((_, i) => {
            const day = i + 1;

            // Dummy task
            const dummyTasks = {
              2: ["Meeting", "Wireframe"],
              5: ["Coding"],
              8: ["Presentation"],
              10: ["Fix bug"],
              12: ["Client call"],
              15: ["Deployment"],
              20: ["Team Review"],
              25: ["Testing"],
              30: ["Project Wrap-up"],
            };

            const tasks = dummyTasks[day] || [];

            return (
              <div
                key={day}
                className="bg-white rounded-xl shadow p-3 min-h-[120px] flex flex-col justify-between hover:shadow-lg transition duration-300"
              >
                <div className="text-right text-sm text-[#0B1C47] font-bold">
                  {day}
                </div>
                <ul className="mt-2 space-y-1">
                  {tasks.length > 0 ? (
                    tasks.map((task, idx) => (
                      <li
                        key={idx}
                        className="text-xs text-gray-700 bg-blue-50 border border-blue-200 rounded px-2 py-1"
                      >
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
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1C47] text-white text-center py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CodeName. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Schedule;
