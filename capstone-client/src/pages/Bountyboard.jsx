import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// Navbar Component
const Navbar = () => {
  return (
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

// Main App Component
function App() {
  const [bounties] = useState(initialBounties);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("reward-desc");

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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-6 py-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-4">
              Bounty Board
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover exciting projects, complete tasks, and earn rewards.
              Begin your coding adventure here!
            </p>
          </div>

          {/* Search and Sort Controls */}
          <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="text"
              placeholder="Search bounties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-gray-600 font-medium">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="reward-desc">Reward (High to Low)</option>
                <option value="reward-asc">Reward (Low to High)</option>
                <option value="deadline-asc">Deadline (Soonest)</option>
                <option value="deadline-desc">Deadline (Latest)</option>
              </select>
            </div>
          </div>

          {/* Bounty Grid */}
          {filteredAndSortedBounties.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAndSortedBounties.map((bounty) => (
                <BountyCard key={bounty.id} bounty={bounty} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold text-gray-700">
                No bounties found
              </h3>
              <p className="text-gray-500 mt-2">
                Try adjusting your search keyword or filter.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-[#0B1C47] text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h2 className="text-2xl font-bold mb-2">CodeName</h2>
            <p className="text-gray-400">
              A platform where developers discover projects and earn rewards.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">
                  Bounty Board
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-gray-300">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              <a href="#" className="hover:text-gray-300">
                Twitter
              </a>
              <a href="#" className="hover:text-gray-300">
                GitHub
              </a>
              <a href="#" className="hover:text-gray-300">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500">
          <p>&copy; 2025 CodeName. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default App;