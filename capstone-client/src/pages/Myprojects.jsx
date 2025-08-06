import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Icon from '../components/Icon';

// --- Data Awal Proyek ---
// Data ini sekarang digunakan untuk papan tugas di dalam setiap proyek.
// Untuk demonstrasi, saya akan membuat data tugas yang berbeda untuk setiap proyek.
const initialProjects = [
    {
        id: 1,
        title: 'Website Redesign',
        description: 'Complete overhaul of the main company website.',
        team: ['https://placehold.co/40x40/a7f3d0/14532d?text=EA', 'https://placehold.co/40x40/fecaca/991b1b?text=FZ', 'https://placehold.co/40x40/bae6fd/0c4a6e?text=ER'],
        tasks: {
            ToDo: [{ id: 't1-1', title: 'Plan new sitemap', endDate: '2025-08-20' }],
            Ongoing: [{ id: 't1-2', title: 'Develop homepage prototype', endDate: '2025-09-01' }],
            Done: [{ id: 't1-3', title: 'Gather user feedback', endDate: '2025-08-15' }],
            Stuck: [],
        }
    },
    {
        id: 2,
        title: 'Mobile App Launch',
        description: 'Develop and launch the new iOS and Android app.',
        team: ['https://placehold.co/40x40/a7f3d0/14532d?text=FZ', 'https://placehold.co/40x40/c7d2fe/3730a3?text=ER'],
        tasks: {
            ToDo: [],
            Ongoing: [{ id: 't2-1', title: 'Finalize App Store assets', endDate: '2025-08-10' }],
            Done: [{ id: 't2-2', title: 'Beta testing phase 1', endDate: '2025-07-30' }, { id: 't2-3', title: 'Setup server environment', endDate: '2025-07-20' }],
            Stuck: [],
        }
    },
    {
        id: 3,
        title: 'Q3 Marketing Campaign',
        description: 'Plan and execute the marketing campaign for Q3.',
        team: ['https://placehold.co/40x40/fecaca/991b1b?text=FZ', 'https://placehold.co/40x40/fed7aa/9a3412?text=ER'],
        tasks: {
            ToDo: [{ id: 't3-1', title: 'Define target audience', endDate: '2025-08-12' }, { id: 't3-2', title: 'Create ad copy', endDate: '2025-08-18' }],
            Ongoing: [],
            Done: [],
            Stuck: [],
        }
    },
     {
        id: 4,
        title: 'API Integration',
        description: 'Integrate third-party payment API.',
        team: ['https://placehold.co/40x40/bae6fd/0c4a6e?text=EA', 'https://placehold.co/40x40/c7d2fe/3730a3?text=ER', 'https://placehold.co/40x40/fed7aa/9a3412?text=FZ'],
        tasks: {
            ToDo: [],
            Ongoing: [],
            Done: [{ id: 't4-1', title: 'Get API Keys', endDate: '2025-07-22' }],
            Stuck: [{ id: 't4-2', title: 'CORS policy issue', endDate: '2025-08-01' }],
        }
    },
];

// --- Komponen untuk Kartu Kanban ---
const TaskKanbanCard = ({ task, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, task.id)}
        className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing"
    >
        <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
        <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Due: {task.endDate}</span>
        </div>
    </div>
);

// --- Komponen untuk Kolom Kanban ---
const BoardColumn = ({ title, tasks, color, status, onDrop, onDragOver }) => (
    <div
        onDrop={(e) => onDrop(e, status)}
        onDragOver={onDragOver}
        className="bg-slate-100 rounded-xl p-3 w-full sm:w-80 flex-shrink-0"
    >
        <h3 className={`font-bold text-lg mb-4 px-2 text-${color}-600 flex items-center gap-2`}>
            <span className={`w-3 h-3 rounded-full bg-${color}-500`}></span>
            {title}
            <span className="text-sm text-slate-400 font-medium">{tasks.length}</span>
        </h3>
        <div className="h-full overflow-y-auto pr-1">
            {tasks.map(task => <TaskKanbanCard key={task.id} task={task} onDragStart={(e, taskId) => e.dataTransfer.setData("taskId", taskId)} />)}
        </div>
    </div>
);

// --- Komponen untuk Papan Tugas (Tampilan Kanban) ---
const ProjectTaskboard = ({ project, onBack, onUpdateTasks }) => {
    const [tasks, setTasks] = useState(project.tasks);

    const handleDrop = (e, targetStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        
        let sourceStatus;
        let draggedTask;

        // Temukan tugas dan kolom sumbernya
        for (const status in tasks) {
            const task = tasks[status].find(t => t.id === taskId);
            if (task) {
                sourceStatus = status;
                draggedTask = task;
                break;
            }
        }

        if (draggedTask && sourceStatus !== targetStatus) {
            const newTasks = { ...tasks };
            // Hapus dari kolom sumber
            newTasks[sourceStatus] = newTasks[sourceStatus].filter(t => t.id !== taskId);
            // Tambahkan ke kolom target
            newTasks[targetStatus] = [...newTasks[targetStatus], draggedTask];
            
            setTasks(newTasks);
            onUpdateTasks(project.id, newTasks); // Perbarui state di komponen induk
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Diperlukan agar drop berfungsi
    };

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-md hover:bg-slate-200 flex items-center gap-2 text-slate-600">
                        <Icon name="arrowLeft" className="w-6 h-6" />
                        <span className="hidden sm:inline font-semibold">Back to Projects</span>
                    </button>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{project.title}</h1>
                </div>
                <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors text-sm">
                    <Icon name="plus" className="w-5 h-5" />
                    <span>New Task</span>
                </button>
            </header>
            
            <main className="flex-1 flex overflow-x-auto overflow-y-hidden p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row gap-6 h-full w-full">
                    <BoardColumn title="To Do" tasks={tasks.ToDo} color="sky" status="ToDo" onDrop={handleDrop} onDragOver={handleDragOver} />
                    <BoardColumn title="Ongoing" tasks={tasks.Ongoing} color="amber" status="Ongoing" onDrop={handleDrop} onDragOver={handleDragOver} />
                    <BoardColumn title="Done" tasks={tasks.Done} color="emerald" status="Done" onDrop={handleDrop} onDragOver={handleDragOver} />
                    <BoardColumn title="Stuck" tasks={tasks.Stuck} color="rose" status="Stuck" onDrop={handleDrop} onDragOver={handleDragOver} />
                </div>
            </main>
        </div>
    );
};

// --- Komponen untuk Kartu Daftar Proyek ---
const ProjectListCard = ({ project, onProjectClick }) => {
    // Hitung total tugas dan tugas yang selesai
    const allTasks = useMemo(() => Object.values(project.tasks).flat(), [project.tasks]);
    const doneTasksCount = useMemo(() => project.tasks.Done?.length || 0, [project.tasks.Done]);
    const totalTasksCount = useMemo(() => allTasks.length, [allTasks]);
    const progress = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0;

    return (
        <div onClick={() => onProjectClick(project)} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-sky-300 transition-all cursor-pointer">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{project.title}</h3>
                <div className="flex -space-x-2">
                    {project.team.map((avatar, index) => (
                        <img key={index} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={avatar} alt={`Team member ${index + 1}`} />
                    ))}
                </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">{project.description}</p>
            <div className="flex items-center gap-3">
                <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
                <span className="font-semibold text-sm text-slate-600">{progress}%</span>
            </div>
        </div>
    );
};

// --- Komponen untuk Daftar Proyek ---
const ProjectList = ({ projects, onProjectClick }) => (
    <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-800">My Projects</h1>
            <button className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-colors text-sm">
                <Icon name="plus" className="w-5 h-5" />
                <span>New Project</span>
            </button>
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectListCard key={project.id} project={project} onProjectClick={onProjectClick} />
                ))}
            </div>
        </main>
    </div>
);


// --- Komponen Aplikasi Utama ---
const App = () => {
    const [projects, setProjects] = useState(initialProjects);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    const handleBackToList = () => {
        setSelectedProject(null);
    };
    
    // Fungsi untuk memperbarui tugas dari papan kanban
    const handleUpdateTasks = (projectId, updatedTasks) => {
        setProjects(currentProjects => 
            currentProjects.map(p => 
                p.id === projectId ? { ...p, tasks: updatedTasks } : p
            )
        );
    };

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                {selectedProject ? (
                    <ProjectTaskboard 
                        project={selectedProject} 
                        onBack={handleBackToList}
                        onUpdateTasks={handleUpdateTasks}
                    />
                ) : (
                    <ProjectList 
                        projects={projects} 
                        onProjectClick={handleProjectClick} 
                    />
                )}
            </div>
        </div>
    );
};

export default App;