// src/pages/BountyBoard.jsx
import React, { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";

const BountyBoard = () => {
  const initialBounties = [/* data bounty seperti sebelumnya */];

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

  return (
    <div className="flex min-h-screen bg-sky-100">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

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
            {filteredAndSortedBounties.map((bounty) => {
              const formattedDate = new Date(bounty.deadline).toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={bounty.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-200"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">{bounty.title}</h2>
                    <p className="text-gray-600 mb-4 text-sm">{bounty.description}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                      <span>Deadline: {formattedDate}</span>
                    </div>
                    <button
                      onClick={() => console.log(`Viewing details for bounty: ${bounty.title}`)}
                      className="w-full bg-[#0B1C47] text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    >
                      Take it
                    </button>
                  </div>
                </div>
              );
            })}
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
