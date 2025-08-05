import React, { useState, useMemo } from "react";
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

const allTasks = [
    { id: 1, title: 'Design landing page mockups', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'High', dueDate: '2025-08-05', assignees: ['https://placehold.co/40x40/a7f3d0/14532d?text=FZ'] },
    { id: 2, title: 'Setup user authentication flow', project: 'Mobile App', projectColor: 'bg-purple-100 text-purple-700', priority: 'High', dueDate: '2025-08-08', assignees: ['https://placehold.co/40x40/c7d2fe/3730a3?text=EA'] },
    { id: 3, title: 'Develop homepage component', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Medium', dueDate: '2025-08-03', assignees: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=ER'] },
    { id: 4, title: 'Finalize color palette', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Low', dueDate: '2025-07-28', assignees: ['https://placehold.co/40x40/fecaca/991b1b?text=JE'] },
    { id: 5, title: 'API key for payment gateway is not working', project: 'API Integration', projectColor: 'bg-green-100 text-green-700', priority: 'High', dueDate: '2025-08-01', assignees: ['https://placehold.co/40x40/fed7aa/9a3412?text=FZ'] },
    { id: 6, title: 'Write documentation for API endpoints', project: 'API Integration', projectColor: 'bg-green-100 text-green-700', priority: 'Medium', dueDate: '2025-08-12', assignees: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=EA', 'https://placehold.co/40x40/fed7aa/9a3412?text=ER'] },
    { id: 7, title: 'Create social media assets', project: 'Q3 Marketing', projectColor: 'bg-orange-100 text-orange-700', priority: 'Low', dueDate: '2025-08-01', assignees: ['https://placehold.co/40x40/fecaca/991b1b?text=ER'] },
];

const TaskRow = ({ task }) => {
    const priorityClasses = {
        High: 'bg-rose-100 text-rose-700',
        Medium: 'bg-amber-100 text-amber-700',
        Low: 'bg-emerald-100 text-emerald-700',
    };
    return (
        <tr className="bg-white hover:bg-slate-50">
            <td className="p-4 font-medium text-slate-800">{task.title}</td>
            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.projectColor}`}>{task.project}</span></td>
            <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${priorityClasses[task.priority]}`}>{task.priority}</span></td>
            <td className="p-4 text-slate-600">{task.dueDate}</td>
            <td className="p-4">
                <div className="flex -space-x-2">
                    {task.assignees.map((avatar, index) => (
                        <img key={index} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={avatar} alt={`Assignee ${index + 1}`} />
                    ))}
                </div>
            </td>
        </tr>
    );
};

const BountyBoard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'ascending' });

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const sortedAndFilteredTasks = useMemo(() => {
        let sortableTasks = [...allTasks];
        
        sortableTasks = sortableTasks.filter(task => 
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.project.toLowerCase().includes(searchTerm.toLowerCase())
        );

        sortableTasks.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });

        return sortableTasks;
    }, [searchTerm, sortConfig]);
    
    const today = new Date('2025-08-01T00:00:00'); // Hardcoded for demonstration
    const todayStr = today.toISOString().split('T')[0];
    const tasksDueToday = sortedAndFilteredTasks.filter(task => task.dueDate === todayStr);
    const upcomingTasks = sortedAndFilteredTasks.filter(task => task.dueDate > todayStr);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={toggleSidebar} className="lg:hidden p-2 rounded-md hover:bg-slate-200"><Icon name="menu" className="w-6 h-6" /></button>
                        <h1 className="text-2xl font-bold text-slate-800">Task Board</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full max-w-xs px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                        <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors text-sm">
                            <Icon name="plus" className="w-5 h-5" />
                            <span>New Task</span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {/* Tasks Due Today */}
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Due Today ({tasksDueToday.length})</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                           <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-4">Task</th>
                                        <th className="p-4">Project</th>
                                        <th className="p-4">Priority</th>
                                        <th className="p-4">Due Date</th>
                                        <th className="p-4">Assignees</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasksDueToday.length > 0 ? tasksDueToday.map(task => <TaskRow key={task.id} task={task} />) : <tr><td colSpan="5" className="text-center p-8 text-slate-500">No tasks due today! 🎉</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upcoming Tasks */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming ({upcomingTasks.length})</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                           <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-600">
                                    <tr>
                                        <th className="p-4">Task</th>
                                        <th className="p-4">Project</th>
                                        <th className="p-4">Priority</th>
                                        <th className="p-4">Due Date</th>
                                        <th className="p-4">Assignees</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcomingTasks.length > 0 ? upcomingTasks.map(task => <TaskRow key={task.id} task={task} />) : <tr><td colSpan="5" className="text-center p-8 text-slate-500">No upcoming tasks.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
        </div>
    );
};

export default BountyBoard;
