import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/Maincontent';

const Dashboard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="bg-slate-50 text-slate-800 flex h-screen overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />
            <MainContent onToggleSidebar={toggleSidebar} />
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"></div>}
        </div>
    );
};

export default Dashboard;
