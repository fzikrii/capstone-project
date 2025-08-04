import React from 'react';
import Icon from './Icon';
import ProductivityChart from './charts/Productivitychart';
import TaskStatusChart from './charts/Taskstatuschart';

const MainContent = ({ onToggleSidebar }) => {
    const recapCards = [
        { title: 'Tasks Completed', value: '18', icon: 'check-circle', color: 'sky' },
        { title: 'Active Projects', value: '4', icon: 'loader', color: 'amber' },
        { title: 'Missed Deadlines', value: '2', icon: 'alert-triangle', color: 'rose' },
        { title: 'Banners Earned', value: '5', icon: 'award', color: 'emerald' },
    ];

    return (
        <main className="flex-1 h-full overflow-y-auto">
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onToggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200">
                        <Icon name="menu" className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1 text-sm font-semibold text-slate-500 rounded-md hover:bg-white hover:text-sky-600 transition-all">Daily</button>
                    <button className="px-3 py-1 text-sm font-semibold bg-white text-sky-600 shadow-sm rounded-md transition-all">Monthly</button>
                </div>
            </header>

            <div className="p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Recap Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recapCards.map(card => (
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

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold mb-4">Productivity Trends</h3>
                        <div className="h-80"><ProductivityChart /></div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-semibold mb-4">Task Status</h3>
                        <div className="h-80 flex items-center justify-center"><TaskStatusChart /></div>
                    </div>
                </div>

                {/* Achievements Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Achievements & Contributions</h3>
                        <a href="#" className="text-sm font-semibold text-sky-600 hover:underline">View All</a>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-4 rounded-lg flex items-center gap-4">
                            <Icon name="star" className="w-8 h-8" />
                            <div>
                                <p className="font-bold">New Banner Earned: "Collaborator King"!</p>
                                <p className="text-sm opacity-90">You became the most active contributor on the 'Website Redesign' project.</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-sky-400 to-blue-500 text-white p-4 rounded-lg flex items-center gap-4">
                            <Icon name="file-text" className="w-8 h-8" />
                            <div>
                                <p className="font-bold">Certificate Available: "Top Contributor"</p>
                                <p className="text-sm opacity-90">Congratulations! You were the top contributor on the 'Q3 Marketing Campaign' project. <a href="#" className="font-bold underline">Download here</a>.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MainContent;