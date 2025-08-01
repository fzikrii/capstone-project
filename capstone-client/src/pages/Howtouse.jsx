import React, { useState } from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

const Howtouse = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeItem, setActiveItem] = useState("How To Use");

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

  const SidebarItem = ({ label, to, isActive }) => (
    <Link
      to={to}
      onClick={() => setActiveItem(label)}
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
    <div className="min-h-screen flex bg-sky-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1C47] text-white flex flex-col justify-between py-8 px-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-8 px-3">CodeName</h1>
          <nav className="space-y-2">
            <SidebarItem
              label="Home"
              to="/projectboard"
              isActive={activeItem === "Home"}
            />
            <SidebarItem
              label="Schedule"
              to="/schedule"
              isActive={activeItem === "Schedule"}
            />
            <SidebarItem
              label="Bounty Board"
              to="/bountyboard"
              isActive={activeItem === "Bounty Board"}
            />
            <SidebarItem
              label="How To Use"
              to="/howtouse"
              isActive={activeItem === "How To Use"}
            />
          </nav>
        </div>

        {/* Profile */}
        <div className="flex items-center space-x-3 mt-6">
          <div className="p-[2px] bg-white rounded-full">
            <img
              src={profileImg}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <p className="text-sm">Hi, Elmira</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0B1C47] mb-4">
            How to Use
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn how to make the most of the platform’s features. Click each section to expand and explore.
          </p>
        </div>

        <div className="space-y-4 max-w-3xl mx-auto">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 border border-gray-200 transition-all duration-200"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleCard(index)}
              >
                <h3 className="text-xl font-semibold text-[#0B1C47]">
                  {guide.title}
                </h3>
                <span className="text-gray-500 text-xl">
                  {openIndex === index ? "▲" : "▼"}
                </span>
              </div>

              {openIndex === index && (
                <p className="mt-4 text-gray-700 text-sm">{guide.content}</p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Howtouse;
