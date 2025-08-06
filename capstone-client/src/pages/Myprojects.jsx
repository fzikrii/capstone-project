import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import axios from 'axios'; // Import axios for API calls

const API_BASE_URL = 'http://localhost:5000/project'; // Your backend URL

// --- Helper: Ikon SVG (Nama diubah untuk menghindari konflik) ---
const SvgIcon = ({ name, className }) => {
    const icons = {
        plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
        arrowLeft: <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />,
        close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />,
    };
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
            {icons[name]}
        </svg>
    );
};

// --- Helper: Mendapatkan Warna Progress ---
const getProgressColor = (progress) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 67) return 'bg-sky-500';
    if (progress >= 34) return 'bg-amber-500';
    return 'bg-rose-500';
};

// --- Komponen Modal yang Dapat Digunakan Kembali ---
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-11/12 max-w-md relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <SvgIcon name="close" className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">{title}</h2>
                {children}
            </div>
        </div>
    );
};

// --- Data Awal Proyek ---
// const initialProjects = [
//     {
//         id: 1,
//         title: 'Website Redesign',
//         description: 'Complete overhaul of the main company website.',
//         startDate: '2025-08-01',
//         endDate: '2025-09-30',
//         team: ['https://placehold.co/40x40/a7f3d0/14532d?text=EA', 'https://placehold.co/40x40/fecaca/991b1b?text=FZ', 'https://placehold.co/40x40/bae6fd/0c4a6e?text=ER'],
//         tasks: {
//             ToDo: [{ id: 't1-1', title: 'Plan new sitemap', endDate: '2025-08-20' }],
//             Ongoing: [{ id: 't1-2', title: 'Develop homepage prototype', endDate: '2025-09-01' }],
//             Done: [{ id: 't1-3', title: 'Gather user feedback', endDate: '2025-08-15' }],
//             Stuck: [],
//         }
//     },
//     {
//         id: 2,
//         title: 'Mobile App Launch',
//         description: 'Develop and launch the new iOS and Android app.',
//         startDate: '2025-07-15',
//         endDate: '2025-08-30',
//         team: ['https://placehold.co/40x40/a7f3d0/14532d?text=FZ', 'https://placehold.co/40x40/c7d2fe/3730a3?text=ER'],
//         tasks: {
//             ToDo: [],
//             Ongoing: [{ id: 't2-1', title: 'Finalize App Store assets', endDate: '2025-08-10' }],
//             Done: [{ id: 't2-2', title: 'Beta testing phase 1', endDate: '2025-07-30' }, { id: 't2-3', title: 'Setup server environment', endDate: '2025-07-20' }],
//             Stuck: [],
//         }
//     },
// ];

// --- A new helper to generate avatar URLs from usernames ---
const getAvatarUrl = (username) => {
    const initial = username ? username.charAt(0).toUpperCase() : '?';
    // Using a service like placehold.co for simple, colored initial avatars
    const colors = ['a7f3d0/14532d', 'fecaca/991b1b', 'bae6fd/0c4a6e', 'c7d2fe/3730a3', 'fef08a/854d0e'];
    const color = colors[initial.charCodeAt(0) % colors.length];
    return `https://placehold.co/40x40/${color}?text=${initial}`;
};

// --- Komponen untuk Kartu Kanban ---
const TaskKanbanCard = ({ task, onDragStart }) => (
    <div
        draggable
        onDragStart={(e) => onDragStart(e, task._id)} // Use task._id from MongoDB
        className="bg-white p-3.5 rounded-lg shadow-sm border border-slate-200 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md hover:border-sky-300 transition-all animate-fade-in"
    >
        <h4 className="font-semibold text-slate-800 mb-2">{task.title}</h4>
        <div className="flex justify-between items-center text-sm text-slate-500">
            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span> {/* Use task.deadline */}
        </div>
    </div>
);

// --- Komponen untuk Kolom Kanban ---
const BoardColumn = ({ title, tasks = [], color, status, onDrop, onDragOver }) => (
    <div
        onDrop={(e) => onDrop(e, status)}
        onDragOver={onDragOver}
        className="bg-slate-100/80 rounded-xl p-3 w-full sm:w-80 flex-shrink-0 flex flex-col"
    >
        <h3 className={`font-bold text-lg mb-4 px-2 text-${color}-600 flex items-center gap-2`}>
            <span className={`w-3 h-3 rounded-full bg-${color}-500`}></span>
            {title}
            <span className="text-sm text-slate-400 font-medium">{tasks.length}</span>
        </h3>
        <div className="h-full overflow-y-auto pr-1">
            {tasks.length > 0 ? (
                tasks.map(task => <TaskKanbanCard key={task._id} task={task} onDragStart={(e, taskId) => e.dataTransfer.setData("taskId", taskId)} />)
            ) : (
                <div className="flex items-center justify-center h-20 text-sm text-slate-400">No tasks yet.</div>
            )}
        </div>
    </div>
);

// --- Komponen untuk Papan Tugas (Tampilan Kanban) ---
const ProjectTaskboard = ({ project, onBack, onTasksUpdated }) => {
    const [tasks, setTasks] = useState(project.tasks || []);
    const [isTaskModalOpen, setTaskModalOpen] = useState(false);

    useEffect(() => {
        setTasks(project.tasks || []);
    }, [project]);

    // **BRIDGE**: Transform the flat 'tasks' array from the backend into the grouped object the UI needs.
    const groupedTasks = useMemo(() => {
        const initialGroups = { ToDo: [], Ongoing: [], Done: [], Stuck: [] };
        return tasks.reduce((groups, task) => {
            const status = task.status || 'ToDo'; // Default to 'ToDo' if status is missing
            if (groups[status]) {
                groups[status].push(task);
            }
            return groups;
        }, initialGroups);
    }, [tasks]);


    const handleDrop = async (e, targetStatus) => {
        const taskId = e.dataTransfer.getData("taskId");
        const taskToMove = tasks.find(t => t._id === taskId);

        // Only proceed if the task exists and is moving to a new column
        if (taskToMove && taskToMove.status !== targetStatus) {
            try {
                // 1. Tell the backend to update the task
                await axios.put(`${API_BASE_URL}/tasks/${taskId}`,
                    { status: targetStatus },
                    { withCredentials: true }
                );

                // 2. AFTER the backend confirms, refetch the projects to update the UI
                onTasksUpdated();

            } catch (error) {
                console.error("Failed to update task status:", error);
                alert("Error: Could not update the task on the server.");
                // No need to rollback UI, as it was never changed optimistically
            }
        }
    };

    const handleDragOver = (e) => e.preventDefault();

    const handleAddTask = async (title, deadline) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/${project._id}/tasks`,
                { title, deadline },
                { withCredentials: true }
            );
            const newTask = response.data;
            setTasks(currentTasks => [newTask, ...currentTasks]);
            setTaskModalOpen(false);
            onTasksUpdated();
        } catch (error) {
            console.error("Failed to add task:", error);
            alert("Error: Could not add new task.");
        }
    };

    return (
        <>
            <Modal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} title="Add New Task">
                <NewTaskForm onAddTask={handleAddTask} />
            </Modal>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 rounded-md hover:bg-slate-200 flex items-center gap-2 text-slate-600 transition-colors">
                            <SvgIcon name="arrowLeft" className="w-6 h-6" />
                            <span className="hidden sm:inline font-semibold">Back to Projects</span>
                        </button>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800 truncate">{project.title}</h1>
                    </div>
                    <button onClick={() => setTaskModalOpen(true)} className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-transform hover:scale-105 text-sm">
                        <SvgIcon name="plus" className="w-5 h-5" />
                        <span>New Task</span>
                    </button>
                </header>

                <main className="flex-1 flex overflow-x-auto overflow-y-hidden p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row gap-6 h-full w-full">
                        <BoardColumn title="To Do" tasks={groupedTasks.ToDo} color="sky" status="ToDo" onDrop={handleDrop} onDragOver={handleDragOver} />
                        <BoardColumn title="Ongoing" tasks={groupedTasks.Ongoing} color="amber" status="Ongoing" onDrop={handleDrop} onDragOver={handleDragOver} />
                        <BoardColumn title="Done" tasks={groupedTasks.Done} color="emerald" status="Done" onDrop={handleDrop} onDragOver={handleDragOver} />
                        <BoardColumn title="Stuck" tasks={groupedTasks.Stuck} color="rose" status="Stuck" onDrop={handleDrop} onDragOver={handleDragOver} />
                    </div>
                </main>
            </div>
        </>
    );
};

// --- Komponen untuk Kartu Daftar Proyek ---
const ProjectListCard = ({ project, onProjectClick }) => {
    // **BRIDGE**: The logic now works on the flat 'tasks' array from the backend.
    const allTasks = project.tasks || [];
    const doneTasksCount = allTasks.filter(task => task.status === 'Done').length;
    const totalTasksCount = allTasks.length;
    const progress = totalTasksCount > 0 ? Math.round((doneTasksCount / totalTasksCount) * 100) : 0;
    const progressColorClass = getProgressColor(progress);

    return (
        <div onClick={() => onProjectClick(project)} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-lg hover:border-sky-400 transition-all cursor-pointer animate-fade-in-up">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg text-slate-800 mb-1">{project.name}</h3> {/* Use project.name */}
                <div className="flex -space-x-2">
                    {/* Use real member data and generate avatars */}
                    {project.members.map((member) => (
                        <img key={member._id} className="w-8 h-8 rounded-full border-2 border-white object-cover" src={getAvatarUrl(member.username)} alt={member.username} title={member.username} />
                    ))}
                </div>
            </div>
            <p className="text-slate-500 text-sm mb-4 h-10">{project.description}</p>
            <div className="flex items-center gap-3">
                <div className="w-full bg-slate-200 rounded-full h-2.5"><div className={`${progressColorClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div></div>
                <span className="font-semibold text-sm text-slate-600">{progress}%</span>
            </div>
        </div>
    );
};

// --- Komponen untuk Daftar Proyek ---
const ProjectList = ({ projects, onProjectClick, onAddProject }) => {
    const [isProjectModalOpen, setProjectModalOpen] = useState(false);

    return (
        <>
            <Modal isOpen={isProjectModalOpen} onClose={() => setProjectModalOpen(false)} title="Create New Project">
                <NewProjectForm onAddProject={(...args) => {
                    onAddProject(...args);
                    setProjectModalOpen(false);
                }} />
            </Modal>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header
                    className="sticky top-0 z-20 min-h-[65px] flex items-center justify-between px-4 border-b border-slate-200"
                    style={{ backgroundColor: "#0B1C47" }}
                >
                    <h1 className="text-2xl font-bold text-white">My Projects</h1>
                    <button onClick={() => setProjectModalOpen(true)} className="flex items-center gap-2 bg-sky-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition-transform hover:scale-105 text-sm">
                        <SvgIcon name="plus" className="w-5 h-5" />
                        <span>New Project</span>
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {projects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map(project => (
                                <ProjectListCard
                                    key={project._id} // Add this unique key prop
                                    project={project}
                                    onProjectClick={onProjectClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <h3 className="text-xl font-semibold text-slate-600">No Projects Yet</h3>
                            <p className="text-slate-400 mt-2">Click "New Project" to get started.</p>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

// --- Form untuk Proyek Baru ---
const NewProjectForm = ({ onAddProject }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 30 days from now

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddProject(title, description, startDate, endDate);
        setTitle('');
        setDescription('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="project-title" className="block text-sm font-medium text-slate-700 mb-1">Project Title</label>
                <input type="text" id="project-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., Launch new marketing campaign" required />
            </div>
            <div className="mb-4">
                <label htmlFor="project-description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea id="project-description" value={description} onChange={e => setDescription(e.target.value)} rows="3" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="A brief description of the project."></textarea>
            </div>
            <div className="flex gap-4 mb-6">
                <div className="w-1/2">
                    <label htmlFor="start-date" className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                    <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div className="w-1/2">
                    <label htmlFor="end-date" className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                    <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
            </div>
            <button type="submit" className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition-colors">Create Project</button>
        </form>
    );
};

// --- Form untuk Tugas Baru ---
const NewTaskForm = ({ onAddTask }) => {
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]); // 7 days from now

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;
        onAddTask(title, endDate);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="task-title" className="block text-sm font-medium text-slate-700 mb-1">Task Title</label>
                <input type="text" id="task-title" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="e.g., Draft initial design mockups" required />
            </div>
            <div className="mb-6">
                <label htmlFor="task-end-date" className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input type="date" id="task-end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <button type="submit" className="w-full bg-sky-500 text-white py-2.5 rounded-lg font-semibold hover:bg-sky-600 transition-colors">Add Task</button>
        </form>
    );
};


// --- Komponen Aplikasi Utama ---
const App = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch all projects
    const fetchProjects = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(API_BASE_URL, { withCredentials: true });
            setProjects(response.data);
            setError(null);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
            setError("Could not load projects. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch projects when the component mounts
    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        // If a project is currently selected...
        if (selectedProject) {
            // ...find its latest version in the newly fetched projects array.
            const updatedSelectedProject = projects.find(p => p._id === selectedProject._id);
            
            if (updatedSelectedProject) {
                // ...and update the selectedProject state with this fresh data.
                setSelectedProject(updatedSelectedProject);
            } else {
                // If the project is no longer in the list (e.g., deleted), clear the selection.
                setSelectedProject(null);
            }
        }
    }, [projects]); 
    
    const handleProjectClick = (project) => setSelectedProject(project);
    const handleBackToList = () => setSelectedProject(null);

    const handleAddProject = async (name, description) => {
        try {
            const response = await axios.post(API_BASE_URL,
                { name, description },
                { withCredentials: true }
            );
            // Add the new project returned from the API to the top of the list
            setProjects(prevProjects => [response.data, ...prevProjects]);
        } catch (error) {
            console.error("Failed to create project:", error);
            alert("Error: Could not create the project.");
        }
    };

    // This function will be called from the taskboard to refetch data
    const handleTasksUpdated = () => {
        fetchProjects(); // Refetch all data to ensure progress bars are accurate
        // A more optimized approach would be to just refetch the selected project
    };

    // --- Loading and Error State UI ---
    if (isLoading) {
        return <div className="flex h-screen w-full justify-center items-center">Loading Projects...</div>;
    }
    if (error) {
        return <div className="flex h-screen w-full justify-center items-center text-rose-500">{error}</div>;
    }

    return (
        <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                {selectedProject ? (
                    <ProjectTaskboard
                        project={selectedProject}
                        onBack={handleBackToList}
                        onTasksUpdated={handleTasksUpdated}
                    />
                ) : (
                    <ProjectList
                        projects={projects}
                        onProjectClick={handleProjectClick}
                        onAddProject={handleAddProject}
                    />
                )}
            </div>
        </div>
    );
};

export default App;