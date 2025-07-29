import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const Howtouse = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleCard = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const guides = [
    {
      title: "Schedule Feature",
      content:
        "The Schedule feature allows you to create, manage, and view your task timeline in an organized way. Use the calendar view to plan deadlines, set priorities, and ensure your work is completed on time.",
    },
    {
      title: "Bounty Board Feature",
      content:
        "The Bounty Board is a public task board where users can claim open challenges or assignments. Each bounty includes a description, deadline, and reward—perfect for collaborative or competitive task completion.",
    },
    {
      title: "Lorem Ipsum Feature",
      content:
        "This feature provides placeholder content used during interface design and testing. It's helpful for visualizing layouts and user experience without requiring real data in the early development stages.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Navbar */}
      <nav className="bg-[#0B1C47] text-white px-6 py-4 shadow-md relative z-10">
        <div className="w-full flex justify-between items-center px-6">
          <div className="flex items-center space-x-9">
            <h1 className="text-2xl font-bold">CodeName</h1>
            <p className="hover:text-gray-300 cursor-pointer ml-6">Home</p>
            <Link to="/schedule" className="hover:text-gray-300">
              Schedule
            </Link>
            <p className="hover:text-gray-300 cursor-pointer">Bounty Board</p>
            <p className="hover:text-gray-300 cursor-pointer">How To Use</p>
          </div>

          {/* Profile*/}
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
      <main className="flex-1 px-6 py-12 bg-sky-100 relative z-10">
        <h2 className="text-2xl font-semibold mb-6">How to Use</h2>

        <div className="space-y-4">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 transition-all duration-200"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCard(index)}
              >
                <h3 className="text-lg font-medium text-[#0B1C47]">
                  {guide.title}
                </h3>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </div>

              {openIndex === index && (
                <p className="mt-3 text-gray-700 text-sm">{guide.content}</p>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B1C47] text-white text-center py-4 relative z-10">
        <p>&copy; {new Date().getFullYear()} CodeName. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Howtouse;
