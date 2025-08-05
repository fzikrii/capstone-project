import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import profileImg from "../assets/profile.jpg";

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-[#0B1C47] text-white px-6 py-4 shadow-md relative z-10">
      <div className="w-full flex justify-between items-center px-6">
        <div className="flex items-center space-x-9">
          <h1 className="text-2xl font-bold">Eagle Eye</h1>
          <p className="hover:text-gray-300 cursor-pointer ml-6">Home</p>
          <Link to="/schedule" className="hover:text-gray-300">
            Schedule
          </Link>
          <p className="hover:text-gray-300 cursor-pointer">Bounty Board</p>
          <p className="hover:text-gray-300 cursor-pointer">How To Use</p>
        </div>

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
  );
};

// Bounty Card Component
const BountyCard = ({ bounty }) => {
  const handleViewDetails = () => {
    console.log(`Viewing details for bounty: ${bounty.title}`);
  };

  const formattedDate = new Date(bounty.deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          {bounty.title}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {bounty.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4 text-sm">{bounty.description}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Deadline: {formattedDate}</span>
          <span className="font-bold text-lg text-green-600">
            ${bounty.reward}
          </span>
        </div>
        <button
          onClick={handleViewDetails}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Page Component
const BountyBoard = () => {
  const initialBounties = [
    {
      id: 1,
      title: "Build Responsive Landing Page",
      description: "Create a mobile-friendly landing page using React and Tailwind CSS.",
      deadline: "2025-08-10",
      reward: 300,
      tags: ["React", "Tailwind", "Frontend"]
    },
    {
      id: 2,
      title: "REST API for Task Management",
      description: "Design and develop a RESTful API for a task management system.",
      deadline: "2025-08-05",
      reward: 250,
      tags: ["Node.js", "Express", "Backend"]
    },
    {
      id: 3,
      title: "UI Redesign for Dashboard",
      description: "Improve usability and aesthetics of existing dashboard UI.",
      deadline: "2025-08-15",
      reward: 200,
      tags: ["UX", "UI", "Figma"]
    },
    {
      id: 4,
      title: "E-commerce Product Page",
      description: "Develop a product page with dynamic content and user reviews.",
      deadline: "2025-08-20",
      reward: 280,
      tags: ["React", "API", "Design"]
    },
    {
      id: 5,
      title: "Real-time Chat Application",
      description: "Build a real-time chat app using WebSockets and React.",
      deadline: "2025-08-25",
      reward: 350,
      tags: ["Socket.io", "WebSocket", "Realtime"]
    },
    {
      id: 6,
      title: "UI Settings Page",
      description: "Create a settings page for user preferences and configurations.",
      deadline: "2025-08-30",
      reward: 180,
      tags: ["React", "Settings", "Frontend"]
    },
  ];

  const [bounties] = useState(initialBounties);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("reward-desc");
  const [activeItem, setActiveItem] = useState("Bounty Board");

  const filteredAndSortedBounties = useMemo(() => {
    return bounties
      .filter(
        (bounty) =>
          bounty.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bounty.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        switch (sortOrder) {
          case "reward-asc":
            return a.reward - b.reward;
          case "reward-desc":
            return b.reward - a.reward;
          case "deadline-asc":
            return new Date(a.deadline) - new Date(b.deadline);
          case "deadline-desc":
            return new Date(b.deadline) - new Date(a.deadline);
          default:
            return 0;
        }
      });
  }, [bounties, searchTerm, sortOrder]);

  const SidebarItem = ({ label, to, isActive }) => (
    <Link
      to={to}
      onClick={() => setActiveItem(label)}
      className={`block px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive
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
            <SidebarItem label="Home" to="/" isActive={activeItem === "Home"} />
            <SidebarItem label="Schedule" to="/schedule" isActive={activeItem === "Schedule"} />
            <SidebarItem label="Bounty Board" to="/bountyboard" isActive={activeItem === "Bounty Board"} />
            <SidebarItem label="How To Use" to="/howtouse" isActive={activeItem === "How To Use"} />
          </nav>
        </div>
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
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0B1C47] mb-4">Bounty Board</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting projects, complete tasks, and earn rewards. Begin your coding adventure here!
          </p>
        </div>

        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search bounties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredAndSortedBounties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedBounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No bounties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search keyword or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BountyBoard;