import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Icon from "./Icon";

const Sidebar = ({ isOpen }) => {
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // const token = localStorage.getItem("token");
        // if (!token) {
        //   console.log("No token found in localStorage");
        //   navigate("/login");
        //   return;
        // }

        console.log("Fetching user data with token...");
        const response = await fetch("http://localhost:5000/auth/me", {
          method: "GET",
          headers: {
            // Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!response.ok) {
          console.error(
            "Authentication failed, server responded with:",
            response.status
          );
          navigate("/login"); // Redirect if the server says we're not logged in
          return;
        }

        const data = await response.json();
        console.log("User data fetched successfully:", data);
        setUserData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message);
        setUserData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const navLinks = [
    { name: "Dashboard", icon: "layout", path: "/dashboard" },
    { name: "My Projects", icon: "briefcase", path: "/Myprojects" },
    { name: "Bounty Board", icon: "award", path: "/bountyboard" },
    { name: "Schedule", icon: "calendar", path: "/schedule" },
    { name: "FAQ", icon: "help-circle", path: "/howtouse" },
  ];

  return (
    <aside
      className={`absolute lg:relative z-20 w-64 h-full border-r border-slate-700 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      style={{ backgroundColor: "#0B1C47" }}
    >
      <div className="flex flex-col h-full">
        {/* === BLOK YANG DIUBAH === */}
        <div className="p-4 border-b border-slate-700">
          <Link
            to="/dashboard"
            className="flex items-center justify-center py-1"
          >
            <img src="/logo.png" alt="Eagle Eye Logo" className="h-6" />
          </Link>
        </div>
        {/* === AKHIR BLOK YANG DIUBAH === */}

        <div className="p-4 relative" ref={profileRef}>
          <div
            onClick={() => setProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100/10 cursor-pointer transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center">
              {userData?.username
                ? userData.username.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-4 w-24 bg-slate-200 rounded"></div>
                  <div className="h-3 w-20 bg-slate-200 rounded mt-1"></div>
                </div>
              ) : error ? (
                <p className="text-sm text-red-300">Error loading profile</p>
              ) : (
                <>
                  <p className="font-semibold text-sm text-white">
                    {userData?.username || "Guest"}
                  </p>
                  <p className="text-xs text-white/80">
                    {userData?.email || "Not logged in"}
                  </p>
                </>
              )}
            </div>
            <Icon
              name="chevron-down"
              className="w-4 h-4 ml-auto text-white/70"
            />
          </div>
          {isProfileOpen && (
            <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-30 animate-fade-in-down">
              <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100"
              >
                <Icon name="user" className="w-4 h-4" />
                View Profile
              </Link>
              <hr className="my-1 border-slate-200" />
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      console.log("No token found during logout");
                    }

                    const response = await fetch(
                      "http://localhost:5000/auth/logout",
                      {
                        method: "POST",
                        credentials: "include",
                        headers: {
                          //   Authorization: `Bearer ${token}`,
                          "Content-Type": "application/json",
                        },
                      }
                    );

                    if (!response.ok) {
                      const data = await response.json().catch(() => ({}));
                      console.error("Logout failed:", {
                        status: response.status,
                        data: data,
                      });
                    }

                    // Clear local storage and show message before redirect
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    setError("Logging out...");

                    // Delay redirect slightly to show the message
                    setTimeout(() => {
                      navigate("/login");
                    }, 500);
                  } catch (err) {
                    console.error("Logout error:", {
                      error: err,
                      message: err.message,
                      stack: err.stack,
                    });
                    setError("Error during logout");
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
              >
                <Icon name="log-out" className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-white transition-colors
                                    ${isActive ? "font-bold" : ""}
                                    ${
                                      isActive
                                        ? "bg-[#173A7A]"
                                        : "hover:bg-slate-100/10"
                                    }`}
              >
                <Icon name={link.icon} className="w-5 h-5 text-white" />
                <span>{link.name}</span>
                {link.notification && (
                  <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {link.notification}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
