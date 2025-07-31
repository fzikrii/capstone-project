// src/components/Sidebar.jsx
import React from "react";
import SidebarItem from "./SidebarItem";
import profileImg from "../assets/profile.jpg";

const Sidebar = ({ activeItem, setActiveItem }) => {
  return (
    <aside className="w-64 bg-[#0B1C47] text-white flex flex-col justify-between py-8 px-4 shadow-lg min-h-screen">
      <div>
        <h1 className="text-2xl font-bold mb-8 px-3">CodeName</h1>
        <nav className="space-y-2">
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
          <SidebarItem
            label="Inbox Messeges"
            to="/inboxmesseges"
            isActive={activeItem === "inboxmesseges"}
            onClick={setActiveItem}
          />
          <SidebarItem
            label="Settings"
            to="/settings"
            isActive={activeItem === "settings"}
            onClick={setActiveItem}
          />
        </nav>
      </div>

      <div className="flex items-center space-x-3 mt-6 px-3">
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
  );
};

export default Sidebar;
