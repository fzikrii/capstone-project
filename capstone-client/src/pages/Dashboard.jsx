import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/Maincontent';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) return;

        // Fetch user info
        fetch(`http://localhost:5000/auth/user/${userId}`)
            .then(res => res.json())
            .then(data => setUserData(data))
            .catch(err => console.error("Failed to fetch user data:", err));

        // Fetch recent projects
        fetch(`http://localhost:5000/project/user/${userId}`)
            .then(res => res.json())
            .then(data => setRecentProjects(data.slice(0, 3))) // Show 3 recent projects
            .catch(err => console.error("Failed to fetch projects:", err));
    }, []);

    return (
        <div className="bg-slate-50 text-slate-800 flex h-screen overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            <MainContent 
                onToggleSidebar={toggleSidebar} 
                userData={userData}
                recentProjects={recentProjects}
            />
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
                ></div>
            )}
        </div>
    );
};

export default Dashboard;