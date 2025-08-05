import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

const initialTasks = {
    ToDo: [
        { id: 1, title: 'Design landing page mockups', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'High', dueDate: '2025-08-05', assignees: ['https://placehold.co/40x40/a7f3d0/14532d?text=AS'] },
        { id: 2, title: 'Setup user authentication flow', project: 'Mobile App', projectColor: 'bg-purple-100 text-purple-700', priority: 'High', dueDate: '2025-08-08', assignees: ['https://placehold.co/40x40/c7d2fe/3730a3?text=DM'] },
    ],
    Ongoing: [
        { id: 3, title: 'Develop homepage component', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Medium', dueDate: '2025-08-03', assignees: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=CJ'] },
    ],
    Done: [
        { id: 4, title: 'Finalize color palette', project: 'Website Redesign', projectColor: 'bg-blue-100 text-blue-700', priority: 'Low', dueDate: '2025-07-28', assignees: ['https://placehold.co/40x40/fecaca/991b1b?text=BD'] },
        { id: 6, title: 'Write documentation for API endpoints', project: 'API Integration', projectColor: 'bg-green-100 text-green-700', priority: 'Medium', dueDate: '2025-08-12', assignees: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=CJ', 'https://placehold.co/40x40/fed7aa/9a3412?text=EK'] },
    ],
    Stuck: [
        { id: 5, title: 'API key for payment gateway is not working', project: 'API Integration', projectColor: 'bg-green-100 text-green-700', priority: 'High', dueDate: '2025-08-01', assignees: ['https://placehold.co/40x40/fed7aa/9a3412?text=EK'] },
        { id: 7, title: 'Create social media assets', project: 'Q3 Marketing', projectColor: 'bg-orange-100 text-orange-700', priority: 'Low', dueDate: '2025-08-01', assignees: ['https://placehold.co/40x40/fecaca/991b1b?text=BD'] },
    ]
};

const TaskCard = ({ task, onDragStart }) => {
    const priorityClasses = {
        High: 'bg-rose-500',
        Medium: 'bg-amber-500',
        Low: 'bg-emerald-500',
    };
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, task.id)}
            className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing"
        >
            <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${task.projectColor}`}>{task.project}</span>
                <span className={`w-3 h-3 rounded-full ${priorityClasses[task.priority]}`} title={`Priority: ${task.priority}`}></span>
            </div>
            <p className="font-semibold text-slate-800 mb-3">{task.title}</p>
            <div className="flex justify-between items-center text-sm text-slate-500">
                <span>Due: {task.dueDate}</span>
                <div className="flex -space-x-2">
                    {task.assignees.map((avatar, index) => (
                        <img key={index} className="w-6 h-6 rounded-full border-2 border-white object-cover" src={avatar} alt={`assignee ${index + 1}`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TaskBoardColumn = ({ title, tasks, color, onDrop, onDragOver }) => (
    <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        className="bg-slate-100 rounded-xl p-3 w-80 flex-shrink-0"
    >
        <h3 className={`font-bold text-lg mb-4 px-2 text-${color}-600 flex items-center gap-2`}>
            <span className={`w-3 h-3 rounded-full bg-${color}-500`}></span>
            {title}
            <span className="text-sm text-slate-400 font-medium">{tasks.length}</span>
        </h3>
        <div className="h-full overflow-y-auto pr-1">
            {tasks.map(task => <TaskCard key={task.id} task={task} onDragStart={(e, taskId) => e.dataTransfer.setData("taskId", taskId)} />)}
        </div>
    </div>
);

const BountyBoard = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [tasks, setTasks] = useState(initialTasks);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const handleDrop = (e, targetStatus) => {
        const taskId = parseInt(e.dataTransfer.getData("taskId"));
        
        let sourceStatus;
        let draggedTask;

        // Find the task and its original column
        for (const status in tasks) {
            const task = tasks[status].find(t => t.id === taskId);
            if (task) {
                sourceStatus = status;
                draggedTask = task;
                break;
            }
        }

        if (draggedTask && sourceStatus !== targetStatus) {
            setTasks(prevTasks => {
                // Remove from source column
                const newSourceTasks = prevTasks[sourceStatus].filter(t => t.id !== taskId);
                // Add to target column
                const newTargetTasks = [...prevTasks[targetStatus], draggedTask];
                
                return {
                    ...prevTasks,
                    [sourceStatus]: newSourceTasks,
                    [targetStatus]: newTargetTasks
                };
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const filteredTasks = useMemo(() => {
        if (!searchTerm) return tasks;
        const lowercasedFilter = searchTerm.toLowerCase();
        const filtered = {};
        for (const status in tasks) {
            filtered[status] = tasks[status].filter(task =>
                task.title.toLowerCase().includes(lowercasedFilter) ||
                task.project.toLowerCase().includes(lowercasedFilter)
            );
        }
        return filtered;
    }, [tasks, searchTerm]);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
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
                <main className="flex-1 flex overflow-x-auto overflow-y-hidden p-4 sm:p-6 lg:p-8">
                    <div className="flex gap-6 h-full">
                        <TaskBoardColumn title="To Do" tasks={filteredTasks.ToDo} color="sky" onDrop={(e) => handleDrop(e, 'ToDo')} onDragOver={handleDragOver} />
                        <TaskBoardColumn title="Ongoing" tasks={filteredTasks.Ongoing} color="amber" onDrop={(e) => handleDrop(e, 'Ongoing')} onDragOver={handleDragOver} />
                        <TaskBoardColumn title="Done" tasks={filteredTasks.Done} color="emerald" onDrop={(e) => handleDrop(e, 'Done')} onDragOver={handleDragOver} />
                        <TaskBoardColumn title="Stuck" tasks={filteredTasks.Stuck} color="rose" onDrop={(e) => handleDrop(e, 'Stuck')} onDragOver={handleDragOver} />
                    </div>
                </main>
            </div>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"></div>}
        </div>
    );
};

export default BountyBoard;
