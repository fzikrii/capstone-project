import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const HowToUse = () => {
  const [activeItem, setActiveItem] = useState("How To Use");

  return (
    <div className="min-h-screen flex bg-sky-100">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Content */}
      <div className="flex-1 px-8 py-10">
        <h1 className="text-3xl font-bold text-[#0B1C47] mb-6">How To Use</h1>
        
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <section>
            <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">📌 Navigating the Dashboard</h2>
            <p className="text-gray-700">
              Use the sidebar to access different sections: Schedule, Bounty Board, Inbox, etc.
              The active page will be highlighted.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">🗓️ Schedule Your Tasks</h2>
            <p className="text-gray-700">
              Go to the "Schedule" page to view monthly tasks. Click "Next" or "Prev" to navigate months.
              Hovering over a day shows assigned tasks.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">💬 Inbox & Collaboration</h2>
            <p className="text-gray-700">
              Open the "Inbox" to send and receive messages with teammates in real-time.
              Make sure you're connected to the internet.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">🏆 Earn Bounties</h2>
            <p className="text-gray-700">
              Complete tasks listed on the "Bounty Board" to earn points and unlock badges.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[#0B1C47] mb-2">🔐 Secure Your Profile</h2>
            <p className="text-gray-700">
              Update your profile and settings from the sidebar. Your data is safely stored.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default HowToUse;
