import React from "react";
import { Link } from "react-router-dom";

const bounties = [
  {
    title: "Redesign Landing Page",
    description: "Improve the UI/UX of the landing page for better user engagement.",
    reward: "$100",
    deadline: "Aug 10, 2025",
  },
  {
    title: "Build Notification System",
    description: "Develop a real-time notification system using WebSocket.",
    reward: "$150",
    deadline: "Aug 15, 2025",
  },
  {
    title: "Write API Documentation",
    description: "Create clear and concise API documentation for developers.",
    reward: "$80",
    deadline: "Aug 5, 2025",
  },
];

const Bountyboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white px-6 py-10">
      
      <h1 className="text-3xl font-bold text-blue-900 text-center mb-8">
        Bounty Board
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bounties.map((bounty, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-6 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {bounty.title}
              </h2>
              <p className="text-gray-700 mb-4">{bounty.description}</p>
            </div>

            <div className="mt-auto">
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>Deadline: {bounty.deadline}</span>
                <span className="font-semibold text-green-700">
                  {bounty.reward}
                </span>
              </div>
              <button className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bountyboard;