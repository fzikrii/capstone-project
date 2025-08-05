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

// Navbar Component
const Navbar = () => {
  return (
    <nav className="bg-[#0B1C47] text-white px-6 py-4 shadow-md relative z-10">
      <div className="w-full flex justify-between items-center px-6">
        <div className="flex items-center space-x-9">
          <h1 className="text-2xl font-bold">Eagle Eye</h1>
          <p className="hover:text-gray-300 cursor-pointer ml-6">Home</p>
          <Link to="/schedule" className="hover:text-gray-300">
            Schedule
          </Link>
          <p className="hover:text-gray-300 cursor-pointer">Bounty Board</p>
          <p className="hover:text-gray-300 cursor-pointer">How To Use</p>
        </div>

        <ul className="flex items-center space-x-4">
          <li>
            <p className="hover:text-gray-300">Hi, Elmira</p>
          </li>
          <li>
            <div className="p-[2px] bg-white rounded-full">
              <img
                src={profileImg}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
};

// Bounty Card Component
const BountyCard = ({ bounty }) => {
  const handleViewDetails = () => {
    console.log(`Viewing details for bounty: ${bounty.title}`);
  };

  const formattedDate = new Date(bounty.deadline).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col justify-between border border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-blue-800 mb-2">
          {bounty.title}
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {bounty.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4 text-sm">{bounty.description}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
          <span>Deadline: {formattedDate}</span>
          <span className="font-bold text-lg text-green-600">
            ${bounty.reward}
          </span>
        </div>
        <button
          onClick={handleViewDetails}
          className="w-full bg-blue-900 text-white py-2 rounded-lg hover:bg-blue-800 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

// Main Page Component
const BountyBoard = () => {
  const initialBounties = [
    {
      id: 1,
      title: "Build Responsive Landing Page",
      description: "Create a mobile-friendly landing page using React and Tailwind CSS.",
      deadline: "2025-08-10",
      reward: 300,
      tags: ["React", "Tailwind", "Frontend"]
    },
    {
      id: 2,
      title: "REST API for Task Management",
      description: "Design and develop a RESTful API for a task management system.",
      deadline: "2025-08-05",
      reward: 250,
      tags: ["Node.js", "Express", "Backend"]
    },
    {
      id: 3,
      title: "UI Redesign for Dashboard",
      description: "Improve usability and aesthetics of existing dashboard UI.",
      deadline: "2025-08-15",
      reward: 200,
      tags: ["UX", "UI", "Figma"]
    },
    {
      id: 4,
      title: "E-commerce Product Page",
      description: "Develop a product page with dynamic content and user reviews.",
      deadline: "2025-08-20",
      reward: 280,
      tags: ["React", "API", "Design"]
    },
    {
      id: 5,
      title: "Real-time Chat Application",
      description: "Build a real-time chat app using WebSockets and React.",
      deadline: "2025-08-25",
      reward: 350,
      tags: ["Socket.io", "WebSocket", "Realtime"]
    },
    {
      id: 6,
      title: "UI Settings Page",
      description: "Create a settings page for user preferences and configurations.",
      deadline: "2025-08-30",
      reward: 180,
      tags: ["React", "Settings", "Frontend"]
    },
  ];
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: 'dueDate', direction: 'ascending' })

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

  const SidebarItem = ({ label, to, isActive }) => (
    <Link
      to={to}
      onClick={() => setActiveItem(label)}
      className={`block px-3 py-2 rounded-md cursor-pointer transition-colors ${isActive
        ? "bg-[#122b63] border-l-4 border-white text-white font-semibold"
        : "hover:text-gray-300 text-white"
        }`}
    >
      {label}
    </Link>
  );

  return (
    <div className="min-h-screen flex bg-sky-100">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B1C47] text-white flex flex-col justify-between py-8 px-4 shadow-lg">
        <div>
          <h1 className="text-2xl font-bold mb-8 px-3">CodeName</h1>
          <nav className="space-y-2">
            <SidebarItem label="Home" to="/" isActive={activeItem === "Home"} />
            <SidebarItem label="Schedule" to="/schedule" isActive={activeItem === "Schedule"} />
            <SidebarItem label="Bounty Board" to="/bountyboard" isActive={activeItem === "Bounty Board"} />
            <SidebarItem label="How To Use" to="/howtouse" isActive={activeItem === "How To Use"} />
          </nav>
        </div>
        <div className="flex items-center space-x-3 mt-6">
          <div className="p-[2px] bg-white rounded-full">
            <img
              src={profileImg}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <p className="text-sm">Hi, Elmira</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-10 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-[#0B1C47] mb-4">Bounty Board</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover exciting projects, complete tasks, and earn rewards. Begin your coding adventure here!
          </p>
        </div>

        <div className="mb-8 p-4 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center">
          <input
            type="text"
            placeholder="Search bounties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {filteredAndSortedBounties.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAndSortedBounties.map((bounty) => (
              <BountyCard key={bounty.id} bounty={bounty} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-700">No bounties found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your search keyword or filter.</p>
          </div>
        )}
      </main>
    </div>
  );
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