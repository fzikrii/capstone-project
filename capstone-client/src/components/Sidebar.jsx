import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon';

const Sidebar = ({ isOpen }) => {
    const [isProfileOpen, setProfileOpen] = useState(false);
    const profileRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const navLinks = [
        { name: 'Dashboard', icon: 'layout', path: '/dashboard' },
        { name: 'My Projects', icon: 'briefcase', path: '/Myprojects' },
        { name: 'Inbox', icon: 'inbox', path: '/inboxmesseges', notification: 3 },
        { name: 'Bounty Board', icon: 'award', path: '/bountyboard' },
        { name: 'Schedule', icon: 'calendar', path: '/schedule' },
    ];

    return (
        <aside className={`absolute lg:relative z-20 w-64 h-full bg-white border-r border-slate-200 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
            <div className="flex flex-col h-full">
                {/* Logo Header */}
                <div className="p-4 border-b border-slate-200">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <Icon name="logo" />
                        <span className="text-2xl font-bold text-slate-800">Eagle.eye</span>
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="p-4 relative" ref={profileRef}>
                    <div onClick={() => setProfileOpen(!isProfileOpen)} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors">
                        <img src="https://placehold.co/40x40/a7f3d0/14532d?text=JE" alt="User Avatar" className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <p className="font-semibold text-sm text-slate-700">Jonathan Ezra</p>
                            <p className="text-xs text-slate-500">Project Manager</p>
                        </div>
                        <Icon name="chevron-down" className="w-4 h-4 ml-auto text-slate-400" />
                    </div>
                    {isProfileOpen && (
                        <div className="absolute top-full left-4 right-4 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-30 animate-fade-in-down">
                            <Link to="#" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                                <Icon name="user" className="w-4 h-4" />
                                View Profile
                            </Link>
                            <Link to="/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">
                                <Icon name="settings" className="w-4 h-4" />
                                Settings
                            </Link>
                            <hr className="my-1 border-slate-200" />
                            <Link to="/login" className="flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                                <Icon name="log-out" className="w-4 h-4" />
                                Logout
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-1">
                    {navLinks.map(link => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors ${isActive ? 'active' : ''}`}
                            >
                                <Icon name={link.icon} className={`w-5 h-5 ${isActive ? 'text-sky-700' : 'text-slate-500'}`} />
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

                {/* Footer Links */}
                <div className="p-4 border-t border-slate-200">
                    <Link to="/settings" className="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <Icon name="settings" className="w-5 h-5 text-slate-500" />
                        <span>Settings</span>
                    </Link>
                    <Link to="/howtouse" className="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors">
                        <Icon name="help-circle" className="w-5 h-5 text-slate-500" />
                        <span>FAQ</span>
                    </Link>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
