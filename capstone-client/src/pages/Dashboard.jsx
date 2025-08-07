import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/Maincontent';
// import GeminiChatbot from '../components/GeminiChatbot';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [userData, setUserData] = useState(null);
    const [recentProjects, setRecentProjects] = useState([]);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const token = localStorage.getItem("token");
                
                if (!userId || !token) {
                    console.log('No user ID or token found');
                    return;
                }

                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };

                // Fetch user info
                const userResponse = await fetch(`http://localhost:5000/auth/me`, {
                    headers,
                    credentials: 'include'
                });

                if (!userResponse.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const userData = await userResponse.json();
                setUserData(userData);

                // Fetch recent projects
                const projectResponse = await fetch(`http://localhost:5000/project/user/${userId}`, {
                    headers,
                    credentials: 'include'
                });

                if (!projectResponse.ok) {
                    throw new Error('Failed to fetch projects');
                }

                const projectData = await projectResponse.json();
                const recentProjects = Array.isArray(projectData) ? projectData.slice(0, 3) : [];
                setRecentProjects(recentProjects);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="bg-slate-50 text-slate-800 flex h-screen overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            {/* <GeminiChatbot /> */}
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