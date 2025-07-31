// src/components/SidebarItem.jsx
import React from "react";
import { Link } from "react-router-dom";

const SidebarItem = ({ label, to, isActive, onClick }) => {
  return (
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
};

export default SidebarItem;
