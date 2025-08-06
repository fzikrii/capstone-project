import React, { useState, useEffect } from 'react';
import Icon from './Icon';
import ProductivityChart from './charts/Productivitychart';
import TaskStatusChart from './charts/Taskstatuschart';
import axios from 'axios'; // Using axios for cleaner API calls

// --- A Helper component for loading state ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-sky-500"></div>
    </div>
);

const MainContent = ({ onToggleSidebar }) => {
    // State to hold all dashboard data, loading status, and errors
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch data from the backend. Ensure your backend is running.
                // The '/dashboard' endpoint is protected and will use the auth token cookie automatically.
                const response = await axios.get('http://localhost:5000/dashboard', {
                    withCredentials: true // Important: sends cookies (like the auth token) with the request
                });
                
                setDashboardData(response.data);
                setError('');
            } catch (err) {
                // Handle errors, e.g., token expired, server down
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data.';
                console.error("Dashboard fetch error:", errorMessage);
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []); // Empty dependency array means this runs once when the component mounts

    // --- Conditional Rendering ---
    if (isLoading) {
        return (
            <main className="flex-1 h-full flex items-center justify-center">
                <LoadingSpinner />
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 h-full flex items-center justify-center p-8">
                <div className="bg-rose-100 border border-rose-400 text-rose-700 px-4 py-3 rounded-xl text-center" role="alert">
                    <strong className="font-bold">Oops! Something went wrong.</strong>
                    <span className="block sm:inline ml-2">{error}</span>
                </div>
            </main>
        );
    }
    
    // Render the dashboard if data is successfully fetched
    return (
        <main className="flex-1 h-full overflow-y-auto">
            <header className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10" style={{ backgroundColor: '#0B1C47' }}>
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                        <Icon name="menu" className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                </div>
            </header>

            {dashboardData && (
                <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                    {/* Recap Cards Section - Data from backend */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {dashboardData.recapCards.map(card => (
                            <div key={card.title} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                                <div className={`bg-${card.color}-100 text-${card.color}-600 p-3 rounded-full`}>
                                    <Icon name={card.icon} className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-slate-500 text-sm">{card.title}</p>
                                    <p className="text-2xl font-bold text-slate-800">{card.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Section - Pass data from backend */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-semibold mb-4">Productivity Trends</h3>
                            <div className="h-80">
                                <ProductivityChart data={dashboardData.productivityData} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h3 className="text-lg font-semibold mb-4">Task Status</h3>
                            <div className="h-80 flex items-center justify-center">
                                <TaskStatusChart data={dashboardData.taskStatusData} />
                            </div>
                        </div>
                    </div>

                    {/* Achievements Section - Data from backend */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Achievements & Contributions</h3>
                            <a href="#" className="text-sm font-semibold text-sky-600 hover:underline">View All</a>
                        </div>
                        <div className="space-y-4">
                            {dashboardData.achievements.map((achievement) => (
                                <div key={achievement._id} className={`bg-gradient-to-r ${achievement.gradient} text-white p-4 rounded-lg flex items-center gap-4`}>
                                    <Icon name={achievement.icon} className="w-8 h-8 flex-shrink-0" />
                                    <div>
                                        <p className="font-bold">{achievement.title}</p>
                                        {/* Use dangerouslySetInnerHTML for HTML content from backend, ensure it's sanitized if user-generated */}
                                        <p className="text-sm opacity-90" dangerouslySetInnerHTML={{ __html: achievement.description }}></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default MainContent;